import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";
import { useCabins } from "../cabins/useCabins";
import { useAllBookings } from "./useAllBookings";
import GuestSearchAutocomplete from "../guests/GuestSearchAutocomplete";
import BookingPriceCalculator from "./BookingPriceCalculator";
import BookingTemplates from "./BookingTemplates";
import CabinAvailabilityCalendar from "./CabinAvailabilityCalendar";
import {
  calculateNumNights,
  validateBooking,
} from "../../utils/bookingValidation";
import { calculateBookingPrices } from "../../utils/priceCalculation";

function CreateBookingForm({ onCloseModal }) {
  const { register, handleSubmit, formState, setValue, watch, reset } =
    useForm();
  const { errors } = formState;
  const { createBooking, isCreating } = useCreateBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { allBookings, isLoading: isLoadingBookings } = useAllBookings();

  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Watch form values for real-time updates
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const numGuests = watch("numGuests", 1);
  const hasBreakfast = watch("hasBreakfast", false);
  const cabinId = watch("cabinId");

  // Calculate number of nights
  const numNights = calculateNumNights(startDate, endDate);

  // Update selected cabin when cabinId changes
  useEffect(() => {
    if (cabinId && cabins) {
      const cabin = cabins.find((c) => c.id === Number(cabinId));
      setSelectedCabin(cabin);
    }
  }, [cabinId, cabins]);

  // Calculate prices
  const prices = selectedCabin
    ? calculateBookingPrices(
        selectedCabin,
        numGuests,
        numNights,
        hasBreakfast,
        settings?.breakfastPrice,
      )
    : null;

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setValue("startDate", template.startDate);
    setValue("endDate", template.endDate);
    setValue("numGuests", template.numGuests);
    setValue("hasBreakfast", template.hasBreakfast);
    setValue("observations", template.observations);
  };

  // Handle calendar date selection
  const handleCalendarDateSelect = (range) => {
    if (range?.from) {
      setValue("startDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      setValue("endDate", format(range.to, "yyyy-MM-dd"));
    }
  };

  function onSubmit(data) {
    if (!selectedGuest) {
      return;
    }

    const bookingData = {
      guestId: selectedGuest.id,
      cabinId: Number(data.cabinId),
      startDate: data.startDate,
      endDate: data.endDate,
      numNights,
      numGuests: Number(data.numGuests),
      cabinPrice: prices.cabinPrice,
      extrasPrice: prices.extrasPrice,
      totalPrice: prices.totalPrice,
      status: "unconfirmed",
      hasBreakfast: data.hasBreakfast || false,
      isPaid: data.isPaid || false,
      observations: data.observations || "",
    };

    // Validate booking
    const validation = validateBooking(
      bookingData,
      selectedCabin,
      allBookings || [],
    );

    if (!validation.isValid) {
      // Show first error
      const firstError = Object.values(validation.errors)[0];
      alert(firstError);
      return;
    }

    createBooking(bookingData, {
      onSuccess: () => {
        reset();
        setSelectedGuest(null);
        setSelectedCabin(null);
        onCloseModal?.();
      },
    });
  }

  if (isLoadingSettings || isLoadingCabins || isLoadingBookings)
    return <Spinner />;

  // Filter available cabins based on selected dates
  const availableCabins = cabins?.filter((cabin) => {
    if (!startDate || !endDate || !allBookings) return true;

    const hasConflict = allBookings.some((booking) => {
      if (booking.cabinId !== cabin.id) return false;
      if (booking.status === "checked-out" || booking.status === "cancelled")
        return false;

      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      const selectedStart = new Date(startDate);
      const selectedEnd = new Date(endDate);

      return (
        (selectedStart >= bookingStart && selectedStart < bookingEnd) ||
        (selectedEnd > bookingStart && selectedEnd <= bookingEnd) ||
        (selectedStart <= bookingStart && selectedEnd >= bookingEnd)
      );
    });

    return !hasConflict;
  });

  return (
    <>
      <BookingTemplates onSelectTemplate={handleTemplateSelect} />

      <Form onSubmit={handleSubmit(onSubmit)} type="modal">
        <FormRow label="Guest" error={!selectedGuest && "Guest is required"}>
          <GuestSearchAutocomplete
            selectedGuest={selectedGuest}
            onSelectGuest={setSelectedGuest}
          />
        </FormRow>

        <FormRow>
          <Button
            type="button"
            variation="secondary"
            size="small"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
          </Button>
        </FormRow>

        {showCalendar && (
          <CabinAvailabilityCalendar
            availableCabins={availableCabins}
            selectedCabinId={cabinId}
            allBookings={allBookings}
            onDateSelect={handleCalendarDateSelect}
            selectedRange={
              startDate && endDate
                ? { from: new Date(startDate), to: new Date(endDate) }
                : undefined
            }
          />
        )}

        <FormRow label="Start date" error={errors?.startDate?.message}>
          <Input
            type="date"
            id="startDate"
            min={format(new Date(), "yyyy-MM-dd")}
            {...register("startDate", {
              required: "Start date is required",
            })}
          />
        </FormRow>

        <FormRow label="End date" error={errors?.endDate?.message}>
          <Input
            type="date"
            id="endDate"
            min={startDate || format(new Date(), "yyyy-MM-dd")}
            {...register("endDate", {
              required: "End date is required",
            })}
          />
        </FormRow>

        <FormRow label="Cabin" error={errors?.cabinId?.message}>
          <select
            id="cabinId"
            {...register("cabinId", { required: "Cabin is required" })}
            disabled={!startDate || !endDate}
          >
            <option value="">Select a cabin...</option>
            {availableCabins?.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} (Max {cabin.maxCapacity} guests) - $
                {cabin.regularPrice}
                {cabin.discount > 0 && ` (-$${cabin.discount} discount)`}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Number of guests" error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            min="1"
            max={selectedCabin?.maxCapacity || 10}
            defaultValue={1}
            {...register("numGuests", {
              required: "Number of guests is required",
              min: { value: 1, message: "At least 1 guest required" },
              max: {
                value: selectedCabin?.maxCapacity || 10,
                message: `Maximum ${selectedCabin?.maxCapacity || 10} guests`,
              },
            })}
          />
        </FormRow>

        <FormRow>
          <Checkbox id="hasBreakfast" {...register("hasBreakfast")}>
            Include breakfast? (${settings?.breakfastPrice || 15} per guest per
            night)
          </Checkbox>
        </FormRow>

        <FormRow>
          <Checkbox id="isPaid" {...register("isPaid")}>
            Booking is paid?
          </Checkbox>
        </FormRow>

        <FormRow label="Observations">
          <Textarea
            id="observations"
            {...register("observations")}
            placeholder="Any special requests or observations..."
          />
        </FormRow>

        {prices && numNights > 0 && (
          <BookingPriceCalculator
            cabin={selectedCabin}
            numNights={numNights}
            numGuests={numGuests}
            hasBreakfast={hasBreakfast}
            breakfastPrice={settings?.breakfastPrice}
          />
        )}

        <FormRow>
          <Button
            variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isCreating || !selectedGuest}>
            {isCreating ? "Creating..." : "Create booking"}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateBookingForm;
