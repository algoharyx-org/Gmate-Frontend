import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "@/services/apiComment";
import { toast } from "react-hot-toast";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      taskId: string;
      data: { content: string };
    }) => updateComment(id, data),

    onSuccess: (_data, variables) => {
      toast.success("Comment updated");
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },

    onError: () => {
      toast.error("Update failed");
    },
  });
};
