-- SpaceCode Supabase schema
-- Run this once in Supabase -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'learner' check (role in ('learner','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, module_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  score int not null,
  total_questions int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  page_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  status text not null default 'planned' check (status in ('planned','in_progress','submitted','completed')),
  project_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, project_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = check_user and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.analytics_events enable row level security;
alter table public.project_submissions enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = 'learner');

drop policy if exists "progress own select" on public.module_progress;
create policy "progress own select" on public.module_progress for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "progress own insert" on public.module_progress;
create policy "progress own insert" on public.module_progress for insert with check (auth.uid() = user_id);
drop policy if exists "progress own update" on public.module_progress;
create policy "progress own update" on public.module_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "quiz own insert" on public.quiz_attempts;
create policy "quiz own insert" on public.quiz_attempts for insert with check (auth.uid() = user_id);
drop policy if exists "quiz own select" on public.quiz_attempts;
create policy "quiz own select" on public.quiz_attempts for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "analytics insert" on public.analytics_events;
create policy "analytics insert" on public.analytics_events for insert with check (user_id is null or auth.uid() = user_id);
drop policy if exists "analytics admin read" on public.analytics_events;
create policy "analytics admin read" on public.analytics_events for select using (public.is_admin());

drop policy if exists "projects own select" on public.project_submissions;
create policy "projects own select" on public.project_submissions for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "projects own insert" on public.project_submissions;
create policy "projects own insert" on public.project_submissions for insert with check (auth.uid() = user_id);
drop policy if exists "projects own update" on public.project_submissions;
create policy "projects own update" on public.project_submissions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- After you create your own account, promote yourself to admin by running:
-- update public.profiles set role = 'admin' where id = '<YOUR_USER_UUID>';
