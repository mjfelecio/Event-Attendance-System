const SectionHeading = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    <p className="text-[11px] text-slate-500">{description}</p>
  </div>
);

export default SectionHeading;