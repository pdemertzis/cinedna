// Shared Supabase data-access helpers. Each function takes a supabase client
// as its first argument so the same logic works from server routes and
// client components. Anonymous users (no session) are no-ops — localStorage
// remains the source of truth for them.

export async function saveRecommendation(client, { filmId, filmTitle, filmPoster, filmYear, dnaType, whyText }) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data, error } = await client
    .from("recommendations")
    .insert({
      user_id: user.id,
      film_id: filmId,
      film_title: filmTitle,
      film_poster: filmPoster || null,
      film_year: filmYear || null,
      dna_type: dnaType,
      why_text: whyText || null,
    })
    .select()
    .single();
  if (error) { console.error("saveRecommendation error:", error); return null; }
  return data;
}

export async function getRecommendations(client) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return [];
  const { data, error } = await client
    .from("recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) { console.error("getRecommendations error:", error); return []; }
  return data || [];
}

export async function addWatchedFilm(client, { filmId, filmTitle, filmPoster, filmYear }) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data, error } = await client
    .from("watched_films")
    .upsert(
      { user_id: user.id, film_id: filmId, film_title: filmTitle, film_poster: filmPoster || null, film_year: filmYear || null },
      { onConflict: "user_id,film_id" }
    )
    .select()
    .single();
  if (error) { console.error("addWatchedFilm error:", error); return null; }
  return data;
}

export async function removeWatchedFilm(client, filmId) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;
  await client.from("watched_films").delete().eq("user_id", user.id).eq("film_id", filmId);
}

export async function getWatchedFilms(client) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return [];
  const { data, error } = await client
    .from("watched_films")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });
  if (error) { console.error("getWatchedFilms error:", error); return []; }
  return data || [];
}

export async function toggleFavouriteFilm(client, { filmId, filmTitle, filmPoster, filmYear }) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { isFavourite: false };
  const { data: existing } = await client
    .from("favourite_films")
    .select("id")
    .eq("user_id", user.id)
    .eq("film_id", filmId)
    .single();
  if (existing) {
    await client.from("favourite_films").delete().eq("user_id", user.id).eq("film_id", filmId);
    return { isFavourite: false };
  }
  await client.from("favourite_films").insert({
    user_id: user.id,
    film_id: filmId,
    film_title: filmTitle,
    film_poster: filmPoster || null,
    film_year: filmYear || null,
  });
  return { isFavourite: true };
}

export async function getFavouriteFilms(client) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return [];
  const { data, error } = await client
    .from("favourite_films")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });
  if (error) { console.error("getFavouriteFilms error:", error); return []; }
  return data || [];
}

export async function updateDnaType(client, dnaType) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;
  await client.from("profiles").upsert({ id: user.id, dna_type: dnaType }, { onConflict: "id" });
}
