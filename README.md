## Environment

Copy `.env.example` to `.env.local` and fill with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key is server-only (API routes / server components); it must never be exposed to the browser.

## Local development

Install deps and run:

```
npm install
npm run dev
```

## Deployment

Vercel project: `render-vault` (see `.vercel/project.json`).

Set the same env vars in Vercel for Production/Preview/Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

The app uses the Supabase JS client with RLS-aware server/client helpers (`lib/supabase`). No local DB is needed.
