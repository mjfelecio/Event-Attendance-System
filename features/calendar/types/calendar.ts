import { Event } from "@/globals/types/events";

export interface DraftEvent {
  id: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  editable: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface CalendarProps {
  onSelectDate: (start: Date, end: Date) => void;
  isDrawerOpen: boolean;
  onEditEvent?: (event: Event) => void;
}