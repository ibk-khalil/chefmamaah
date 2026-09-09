-- =========================================================
-- Optional seed data — run after 0001_init.sql
-- Creates one batch and a few published recipes assigned to it.
-- Student accounts are NOT created here — create those via
-- Supabase Auth (dashboard or Admin API) as described in README.md,
-- then use the Admin > Students screen to assign them to a batch.
-- =========================================================

insert into public.batches (name, class_type, description, start_date, end_date, status)
values (
  'Batch 3',
  'General Culinary Class',
  'General Culinary Class batch running in Wuye, Abuja.',
  current_date,
  current_date + interval '14 days',
  'active'
)
returning id;

-- Copy the returned batch id and use it below (or query it) before
-- running the inserts that follow, if running these statements
-- separately rather than in one transaction.

do $$
declare
  v_batch_id uuid;
  v_recipe_id uuid;
begin
  select id into v_batch_id from public.batches where name = 'Batch 3' limit 1;

  insert into public.recipes (name, description, category, prep_time_minutes, cook_time_minutes, servings, difficulty, ingredients, instructions, chef_notes, status)
  values (
    'Jollof Rice with Grilled Chicken',
    'A rich, smoky West African classic paired with perfectly grilled chicken.',
    'African',
    20, 45, 4, 'beginner',
    '[{"name":"Long grain rice","amount":"3 cups"},{"name":"Tomatoes","amount":"6, blended"},{"name":"Red bell pepper","amount":"1, blended"},{"name":"Chicken thighs","amount":"6 pieces"},{"name":"Onion","amount":"1, sliced"},{"name":"Chicken stock","amount":"2 cups"}]',
    '["Marinate and grill the chicken until charred and cooked through.","Blend tomatoes, pepper and onion into a smooth base.","Fry the blended base until reduced and deep red.","Add rice and stock, cover and cook on low heat until tender.","Serve hot with the grilled chicken."]',
    'For extra smokiness, let the pot sit over low heat for the last 5 minutes uncovered.',
    'published'
  )
  returning id into v_recipe_id;

  insert into public.batch_recipes (batch_id, recipe_id) values (v_batch_id, v_recipe_id);

  insert into public.recipes (name, description, category, prep_time_minutes, cook_time_minutes, servings, difficulty, ingredients, instructions, chef_notes, status)
  values (
    'Classic Chicken Alfredo',
    'Creamy continental pasta with pan-seared chicken breast.',
    'Continental',
    15, 25, 3, 'intermediate',
    '[{"name":"Fettuccine","amount":"300g"},{"name":"Chicken breast","amount":"2, sliced"},{"name":"Heavy cream","amount":"1 cup"},{"name":"Parmesan","amount":"1 cup, grated"},{"name":"Garlic","amount":"3 cloves, minced"},{"name":"Butter","amount":"2 tbsp"}]',
    '["Cook fettuccine until al dente.","Sear the chicken until golden, set aside.","Sauté garlic in butter, add cream and simmer.","Stir in parmesan until the sauce thickens.","Toss in pasta and sliced chicken, serve immediately."]',
    'Reserve a cup of pasta water — it rescues a sauce that thickens too fast.',
    'published'
  )
  returning id into v_recipe_id;

  insert into public.batch_recipes (batch_id, recipe_id) values (v_batch_id, v_recipe_id);

  insert into public.recipes (name, description, category, prep_time_minutes, cook_time_minutes, servings, difficulty, ingredients, instructions, chef_notes, status)
  values (
    'Zobo Mocktail',
    'A refreshing hibiscus mocktail with ginger and pineapple.',
    'Mocktails',
    15, 20, 6, 'beginner',
    '[{"name":"Dried hibiscus (zobo) leaves","amount":"2 cups"},{"name":"Ginger","amount":"2 inches, sliced"},{"name":"Pineapple chunks","amount":"1 cup"},{"name":"Sugar","amount":"to taste"},{"name":"Water","amount":"6 cups"}]',
    '["Boil hibiscus leaves and ginger in water for 15 minutes.","Strain and discard the solids.","Sweeten to taste and blend in pineapple chunks.","Chill thoroughly before serving over ice."]',
    null,
    'published'
  )
  returning id into v_recipe_id;

  insert into public.batch_recipes (batch_id, recipe_id) values (v_batch_id, v_recipe_id);
end $$;
