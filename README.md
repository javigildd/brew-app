# ☕ Brew

A personal coffee journal. Snap a photo of a coffee bag → AI reads the roaster,
origin, process, tasting notes, roast level/purpose, etc. → save it, rate it,
log the drinks you make and the recipes you use, and see which kinds of coffee
you like most.

- **Next.js (App Router)** + **Tailwind**, mobile-first, bilingual (ES/EN).
- **Claude vision** (`claude-sonnet-4-6`) reads the bag via forced tool-use.
- **Supabase** Postgres + Storage for data and photos.
- Simple **password gate** (signed cookie) so the public URL stays private.
- Deploys to **Vercel**.

---

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the `coffees`, `recipes`, `brews` tables, enables RLS, and creates the public `coffee-photos` storage bucket.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose it to the browser)

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `BREW_PASSWORD` | The single password to access the app |
| `BREW_SESSION_SECRET` | Random string to sign the session cookie (`openssl rand -base64 48`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service role** key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `ANTHROPIC_MODEL` | (optional) vision model, defaults to `claude-sonnet-4-6` |

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000, enter your `BREW_PASSWORD`, and start adding coffees.

## 4. Deploy to Vercel

1. Push this repo to GitHub (already at `javigildd/brew-app`).
2. In Vercel, **New Project → Import** the repo.
3. Add all the environment variables from step 2 in **Settings → Environment Variables**.
4. Deploy.

> ⚠️ **Rotate your Anthropic key** before going public if it was ever shared in
> plain text. Generate a new key in the Anthropic console and update
> `ANTHROPIC_API_KEY` locally and in Vercel.

---

## How it works

- **Photo → data:** `/api/extract` resizes the image, sends it to Claude with a
  forced `save_coffee_data` tool (strict JSON schema), and returns structured
  fields. Prompt caching is set on the system prompt + tool schema. You review &
  edit everything before saving — nothing is auto-committed.
- **Auth:** `src/middleware.ts` checks a signed, expiring session cookie on every
  route (HMAC-SHA256 via Web Crypto). `/login` posts the password to
  `/api/login`, which sets the cookie.
- **Data:** all reads/writes go through `/api/*` route handlers using the
  Supabase service-role client (server-only), behind the password gate. RLS is on
  with no public policies, so the anon key can't read anything.

## Data model

- **coffees** — one row per bag (all the bag data + overall rating, like, comments, photo).
- **recipes** — reusable brew recipes (dose in → liquid out, ratio, milk ml + type, ice, grind/temp/time), optionally tied to a coffee.
- **brews** — each drink you made: drink type, like/dislike, optional rating + notes, linked to a coffee and optionally a recipe.

The **Insights** page aggregates your ratings by origin, process, roast level,
roast purpose, and drink type.
