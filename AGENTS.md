# Agent Instructions

- Repository currently contains planning docs only; no runnable app code or package manifests yet.
- Build/lint/test commands are not defined; once the Next.js workspace is created, document `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`, and a single test like `pnpm test -- <pattern>` here.
- Architecture: planned Turborepo monorepo with `apps/web` (Next.js 15 App Router) and `packages/shared` (types, Zod schemas, utilities).
- Data layer: MongoDB with Mongoose; server actions for mutations; API routes for webhooks/external callbacks.
- Auth: Clerk with middleware and webhook verification.
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
- No additional tool rules found (.cursor rules, CLAUDE.md, Windsurf, Cline, Goose, Copilot instructions).