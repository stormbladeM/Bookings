// Calculate cabin price based on number of nights
export function calculateCabinPrice(cabin, numNights) {
  if (!cabin || !numNights) return 0;
  return cabin.regularPrice * numNights;
}

// Calculate breakfast price
export function calculateBreakfastPrice(numGuests, numNights, breakfastRate = 15) {
  if (!numGuests || !numNights) return 0;
  return numGuests * numNights * breakfastRate;
}

// Calculate total price
export function calculateTotalPrice(cabinPrice, extrasPrice = 0) {
  return cabinPrice + extrasPrice;
}

// Calculate discount if applicable
export function calculateDiscount(cabin, numNights) {
  if (!cabin || !numNights) return 0;
  
  // Apply discount if available
  if (cabin.discount && cabin.discount > 0) {
    return (cabin.discount * numNights);
  }
  
  return 0;
}

// Calculate all booking prices
export function calculateBookingPrices(cabin, numGuests, numNights, hasBreakfast, breakfastRate = 15) {
  if (!cabin) {
    return {
      cabinPrice: 0,
      extrasPrice: 0,
      totalPrice: 0,
      discount: 0,
    };
  }

  const cabinPrice = calculateCabinPrice(cabin, numNights);
  const discount = calculateDiscount(cabin, numNights);
  const extrasPrice = hasBreakfast
    ? calculateBreakfastPrice(numGuests, numNights, breakfastRate)
    : 0;
  const totalPrice = calculateTotalPrice(cabinPrice - discount, extrasPrice);

  return {
    cabinPrice: cabinPrice - discount,
    extrasPrice,
    totalPrice,
    discount,
  };
}
