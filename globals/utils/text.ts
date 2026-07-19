/** "DEPARTMENT" -> "Department" (first letter up, rest lowered). */
export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/** "fooBar-baz" -> "FOO BAR BAZ" (words split, uppercased, space-joined). */
export const upperCase = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toUpperCase();
