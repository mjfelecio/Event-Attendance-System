import { Badge } from "@/globals/components/shad-cn/badge";
import { cn } from "@/globals/libs/shad-cn";
import { Event } from "@/globals/types/events";

// Workflow status → chip color, matching the dashboard's status vocabulary
// (DRAFT amber, PENDING sky/blue, APPROVED emerald, REJECTED rose). Overriding
// the Badge's default background via className is intentional: twMerge resolves
// the bg-*/text-* conflict in favour of these, so the badge stays a single
// consistent pill across the reports surfaces that render it.
const STATUS_STYLES: Record<Event["status"], string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PENDING: "bg-sky-100 text-sky-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

type Props = {
  status: Event["status"];
  className?: string;
};

const EventStatusBadge = ({ status, className }: Props) => (
  <Badge className={cn("capitalize", STATUS_STYLES[status], className)}>
    {status.toLowerCase()}
  </Badge>
);

export default EventStatusBadge;
