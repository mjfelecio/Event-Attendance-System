/**
 * Centralized query key factory.
 *
 * Prevents inconsistent cache keys and makes cache invalidation predictable.
 */
export const queryKeys = {
  events: {
    all: () => ["events"] as const,
    withId: (eventId: string) => ["events", "byId", eventId] as const,
    statsFromEvent: (eventId: string) => ["events", "stats", eventId] as const,
  },
  students: {
    all: () => ["students"] as const,
    withId: (studentId: string) => ["students", "byId", studentId] as const,
    fromEvent: (eventId: string) => ["students", "fromEvent", eventId] as const,
    fromEventWithId: (eventId: string, studentId: string) =>
      ["students", "fromEventWithId", eventId, studentId] as const,
  },
  records: {
    all: () => ["records"] as const,
    withId: (id: string) => ["records", "byId", id] as const,
    fromEvent: (eventId: string) => ["records", "fromEvent", eventId] as const,
    fromStudent: (studentId: string) =>
      ["records", "fromStudent", studentId] as const,
    fromEventForStudent: (eventId: string, studentId: string) =>
      ["records", "fromEventForStudent", eventId, studentId] as const,
  },
  admin: {
    pendingOrganizers: () => ["admin", "pendingOrganizers"] as const,
  },
};
