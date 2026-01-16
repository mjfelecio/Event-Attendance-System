import { Button } from "@/globals/components/shad-cn/button";

type ExportButtonProps = {
  onExport: () => void;
  isLoading?: boolean;
  label?: string;
};

const ExportButton = ({
  onExport,
  isLoading = false,
  label = "Export",
}: ExportButtonProps) => {
  return (
    <Button onClick={onExport} disabled={isLoading}>
      {isLoading ? "Exporting…" : label}
    </Button>
  );
};

export default ExportButton;
