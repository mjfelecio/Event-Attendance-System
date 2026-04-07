import { Input } from "@/globals/components/shad-cn/input";
import { Label } from "@/globals/components/shad-cn/label";
import SectionHeading from "./SectionHeading";

const PersonalInfoSection = ({ student }: { student?: any }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
    <SectionHeading title="Personal Details" description="Basic identification info" />
    <div className="grid gap-4">
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Student ID</Label>
        <Input placeholder="2022-XXXXX" defaultValue={student?.id} className="rounded-xl border-slate-200 focus-visible:ring-slate-900" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">First Name</Label>
          <Input placeholder="John" defaultValue={student?.firstName} className="rounded-xl border-slate-200" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Last Name</Label>
          <Input placeholder="Doe" defaultValue={student?.lastName} className="rounded-xl border-slate-200" />
        </div>
      </div>
    </div>
  </div>
);

export default PersonalInfoSection;