import {
  DEPARTMENTS,
  HOUSES,
  SHS_STRANDS,
} from "@/globals/constants/groups";
import { slugify } from "@/globals/utils/text";

/**
 * Presentation lookups for the selection boards.
 *
 * The boards render one tile per `Group` row from the database - that is the
 * source of truth, and it is what lets an operator add a department in Settings
 * and immediately reach its roster. These maps only supply the artwork and
 * grouping that the `Group` table has no column for. A slug that is missing
 * from a map is not an error: the tile falls back to initials, and an unknown
 * strand track falls into the "Other" panel.
 */

export const GROUP_LOGO_BY_SLUG: Record<string, string> = {
  ...Object.fromEntries(DEPARTMENTS.map((d) => [d.slug, d.logo])),
  ...Object.fromEntries(HOUSES.map((h) => [h.slug, h.logo])),
};

export const DEPARTMENT_ABBREVIATION_BY_SLUG: Record<string, string> =
  Object.fromEntries(DEPARTMENTS.map((d) => [d.slug, d.abbreviation]));

export type StrandTrack = "ACADEMIC" | "TECHVOC";

// Strand slugs are slugify(code), not slugify(name) - "Computer System
// Servicing" is stored as `css`.
export const STRAND_TRACK_BY_SLUG: Record<string, StrandTrack> =
  Object.fromEntries(SHS_STRANDS.map((s) => [slugify(s.code), s.track]));
