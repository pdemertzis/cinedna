import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import * as Sentry from "@sentry/nextjs";
import { DNA_TYPES, computeDNA, getDNAStrings } from "@/lib/dna";
import {
  searchFilm,
  getFilmById,
  buildCandidatePool,
  getWatchOptionsForCountry,
  getInputFilmSignals,
  getSimilarFilms,
  scoreCandidate,
  weightedRandomPick,
} from "@/lib/tmdb";
import { generateWhy } from "@/lib/hemingway";
import filmDescriptions from "@/lib/film-descriptions.json";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import { saveRecommendation, updateDnaType, addWatchedFilm } from "@/lib/supabase/db";

const POOL_TTL_SECONDS = 21600; // 6 hours

function parseEraToRange(era) {
  switch (era) {
    case "Κλασικές": case "Classic":
      return { yearFrom: 1900, yearTo: 1979 };
    case "Σύγχρονες": case "Modern":
      return { yearFrom: 1980, yearTo: new Date().getFullYear() };
    case "Νέες": case "New":
      return { yearFrom: 2000, yearTo: new Date().getFullYear() };
    default:
      return { yearFrom: undefined, yearTo: undefined };
  }
}

function getPoolCacheKey(dnaKey, yearFrom, yearTo) {
  return `pool:${dnaKey}:${yearFrom || "any"}:${yearTo || "any"}`;
}

// Only the fields the recommend flow actually reads from a pooled film are
// cached — full TMDB film objects would bloat the KV store for no benefit,
// since getFilmById is always called again for the picked film's full detail.
function toMinimalFilm(film) {
  return {
    id: film.id,
    title: film.title,
    year: film.year,
    poster_path: film.poster ? film.poster.replace("https://image.tmdb.org/t/p/w500", "") : null,
  };
}

function fromMinimalFilm(entry) {
  return {
    id: entry.id,
    title: entry.title,
    year: entry.year,
    poster: entry.poster_path ? `https://image.tmdb.org/t/p/w500${entry.poster_path}` : null,
  };
}

async function getOrBuildPool(dnaKey, dna, yearFrom, yearTo, era) {
  const cacheKey = getPoolCacheKey(dnaKey, yearFrom, yearTo);

  try {
    const cached = await kv.get(cacheKey);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached.map(fromMinimalFilm);
    }
  } catch (error) {
    // KV unavailable — fall through to a fresh build instead of failing the request.
    console.error("recommend: kv.get failed, continuing without cache:", error);
    Sentry.captureException(error);
  }

  const pool = await buildCandidatePool(dna.tmdb_genres, yearFrom, yearTo, era);

  try {
    await kv.set(cacheKey, pool.map(toMinimalFilm), { ex: POOL_TTL_SECONDS });
  } catch (error) {
    // Caching is best-effort; the request still succeeds without it.
    console.error("recommend: kv.set failed, continuing without cache:", error);
    Sentry.captureException(error);
  }

  return pool;
}

export async function POST(request) {
  const { success } = await rateLimit(getIdentifier(request), { limit: 60, windowSeconds: 60 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const films = Array.isArray(body?.films) ? body.films : [];
    const mood  = typeof body?.mood === "string" ? body.mood : "";
    const era   = typeof body?.era  === "string" ? body.era  : "";
    const lang  = body?.lang === "en" ? "en" : "el";
    // Country code for watch providers (default based on language)
    const country = typeof body?.country === "string"
      ? body.country.toUpperCase()
      : (lang === "el" ? "GR" : "US");

    const excludeIds = Array.isArray(body?.excludeIds)
      ? body.excludeIds.map((id) => Number(id)).filter(Number.isFinite)
      : [];
    const lockedDnaKey =
      typeof body?.lockedDnaKey === "string" && DNA_TYPES[body.lockedDnaKey]
        ? body.lockedDnaKey
        : null;

    if (films.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one film title." },
        { status: 400 }
      );
    }

    // Identify user's films to get TMDB IDs for exclusion
    const identifiedFilms = [];
    for (const title of films) {
      const match = await searchFilm(title);
      if (match?.id) identifiedFilms.push(match);
    }

    const alreadyGivenIds = new Set([
      ...identifiedFilms.map((f) => f.id),
      ...excludeIds,
    ]);

    // Compute or reuse DNA. When a DNA is locked (reroll), there is no fresh
    // computation, so confidence/secondary fall back to a single-archetype result.
    let dnaKey = lockedDnaKey;
    let dnaSecondary = null;
    let dnaConfidence = 100;
    if (!dnaKey) {
      const dnaResult = await computeDNA(
        identifiedFilms.map((f) => f.title),
        mood,
        era,
      );
      dnaKey = dnaResult.primary.key;
      dnaSecondary = dnaResult.secondary
        ? { key: dnaResult.secondary.key, name_el: dnaResult.secondary.name_el, name_en: dnaResult.secondary.name_en }
        : null;
      dnaConfidence = dnaResult.confidence;
    }

    const dna = DNA_TYPES[dnaKey];
    const { yearFrom, yearTo } = parseEraToRange(era);

    // Get or build the candidate pool (cached in KV after first build)
    const pool = await getOrBuildPool(dnaKey, dna, yearFrom, yearTo, era);

    // Filter out films user has already seen
    const available = pool.filter((f) => !alreadyGivenIds.has(f.id));

    if (available.length === 0) {
      return NextResponse.json(
        { error: "No new recommendation found. You have seen everything!" },
        { status: 404 }
      );
    }

    // Phase 2: Hybrid ranking — blend the DNA pool with director/keyword/decade
    // signals from the input films plus a similarity pool (25% weight), then
    // weighted-random pick from the top scored candidates. Any failure in the
    // new TMDB calls falls back to the original pure-random pick below.
    let picked = null;
    let signals = null;
    let similarityMap = null;
    try {
      const inputFilmIds = identifiedFilms.map((f) => f.id).filter(Boolean);

      // Phase 2: 1. Πάρε signals από τις ταινίες εισόδου
      signals = await getInputFilmSignals(inputFilmIds);

      // Phase 2: 2. Πάρε similarity pool (25%)
      similarityMap = await getSimilarFilms(inputFilmIds);

      // Phase 2: 3. Score όλα τα candidates από το DNA pool
      const scored = available.map((film) => ({
        ...film,
        score: scoreCandidate(film, signals, similarityMap),
      }));

      // Phase 2: 4. Πάρε top 30 by score
      const top30 = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 30);

      // Phase 2b: Φιλτράρισμα top30 με ελάχιστο vote_average, χαλαρώνοντας
      // το κατώφλι αν δεν απομείνουν αρκετές ταινίες (>= 5).
      let voteFiltered = top30.filter((film) => (film.vote_average ?? 0) >= 7.5);
      if (voteFiltered.length < 5) {
        voteFiltered = top30.filter((film) => (film.vote_average ?? 0) >= 7.0);
      }
      if (voteFiltered.length < 5) {
        voteFiltered = top30;
      }

      // Phase 2: 5. Weighted random από το φιλτραρισμένο top 30
      picked = weightedRandomPick(voteFiltered);
    } catch (error) {
      Sentry.captureException(error);
      picked = null;
    }

    // Phase 2: fallback to pure random if hybrid ranking failed or produced nothing
    if (!picked) {
      picked = available[Math.floor(Math.random() * available.length)];
    }

    // Fetch full details in user's language (getFilmById handles language fix)
    const full = picked.id ? await getFilmById(picked.id, lang) : null;
    const { name: dnaName, desc: dnaDesc } = getDNAStrings(dnaKey, lang);

    // Extract watch providers for user's country
    const watchOptions = full?.watchProviders
      ? getWatchOptionsForCountry(full.watchProviders, country)
      : null;

    const filmForResponse = {
      id:       full?.id       ?? picked.id       ?? null,
      title:    full?.title    ?? picked.title,
      year:     full?.year     ?? picked.year      ?? null,
      director: full?.director ?? picked.director  ?? null,
      poster:   full?.poster   ?? picked.poster    ?? null,
      overview: full?.overview ?? picked.overview  ?? "",
      tagline:  full?.tagline  ?? "",
      watchOptions: watchOptions,
      watchCountry: country,
    };

    // Build human-readable match reasons from the same director/keyword/similarity
    // signals used by the hybrid ranking, so the "why" text can reference what
    // actually connected this pick to the user's input films.
    const matchReasons = [];
    if (full?.director && signals?.directors?.has(full.director)) {
      matchReasons.push({ type: "director", director: full.director });
    }
    if (Array.isArray(full?.keywordIds) && signals?.keywordIds?.size) {
      const sharedKeywordIds = full.keywordIds.filter((id) => signals.keywordIds.has(id));
      if (sharedKeywordIds.length > 0) {
        const keywords = sharedKeywordIds
          .map((id) => signals.keywordNames?.get(id))
          .filter(Boolean);
        if (keywords.length > 0) matchReasons.push({ type: "keyword", keywords });
      }
    }
    const similarEntry = similarityMap?.get(filmForResponse.id);
    if (similarEntry?.sourceIds?.length) {
      const sourceTitles = similarEntry.sourceIds
        .map((id) => identifiedFilms.find((f) => f.id === id)?.title)
        .filter(Boolean);
      if (sourceTitles.length > 0) matchReasons.push({ type: "similar", films: sourceTitles });
    }
    filmForResponse.matchReasons = matchReasons;

    // Check curated descriptions first (keyed by TMDB film ID as string).
    // These are hand-written in Greek, so the fallback applies for English
    // requests and for any film without a curated entry.
    const curatedDescription =
      lang === "el" ? filmDescriptions[String(filmForResponse.id)] : null;

    // Generate personalised why (uses TMDB data for uniqueness)
    filmForResponse.why = curatedDescription
      ? curatedDescription
      : generateWhy(
          filmForResponse,
          dna,
          mood,
          lang,
          matchReasons,
        );

    // Logged-in users get their recommendation saved server-side; anonymous
    // users keep working entirely off localStorage, so failures here must
    // never affect the response.
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await saveRecommendation(supabase, {
          filmId: filmForResponse.id,
          filmTitle: filmForResponse.title,
          filmPoster: filmForResponse.poster,
          filmYear: filmForResponse.year,
          dnaType: dnaKey,
          whyText: filmForResponse.why,
        });
        await updateDnaType(supabase, dnaKey);
        await Promise.all(
          identifiedFilms.map((f) =>
            addWatchedFilm(supabase, { filmId: f.id, filmTitle: f.title, filmPoster: f.poster, filmYear: f.year })
          )
        );
      }
    } catch (error) {
      Sentry.captureException(error);
    }

    return NextResponse.json({
      dnaKey,
      dnaName,
      dnaDesc,
      dnaSecondary,
      dnaConfidence,
      dnaExplanation: { el: dna.explanation_el, en: dna.explanation_en },
      film: filmForResponse,
      poolSize: pool.length,
      availableCount: available.length,
    });
  } catch (error) {
    console.error("recommend error:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Προέκυψε σφάλμα. Παρακαλώ δοκίμασε ξανά." },
      { status: 500 }
    );
  }
}
