/**
 * The single source of truth for the page-size selector across every table.
 *
 * Both the client-managed tables (Attendance, Reports) and the server-managed
 * Student List roster read this list, so the selector looks and behaves the
 * same everywhere. Before adding an option here, confirm the students endpoint
 * accepts it (see PAGE_SIZES in app/(main)/students/student-list/page.tsx)
 * - a value the server rejects would silently snap back to its default.
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
