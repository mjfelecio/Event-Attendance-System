import {
  DEPARTMENTS,
  HOUSES as HOUSE_INFO,
  SHS_STRANDS as STRAND_INFO,
} from "@/globals/constants/groups";
import { slugify } from "@/features/manage-list/utils/mapStudentToRow";

export const COLLEGE_DEPARTMENTS = DEPARTMENTS.map((d) => ({
  title: d.name,
  abbreviation: d.abbreviation,
  slug: d.slug,
  logo: d.logo,
}));

// Selection boards match rows via slugify(student.shsStrand), so each board
// entry's slug must equal slugify(<strand code>).
export const SHS_STRANDS = {
  academics: STRAND_INFO.filter((s) => s.track === "ACADEMIC").map((s) => ({
    title: s.name,
    slug: slugify(s.code)!,
  })),
  tvl: STRAND_INFO.filter((s) => s.track === "TECHVOC").map((s) => ({
    title: s.name,
    slug: slugify(s.code)!,
  })),
};

export const HOUSES = HOUSE_INFO.map((h) => ({
  name: h.name,
  slug: h.slug,
  logo: h.logo,
}));
