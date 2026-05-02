-- ============================================================
-- WorkoutBud: Development Test User
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
--
-- Creates a pre-confirmed user so you can log in immediately
-- without waiting for an email confirmation link.
--
-- Credentials:
--   Email:    dev@workoutbud.local
--   Password: DevTest2025!
--
-- To remove this user, run the cleanup block at the bottom.
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN

  -- Skip if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'dev@workoutbud.local') THEN
    RAISE NOTICE 'Test user already exists — skipping.';
    RETURN;
  END IF;

  v_user_id := gen_random_uuid();

  -- ── 1. Create the user ─────────────────────────────────────
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'dev@workoutbud.local',
    crypt('DevTest2025!', gen_salt('bf')),
    NOW(),   -- email_confirmed_at: pre-confirmed, no email link needed
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Dev User"}',
    false,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- ── 2. Register the email identity ─────────────────────────
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    'dev@workoutbud.local',
    jsonb_build_object(
      'sub',            v_user_id::text,
      'email',          'dev@workoutbud.local',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Test user created: dev@workoutbud.local / DevTest2025!';

END $$;


-- ============================================================
-- CLEANUP — run this block separately to remove the test user
-- ============================================================
-- DO $$
-- BEGIN
--   DELETE FROM auth.identities
--     WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dev@workoutbud.local');
--   DELETE FROM auth.users WHERE email = 'dev@workoutbud.local';
--   RAISE NOTICE 'Test user removed.';
-- END $$;
