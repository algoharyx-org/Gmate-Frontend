import { useState, memo } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types/project";
import { useDeleteTask } from "@/hooks/Tasks/usedeleteTask";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function normalizeStatusKey(status: string): string {
  const s = (status || "").trim().toLowerCase().replace(/\s+/g, " ");
  const compact = s.replace(/[\s-]/g, "");
  if (compact === "inprogress") return "inProgress";
  if (compact === "todo") return "toDo";
  if (compact === "important" || compact === "urgent") return "important";
  if (compact === "upcoming") return "upcoming";
  if (compact === "completed" || compact === "done") return "completed";
  if (compact === "review") return "review";
  if (compact === "overdue") return "important";
  return compact || "default";
}

function formatStatusLabel(status: string): string {
  const key = normalizeStatusKey(status);
  const labels: Record<string, string> = {
    important: "IMPORTANT",
    inProgress: "IN PROGRESS",
    toDo: "TO DO",
    upcoming: "UPCOMING",
    completed: "COMPLETED",
    review: "REVIEW",
    default: "TASK",
  };
  if (labels[key]) return labels[key];
  return (status || "TASK").replace(/[-_]/g, " ").trim().toUpperCase() || "TASK";
}

function getStatusStyles(status: string) {
  const key = normalizeStatusKey(status);
  switch (key) {
    case "important":
      return "border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    case "inProgress":
      return "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
    case "upcoming":
      return "border-amber-500/25 text-amber-700 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.12)]";
    case "completed":
      return "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    case "toDo":
      return "border-slate-400/25 text-slate-700 dark:text-slate-300 bg-slate-500/5 dark:bg-slate-500/10";
    case "review":
      return "border-violet-500/20 text-violet-600 dark:text-violet-400 bg-violet-500/5 dark:bg-violet-500/10";
    default:
      return "border-slate-500/20 text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-500/10";
  }
}

function formatTaskCardDate(task: {
  date?: string;
  dueDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}): string {
  const raw = task.dueDate ?? task.date ?? task.createdAt ?? task.updatedAt;
  if (raw === undefined || raw === null || raw === "") return "—";
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
    const d = new Date(`${raw.trim()}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();
    }
  }
  const d =
    typeof raw === "string"
      ? new Date(raw)
      : raw instanceof Date
        ? raw
        : new Date(String(raw));
  if (Number.isNaN(d.getTime())) {
    return typeof raw === "string" ? raw : "—";
  }
  return d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

type TaskCardProps = {
  task: {
    _id?: string;
    id?: string | number;
    title: string;
    description: string;
    status: string;
    tag?: string;
    date?: string;
    dueDate?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
};

function TaskCardComponent({ task }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: deleteTaskById, isPending: isDeleting } = useDeleteTask();
  const taskId = task?._id ?? task?.id;
  const statusLabel = formatStatusLabel(task.status);
  const dateLabel = formatTaskCardDate(task);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(taskId),
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => navigate(`/dashboard/task/${taskId}`)}
        className="universal-card group flex flex-col gap-4 hover:shadow-xl cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2 flex-1">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase transition-all duration-500 ${getStatusStyles(
                task.status,
              )}`}
            >
              {statusLabel}
            </span>
            <h2 className="text-foreground line-clamp-2 text-base font-bold leading-tight group-hover:text-primary transition-colors">
              {task.title}
            </h2>
            <p className="text-muted-foreground line-clamp-2 text-[13px] font-medium leading-relaxed opacity-70">
              {task.description}
            </p>
          </div>
          <button
            type="button"
            aria-label="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              if (taskId === undefined || taskId === null || taskId === "") return;
              setDeleteDialogOpen(true);
            }}
            className="bg-muted/50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400 text-muted-foreground shrink-0 disabled:opacity-50"
            disabled={isDeleting || taskId === undefined || taskId === null || taskId === ""}
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <p className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
            <CalendarDays className="opacity-50 h-3.5 w-3.5" />
            <span>{dateLabel}</span>
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(true);
            }}
            className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
          >
            Edit
          </button>
        </div>
      </article>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setDeleteDialogOpen(open);
        }}
      >
        <DialogContent className="sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
            <DialogDescription>
              {task.title
                ? `"${task.title}" will be permanently removed. This action cannot be undone.`
                : "This task will be permanently removed. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (taskId === undefined || taskId === null || taskId === "") return;
                try {
                  await deleteTaskById(String(taskId));
                  setDeleteDialogOpen(false);
                } catch {
                  /* toast handled in hook */
                }
              }}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditOpen && (
        <EditTaskDialog
          task={task as unknown as Task}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}

export default memo(TaskCardComponent);
