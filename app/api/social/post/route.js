import { postToAll } from "@/lib/social";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const body = await request.json();
    const { secret, dnaKey, dnaName, dnaDesc, filmTitle, lang, platforms } = body;

    // Auth
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identifier = "social-post-admin";
    const { success } = await rateLimit(identifier, { limit: 5, windowSeconds: 3600 });
    if (!success) {
      return Response.json(
        { error: "Rate limit exceeded. Maximum 5 social posts per hour." },
        { status: 429 }
      );
    }

    if (!dnaKey || !dnaName) {
      return Response.json({ error: "dnaKey and dnaName are required" }, { status: 400 });
    }

    const outcome = await postToAll({
      dnaKey,
      dnaName,
      dnaDesc:   dnaDesc ?? "",
      filmTitle: filmTitle ?? "",
      lang:      lang ?? "el",
      platforms, // undefined = all platforms
    });

    return Response.json({
      ok:       outcome.errors.length === 0,
      results:  outcome.results,
      errors:   outcome.errors,
      imageUrl: outcome.imageUrl,
      postedAt: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
