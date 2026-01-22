import styled from "styled-components";
import { calculateBookingPrices } from "../../utils/priceCalculation";
import { formatCurrency } from "../../utils/helpers";

const PriceBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin: 2rem 0;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 1.8rem;
    padding-top: 1.5rem;
    margin-top: 1rem;
    border-top: 2px solid var(--color-grey-300);
  }
`;

const Label = styled.span`
  color: var(--color-grey-600);
`;

const Value = styled.span`
  color: var(--color-grey-700);
  font-weight: 500;
`;

const TotalValue = styled(Value)`
  color: var(--color-brand-600);
  font-size: 2rem;
`;

function BookingPriceCalculator({
  cabin,
  numGuests,
  numNights,
  hasBreakfast,
  breakfastPrice = 15,
}) {
  if (!cabin || !numNights) return null;

  const prices = calculateBookingPrices(
    cabin,
    numGuests,
    numNights,
    hasBreakfast,
    breakfastPrice
  );

  return (
    <PriceBox>
      <PriceRow>
        <Label>
          Cabin ({numNights} {numNights === 1 ? "night" : "nights"} × {formatCurrency(cabin.regularPrice)})
        </Label>
        <Value>{formatCurrency(cabin.regularPrice * numNights)}</Value>
      </PriceRow>

      {cabin.discount > 0 && (
        <PriceRow>
          <Label>Discount</Label>
          <Value>-{formatCurrency(prices.discount)}</Value>
        </PriceRow>
      )}

      {hasBreakfast && (
        <PriceRow>
          <Label>
            Breakfast ({numGuests} {numGuests === 1 ? "guest" : "guests"} × {numNights}{" "}
            {numNights === 1 ? "night" : "nights"} × {formatCurrency(breakfastPrice)})
          </Label>
          <Value>{formatCurrency(prices.extrasPrice)}</Value>
        </PriceRow>
      )}

      <PriceRow>
        <Label>Total Price</Label>
        <TotalValue>{formatCurrency(prices.totalPrice)}</TotalValue>
      </PriceRow>
    </PriceBox>
  );
}

export default BookingPriceCalculator;
