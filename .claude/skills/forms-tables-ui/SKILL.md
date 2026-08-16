---
name: forms-tables-ui
description: Form, table, modal, and destructive-action UI conventions for the Event Attendance System — react-hook-form + Zod, the two coexisting table implementations, Sheet vs Drawer, and the mandatory confirm-before-destroy pattern. Use whenever building or editing a form, a data table, a modal/drawer, or any delete/destructive action in the UI.
---

> ## Read the design system first
>
> **Before creating or modifying any UI in this repo, consult
> [`docs/design-system.md`](../../../docs/design-system.md) and the interactive
> playbook at `/design-system`.** They are the canonical visual reference —
> colour, typography, surfaces, component choices, page-level patterns, the
> binding rules for AI agents, and the list of known deviations you should not
> propagate.
>
> Key points that override any instinct to invent something new:
> - Primary colour is Tailwind **indigo-600** (shadcn `--primary` resolves to it).
> - Import layout/colour tokens from `globals/constants/designTokens.ts`; don't
>   re-derive class strings.
> - Prefer an existing component over a new one; prefer an existing page pattern
>   over a new layout.
> - The **Manage List** pages are the canonical visual reference.
> - Never build Tailwind class names at runtime (`` `bg-${x}-500` `` ships
>   unstyled).
>
> This skill covers the *code* conventions below; the design system covers how
> the result should look.

# Forms, Tables & UI Conventions

## Forms: react-hook-form + zodResolver, sharing the API's own schema

Use the **same** Zod schema that validates the server request (from `globals/schemas/`)
as the client form's `zodResolver` schema, so client and server agree by construction.
For a single-step form, use `register()` + `Controller` for non-native inputs
(`ComboBox`, `CheckboxGroup`, `Switch`) — see `EventDrawer.tsx`. For a multi-step form,
use `FormProvider`/`useFormContext` in child step components and `methods.trigger([...])`
to validate only the current step before advancing — see `StudentFormDrawer/index.tsx`.
When editing an existing record, call `form.reset(newDefaults)` inside a `useEffect`
keyed on the incoming record — don't remount the form component to reset it.

Submission goes through a TanStack `useMutation` hook — see the
`data-fetching-and-state` skill. Don't call `fetch` directly inside a form's `onSubmit`
(one component, `StudentImporter.tsx`, does this and is a known exception, not a
pattern to copy).

## Tables: TWO implementations exist — know which one you're extending

1. **`globals/components/shared/dataTable/DataTable.tsx`** — the general-purpose one.
   Supports client-managed mode and a server-driven `manual` mode (built, but currently
   unused anywhere on `main` — ready for when server-side pagination is needed). This
   is the one described in its own doc comment as "the standard, reusable table used
   throughout the application," and it's what the attendance and reports tables use.
2. **`features/manage-list/components/StudentsDataTable/`** — a separate,
   simpler, feature-local table used only by Manage List's student list. Shares no code
   with (1).

**This is a real, undocumented-by-design inconsistency, not a layering choice** — see
`docs/conventions.md`'s "How do I add a table?" section. **For any new table outside
Manage List's student list, use (1).** Column definitions go in a `constants/` file
next to the feature (`ColumnDef<T>[]` arrays), not inlined in the rendering component.
If a column renders a relation object (e.g. a `Group`), reduce it to a primitive via
`accessorFn` first — rendering a raw relation object directly has crashed sorting
before (see `eventRecordsTable.tsx`'s comment).

## Modals & drawers: Dialog, Sheet, and Drawer all coexist for overlapping roles

`Dialog` (centered modal — confirmations, `StudentQrModal`), `Sheet` (slide-in panel —
`StudentFormDrawer`), `Drawer` (a *different* vendored slide-in primitive —
`EventDrawer`). `Sheet` and `Drawer` serve the same visual role but are two different
components; this is a real inconsistency, not intentional layering. If adding a third
slide-in panel, check which one the feature you're extending already uses rather than
picking a new one.

## Destructive actions: `useConfirm()` is mandatory, no exceptions found

Every irreversible action in this codebase (delete event, delete record, delete
student) awaits `useConfirm()` (`globals/contexts/ConfirmModalContext.tsx`) before
proceeding:

```ts
const confirmed = await confirm({ title: "...", description: "..." });
if (!confirmed) return;
```

**If you add a new destructive action, it must use this** — don't build a one-off
confirmation dialog. This is the single pattern in the codebase with zero exceptions;
breaking it is the single easiest way to introduce an accidental-data-loss regression
in an app whose whole premise is "don't lose attendance data."

## Toasts

`globals/components/shared/toasts.tsx`: `toastSuccess`/`toastInfo`/`toastWarning`/
`toastDanger`. Use `toastWarning` (not `toastDanger`) for a no-op result that isn't a
failure — e.g. "attendance was already recorded" when a mutation returns `changed:
false`. `toastDanger` is reserved for actual failures.

## Loading / mutation-in-flight states

Read `isPending` off `useMutation` and disable the triggering control, swapping its
label (`"Approving..."`) — every mutation-triggering button in this codebase does this.
Use the shared `DataTableStates.tsx` components for table loading/empty/error states;
for non-table content, a small local `LoadingState`/`EmptyState` component next to the
consumer is the pattern (not extracted to `globals/` unless actually reused elsewhere).

## Operability note — this app is used by people who didn't build it

Per `docs/audit/operability.md`, the biggest usability risks in this app are at the
*edges* (getting the roster loaded, recovering from a mistake), not the core scan
workflow, which is already well-built. If your task touches an error message, an empty
state, or a destructive-action flow, consider whether an organizer with no code access
during a live event would understand what happened and what to do next — see that
document's findings (especially OPS-02 through OPS-07) before assuming a generic error
message is good enough.
