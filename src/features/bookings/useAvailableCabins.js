import { useQuery } from "@tanstack/react-query";
import { getAvailableCabins } from "../../services/apiBookings";

export function useAvailableCabins(startDate, endDate) {
  const {
    isLoading,
    data: availableCabins,
    error,
  } = useQuery({
    queryKey: ["availableCabins", startDate, endDate],
    queryFn: () => getAvailableCabins(startDate, endDate),
    enabled: !!startDate && !!endDate, // Only run if dates are selected
  });

  return { isLoading, error, availableCabins };
}
