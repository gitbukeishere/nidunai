# Nidun AI

AI-written text detector for students. Trilingual UI: **English**, **Russian**, **Mongolian**.

> Status: **scaffold only**. The detection logic at `POST /api/detect` is a randomised mock with a 1.5 s artificial delay so the loading and result UI states are exercisable end-to-end. Plug in real detection later by calling the FastAPI service from this route.

---

## Architecture

| Layer | Choice |
|---|---|
| Frontend hosting | **Vercel** |
| Framework | Next.js 15 (App Router, TypeScript, `src/`) |
| Backend (MVP) | **Next.js API routes** (same Vercel deployment) |
| Database / Auth / Storage | **Supabase** (Postgres + Auth + Storage) |
| AI model backend (later) | **FastAPI**, hosted separately (e.g. Fly.io / Render / Modal) |
| Styling | Tailwind v4 + shadcn/ui (slate, CSS variables) |
| i18n | next-intl 4 with `[locale]` dynamic segment routing |
| Validation | Zod |
| Package manager | pnpm |

```
[ Browser ]
    │
    ▼
[ Vercel — Next.js (frontend + /api routes) ]
    │                 │
    │ auth/db/storage │ inference
    ▼                 ▼
[ Supabase ]      [ FastAPI (separate host) ]
```

The Next.js API routes are the single backend surface the browser talks to. They call Supabase for auth/data/storage and forward inference requests to the FastAPI service when it's ready. Keeping the model out of the Vercel function lets us pick a host with GPUs / longer timeouts without touching the web app.

---

## Prerequisites

- **Node.js 20+** (Node 22 recommended)
- **pnpm 9+** — install with `corepack enable && corepack prepare pnpm@latest --activate`, or `npm i -g pnpm`
- A **Supabase** project (free tier is fine for MVP)

---

## Setup

```bash
pnpm install
cp .env.local.example .env.local
# fill in Supabase values (see below)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware redirects `/` to your default locale (`/en`).

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill these in.

### Client (browser-exposed)

Get them from **Supabase Dashboard → Project Settings → API**:

| Var | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public API key |

### Server-only

| Var | Source |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret key — **never** expose to the browser |
| `AI_BACKEND_URL` | Base URL of the FastAPI service (set later, when it exists) |

---

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server on `:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |

---

## Routes

| Path | Purpose |
|---|---|
| `/` | Redirects to `/en` (or `/ru`, `/mn` based on `Accept-Language`) |
| `/[locale]` | Landing page — hero + "Try the detector" CTA |
| `/[locale]/detector` | Textarea (≥ 100 chars) → submit → AI score + per-sentence highlights |
| `POST /api/detect` | Zod-validated. Body: `{ text: string ≥100, language: "en" \| "ru" \| "mn" }`. Returns `{ aiScore, humanScore, sentences: [{ text, aiProbability }] }` after a 1.5 s delay. **Mock — does not call any model.** |

---

## Project layout

```
src/
├── middleware.ts                  # next-intl locale routing
├── i18n/                          # routing, navigation, request config
├── app/
│   ├── [locale]/                  # all user-facing pages
│   │   ├── layout.tsx
│   │   ├── page.tsx               # landing
│   │   └── detector/page.tsx
│   └── api/detect/route.ts        # mock detector endpoint (will proxy to FastAPI)
├── components/
│   ├── nav.tsx
│   ├── language-switcher.tsx
│   ├── detector/                  # detector-form + detector-result
│   └── ui/                        # shadcn primitives
└── lib/
    ├── utils.ts                   # cn()
    ├── detect-schema.ts           # shared Zod schema + types
    └── supabase/
        ├── client.ts              # browser client (anon key)
        ├── server.ts              # SSR client (cookie-bound, RLS-respecting)
        └── admin.ts               # service-role client (server-only, bypasses RLS)
```

---

## Deploying

1. Push the repo to GitHub.
2. Import it into **Vercel** — framework auto-detected as Next.js.
3. Add the env vars above in Vercel **Project Settings → Environment Variables** for Production and Preview.
4. Deploy.

The FastAPI service is deployed independently on its own host once the model is ready; the API route reads `AI_BACKEND_URL` to find it.

---

## Replacing the mock detector

When the FastAPI service is ready, edit `src/app/api/detect/route.ts` to forward the validated request to `${process.env.AI_BACKEND_URL}/detect` and return its response. The Zod schema in `src/lib/detect-schema.ts` is shared between client and server, so changing the request/response shape updates both.
