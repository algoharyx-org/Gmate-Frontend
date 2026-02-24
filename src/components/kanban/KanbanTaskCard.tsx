import { CalendarDays, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService } from "@/services/task.service";
import type { Task, TaskStatus } from "@/types/task";

const getStatusStyles = (status: TaskStatus) => {
  switch (status) {
    case "important":
      return "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30";
    case "inProgress":
      return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30";
    case "upcoming":
      return "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900/30";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function KanbanTaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => taskService.deleteTask(task.id),
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  return (
    <article className="group relative bg-card border-border flex flex-col justify-between rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm sm:rounded-2xl sm:p-4 md:p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 space-y-1 flex-1">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase sm:px-2.5 sm:text-xs sm:tracking-[0.15em] ${getStatusStyles(
              task.status,
            )}`}
          >
            {task.tag}
          </span>
          <h2 className="text-card-foreground mt-1.5 line-clamp-2 text-xs font-semibold sm:mt-2 sm:text-sm md:text-base">
            {task.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 text-[11px] leading-snug sm:text-xs md:text-sm">
            {task.description}
          </p>
        </div>

        <div className="flex shrink-0">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="text-muted-foreground hover:text-foreground h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in zoom-in-95 duration-100"
                align="end"
              >
                <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  disabled={isDeleting}
                  onClick={() => deleteMutate()}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  <span>Delete</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground flex items-center gap-1.5 text-[10px] sm:text-xs">
          <CalendarDays className="text-muted-foreground/80 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          <span className="truncate">{task.date}</span>
        </p>
        <Link
          to={`/dashboard/tasks/${task.id}`}
          className="text-primary hover:text-primary/80 cursor-pointer text-[10px] font-semibold transition-colors sm:text-xs"
        >
          View details
        </Link>
      </div>
      
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 rounded-xl sm:rounded-2xl">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </article>
  );
}
