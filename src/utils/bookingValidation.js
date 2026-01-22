import { differenceInDays, isAfter, isBefore, parseISO } from "date-fns";

// Validate date range
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return { isValid: false, error: "Both start and end dates are required" };
  }

  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  if (isAfter(start, end)) {
    return { isValid: false, error: "Start date must be before end date" };
  }

  if (isBefore(start, new Date())) {
    return { isValid: false, error: "Start date cannot be in the past" };
  }

  return { isValid: true, error: null };
}

// Validate guest count
export function validateGuestCount(numGuests, maxCapacity) {
  if (!numGuests || numGuests < 1) {
    return { isValid: false, error: "At least 1 guest is required" };
  }

  if (numGuests > maxCapacity) {
    return {
      isValid: false,
      error: `Number of guests cannot exceed cabin capacity of ${maxCapacity}`,
    };
  }

  return { isValid: true, error: null };
}

// Calculate number of nights
export function calculateNumNights(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  return differenceInDays(end, start);
}

// Check if there's a date conflict with existing bookings
export function checkDateConflict(cabinId, startDate, endDate, existingBookings) {
  if (!cabinId || !startDate || !endDate || !existingBookings) {
    return { hasConflict: false, conflictingBooking: null };
  }

  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  const conflict = existingBookings.find((booking) => {
    if (booking.cabinId !== cabinId) return false;
    if (booking.status === "checked-out" || booking.status === "cancelled") return false;

    const bookingStart = parseISO(booking.startDate);
    const bookingEnd = parseISO(booking.endDate);

    // Check if dates overlap
    return (
      (isAfter(start, bookingStart) && isBefore(start, bookingEnd)) ||
      (isAfter(end, bookingStart) && isBefore(end, bookingEnd)) ||
      (isBefore(start, bookingStart) && isAfter(end, bookingEnd)) ||
      start.getTime() === bookingStart.getTime() ||
      end.getTime() === bookingEnd.getTime()
    );
  });

  return {
    hasConflict: !!conflict,
    conflictingBooking: conflict || null,
  };
}

// Validate entire booking object
export function validateBooking(bookingData, cabin, existingBookings = []) {
  const errors = {};

  // Validate guest
  if (!bookingData.guestId) {
    errors.guestId = "Guest is required";
  }

  // Validate cabin
  if (!bookingData.cabinId) {
    errors.cabinId = "Cabin is required";
  }

  // Validate dates
  const dateValidation = validateDateRange(bookingData.startDate, bookingData.endDate);
  if (!dateValidation.isValid) {
    errors.dates = dateValidation.error;
  }

  // Validate guest count
  if (cabin) {
    const guestValidation = validateGuestCount(bookingData.numGuests, cabin.maxCapacity);
    if (!guestValidation.isValid) {
      errors.numGuests = guestValidation.error;
    }
  }

  // Check for conflicts
  const conflictCheck = checkDateConflict(
    bookingData.cabinId,
    bookingData.startDate,
    bookingData.endDate,
    existingBookings
  );

  if (conflictCheck.hasConflict) {
    errors.dates = "This cabin is already booked for the selected dates";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
