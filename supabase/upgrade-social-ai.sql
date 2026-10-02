-- SpaceCode social/profile upgrade. Run once in Supabase -> SQL Editor.

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
create unique index if not exists profiles_username_unique on public.profiles (lower(username)) where username is not null;

-- Authenticated learners may see non-sensitive profile fields used by Community.
drop policy if exists "profiles authenticated read" on public.profiles;
create policy "profiles authenticated read" on public.profiles for select to authenticated using (true);

-- Keep role protected while allowing each user to edit their own profile, including admins.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end; $$;
drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger before update on public.profiles for each row execute function public.protect_profile_role();

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  body text not null check (char_length(body) between 1 and 1500),
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);

create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id,user_id)
);

alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;

create policy "posts authenticated read" on public.community_posts for select to authenticated using (true);
create policy "posts own insert" on public.community_posts for insert to authenticated with check (auth.uid()=user_id);
create policy "posts own update" on public.community_posts for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "posts own delete" on public.community_posts for delete to authenticated using (auth.uid()=user_id or public.is_admin());

create policy "comments authenticated read" on public.community_comments for select to authenticated using (true);
create policy "comments own insert" on public.community_comments for insert to authenticated with check (auth.uid()=user_id);
create policy "comments own delete" on public.community_comments for delete to authenticated using (auth.uid()=user_id or public.is_admin());

create policy "likes authenticated read" on public.community_likes for select to authenticated using (true);
create policy "likes own insert" on public.community_likes for insert to authenticated with check (auth.uid()=user_id);
create policy "likes own delete" on public.community_likes for delete to authenticated using (auth.uid()=user_id);

-- Public buckets for avatars and project screenshots. Write access stays scoped to the current user's folder.
insert into storage.buckets (id,name,public) values ('avatars','avatars',true) on conflict (id) do update set public=true;
insert into storage.buckets (id,name,public) values ('community-media','community-media',true) on conflict (id) do update set public=true;

drop policy if exists "avatar public read" on storage.objects;
create policy "avatar public read" on storage.objects for select using (bucket_id='avatars');
drop policy if exists "avatar own upload" on storage.objects;
create policy "avatar own upload" on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "avatar own update" on storage.objects;
create policy "avatar own update" on storage.objects for update to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "community media public read" on storage.objects;
create policy "community media public read" on storage.objects for select using (bucket_id='community-media');
drop policy if exists "community media own upload" on storage.objects;
create policy "community media own upload" on storage.objects for insert to authenticated with check (bucket_id='community-media' and (storage.foldername(name))[1]=auth.uid()::text);

-- Optional moderation later: add report tables and an admin moderation queue before large-scale public launch.
