import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { CreateTaskSchema, type CreateTaskInput } from "@/types/task";
import { taskService } from "@/services/task.service";
import InputField from "@/components/ui/InputField";
import { useState } from "react";

export default function CreateTaskDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "upcoming",
      tag: "TASK",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    mutate(data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-lg animate-in zoom-in-95 duration-200 sm:max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-foreground">
              Create New Task
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              id="title"
              label="Task Title"
              placeholder="e.g., Implement Auth"
              disabled={isPending}
              error={errors.title?.message}
              {...register("title")}
            />

            <InputField
              id="description"
              label="Description"
              placeholder="What needs to be done?"
              disabled={isPending}
              error={errors.description?.message}
              {...register("description")}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select
                  id="status"
                  disabled={isPending}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register("status")}
                >
                  <option value="important">Important</option>
                  <option value="inProgress">In Progress</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <InputField
                id="tag"
                label="Tag"
                placeholder="e.g., URGENT"
                disabled={isPending}
                error={errors.tag?.message}
                {...register("tag")}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="h-10 px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
