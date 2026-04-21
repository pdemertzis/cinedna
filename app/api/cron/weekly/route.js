import { DNA_ORDER, postToAll } from "@/lib/social";
import { DNA_TYPES } from "@/lib/dna";

export async function GET(request) {
  // Vercel Cron sends Authorization: Bearer {CRON_SECRET}
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Rotate through DNA types by ISO week number
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const dnaKey  = DNA_ORDER[weekNum % DNA_ORDER.length];
    const dnaInfo = DNA_TYPES[dnaKey];

    if (!dnaInfo) {
      return Response.json({ error: "Invalid DNA key: " + dnaKey }, { status: 500 });
    }

    // Post in both languages — Greek first (primary audience)
    const outcome = await postToAll({
      dnaKey,
      dnaName:   dnaInfo.name,
      dnaDesc:   dnaInfo.desc,
      filmTitle: "",
      lang:      "el",
      platforms: undefined, // all
    });

    return Response.json({
      ok:        outcome.errors.length === 0,
      dnaKey,
      dnaName:   dnaInfo.name,
      results:   outcome.results,
      errors:    outcome.errors,
      imageUrl:  outcome.imageUrl,
      postedAt:  new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
