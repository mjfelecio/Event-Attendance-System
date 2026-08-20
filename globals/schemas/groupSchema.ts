import { EventCategory } from "@prisma/client";
import z from "zod";

/**
 * The `EventCategory` values that are meaningful on a `Group`.
 *
 * `ALL`, `COLLEGE`, and `SHS` are event-only: they scope by `Student.schoolLevel`
 * rather than by group membership, so a group can never carry one.
 *
 * @see docs/domain-model.md — "Group"
 */
export const GROUP_CATEGORIES = [
  EventCategory.DEPARTMENT,
  EventCategory.PROGRAM,
  EventCategory.STRAND,
  EventCategory.HOUSE,
  EventCategory.SECTION,
  EventCategory.YEAR,
] as const;

export type GroupCategory = (typeof GROUP_CATEGORIES)[number];

/**
 * Slugs are what students are written against (`validateStudentGroupSlugs`) and
 * what event eligibility joins on, so they are restricted to the shape every
 * existing seeded slug already has: lowercase, digits, and single hyphens.
 */
const groupSlug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(60, "Slug must be 60 characters or fewer")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only",
  );

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  slug: groupSlug,
  category: z.enum(GROUP_CATEGORIES),
});

/**
 * Rename only. The slug is immutable: students join groups through a relation
 * row so a rename is survivable for membership, but the selection boards and
 * every saved roster URL key on the slug. Delete and recreate is the escape
 * hatch for a genuinely wrong slug.
 */
export const updateGroupSchema = createGroupSchema.pick({ name: true });

export const deleteGroupSchema = z.object({
  /**
   * Where the deleted group's students should land. `null` (or omitted) leaves
   * them with no group of that category.
   */
  reassignToGroupId: z.string().min(1).nullable().optional(),
});

export type CreateGroupValues = z.infer<typeof createGroupSchema>;
export type UpdateGroupValues = z.infer<typeof updateGroupSchema>;
