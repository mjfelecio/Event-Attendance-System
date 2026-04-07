import SectionHeading from "./SectionHeading";

const AcademicSection = ({ student }: { student?: any }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
    <SectionHeading title="Academic Standing" description="Level and Year classification" />
    {/* Use ShadCN Selects here for SchoolLevel and YearLevel */}
    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
      Select components for Level & Year would go here.
    </div>
  </div>
);

export default AcademicSection;