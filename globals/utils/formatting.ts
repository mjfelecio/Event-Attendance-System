import { startCase, toLower, toUpper } from "lodash";

export function fullName(
  firstName: string,
  middleName: string,
  lastName: string,
  format: "last" | "first" = "first",
) {
  const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";

  if (format === "last") {
    return `${lastName}, ${firstName} ${middleInitial}`;
  }

  return `${firstName} ${middleInitial} ${lastName}`.trim();
}

export function readableDate(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Normalizes strings like "hotel-management", "YEAR_1", or "computerStudies"
 * into proper names like "Hotel Management", "Year 1", or "Computer Studies".
 */
export const normalizeName = (slug: string | undefined | null): string => {
  if (!slug) return "";

  // toLower ensures that YEAR_1 doesn't become Y E A R 1
  // startCase handles the conversion to Title Case and replaces separators with spaces
  return startCase(toLower(slug));
};

/**
 * Formats academic sections like "stem-11a" into "STEM 11-A"
 * or "bscs-2a" into "BSCS 2-A".
 */
export const formatSection = (section: string | undefined | null): string => {
  if (!section) return "-";

  // 1. Split by non-alphanumeric characters (hyphens, spaces)
  const parts = section.split(/[- ]/);

  if (parts.length === 1) {
    // If it's a single string like "STEM11A", use regex to split letters from numbers
    const match = section.match(/^([a-zA-Z]+)(\d+)([a-zA-Z]*)$/);
    if (match) {
      const [_, dept, num, letter] = match;
      return `${toUpper(dept)} ${num}${letter ? `-${toUpper(letter)}` : ""}`;
    }
    return toUpper(section);
  }

  // 2. Handle the standard "Program-YearGroup" format
  const [program, yearGroup] = parts;

  // Regex to separate the trailing letter (e.g., "11a" -> "11" and "A")
  const yearMatch = yearGroup.match(/^(\d+)([a-zA-Z]*)$/);

  if (yearMatch) {
    const [_, year, letter] = yearMatch;
    return `${toUpper(program)} ${year}${letter ? `-${toUpper(letter)}` : ""}`;
  }

  return parts.map((p) => toUpper(p)).join(" ");
};