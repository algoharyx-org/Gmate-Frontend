import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import type { TaskStatus, Task } from "@/data/tasks";

const getStatusStyles = (status: TaskStatus) => {
  switch (status) {
    case "important":
      return "bg-red-50 text-red-700 border-red-100";
    case "inProgress":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "upcoming":
      return "bg-sky-50 text-sky-700 border-sky-100";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <article
      key={task.id}
      className="group bg-card border-border flex flex-col justify-between rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm sm:rounded-2xl sm:p-4 md:p-5"
    >
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
    </article>
  );
}
