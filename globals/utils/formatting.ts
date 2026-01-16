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

export function readableDate(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
