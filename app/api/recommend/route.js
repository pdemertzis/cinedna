import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import * as Sentry from "@sentry/nextjs";
import { DNA_TYPES, computeDNA, getDNAStrings } from "@/lib/dna";
import { searchFilm, getFilmById, buildCandidatePool, getWatchOptionsForCountry } from "@/lib/tmdb";
import { generateWhy } from "@/lib/hemingway";
import { rateLimitRecommend } from "@/lib/rateLimit";

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
    Sentry.captureException(error);
  }

  const pool = await buildCandidatePool(dna.tmdb_genres, yearFrom, yearTo, era);

  try {
    await kv.set(cacheKey, pool.map(toMinimalFilm), { ex: POOL_TTL_SECONDS });
  } catch (error) {
    // Caching is best-effort; the request still succeeds without it.
    Sentry.captureException(error);
  }

  return pool;
}

export async function POST(request) {
  const { allowed } = await rateLimitRecommend(request);
  if (!allowed) {
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

    // Compute or reuse DNA
    let dnaKey = lockedDnaKey;
    if (!dnaKey) {
      const dnaResult = await computeDNA(
        identifiedFilms.map((f) => f.title),
        mood,
        era,
      );
      dnaKey = dnaResult.dnaKey;
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

    // Pick one at random from the pool
    const picked = available[Math.floor(Math.random() * available.length)];

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

    // Generate personalised why (uses TMDB data for uniqueness)
    filmForResponse.why = generateWhy(
      filmForResponse,
      dna,
      mood,
      lang,
    );

    return NextResponse.json({
      dnaKey,
      dnaName,
      dnaDesc,
      film: filmForResponse,
      poolSize: pool.length,
      availableCount: available.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
