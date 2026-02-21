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
