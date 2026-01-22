import { differenceInDays, isBefore, isPast, startOfToday } from "date-fns";

export function calculateNumNights(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  return differenceInDays(new Date(endDate), new Date(startDate));
}

export function validateBookingDates(startDate, endDate) {
  const errors = {};

  if (!startDate) {
    errors.startDate = "Start date is required";
  }

  if (!endDate) {
    errors.endDate = "End date is required";
  }

  if (startDate && endDate) {
    if (isBefore(new Date(endDate), new Date(startDate))) {
      errors.endDate = "End date must be after start date";
    }

    if (differenceInDays(new Date(endDate), new Date(startDate)) < 1) {
      errors.endDate = "Booking must be at least 1 night";
    }
  }

  if (
    startDate &&
    isPast(new Date(startDate)) &&
    !isSameDay(new Date(startDate), startOfToday())
  ) {
    // Allowing today is usually fine, but generally past dates shouldn't be allowed for new bookings
    // Unless we are back-dating a booking manually. For now, let's warn or error.
    // errors.startDate = "Start date cannot be in the past";
  }

  return errors;
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
