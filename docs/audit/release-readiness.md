# Release Readiness

**Question:** Can we safely give this application to unrelated people to operate at
the event next week?

**Answer: Conditionally yes — but not as-is today.** The core attendance ledger
(scanning, duplicate prevention, time-in/time-out, authorization) is solid engineering
and doesn't need rework. What stands between this codebase and a safe beta is three
narrow, fixable problems, all catchable *this week* with focused effort, plus a short
list of operational (non-code) preparation. None of the three requires a redesign.

If those three are resolved and the smoke tests below pass on the real host laptop and
real staff devices, this is releasable. If they aren't resolved, the most likely
failure mode isn't data corruption — it's **the app appearing broken on every device
except the host laptop**, because of how HTTP behaves on a LAN, and **onboarding
2,000 students failing outright**, because of the bulk-import transaction and the
group-vocabulary gap.

---

## Release blockers (must be resolved before the event)

> **Tracked as GitHub Issues.** Umbrella:
> [#52](https://github.com/mjfelecio/Event-Attendance-System/issues/52). Individual
> blockers linked in the table below. This document is the reasoning; the issues are
> the checklist.

| ID | Issue | What breaks if unresolved | Tracked |
|---|---|---|---|
| [SEC-01](./security.md#sec-01) | `Secure` cookie flag on a `next start` production build drops sessions over LAN HTTP | Every device except the host laptop can't stay logged in | [#37](https://github.com/mjfelecio/Event-Attendance-System/issues/37) |
| [SEC-02](./security.md#sec-02) | QR camera requires a secure context; LAN HTTP doesn't qualify | QR scanning doesn't work on any device except the host laptop | [#37](https://github.com/mjfelecio/Event-Attendance-System/issues/37) |
| SEC-11 | `AUTH_SECRET` unset; production build throws on login, surfacing as `500 "Database error occurred."` | Login fails with an error naming the wrong subsystem | [#37](https://github.com/mjfelecio/Event-Attendance-System/issues/37) |
| [DATA-01](./data-integrity.md#data-01) | Bulk import transaction has no timeout override; likely fails at 2,000+ rows | Cannot load the real student roster in one operation | [#38](https://github.com/mjfelecio/Event-Attendance-System/issues/38) |
| [DATA-02](./data-integrity.md#data-02) | No way to add a missing `Group` (section/department/etc.) without a destructive reseed | Bulk import hard-rejects the entire batch if the seeded vocabulary doesn't match the real school | [#39](https://github.com/mjfelecio/Event-Attendance-System/issues/39) |

**SEC-01, SEC-02, and SEC-11 share one trigger**: switching to a production build for
the LAN deployment. Getting onto HTTPS (or an equivalent secure-context workaround) plus
setting `AUTH_SECRET` resolves all three. This is the single highest-leverage thing to
resolve this week — it's an infrastructure/ops decision, not a large code change.

**DATA-01 and DATA-02 both live on the path of "get the real roster into the system"**
— the one task that absolutely must succeed before doors open. Resolve both before
attempting the real import, and do a full-scale rehearsal (see smoke tests below), not
a small sample.

---

## Must-fix-before-beta (strongly recommended, not hard blockers)

| ID | Issue | Why it's not a hard blocker | Tracked |
|---|---|---|---|
| [SEC-03](./security.md#sec-03) / [DATA-05](./data-integrity.md#data-05) | Admin can silently rescope an approved, already-recorded event | Requires deliberate admin action; brief admins not to change category/groups on live events as an interim mitigation | [#40](https://github.com/mjfelecio/Event-Attendance-System/issues/40) |
| [SEC-05](./security.md#sec-05) / [OPS-03](./operability.md#ops-03) | Signup rate limit is a single network-wide bucket | Workaround: space out organizer signups by >10 minutes during onboarding | [#43](https://github.com/mjfelecio/Event-Attendance-System/issues/43) |
| [DATA-04](./data-integrity.md#data-04) | No backup strategy for the SQLite file | Zero-code operational fix: a periodic file copy during the event | [#41](https://github.com/mjfelecio/Event-Attendance-System/issues/41) |
| [OPS-08](./operability.md#ops-08) | No process supervision for the server | Zero-code operational fix: disable laptop sleep, keep the terminal open and watched | [#42](https://github.com/mjfelecio/Event-Attendance-System/issues/42) |

These four are "should fix" precisely because each has a workable non-code mitigation
that a briefed operator can execute — they become release blockers only if the
mitigation isn't actually put in place.

---

## Safe to defer

Everything at P2 and below in [`findings.md`](./findings.md) — misleading error
messages ([#44](https://github.com/mjfelecio/Event-Attendance-System/issues/44)),
retroactive-eligibility behavior, documented and by design
([#45](https://github.com/mjfelecio/Event-Attendance-System/issues/45)), missing
password reset and the Settings placeholder
([#46](https://github.com/mjfelecio/Event-Attendance-System/issues/46)), minor
validation gaps ([#47](https://github.com/mjfelecio/Event-Attendance-System/issues/47)),
audit-trail durability
([#48](https://github.com/mjfelecio/Event-Attendance-System/issues/48)),
unauthenticated GETs
([#49](https://github.com/mjfelecio/Event-Attendance-System/issues/49)), attendance UI
polish ([#50](https://github.com/mjfelecio/Event-Attendance-System/issues/50)), and all
Postgres-migration considerations
([#51](https://github.com/mjfelecio/Event-Attendance-System/issues/51) — explicitly
post-beta). Calendar date-range UX (OPS-09) is already fixed by the open
[PR #36](https://github.com/mjfelecio/Event-Attendance-System/pull/36). None of these
will plausibly derail the beta if left as-is; all are tracked in the remediation plan's
later phases.

---

## Manual verification required before the event

Everything below needs to be *executed*, not just read — this audit was static code
review and cannot confirm runtime behavior.

1. **HTTPS / secure-context check.** From a phone and a second laptop (not the host),
   over the actual event Wi-Fi: log in, confirm the session survives a page reload and
   a few minutes of navigation; open the QR camera and confirm it activates. Do this
   with whatever HTTPS/workaround solution is chosen (see SEC-01/SEC-02 fix
   directions), not against plain HTTP.
2. **Full-scale bulk import rehearsal.** Build (or obtain) the actual ~2,000-row
   student CSV, with the real section/department/house/strand names the school
   actually uses. Import it and time it. If it fails or times out, that's DATA-01
   confirmed — fix before proceeding. If it fails with `Unknown group(s)`, that's
   DATA-02 confirmed — resolve the group vocabulary first, then retry.
3. **Concurrent scan test.** With 2–3 devices logged in as different organizers,
   simultaneously scan the *same* student's QR code against the *same* approved event.
   Confirm exactly one record is created, no duplicate, no error surfaced to either
   device beyond an "already recorded" toast on the loser.
4. **Timeout-mode round trip.** Approve a test event, scan a student in (time-in),
   toggle "Start Recording Timeout," scan the same student again (time-out), confirm
   both timestamps are correct and a third scan is correctly rejected/no-ops.
5. **Full workflow walkthrough**, once, end-to-end, on real hardware: signup → admin
   approval → organizer creates event → submits → admin approves → organizer takes
   attendance (QR and manual) → views live table → generates report → prints report →
   admin views dashboard. This catches integration issues no unit-level reading can.
6. **Backup restore rehearsal.** Stop the server, copy the current `dev.db` file
   somewhere, restart, confirm the app reads the copy correctly if swapped back in.
   Prove the backup procedure works before trusting it during the event.
7. **Clock check.** Confirm the host laptop's system date, time, and timezone are
   correct.
8. **Env var check.** Confirm `DATABASE_URL` resolves to the intended file when the
   server is started from wherever it will actually be started from on event day
   (working directory matters — see `architecture.md` §16). **Set `AUTH_SECRET`
   (≥16 characters) before any production build** — the repository's current `.env`
   does not define it, and `getAuthSecret()` throws in production when it's missing.
   Because that throw is a plain `Error`, it surfaces to the operator as
   `500 "Database error occurred."` on login rather than as a configuration error, so
   this failure is easy to misdiagnose. Verified during the 2026-08-16 reconciliation
   pass; see SEC-11 in [`findings.md`](./findings.md).

---

## Recommended beta smoke tests (condensed checklist)

Run this sequence once, fully, before trusting the system with real students:

- [ ] Sign up a new organizer from a non-host device → admin sees and approves it →
      organizer can log in
- [ ] Organizer creates an event, submits it → admin sees it pending → admin approves
- [ ] Organizer opens attendance for the approved event on the host laptop → scans a
      test student via QR → record appears within ~8s
- [ ] Same event, from a second device → open camera → scan a different test student →
      confirm it works (this is the SEC-02 check in practice, not just in theory)
- [ ] Manual attendance: search a student by name, click Time In, confirm it records
- [ ] Toggle timeout mode → scan/complete a time-out for an already-timed-in student →
      confirm correct rejection for a student who never timed in (`NO_TIME_IN`)
- [ ] View the live attendance table while polling — confirm it doesn't jump pages or
      lose your scroll position
- [ ] Generate and print a report for the test event → confirm counts match what was
      actually scanned
- [ ] Delete a test attendance record ("Mark as Absent") → confirm the confirmation
      dialog appears and the count updates
- [ ] Attempt the full-scale bulk import (see manual verification #2 above)
- [ ] Log out, confirm you're actually logged out (can't navigate back into protected
      pages)

---

## Operational risks (non-code, but event-critical)

- **Single point of failure by design**: one laptop, one file, one process. There is
  no redundancy anywhere in this architecture. This is an accepted tradeoff for a
  2–5-concurrent-user beta, but it means the pre-event checklist (backup, process
  supervision, clock check, sleep settings) isn't optional polish — it's the only
  safety net that exists.
- **The developer may be unavailable during the event.** Combined with OPS-06 (almost
  nothing is self-service beyond the core scan/report workflow), this means whoever is
  on-site needs, in writing, before the event: how to add a `Group` via Prisma Studio,
  how to reset a password via direct DB edit, how to restart the server if it goes
  down, and where the backup copies are. None of this is hard to write down; all of it
  is hard to improvise live.
- **No load test has been run at the stated scale** (2,000+ students, 2–5 concurrent
  operators) — this audit is a static read of the code, not a runtime benchmark. The
  bulk-import concern (DATA-01) is the one place this audit has high confidence a
  scale problem will actually manifest; the live scanning/reporting path is architected
  in a way (compare-and-set writes, no long transactions, indexed queries) that gives
  reasonable confidence it will hold up, but hasn't been empirically verified at 2,000
  students either.

---

## Recovery considerations

- **If the server crashes or the laptop dies mid-event**: recovery depends entirely on
  whether a recent backup copy of the SQLite file exists (DATA-04) and whether a
  process-supervision or restart plan is in place (OPS-08). Without both, this is
  total, unrecoverable data loss for the event.
- **If a record is deleted by mistake**: there is no undo. The only trace is a console
  log line (DATA-10), which is useless unless the terminal output was being captured to
  a file. There is no soft-delete or trash to recover from.
- **If the roster needs a correction mid-event**: safe to do (any active user can edit
  students), but be aware it retroactively changes past events' reports (DATA-06) —
  this is expected behavior, not corruption, but should be understood by whoever is
  reviewing reports afterward.
- **If someone is locked out** (forgotten password, wrongly rejected signup): recovery
  requires direct database access (OPS-05) — make sure that access and the exact steps
  are available on-site.

---

## Verdict

**Give this a conditional go.** Fix or operationally mitigate the four release
blockers, execute the manual verification list once on real hardware before the event,
and prepare the short runbook this document and `operability.md` describe for the
"developer unavailable" scenarios. Do that, and the parts of this system that matter
most — not double-recording attendance, not losing scans, enforcing who can approve
what — are already built correctly and don't need to be touched this week.
