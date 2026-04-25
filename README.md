# Nidun AI

AI-written text detector for students. Trilingual UI: **English**, **Russian**, **Mongolian**.

> Status: **scaffold only**. The detection logic at `POST /api/detect` is a randomised mock with a 1.5 s artificial delay so the loading and result UI states are exercisable end-to-end. Plug in real detection later behind the same Zod-validated contract.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript, `src/`) |
| Styling | Tailwind v4 + shadcn/ui (slate, CSS variables) |
| i18n | next-intl 4 with `[locale]` dynamic segment routing |
| Validation | Zod |
| Backend SDKs | Firebase v12 (client) + firebase-admin v13 (server) |
| Package manager | pnpm |

---

## Prerequisites

- **Node.js 20+** (Node 22 recommended)
- **pnpm 9+** — install with `corepack enable && corepack prepare pnpm@latest --activate`, or `npm i -g pnpm`

---

## Setup

```bash
pnpm install
cp .env.local.example .env.local
# fill in Firebase values (see below) — placeholder values work for visual smoke testing
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware redirects `/` to your default locale (`/en`).

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill these in:

### Client (browser-exposed) — `NEXT_PUBLIC_FIREBASE_*`

Get them from **Firebase Console → Project Settings → General → Your apps → Web app config**:

| Var | Where it lives in the Firebase config |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` |

### Admin (server-only) — `FIREBASE_ADMIN_*`

Generate at **Firebase Console → Project Settings → Service Accounts → Generate new private key**. Open the downloaded JSON and copy:

| Var | JSON field |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | `project_id` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `client_email` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `private_key` (wrap in quotes; keep `\n` escapes — the loader converts them) |

> The scaffold pages don't call Firebase yet, so the app renders fine with placeholder values. Real values are needed before adding Auth, Firestore reads/writes, or Storage uploads.

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
│   └── api/detect/route.ts        # mock detector endpoint
├── components/
│   ├── nav.tsx
│   ├── language-switcher.tsx
│   ├── detector/                  # detector-form + detector-result
│   └── ui/                        # shadcn primitives
└── lib/
    ├── utils.ts                   # cn()
    ├── detect-schema.ts           # shared Zod schema + types
    └── firebase/
        ├── client.ts              # browser SDK init
        └── admin.ts               # server SDK init (lazy, env-driven)
```

---

## Replacing the mock detector

When you're ready to plug in real detection, edit `src/app/api/detect/route.ts`. The Zod schema in `src/lib/detect-schema.ts` is shared between client and server, so changing the request/response shape updates both.
