-- ============================================================================
-- Test Script: Verify insert_vote_do_nothing search_path fix
-- ============================================================================
-- 
-- This script validates that the function works correctly regardless of
-- the caller's session search_path setting.
--
-- Run this AFTER deploying the migration to verify the fix.
-- ============================================================================

-- Test 1: Verify function exists and has correct search_path setting
-- ============================================================================
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) LIKE '%SET search_path%' AS has_search_path_setting,
  pg_get_functiondef(p.oid) LIKE '%public, pg_catalog%' AS has_correct_search_path,
  CASE p.prosecdef 
    WHEN true THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing';

-- Test 2: Verify function works with normal search_path
-- ============================================================================
-- Note: Replace the UUIDs and values below with actual test data
-- or use variables if running in a script context.

SET search_path = public, pg_catalog;

-- Test with sample data (adjust as needed)
DO $$
DECLARE
  test_poll_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
  test_nullifier TEXT := 'test_nullifier_hash_1';
  test_option INTEGER := 0;
BEGIN
  -- This should succeed (or do nothing if duplicate)
  PERFORM public.insert_vote_do_nothing(test_poll_id, test_nullifier, test_option);
  RAISE NOTICE 'Test 2 passed: Function works with normal search_path';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test 2 failed: %', SQLERRM;
END $$;

-- Test 3: Verify function works with malicious search_path override
-- ============================================================================
-- This simulates an attacker trying to influence name resolution
-- by setting a custom schema in search_path.

-- Create a test schema that could be used for attack
CREATE SCHEMA IF NOT EXISTS attacker_schema;

-- Try to create a shadow table (this should NOT affect the function)
CREATE TABLE IF NOT EXISTS attacker_schema.vote (
  id UUID,
  poll_id UUID,
  nullifier_hash TEXT,
  option_idx INTEGER
);

-- Set search_path to prioritize attacker schema
SET search_path = attacker_schema, public, pg_catalog;

-- Function should still work correctly, using public.vote, not attacker_schema.vote
DO $$
DECLARE
  test_poll_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
  test_nullifier TEXT := 'test_nullifier_hash_2';
  test_option INTEGER := 1;
BEGIN
  -- This should succeed and insert into public.vote, NOT attacker_schema.vote
  PERFORM public.insert_vote_do_nothing(test_poll_id, test_nullifier, test_option);
  
  -- Verify the vote went to the correct table
  IF EXISTS (
    SELECT 1 FROM public.vote 
    WHERE poll_id = test_poll_id 
      AND nullifier_hash = test_nullifier
  ) THEN
    RAISE NOTICE 'Test 3 passed: Function correctly uses public.vote despite search_path override';
  ELSE
    RAISE NOTICE 'Test 3 failed: Vote not found in public.vote';
  END IF;
  
  -- Verify the vote did NOT go to the attacker schema table
  IF NOT EXISTS (
    SELECT 1 FROM attacker_schema.vote 
    WHERE poll_id = test_poll_id 
      AND nullifier_hash = test_nullifier
  ) THEN
    RAISE NOTICE 'Test 3 passed: Vote correctly NOT inserted into attacker_schema.vote';
  ELSE
    RAISE NOTICE 'Test 3 WARNING: Vote found in attacker_schema.vote (security issue!)';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test 3 failed: %', SQLERRM;
END $$;

-- Cleanup test schema (optional - comment out if you want to inspect)
-- DROP SCHEMA IF EXISTS attacker_schema CASCADE;

-- Test 4: Verify duplicate handling (ON CONFLICT DO NOTHING)
-- ============================================================================
SET search_path = public, pg_catalog;

DO $$
DECLARE
  test_poll_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
  test_nullifier TEXT := 'test_nullifier_hash_duplicate';
  test_option INTEGER := 0;
BEGIN
  -- First insert
  PERFORM public.insert_vote_do_nothing(test_poll_id, test_nullifier, test_option);
  
  -- Second insert with same poll_id and nullifier (should do nothing)
  PERFORM public.insert_vote_do_nothing(test_poll_id, test_nullifier, test_option);
  
  -- Verify only one vote exists
  IF (SELECT COUNT(*) FROM public.vote 
      WHERE poll_id = test_poll_id AND nullifier_hash = test_nullifier) = 1 THEN
    RAISE NOTICE 'Test 4 passed: Duplicate vote correctly ignored';
  ELSE
    RAISE NOTICE 'Test 4 failed: Expected 1 vote, found different count';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test 4 failed: %', SQLERRM;
END $$;

-- Reset search_path to default
SET search_path = public, pg_catalog;

-- Final summary
DO $$
BEGIN
  RAISE NOTICE 'All tests completed. Review the NOTICE messages above for results.';
END $$;

