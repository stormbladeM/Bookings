import { useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import Button from "../../ui/Button";
import { useGuests } from "./useGuests";
import { useCreateGuest } from "./useCreateGuest";
import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SelectWrapper = styled.div`
  flex: 1;
  min-width: 0; /* Prevents overflow */
`;

const FormContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  max-width: 100%;
  overflow: hidden;

  /* Make form inputs fit */
  input,
  select,
  textarea {
    max-width: 100%;
  }
`;

const InlineForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--color-grey-0)",
    border: state.isFocused
      ? "1px solid var(--color-brand-600)"
      : "1px solid var(--color-grey-300)",
    borderRadius: "var(--border-radius-sm)",
    padding: "0.4rem",
    fontSize: "1.4rem",
    boxShadow: state.isFocused ? "var(--shadow-sm)" : "none",
    minWidth: 0,
    "&:hover": {
      borderColor: "var(--color-brand-600)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-grey-0)",
    border: "1px solid var(--color-grey-200)",
    borderRadius: "var(--border-radius-sm)",
    boxShadow: "var(--shadow-md)",
    zIndex: 1000,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--color-brand-600)"
      : state.isFocused
        ? "var(--color-brand-100)"
        : "var(--color-grey-0)",
    color: state.isSelected ? "var(--color-grey-0)" : "var(--color-grey-700)",
    padding: "1rem 1.5rem",
    cursor: "pointer",
    fontSize: "1.4rem",
    "&:hover": {
      backgroundColor: state.isSelected
        ? "var(--color-brand-600)"
        : "var(--color-brand-100)",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--color-grey-700)",
    fontSize: "1.4rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--color-grey-400)",
    fontSize: "1.4rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--color-grey-700)",
    fontSize: "1.4rem",
  }),
};

function GuestSearchAutocomplete({ selectedGuest, onSelectGuest }) {
  const { guests, isLoading } = useGuests();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const { createGuest, isCreating } = useCreateGuest();

  if (isLoading) return <Spinner />;

  // Format guests for react-select
  const guestOptions = guests?.map((guest) => ({
    value: guest.id,
    label: guest.fullName,
    guest: guest,
    searchableText:
      `${guest.fullName} ${guest.email} ${guest.nationality}`.toLowerCase(),
  }));

  // Custom filter function
  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    return option.data.searchableText.includes(inputValue.toLowerCase());
  };

  // Custom option component with additional details
  const formatOptionLabel = ({ guest }) => (
    <div>
      <div style={{ fontWeight: "600", marginBottom: "0.2rem" }}>
        {guest.fullName}
      </div>
      <div
        style={{
          fontSize: "1.2rem",
          color: "var(--color-grey-500)",
          display: "flex",
          gap: "1rem",
        }}
      >
        <span>{guest.email}</span>
        <span>•</span>
        <span>{guest.nationality}</span>
      </div>
    </div>
  );

  const handleChange = (selected) => {
    onSelectGuest(selected ? selected.guest : null);
  };

  const selectedOption = selectedGuest
    ? {
        value: selectedGuest.id,
        label: selectedGuest.fullName,
        guest: selectedGuest,
      }
    : null;

  // Handle inline form submission with event prevention
  const onSubmitGuestForm = (data, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    createGuest(data, {
      onSuccess: (newGuest) => {
        reset();
        setShowCreateForm(false);
        onSelectGuest(newGuest);
      },
    });
  };

  const handleCancelForm = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    reset();
    setShowCreateForm(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmitGuestForm)(e);
  };

  return (
    <Container>
      <SearchContainer>
        <SelectWrapper>
          <Select
            options={guestOptions}
            value={selectedOption}
            onChange={handleChange}
            onInputChange={(value) => setSearchTerm(value)}
            filterOption={filterOption}
            formatOptionLabel={formatOptionLabel}
            styles={customStyles}
            placeholder="Search guests by name, email, or nationality..."
            isClearable
            isSearchable
            noOptionsMessage={() => "No guests found"}
          />
        </SelectWrapper>

        <Button
          variation="secondary"
          size="small"
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "New Guest"}
        </Button>
      </SearchContainer>

      {showCreateForm && (
        <FormContainer>
          <InlineForm onSubmit={handleFormSubmit}>
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

            <ButtonGroup>
              <Button
                variation="secondary"
                type="button"
                disabled={isCreating}
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create guest"}
              </Button>
            </ButtonGroup>
          </InlineForm>
        </FormContainer>
      )}
    </Container>
  );
}

export default GuestSearchAutocomplete;
