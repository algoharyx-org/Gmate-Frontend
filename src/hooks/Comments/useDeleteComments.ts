import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteComment } from "@/services/apiComment";

export const useDeletecomment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; taskId: string }) =>
      deleteComment(commentId),
    onSuccess: (_data, variables) => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });
};
