import { useQuery } from "@tanstack/react-query";
import { searchGuests } from "../../services/apiGuests";

export function useSearchGuests(searchQuery) {
  const {
    isLoading,
    data: guests,
    error,
  } = useQuery({
    queryKey: ["guests-search", searchQuery],
    queryFn: () => searchGuests(searchQuery),
    enabled: !!searchQuery && searchQuery.length >= 2,
  });

  return { isLoading, error, guests };
}
