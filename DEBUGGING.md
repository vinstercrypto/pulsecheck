# Debugging Vote Issues

## Current Issue: 400 Bad Request

The vote endpoint is returning 400 errors. I've added comprehensive logging to help identify the issue.

## How to Debug:

### 1. Check Vercel Logs (Production)
1. Go to https://vercel.com/dashboard
2. Select your PulseCheck project
3. Click "Logs" tab
4. Try to vote in the app
5. Look for these log messages:
   - `Vote request received: { pollId, optionIdx, hasProof }`
   - Any error messages starting with "Bad request -", "Poll not found:", etc.
   - `Vote API exception:` if there's a catch block error

### 2. Check Browser Console (Client Side)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to vote
4. Look for:
   - `Submitting vote with proof for poll: [poll-id]`
   - `Option index: [number]`
   - `Vote response: [status] [data]`

### 3. Common Issues to Check:

#### Issue: `bad_request` - missing fields
- **Cause**: pollId, optionIdx, or proof is missing/undefined
- **Check**: Browser console should show what was sent

#### Issue: `poll_not_found`
- **Cause**: Poll doesn't exist in database
- **Fix**: Run seed script: `pnpm tsx scripts/seed.ts`

#### Issue: `invalid_option`
- **Cause**: optionIdx is out of range for the poll's options
- **Check**: Make sure optionIdx matches a valid option (0, 1, or 2 for 3 options)

#### Issue: `closed`
- **Cause**: Outside poll time window or ET day window
- **Check**: Poll start_ts and end_ts in database

#### Issue: `verify`
- **Cause**: World ID verification failed
- **Check**: 
  - WLD_APP_ID is correct in Vercel env vars
  - WLD_ACTION_ID_VOTE is correct
  - WLD_API_KEY is valid
  - Signal matches (should be poll.id)

## Expected Flow:

1. User clicks option → `selectedOption` set
2. User clicks "Verify & Cast Vote" → MiniKit verification starts
3. MiniKit returns proof → `handleVote()` called
4. POST to `/api/vote` with: `{ pollId, optionIdx, proof }`
5. Server:
   - Validates fields (400 if missing)
   - Loads poll (404 if not found)
   - Validates option index (400 if invalid)
   - Checks time window (403 if closed)
   - Verifies proof with World ID (401 if fails)
   - Inserts vote (409 if duplicate, 200 if success)
6. Client shows banner and results

## Next Steps:

Try to vote and share the logs from:
1. Vercel logs (server-side)
2. Browser console (client-side)

This will show exactly where the 400 error is coming from.

