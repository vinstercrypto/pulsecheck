-- ============================================================================
-- Discovery Script: Find actual insert_vote_do_nothing function signature
-- ============================================================================
-- 
-- Run this FIRST to discover the actual function signature and definition.
-- Use the output to adjust the migration file if needed.
-- ============================================================================

-- Get full function definition
SELECT 
  '=== FULL FUNCTION DEFINITION ===' AS section,
  pg_get_functiondef(p.oid) AS function_ddl
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing';

-- Get function signature details
SELECT 
  '=== FUNCTION SIGNATURE ===' AS section,
  p.proname AS function_name,
  n.nspname AS schema_name,
  pg_get_function_arguments(p.oid) AS arguments,
  pg_get_function_result(p.oid) AS return_type,
  CASE p.prosecdef 
    WHEN true THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END AS security_type,
  p.provolatile AS volatility, -- 'i'=immutable, 's'=stable, 'v'=volatile
  p.proisstrict AS is_strict, -- true if returns NULL on NULL input
  p.proparallel AS parallel_safety -- 's'=safe, 'r'=restricted, 'u'=unsafe
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing';

-- Get function parameters with types
-- Note: proargmodes is NULL when all parameters are IN (the default)
-- We handle this by using generate_series to iterate over array indices
SELECT 
  '=== FUNCTION PARAMETERS ===' AS section,
  p.proname AS function_name,
  i AS parameter_position,
  COALESCE(p.proargnames[i], '') AS parameter_name,
  format_type(p.proargtypes[i], NULL) AS parameter_type,
  COALESCE(p.proargmodes[i], 'i') AS parameter_mode -- 'i'=IN (default), 'o'=OUT, 'b'=INOUT, 't'=TABLE, 'v'=VARIADIC
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
CROSS JOIN LATERAL generate_series(1, array_length(p.proargtypes, 1)) AS i
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing'
ORDER BY i;

-- Check if function has search_path set
SELECT 
  '=== SEARCH_PATH CHECK ===' AS section,
  p.proname AS function_name,
  CASE 
    WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' THEN 'YES'
    ELSE 'NO - NEEDS FIX'
  END AS has_search_path_setting,
  CASE 
    WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path = public, pg_catalog%' 
      OR pg_get_functiondef(p.oid) LIKE '%SET search_path = ''public'', ''pg_catalog''%'
    THEN 'CORRECT'
    WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' 
    THEN 'SET BUT MAY NEED REVIEW'
    ELSE 'MISSING'
  END AS search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing';

-- Get current permissions
SELECT 
  '=== CURRENT PERMISSIONS ===' AS section,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'insert_vote_do_nothing'
ORDER BY grantee, privilege_type;

-- Check for dependencies (functions/triggers that call this function)
SELECT 
  '=== DEPENDENCIES ===' AS section,
  CASE 
    WHEN d.classid = 'pg_proc'::regclass THEN 'Function'
    WHEN d.classid = 'pg_trigger'::regclass THEN 'Trigger'
    ELSE 'Other'
  END AS dependent_type,
  CASE 
    WHEN d.classid = 'pg_proc'::regclass 
    THEN (SELECT proname FROM pg_proc WHERE oid = d.objid)
    WHEN d.classid = 'pg_trigger'::regclass 
    THEN (SELECT tgname FROM pg_trigger WHERE oid = d.objid)
    ELSE d.objid::text
  END AS dependent_name
FROM pg_depend d
JOIN pg_proc p ON d.refobjid = p.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_vote_do_nothing'
  AND d.deptype = 'n'; -- normal dependency

