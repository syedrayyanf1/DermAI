# DermaTrack AI

AI-powered acne progression tracking platform using Next.js, Supabase, and Gemini Vision.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini
- A [Vercel](https://vercel.com) account for deployment

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon (public) key** from Settings → API.
3. Note your **service_role key** from Settings → API (keep secret).

### Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard.
2. Paste the contents of `supabase/schema.sql` and run it.

### Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard.
2. Click **New Bucket**.
3. Name: `skin-images`
4. Set to **Private** (not public).
5. Click **Create Bucket**.

### Storage RLS Policies

Go to **Storage → skin-images → Policies** and add:

**Upload policy** (INSERT):
```sql
bucket_id = 'skin-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Read policy** (SELECT):
```sql
bucket_id = 'skin-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

### Enable Auth

1. Go to **Authentication → Providers**.
2. Ensure **Email** provider is enabled.
3. Optionally disable "Confirm email" for faster dev testing under Authentication → Settings.

## 2. Gemini API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/app/apikey).
2. Create an API key.
3. Save it for your environment variables.

## 3. Local Development

```bash
# Clone the repo
git clone <your-repo-url>
cd dermatrack-ai

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Fill in .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
# GEMINI_API_KEY=AI...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Deploy to Vercel

### Via Vercel CLI

```bash
npm i -g vercel
vercel
```

### Via Vercel Dashboard

1. Push code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Set **Framework Preset** to Next.js.
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` → your Vercel domain
6. Deploy.

### Update Supabase Auth Redirect

Go to Supabase → Authentication → URL Configuration:
- Set **Site URL** to your Vercel URL (e.g., `https://dermatrack.vercel.app`)
- Add the URL to **Redirect URLs**

## Architecture

```
Browser → Next.js App Router → API Routes → Supabase (DB + Storage)
                                          → Gemini Vision API
```

- Images uploaded to Supabase Storage (private, signed URLs)
- Gemini called server-side only (API key never exposed)
- RLS ensures users only access their own data
- All analysis results validated with Zod before storage

## Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Frontend   | Next.js 14, Tailwind  |
| Charts     | Recharts              |
| Auth       | Supabase Auth         |
| Database   | Supabase PostgreSQL   |
| Storage    | Supabase Storage      |
| AI         | Gemini 1.5 Pro Vision |
| Validation | Zod                   |
| Hosting    | Vercel                |
