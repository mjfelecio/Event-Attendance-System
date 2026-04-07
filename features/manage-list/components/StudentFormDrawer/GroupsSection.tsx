import SectionHeading from "./SectionHeading";

const GroupsSection = ({ student }: { student?: any }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
    <SectionHeading title="Group Assignments" description="House, Section, and Department" />
    <div className="space-y-3">
       {["Department", "Program", "Strand", "Section", "House"].map(label => (
         <div key={label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-xs font-semibold text-slate-600">{label}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">None</span>
         </div>
       ))}
    </div>
  </div>
);

export default GroupsSection;