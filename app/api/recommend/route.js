import { NextResponse } from "next/server";
import { DNA_TYPES, computeDNA, getDNAStrings } from "@/lib/dna";
import { searchFilm, getFilmById, buildCandidatePool, getWatchOptionsForCountry } from "@/lib/tmdb";
import { generateWhy } from "@/lib/hemingway";

// In-memory cache of candidate pools.
// Key: `${dnaKey}_${yearFrom}_${yearTo}`
// Lives only as long as server process. Resets on restart.
const POOL_CACHE = new Map();
const POOL_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

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
  return `${dnaKey}_${yearFrom || "any"}_${yearTo || "any"}`;
}

async function getOrBuildPool(dnaKey, dna, yearFrom, yearTo) {
  const cacheKey = getPoolCacheKey(dnaKey, yearFrom, yearTo);
  const cached = POOL_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.builtAt < POOL_TTL_MS) {
    return cached.pool;
  }
  const pool = await buildCandidatePool(dna.tmdb_genres, yearFrom, yearTo, 10000);
  POOL_CACHE.set(cacheKey, { pool, builtAt: Date.now() });
  return pool;
}

export async function POST(request) {
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

    // Get or build 10,000-film pool (cached after first build)
    const pool = await getOrBuildPool(dnaKey, dna, yearFrom, yearTo);

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
