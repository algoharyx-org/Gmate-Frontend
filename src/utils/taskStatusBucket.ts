import type { TaskStatus } from "@/data/tasks";

/**
 * Maps API / DB `task.status` into the same bucket keys used by My Tasks filters
 * and Kanban columns (All / Important / In progress / Upcoming / Completed).
 */
export function bucketTaskStatus(status: string | undefined): TaskStatus {
  const s = (status ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const compact = s.replace(/[\s-]/g, "");
  if (compact === "completed" || compact === "done") return "completed";
  if (compact === "important" || compact === "urgent" || compact === "overdue") {
    return "important";
  }
  if (compact === "inprogress") return "inProgress";
  if (compact === "upcoming") return "upcoming";
  if (compact === "todo") return "upcoming";
  if (compact === "review") return "inProgress";
  return "upcoming";
}
