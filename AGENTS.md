# Agent Instructions

- Repository now contains a runnable Turborepo workspace with `apps/web` and `packages/shared`.
- Common commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm lint`
  - `pnpm test`
  - single test example: `pnpm --filter @vetea/shared test -- price`
- Architecture: planned Turborepo monorepo with `apps/web` (Next.js 15 App Router) and `packages/shared` (types, Zod schemas, utilities).
- Data layer: MongoDB with Mongoose; server actions for mutations; API routes for webhooks/external callbacks.
- Auth: Clerk with middleware and webhook verification.
- **Clerk**: Use `clerkMiddleware()` in `middleware.ts`, wrap app with `<ClerkProvider>`, use only `@clerk/nextjs` and `@clerk/nextjs/server` (App Router only; no `authMiddleware`, `_app.tsx`, or `pages/` sign-in). Real keys in `.env.local` only; use placeholders in snippets/docs. See `.cursor/rules/clerk-nextjs-app-router.mdc`. Quickstart: https://clerk.com/docs/nextjs/getting-started/quickstart. For Vercel **Production** and **Preview** env setup (env vars, redirect URLs, webhooks), see [docs/setup/clerk-vercel-setup.md](docs/setup/clerk-vercel-setup.md).
- Important plan reference: `plans/nextjs-bubble-tea-plan.md` outlines routes, components, and data models.
- Styling: Tailwind CSS with shadcn/ui components.
- Code style: TypeScript strict mode, prefer server components by default, use `'use client'` only where interactivity is needed.
- Imports: keep absolute/alias imports once tsconfig paths are configured; group external, internal, relative.
- Naming: PascalCase for components/types, camelCase for functions/vars, kebab-case for route folders.
- Types: use shared `packages/shared` types and Zod schemas; avoid `any`.
- Error handling: server actions return typed `{ success, message, data }`; API routes return proper status codes.
- Formatting: rely on ESLint + Prettier once configured; keep JSX tidy and readable.
- Caching: explicitly set Next.js `fetch` cache options (Next 15 default is `no-store`).
- Testing: Vitest + React Testing Library planned; Playwright optional for E2E.
- **VETEA mockup images**: Use the canonical mold only. Rule `.cursor/rules/vetea-mockup-generation.mdc` applies when generating mockups under `docs/assets/`. Always use `docs/assets/vetea-mockup-mold.json` (base prompt) and `docs/assets/preview/vetea-mockup-mold-reference.png` (reference image); vary only the page-specific content.
- No additional tool rules found (.cursor rules, CLAUDE.md, Windsurf, Cline, Goose, Copilot instructions).

## Cursor Cloud specific instructions

- **MongoDB**: A local MongoDB 8.0 instance is required. Install with the official apt repo for Ubuntu 24.04 (Noble), then start with `sudo mongod --fork --logpath /var/log/mongod.log --dbpath /data/db`. The app connects via `MONGODB_URI` in `.env.local`.
- **Environment variables**: Create `apps/web/.env.local` with `MONGODB_URI`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `NEXT_PUBLIC_APP_URL=http://localhost:3000`. The Clerk and MongoDB secrets should be provided via Cursor Secrets.
- **Build scripts**: The root `package.json` includes `pnpm.onlyBuiltDependencies` to allow build scripts for `@clerk/shared`, `esbuild`, `sharp`, and `unrs-resolver` without interactive approval.
- **Dev server IPv6**: The Next.js dev server binds to IPv6 (`:::3000`). Use `http://[::1]:3000` for curl; browsers resolve `localhost` correctly.
- **Shared package**: `@vetea/shared` must be built (`pnpm --filter @vetea/shared build`) before the web app compiles. Turborepo task dependencies handle this automatically via `pnpm dev` or `pnpm build`.
- **Seeding**: Run `pnpm --filter web seed` to populate MongoDB with 12 sample drinks (requires `.env` and `.env.local` in `apps/web`). If `apps/web/.env` doesn't exist, create an empty one: `touch apps/web/.env`.
- **Next.js cache**: If you see stale chunk errors (e.g. `Cannot find module '/vendor-chunks/...'`) after dependency changes, delete `apps/web/.next` and restart the dev server.
- **Dev server startup**: Use `pnpm --filter web dev` (not bare `next dev`) since `next` isn't on `PATH` outside pnpm. Allow ~15s for initial compilation before curling routes.
- **SKIP_ENV_VALIDATION**: Set `SKIP_ENV_VALIDATION=1` in `apps/web/.env` (or export it) when running `pnpm lint`, `pnpm typecheck`, or `pnpm build` without fully configured Clerk/MongoDB secrets. The `@t3-oss/env-nextjs` validation in `lib/env.ts` will otherwise fail at import time.
- **Stripe (optional)**: `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are optional in `lib/env.ts`. When absent, the checkout flow defaults to "Pay at Pickup" and `POST /api/checkout` returns 501. No `stripe` npm package is needed until real keys are provisioned.
- **Common commands**: See the top-level section above for `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`.
- **public/ directory**: The root `.gitignore` ignores `public` (Gatsby default). Files in `apps/web/public/` must be added with `git add -f`. The service worker at `apps/web/public/sw.js` is already force-tracked.
- **PWA service worker**: The SW at `public/sw.js` registers only in production or when `NEXT_PUBLIC_ENABLE_SW=1` is set. The `ServiceWorkerRegistration` component in the root layout handles registration and shows an update toast via sonner.