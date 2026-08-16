---
name: auth-and-authorization
description: Authentication and authorization rules for the Event Attendance System — session cookie model, the four server-side authorization primitives, role/status model, and known gaps. Use whenever touching login/signup/session code, any app/api route's permission checks, or anything that decides who can see or do what.
---

# Auth & Authorization

## The session model

Custom cookie auth — no NextAuth/Clerk/library. `globals/utils/auth.ts` is the entire
implementation: an HMAC-SHA256-signed cookie (`timingSafeEqual` comparison, 7-day
expiry checked server-side independent of the browser's `Max-Age`). Role and status are
**re-read from the database on every request** via `getFreshAuthSession()`, never
trusted from the cookie payload alone — demoting or rejecting a user takes effect on
their very next request, not after their cookie expires. Don't "optimize" this into a
cookie-trusts-everything model; the re-read is intentional.

Roles: `ORGANIZER` | `ADMIN`. Status: `PENDING` | `ACTIVE` | `REJECTED`. Signup **always**
creates `ORGANIZER` + `PENDING` — there is no path in the app to create an `ADMIN`
account or to self-approve. First-admin bootstrapping is a seed/manual-DB-edit
operation, not an app feature; don't add a "become admin" flow without recognizing
that's a deliberate absence, not an oversight.

## The four authorization primitives — use these, don't hand-roll checks

All in `globals/utils/auth.ts`. This is the **one convention in the codebase with zero
exceptions** — every authenticated route uses these, in roughly this order:

| Primitive | Use it when... |
|---|---|
| `requireAuth()` | any protected route needs to know who's calling |
| `requireRole(user, "ADMIN")` | the action is admin-only (approve/reject organizers or events) |
| `assertEventOwnership(event, user)` | requires being the event's creator (or admin) — edit, delete, toggle timeout, delete a record |
| `assertEventVisibility(event, user)` | requires only being able to *see* the event — owner, admin, or the event is `APPROVED` |
| `assertEventStatus(event, allowed)` | the action is only valid in certain workflow states |

They throw (`AuthError`); let them — the calling route's `catch { respondWithError(error) }`
maps it to the correct HTTP status. **Never write an equivalent `if` check inline in a
new route** — import these.

## Client-side "permission" checks are not a security boundary

`canEditEvent`, `canManage`, `isReadOnlyView`, and similar client-side booleans exist
**purely to hide/disable UI controls the server would reject anyway** — they are UX
polish, not enforcement. If you add a new authorization rule, it must be enforced
server-side via the primitives above; a client mirror is optional (usually a good idea
for UX) but never sufficient on its own. This codebase currently has **no**
client-side-only authorization bypass anywhere — keep it that way.

Similarly, `app/(main)/layout.tsx`'s redirect-to-login-if-no-session check is a UX
convenience that runs client-side, after the page already shipped to the browser — it
is not what protects data. Any new page that needs a real security boundary (e.g. a
server component doing its own Prisma queries) must call `getFreshAuthSession()` and
check status/role itself, the way `app/(main)/reports/events/[id]/print/page.tsx`
already does.

## Known gaps — do not treat these as bugs to silently fix, and do not treat them as acceptable to copy elsewhere

- **SEC-03**: an admin can edit an `APPROVED` event's `category`/`includedGroups` even
  after it has attendance records, with no guard — even though the analogous delete
  path (`EVENT_HAS_RECORDS`) does guard against this. This silently changes which
  students count as "eligible" for a past event. See
  `docs/audit/security.md#sec-03` and `docs/audit/data-integrity.md#data-05` for the
  full writeup before touching event-edit authorization — the recommended fix (block
  `category`/`includedGroups` changes when `attendanceCount > 0`) is scoped and
  documented there; don't invent a different fix without reading it first.
- **Duplicated authorization logic**: `POST /api/events` and
  `PATCH /api/events/[eventId]` both independently implement the same
  ownership/status rules for event edits, and the print page
  (`app/(main)/reports/events/[id]/print/page.tsx`) carries its own hand-rolled copy of
  `assertEventVisibility` because it bypasses the API layer entirely. **If you change
  an authorization rule for events, you must change it in all relevant places** — check
  `docs/conventions.md`'s "How do I add an API endpoint?" section for the exact list.
- **Deployment-breaks-auth gap (SEC-01)**: the session cookie sets `secure: true`
  whenever `NODE_ENV === "production"`. On this app's actual LAN-HTTP deployment (no
  reverse proxy, no TLS), browsers silently drop that cookie on every device except the
  host laptop — every other device appears to log in, then immediately acts logged out.
  This is a **deployment/infrastructure problem, not a code bug** — see
  `docs/audit/security.md#sec-01` and `docs/audit/release-readiness.md` before changing
  cookie flags. Don't "fix" it by setting `secure: false` unconditionally without
  understanding the tradeoff that document lays out.

## Rate limiting

`globals/utils/rateLimit.ts` is in-process (a `Map`), fixed-window, and **only
meaningful with exactly one Node process** — this app's actual deployment. The
`clientKey()` fallback resolves to the literal string `"local"` for every device on
this LAN deployment (no reverse proxy sets `X-Forwarded-For`), which means the signup
limiter is a single shared bucket for the whole network, not per-person (`SEC-05`).
Don't assume this is per-client without checking; don't add a distributed rate limiter
for this app's actual scale (2–5 concurrent users) — that's solving a problem this
deployment doesn't have.
