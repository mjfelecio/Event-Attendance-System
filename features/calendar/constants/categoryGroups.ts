import { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import { EventCategory, YearLevel } from "@prisma/client";
import { capitalize } from "lodash";

// ==> TYPES <==
export type Department = "CS" | "HM" | "BA";

export const EVENT_CHOICES: ComboBoxValue[] = Object.values(EventCategory).map((l) => ({
  value: l,
  label: `${capitalize(l)} Event`,
}));

// Empty arrays means that the category itself is the group
// Ex: ALL => Everyone, COLLEGE => All College Students
// TODO: Implement "group exclusion" to exclude specific groups from a category
export const CATEGORY_GROUPS: Record<EventCategory, ComboBoxValue[]> = {
  ALL: [],
  COLLEGE: [],
  SHS: [],
  DEPARTMENT: [
    { value: "CS", label: "Computer Studies" },
    { value: "HM", label: "Hotel Management" },
    { value: "BA", label: "Business Administration" },
  ],
  HOUSE: [
    { value: "AZUL", label: "Azul" },
    { value: "ROXXO", label: "Roxxo" },
    { value: "CAHEL", label: "Cahel" },
    { value: "GIALLIO", label: "Giallio" },
    { value: "VIERRDY", label: "Vierrdy" },
  ],
  PROGRAM: [
    { value: "BSCS", label: "BSCS" },
    { value: "BSIT", label: "BSIT" },
    { value: "BSHM", label: "BSHM" },
    { value: "WAD", label: "WAD" },
  ],
  YEAR: Object.keys(YearLevel).map((l) => ({
    value: l,
    label: l,
  })),
  SECTION: [
    { value: "BSCS-2A", label: "BSCS-2A" },
    { value: "BSIT-2B", label: "BSIT-2B" },
  ],
  STRAND: [
    { value: "ANIMATION", label: "Animation" },
    { value: "PROGRAMMING", label: "Programming" },
  ],
};
