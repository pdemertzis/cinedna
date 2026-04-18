import { NextResponse } from "next/server";
import { rateLimitSearch } from "@/lib/rateLimit";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TMDB_API_KEY in environment variables.");
  }

  return apiKey;
}

function getYearFromDate(dateString) {
  if (!dateString) return null;
  const year = Number.parseInt(dateString.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

function toPosterUrl(path) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w300${path}`;
}

export async function GET(request) {
  const { allowed } = rateLimitSearch(request);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json([]);
    }

    const apiKey = getApiKey();
    const params = new URLSearchParams({
      api_key: apiKey,
      language: "en-US",
      query: q,
      include_adult: "false",
      page: "1",
    });

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params.toString()}`, {
      method: "GET",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TMDB search failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const topFive = (data?.results ?? []).slice(0, 5).map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: getYearFromDate(movie.release_date),
      poster: toPosterUrl(movie.poster_path),
    }));

    return NextResponse.json(topFive);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unexpected server error in search route." },
      { status: 500 },
    );
  }
}
