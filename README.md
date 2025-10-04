
# PulseCheck - Daily Polling App

PulseCheck is a daily, one-human-one-vote polling application built as a World App Mini App. It uses World ID's Incognito Actions to ensure user privacy and voting integrity.

## Features

- **Daily Polls**: One new poll available each day.
- **Anonymous Voting**: Vote on polls without revealing your identity.
- **Verified Humans Only**: Powered by World ID to ensure each vote is cast by a unique, real person.
- **Instant Results**: See aggregate poll results immediately after voting.
- **Recent History**: Browse results from the last 7 days.

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
    - You will be given a **Project ID** (looks like `app_...`). This is your `WLD_APP_ID`.
3.  **Create an Action**:
    - In your project, go to the "Actions" section.
    - Create a new "Incognito Action".
    - Name it `vote` (or similar). The name should be lowercase and simple.
    - You will be given an **Action ID** (looks like `act_...`). This is your `WLD_ACTION_ID_VOTE`.
4.  **Create an API Key**:
    - In your project settings, generate a new secret API key.
    - This key is confidential and used for server-side verification. This is your `WLD_API_KEY`.

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

    ```env
    # App Info
    NEXT_PUBLIC_APP_NAME=PulseCheck
    NEXT_PUBLIC_WORLD_APP_ENV=staging # Use 'staging' for local dev, 'production' for Vercel

    # World App / MiniKit
    NEXT_PUBLIC_WLD_APP_ID=app_...
    NEXT_PUBLIC_WLD_ACTION_ID_VOTE=act_...
    WLD_API_KEY=wld_... # Server-side secret

    # Database
    NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
    SUPABASE_SERVICE_ROLE_KEY=eyJ... # Server-only secret

    # Operational
    NODE_ENV=development
    ```

### Running the Development Server

1.  **Start the app**:
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

2.  **Seed the database**:
    To populate your database with sample polls, run the seed script.
    ```bash
    pnpm tsx scripts/seed.ts
    ```
    This will add 14 polls to your database, with some scheduled, one live, and others closed.

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
    - Add all the variables from your `.env.local` file.
    - **IMPORTANT**: Set `NEXT_PUBLIC_WORLD_APP_ENV` to `production` for your Vercel deployment. This ensures MiniKit points to the production World ID environment.
4.  **Deploy**: Trigger a deployment. Vercel will build and deploy your application.

### Testing in World App

To test your deployed Mini App inside World App:

1.  Open World App.
2.  Go to the "Explore" tab.
3.  Use the search bar at the top and paste your full Vercel deployment URL (e.g., `https://pulsecheck.vercel.app`).
4.  The app will open in the World App's integrated browser, allowing the World ID connection to work seamlessly.
