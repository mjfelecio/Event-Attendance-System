# Operability Audit

Perspective: an organizer or admin who did not build this system, operating it live at
a real event, with the developer possibly unreachable. Scope is "can this person
successfully do their job and recover from mistakes," not UI aesthetics.

**Headline finding**: the moment-to-moment scanning workflow (open camera → scan →
toast confirms → table updates within ~8s) is well thought through — debounce,
processing overlays, and clear success/failure toasts are all present. The operability
risk in this app is concentrated at the *edges*: getting the system running at all on
real devices, onboarding the roster, and what happens when something needs fixing and
there's no one around who knows the codebase.

---

## OPS-01 — Login and QR scanning are both likely to break on every non-host device {#ops-01}

**Severity:** P0 — release blocker
**Confidence:** LIKELY (mechanism confirmed; needs a runtime check on real devices)
**Full detail:** [`security.md#sec-01`](./security.md#sec-01), [`security.md#sec-02`](./security.md#sec-02)

**From an organizer's perspective:** you're handed a phone, told to go to
`http://192.168.1.42:3000`, and either (a) your login appears to succeed but every
subsequent click acts like you're logged out, or (b) you can log in fine on the host
laptop but the "Open Camera" button on your phone does nothing or shows a permissions
error you don't know how to fix. Neither failure mode explains itself — there's no
error message that says "this needs HTTPS." You'd reasonably conclude the app is
broken and lose confidence in the whole system minutes before the event starts.

**Recommended fix direction:** see security.md. This must be resolved and *rehearsed
on the actual devices* before the event — not left as a same-day discovery.

**Release blocker:** yes.

---

## OPS-02 — No way to add a missing section/department if the seed doesn't match reality {#ops-02}

**Severity:** P0 — release blocker
**Confidence:** CONFIRMED
**Full detail:** [`data-integrity.md#data-02`](./data-integrity.md#data-02)

**From an organizer's perspective:** you're importing the real roster and the whole
2,000-row file gets rejected with `Unknown group(s): BSIT-3A, BSIT-3B. Fix and retry.`
There is no "Add Section" button anywhere in the app. Settings says "coming soon." You
have no way to proceed without finding whoever has database access — who, per the
release context, might not be reachable.

**Recommended fix direction:** see data-integrity.md. Resolve the seed vocabulary
against the real school's structure *before* onboarding starts, and make sure at least
one person on-site knows how to add a `Group` row via Prisma Studio as a fallback.

**Release blocker:** yes.

**RESOLVED (2026-08-17, issue #39).** There is now an "Add group" button:
**Settings → Groups**. See [`data-integrity.md#data-02`](./data-integrity.md#data-02)
for the full account, and
[`../deployment/operator-runbook.md`](../deployment/operator-runbook.md) §2 for the
Prisma Studio fallback that remains as a safety net.

---

## OPS-03 — Signup rate limit can lock out onboarding {#ops-03}

**Severity:** P1 — should fix before beta
**Confidence:** CONFIRMED
**Full detail:** [`security.md#sec-05`](./security.md#sec-05)

**From an organizer's perspective:** you're the 6th person in the room signing up
within the same 10 minutes, and you get "Too many signup attempts. Try again in a few
minutes." — with no attempts of your own. Confusing and avoidable.

**Recommended fix direction:** raise the signup limit before onboarding day, or
explicitly instruct whoever runs onboarding to space signups out.

**Release blocker:** no (workaroundable by pacing). **Backlog ticket:** yes.

---

## OPS-04 — Large imports can fail with no partial-progress indication {#ops-04}

**Severity:** P0 (shares its root cause with DATA-01)
**Confidence:** LIKELY
**Full detail:** [`data-integrity.md#data-01`](./data-integrity.md#data-01)

**From an organizer's perspective:** you upload the full student CSV, wait, and get a
generic "Database error occurred." No count of how many succeeded. No indication
whether trying again will make it worse (it won't — upserts are idempotent — but the
operator has no way to know that from the error alone) or whether the file needs to be
split.

**Recommended fix direction:** see data-integrity.md. **RESOLVED 2026-08-20 (with
DATA-01):** a full-roster import is verified to work end-to-end (benchmark fixture +
harness in `scripts/benchmark/`), the importer now says a full roster can take up to
a minute so a slow run isn't mistaken for a hang, and a transaction failure returns a
clear `503 "…rolled back. Retrying the operation is safe."` instead of the opaque
"Database error occurred." — so operators no longer need to guess whether to split
the file or retry. The chunked-import UI with per-chunk progress remains backlog.

**Release blocker:** resolved (with DATA-01). **Backlog ticket:** yes, for a proper
chunked-import UI with progress feedback.

---

## OPS-05 — No self-service password reset {#ops-05}

**Severity:** P2
**Confidence:** CONFIRMED (absence)
**Location:** no `/forgot-password` route, no reset-token flow anywhere in `app/api/auth/` or `features/auth/`

**Problem:** if an organizer or admin forgets their password mid-event, there is
nothing in the UI to help them. The only recovery is someone with direct database
access either (a) writing a new plaintext value into `User.password` — which works,
because `verifyPassword` accepts legacy plaintext rows and rehashes on next successful
login — or (b) generating a new scrypt hash out-of-band.

**Why it matters:** this is a "someone forgot their password on event day" scenario
that is entirely plausible for staff who don't use the app daily, and the recovery path
requires technical access that may not be on-site.

**Recommended fix direction:** no code change recommended for this beta given the
timeline. Document the direct-DB-edit recovery procedure (exact SQL or Prisma Studio
steps, plus the fact that plaintext works and gets upgraded automatically) as a runbook
item for whoever has database access, so it can be done in under a minute if needed.

**Release blocker:** no, if the runbook step is prepared. **Backlog ticket:** yes, for
an actual password-reset flow post-beta.

**RESOLVED (2026-08-17, issue #46).** An admin now resets any account from
**Settings → Users → Reset password**: the server generates a temporary password,
shows it once, and sets `User.mustChangePassword`, which gates the app shell
(`app/(main)/layout.tsx`) until the user picks their own via
`POST /api/auth/change-password`. Any signed-in user can also change their own
password from Settings → Account. The plaintext-into-Prisma-Studio procedure is
retained as a fallback in
[`../deployment/operator-runbook.md`](../deployment/operator-runbook.md) §3, for
when no admin can sign in. A self-service `/forgot-password` token flow was
deliberately *not* built — there is no mail path on a LAN laptop.

---

## OPS-06 — Settings page is a placeholder; almost nothing is self-service {#ops-06}

**Severity:** P2
**Confidence:** CONFIRMED
**Location:** no `settings` route existed. *(The placeholder this finding originally
cited, `app/(main)/settings/page.tsx`, had already been deleted in `0d64105` by the
time the finding was actioned — the page was gone, not merely empty.)*

**Problem:** there is no in-app path to check environment configuration, manage groups,
reset a password, deactivate a stuck-active organizer, or view active (non-pending)
organizers/admins. Every one of those requires direct file or database access.

**Why it matters:** combined with "the developer may be unavailable during the actual
event," this means the people actually running the event have almost no self-service
recovery tools for anything outside the core scan/report workflow. This isn't a defect
in the Settings page specifically — it's a pattern across the whole app (see OPS-02,
OPS-05) that's worth naming as a single risk: **there is no operator console for
anything except attendance-taking itself.**

**Recommended fix direction:** no code change for this beta. The mitigation is
entirely a runbook: write down, in one place, the exact steps for every "the UI can't
do this" scenario (add a group, reset a password, promote/deactivate a user, restore
from backup) using Prisma Studio or direct SQL, and make sure whoever is on-site during
the event has that document and comfort using `pnpm db:studio`.

**Release blocker:** no, if a runbook exists. **Backlog ticket:** yes — this is the
throughline for several future "admin console" features.

**LARGELY RESOLVED (2026-08-17, issue #46).** `/settings` is now the operator
console, reachable from the sidebar and the mobile account menu:

- **Account** (everyone) — change your own password.
- **Groups** (admin) — full create/rename/delete of the group vocabulary; see OPS-02.
- **Users** (admin) — the full directory of every user with role and status, plus
  password reset. Read-only otherwise.
- **System** (admin) — which database file is in use, whether `AUTH_SECRET` is set
  and valid, the server clock (see OPS-11), and row counts. Reports configuration
  *health* only; no secret value is ever returned.

**Still not self-service, and still runbook-only** (see
[`../deployment/operator-runbook.md`](../deployment/operator-runbook.md) §4):
deactivating or re-activating a user who is already `ACTIVE`, and changing a user's
role. `PATCH /api/admin/organizers/[organizerId]` still 409s on any non-PENDING
user, so those remain direct database edits.

---

## OPS-07 — see DATA-03

Deleting a student with attendance history gives a technically-wrong error message
("Invalid reference. Related record does not exist.") instead of explaining that the
student has attendance records blocking the delete. Full detail in
[`data-integrity.md#data-03`](./data-integrity.md#data-03).

**From an organizer's perspective:** you try to remove a duplicate/mistaken student
entry, get an error that sounds like *you* referenced something invalid, and have no
idea the actual blocker is that this student was already scanned into an event.

---

## OPS-08 — No process supervision for the server {#ops-08}

**Severity:** P1 — should fix before beta
**Confidence:** CONFIRMED (absence — `package.json`'s `start` script is a bare `next
start`; no `pm2`, no systemd/launchd unit, no Windows service wrapper anywhere in the
repo or docs)

**Problem:** the server runs as a plain foreground process in a terminal window
(`pnpm start`). If that terminal is closed, the laptop goes to sleep, or the process
crashes for any reason, the entire attendance system goes down for every device on the
network simultaneously, with no automatic restart.

**Why it matters:** this is a single point of failure sitting on top of an already
single-point-of-failure architecture (one laptop, one SQLite file). A laptop that goes
to sleep mid-event (default power settings on most laptops) silently takes attendance
recording offline for everyone until someone notices and manually wakes/restarts it.

**Recommended fix direction:** before the event: (1) disable sleep/screen-lock-induced
suspend on the host laptop for the duration, (2) keep the terminal window open and
visible, ideally on a machine that's plugged in and won't be closed accidentally, and
(3) if time allows, run the server under a lightweight process manager (`pm2 start
npm -- start`, or the OS's native service mechanism) so a crash auto-restarts rather
than requiring someone to notice and re-run a command. Item (3) is the durable fix;
items (1)–(2) are the minimum viable mitigation for this week.

**Release blocker:** operationally yes — needs a plan (at minimum items 1–2) before the
event. **Backlog ticket:** yes, for proper process supervision.

---

## OPS-09 — Calendar hides past dates entirely {#ops-09}

**Severity:** P3
**Confidence:** CONFIRMED
**Location:** `features/calendar/components/Calendar.tsx:150` (`validRange={{ start: new Date() }}`)

**Problem:** FullCalendar's `validRange` prevents navigating to any date before today.
Once an event's date has passed, an organizer cannot scroll back to find it on the
calendar — it simply isn't reachable there anymore (it's still fully accessible via the
Reports page).

**Why it matters:** a minor "where did it go" moment for an organizer looking for last
week's event specifically on the calendar view, not a functional loss (Reports covers
it).

**Recommended fix direction:** none required for this beta; if it becomes a recurring
point of confusion, either drop `validRange` or add a note pointing users to Reports for
past events.

**Release blocker:** no. **Backlog ticket:** optional.

---

## OPS-10 — "Time In" button gives no visual done-state in normal mode {#ops-10}

**Severity:** P3
**Confidence:** CONFIRMED
**Location:** `features/attendance/components/AttendanceActionButtons.tsx:131-136`

**Problem:** the disable logic (`presentDisabled`) only applies when the event is in
timeout mode. In ordinary (time-in) mode, the "Time In" button stays fully active and
identical-looking even after a student is already recorded present — clicking it again
is harmless (the server correctly no-ops and returns `changed:false`, and a toast says
"Attendance was already recorded"), but the button itself never visually reflects
"already done" the way the timeout-mode button does (`hasTimeIn`/`hasTimeOut`
disabling).

**Why it matters:** an organizer who scans a student, gets distracted, and later
manually clicks "Time In" again for the same student has to rely on catching a toast
message rather than the button state to know nothing changed. Low-stakes since the
underlying data is protected either way.

**Recommended fix direction:** extend the existing `hasTimeIn` disable logic to also
apply when `!isTimeout`, matching the timeout-mode symmetry already built.

**Release blocker:** no. **Backlog ticket:** optional, small polish item.

---

## OPS-11 — No clock-sync verification {#ops-11}

**Severity:** P3
**Confidence:** CONFIRMED (absence — every timestamp is `new Date()` on the server;
no validation anywhere compares it to any external reference)

**Problem:** every `timein`/`timeout` is the host laptop's system clock at the moment
of the request. Nothing checks that clock against anything else.

**Why it matters:** a laptop with an incorrect date/time (not uncommon on a machine
that's been offline, dual-boots, or had its clock manually fiddled with) would silently
record wrong attendance times with zero indication anything is off — no warning banner,
no sanity check against `Event.start`/`end`.

**Recommended fix direction:** no code change needed for this beta. Add "verify system
date/time and timezone on the host laptop" as a pre-event checklist item — a 30-second
check that eliminates this risk entirely.

**Release blocker:** no, if checked manually before the event. **Backlog ticket:**
optional (a server-side sanity warning if the clock looks implausible is a nice-to-have,
not necessary).

---

## OPS-12 — QR scan debounce is global, not per-event {#ops-12}

**Severity:** P4
**Confidence:** CONFIRMED (code), edge case
**Location:** `features/attendance/components/ScannerCamera.tsx:24-27`

**Problem:** the 1-second duplicate-scan debounce is keyed only on the scanned value
and timestamp, not on which event is currently selected. If an organizer switches the
selected event within one second of the last scan of the *same* student ID, that second
scan (meant for the new event) would be silently swallowed by the debounce.

**Why it matters:** requires switching events within one second of a scan — an unlikely
sequence in practice, since selecting a different event is itself a multi-click UI
action.

**Recommended fix direction:** include the event id in the debounce key. Trivial,
low-priority change.

**Release blocker:** no. **Backlog ticket:** optional.

---

## Explicitly checked and found sound

- **Confirmation on destructive actions:** every irreversible action reviewed (delete
  event, delete record/"mark as absent", delete student) goes through
  `useConfirm()` (`ConfirmModalContext`), which blocks on an explicit user
  confirmation before proceeding. No accidental one-click destructive actions were
  found.
- **Multi-device freshness:** the attendance page polls every 8 seconds
  (`refetchInterval: 8_000`) with a 5-second stale time, so a scan recorded on one
  device becomes visible on another device's live table within roughly 8–13 seconds —
  reasonable for the stated 2–5 concurrent operators.
- **Failure toasts are consistently present:** every mutation path reviewed
  (record create/update/delete, event save/submit/approve/reject, student
  save/delete, organizer approve/reject) has both success and failure toast handling —
  no silent failures where an action fails but the UI implies success.
- **Table pagination survives polling:** `DataTable`'s `autoResetPageIndex: false` plus
  the explicit `resetKey` pattern means the live attendance table does not bounce an
  operator back to page 1 every 8 seconds while they're mid-scroll — this was
  specifically engineered (and recently fixed per git history) rather than accidental.
- **Read-only event states are visually communicated:** `EventDrawer` shows a clear
  banner ("Approved event (view only)...", "This event is pending admin review...")
  when an organizer can't edit — they aren't left guessing why fields feel locked.
