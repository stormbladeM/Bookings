import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  const numBookings = bookings ? bookings.length : 0;
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);
  const checkins = confirmedStays.length;
  const occupation =
    (confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) /
      (numDays * cabinCount)) *
    100;
  return (
    <>
      <Stat
        title="Recent Bookings"
        value={numBookings}
        color="blue"
        icon={<HiOutlineBriefcase />}
      />
      <Stat
        title="sales"
        value={formatCurrency(sales)}
        color="green"
        icon={<HiOutlineBanknotes />}
      />
      <Stat
        title="Check-Ins"
        value={checkins}
        color="indigo"
        icon={<HiOutlineCalendarDays />}
      />
      <Stat
        title="Occupancy Rate"
        value={Math.round(occupation) + "%"}
        color="yellow"
        icon={<HiOutlineChartBar />}
      />
    </>
  );
}
export default Stats;
