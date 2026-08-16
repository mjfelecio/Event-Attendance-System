# Findings — Master List

Audit pass against `main` at commit `a3896e8`, read-only (no code changed). Companion
reading: [`architecture.md`](../architecture.md), [`domain-model.md`](../domain-model.md).

Every finding has a stable ID (`SEC-nn`, `DATA-nn`, `OPS-nn`) reused verbatim in
[`security.md`](./security.md), [`data-integrity.md`](./data-integrity.md), and
[`operability.md`](./operability.md), which give each one fuller treatment. This
document is the flat index: severity, one-line problem, location, and status.

**Confidence key** — CONFIRMED: the code demonstrably allows the problem, verified by
reading the exact logic. LIKELY: the implementation strongly suggests the problem but
it depends on a runtime condition (data volume, network topology) not exercised in this
static pass. POSSIBLE: a suspicious pattern exists but reachability through the app's
current write paths is unclear or improbable.

Severity follows the brief's calibration: **P0/P1 are reserved for issues that
materially affect this specific one-week beta** — not theoretical scale, not
enterprise hardening. Three root causes account for every P0.

---

## P0 — Release blockers

| ID | Category | Title | Confidence |
|---|---|---|---|
| [SEC-01](./security.md#sec-01) | Security / Deployment | `Secure` cookie flag drops sessions on LAN HTTP in production builds | CONFIRMED (code) / LIKELY (manifests as described) |
| [SEC-02](./security.md#sec-02) | Security / Deployment | QR camera cannot open on any non-`localhost` device over HTTP | CONFIRMED (platform spec) / LIKELY |
| [DATA-01](./data-integrity.md#data-01) | Data integrity | Bulk student import has no custom transaction timeout; likely fails outright at 2,000+ rows | CONFIRMED (code) / LIKELY (scale) |
| [DATA-02](./data-integrity.md#data-02) | Data integrity / Operability | No way to add a missing `Group` (section/department/etc.) without a fully destructive reseed or a direct DB edit | CONFIRMED |

All four trace back to three root causes: **(1)** the app is being run over plain HTTP
on a LAN, which two independent browser platform rules punish; **(2)** the only bulk
roster-loading path was never load-tested at the stated scale; **(3)** there is no
supported way to extend the school's group vocabulary once seeded. None require a
redesign to fix — see [`remediation-plan.md`](./remediation-plan.md) Phase 0.

---

## P1 — Should fix before beta

| ID | Category | Title | Confidence |
|---|---|---|---|
| [SEC-03](./security.md#sec-03) / [DATA-05](./data-integrity.md#data-05) | Authorization / Data integrity | Admin can silently change an APPROVED event's category/audience after attendance already exists | CONFIRMED |
| [SEC-05](./security.md#sec-05) / [OPS-03](./operability.md#ops-03) | Security / Operability | Signup rate limit is a single network-wide bucket (5 signups / 10 min, for everyone) | CONFIRMED |
| [DATA-04](./data-integrity.md#data-04) | Data integrity | No backup strategy for the single SQLite file | CONFIRMED (absence) |
| [OPS-08](./operability.md#ops-08) | Operability | No process supervision for the server — closing the terminal or laptop sleep takes down attendance for everyone | CONFIRMED (absence) |

---

## P2 — Important backlog items

| ID | Category | Title | Confidence |
|---|---|---|---|
| [DATA-03](./data-integrity.md#data-03) / [OPS-07](./operability.md#ops-07) | Data integrity / Operability | Deleting a student with attendance history gives a misleading error message | CONFIRMED |
| [DATA-06](./data-integrity.md#data-06) | Data integrity | Eligibility is always computed live — roster corrections retroactively rewrite past events' reports | CONFIRMED (by design) |
| [OPS-05](./operability.md#ops-05) | Operability | No self-service password reset — recovery is a direct DB edit | CONFIRMED (absence) |
| [OPS-06](./operability.md#ops-06) | Operability | Settings page is a placeholder; almost nothing is fixable in-app | CONFIRMED |

---

## P3 — Minor improvements

| ID | Category | Title | Confidence |
|---|---|---|---|
| [SEC-06](./security.md#sec-06) | Security | Three `GET` endpoints require no authentication (low-sensitivity data) | CONFIRMED |
| [SEC-09](./security.md#sec-09) | Security | No upper-bound length validation on text fields | CONFIRMED |
| [DATA-07](./data-integrity.md#data-07) | Data integrity | Names/IDs are not trimmed — stray whitespace from CSV import passes validation | CONFIRMED |
| [DATA-08](./data-integrity.md#data-08) | Data integrity | Duplicate student ID within one import batch is silently resolved to "last wins," no warning | CONFIRMED |
| [DATA-09](./data-integrity.md#data-09) | Data integrity | "One group per category" is assumed, not enforced, by the schema | POSSIBLE (unreachable via reviewed UI paths) |
| [DATA-10](./data-integrity.md#data-10) | Data integrity | Record deletion audit trail is console-only, lost on restart | CONFIRMED (by design) |
| [DATA-11](./data-integrity.md#data-11) | Data integrity | `POST /api/records` "fill missing timein" branch reports `changed:true` without checking the affected-row count | CONFIRMED (code) / not reachable via current UI paths found |
| [OPS-09](./operability.md#ops-09) | Operability | Calendar hides past dates entirely; a completed event is invisible there (only in Reports) | CONFIRMED |
| [OPS-10](./operability.md#ops-10) | Operability | "Time In" button in normal mode never shows a done state, even when already recorded | CONFIRMED |
| [OPS-11](./operability.md#ops-11) | Operability | No clock-sync verification — a wrong host clock silently produces wrong timestamps | CONFIRMED (absence) |

---

## P4 — Optional / nice-to-have

| ID | Category | Title | Confidence |
|---|---|---|---|
| [SEC-07](./security.md#sec-07) | Security | Minor timing side-channel on login (email enumeration) | CONFIRMED (code) / low real-world impact |
| [SEC-08](./security.md#sec-08) | Security | No CSRF token (SameSite=Lax is the only mitigation) | CONFIRMED (absence), low risk for this app's request patterns |
| [SEC-10](./security.md#sec-10) | Security | Student ID is only length-validated, not charset-validated | CONFIRMED |
| [OPS-12](./operability.md#ops-12) | Operability | QR scan debounce is global, not per-event; a same-student scan across an event switch within 1s could be dropped | CONFIRMED (code), edge case |

---

## Everything already known and intentionally out of scope for P0/P1

The prior architecture pass already documented a set of accepted, deliberate
simplifications (no horizontal scaling, no server-side pagination/search, duplicated
authorization logic across `POST /api/events` / `PATCH /api/events/[eventId]` / the
print page, stale/dead code, console-only rate limiting). This audit re-verified all of
them against the current code and found no material change to their status. They are
carried forward at their existing (low) severity in the relevant specialized documents
rather than re-litigated here. See `architecture.md` §17–19 for the full list.

---

## Coverage note

This pass read every `app/api/**/route.ts` handler, every file under `globals/utils/`
and `globals/schemas/`, the full attendance/QR component tree, the calendar
create/edit/drag/resize path, the print page and its server-side authorization copy,
the reports list/table/export path, both dashboards, all 13 Prisma migrations, and the
seed script. It did not execute the application — every "LIKELY" item needs the runtime
verification listed in [`release-readiness.md`](./release-readiness.md).
