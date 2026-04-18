const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("Missing TMDB_API_KEY in environment variables.");
  return apiKey;
}

async function tmdbFetch(path, params = {}) {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: params.language || "en-US",
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${path}?${searchParams.toString()}`, {
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TMDB request failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

function getYearFromDate(dateString) {
  if (!dateString) return null;
  const year = Number.parseInt(dateString.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

function getDirectorFromCredits(credits) {
  if (!credits?.crew?.length) return null;
  const director = credits.crew.find((person) => person.job === "Director");
  return director?.name ?? null;
}

function toPosterUrl(path) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w500${path}`;
}

// Check if a string is mostly Latin/Greek characters (readable by our users)
function isReadableScript(text) {
  if (!text) return false;
  // Count Latin, Greek, and common punctuation chars vs total
  const readable = (text.match(/[\u0020-\u024F\u0370-\u03FF\u1F00-\u1FFF0-9]/g) || []).length;
  return readable / text.length > 0.8;
}

function mapBasicFilm(movie, director = null) {
  return {
    id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    year: getYearFromDate(movie.release_date),
    director,
    poster: toPosterUrl(movie.poster_path),
    overview: movie.overview || null,
    vote_average: movie.vote_average || null,
  };
}

export async function searchFilm(title) {
  if (!title || !title.trim()) return null;
  const searchData = await tmdbFetch("/search/movie", {
    query: title.trim(),
    include_adult: "false",
    page: "1",
  });
  const bestMatch = searchData?.results?.[0];
  if (!bestMatch) return null;
  const details = await tmdbFetch(`/movie/${bestMatch.id}`, {
    append_to_response: "credits",
  });
  return mapBasicFilm(details, getDirectorFromCredits(details.credits));
}

// IMPROVED getFilmById:
// - English UI: always returns English title/overview (clean, consistent)
// - Greek UI: prefers Greek title IF readable, else falls back to English.
//   Never returns Korean/Chinese/Japanese/Arabic script titles to the user.
export async function getFilmById(id, lang = "en") {
  if (!id) return null;

  // Always fetch English version first — it's our reliable baseline
  const detailsEn = await tmdbFetch(`/movie/${id}`, {
    append_to_response: "credits,keywords,watch/providers",
    language: "en-US",
  });

  // For Greek UI, also fetch Greek version to prefer Greek title/overview
  let detailsEl = null;
  if (lang === "el") {
    try {
      detailsEl = await tmdbFetch(`/movie/${id}`, {
        append_to_response: "keywords",
        language: "el-GR",
      });
    } catch {
      detailsEl = null;
    }
  }

  // Decide final title:
  // - English UI → English title
  // - Greek UI → Greek title if TMDB has a proper Greek localisation
  //              AND it's in readable script.
  //              Otherwise → English title.
  let finalTitle = detailsEn.title;
  let finalOverview = detailsEn.overview || "";

  if (lang === "el" && detailsEl) {
    // TMDB sometimes returns original_title (Korean/Japanese etc.) as "title"
    // when no proper Greek localisation exists. We check if Greek title is
    // actually different from original AND readable.
    const greekTitle = detailsEl.title;
    const isProperGreek =
      greekTitle &&
      greekTitle !== detailsEn.original_title &&
      isReadableScript(greekTitle);

    if (isProperGreek) finalTitle = greekTitle;

    // Greek overview if available and readable
    if (detailsEl.overview && detailsEl.overview.trim() && isReadableScript(detailsEl.overview)) {
      finalOverview = detailsEl.overview;
    }
  }

  // Director name stays Latin (from credits, which are in English)
  const director = getDirectorFromCredits(detailsEn.credits);

  // Extract keywords (in English — they're tags, not user-facing directly)
  const keywords = (detailsEn.keywords?.keywords || []).map((k) => k.name);

  // Extract watch providers
  const providers = detailsEn["watch/providers"]?.results || {};

  return {
    id: detailsEn.id,
    title: finalTitle,
    original_title: detailsEn.original_title,
    overview: finalOverview,
    tagline: detailsEn.tagline || "",
    runtime: detailsEn.runtime,
    genres: detailsEn.genres ?? [],
    keywords,
    vote_average: detailsEn.vote_average,
    year: getYearFromDate(detailsEn.release_date),
    release_date: detailsEn.release_date,
    director,
    poster: toPosterUrl(detailsEn.poster_path),
    backdrop: toPosterUrl(detailsEn.backdrop_path),
    watchProviders: providers,
  };
}

// Get streaming/rent/buy options for a specific country (ISO 3166-1 code)
// countryCode: "GR", "US", "GB", etc.
export function getWatchOptionsForCountry(watchProviders, countryCode = "GR") {
  if (!watchProviders) return null;
  const country = watchProviders[countryCode.toUpperCase()];
  if (!country) return null;
  return {
    link: country.link || null,
    flatrate: (country.flatrate || []).map((p) => ({
      name: p.provider_name,
      logo: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
    })),
    rent: (country.rent || []).map((p) => ({
      name: p.provider_name,
      logo: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
    })),
    buy: (country.buy || []).map((p) => ({
      name: p.provider_name,
      logo: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
    })),
  };
}

// Single-page discover (kept for compatibility)
export async function discoverFilms(genre_ids = [], year_from, year_to, exclude_ids = [], page = 1) {
  const params = {
    include_adult: "false",
    include_video: "false",
    sort_by: "vote_average.desc",
    "vote_count.gte": "100",
    page: String(page),
  };
  if (Array.isArray(genre_ids) && genre_ids.length > 0) {
    params.with_genres = genre_ids.join(",");
  }
  if (year_from) params["primary_release_date.gte"] = `${year_from}-01-01`;
  if (year_to)   params["primary_release_date.lte"] = `${year_to}-12-31`;

  const data = await tmdbFetch("/discover/movie", params);
  const excluded = new Set(
    (exclude_ids || []).map((id) => Number(id)).filter((id) => Number.isFinite(id))
  );
  return (data?.results ?? [])
    .map((movie) => mapBasicFilm(movie))
    .filter((movie) => !excluded.has(movie.id));
}

// Build large candidate pool via parallel TMDB calls
export async function buildCandidatePool(genre_ids = [], year_from, year_to, maxFilms = 10000) {
  const pagesNeeded = Math.ceil(maxFilms / 20);
  const maxPages = Math.min(pagesNeeded, 500);
  const CONCURRENCY = 10;

  const baseParams = {
    include_adult: "false",
    include_video: "false",
    sort_by: "vote_average.desc",
    "vote_count.gte": "100",
  };
  if (Array.isArray(genre_ids) && genre_ids.length > 0) {
    baseParams.with_genres = genre_ids.join(",");
  }
  if (year_from) baseParams["primary_release_date.gte"] = `${year_from}-01-01`;
  if (year_to)   baseParams["primary_release_date.lte"] = `${year_to}-12-31`;

  const firstData = await tmdbFetch("/discover/movie", { ...baseParams, page: "1" });
  const totalPages = Math.min(firstData?.total_pages || 1, maxPages);

  const allFilms = [];
  const seenIds = new Set();

  for (const movie of firstData?.results ?? []) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      allFilms.push(mapBasicFilm(movie));
    }
  }

  const remainingPages = [];
  for (let p = 2; p <= totalPages; p++) remainingPages.push(p);

  for (let i = 0; i < remainingPages.length; i += CONCURRENCY) {
    const batch = remainingPages.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((page) =>
        tmdbFetch("/discover/movie", { ...baseParams, page: String(page) })
          .then((data) => data?.results ?? [])
          .catch(() => [])
      )
    );
    for (const pageResults of batchResults) {
      for (const movie of pageResults) {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          allFilms.push(mapBasicFilm(movie));
          if (allFilms.length >= maxFilms) break;
        }
      }
      if (allFilms.length >= maxFilms) break;
    }
    if (allFilms.length >= maxFilms) break;
  }

  return allFilms;
}
