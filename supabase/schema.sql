-- ════════════════════════════════════════════════════════════════
-- Brew — database schema
-- Run this in Supabase → SQL Editor (paste & Run).
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT.
-- ════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Coffees: one row per coffee bag ──────────────────────────────
create table if not exists public.coffees (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  date_added      date not null default current_date,   -- when you logged it
  roaster         text,
  name            text,
  origin          text,                                  -- legacy combined "country, region" (old rows)
  country         text,                                  -- country of origin
  region          text,                                  -- growing region within the country
  producer        text,                                  -- farm / producer / co-op
  variety         text,                                  -- e.g. Caturra, Geisha
  process         text,                                  -- Washed, Natural, Honey, Anaerobic...
  altitude        text,                                  -- e.g. "1800 masl"
  tasting_notes   text[] not null default '{}',
  roast_level     text,                                  -- light | medium-light | medium | medium-dark | dark
  roast_purpose   text,                                  -- filter | espresso | omni
  decaf           boolean not null default false,
  weight_grams    integer,
  price           numeric(10,2),
  currency        text default 'EUR',
  photo_url       text,
  rating          smallint,                              -- overall 1..5 (nullable)
  liked           boolean,                               -- legacy thumbs (use verdict)
  verdict         smallint,                              -- 1 liked / 0 neutral / -1 disliked / null
  comments        text
);

-- ── Recipes: how to brew (reusable, optionally tied to a coffee) ──
create table if not exists public.recipes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  coffee_id       uuid references public.coffees(id) on delete cascade,
  name            text,
  method          text,                                  -- espresso | v60 | aeropress | frenchpress | moka | chemex | coldbrew | other
  dose_grams      numeric(6,1),                          -- coffee in (beans)
  yield_grams     numeric(6,1),                          -- liquid out
  grind           text,
  water_temp_c    integer,
  time_seconds    integer,
  milk_ml         integer,                               -- null / 0 = no milk
  milk_type       text,                                  -- whole | semi | skim | oat | almond | soy | other
  ice             boolean not null default false,
  notes           text
);

-- ── Brews: each drink you made + how you rated it ────────────────
create table if not exists public.brews (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  coffee_id       uuid not null references public.coffees(id) on delete cascade,
  recipe_id       uuid references public.recipes(id) on delete set null,
  brew_date       date not null default current_date,
  drink_type      text,                                  -- espresso | filter | cortado | flatwhite | latte | cappuccino | americano | coldbrew | icedlatte | other
  liked           boolean,                               -- legacy thumbs (use verdict)
  verdict         smallint,                              -- 1 liked / 0 neutral / -1 disliked / null
  rating          smallint,                              -- optional 1..5
  notes           text
);

create index if not exists idx_brews_coffee   on public.brews(coffee_id);
create index if not exists idx_recipes_coffee on public.recipes(coffee_id);
create index if not exists idx_coffees_created on public.coffees(created_at desc);

-- ── Row Level Security ───────────────────────────────────────────
-- The app talks to Supabase exclusively with the service-role key from
-- the server (behind the password gate), which bypasses RLS. We still
-- enable RLS with no policies so the public anon key can't read anything.
alter table public.coffees enable row level security;
alter table public.recipes enable row level security;
alter table public.brews   enable row level security;

-- ── Storage bucket for bag photos (public-read, server writes) ───
insert into storage.buckets (id, name, public)
values ('coffee-photos', 'coffee-photos', true)
on conflict (id) do nothing;
