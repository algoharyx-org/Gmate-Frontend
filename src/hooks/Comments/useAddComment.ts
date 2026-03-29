import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addComment } from "@/services/apiComment";




export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      content: string;
      taskId: string;
    }) => addComment(data),

    onSuccess: (_, variables) => {
      toast.success("Comment added successfully ");

      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add comment "
      );
    },
  });
};