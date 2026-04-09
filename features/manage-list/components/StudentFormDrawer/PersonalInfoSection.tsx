import SectionHeading from "./SectionHeading";
import FormInput from "@/globals/components/shared/FormInput";
import { FieldGroup, FieldSet } from "@/globals/components/shad-cn/field";
import { useFormContext } from "react-hook-form";
import { StudentFormValues } from "@/globals/schemas/studentSchema";

const PersonalInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<StudentFormValues>();

  return (
    <FieldSet className="animate-in fade-in slide-in-from-right-4 duration-300">
      <SectionHeading
        title="Personal Details"
        description="Basic identification info"
      />

      <FieldGroup className="grid grid-cols-1 gap-y-4">
        <FormInput
          label="Student ID"
          placeholder="2026XXXXXX"
          {...register("id")}
          error={errors.id?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="John"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <FormInput
            label="Last Name"
            placeholder="Doe"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <FormInput
          label="Middle Name"
          placeholder="Mirron"
          {...register("middleName")}
          error={errors.middleName?.message}
          description="Leave blank if not applicable"
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default PersonalInfoSection;
