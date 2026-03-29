import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/services/apiTask";
import { toast } from "react-hot-toast";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTask(id, data),

    onSuccess: (_data, variables) => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
    },

    onError: () => {
      toast.error("Update failed");
    },
  });
};

