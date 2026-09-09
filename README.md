# The FoodWorld by Chef Maamah

Public website + Student Portal + Admin Dashboard, all live on Supabase project "foodworld".

## Run locally
npm install
npm run dev
# open http://localhost:5173

.env is already filled in with your real Supabase project URL + anon key.

## Test accounts (already created in your Supabase project)
Student: student@thefoodworld.ng / Foodworld2026!  (assigned to Batch 3)
Admin:   admin@thefoodworld.ng / FoodworldAdmin2026!

Change these passwords once you're done testing (Supabase dashboard >
Authentication > Users, or add a change-password flow later).

## What's built
- Public site: Home, About, Culinary Classes, Gallery, Contact — done.
- Student Portal (/student-portal/...): login, dashboard, My Batch,
  searchable recipe library, recipe detail w/ mark-as-completed, profile.
- Admin Dashboard (/admin/...): login, stats dashboard, Batches CRUD,
  Students (create/edit/assign batch — creation goes through a secure
  Edge Function, see below), Recipes CRUD (with image upload to the
  recipe-images bucket and batch assignment), Settings.

## How student creation actually works
Browsers can never safely hold the Supabase service role key, so
creating an auth account can't happen directly from the Students page.
Instead there's a deployed Edge Function, `create-student`, that:
1. Verifies the caller's JWT and checks their profile role is 'admin'.
2. Uses the service role key (server-side only) to create the auth user.
3. Assigns their batch and phone on the auto-created profile row.

The Admin > Students page calls this function and shows you the
generated temporary password once — copy it to the student.

## Database
Schema + RLS: supabase/migrations/0001_init.sql (already applied).
Seed data: supabase/seed.sql (already applied — Batch 3 + 3 recipes).
Storage bucket "recipe-images": created, public read / admin write.

## Recommended (optional) hardening
In the Supabase dashboard > Authentication > Policies, consider enabling
"Leaked password protection" — it's a toggle, not something a migration
can set.
