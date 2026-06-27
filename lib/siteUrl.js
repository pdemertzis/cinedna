// Canonical site origin, overridable per environment so the app isn't tied to one domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://cinedna.site";
