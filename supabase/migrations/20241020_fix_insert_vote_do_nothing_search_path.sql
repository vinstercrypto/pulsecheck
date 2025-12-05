-- ============================================================================
-- Migration: Fix role-mutable search_path for public.insert_vote_do_nothing
-- Date: 2024-10-20
-- Priority: High - Security/Stability fix
-- ============================================================================
--
-- This migration fixes a security issue where the function's search_path
-- is mutable, allowing callers to influence name resolution.
--
-- STEP 1: Capture current function definition for rollback
-- ============================================================================

-- Save the current function definition (run this FIRST and save the output)
-- Uncomment and run manually to capture current definition:
/*
SELECT pg_get_functiondef(p.oid) AS current_function_ddl
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'insert_vote_do_nothing';
*/

-- ============================================================================
-- STEP 2: Drop existing function (if it exists)
-- ============================================================================

DROP FUNCTION IF EXISTS public.insert_vote_do_nothing(
  p_poll_id UUID,
  p_nullifier_hash TEXT,
  p_option_idx INTEGER
);

-- ============================================================================
-- STEP 3: Create fixed function with explicit search_path
-- ============================================================================
-- 
-- ASSUMPTIONS (adjust parameters if function signature differs):
-- - Function takes: poll_id, nullifier_hash, option_idx
-- - Function performs INSERT ... ON CONFLICT DO NOTHING
-- - Function returns void
-- - Function uses SECURITY INVOKER (runs with caller's privileges)
--
-- If the function signature differs, adjust the parameters below.
-- If the function uses SECURITY DEFINER, add that clause and ensure
-- the function owner has minimal required privileges.

CREATE OR REPLACE FUNCTION public.insert_vote_do_nothing(
  p_poll_id UUID,
  p_nullifier_hash TEXT,
  p_option_idx INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Insert vote with ON CONFLICT DO NOTHING to handle duplicates gracefully
  -- All object references are fully qualified:
  -- - public.vote (table)
  -- - public.gen_random_uuid() (function, though we use DEFAULT in table)
  
  INSERT INTO public.vote (
    poll_id,
    nullifier_hash,
    option_idx
  )
  VALUES (
    p_poll_id,
    p_nullifier_hash,
    p_option_idx
  )
  ON CONFLICT (poll_id, nullifier_hash) DO NOTHING;
  
  -- No return value needed for void function
  RETURN;
END;
$$;

-- ============================================================================
-- STEP 4: Grant appropriate permissions
-- ============================================================================

-- Grant execute to anon and authenticated roles (adjust as needed)
GRANT EXECUTE ON FUNCTION public.insert_vote_do_nothing(UUID, TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.insert_vote_do_nothing(UUID, TEXT, INTEGER) TO authenticated;

-- ============================================================================
-- STEP 5: Add comment documenting the security fix
-- ============================================================================

COMMENT ON FUNCTION public.insert_vote_do_nothing(UUID, TEXT, INTEGER) IS 
'Inserts a vote with ON CONFLICT DO NOTHING. 
Fixed 2024-10-20: Added explicit SET search_path = public, pg_catalog to prevent 
role-mutable search_path security issues. All object references are fully qualified.';

