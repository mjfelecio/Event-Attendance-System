/** "DEPARTMENT" -> "Department" (first letter up, rest lowered). */
export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Enum-ish labels that must stay uppercase rather than title-cased
// (capitalize("SHS") would otherwise render "Shs").
const KNOWN_ACRONYMS = new Set(["SHS"]);

/** Like capitalize, but preserves known acronyms (SHS stays "SHS"). */
export const capitalizeLabel = (value: string): string =>
  KNOWN_ACRONYMS.has(value) ? value : capitalize(value);

/** "fooBar-baz" -> "FOO BAR BAZ" (words split, uppercased, space-joined). */
export const upperCase = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toUpperCase();
