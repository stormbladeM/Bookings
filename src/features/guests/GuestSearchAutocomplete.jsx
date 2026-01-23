import { useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import Button from "../../ui/Button";
import { useGuests } from "./useGuests";
import CreateGuestForm from "./CreateGuestForm"; // Re-trigger HMR
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SelectWrapper = styled.div`
  flex: 1;
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

  return (
    <Container>
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

      <Modal>
        <Modal.open opens="guest-form">
          <Button variation="secondary" size="small">
            New Guest
          </Button>
        </Modal.open>
        <Modal.window name="guest-form">
          <CreateGuestForm />
        </Modal.window>
      </Modal>
    </Container>
  );
}

export default GuestSearchAutocomplete;
