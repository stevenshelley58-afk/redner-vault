-- Render Vault Supabase schema
-- Run in the Supabase SQL editor (or supabase cli) before deploying the app.
-- This creates the minimal tables used by the frontend plus permissive policies
-- so the service role (server-side) can read/write and signed-in users can
-- only touch their own records.

create extension if not exists "pgcrypto";

-- Core reference data -------------------------------------------------------
create table if not exists profiles (
  id uuid primary key,
  email text not null,
  full_name text not null,
  phone_number text,
  company_name text,
  country text,
  timezone text,
  role text default 'customer',
  member_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  brand_name text,
  brand_summary text,
  tone_of_voice text,
  visual_style text,
  font_preferences text,
  notes text,
  primary_colors text[],
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists billing_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  plan text,
  credits_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists billing_transactions (
  id uuid primary key default gen_random_uuid(),
  billing_account_id uuid not null references billing_accounts (id) on delete cascade,
  delta integer not null,
  reason text,
  notes text,
  created_at timestamptz not null default now()
);

-- Projects ------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  project_type text not null default 'image_render',
  status text not null default 'draft',
  brief text,
  agreed_deliverables text,
  due_date date,
  billing_period_label text,
  images_count integer not null default 0,
  latest_version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  type text not null default 'other',
  label text not null,
  file_url text,
  file_thumbnail_url text,
  created_at timestamptz not null default now()
);

create table if not exists project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  author_type text not null default 'customer',
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  preview_url text,
  primary_output_url text,
  sort_order integer not null default 1,
  latest_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists image_versions (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references project_images (id) on delete cascade,
  version_number integer not null,
  status text not null default 'candidate',
  output_url text not null,
  preview_url text,
  notes text,
  created_at timestamptz not null default now(),
  created_by_name text
);

create table if not exists image_comments (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references project_images (id) on delete cascade,
  version_number integer not null,
  author_type text not null default 'customer',
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);

-- Permissions & policies ----------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

alter table profiles enable row level security;
alter table brands enable row level security;
alter table billing_accounts enable row level security;
alter table billing_transactions enable row level security;
alter table projects enable row level security;
alter table project_assets enable row level security;
alter table project_notes enable row level security;
alter table project_images enable row level security;
alter table image_versions enable row level security;
alter table image_comments enable row level security;

-- Profile + brand
create policy if not exists "Profiles: owners can read/update" on profiles
  for select using (auth.uid() = id)
  with check (auth.uid() = id);

create policy if not exists "Brands: owners can read/update" on brands
  for select using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Billing
create policy if not exists "Billing accounts: owners can read" on billing_accounts
  for select using (auth.uid() = user_id);
create policy if not exists "Billing tx: owners can read" on billing_transactions
  for select using (exists (select 1 from billing_accounts ba where ba.id = billing_transactions.billing_account_id and ba.user_id = auth.uid()));

-- Projects
create policy if not exists "Projects: owners can read" on projects
  for select using (auth.uid() = user_id);
create policy if not exists "Projects: owners can insert" on projects
  for insert with check (auth.uid() = user_id);
create policy if not exists "Projects: owners can update" on projects
  for update using (auth.uid() = user_id);

-- Assets / notes / images / versions / comments
create policy if not exists "Project assets: owners can read" on project_assets
  for select using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy if not exists "Project assets: owners can insert" on project_assets
  for insert with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy if not exists "Project notes: owners can read" on project_notes
  for select using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy if not exists "Project notes: owners can insert" on project_notes
  for insert with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy if not exists "Project images: owners can read" on project_images
  for select using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy if not exists "Project images: owners can insert" on project_images
  for insert with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy if not exists "Project images: owners can update" on project_images
  for update using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));

create policy if not exists "Image versions: owners can read" on image_versions
  for select using (exists (select 1 from project_images i join projects p on p.id = i.project_id where i.id = image_id and p.user_id = auth.uid()));
create policy if not exists "Image versions: owners can insert" on image_versions
  for insert with check (exists (select 1 from project_images i join projects p on p.id = i.project_id where i.id = image_id and p.user_id = auth.uid()));

create policy if not exists "Image comments: owners can read" on image_comments
  for select using (exists (select 1 from project_images i join projects p on p.id = i.project_id where i.id = image_id and p.user_id = auth.uid()));
create policy if not exists "Image comments: owners can insert" on image_comments
  for insert with check (exists (select 1 from project_images i join projects p on p.id = i.project_id where i.id = image_id and p.user_id = auth.uid()));

-- Helpful indexes
create index if not exists idx_projects_user on projects (user_id, updated_at desc);
create index if not exists idx_assets_project on project_assets (project_id);
create index if not exists idx_notes_project on project_notes (project_id, created_at desc);
create index if not exists idx_images_project on project_images (project_id, sort_order);
create index if not exists idx_versions_image on image_versions (image_id, version_number desc);
create index if not exists idx_comments_image_version on image_comments (image_id, version_number, created_at);
