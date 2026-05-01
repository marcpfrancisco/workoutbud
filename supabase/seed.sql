-- ============================================================
-- WorkoutBud: Global Exercise Seed Data
-- ============================================================
-- Instructions:
--   Run this AFTER schema.sql has been executed successfully.
--   These are the global exercises available to all users.
-- ============================================================

INSERT INTO exercises (name, muscle_groups, category, is_global, user_id) VALUES

  -- PUSH -------------------------------------------------------
  ('Bench Press',           ARRAY['chest', 'front-delts', 'triceps'],         'push', true, NULL),
  ('Incline Bench Press',   ARRAY['upper-chest', 'front-delts', 'triceps'],   'push', true, NULL),
  ('Dumbbell Fly',          ARRAY['chest', 'front-delts'],                    'push', true, NULL),
  ('Overhead Press',        ARRAY['front-delts', 'triceps', 'upper-chest'],   'push', true, NULL),
  ('Arnold Press',          ARRAY['front-delts', 'side-delts', 'triceps'],    'push', true, NULL),
  ('Lateral Raise',         ARRAY['side-delts'],                              'push', true, NULL),
  ('Dips',                  ARRAY['chest', 'triceps', 'front-delts'],         'push', true, NULL),
  ('Tricep Pushdown',       ARRAY['triceps'],                                 'push', true, NULL),
  ('Skull Crusher',         ARRAY['triceps'],                                 'push', true, NULL),
  ('Close-Grip Bench',      ARRAY['triceps', 'chest'],                        'push', true, NULL),

  -- PULL -------------------------------------------------------
  ('Deadlift',              ARRAY['hamstrings', 'glutes', 'lower-back', 'traps', 'lats'], 'pull', true, NULL),
  ('Pull-Up',               ARRAY['lats', 'biceps', 'rear-delts'],            'pull', true, NULL),
  ('Chin-Up',               ARRAY['biceps', 'lats'],                          'pull', true, NULL),
  ('Barbell Row',           ARRAY['lats', 'rear-delts', 'biceps', 'traps'],   'pull', true, NULL),
  ('Dumbbell Row',          ARRAY['lats', 'rear-delts', 'biceps'],            'pull', true, NULL),
  ('Cable Row',             ARRAY['lats', 'rear-delts', 'biceps'],            'pull', true, NULL),
  ('Lat Pulldown',          ARRAY['lats', 'biceps', 'rear-delts'],            'pull', true, NULL),
  ('Face Pull',             ARRAY['rear-delts', 'rotator-cuff'],              'pull', true, NULL),
  ('Shrug',                 ARRAY['traps'],                                   'pull', true, NULL),
  ('Barbell Curl',          ARRAY['biceps'],                                  'pull', true, NULL),
  ('Hammer Curl',           ARRAY['biceps', 'brachialis'],                    'pull', true, NULL),
  ('Incline Dumbbell Curl', ARRAY['biceps'],                                  'pull', true, NULL),

  -- LEGS -------------------------------------------------------
  ('Squat',                 ARRAY['quads', 'glutes', 'hamstrings'],           'legs', true, NULL),
  ('Front Squat',           ARRAY['quads', 'glutes'],                         'legs', true, NULL),
  ('Romanian Deadlift',     ARRAY['hamstrings', 'glutes', 'lower-back'],      'legs', true, NULL),
  ('Leg Press',             ARRAY['quads', 'glutes'],                         'legs', true, NULL),
  ('Walking Lunge',         ARRAY['quads', 'glutes', 'hamstrings'],           'legs', true, NULL),
  ('Bulgarian Split Squat', ARRAY['quads', 'glutes', 'hamstrings'],           'legs', true, NULL),
  ('Leg Curl',              ARRAY['hamstrings'],                              'legs', true, NULL),
  ('Leg Extension',         ARRAY['quads'],                                   'legs', true, NULL),
  ('Hip Thrust',            ARRAY['glutes', 'hamstrings'],                    'legs', true, NULL),
  ('Calf Raise',            ARRAY['calves'],                                  'legs', true, NULL),

  -- CORE -------------------------------------------------------
  ('Plank',                 ARRAY['abs', 'core'],                             'core', true, NULL),
  ('Ab Wheel Rollout',      ARRAY['abs', 'core'],                             'core', true, NULL),
  ('Cable Crunch',          ARRAY['abs'],                                     'core', true, NULL),
  ('Hanging Leg Raise',     ARRAY['abs', 'hip-flexors'],                      'core', true, NULL),
  ('Dead Bug',              ARRAY['abs', 'core'],                             'core', true, NULL),

  -- CARDIO -----------------------------------------------------
  ('Treadmill Run',         ARRAY['quads', 'calves', 'glutes'],               'cardio', true, NULL),
  ('Rowing Machine',        ARRAY['lats', 'biceps', 'quads', 'core'],         'cardio', true, NULL),
  ('Jump Rope',             ARRAY['calves', 'shoulders'],                     'cardio', true, NULL)

ON CONFLICT DO NOTHING;
