import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/TaskCard";
import Empty from "@/components/Empty";
import { useTasks } from "@/context/TasksContext";
import type { TaskStatus } from "@/data/tasks";
import AddTaskModal from "@/components/AddTaskModal";

const statusFilterOptions: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "important", label: "Important" },
  { value: "inProgress", label: "In Progress" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

export default function MyTasksPage() {
  const { tasks: taskList } = useTasks();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filtered = taskList.filter((task) => {
    const matchStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchSearch =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const isEmpty = taskList.length === 0;

  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex flex-col flex-wrap gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div className="min-w-0 space-y-1">
          <h1 className="text-foreground text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground text-sm">
            {taskList.length} tasks assigned to you · Filter by status below
          </p>
        </div>

        <div className="border-border bg-background relative w-full rounded-lg border p-1 shadow-sm backdrop-blur-sm sm:max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center sm:left-4">
            <Search className="h-4 w-4 sm:h-6 sm:w-6" />
          </span>
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-foreground placeholder-ring w-full rounded-lg border-0 bg-transparent py-2 pr-3 pl-10 text-sm outline-none sm:py-2 sm:pr-4 sm:pl-12 sm:text-base"
          />
        </div>
      </header>

      <section className="mt-4 space-y-4 md:mt-6">
        <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm">
            Showing{" "}
            <span className="text-foreground font-semibold">
              {filtered.length}
            </span>{" "}
            {statusFilter !== "all" ? statusFilter : ""} tasks
            {searchQuery.trim() ? " (filtered)" : " for this week"}.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:gap-2 sm:text-[11px]">
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 sm:text-[11px]">
              <span className="mr-1 h-1 w-1 rounded-full bg-red-500 sm:mr-1.5 sm:h-1.5 sm:w-1.5" />
              Important
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 sm:text-[11px]">
              <span className="mr-1 h-1 w-1 rounded-full bg-amber-500 sm:mr-1.5 sm:h-1.5 sm:w-1.5" />
              In Progress
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:text-[11px]">
              <span className="mr-1 h-1 w-1 rounded-full bg-emerald-500 sm:mr-1.5 sm:h-1.5 sm:w-1.5" />
              Completed
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(opt.value)}
              className="rounded-full text-[11px] sm:text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {isEmpty ? (
          <Empty onAdd={() => setIsAdding(true)} />
        ) : filtered.length === 0 ? (
          <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No tasks match your filter or search.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-full"
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
            >
              Clear filter
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="border-muted-foreground/40 bg-muted/40 hover:bg-muted/60 flex min-h-35 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-4 text-center transition-colors sm:min-h-40 md:min-h-45"
            >
              <div className="bg-background text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm transition-transform hover:scale-110 sm:mb-3 sm:h-12 sm:w-12">
                <span className="text-xl leading-none sm:text-2xl">+</span>
              </div>
              <h2 className="text-foreground text-xs font-semibold sm:text-sm md:text-base">
                Add New Task
              </h2>
              <p className="text-muted-foreground mt-1 text-[11px] sm:text-xs md:text-[13px]">
                Quickly create a new task and place it into your schedule.
              </p>
              <span className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex h-8 items-center justify-center rounded-full px-3 text-[11px] font-medium shadow-sm sm:mt-3 sm:px-4 sm:text-xs">
                + Add Task
              </span>
            </button>
          </div>
        )}

        {isAdding && <AddTaskModal onClose={() => setIsAdding(false)} />}
      </section>
    </div>
  );
}
