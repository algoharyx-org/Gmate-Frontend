import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  LayoutDashboard,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/shared/TaskCard";
import Empty from "@/components/shared/Empty";
import type { Task as KanbanTask, TaskStatus } from "@/data/tasks";
import AddTaskDialog from "@/components/tasks/AddTaskDialog";
import KanbanBoard from "@/components/KanbanBoard";
import { useGetMyTasks } from "@/hooks/Tasks/useGetMyTask";
import type { GetMyTasksParams } from "@/services/apiTask";
import { bucketTaskStatus } from "@/utils/taskStatusBucket";

const PAGE_SIZE = 9;
const BOARD_LIMIT = 100;
const SEARCH_DEBOUNCE_MS = 400;

const statusFilterOptions: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "important", label: "Important" },
  { value: "inProgress", label: "In Progress" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const neonStyles: Record<string, string> = {
  all: "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5",
  important:
    "border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)] dark:shadow-[0_0_20px_rgba(244,63,94,0.2)]",
  inProgress:
    "border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  upcoming:
    "border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
  completed:
    "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
};

type TaskItem = {
  _id?: string;
  id?: string | number;
  title: string;
  description: string;
  status: string;
  priority?: string;
  tag?: string;
  date?: string;
  dueDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

function apiStatusForFilter(filter: TaskStatus | "all"): string | undefined {
  switch (filter) {
    case "all":
      return undefined;
    case "important":
      return "important";
    case "inProgress":
      return "in-progress";
    case "upcoming":
      return "upcoming";
    case "completed":
      return "completed";
    default:
      return undefined;
  }
}

export default function MyTasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [listPage, setListPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const queryParams = useMemo((): GetMyTasksParams => {
    const status = apiStatusForFilter(statusFilter);
    const base: GetMyTasksParams = {
      page: viewMode === "board" ? 1 : listPage,
      limit: viewMode === "board" ? BOARD_LIMIT : PAGE_SIZE,
    };
    if (debouncedSearch) base.search = debouncedSearch;
    if (status) base.status = status;
    return base;
  }, [viewMode, listPage, debouncedSearch, statusFilter]);

  const { data, isLoading, isError, isFetching, refetch } =
    useGetMyTasks(queryParams);

  const taskList = useMemo((): TaskItem[] => {
    return Array.isArray(data?.tasks) ? (data.tasks as TaskItem[]) : [];
  }, [data]);

  const displayTasks = useMemo(() => {
    if (statusFilter === "all") return taskList;
    return taskList.filter((t) => bucketTaskStatus(t.status) === statusFilter);
  }, [taskList, statusFilter]);

  const totalCount = data?.length ?? 0;
  const meta = data?.metadata;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const currentPage = meta?.currentPage ?? listPage;

  const filtersAreDefault = statusFilter === "all" && !debouncedSearch;
  const showGlobalEmpty = !isLoading && totalCount === 0 && filtersAreDefault;
  const showNoMatch =
    !isLoading &&
    !showGlobalEmpty &&
    (totalCount === 0 || displayTasks.length === 0);

  const goToPrevPage = () => {
    if (meta?.prev != null) setListPage(meta.prev);
    else setListPage((p) => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    if (meta?.next != null) setListPage(meta.next);
    else setListPage((p) => Math.min(totalPages, p + 1));
  };

  const rangeStart =
    totalCount === 0 ? 0 : (currentPage - 1) * (meta?.limit ?? PAGE_SIZE) + 1;
  const rangeEnd =
    totalCount === 0
      ? 0
      : Math.min(
          (currentPage - 1) * (meta?.limit ?? PAGE_SIZE) + displayTasks.length,
          totalCount
        );

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        Loading tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-slate-400">Failed to load tasks.</p>
        <Button variant="outline" className="rounded-full px-6" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in text-slate-900 dark:text-slate-100 relative">
      {isFetching && data ? (
        <div className="pointer-events-none absolute right-6 top-6 text-[10px] font-bold uppercase tracking-widest text-primary/80">
          Updating…
        </div>
      ) : null}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {filtersAreDefault ? (
              <>{totalCount} tasks assigned to you.</>
            ) : (
              <>
                {totalCount} match your search and filters
                <span className="text-slate-400 dark:text-slate-500"> (from your tasks)</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setListPage(1);
              }}
              className="w-full h-11 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="bg-slate-100 dark:bg-white/5 rounded-full p-1 flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-white dark:bg-white/10 shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
            >
              <List size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`p-2 rounded-full transition-all ${viewMode === "board" ? "bg-white dark:bg-white/10 shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
            >
              <LayoutDashboard size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {statusFilterOptions.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value);
                  setListPage(1);
                }}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  isActive
                    ? neonStyles[opt.value]
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {showGlobalEmpty ? (
          <Empty onAdd={() => setIsAdding(true)} />
        ) : showNoMatch ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-white/30 dark:bg-white/5">
            <p className="text-slate-400 font-medium mb-6">No tasks match your filter.</p>
            <Button
              variant="outline"
              className="rounded-full px-8 h-10"
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
                setDebouncedSearch("");
                setListPage(1);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayTasks.map((task: TaskItem) => (
                <TaskCard key={String(task._id ?? task.id)} task={task} />
              ))}

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="group flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-8 transition-all hover:bg-slate-50 dark:hover:bg-white/5 hover:border-primary/40 active:scale-95"
              >
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <h2 className="text-foreground text-sm font-bold">New Task</h2>
                <p className="text-slate-500 text-[11px] font-medium text-center mt-1">
                  Add something to your list
                </p>
              </button>
            </div>

            {totalPages > 1 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-white/10">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 order-2 sm:order-1">
                  Showing {rangeStart}–{rangeEnd} of {totalCount}
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9 px-3 gap-1"
                    disabled={currentPage <= 1}
                    onClick={goToPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-xs font-bold tabular-nums text-slate-600 dark:text-slate-300 px-2 min-w-[5.5rem] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9 px-3 gap-1"
                    disabled={currentPage >= totalPages}
                    onClick={goToNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="pt-2">
            <KanbanBoard initialTasks={displayTasks as unknown as KanbanTask[]} />
          </div>
        )}

        {isAdding && (
          <AddTaskDialog onClose={() => setIsAdding(false)} onAdd={() => refetch()} />
        )}
      </section>
    </div>
  );
}
