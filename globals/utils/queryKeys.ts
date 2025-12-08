/**
 * Centralized query key factory.
 *
 * Prevents inconsistent cache keys and makes cache invalidation predictable.
 */
export const queryKeys = {
  events: {
    all: () => ["events"] as const,
    byId: (id: string) => ["events", id] as const,
    records: (id: string) => ["events", id, "records"] as const,
  },
  records: {
    all: () => ["records"] as const,
    byId: (id: string) => ["records", id] as const,
    byEvent: (eventId: string) =>
      ["records", "by-event", eventId] as const,
    byEventStudent: (eventId: string, studentId: string) =>
      ["records", "by-event-student", eventId, studentId] as const,
  },
};
