export function fullName(
  firstName: string,
  middleName: string,
  lastName: string,
  format: "last" | "first" = "first"
) {
  const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";

  if (format === "last") {
    return `${lastName}, ${firstName} ${middleInitial}`;
  }

  return `${firstName} ${middleInitial} ${lastName}`.trim();
}
