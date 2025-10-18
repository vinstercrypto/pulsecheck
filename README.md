
# PulseCheck - Daily Polling App

PulseCheck is a daily, one-human-one-vote polling application built as a World App Mini App. It uses World ID's Incognito Actions (Verify v2) to ensure user privacy and voting integrity.

## Features

- **Daily Polls**: One or two new polls available each day (configurable).
- **Anonymous Voting**: Vote on polls without revealing your identity.
- **Verified Humans Only**: Powered by World ID to ensure each vote is cast by a unique, real person.
- **One Human, One Vote**: Enforced via server-side verification and database constraints.
- **Instant Results**: See aggregate poll results immediately after voting.
- **Recent History**: Browse results from the last 7 days.
- **Timeboxed Voting**: Polls only accept votes within their scheduled window.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: Supabase (Postgres)
- **Verification**: World ID (MiniKit, Incognito Actions, Verify v2 API)
- **Deployment**: Vercel

---

## 1. Project Setup

### Worldcoin Developer Portal Setup

You must create a project and an "Incognito Action" in the Worldcoin Developer Portal to get the necessary credentials.

1.  **Sign Up/Login**: Go to [developer.worldcoin.org](https://developer.worldcoin.org/) and create an account.
2.  **Create a Project**:
    - Create a new project. Give it a name (e.g., "PulseCheck").
    - Select "World App" as the client.
    - You will be given a **Project ID** (looks like `app_staging_...` for staging or `app_...` for production). This is your `NEXT_PUBLIC_WLD_APP_ID`.
3.  **Create an Action**:
    - In your project, go to the "Actions" section.
    - Create a new "Incognito Action" with verification level **Orb**.
    - Name it `vote` (this exact name is used in the code).
    - This action name becomes your `NEXT_PUBLIC_WLD_ACTION_ID_VOTE`.
4.  **Get API Key**:
    - In your project settings, find your API key.
    - This key is confidential and used for server-side verification with Verify v2. This is your `WLD_API_KEY`.

### Supabase Database Setup

1.  **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Get Credentials**:
    - Navigate to **Project Settings** > **API**.
    - Find your **Project URL** (`SUPABASE_URL`).
    - Find your **Project API Keys**. You will need two keys:
        - `anon` `public` key (`SUPABASE_ANON_KEY`).
        - `service_role` `secret` key (`SUPABASE_SERVICE_ROLE_KEY`).
3.  **Run SQL Schema**:
    - Go to the **SQL Editor** in your Supabase project dashboard.
    - Open the `supabase/schema.sql` file from this repository.
    - Copy its content and paste it into a new query in the SQL Editor.
    - Click "Run" to create the tables (`poll`, `vote`) and the view (`poll_results`).

---

## 2. Local Development

### Prerequisites

- Node.js (v18 or newer)
- pnpm (or npm/yarn)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd pulsecheck
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Variables**:
    - Copy the example environment file:
      ```bash
      cp .env.example .env.local
      ```
    - Fill in the `.env.local` file with the credentials you obtained from the Worldcoin Developer Portal and Supabase.
    - See `.env.example` for all required variables and their descriptions.

    **Key Environment Variables:**

    | Variable | Description | Example |
    |----------|-------------|---------|
    | `NEXT_PUBLIC_WLD_APP_ID` | World App Project ID | `app_staging_xxxxx` |
    | `NEXT_PUBLIC_WLD_ACTION_ID_VOTE` | World ID Action name | `vote` |
    | `WLD_API_KEY` | World ID API Key (server-side) | `wld_xxxxx` |
    | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xxxxx.supabase.co` |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbG...` |
    | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | `eyJhbG...` |
    | `DAILY_POLL_COUNT` | Number of polls per day (1 or 2) | `1` |

### Running the Development Server

1.  **Start the app**:
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

2.  **Seed the database**:
    To populate your database with 30 days of polls (respecting `DAILY_POLL_COUNT`), run the seed script:
    ```bash
    pnpm seed
    ```
    Or directly:
    ```bash
    pnpm tsx scripts/seed.ts
    ```
    
    This will:
    - Clear existing polls and votes
    - Read questions from `data/polls.json` (90+ prepopulated questions)
    - Generate 30 days of polls (15 days in the past, 15 days in the future)
    - Create non-overlapping time windows:
      - If `DAILY_POLL_COUNT=1`: One 24-hour poll per day (09:00 UTC)
      - If `DAILY_POLL_COUNT=2`: Two 8-hour polls per day (09:00 and 17:00 UTC)
    - Automatically set status (scheduled/live/closed) based on current time

---

## 3. Deployment

This project is optimized for deployment on Vercel.

### Steps

1.  **Import Project**: Import your Git repository into Vercel.
2.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect Next.js.
    - **Build & Development Settings**: The defaults are usually correct.
3.  **Add Environment Variables**:
    - Go to your Vercel project's **Settings** > **Environment Variables**.
    - Add all the required variables from `.env.example`:
      - `NEXT_PUBLIC_WLD_APP_ID` (use production `app_...` ID, not staging)
      - `NEXT_PUBLIC_WLD_ACTION_ID_VOTE` (usually `vote`)
      - `WLD_API_KEY` (your World ID API key)
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      - `SUPABASE_SERVICE_ROLE_KEY`
      - `DAILY_POLL_COUNT` (set to `1` or `2`)
      - `NODE_ENV=production`
4.  **Deploy**: Trigger a deployment. Vercel will build and deploy your application.
5.  **Seed Production Database**: After deployment, run the seed script locally (pointing to production Supabase):
    ```bash
    # Set production env vars in .env.local temporarily or use a separate .env.production
    pnpm tsx scripts/seed.ts
    ```

### Testing in World App

To test your deployed Mini App inside World App:

1.  Open World App on your phone.
2.  Go to the "Mini Apps" tab.
3.  Use the search or paste your full Vercel deployment URL (e.g., `https://pulsecheck.vercel.app`).
4.  The app will open in the World App's integrated browser with MiniKit enabled.
5.  You must be **Orb verified** to vote (Device verification is not sufficient).

---

## Production Configuration

### Database Schema

The production schema enforces one-human-one-vote via a composite primary key:

```sql
CREATE TABLE vote (
  poll_id UUID NOT NULL REFERENCES poll(id),
  nullifier_hash TEXT NOT NULL,
  PRIMARY KEY (poll_id, nullifier_hash)
);
```

This ensures each `nullifier_hash` (representing a unique human) can only vote once per poll.

### Vote Endpoint Security

`/api/vote` implements the following checks:

1. **Poll Existence**: Verifies the poll exists
2. **Timebox Validation**: `start_ts <= now < end_ts` (returns 403 if outside window)
3. **World ID Verification**: Calls Verify v2 API with proof, action, and signal
4. **Duplicate Prevention**: Database constraint returns 409 if human already voted
5. **Option Validation**: Ensures `optionIdx` is within valid range

### Polls Endpoint

`/api/polls/live` returns up to `DAILY_POLL_COUNT` polls for the current UTC day that are currently live (within their time window).

### Results Endpoint

`/api/results?days=7` returns polls from the last N days (default 7) with vote counts, sorted by `start_ts` descending.

---

## Acceptance Tests

Before going live, verify these scenarios:

### ✅ Basic Voting
- [ ] First vote persists correctly
- [ ] Refresh shows same totals (not incremented)
- [ ] Results display immediately after voting

### ✅ One-Human-One-Vote
- [ ] Second vote with same World ID on same poll returns **409 Conflict**
- [ ] Error message: "You have already voted in this poll."

### ✅ Timebox Enforcement
- [ ] Voting before `start_ts` returns **403 Forbidden**
- [ ] Voting after `end_ts` returns **403 Forbidden**
- [ ] Voting within `[start_ts, end_ts)` succeeds

### ✅ Multiple Polls Per Day
- [ ] `DAILY_POLL_COUNT=1` returns one poll on home page
- [ ] `DAILY_POLL_COUNT=2` returns two polls on home page
- [ ] Each poll accepts votes independently

### ✅ Results History
- [ ] `/api/results?days=7` returns last 7 days of polls
- [ ] Sorted by `start_ts` descending (newest first)
- [ ] Only includes polls with `total_votes > 0`

### ✅ World App Integration
- [ ] MiniKit verify() completes successfully in World App webview
- [ ] Orb-verified users can vote
- [ ] Device-verified users are rejected (if action requires Orb)
- [ ] Verify v2 completes server-side with correct action and signal

---

## Troubleshooting

### "You have already voted in this poll" on first vote

**Cause**: Schema migration incomplete. Old `UNIQUE` constraint on `nullifier_hash` still exists.

**Fix**: Drop old constraint, ensure composite PK is in place:
```sql
ALTER TABLE vote DROP CONSTRAINT IF EXISTS vote_nullifier_hash_key;
ALTER TABLE vote DROP CONSTRAINT IF EXISTS vote_pkey;
ALTER TABLE vote ADD PRIMARY KEY (poll_id, nullifier_hash);
```

### No polls showing on home page

**Cause**: Polls not seeded or incorrect status.

**Fix**: Run seed script with correct `DAILY_POLL_COUNT`:
```bash
DAILY_POLL_COUNT=1 pnpm tsx scripts/seed.ts
```

### Verification fails in World App

**Cause**: App ID or Action ID mismatch.

**Fix**: Ensure `NEXT_PUBLIC_WLD_APP_ID` matches your World ID project and `NEXT_PUBLIC_WLD_ACTION_ID_VOTE` matches your action name exactly.

---

## License

MIT
