import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  requireAuth,
  requireRole,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { validateEventGroups } from "@/globals/utils/eventValidation";

const eventStatusEnum = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);
const eventScopeEnum = z.enum(["visible", "mine"]);
const eventCategoryEnum = z.enum([
  "ALL",
  "COLLEGE",
  "SHS",
  "DEPARTMENT",
  "HOUSE",
  "STRAND",
  "PROGRAM",
  "SECTION",
  "YEAR",
]);

const listQuerySchema = z.object({
  status: eventStatusEnum.optional(),
  scope: eventScopeEnum.optional(),
});

const jsonArrayField = z
  .string()
  .nullable()
  .optional()
  .refine(
    (v) => {
      if (!v) return true;
      try {
        return Array.isArray(JSON.parse(v));
      } catch {
        return false;
      }
    },
    { message: "Must be a JSON array." }
  );

const eventMutationSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(1),
    location: z.string().nullable().optional(),
    category: eventCategoryEnum,
    includedGroups: jsonArrayField,
    excludedGroups: jsonArrayField,
    description: z.string().nullable().optional(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    allDay: z.boolean().optional().default(false),
  })
  .refine((data) => data.end.getTime() >= data.start.getTime(), {
    message: "End must be the same or after start.",
    path: ["end"],
  });

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const query = listQuerySchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams)
    );

    const where: Record<string, unknown> = {};
    const statusFilter = query.success ? query.data.status : undefined;
    const scopeFilter = query.success ? query.data.scope : undefined;

    if (user.role === "ADMIN") {
      if (statusFilter) {
        where.status = statusFilter;
      }
    } else {
      const resolvedScope = scopeFilter ?? "visible";

      if (resolvedScope === "mine") {
        where.createdById = user.id;

        if (statusFilter) {
          where.status = statusFilter;
        }
      } else if (!statusFilter) {
        where.OR = [{ createdById: user.id }, { status: "APPROVED" }];
      } else if (statusFilter === "APPROVED") {
        where.status = "APPROVED";
      } else {
        where.createdById = user.id;
        where.status = statusFilter;
      }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { start: "asc" },
    });

    return NextResponse.json(ok(events), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const payload = eventMutationSchema.parse(await req.json());

    const groupError = validateEventGroups(
      payload.category,
      payload.includedGroups,
      payload.excludedGroups
    );
    if (groupError) {
      return NextResponse.json(err(groupError), { status: 400 });
    }

    const baseData = {
      title: payload.title,
      location: payload.location,
      category: payload.category,
      includedGroups: payload.includedGroups,
      excludedGroups: payload.excludedGroups,
      description: payload.description,
      start: payload.start,
      end: payload.end,
      allDay: payload.allDay,
    };

    if (payload.id) {
      const existing = await prisma.event.findUnique({
        where: { id: payload.id },
      });

      if (!existing) {
        return NextResponse.json(err("Event not found."), { status: 404 });
      }

      assertEventOwnership(existing, user);

      // Non-admins can only edit drafts and rejected events. Approved
      // events are locked so content cannot change without re-review.
      const editableStatuses: Array<
        "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"
      > =
        user.role === "ADMIN"
          ? ["DRAFT", "PENDING", "APPROVED", "REJECTED"]
          : ["DRAFT", "REJECTED"];
      assertEventStatus(existing, editableStatuses);

      // Editing a rejected event returns it to DRAFT (clearing the review)
      // so the organizer can fix it and resubmit.
      const rejectionReset =
        user.role !== "ADMIN" && existing.status === "REJECTED"
          ? {
              status: "DRAFT" as const,
              reviewedById: null,
              reviewedAt: null,
              rejectionReason: null,
            }
          : {};

      const updated = await prisma.event.update({
        where: { id: payload.id },
        data: { ...baseData, ...rejectionReset },
      });

      return NextResponse.json(ok(updated), { status: 200 });
    }

    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const created = await prisma.event.create({
      data: {
        ...baseData,
        status: "DRAFT",
        createdById: user.id,
      },
    });

    return NextResponse.json(ok(created), { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
}

