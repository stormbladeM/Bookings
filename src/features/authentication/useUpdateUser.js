// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import toast from "react-hot-toast";
// import { updateCurrentUser } from "../../services/apiAuth";

// export function useUpdateUser() {
//   const queryClient = useQueryClient();

//   const { mutate: updateUser, isLoading: isUpdating } = useMutation({
//     mutationFn: updateCurrentUser,
//     onSuccess: ({ user }) => {
//       toast.success("User account is successfully updated");
//       queryClient.setQueryData("user", user);
//       // queryClient.invalidateQueries({ queryKey: ["user"] });
//     },
//     onError: (err) => toast.error(err.message),
//   });
//   return { isUpdating, updateUser };
// }
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User account successfully updated");

      // ✅ Update cache immediately
      queryClient.setQueryData(["user"], user);

      // ✅ Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateUser };
}
