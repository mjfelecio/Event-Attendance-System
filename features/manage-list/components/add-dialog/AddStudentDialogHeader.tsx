import { X } from "lucide-react";

type AddStudentDialogHeaderProps = {
  isSubmitting: boolean;
  onClose: () => void;
  title: string;
};

const AddStudentDialogHeader = ({ isSubmitting, onClose, title }: AddStudentDialogHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-neutral-800">{title}</h2>
    <button
      type="button"
      onClick={onClose}
      className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
      aria-label="Close dialog"
      disabled={isSubmitting}
    >
      <X className="h-5 w-5" strokeWidth={1.6} />
    </button>
  </div>
);

export default AddStudentDialogHeader;
