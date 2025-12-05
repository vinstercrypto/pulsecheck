# Deployment Checklist: Fix insert_vote_do_nothing search_path

## Pre-Deployment

- [ ] **Backup current function definition**
  ```sql
  SELECT pg_get_functiondef(p.oid) AS current_function_ddl
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' AND p.proname = 'insert_vote_do_nothing';
  ```
  - Save the output to a file (e.g., `rollback_insert_vote_do_nothing.sql`)
  - This is your rollback script

- [ ] **Verify current function signature**
  ```sql
  SELECT 
    p.proname,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_function_result(p.oid) AS return_type,
    CASE p.prosecdef WHEN true THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END AS security_type
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' AND p.proname = 'insert_vote_do_nothing';
  ```
  - If the function signature differs from the migration, update the migration file accordingly

- [ ] **Check if function is currently in use**
  - Review application code to see if `insert_vote_do_nothing` is called
  - If not used, this may be a legacy function that can be safely updated

## Deployment Steps

1. [ ] **Review migration file**
   - Open `supabase/migrations/20241020_fix_insert_vote_do_nothing_search_path.sql`
   - Verify function parameters match actual function signature
   - Adjust if needed (especially if function uses SECURITY DEFINER)

2. [ ] **Run migration in Supabase**
   - Option A: Via Supabase Dashboard → SQL Editor
     - Copy the migration SQL
     - Paste and execute
   - Option B: Via Supabase CLI
     ```bash
     supabase db push
     ```
   - Option C: Via direct psql connection
     ```bash
     psql $DATABASE_URL -f supabase/migrations/20241020_fix_insert_vote_do_nothing_search_path.sql
     ```

3. [ ] **Verify function was created**
   ```sql
   SELECT 
     p.proname,
     pg_get_functiondef(p.oid) LIKE '%SET search_path%' AS has_search_path,
     pg_get_functiondef(p.oid) LIKE '%public, pg_catalog%' AS has_correct_path
   FROM pg_proc p
   JOIN pg_namespace n ON p.pronamespace = n.oid
   WHERE n.nspname = 'public' AND p.proname = 'insert_vote_do_nothing';
   ```
   - Should return `has_search_path = true` and `has_correct_path = true`

4. [ ] **Run test script**
   - Execute `supabase/migrations/20241020_test_insert_vote_do_nothing.sql`
   - Review all NOTICE messages
   - All tests should pass

5. [ ] **Verify permissions**
   ```sql
   SELECT 
     grantee,
     privilege_type
   FROM information_schema.routine_privileges
   WHERE routine_schema = 'public' 
     AND routine_name = 'insert_vote_do_nothing';
   ```
   - Should show EXECUTE granted to `anon` and `authenticated` (or your intended roles)

## Post-Deployment Validation

- [ ] **Test with application code** (if function is used)
  - Verify voting still works correctly
  - Check for any errors in application logs
  - Test duplicate vote handling

- [ ] **Monitor for 24 hours**
  - Watch for any unexpected errors
  - Check Supabase logs for function-related issues
  - Verify no performance degradation

- [ ] **Security verification**
  - Confirm function no longer appears in security linter warnings
  - Verify `search_path` is immutable (test with different session settings)

## Rollback Instructions

If issues occur, restore the original function:

1. **Stop using the function** (if possible in application code)

2. **Restore original function**
   - Use the DDL saved in step 1 of Pre-Deployment
   - Execute it in Supabase SQL Editor or via CLI

3. **Verify rollback**
   ```sql
   SELECT pg_get_functiondef(p.oid)
   FROM pg_proc p
   JOIN pg_namespace n ON p.pronamespace = n.oid
   WHERE n.nspname = 'public' AND p.proname = 'insert_vote_do_nothing';
   ```
   - Should match the original definition

## Notes

- **SECURITY DEFINER vs INVOKER**: The migration assumes `SECURITY INVOKER`. If the original function uses `SECURITY DEFINER`, add that clause to the CREATE FUNCTION statement and ensure the function owner has minimal required privileges.

- **Function signature**: If the actual function parameters differ, update the migration file before running.

- **Dependencies**: If other functions or triggers call `insert_vote_do_nothing`, verify they still work after the change.

## Security Considerations

✅ **Fixed Issues:**
- Function now has explicit `SET search_path = public, pg_catalog`
- All object references are fully qualified (`public.vote`, etc.)
- Prevents search_path injection attacks

⚠️ **If using SECURITY DEFINER:**
- Ensure function owner has minimal privileges
- Review function body for any other security concerns
- Consider if SECURITY DEFINER is necessary (prefer INVOKER when possible)

