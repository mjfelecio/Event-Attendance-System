"use client";

import AddStudentDialogFooter from "@/features/manage-list/components/add-dialog/AddStudentDialogFooter";
import AddStudentDialogHeader from "@/features/manage-list/components/add-dialog/AddStudentDialogHeader";
import AddStudentFormFields from "@/features/manage-list/components/add-dialog/AddStudentFormFields";
import { useAddStudentForm } from "@/features/manage-list/hooks/add-dialog/useAddStudentForm";
import { AddStudentDialogProps } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";

const AddStudentDialog = (props: AddStudentDialogProps) => {
  const { open } = props;

  const {
    formData,
    errors,
    submitError,
    isSubmitting,
    requireMiddleName,
    yearLevelOptions,
    dialogTitle,
    submitText,
    isEditMode,
    handleFieldChange,
    handleToggleMiddleName,
    handleSubmit,
    handleClose,
  } = useAddStudentForm(props);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <AddStudentDialogHeader
          isSubmitting={isSubmitting}
          onClose={handleClose}
          title={dialogTitle}
        />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <AddStudentFormFields
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            requireMiddleName={requireMiddleName}
            yearLevelOptions={yearLevelOptions}
            onFieldChange={handleFieldChange}
            onToggleMiddleName={handleToggleMiddleName}
            isEditMode={isEditMode}
          />

          {submitError && (
            <p className="text-sm text-rose-600">{submitError}</p>
          )}

          <AddStudentDialogFooter
            isSubmitting={isSubmitting}
            submitText={submitText}
            onClose={handleClose}
          />
        </form>
      </div>
    </div>
  );
};

export default AddStudentDialog;
