import { useQuery } from "@tanstack/react-query";
import { getAvailableCabins } from "../../services/apiBookings";

export function useAvailableCabins(startDate, endDate) {
  const {
    isLoading,
    data: availableCabins,
    error,
  } = useQuery({
    queryKey: ["available-cabins", startDate, endDate],
    queryFn: () => getAvailableCabins(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  return { isLoading, error, availableCabins };
}
