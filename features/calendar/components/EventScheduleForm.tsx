import { Switch } from "@/globals/components/shad-cn/switch";
import DateTimeForm from "@/features/calendar/components/DateTimeForm";

const EventScheduleForm = () => {
  return (
    <div>
      <p className="text-md font-medium mb-2">Schedule</p>
      <div className="w-full rounded-xl flex flex-col gap-2">
        {/* All Day Toggle */}
        <div className="flex flex-row items-center gap-3">
          <p className="font-medium text-sm">All Day</p>
          <Switch />
        </div>

        <DateTimeForm label="Start" />
        <DateTimeForm label="End" />
      </div>
    </div>
  );
};

export default EventScheduleForm;
