import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useCreateGuest } from "./useCreateGuest";

function CreateGuestForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { createGuest, isCreating } = useCreateGuest();

  function onSubmit(data) {
    // For now, we'll just use a placeholder for the flag or omit it if the DB allows.
    // Ideally, we'd have a country selector that provides the flag URL.
    // Let's assume a default or that the backend handles it, or just pass a placeholder.
    // The data-guests.js shows full https://flagcdn.com URLs.
    // We can try to guess it or just leave it blank if not required.
    // Looking at the error "Guest is required" in CreateBookingForm, having a guest is critical.

    // Simple implementation:
    createGuest(
      {
        ...data,
        countryFlag: data.countryFlag || `https://flagcdn.com/un.svg`,
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      },
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full Name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isCreating}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isCreating}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isCreating}
          {...register("nationality", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isCreating}
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        {/* If we are in a modal */}
        {onCloseModal && (
          <Button
            variation="secondary"
            type="reset"
            onClick={() => onCloseModal()}
          >
            Cancel
          </Button>
        )}
        <Button disabled={isCreating}>Create new guest</Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
