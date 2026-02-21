# VETEA Bubble Tea App

Monorepo for the VETEA bubble tea ordering experience.

## Stack

- `apps/web`: Next.js App Router app (TypeScript + Tailwind)
- `packages/shared`: shared types, schemas, constants, utilities, and Mongoose models
- Turborepo + pnpm workspace

## Quick Start

```bash
pnpm install
pnpm dev
```

## Common Commands

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Run a single test:

```bash
pnpm --filter @vetea/shared test -- price
```

## Deploying to Vercel

This is a monorepo; the Next.js app lives in `apps/web`. In your Vercel project:

1. **Root Directory**: Set to **`apps/web`** (required so Vercel finds the Next.js app).
2. **Install** runs from the repo root automatically; **Build** uses Turborepo from `apps/web/vercel.json`.

Then add your env vars in Vercel (e.g. from `apps/web/.env.local.example`).
