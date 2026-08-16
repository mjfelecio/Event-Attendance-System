"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import DataTable from "@/globals/components/shared/dataTable/DataTable";
import { Button } from "@/globals/components/shad-cn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/globals/components/shad-cn/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/globals/components/shad-cn/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import StatusBadge from "@/globals/components/shared/StatusBadge";
import { cn } from "@/globals/libs/shad-cn";
import { pill, surface, type as typeToken } from "@/globals/constants/designTokens";

import { Guidance, Section, Specimen, SpecimenItem } from "./Specimen";

type DemoRow = {
  id: string;
  name: string;
  section: string;
  status: "present" | "absent";
};

const DEMO_ROWS: DemoRow[] = [
  { id: "20260001234", name: "Adams, Johnny", section: "BSIT-2A", status: "present" },
  { id: "20260005678", name: "Bautista, Mira", section: "BSIT-2A", status: "present" },
  { id: "20260009012", name: "Cruz, Declan", section: "BSCS-1B", status: "absent" },
  { id: "20260003456", name: "Dizon, Elena", section: "BSCS-1B", status: "present" },
];

// Column definitions live in a constants/ file next to the feature that owns the
// table. Inlined here only because this page *is* the documentation.
const demoColumns: ColumnDef<DemoRow>[] = [
  { accessorKey: "id", header: "Student ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "section", header: "Section" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        tone={row.original.status === "present" ? "success" : "danger"}
        withDot
      >
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex justify-center gap-1">
        <Button size="icon-sm" variant="ghost" aria-label="Edit">
          <Pencil />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Delete">
          <Trash2 className="text-rose-600" />
        </Button>
      </div>
    ),
  },
];

const PatternsSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Section
      id="patterns"
      title="Patterns"
      intro="Compositions rather than single components: tables, overlays, and the page layouts these screens are assembled from."
    >
      {/* ------------------------------------------------------------ TABLE */}
      <Specimen
        title="Data table — the shared DataTable"
        note={
          <>
            The standard table for the whole app. Manage List&apos;s student
            list uses a separate feature-local table
            (<code>StudentsDataTable</code>) — that&apos;s a known duplication,
            not a pattern to copy. <strong>New tables use this one.</strong>
          </>
        }
        code={`import DataTable from "@/globals/components/shared/dataTable/DataTable";

<DataTable
  columns={columns}          // from features/<x>/constants/
  data={rows}
  isLoading={isLoading}
  isError={isError}
  title="Attendance Records"
  getRowId={(row) => row.id} // stable identity for paginated/mutating rows
  resetKey={eventId}         // jump to page 1 when the dataset changes
/>`}
      >
        <div className="w-full">
          <DataTable
            columns={demoColumns}
            data={DEMO_ROWS}
            isLoading={false}
            title="Attendance Records"
            getRowId={(row) => row.id}
          />
        </div>
        <div className="w-full space-y-1 pt-1">
          <Guidance kind="do">
            put column definitions in a <code>constants/</code> file, and reduce
            relation objects to primitives with <code>accessorFn</code> before
            rendering.
          </Guidance>
          <Guidance kind="dont">
            render a relation object straight into a cell — it breaks sorting
            and has crashed this table before.
          </Guidance>
        </div>
      </Specimen>

      {/* --------------------------------------------------------- OVERLAYS */}
      <Specimen
        title="Overlays — Dialog vs Sheet"
        note={
          <>
            <strong>Dialog</strong> for confirmations and focused, short content.{" "}
            <strong>Sheet</strong> for multi-field forms. A third primitive
            (<code>Drawer</code>) is also vendored and used by the event drawer —
            prefer Sheet for anything new so the app converges on one slide-in.
          </>
        }
        code={`// Confirmations: don't build your own — use useConfirm()
// Forms: Sheet
<Sheet><SheetTrigger asChild><Button>Edit</Button></SheetTrigger>
  <SheetContent className="flex flex-col w-full sm:max-w-md">…</SheetContent>
</Sheet>`}
      >
        <SpecimenItem label="Dialog">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject this event?</DialogTitle>
                <DialogDescription>
                  The organizer will see your reason and can revise the event.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setDialogOpen(false)}>
                  Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SpecimenItem>

        <SpecimenItem label="Sheet">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Edit Student Profile</SheetTitle>
              </SheetHeader>
              <div className="px-4 text-sm text-slate-500">
                Multi-step forms live here — see StudentFormDrawer for the
                FormProvider + step-validation pattern.
              </div>
            </SheetContent>
          </Sheet>
        </SpecimenItem>

        <SpecimenItem label="Popover">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className={pill.secondary}>
                Filter
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <p className={typeToken.eyebrow}>Filter by</p>
              <p className="mt-2 text-sm text-slate-500">
                Popovers hold transient controls anchored to a trigger — sort
                and filter menus, not primary content.
              </p>
            </PopoverContent>
          </Popover>
        </SpecimenItem>
      </Specimen>

      {/* ---------------------------------------------------------- TOOLBAR */}
      <Specimen
        title="Toolbar — title, counters, actions, search"
        note="The Manage List table header, which is the app's most complete toolbar. Counters on the right of the title; actions left, search right on the row below."
        onSlate
        code={`<div className={surface.panel}>
  <div className={surface.panelGlow} />
  <div className="relative flex flex-col gap-5 p-6">
    {/* title + counter chips */}
    {/* actions + search */}
  </div>
</div>`}
      >
        <div className={cn(surface.panel, "w-full")}>
          <div className={surface.panelGlow} />
          <div className="relative flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={typeToken.eyebrow}>College · Computer Studies</p>
                <h1 className={typeToken.pageTitle}>BSIT-2A</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge>Total: 128</StatusBadge>
                <StatusBadge tone="primary">Visible: 25</StatusBadge>
                <StatusBadge tone="info">Filters: 1</StatusBadge>
              </div>
            </div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={pill.primary}>
                  Add
                </button>
                <button type="button" className={pill.secondary}>
                  Import
                </button>
                <button type="button" className={pill.secondary}>
                  Sort
                </button>
                <button type="button" className={pill.secondary}>
                  Filter
                </button>
              </div>
              <input
                type="search"
                placeholder="Search students…"
                aria-label="Search students"
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/40 xl:w-80"
              />
            </div>
          </div>
        </div>
      </Specimen>

      {/* ----------------------------------------------------- PAGE LAYOUTS */}
      <Specimen
        title="Page pattern — Overview / landing"
        note="Hero header, then a panel of interactive cards that navigate deeper. Manage List and the Dashboard both follow this."
        onSlate
      >
        <div className="w-full space-y-3 text-xs">
          <div className="rounded-2xl bg-[linear-gradient(130deg,#1e1b4b_0%,#1d4ed8_52%,#4f46e5_100%)] px-4 py-4 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-100">
              Eyebrow
            </p>
            <p className="text-lg font-semibold">PageHeader · variant=&quot;hero&quot;</p>
          </div>
          <div className={cn(surface.panel, "p-4")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Card", "Card", "Card", "Card"].map((c, i) => (
                <div
                  key={i}
                  className={cn(
                    surface.cardInteractive,
                    "flex h-16 items-center justify-center text-slate-500",
                  )}
                >
                  {c} → navigates deeper
                </div>
              ))}
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen
        title="Page pattern — List / management"
        note="The workhorse. Toolbar panel (title + counters + actions + search) sitting directly above the table. This is what Manage List's roster screens are."
        onSlate
      >
        <div className="w-full space-y-2 text-xs">
          <div className={cn(surface.panel, "p-4 text-slate-500")}>
            Toolbar panel — title, counter chips, actions, search
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center text-slate-500">
            Table · shared DataTable, with skeleton / empty / filtered-empty /
            error states
          </div>
        </div>
      </Specimen>

      <Specimen
        title="Page pattern — Form"
        note="Forms live in a Sheet, not on their own route. Multi-step forms use a step indicator, validate per step, and keep Back/Next pinned in the footer."
        onSlate
      >
        <div className="w-full text-xs">
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
              <p className="font-semibold text-slate-800">Sheet header</p>
              <p className="mt-1 text-slate-500">Step indicator · 1 → 2 → 3</p>
            </div>
            <div className="space-y-2 p-4 text-slate-500">
              <div className="h-8 rounded-lg bg-slate-100" />
              <div className="h-8 rounded-lg bg-slate-100" />
              <p>Scrollable field area</p>
            </div>
            <div className="flex gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
              <div className="h-8 flex-1 rounded-xl bg-slate-200" />
              <div className="h-8 flex-1 rounded-xl bg-indigo-600" />
            </div>
          </div>
        </div>
      </Specimen>

      <Specimen
        title="Page pattern — Dashboard / overview metrics"
        note="A row of metric cards above grouped sections. Metric value takes the tone colour; the icon tile carries a matching gradient."
        onSlate
      >
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { tone: "text-blue-700", border: "border-blue-100", label: "Eligible", v: "128" },
            { tone: "text-emerald-700", border: "border-emerald-100", label: "Present", v: "96" },
            { tone: "text-amber-700", border: "border-amber-100", label: "Pending", v: "3" },
            { tone: "text-rose-700", border: "border-rose-100", label: "Absent", v: "32" },
          ].map((m) => (
            <div
              key={m.label}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-[0_16px_32px_rgba(15,23,42,0.06)]",
                m.border,
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {m.label}
              </p>
              <p className={cn("mt-2 text-3xl font-bold leading-none", m.tone)}>
                {m.v}
              </p>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen
        title="Page pattern — Attendance (live operator screen)"
        note={
          <>
            The one screen operated under time pressure by someone who
            didn&apos;t build the app. Optimise for legibility and unambiguous
            feedback over density: large scan target, immediate toast on every
            scan, live table below, and a visible event-mode indicator so the
            operator always knows whether they&apos;re recording time-in or
            time-out.
          </>
        }
        onSlate
      >
        <div className="grid w-full gap-3 text-xs lg:grid-cols-[1fr_1.2fr]">
          <div className={cn(surface.card, "space-y-2 p-4")}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800">Scanner</p>
              <StatusBadge tone="info">Time-in mode</StatusBadge>
            </div>
            <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
              Camera surface — large tap target
            </div>
            <p className="text-slate-500">
              Every scan produces a toast, success or otherwise.
            </p>
          </div>
          <div className={cn(surface.card, "space-y-2 p-4")}>
            <p className="font-semibold text-slate-800">Live records</p>
            <div className="space-y-1.5">
              {DEMO_ROWS.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-slate-600">{r.name}</span>
                  <StatusBadge
                    tone={r.status === "present" ? "success" : "danger"}
                  >
                    {r.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
            <p className="text-slate-500">
              Polls every 8s so a second device&apos;s scans appear here.
            </p>
          </div>
        </div>
      </Specimen>
    </Section>
  );
};

export default PatternsSection;
