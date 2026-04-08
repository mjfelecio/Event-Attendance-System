import { FieldDescription, FieldLegend } from "@/globals/components/shad-cn/field";

const SectionHeading = ({ title, description }: { title: string; description: string }) => (
  <>
    <FieldLegend className="mb-1 font-bold text-slate-800">{title}</FieldLegend>
    <FieldDescription className="text-[11px] text-slate-500">{description}</FieldDescription>
  </>
);

export default SectionHeading;