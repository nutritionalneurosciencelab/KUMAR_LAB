-- ============================================
-- NeuroMeT Lab — Supabase Database Setup
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- 1. TEAM MEMBERS
create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'Research Scholar',
  fellowship text default '',
  photo_url text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 2. NEWS & EVENTS
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_range text default '',
  location text default '',
  description text default '',
  images text[] default '{}',
  acknowledgements text default '',
  badge text default 'Event',
  people text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 3. AWARDS & FUNDING
create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  org text not null,
  year text default '',
  type text check (type in ('award', 'grant', 'fellowship')) default 'award',
  amount text default '',
  recipient text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (allow public read, anon write)
-- ============================================
alter table team enable row level security;
alter table news enable row level security;
alter table awards enable row level security;

-- Allow anyone to read
create policy "public read team" on team for select using (true);
create policy "public read news" on news for select using (true);
create policy "public read awards" on awards for select using (true);

-- Allow anon to insert/update/delete (admin panel uses anon key + password check)
create policy "anon write team" on team for all using (true) with check (true);
create policy "anon write news" on news for all using (true) with check (true);
create policy "anon write awards" on awards for all using (true) with check (true);

-- ============================================
-- STORAGE BUCKET for photos
-- ============================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "anon upload photos" on storage.objects
  for insert with check (bucket_id = 'photos');

create policy "anon delete photos" on storage.objects
  for delete using (bucket_id = 'photos');

-- ============================================
-- SEED DATA (existing lab members)
-- ============================================
insert into team (name, role, fellowship, sort_order) values
  ('Babita Bhatt',      'Research Scholar', 'WISE PhD',       1),
  ('Chitralekha Gusain','Research Scholar', 'NABI Core SRF',  2),
  ('Arunima Das',       'Research Scholar', 'UGC JRF',        3),
  ('Gauri Chaudhari',   'Research Scholar', 'UGC JRF',        4),
  ('Sumit Sutariya',    'Research Scholar', 'DBT JRF',        5),
  ('Vaishnavi Chaubey', 'Research Scholar', 'PRS 1',          6)
on conflict do nothing;

-- ============================================
-- 4. VACANCIES (single-row toggle for popup)
-- ============================================
create table if not exists vacancies (
  id uuid primary key default gen_random_uuid(),
  is_active boolean default false,
  title text default 'PhD / Project Position Available',
  description text default '',
  apply_url text default 'https://www.nabi.res.in/career.php',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table vacancies enable row level security;
create policy "public read vacancies" on vacancies for select using (true);
create policy "anon write vacancies" on vacancies for all using (true) with check (true);

-- Seed one row (admin panel always has something to toggle)
insert into vacancies (is_active, title, description, apply_url)
values (
  false,
  'PhD / Project Position Available',
  '',
  'https://www.nabi.res.in/career.php'
)
on conflict do nothing;

-- ============================================
-- 5. ALUMNI
-- ============================================
create table if not exists alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_was text default 'Former Lab Member',
  role_now text default '',
  link_url text default '',
  photo_url text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table alumni enable row level security;
create policy "public read alumni" on alumni for select using (true);
create policy "anon write alumni" on alumni for all using (true) with check (true);
