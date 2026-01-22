import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function CabinAvailabilityCalendar({ availableCabins, onDateChange }) {
  const [range, setRange] = useState<DateRange | undefined>();

  const isDateAvailable = (date) => {
    // Check against useAvailableCabins hook data
    return availableCabins.some(cabin => 
      !cabin.unavailableDates.some(unavail => 
        unavail.startDate <= date && date <= unavail.endDate
      )
    );
  };

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={setRange}
      onDayClick={(date) => {
        if (isDateAvailable(date)) onDateChange(range);
      }}
      modifiers={{
        available: { fromDate: new Date(), toDate: new Date(Date.now() + 365 * 86400000) },
      }}
      modifiersStyles={{
        available: { backgroundColor: '#22c55e', color: 'white' },
      }}
    />
  );
}
