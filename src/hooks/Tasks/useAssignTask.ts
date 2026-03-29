// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { assignTask } from "@/services/apiTask";
// import { toast } from "react-hot-toast";

// export const useAssignTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, userId }: { id: string; userId: string }) =>
//       assignTask(id, userId),

//     onSuccess: () => {
//       toast.success("Task assigned");
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//     },

//     onError: () => {
//       toast.error("Assign failed");
//     },
//   });
// };
