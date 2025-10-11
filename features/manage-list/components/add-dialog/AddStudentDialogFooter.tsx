type AddStudentDialogFooterProps = {
  isSubmitting: boolean;
  submitText: string;
  onClose: () => void;
};

const AddStudentDialogFooter = ({ isSubmitting, submitText, onClose }: AddStudentDialogFooterProps) => (
  <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
    <button
      type="button"
      onClick={onClose}
      className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800"
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Saving..." : submitText}
    </button>
  </div>
);

export default AddStudentDialogFooter;
