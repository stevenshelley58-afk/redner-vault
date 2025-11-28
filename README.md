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

## Database

- Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor to provision tables and RLS for projects, assets, images, comments, and billing/profile data.
- Set the following env vars in Supabase/Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

The Next.js API routes read/write via the Supabase service role but still require an authenticated user session to scope data per account.
