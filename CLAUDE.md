# Event Attendance System — agent instructions

Attendance tracking for school events. Next.js App Router + Prisma/SQLite,
deployed on a single laptop over a school LAN for one week at a time.

## Read these before working

| Doing | Read first |
|---|---|
| **Anything UI** | **[`docs/design-system.md`](docs/design-system.md)** + the `/design-system` page — **mandatory** |
| Anything non-trivial | [`docs/architecture.md`](docs/architecture.md), [`docs/conventions.md`](docs/conventions.md) |
| Business rules | [`docs/domain-model.md`](docs/domain-model.md) |
| **Anything in `/reports`** | [`docs/plans/reports-overhaul.md`](docs/plans/reports-overhaul.md) — the approved overhaul plan; follow it rather than redesigning |
| Before calling work done | [`docs/audit/findings.md`](docs/audit/findings.md) — known issues, so you don't "discover" a tracked one |

Task-scoped skills live in `.claude/skills/` and load automatically; see
[`docs/claude-skills.md`](docs/claude-skills.md).

## UI work — the short version

**Consult [`docs/design-system.md`](docs/design-system.md) before creating or
modifying any UI.** Full rules are there; the essentials:

1. Prefer an existing reusable component over writing a new one.
2. Follow the established page-level patterns rather than inventing a layout.
3. Primary colour is Tailwind **indigo-600**; import tokens from
   `globals/constants/designTokens.ts`.
4. The **Students** pages and the `/design-system` page are the canonical
   visual references.
5. Don't introduce new visual styles because they're convenient, and don't
   "bring a page in line with the design system" as an unrequested side effect —
   file an issue instead.

## Hard constraints

- **`useConfirm()` is mandatory** for every irreversible action. No exceptions.
- **Never build Tailwind class names at runtime** — `` `bg-${x}-500` `` ships
  unstyled. Use a static lookup map.
- **There is no automated test suite.** Type-checking and linting passing is not
  evidence a change works. Exercise UI changes in a browser before reporting done.
- Validate with Zod at the API boundary, before any Prisma call.
- Authorization is enforced server-side via the four primitives in
  `globals/utils/auth.ts`. Client-side permission checks are cosmetic only.

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build — run before finishing
pnpm lint           # eslint
npx tsc --noEmit    # typecheck
pnpm db:studio      # inspect the database
```
