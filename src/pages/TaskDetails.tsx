import { useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ArrowLeft,
  CheckCircle2,
  Circle,
  MessageSquare,
  Send,
  UploadCloud,
  FileText,
  X,
} from "lucide-react";
import type { TaskStatus, Task } from "@/data/tasks";
import { useTasks } from "@/context/TasksContext";
import EditTaskModal from "@/components/EditTaskModal";

const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case "important":
      return {
        label: "Important",
        className: "bg-red-50 text-red-700 border-red-100",
      };
    case "inProgress":
      return {
        label: "In Progress",
        className: "bg-amber-50 text-amber-700 border-amber-100",
      };
    case "upcoming":
      return {
        label: "Upcoming",
        className: "bg-sky-50 text-sky-700 border-sky-100",
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };
    default:
      return {
        label: "Task",
        className: "bg-muted text-muted-foreground border-border",
      };
  }
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const task = useMemo(() => {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return undefined;
    return tasks.find((t) => t.id === numericId);
  }, [id, tasks]);

  const [isCompleted, setIsCompleted] = useState<boolean>(
    () => task?.status === "completed",
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "System",
      text: "Task created and assigned.",
      time: "2 hours ago",
    },
    {
      id: 2,
      author: "Admin",
      text: "Please make sure to review the attached guidelines.",
      time: "1 hour ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleAddComment = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), author: "You", text: newComment, time: "Just now" },
    ]);
    setNewComment("");
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-md text-center">
          <h1 className="text-primary mb-2 text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
            Task not found
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            The task you are looking for doesn&apos;t exist or may have been
            moved.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="border-border bg-background text-foreground hover:bg-accent mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-colors sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(task.status);

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="border-border bg-background text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm transition-colors sm:px-4 sm:text-xs"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Back to tasks
            </button>
            <button
              onClick={() => setEditingTask(task)}
              className="border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm transition-colors sm:px-4 sm:text-xs"
            >
              Edit task
            </button>
          </div>

          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-sm transition-all sm:flex-none sm:text-sm ${
              isCompleted
                ? "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {isCompleted ? "Task Completed" : "Mark as Complete"}
          </button>
        </div>

        <header className="border-border bg-card/90 space-y-4 rounded-2xl border p-4 shadow-sm transition-all duration-300 sm:p-5 md:p-6">
          <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="space-y-1.5">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase sm:text-xs ${statusBadge.className}`}
              >
                {task.tag}
              </span>
              <h1
                className={`text-card-foreground text-xl font-bold tracking-tight transition-all sm:text-2xl md:text-3xl ${isCompleted ? "line-through opacity-70" : ""}`}
              >
                {task.title}
              </h1>
            </div>

            <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>{task.date}</span>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Description
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {task.description}
            </p>
          </div>
        </header>

        <section className="border-border bg-card/90 space-y-4 rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
          <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold sm:text-base">
            <UploadCloud className="text-primary h-4 w-4" />
            Attachments
          </h2>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all sm:p-8 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border bg-background/50 hover:bg-muted/60 hover:border-primary/50"
            }`}
          >
            <UploadCloud
              className={`mb-3 h-8 w-8 transition-colors sm:h-10 sm:w-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
            />
            <p className="text-foreground text-center text-sm font-medium sm:text-base">
              Drag & drop files here
            </p>
            <p className="text-muted-foreground mt-1 text-center text-xs sm:text-sm">
              or click to browse your computer
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Uploaded Files ({files.length})
              </h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="group border-border/80 bg-background hover:border-primary/30 flex items-center justify-between rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-foreground truncate text-sm font-medium">
                          {file.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1.5 opacity-0 transition-colors group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="border-border bg-card/90 mb-8 space-y-4 rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold sm:text-base">
              <MessageSquare className="text-primary h-4 w-4" />
              Comments ({comments.length})
            </h2>
          </div>

          <div className="space-y-5 py-2">
            {comments.map((comment) => (
              <div key={comment.id} className="group flex gap-3 sm:gap-4">
                <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-bold shadow-sm sm:h-10 sm:w-10">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      {comment.author}
                    </span>
                    <span className="text-muted-foreground text-[10px] font-medium sm:text-xs">
                      {comment.time}
                    </span>
                  </div>
                  <div className="bg-muted/70 text-foreground/90 border-border/50 inline-block rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddComment}
            className="border-border/50 mt-4 border-t pt-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <textarea
                  rows={2}
                  placeholder="Ask a question or post an update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(e as any);
                    }
                  }}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary w-full resize-none rounded-xl border px-4 py-3 text-sm shadow-sm transition-all focus:ring-1 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:hover:bg-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </section>

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </div>
    </div>
  );
}
