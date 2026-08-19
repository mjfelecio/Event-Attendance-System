/** "DEPARTMENT" -> "Department" (first letter up, rest lowered). */
export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Enum-ish labels that must stay uppercase rather than title-cased
// (capitalize("SHS") would otherwise render "Shs").
const KNOWN_ACRONYMS = new Set(["SHS"]);

/** Like capitalize, but preserves known acronyms (SHS stays "SHS"). */
export const capitalizeLabel = (value: string): string =>
  KNOWN_ACRONYMS.has(value) ? value : capitalize(value);

/**
 * "Computer Studies" -> "computer-studies". The canonical way to derive a
 * `Group.slug` from a name. Note that not every existing group follows it -
 * strands are slugified from their code, so "Computer System Servicing" is
 * stored as `css` - which is why the group form lets the slug be edited.
 */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** "fooBar-baz" -> "FOO BAR BAZ" (words split, uppercased, space-joined). */
export const upperCase = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toUpperCase();
