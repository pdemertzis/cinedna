This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment & Domain

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin used for metadata, share links, and OG image watermarks (see `lib/siteUrl.js`). Falls back to `https://cinedna.site` if unset. Set this to `https://cinedna.site` in the Vercel Production environment. |
| `KV_REST_API_URL` | REST endpoint for the Vercel KV store used to cache TMDB candidate pools (`lib/tmdb.js`) and rate-limit counters (`lib/rateLimit.js`). Provided automatically when a KV store is linked to the project. |
| `KV_REST_API_TOKEN` | Auth token for the Vercel KV REST API, paired with `KV_REST_API_URL`. Provided automatically when a KV store is linked to the project. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used for auth and user data (`lib/supabase/*`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key, paired with `NEXT_PUBLIC_SUPABASE_URL`. |

## Database setup

Run `supabase/schema.sql` in the Supabase SQL Editor before deploying — it creates the `profiles`, `recommendations`, `watched_films`, and `favourite_films` tables, enables RLS, and sets up the auto-profile-creation trigger.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
