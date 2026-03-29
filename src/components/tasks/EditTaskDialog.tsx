import * as Dialog from "@radix-ui/react-dialog";
import { X, Trash2, Loader2, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useUpdateTask } from "@/hooks/Tasks/useUpdateTask";
import { useDeleteTask } from "@/hooks/Tasks/usedeleteTask";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["todo", "inProgress", "review", "completed", "important", "upcoming"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const STATUS_OPTIONS: { value: TaskFormValues["status"]; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "inProgress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "important", label: "Important" },
  { value: "upcoming", label: "Upcoming" },
];

const PRIORITY_OPTIONS: { value: TaskFormValues["priority"]; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

function apiStatusToFormStatus(api: string): TaskFormValues["status"] {
  const compact = (api || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
  if (compact === "todo") return "todo";
  if (compact === "inprogress") return "inProgress";
  if (compact === "review") return "review";
  if (compact === "completed" || compact === "done") return "completed";
  if (compact === "important" || compact === "urgent" || compact === "overdue") return "important";
  if (compact === "upcoming") return "upcoming";
  return "todo";
}

function apiPriorityToForm(priority: string | undefined): TaskFormValues["priority"] {
  const p = (priority ?? "").trim().toLowerCase();
  if (p === "low" || p === "medium" || p === "high" || p === "urgent") return p;
  return "medium";
}

const selectClassName =
  "flex h-12 w-full rounded-xl border-none bg-muted/30 pl-4 pr-10 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer";

type Props = {
  task: {
    _id?: string;
    id?: string | number;
    title: string;
    description?: string;
    status: string;
    priority?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditTaskDialog({ task, open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { mutateAsync: updateTaskMutation, isPending: isUpdating } = useUpdateTask();
  const { mutateAsync: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();
  const taskId = String(task._id ?? task.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      status: apiStatusToFormStatus(task.status),
      priority: apiPriorityToForm(task.priority),
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      title: task.title,
      description: task.description || "",
      status: apiStatusToFormStatus(task.status),
      priority: apiPriorityToForm(task.priority),
    });
  }, [open, task._id, task.id, task.title, task.description, task.status, task.priority, reset]);

  const normalizeStatus = (status: TaskFormValues["status"]) => {
    if (status === "todo") return "to-do";
    if (status === "inProgress") return "in-progress";
    return status;
  };

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await updateTaskMutation({
        id: taskId,
        data: {
          title: values.title,
          description: values.description,
          status: normalizeStatus(values.status),
          priority: values.priority,
        },
      });
      onOpenChange(false);
    } catch {
      // toast handled in hook
    }
  };

  const onDelete = async () => {
    try {
      await deleteTaskMutation(taskId);
      onOpenChange(false);
      toast.success("Task deleted");
      if (window.location.pathname.includes(`/task/${taskId}`)) {
        navigate("/dashboard/my-tasks");
      }
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background/80 backdrop-blur-sm fixed inset-0 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-card border border-border p-8 shadow-2xl rounded-[2rem] animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-xl font-black tracking-tight">Edit Task</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-all">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</Label>
              <Input {...register("title")} className="bg-muted/30 border-none h-12 rounded-xl font-bold" />
              {errors.title && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea {...register("description")} className="min-h-[120px] bg-muted/30 border-none rounded-xl font-medium resize-none" />
              {errors.description && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-task-status" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </Label>
                <div className="relative">
                  <select id="edit-task-status" {...register("status")} className={selectClassName}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                {errors.status && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.status.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-priority" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Priority
                </Label>
                <div className="relative">
                  <select id="edit-task-priority" {...register("priority")} className={selectClassName}>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                {errors.priority && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border/50">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => {
                  if (confirm("Permanently delete this task?")) onDelete();
                }} 
                disabled={isDeleting}
                className="text-rose-500 hover:bg-rose-500/10 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost" className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                </Dialog.Close>
                <Button 
                  type="submit" 
                  disabled={isUpdating} 
                  className="h-12 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-[0.98] transition-all"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
