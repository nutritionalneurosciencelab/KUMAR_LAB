-- Schema for NeuroMeT lab website content

create extension if not exists pgcrypto;

-- TEAM
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  fellowship text,
  photo_path text,
  links jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PUBLICATIONS
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  authors text,
  journal text,
  details text,
  doi_or_url text,
  tags text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NEWS
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  body text not null,
  badge text,
  people text[] not null default '{}',
  images text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_team_members_updated_at on public.team_members;
create trigger trg_team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

drop trigger if exists trg_publications_updated_at on public.publications;
create trigger trg_publications_updated_at
before update on public.publications
for each row execute function public.set_updated_at();

drop trigger if exists trg_news_items_updated_at on public.news_items;
create trigger trg_news_items_updated_at
before update on public.news_items
for each row execute function public.set_updated_at();

-- SECURITY: Enable RLS
alter table public.team_members enable row level security;
alter table public.publications enable row level security;
alter table public.news_items enable row level security;

-- Public read
drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read on public.team_members
for select using (true);

drop policy if exists publications_public_read on public.publications;
create policy publications_public_read on public.publications
for select using (true);

drop policy if exists news_items_public_read on public.news_items;
create policy news_items_public_read on public.news_items
for select using (true);

-- Admin write: uses Supabase JWT claim `app_metadata.role = 'admin'`
drop policy if exists team_members_admin_write on public.team_members;
create policy team_members_admin_write on public.team_members
for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists publications_admin_write on public.publications;
create policy publications_admin_write on public.publications
for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists news_items_admin_write on public.news_items;
create policy news_items_admin_write on public.news_items
for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

