-- ========================================
-- MIGRATION: Fix Vote Table Schema
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Drop existing tables and views (this will delete all data)
DROP VIEW IF EXISTS poll_results CASCADE;
DROP TABLE IF EXISTS vote CASCADE;
DROP TABLE IF EXISTS poll CASCADE;

-- Step 2: Create polls table
CREATE TABLE poll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  start_ts TIMESTAMPTZ NOT NULL,
  end_ts TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'closed'))
);

-- Step 3: Create votes table with composite primary key for one-human-one-vote per poll
CREATE TABLE vote (
  id UUID DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES poll(id) ON DELETE CASCADE,
  nullifier_hash TEXT NOT NULL,
  option_idx INTEGER NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (poll_id, nullifier_hash)
);

-- Step 4: Create indexes for performance
CREATE INDEX idx_vote_poll_id ON vote(poll_id);
CREATE INDEX idx_vote_nullifier ON vote(nullifier_hash);
CREATE INDEX idx_poll_status ON poll(status);
CREATE INDEX idx_poll_start_ts ON poll(start_ts);
CREATE INDEX idx_poll_end_ts ON poll(end_ts);
CREATE INDEX idx_poll_status_start_ts ON poll(status, start_ts);

-- Step 5: Create view for poll results
CREATE VIEW poll_results AS
SELECT 
  p.id as poll_id,
  p.question,
  p.options,
  p.status,
  p.start_ts,
  p.end_ts,
  COUNT(v.id) as total_votes,
  JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'option_idx', v.option_idx,
      'count', COUNT(*)
    )
  ) FILTER (WHERE v.id IS NOT NULL) as counts
FROM poll p
LEFT JOIN vote v ON p.id = v.poll_id
GROUP BY p.id, p.question, p.options, p.status, p.start_ts, p.end_ts;

-- Step 6: Enable Row Level Security
ALTER TABLE poll ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote ENABLE ROW LEVEL SECURITY;

-- Step 7: Create Policies
CREATE POLICY "Anyone can view polls"
  ON poll FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view votes"
  ON vote FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON vote FOR INSERT
  WITH CHECK (true);

-- Done! Now run the seed script to add polls.

