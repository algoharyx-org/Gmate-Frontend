import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadTaskAttachments } from "@/services/apiTask";

type ApiErr = { response?: { data?: { message?: string } } };

export function useUploadTaskAttachments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, files }: { taskId: string; files: File[] }) =>
      uploadTaskAttachments(taskId, files),

    onSuccess: (_data, variables) => {
      toast.success("Attachments uploaded");
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },

    onError: (error: ApiErr) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload attachments"
      );
    },
  });
}
