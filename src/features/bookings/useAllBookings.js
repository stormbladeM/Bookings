import { useQuery } from "@tanstack/react-query";
import { getAllBookingsForConflictCheck } from "../../services/apiBookings";

export function useAllBookings() {
  const {
    isLoading,
    data: allBookings,
    error,
  } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: getAllBookingsForConflictCheck,
  });

  return { isLoading, error, allBookings };
}
