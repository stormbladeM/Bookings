import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styled from "styled-components";

const CalendarContainer = styled.div`
  padding: 2rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  margin-bottom: 2rem;

  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: var(--color-brand-600);
    --rdp-background-color: var(--color-brand-200);
    margin: 0;
  }

  .rdp-day_selected:not([disabled]) {
    background-color: var(--color-brand-600);
    color: var(--color-grey-0);
  }

  .rdp-day_available {
    background-color: var(--color-green-100);
    color: var(--color-green-700);
    font-weight: 600;
  }

  .rdp-day_unavailable {
    background-color: var(--color-red-100);
    color: var(--color-red-700);
    text-decoration: line-through;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const LegendColor = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: var(--border-radius-sm);
  background-color: ${(props) => props.color};
`;

function CabinAvailabilityCalendar({
  availableCabins = [],
  selectedCabinId,
  allBookings = [],
  onDateSelect,
  selectedRange,
}) {
  const [range, setRange] = useState(selectedRange);

  // Get unavailable dates for selected cabin
  const getUnavailableDates = () => {
    if (!selectedCabinId || !allBookings) return [];

    return allBookings
      .filter(
        (booking) =>
          booking.cabinId === Number(selectedCabinId) &&
          booking.status !== "checked-out" &&
          booking.status !== "cancelled",
      )
      .flatMap((booking) => {
        const dates = [];
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        // Generate all dates in the range
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      });
  };

  const unavailableDates = getUnavailableDates();

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.toDateString() === date.toDateString(),
    );
  };

  const handleSelect = (newRange) => {
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      onDateSelect?.(newRange);
    }
  };

  const modifiers = {
    unavailable: unavailableDates,
    available: (date) => {
      return (
        date >= new Date() &&
        !isDateUnavailable(date) &&
        (selectedCabinId ? true : availableCabins.length > 0)
      );
    },
  };

  const modifiersStyles = {
    unavailable: {
      backgroundColor: "var(--color-red-100)",
      color: "var(--color-red-700)",
      textDecoration: "line-through",
    },
  };

  return (
    <CalendarContainer>
      <Legend>
        <LegendItem>
          <LegendColor color="var(--color-green-100)" />
          <span>Available</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="var(--color-red-100)" />
          <span>Unavailable</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="var(--color-brand-600)" />
          <span>Selected</span>
        </LegendItem>
      </Legend>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={[
          { before: new Date() },
          ...(selectedCabinId ? unavailableDates : []),
        ]}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        numberOfMonths={2}
      />
    </CalendarContainer>
  );
}

export default CabinAvailabilityCalendar;
