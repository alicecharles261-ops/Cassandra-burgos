# Cassandra Burgos — Real Estate Website

A concierge real estate agent website for Cassandra Burgos, serving the Dallas–Fort Worth Metroplex. Built with TanStack Start (SSR), React 19, TypeScript, Tailwind CSS, and Supabase.

## Stack

- **Framework**: TanStack Start (SSR) + TanStack Router
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (Radix UI)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build**: Vite 8 via `@lovable.dev/vite-tanstack-config`
- **Runtime**: Node.js 22 (required — Supabase needs native WebSocket)

## Running the app

```sh
npm run dev      # dev server at http://localhost:5000
npm run build    # production build
npm run preview  # preview production build
```

The dev workflow is configured as **Start application** (`npm run dev`) on port 5000.

## Environment variables

Supabase credentials are stored in `.env` (publishable keys — safe to commit):

- `VITE_SUPABASE_URL` / `SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID` / `SUPABASE_PROJECT_ID`

## Key directories

- `src/routes/` — file-based routes (TanStack Router)
- `src/components/` — shared UI components
- `src/hooks/` — React hooks including `use-auth.tsx`
- `src/integrations/supabase/` — Supabase client, auth middleware, and generated types
- `src/lib/` — site data constants and server functions
- `supabase/migrations/` — database schema migrations

## Notes

- **Node.js 22 is required**: Supabase Realtime uses native WebSocket which is only available in Node.js 22+. Node.js 20 will cause SSR to fail and fall back to a blank client-rendered page.
- The vite config overrides `host: "0.0.0.0"` and `port: 5000` to work in the Replit sandbox (the Lovable default of `:::8080` uses IPv6, which Replit doesn't support).

## User preferences

_No preferences recorded yet._
