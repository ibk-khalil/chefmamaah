-- =========================================================
-- FoodWorld by Chef Maamah — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =========================================================

-- ---------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ---------------------------------------------------------
create type public.user_role as enum ('admin', 'student');
create type public.batch_status as enum ('upcoming', 'active', 'completed');
create type public.recipe_status as enum ('draft', 'published');
create type public.recipe_difficulty as enum ('beginner', 'intermediate', 'advanced');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role public.user_role not null default 'student',
  batch_id uuid, -- set after batches table exists (see alter below)
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. BATCHES
-- ---------------------------------------------------------
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- e.g. "Batch 3"
  class_type text not null,         -- "General Culinary Class" | "Private Culinary Class"
  description text,
  start_date date,
  end_date date,
  status public.batch_status not null default 'upcoming',
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_batch_id_fkey
  foreign key (batch_id) references public.batches(id) on delete set null;

-- ---------------------------------------------------------
-- 3. RECIPES
-- ---------------------------------------------------------
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  category text not null,            -- African | Continental | Desserts | Pastries | Bread | Beverages | Mocktails
  prep_time_minutes int,
  cook_time_minutes int,
  servings int,
  difficulty public.recipe_difficulty not null default 'beginner',
  ingredients jsonb not null default '[]',   -- [{ "name": "...", "amount": "..." }]
  instructions jsonb not null default '[]',  -- ["step 1", "step 2", ...]
  chef_notes text,
  status public.recipe_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 4. BATCH_RECIPES (many-to-many: a recipe can be assigned to multiple batches)
-- ---------------------------------------------------------
create table public.batch_recipes (
  batch_id uuid not null references public.batches(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (batch_id, recipe_id)
);

-- ---------------------------------------------------------
-- 5. RECIPE_PROGRESS (student "mark as completed")
-- ---------------------------------------------------------
create table public.recipe_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, recipe_id)
);

-- ---------------------------------------------------------
-- 6. HELPER: is the current user an admin?
-- Defined as a function (not a subquery on profiles) to avoid RLS recursion.
-- ---------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------
-- 7. ENABLE RLS
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.batches enable row level security;
alter table public.recipes enable row level security;
alter table public.batch_recipes enable row level security;
alter table public.recipe_progress enable row level security;

-- ---------------------------------------------------------
-- 8. PROFILES POLICIES
-- ---------------------------------------------------------
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_limited"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin());

create policy "profiles_admin_delete"
  on public.profiles for delete
  using (public.is_admin());

-- ---------------------------------------------------------
-- 9. BATCHES POLICIES
-- Students can only read the single batch they are assigned to.
-- ---------------------------------------------------------
create policy "batches_select_own_or_admin"
  on public.batches for select
  using (
    public.is_admin()
    or id = (select batch_id from public.profiles where id = auth.uid())
  );

create policy "batches_admin_write"
  on public.batches for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 10. RECIPES POLICIES
-- Students can only read published recipes assigned to their batch.
-- ---------------------------------------------------------
create policy "recipes_select_admin"
  on public.recipes for select
  using (public.is_admin());

create policy "recipes_select_student_assigned"
  on public.recipes for select
  using (
    status = 'published'
    and exists (
      select 1
      from public.batch_recipes br
      join public.profiles p on p.batch_id = br.batch_id
      where br.recipe_id = recipes.id
        and p.id = auth.uid()
    )
  );

create policy "recipes_admin_write"
  on public.recipes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 11. BATCH_RECIPES POLICIES
-- ---------------------------------------------------------
create policy "batch_recipes_select_own_or_admin"
  on public.batch_recipes for select
  using (
    public.is_admin()
    or batch_id = (select batch_id from public.profiles where id = auth.uid())
  );

create policy "batch_recipes_admin_write"
  on public.batch_recipes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 12. RECIPE_PROGRESS POLICIES
-- Students manage only their own progress rows.
-- ---------------------------------------------------------
create policy "recipe_progress_select_own_or_admin"
  on public.recipe_progress for select
  using (student_id = auth.uid() or public.is_admin());

create policy "recipe_progress_insert_own"
  on public.recipe_progress for insert
  with check (student_id = auth.uid());

create policy "recipe_progress_delete_own"
  on public.recipe_progress for delete
  using (student_id = auth.uid());

-- ---------------------------------------------------------
-- 13. STORAGE (recipe images)
-- Run in the Storage section, or via SQL against storage.objects.
-- Create a public bucket named "recipe-images" in the dashboard first,
-- then apply these policies.
-- ---------------------------------------------------------
-- insert into storage.buckets (id, name, public) values ('recipe-images', 'recipe-images', true)
-- on conflict (id) do nothing;

create policy "recipe_images_public_read"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

create policy "recipe_images_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'recipe-images' and public.is_admin());

create policy "recipe_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'recipe-images' and public.is_admin());

create policy "recipe_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'recipe-images' and public.is_admin());

-- ---------------------------------------------------------
-- 14. Auto-create a profile row when a new auth user is created
-- (Admin creates the auth user via the dashboard/Admin API, then this
-- fires; admin fills in full_name/batch afterward, or pass them via
-- user metadata at creation time.)
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
