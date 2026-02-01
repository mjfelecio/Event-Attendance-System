"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/globals/contexts/AuthContext";
import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import {
  PendingOrganizer,
  useApproveOrganizer,
  usePendingOrganizers,
  useRejectOrganizer,
} from "@/globals/hooks/useAdmin";
import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import { Button } from "@/globals/components/shad-cn/button";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-white text-slate-600">
        Loading dashboard…
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <OrganizerDashboard />;
};

const AdminDashboard = () => {
  const { data, isLoading, isError } = usePendingOrganizers();
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const approve = useApproveOrganizer();
  const reject = useRejectOrganizer();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] =
    useState<"APPROVE" | "REJECT" | null>(null);

  const handleApprove = (organizerId: string) => {
    setProcessingId(organizerId);
    setProcessingAction("APPROVE");
    approve.mutate(
      { id: organizerId },
      {
        onSuccess: () => {
          toastSuccess("Organizer approved", "They can now sign in.");
        },
        onError: (error) => {
          toastDanger(
            "Approval failed",
            error instanceof Error ? error.message : undefined
          );
        },
        onSettled: () => {
          setProcessingId(null);
          setProcessingAction(null);
        },
      }
    );
  };

  const handleReject = (organizer: PendingOrganizer) => {
    const input = window.prompt(
      `Provide a reason for rejecting ${organizer.name}:`,
      organizer.rejectionReason ?? "Incomplete requirements"
    );

    const reason = input?.trim();
    if (!reason) {
      toastWarning("Rejection reason required");
      return;
    }

    setProcessingId(organizer.id);
    setProcessingAction("REJECT");
    reject.mutate(
      { id: organizer.id, reason },
      {
        onSuccess: () => {
          toastSuccess("Organizer rejected", reason);
        },
        onError: (error) => {
          toastDanger(
            "Rejection failed",
            error instanceof Error ? error.message : undefined
          );
        },
        onSettled: () => {
          setProcessingId(null);
          setProcessingAction(null);
        },
      }
    );
  };

  const pendingCount = data?.length ?? 0;
  const pendingEventsCount =
    events?.filter((event) => event.status === "PENDING").length ?? 0;

  return (
    <div className="flex-1 bg-slate-50 p-6 space-y-6 overflow-y-auto">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Admin overview
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-1">
          Approval queue
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Review new organizer requests to keep the workspace secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white shadow border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Pending organizers</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-1">
            {pendingCount === 0
              ? "No pending requests right now."
              : "Approve or reject to unblock their access."}
          </p>
        </div>
        <div className="rounded-2xl bg-white shadow border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Last action</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">
            {processingAction ? `${processingAction} in progress` : "Idle"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Buttons disable while a request is processing.
          </p>
        </div>
        <div className="rounded-2xl bg-white shadow border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Pending events</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isEventsLoading ? "—" : pendingEventsCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Review submissions in the calendar workspace.
          </p>
        </div>
      </div>

      <section className="rounded-2xl bg-white shadow border border-slate-200">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pending organizer requests
            </h2>
            <p className="text-sm text-slate-500">
              {pendingCount === 0
                ? "All caught up!"
                : "Review details and take action per request."}
            </p>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Organizer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Requested</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {isLoading || isError ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    {isLoading ? "Loading requests…" : "Failed to load requests."}
                  </td>
                </tr>
              ) : pendingCount === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No pending organizers right now.
                  </td>
                </tr>
              ) : (
                data!.map((organizer) => (
                  <tr key={organizer.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {organizer.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID: {organizer.id.slice(0, 6)}…
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{organizer.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(organizer.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
                          onClick={() => handleApprove(organizer.id)}
                          disabled={
                            approve.isPending ||
                            reject.isPending ||
                            processingId === organizer.id
                          }
                        >
                          {processingId === organizer.id && processingAction === "APPROVE"
                            ? "Approving…"
                            : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-red-500 disabled:opacity-50"
                          onClick={() => handleReject(organizer)}
                          disabled={
                            approve.isPending ||
                            reject.isPending ||
                            processingId === organizer.id
                          }
                        >
                          {processingId === organizer.id && processingAction === "REJECT"
                            ? "Rejecting…"
                            : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const OrganizerDashboard = () => {
  const { data: events, isLoading, isError } = useEvents();

  const statusMeta: Record<Event["status"], { title: string; description: string; accent: string }> = {
    DRAFT: {
      title: "Drafts",
      description: "Finish details before submitting",
      accent: "bg-amber-100 text-amber-700",
    },
    PENDING: {
      title: "Pending review",
      description: "Waiting for admin approval",
      accent: "bg-sky-100 text-sky-700",
    },
    APPROVED: {
      title: "Approved",
      description: "Ready for attendance + stats",
      accent: "bg-emerald-100 text-emerald-700",
    },
    REJECTED: {
      title: "Rejected",
      description: "Needs revisions before resubmitting",
      accent: "bg-rose-100 text-rose-700",
    },
  };

  const grouped = useMemo(() => {
    const base: Record<Event["status"], Event[]> = {
      DRAFT: [],
      PENDING: [],
      APPROVED: [],
      REJECTED: [],
    };
    (events ?? []).forEach((event) => {
      base[event.status].push(event);
    });
    return base;
  }, [events]);

  const highlightSections: {
    status: Event["status"];
    title: string;
    empty: string;
  }[] = [
    {
      status: "DRAFT",
      title: "Drafts to finish",
      empty: "No drafts yet. Start planning a new event!",
    },
    {
      status: "PENDING",
      title: "Awaiting approval",
      empty: "No pending events. Submit one when you're ready.",
    },
    {
      status: "REJECTED",
      title: "Needs attention",
      empty: "No rejected events. Great job!",
    },
  ];

  return (
    <div className="flex-1 bg-slate-50 p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Organizer overview
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-1">
            Event workflow status
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Track drafts, submissions, approvals, and rejections at a glance.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/calendar?create=1">Create event</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(grouped).map(([status, items]) => (
          <div
            key={status}
            className="rounded-2xl bg-white shadow border border-slate-200 p-5"
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${statusMeta[status as Event["status"]].accent}`}>
              {statusMeta[status as Event["status"]].title}
            </p>
            <p className="text-4xl font-bold text-slate-900 mt-3">
              {isLoading ? "—" : items.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {statusMeta[status as Event["status"]].description}
            </p>
          </div>
        ))}
      </div>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {highlightSections.map((section) => {
          const list = grouped[section.status];
          return (
            <div
              key={section.status}
              className="rounded-2xl bg-white shadow border border-slate-200 flex flex-col"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-500">
                  {section.status === "DRAFT"
                    ? "Complete details and submit for approval."
                    : section.status === "PENDING"
                    ? "Admins review events in submission order."
                    : "Rejections always include a reason. Update the event then resubmit."}
                </p>
              </div>
              <div className="flex-1 px-5 py-4 space-y-4">
                {isLoading ? (
                  <p className="text-sm text-slate-500">Loading events…</p>
                ) : list.length === 0 ? (
                  <p className="text-sm text-slate-400">{section.empty}</p>
                ) : (
                  list.slice(0, 5).map((event) => (
                    <article
                      key={event.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
                    >
                      <h3 className="text-base font-semibold text-slate-900">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {new Date(event.start).toLocaleString()} • {event.category}
                      </p>
                      {section.status === "REJECTED" && event.rejectionReason ? (
                        <p className="mt-2 text-sm text-rose-600">
                          {event.rejectionReason}
                        </p>
                      ) : null}
                    </article>
                  ))
                )}
                {list.length > 5 ? (
                  <p className="text-xs text-slate-500">
                    + {list.length - 5} more {section.title.toLowerCase()}.
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>

      {isError ? (
        <p className="text-sm text-rose-600">
          Failed to load events. Please refresh the page.
        </p>
      ) : null}
    </div>
  );
};

export default DashboardPage;
