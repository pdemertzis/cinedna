/**
 * Social media posting utilities.
 * Env vars required:
 *   META_PAGE_ACCESS_TOKEN   — Facebook Page access token (long-lived)
 *   META_PAGE_ID             — Facebook Page numeric ID
 *   META_INSTAGRAM_ACCOUNT_ID — Instagram Business Account numeric ID
 *   LINKEDIN_ACCESS_TOKEN    — LinkedIn OAuth2 token (60-day expiry)
 *   LINKEDIN_ORGANIZATION_ID — LinkedIn Company Page numeric ID
 *   ADMIN_SECRET             — Admin dashboard password
 */

const BASE_URL = "https://cinedna-pi.vercel.app";
const META_API = "https://graph.facebook.com/v19.0";
const LI_API   = "https://api.linkedin.com/v2";

export const DNA_ORDER = ["d","st","h","of","r","c","ea","op","n","pp","a","ve"];

export function squareImageUrl(dnaKey, lang, film = "") {
  const p = new URLSearchParams({ dna: dnaKey, lang });
  if (film) p.set("film", film);
  return `${BASE_URL}/api/og/square?${p}`;
}

export function ogImageUrl(dnaKey, lang, film = "") {
  const p = new URLSearchParams({ dna: dnaKey, lang });
  if (film) p.set("film", film);
  return `${BASE_URL}/api/og?${p}`;
}

export function buildCaption({ dnaName, dnaDesc, filmTitle, lang }) {
  if (lang === "en") {
    const lines = [
      `Your cinematic DNA: ${dnaName}`,
      "",
      dnaDesc,
      "",
      filmTitle ? `Tonight: ${filmTitle}` : "Discover yours →",
      "",
      BASE_URL,
      "",
      "#CineDNA #cinema #film #filmrecommendation #cinephile #movienight",
    ];
    return lines.join("\n");
  }
  const lines = [
    `Το κινηματογραφικό σου DNA: ${dnaName}`,
    "",
    dnaDesc,
    "",
    filmTitle ? `Απόψε: ${filmTitle}` : "Ανακάλυψε το δικό σου →",
    "",
    BASE_URL,
    "",
    "#CineDNA #ταινίες #cinema #film #cinephile #κινηματογράφος",
  ];
  return lines.join("\n");
}

export function buildLinkedInCaption({ dnaName, dnaDesc, filmTitle }) {
  const lines = [
    `CineDNA | ${dnaName}`,
    "",
    dnaDesc,
    "",
    filmTitle ? `Recommendation: ${filmTitle}` : null,
    "",
    "AI-powered film discovery: 3 films you love → 1 of 12 cinematic DNA profiles → a recommendation you wouldn't have found on your own. Free, no account needed.",
    "",
    `Try it: ${BASE_URL}`,
    "",
    "#CineDNA #AI #FilmDiscovery #Cinema #MovieRecommendation #Cinephile",
  ];
  return lines.filter(l => l !== null).join("\n");
}

// ── INSTAGRAM ────────────────────────────────────────────────
export async function postToInstagram({ imageUrl, caption }) {
  const igId  = process.env.META_INSTAGRAM_ACCOUNT_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!igId || !token) throw new Error("META_INSTAGRAM_ACCOUNT_ID or META_PAGE_ACCESS_TOKEN not set");

  // 1. Create media container
  const containerRes = await fetch(`${META_API}/${igId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
  });
  const container = await containerRes.json();
  if (!container.id) throw new Error(`IG container failed: ${JSON.stringify(container)}`);

  // 2. Publish
  const publishRes = await fetch(`${META_API}/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: container.id, access_token: token }),
  });
  const publish = await publishRes.json();
  if (!publish.id) throw new Error(`IG publish failed: ${JSON.stringify(publish)}`);

  return { platform: "instagram", id: publish.id };
}

// ── FACEBOOK PAGE ────────────────────────────────────────────
export async function postToFacebook({ imageUrl, message }) {
  const pageId = process.env.META_PAGE_ID;
  const token  = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) throw new Error("META_PAGE_ID or META_PAGE_ACCESS_TOKEN not set");

  const res = await fetch(`${META_API}/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, message, access_token: token }),
  });
  const data = await res.json();
  if (!data.id) throw new Error(`FB post failed: ${JSON.stringify(data)}`);

  return { platform: "facebook", id: data.id };
}

// ── LINKEDIN ─────────────────────────────────────────────────
export async function postToLinkedIn({ caption, linkUrl }) {
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!orgId || !token) throw new Error("LINKEDIN_ORGANIZATION_ID or LINKEDIN_ACCESS_TOKEN not set");

  const body = {
    author: `urn:li:organization:${orgId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: caption },
        shareMediaCategory: "ARTICLE",
        media: [{
          status: "READY",
          description: { text: "AI-powered film discovery — discover your cinematic DNA." },
          originalUrl: linkUrl ?? BASE_URL,
          title:       { text: "CineDNA — Film Identity & Discovery" },
        }],
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  const res = await fetch(`${LI_API}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization:                 `Bearer ${token}`,
      "Content-Type":                "application/json",
      "X-Restli-Protocol-Version":   "2.0.0",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.id) return { platform: "linkedin", id: data.id };
  throw new Error(`LinkedIn post failed: ${JSON.stringify(data)}`);
}

// ── POST TO ALL ──────────────────────────────────────────────
export async function postToAll({ dnaKey, dnaName, dnaDesc, filmTitle = "", lang = "el", platforms }) {
  const imageUrl = squareImageUrl(dnaKey, lang, filmTitle);
  const caption  = buildCaption({ dnaName, dnaDesc, filmTitle, lang });
  const liCaption = buildLinkedInCaption({ dnaName, dnaDesc, filmTitle });

  const results = [];
  const errors  = [];

  const tasks = [];
  if (!platforms || platforms.includes("instagram")) {
    tasks.push(postToInstagram({ imageUrl, caption }).then(r => results.push(r)).catch(e => errors.push({ platform: "instagram", error: e.message })));
  }
  if (!platforms || platforms.includes("facebook")) {
    tasks.push(postToFacebook({ imageUrl, message: caption }).then(r => results.push(r)).catch(e => errors.push({ platform: "facebook", error: e.message })));
  }
  if (!platforms || platforms.includes("linkedin")) {
    tasks.push(postToLinkedIn({ caption: liCaption }).then(r => results.push(r)).catch(e => errors.push({ platform: "linkedin", error: e.message })));
  }

  await Promise.allSettled(tasks);
  return { results, errors, imageUrl };
}
