# Remediation Plan

Organized into four phases. **Phase 0 is the only phase relevant to this week.**
Phases 1–3 are backlog by definition — per the audit brief, every recommended change
that is not a release blocker is explicitly called out below as a backlog task, not
something to implement during this audit pass (no code was changed to produce this
document).

---

## Phase 0 — Must fix before beta (this week)

Ordered by dependency, not just severity — HTTPS unblocks the manual verification for
everything else, so it should happen first.

1. **Resolve the HTTP/secure-context problem** ([SEC-01](./security.md#sec-01),
   [SEC-02](./security.md#sec-02)). Decide on and stand up an HTTPS path for the LAN
   deployment (local CA via `mkcert` trusted on each staff device, or a reverse proxy
   that terminates TLS), or explicitly decide to run in a mode that doesn't set the
   `Secure` cookie flag and accept QR scanning is host-laptop-only. Either decision is
   viable; *not deciding* is the actual risk. Rehearse the chosen path on a real second
   device before the event.
2. **Fix the bulk-import transaction** ([DATA-01](./data-integrity.md#data-01)). Pass
   an explicit longer `timeout`/`maxWait` to the `$transaction` call in
   `app/api/bulk-import/students/route.ts`, or restructure it into chunked commits.
   This is a small, contained code change — a good candidate to actually implement this
   week rather than defer, given how directly it blocks roster onboarding.
3. **Resolve the group-vocabulary gap** ([DATA-02](./data-integrity.md#data-02)).
   Confirm the real school's sections/departments/programs/strands/houses against
   `globals/constants/groups.ts` and re-seed with the corrected list *before* any real
   data entry begins, or prepare the Prisma Studio fallback procedure and make sure
   someone on-site can execute it. This is primarily an operational/data task, not a
   code change.
4. **Prepare the four should-fix mitigations as runbook items**, even if no code
   changes: back up the SQLite file periodically during the event
   ([DATA-04](./data-integrity.md#data-04)), disable laptop sleep and keep the server
   process supervised or at least watched ([OPS-08](./operability.md#ops-08)), raise or
   plan around the signup rate limit ([SEC-05](./security.md#sec-05)), and brief admins
   not to change category/groups on approved events that already have attendance
   ([SEC-03](./security.md#sec-03)).
5. **Run the manual verification list and smoke tests** in
   [`release-readiness.md`](./release-readiness.md) end-to-end on real hardware, on the
   real event Wi-Fi, before the event.

Nothing else in this document should be attempted this week — nothing else materially
threatens the beta, and every hour spent on Phase 1+ items is an hour not spent
verifying Phase 0.

---

## Phase 1 — Important post-beta fixes

Backlog. Implement after the beta, informed by whatever actually happened during the
week.

- Guard against editing `category`/`includedGroups` on an approved event that already
  has attendance records ([SEC-03](./security.md#sec-03) /
  [DATA-05](./data-integrity.md#data-05)) — either block the specific fields or require
  an explicit confirmation naming the consequence.
- Add a pre-delete attendance-record check (and correct error message) to
  `DELETE /api/students/[id]`, mirroring the existing event-delete guard
  ([DATA-03](./data-integrity.md#data-03) / [OPS-07](./operability.md#ops-07)).
- Build a minimal self-service password reset flow
  ([OPS-05](./operability.md#ops-05)).
- Build a minimal group-management screen (create/edit `Group` rows) so the
  "destructive reseed or Prisma Studio" workaround from Phase 0 becomes unnecessary
  going forward ([DATA-02](./data-integrity.md#data-02)).
- Add real process supervision for the server (`pm2` or an OS service) instead of the
  Phase 0 manual mitigation ([OPS-08](./operability.md#ops-08)).
- Add a real backup mechanism (scheduled file copy, or an in-app export-everything
  endpoint) instead of the Phase 0 manual copy ([DATA-04](./data-integrity.md#data-04)).
- Widen or remove the signup rate-limit's dependency on `X-Forwarded-For`
  ([SEC-05](./security.md#sec-05)) — e.g., raise the limit permanently, or accept a
  session-based signal instead.

**Explicitly flagged for backlog, not this-week implementation**, per the audit
instructions: every item above.

---

## Phase 2 — Technical debt

Backlog. Lower urgency than Phase 1; mostly consistency and quality-of-life fixes with
no meaningful user-facing risk.

- Add a durable audit trail for record deletion (a table, or at minimum log-to-file
  instead of console-only) ([DATA-10](./data-integrity.md#data-10)).
- Add the missing `res.count > 0` check in `POST /api/records`'s fill-timein branch for
  consistency with its sibling implementations ([DATA-11](./data-integrity.md#data-11)).
- Add `.trim()` to name/ID fields in `studentSchema` and add sensible `.max()` bounds
  across `studentSchema`/`eventSchema` ([DATA-07](./data-integrity.md#data-07),
  [SEC-09](./security.md#sec-09)).
- Detect and reject duplicate student IDs within a single bulk-import batch instead of
  silently resolving to last-wins ([DATA-08](./data-integrity.md#data-08)).
- Add `requireAuth()` to the three currently-unauthenticated `GET` routes for
  consistency ([SEC-06](./security.md#sec-06)).
- Consolidate the duplicated event-authorization logic across
  `POST /api/events` / `PATCH /api/events/[eventId]` / the print page's hand-rolled
  copy (carried forward from the architecture pass, `architecture.md` §17.9) — a
  larger refactor, appropriately deferred.
- Clean up the dead/stale code inventoried in `architecture.md` §19
  (`eventValidation.ts`, `mapStudentToRow.ts`, `useStudentTableControls.ts`,
  `useFetchGroupsForStudent`, the `categoryGroups.ts` leftovers, the incorrect README
  seed credentials) — no functional risk, purely a maintainability cleanup.

---

## Phase 3 — Future improvements

Backlog, longer-horizon. These are the items that require actual architectural change,
not just a patch — correctly out of scope for "fix before beta" per the audit's release
context.

- **Historical eligibility snapshots** ([DATA-06](./data-integrity.md#data-06)) — stop
  recomputing event eligibility live from the current roster; snapshot the eligible set
  at event approval or event start. This is a schema change (a new table or a
  materialized snapshot column) and a meaningful behavior change to how reports work —
  needs its own design discussion, not a quick fix.
- **PostgreSQL migration** ([`postgres-migration.md`](./postgres-migration.md)) — squash
  the SQLite migration history to a fresh Postgres baseline, swap the driver adapter,
  migrate data. Fully deferred; theoretical scale is explicitly out of scope for this
  beta per the audit brief.
- **Server-side pagination and search** — `architecture.md` §17.6–7 already documents
  this as a known constraint; the shared `DataTable` component already has a `manual`
  mode built for exactly this, unused on `main`. Worth doing once student counts or
  concurrent usage grow meaningfully beyond this beta's scale.
- **A real admin console** covering everything currently only reachable via direct
  database access — group management, user management (list/deactivate active
  organizers, not just review pending ones), and system health/config visibility. This
  is the long-term answer to [OPS-06](./operability.md#ops-06)'s "no operator console"
  finding.
- **Horizontal scaling readiness** (shared rate-limit store, connection pooling) — not
  relevant at the stated 2–5 concurrent users; only worth revisiting if usage
  substantially grows beyond this deployment model.
