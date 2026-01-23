import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useCreateGuest } from "./useCreateGuest";

function CreateGuestForm({ onCloseModal }) {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const { createGuest, isCreating } = useCreateGuest();

  function onSubmit(data) {
    createGuest(data, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isCreating}
          {...register("fullName", {
            required: "Full name is required",
          })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isCreating}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isCreating}
          {...register("nationality", {
            required: "Nationality is required",
          })}
        />
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isCreating}
          {...register("nationalID", {
            required: "National ID is required",
          })}
        />
      </FormRow>

      <FormRow label="Country flag (emoji or URL)">
        <Input
          type="text"
          id="countryFlag"
          disabled={isCreating}
          placeholder="e.g., 🇺🇸 or flag URL"
          {...register("countryFlag")}
        />
      </FormRow>

      <FormRow>
        {onCloseModal && (
          <Button
            variation="secondary"
            type="reset"
            disabled={isCreating}
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
        )}
        <Button disabled={isCreating}>
          {isCreating ? "Creating..." : "Create guest"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
