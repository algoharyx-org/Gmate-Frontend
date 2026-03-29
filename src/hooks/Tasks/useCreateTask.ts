import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createTask } from "@/services/apiTask";




export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      project?: string; // now optional
      status?: string;
      priority?: string;
      dueDate?: Date;
    }) => createTask(data),
    onSuccess: () => {
      toast.success("Task created successfully");
    //   queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "me"] });

    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};