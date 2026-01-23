import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking as createBookingApi } from "../../services/apiBookings";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (data) => {
      toast.success("Booking successfully created");
      // Invalidate multiple queries to refresh all related data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["today-activity"] });
    },
    onError: (err) => {
      console.error("Booking creation error:", err);
      toast.error(err.message || "Booking could not be created");
    },
  });

  return { createBooking, isCreating };
}
