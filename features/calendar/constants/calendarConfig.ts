export const CALENDAR_CONFIG = {
  SLOT_DURATION: "00:30:00",
  DEFAULT_TIMED_EVENT_DURATION: "00:30:00",
  SNAP_DURATION: "00:30:00",
  DRAFT_EVENT_ID: "draft",
  DRAFT_EVENT_COLOR: "oklch(68.5% 0.169 237.323)",
  SIDEBAR_RESIZE_DELAY: 300,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
} as const;

export const CALENDAR_HEADER_TOOLBAR = {
  left: "prev,next today",
  center: "title",
  right: "dayGridMonth,timeGridWeek,timeGridDay",
} as const;