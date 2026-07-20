export function fullName(
  firstName: string,
  middleName: string,
  lastName: string,
  format: "last" | "first" = "first"
) {
  const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";

  // Join only the present parts so a missing middle name doesn't leave a
  // double space (e.g. "Johnny  Adams").
  if (format === "last") {
    const rest = [firstName, middleInitial].filter(Boolean).join(" ");
    return `${lastName}, ${rest}`;
  }

  return [firstName, middleInitial, lastName].filter(Boolean).join(" ");
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
