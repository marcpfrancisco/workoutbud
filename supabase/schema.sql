-- ============================================================
-- WorkoutBud: Initial Database Schema
-- ============================================================
-- Instructions:
--   1. Go to Supabase Dashboard → SQL Editor → New query
--   2. Paste this entire file and click Run
--   3. Run seed.sql afterwards for the global exercise library
-- ============================================================

-- ============================================================
-- HELPER: auto-update updated_at on row change
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TABLE: exercises
-- Global library (is_global = true, user_id = null) and
-- user-created custom exercises (is_global = false, user_id = auth.uid())
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  muscle_groups TEXT[]      NOT NULL DEFAULT '{}',
  category      TEXT        NOT NULL CHECK (category IN ('push', 'pull', 'legs', 'core', 'cardio', 'other')),
  gif_url       TEXT,
  instructions  TEXT,
  is_global     BOOLEAN     NOT NULL DEFAULT false,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Global exercises have no owner; user exercises always have an owner
  CONSTRAINT exercise_ownership CHECK (
    (is_global = true  AND user_id IS NULL) OR
    (is_global = false AND user_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_exercises_user_id      ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category     ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);


-- ============================================================
-- TABLE: routines
-- ============================================================
CREATE TABLE IF NOT EXISTS routines (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  exercises   JSONB       NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routines_user_id    ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_updated_at ON routines(updated_at DESC);

CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- TABLE: workout_logs
-- routine_id is nullable — SET NULL if the parent routine is deleted
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id   UUID        REFERENCES routines(id) ON DELETE SET NULL,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  sets         JSONB       NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id    ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_routine_id ON workout_logs(routine_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_started_at ON workout_logs(started_at DESC);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE exercises    ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines     ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;


-- exercises:
--   All authenticated users can READ global exercises
--   Users can only READ/WRITE/DELETE their own custom exercises
CREATE POLICY "exercises_select" ON exercises
  FOR SELECT USING (
    is_global = true OR auth.uid() = user_id
  );

CREATE POLICY "exercises_insert" ON exercises
  FOR INSERT WITH CHECK (
    is_global = false AND auth.uid() = user_id
  );

CREATE POLICY "exercises_update" ON exercises
  FOR UPDATE USING (
    is_global = false AND auth.uid() = user_id
  );

CREATE POLICY "exercises_delete" ON exercises
  FOR DELETE USING (
    is_global = false AND auth.uid() = user_id
  );


-- routines: strict ownership
CREATE POLICY "routines_select" ON routines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "routines_insert" ON routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "routines_update" ON routines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "routines_delete" ON routines
  FOR DELETE USING (auth.uid() = user_id);


-- workout_logs: strict ownership
CREATE POLICY "workout_logs_select" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "workout_logs_insert" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workout_logs_update" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "workout_logs_delete" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);
