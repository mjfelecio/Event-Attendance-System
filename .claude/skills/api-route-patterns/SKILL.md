---
name: api-route-patterns
description: The API route shape and error/response conventions for the Event Attendance System (app/api/**/route.ts) — request handling order, Zod validation placement, and the ok()/err() response envelope. Use whenever adding or modifying an app/api route handler.
---

# API Route Patterns

## The shape every authenticated route follows — no exceptions found

```ts
export async function POST(req: Request) {
  try {
    const user = await requireAuth();                    // 1. who is this
    const payload = someSchema.parse(await req.json());   // 2. is the body valid
    // 3. authorization asserts (role/ownership/visibility/status) — see the
    //    auth-and-authorization skill for which primitive to use
    // 4. prisma call(s)
    return NextResponse.json(ok(result), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
```

Match this order — auth, then validate, then authorize, then persist — for any new
route. Route params are `Promise`-typed in this Next.js version:
`{ params }: { params: Promise<{ id: string }> }`, `const { id } = await params`.

## Response envelope — always `ok()`/`err()`, never raw JSON

`globals/utils/api.ts` defines the wire format:
`{ success: true, data } | { success: false, message, code? }`. Every route returns
`NextResponse.json(ok(data))` or lets `respondWithError` build the failure response.
The client's `fetchApi<T>()` unwraps this envelope and throws a typed `ApiError` on
`success: false` — if a new route returns raw JSON without this envelope, client-side
fetches for it will break silently (the `!json.success` check will misfire).

## Error handling — throw, let `respondWithError` classify it

`globals/utils/httpError.ts`'s `respondWithError` is the catch-all: `AuthError` → its
own status, `ZodError` → 400, everything else → `handlePrismaError`
(`P2002`→409 conflict, `P2025`→404 not found, `P2003`→400 FK violation, `P2000`→400,
default→500). Use this for a new route rather than hand-building error responses.

**Exception you'll see in the codebase, don't extend it**: three routes
(`app/api/groups/route.ts`, `app/api/groups/byCategory/[category]/route.ts`,
`app/api/stats/student-counts/route.ts`) skip `requireAuth()` and don't use
`respondWithError` — this is deliberate-by-omission for low-sensitivity, unauthenticated
data (`SEC-06`, low severity), not a pattern to copy for anything that returns real data.

**When the client needs to branch on a specific failure** (not just show a generic
error), attach a `code` via `err(message, "SOME_CODE")` and have the client check
`error.code === "SOME_CODE"` — see how `EVENT_HAS_RECORDS`, `NO_TIME_IN`,
`INVALID_GROUPS`, `DUPLICATE` are used. Don't string-match on `error.message` to detect
a condition (one legacy spot does this in `AttendanceSection.tsx` — don't extend it).

## Validation schema placement

Three coexisting patterns — pick based on reuse, not preference:
1. **Shared across a form and one+ routes** → `globals/schemas/` (e.g.
   `studentSchema.ts`, reused by `POST /api/students`, bulk import, and the client form).
2. **Shared, single route** → also `globals/schemas/` (e.g. `eventSchema` in
   `globals/schemas/index.ts`).
3. **Route-local, no client form counterpart** → define inline in the route file,
   unexported (most action/decision payloads).

**Known trap**: `app/api/events/[eventId]/route.ts` has its own inline `patchSchema`
that independently duplicates `eventSchema`'s shape by hand rather than importing it.
If you change what an event edit accepts, you must update **both** schemas — this is a
tracked inconsistency (see `docs/conventions.md`'s "How do I validate request data?"),
not something to "helpfully" consolidate as a drive-by change inside an unrelated task.

Neither `.max()` upper bounds nor `.trim()` exist on any schema in this codebase
(`SEC-09`, `DATA-07`) — this is an oversight, not a considered convention. Adding both
to a new schema is a reasonable improvement, not a deviation.

## The event-routes duplication — a specific trap to know about

Event create/update logic is split across `POST /api/events` (create + update-by-id,
used by the drawer and calendar drag/resize) and `PATCH /api/events/[eventId]`
(workflow actions like `SUBMIT`/`APPROVE`/`REJECT`, plus a separate content-edit
fallback). Both independently re-implement ownership/status authorization. If your task
touches event editing or authorization rules, **check and update both files** — see
`docs/architecture.md` §17.9 for the full history of why this duplication exists.
Don't "fix" this duplication as an incidental part of an unrelated task; it's tracked
as backlog technical debt (`docs/audit/remediation-plan.md` Phase 2), and consolidating
it is a deliberate, scoped refactor, not a quick cleanup.

For everything else about this codebase's Prisma/query conventions, see the
`prisma-and-database` skill. For authorization primitives, see `auth-and-authorization`.
