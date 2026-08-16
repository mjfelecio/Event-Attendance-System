"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Download, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/globals/components/shad-cn/button";
import { Checkbox } from "@/globals/components/shad-cn/checkbox";
import { Label } from "@/globals/components/shad-cn/label";
import { Switch } from "@/globals/components/shad-cn/switch";
import { Textarea } from "@/globals/components/shad-cn/textarea";
import { Skeleton } from "@/globals/components/shad-cn/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/globals/components/shad-cn/alert";
import ComboBox from "@/globals/components/shared/ComboBox";
import CheckboxGroup from "@/globals/components/shared/CheckboxGroup";
import FormInput from "@/globals/components/shared/FormInput";
import FormSelect from "@/globals/components/shared/FormSelect";
import SearchBar from "@/globals/components/shared/SearchBar";
import StatusBadge, {
  EVENT_STATUS_TONE,
} from "@/globals/components/shared/StatusBadge";
import PageHeader from "@/globals/components/shared/PageHeader";
import {
  DataTableEmptyState,
  DataTableErrorState,
  DataTableFilteredEmptyState,
  DataTableSkeleton,
} from "@/globals/components/shared/dataTable/DataTableStates";
import {
  toastDanger,
  toastInfo,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import { useConfirm } from "@/globals/contexts/ConfirmModalContext";
import { cn } from "@/globals/libs/shad-cn";
import { pill, surface } from "@/globals/constants/designTokens";

import { Guidance, Section, Specimen, SpecimenItem } from "./Specimen";

const DEMO_OPTIONS = [
  { label: "Computer Studies", value: "computer-studies" },
  { label: "Hotel Management", value: "hotel-management" },
  { label: "Business Administration", value: "business-administration" },
];

const ComponentsSection = () => {
  const confirm = useConfirm();
  const [combo, setCombo] = useState("");
  const [checked, setChecked] = useState<string[]>(["computer-studies"]);
  const [query, setQuery] = useState("");
  const [switchOn, setSwitchOn] = useState(true);
  const { control } = useForm({ defaultValues: { department: "" } });

  const demoConfirm = async () => {
    const ok = await confirm({
      title: "Delete this student?",
      description:
        "All data from this student will be removed. This is an irreversible action.",
    });
    if (ok) toastSuccess("Confirmed", "Nothing was actually deleted.");
    else toastInfo("Cancelled", "The confirm dialog returned false.");
  };

  return (
    <Section
      id="components"
      title="Components"
      intro="Every example below renders the real component from globals/components. If you need one of these behaviours, import the component — don't rebuild it."
    >
      {/* ---------------------------------------------------------- BUTTONS */}
      <Specimen
        title="Buttons — shad-cn Button"
        note={
          <>
            The default for ordinary actions: dialog footers, forms, cards.{" "}
            <code>default</code> is now indigo because <code>--primary</code>{" "}
            points at indigo-600.
          </>
        }
        code={`import { Button } from "@/globals/components/shad-cn/button";

<Button>Save changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Saving…</Button>`}
      >
        <SpecimenItem label="default">
          <Button>Save changes</Button>
        </SpecimenItem>
        <SpecimenItem label="outline">
          <Button variant="outline">Cancel</Button>
        </SpecimenItem>
        <SpecimenItem label="secondary">
          <Button variant="secondary">Secondary</Button>
        </SpecimenItem>
        <SpecimenItem label="ghost">
          <Button variant="ghost">Ghost</Button>
        </SpecimenItem>
        <SpecimenItem label="destructive">
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </SpecimenItem>
        <SpecimenItem label="disabled">
          <Button disabled>Saving…</Button>
        </SpecimenItem>
        <SpecimenItem label="size=sm">
          <Button size="sm">Small</Button>
        </SpecimenItem>
        <SpecimenItem label="size=icon">
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
        </SpecimenItem>
      </Specimen>

      {/* ------------------------------------------------------ PILL ACTIONS */}
      <Specimen
        title="Pill actions — toolbar style"
        note="The Manage List toolbar style. Use these only in a page/table toolbar row; anywhere else, use Button above."
        code={`import { pill } from "@/globals/constants/designTokens";

<button className={pill.primary}><Plus className="size-4" /> Add</button>
<button className={pill.secondary}><Upload className="size-4" /> Import</button>`}
      >
        <SpecimenItem label="pill.primary">
          <button type="button" className={pill.primary}>
            <Plus className="size-4" strokeWidth={1.6} /> Add
          </button>
        </SpecimenItem>
        <SpecimenItem label="pill.secondary">
          <button type="button" className={pill.secondary}>
            <Upload className="size-4" strokeWidth={1.6} /> Import
          </button>
        </SpecimenItem>
        <SpecimenItem label="pill.back">
          <button type="button" className={pill.back}>
            Return to Menu
          </button>
        </SpecimenItem>
        <div className="w-full pt-1">
          <Guidance kind="dont">
            mix pills and Buttons in the same row — pick one register per
            toolbar.
          </Guidance>
        </div>
      </Specimen>

      {/* ----------------------------------------------------------- INPUTS */}
      <Specimen
        title="Text inputs — FormInput"
        note="Wraps shad-cn Input with the app's label/description/error layout. Always pass errors from react-hook-form rather than rendering your own message."
        code={`import FormInput from "@/globals/components/shared/FormInput";

<FormInput
  label="Student ID"
  placeholder="2026XXXXXX"
  {...register("id")}
  error={errors.id?.message}
/>`}
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <FormInput label="First Name" placeholder="John" />
          <FormInput
            label="Middle Name"
            placeholder="Mirron"
            description="Leave blank if not applicable"
          />
          <FormInput
            label="Student ID"
            placeholder="2026XXXXXX"
            defaultValue="20"
            error="ID must be 11 characters"
          />
        </div>
      </Specimen>

      <Specimen
        title="Selects, combo boxes & multi-select"
        note="FormSelect is the react-hook-form-bound select. ComboBox is the searchable single-select. CheckboxGroup is the multi-select used for event group scoping."
        code={`<FormSelect name="department" label="Department" options={opts} control={control} />
<ComboBox choices={opts} selectedValue={v} onSelect={setV} placeholder="Select…" searchFallbackMsg="No match." />
<CheckboxGroup choices={items} selectedValues={vals} onSelect={setVals} placeholder="Select groups" />`}
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <FormSelect
            name="department"
            label="Department"
            placeholder="Select a department"
            options={DEMO_OPTIONS}
            control={control}
          />
          <div className="flex flex-col gap-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">
              ComboBox
            </span>
            <ComboBox
              choices={DEMO_OPTIONS}
              selectedValue={combo}
              onSelect={setCombo}
              placeholder="Search department…"
              searchFallbackMsg="No department found."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">
              CheckboxGroup
            </span>
            <CheckboxGroup
              choices={DEMO_OPTIONS.map((o) => ({
                id: o.value,
                label: o.label,
              }))}
              selectedValues={checked}
              onSelect={setChecked}
              placeholder="Select groups"
            />
          </div>
        </div>
      </Specimen>

      <Specimen
        title="Checkbox, switch, textarea & search"
        note="Checkbox and Switch inherit indigo from --primary. SearchBar is the shared debounced search field; the rounded pill search in Manage List is a feature-local variant of the same idea."
      >
        <SpecimenItem label="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox id="ds-check" defaultChecked />
            <Label htmlFor="ds-check" className="text-sm">
              Include absent students
            </Label>
          </div>
        </SpecimenItem>
        <SpecimenItem label="Switch">
          <div className="flex items-center gap-2">
            <Switch
              id="ds-switch"
              checked={switchOn}
              onCheckedChange={setSwitchOn}
            />
            <Label htmlFor="ds-switch" className="text-sm">
              All-day event
            </Label>
          </div>
        </SpecimenItem>
        <div className="w-full max-w-md">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            placeholder="Search students…"
          />
        </div>
        <div className="w-full max-w-md">
          <Textarea placeholder="Rejection reason…" rows={2} />
        </div>
      </Specimen>

      {/* ----------------------------------------------------------- BADGES */}
      <Specimen
        title="Status badges"
        note={
          <>
            <code>StatusBadge</code> is the canonical chip. Resolve an{" "}
            <code>Event.status</code> through <code>EVENT_STATUS_TONE</code> so
            all four statuses stay consistent everywhere.
          </>
        }
        code={`import StatusBadge, { EVENT_STATUS_TONE } from "@/globals/components/shared/StatusBadge";

<StatusBadge>Total: 128</StatusBadge>
<StatusBadge tone="primary">Visible: 25</StatusBadge>
<StatusBadge tone={EVENT_STATUS_TONE[event.status]} withDot>
  {event.status}
</StatusBadge>`}
      >
        <SpecimenItem label="neutral">
          <StatusBadge>Total: 128</StatusBadge>
        </SpecimenItem>
        <SpecimenItem label="primary">
          <StatusBadge tone="primary">Visible: 25</StatusBadge>
        </SpecimenItem>
        <SpecimenItem label="info">
          <StatusBadge tone="info">Filters: 2</StatusBadge>
        </SpecimenItem>
        <SpecimenItem label="success">
          <StatusBadge tone="success">Search Active</StatusBadge>
        </SpecimenItem>
        <div className="flex w-full flex-wrap gap-2 border-t border-slate-100 pt-4">
          {(["DRAFT", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <StatusBadge key={s} tone={EVENT_STATUS_TONE[s]} withDot>
              {s}
            </StatusBadge>
          ))}
        </div>
      </Specimen>

      {/* --------------------------------------------------------- FEEDBACK */}
      <Specimen
        title="Toasts"
        note={
          <>
            Click to fire real toasts. Use <code>toastWarning</code> for a no-op
            that isn&apos;t a failure (&quot;attendance was already
            recorded&quot;) — <code>toastDanger</code> is reserved for genuine
            errors.
          </>
        }
        code={`import { toastSuccess, toastWarning } from "@/globals/components/shared/toasts";

toastSuccess("Student saved");
toastWarning("Already recorded", "This student was already timed in.");`}
      >
        <SpecimenItem label="toastSuccess">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toastSuccess("Student saved")}
          >
            Success
          </Button>
        </SpecimenItem>
        <SpecimenItem label="toastInfo">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toastInfo("Heads up", "Polling every 8 seconds.")}
          >
            Info
          </Button>
        </SpecimenItem>
        <SpecimenItem label="toastWarning">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toastWarning("Already recorded", "No change was made.")
            }
          >
            Warning
          </Button>
        </SpecimenItem>
        <SpecimenItem label="toastDanger">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toastDanger("Failed to save", "Please retry.")}
          >
            Danger
          </Button>
        </SpecimenItem>
      </Specimen>

      <Specimen
        title="Alerts — inline, persistent messaging"
        note="For context that must stay on screen. Transient results belong in a toast instead."
      >
        <div className="w-full space-y-3">
          <Alert>
            <AlertTitle>Approved event (view only)</AlertTitle>
            <AlertDescription>
              This event has been approved. Contact an admin to make changes.
            </AlertDescription>
          </Alert>
          <Alert className="border-amber-200 bg-amber-50/60 text-amber-900">
            <AlertTitle className="text-amber-800">
              Slug-based matching
            </AlertTitle>
            <AlertDescription className="text-amber-900/80">
              Ensure section, department, and house columns use valid system
              slugs.
            </AlertDescription>
          </Alert>
        </div>
      </Specimen>

      {/* --------------------------------------------------- DESTRUCTIVE UX */}
      <Specimen
        title="Destructive actions — useConfirm()"
        note={
          <>
            <strong>Mandatory.</strong> Every irreversible action in this app
            awaits <code>useConfirm()</code>. There are no exceptions, and
            adding one is the easiest way to cause accidental attendance loss.
          </>
        }
        code={`const confirm = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: "Delete this student?",
    description: "All data from this student will be removed.",
  });
  if (!confirmed) return;
  await deleteStudent(id);
};`}
      >
        <SpecimenItem label="useConfirm()">
          <Button variant="destructive" onClick={demoConfirm}>
            <Trash2 /> Delete student
          </Button>
        </SpecimenItem>
        <div className="w-full pt-1">
          <Guidance kind="dont">
            build a one-off confirmation dialog — the shared one is already
            wired at the app root.
          </Guidance>
        </div>
      </Specimen>

      {/* ----------------------------------------------------------- STATES */}
      <Specimen
        title="Loading, empty & error states"
        note="Shared across both table implementations. Reuse these rather than writing per-feature placeholders — the empty and filtered-empty cases are genuinely different and users need to be able to tell them apart."
        onSlate
        code={`import {
  DataTableSkeleton,
  DataTableEmptyState,
  DataTableFilteredEmptyState,
  DataTableErrorState,
} from "@/globals/components/shared/dataTable/DataTableStates";`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <div className={cn(surface.card, "overflow-hidden")}>
            <DataTableSkeleton rows={3} columns={3} />
          </div>
          <div className={cn(surface.card, "overflow-hidden")}>
            <DataTableEmptyState
              title="No students found"
              description="Get started by adding a new student record."
            />
          </div>
          <div className={cn(surface.card, "overflow-hidden")}>
            <DataTableFilteredEmptyState onClear={() => undefined} />
          </div>
          <div className={cn(surface.card, "overflow-hidden py-8")}>
            <DataTableErrorState
              title="Couldn't load students"
              description="Something went wrong while loading the roster."
            />
          </div>
        </div>
      </Specimen>

      <Specimen
        title="Skeletons for non-table content"
        note="Match the shape of what's loading. A skeleton that doesn't resemble the final layout causes a visible jump when data lands."
      >
        <div className={cn(surface.card, "w-full max-w-sm space-y-3 p-4")}>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </Specimen>

      {/* ------------------------------------------------------ PAGE HEADER */}
      <Specimen
        title="Page headers"
        note="One hero per page, at the top. Everything else uses the plain variant."
        onSlate
        code={`<PageHeader variant="hero" eyebrow="Student Directory" title="Student's List" description="…" />
<PageHeader eyebrow="College Selection" title="Which Department?" description="…" />`}
      >
        <div className="w-full space-y-4">
          <PageHeader
            variant="hero"
            eyebrow="Student Directory"
            title="Student's List"
            description="Choose a student category below to manage its roster and related attendance information."
          />
          <div className="rounded-2xl bg-white p-5">
            <PageHeader
              eyebrow="College Selection"
              title="Which Department?"
              description="Select a department to open its roster."
              actions={
                <>
                  <StatusBadge>Total: 128</StatusBadge>
                  <Button size="sm" variant="outline">
                    <Download /> Export
                  </Button>
                </>
              }
            />
          </div>
        </div>
      </Specimen>
    </Section>
  );
};

export default ComponentsSection;
