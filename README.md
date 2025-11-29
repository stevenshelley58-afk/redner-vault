## Environment

Copy `.env.example` to `.env.local` and fill with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key is server-only (API routes / server components); it must never be exposed to the browser.

### SMTP Configuration (Contact Form)

For the contact form to work, add the following SMTP environment variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=studio@render-vault.com
SMTP_PASS=your-app-password-here
```

- `SMTP_HOST` - Optional, defaults to `smtp.gmail.com`
- `SMTP_PORT` - Optional, defaults to `587`
- `SMTP_USER` - Required: Must match the Gmail account used to generate the app password (e.g., `studio@render-vault.com`)
- `SMTP_PASS` - Required: Gmail App Password (never the normal login password)

**Security Note**: Do not log `SMTP_USER` or `SMTP_PASS` anywhere in the code or error messages.

**Gmail App Password Setup**:
1. Enable 2-factor authentication for the Gmail account (`studio@render-vault.com`)
2. Create an App Password: https://myaccount.google.com/apppasswords (name it "vercel-contact-form")
3. Use the 16-character App Password string as `SMTP_PASS`
4. Use the full Gmail address as `SMTP_USER`

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
- `SMTP_HOST` (optional, defaults to `smtp.gmail.com`)
- `SMTP_PORT` (optional, defaults to `587`)
- `SMTP_USER` (required for contact form)
- `SMTP_PASS` (required for contact form - use Gmail App Password)

The app uses the Supabase JS client with RLS-aware server/client helpers (`lib/supabase`). No local DB is needed.

## Database

- Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor to provision tables and RLS for projects, assets, images, comments, and billing/profile data.
- Set the following env vars in Supabase/Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

The Next.js API routes read/write via the Supabase service role but still require an authenticated user session to scope data per account.
