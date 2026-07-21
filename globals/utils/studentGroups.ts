import { prisma } from "@/globals/libs/prisma";

export type StudentGroupFields = {
  section?: string | null;
  house?: string | null;
  department?: string | null;
  program?: string | null;
  strand?: string | null;
};

// Each student column may only reference a group of the matching category.
const FIELD_CATEGORY = {
  section: "SECTION",
  house: "HOUSE",
  department: "DEPARTMENT",
  program: "PROGRAM",
  strand: "STRAND",
} as const;

export type GroupResolution =
  | { ok: true; slugToId: Map<string, string> }
  | { ok: false; error: string };

/**
 * Validates that every group slug referenced by these students exists AND
 * belongs to the category of the column that referenced it, then returns a
 * slug -> id map. Shared by the single-student and bulk-import write paths so
 * both enforce the same integrity rules (a HOUSE slug can't be smuggled into
 * the section column, and unknown slugs are rejected rather than dropped).
 */
export async function validateStudentGroupSlugs(
  students: StudentGroupFields[],
): Promise<GroupResolution> {
  const referenced = new Set<string>();
  for (const s of students) {
    for (const field of Object.keys(
      FIELD_CATEGORY,
    ) as (keyof StudentGroupFields)[]) {
      const slug = s[field];
      if (slug) referenced.add(slug);
    }
  }

  if (referenced.size === 0) return { ok: true, slugToId: new Map() };

  const groups = await prisma.group.findMany({
    where: { slug: { in: [...referenced] } },
    select: { id: true, slug: true, category: true },
  });
  const bySlug = new Map(groups.map((g) => [g.slug, g]));

  const unknown = [...referenced].filter((slug) => !bySlug.has(slug));
  if (unknown.length > 0) {
    return {
      ok: false,
      error: `Unknown group(s): ${unknown.join(", ")}. Fix and retry.`,
    };
  }

  const mismatches = new Set<string>();
  for (const s of students) {
    for (const [field, expected] of Object.entries(FIELD_CATEGORY)) {
      const slug = s[field as keyof StudentGroupFields];
      if (!slug) continue;
      const group = bySlug.get(slug)!;
      if (group.category !== expected) {
        mismatches.add(
          `"${slug}" is a ${group.category.toLowerCase()}, not a ${expected.toLowerCase()} (column "${field}")`,
        );
      }
    }
  }
  if (mismatches.size > 0) {
    return {
      ok: false,
      error: `Group category mismatch: ${[...mismatches].join("; ")}.`,
    };
  }

  const slugToId = new Map([...bySlug].map(([slug, g]) => [slug, g.id]));
  return { ok: true, slugToId };
}
