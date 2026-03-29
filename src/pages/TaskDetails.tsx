import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  Loader2,
  MessageSquare,
  Pencil,
  Send,
  Trash2,
  UploadCloud,
  FileText,
  X,
} from "lucide-react";
import EditTaskDialog from "@/components/tasks/EditTaskDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTaskById } from "@/hooks/Tasks/useGetTaskbyId";
import type { Task } from "@/types/project";
import { useAddComment } from "@/hooks/Comments/useAddComment";
import { useUpdateComment } from "@/hooks/Comments/useUpdateComment";
import { useDeletecomment } from "@/hooks/Comments/useDeleteComments";
import { useUploadTaskAttachments } from "@/hooks/Tasks/useUploadTaskAttachments";

type TaskAttachmentItem = {
  _id?: string;
  url?: string;
  publicId?: string;
  originalName?: string;
  type?: string;
  size?: number;
};

type TaskDetailsItem = {
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
  comments?: unknown[];
  attachments?: TaskAttachmentItem[];
};

type CommentRow = {
  id: string | number;
  author: string;
  text: string;
  time: string;
};

function formatCommentTime(input: string | Date | undefined | null): string {
  if (input === undefined || input === null || input === "") return "Just now";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "Just now";
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toISOString().slice(0, 10);
}

function mapApiCommentToRow(c: Record<string, unknown>): CommentRow {
  const id = (c._id ?? c.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`) as
    | string
    | number;
  let author = "User";
  const user = c.user as Record<string, unknown> | undefined;
  const createdBy = c.createdBy as Record<string, unknown> | undefined;
  if (typeof c.author === "string") author = c.author;
  else if (user && typeof user.name === "string") author = user.name;
  else if (createdBy && typeof createdBy.name === "string") author = createdBy.name;
  const text = String(c.content ?? c.text ?? "");
  const time = formatCommentTime((c.createdAt ?? c.updatedAt) as string | Date | undefined);
  return { id, author, text, time };
}

/** Renders API dates as YYYY-MM-DD (e.g. 2026-04-30). */
function formatDateOnly(input: string | Date | undefined | null): string {
  if (input === undefined || input === null || input === "") return "-";
  if (typeof input === "string") {
    const ymd = input.match(/^(\d{4}-\d{2}-\d{2})/);
    if (ymd) return ymd[1];
    const d = new Date(input);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return input;
  }
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return input.toISOString().slice(0, 10);
  }
  return "-";
}
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
    important: "Important",
    inProgress: "In progress",
    toDo: "To do",
    upcoming: "Upcoming",
    completed: "Completed",
    review: "Review",
    default: "Status",
  };
  if (labels[key]) return labels[key];
  return (status || "Status").replace(/[-_]/g, " ").trim() || "Status";
}

function normalizePriority(priority?: string): "low" | "medium" | "high" | "urgent" {
  const v = (priority ?? "medium").trim().toLowerCase();
  if (v === "low" || v === "medium" || v === "high" || v === "urgent") return v;
  return "medium";
}

function formatPriorityLabel(p: "low" | "medium" | "high" | "urgent"): string {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

const getPriorityStyles = (priority: "low" | "medium" | "high" | "urgent") => {
  switch (priority) {
    case "low":
      return "border-emerald-500/25 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10";
    case "medium":
      return "border-amber-500/25 text-amber-800 dark:text-amber-400 bg-amber-500/10";
    case "high":
      return "border-orange-500/25 text-orange-700 dark:text-orange-400 bg-orange-500/10";
    case "urgent":
      return "border-rose-500/25 text-rose-700 dark:text-rose-400 bg-rose-500/10";
    default:
      return "border-slate-500/20 text-slate-600 dark:text-slate-400 bg-slate-500/10";
  }
};

const getStatusStyles = (status: string) => {
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
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError, refetch } = useGetTaskById(id || "");
  const addCommentMutation = useAddComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeletecomment();
  const uploadAttachmentsMutation = useUploadTaskAttachments();
  const task = useMemo(() => {
    if (data?.data) return data.data as TaskDetailsItem;
    return data as TaskDetailsItem | undefined;
  }, [data]);

  const [isCompleted, setIsCompleted] = useState<boolean>(() => task?.status === "completed");
  const [editingTask, setEditingTask] = useState<TaskDetailsItem | null>(null);
  const [newComment, setNewComment] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentPendingDelete, setCommentPendingDelete] = useState<CommentRow | null>(null);

  useEffect(() => {
    if (!task) return;
    const raw = task.comments;
    if (raw === undefined) return;
    if (!Array.isArray(raw)) return;
    const mapped = raw.map((item) => mapApiCommentToRow(item as Record<string, unknown>));
    queueMicrotask(() => {
      setComments(mapped);
    });
  }, [task]);

  useEffect(() => {
    if (!task?.title) return;
    const previous = document.title;
    document.title = `${task.title} · Task`;
    return () => {
      document.title = previous;
    };
  }, [task?.title]);

  const taskIdForApi = task?._id ?? task?.id;
  const canSubmitComment =
    Boolean(id && newComment.trim() && taskIdForApi !== undefined && taskIdForApi !== "");

  const handleAddComment = () => {
    if (!canSubmitComment || !id) return;
    const content = newComment.trim();
    const taskId = String(taskIdForApi);
    addCommentMutation.mutate(
      { content, taskId },
      {
        onSuccess: (res) => {
          setNewComment("");
          const payload = (res as { data?: Record<string, unknown> } | undefined)?.data ?? res;
          if (payload && typeof payload === "object" && ("content" in payload || "text" in payload)) {
            setComments((prev) => [...prev, mapApiCommentToRow(payload as Record<string, unknown>)]);
          }
        },
      }
    );
  };

  const taskIdStr = taskIdForApi !== undefined && taskIdForApi !== "" ? String(taskIdForApi) : "";

  const beginEditComment = (c: CommentRow) => {
    setEditingCommentId(String(c.id));
    setEditDraft(c.text);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditDraft("");
  };

  const saveEditComment = () => {
    if (!editingCommentId || !editDraft.trim() || !taskIdStr) return;
    updateCommentMutation.mutate(
      { id: editingCommentId, taskId: taskIdStr, data: { content: editDraft.trim() } },
      {
        onSuccess: (res) => {
          const payload = (res as { data?: Record<string, unknown> } | undefined)?.data ?? res;
          if (payload && typeof payload === "object" && ("content" in payload || "text" in payload)) {
            const row = mapApiCommentToRow(payload as Record<string, unknown>);
            setComments((prev) =>
              prev.map((x) => (String(x.id) === editingCommentId ? { ...x, ...row, id: x.id } : x))
            );
          } else {
            setComments((prev) =>
              prev.map((x) =>
                String(x.id) === editingCommentId
                  ? { ...x, text: editDraft.trim(), time: "Just now" }
                  : x
              )
            );
          }
          cancelEditComment();
        },
      }
    );
  };

  const confirmDeleteComment = () => {
    if (!taskIdStr || !commentPendingDelete) return;
    const idStr = String(commentPendingDelete.id);
    deleteCommentMutation.mutate(
      { commentId: idStr, taskId: taskIdStr },
      {
        onSuccess: () => {
          setCommentPendingDelete(null);
          setComments((prev) => prev.filter((x) => String(x.id) !== idStr));
          if (editingCommentId === idStr) cancelEditComment();
        },
      }
    );
  };

  const commentActionDisabled =
    addCommentMutation.isPending ||
    updateCommentMutation.isPending ||
    deleteCommentMutation.isPending;

  const serverAttachments: TaskAttachmentItem[] = Array.isArray(task?.attachments)
    ? (task.attachments as TaskAttachmentItem[])
    : [];

  const handleUploadPendingAttachments = () => {
    if (!taskIdStr || pendingFiles.length === 0) return;
    uploadAttachmentsMutation.mutate(
      { taskId: taskIdStr, files: pendingFiles },
      {
        onSuccess: () => {
          setPendingFiles([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      }
    );
  };

  const attachmentUploadBusy = uploadAttachmentsMutation.isPending;

  const commentDeleteSnippet = (() => {
    const raw = commentPendingDelete?.text?.trim() ?? "";
    if (!raw) return "";
    return raw.length > 100 ? `${raw.slice(0, 100)}…` : raw;
  })();
  const commentDeleteDescription = commentDeleteSnippet
    ? `"${commentDeleteSnippet}" will be permanently removed. This action cannot be undone.`
    : "This comment will be permanently removed. This action cannot be undone.";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        Loading task details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-slate-400">Failed to load task details.</p>
        <Button variant="outline" className="rounded-full px-6" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!task) return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <h1 className="text-2xl font-bold">Task not found</h1>
      <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full px-8">Go Back</Button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 space-y-10 animate-fade-in text-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Back to tasks
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-none ${isCompleted ? "opacity-50 line-through" : ""}`}>
              {task.title}
            </h1>
            <Badge variant="outline" className={`px-3 py-0.5 text-[10px] font-black tracking-widest rounded-full transition-all duration-500 capitalize ${getStatusStyles(task.status)}`}>
              {formatStatusLabel(task.status)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setEditingTask(task)} className="rounded-xl flex-1 sm:flex-none font-bold">Edit Task</Button>
          <Button 
            onClick={() => setIsCompleted(!isCompleted)}
            className={`rounded-xl flex-1 sm:flex-none font-bold shadow-lg transition-all ${isCompleted ? "bg-emerald-600 hover:bg-emerald-500" : "bg-primary hover:bg-indigo-500"}`}
          >
            {isCompleted ? <CheckCircle2 className="mr-2" size={18} /> : <Circle className="mr-2" size={18} />}
            {isCompleted ? "Completed" : "Complete"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Description */}
          <section className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</h3>
            <p className="text-foreground/80 text-base font-medium leading-relaxed italic">
              "{task.description}"
            </p>
          </section>

          {/* Attachments */}
          <section className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <UploadCloud size={14} /> Attachments
            </h3>

            {serverAttachments.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {serverAttachments.map((att, i) => {
                  const href = att.url;
                  const label =
                    att.originalName ||
                    (href ? href.split("/").pop()?.split("?")[0] : null) ||
                    "File";
                  const key = att._id ?? `${href ?? "att"}-${i}`;
                  return (
                    <a
                      key={key}
                      href={href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all ${
                        !href ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <FileText size={18} className="text-primary shrink-0" />
                        <span className="text-[11px] font-bold truncate">{label}</span>
                      </div>
                      <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!attachmentUploadBusy) fileInputRef.current?.click();
                }
              }}
              onClick={() => !attachmentUploadBusy && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!attachmentUploadBusy) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (attachmentUploadBusy || !e.dataTransfer.files?.length) return;
                setPendingFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
              }}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                attachmentUploadBusy
                  ? "opacity-60 cursor-not-allowed border-border"
                  : `cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`
              }`}
            >
              <UploadCloud className="text-muted-foreground mb-2" size={32} />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                {attachmentUploadBusy ? "Uploading…" : "Drag files or click to add"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                disabled={attachmentUploadBusy}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    setPendingFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                  }
                }}
              />
            </div>

            {pendingFiles.length > 0 && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {pendingFiles.map((f, i) => (
                    <div
                      key={`${f.name}-${i}-${f.size}`}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <FileText size={18} className="text-primary shrink-0" />
                        <span className="text-[11px] font-bold truncate">{f.name}</span>
                      </div>
                      <button
                        type="button"
                        disabled={attachmentUploadBusy}
                        onClick={() =>
                          setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="p-1 text-muted-foreground hover:text-rose-500 disabled:opacity-40"
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  className="rounded-xl font-bold"
                  disabled={!taskIdStr || attachmentUploadBusy}
                  onClick={handleUploadPendingAttachments}
                >
                  {attachmentUploadBusy ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload {pendingFiles.length} file{pendingFiles.length === 1 ? "" : "s"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </section>

          {/* Comments */}
          <section className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <MessageSquare size={14} /> Discussion ({comments.length})
            </h3>
            
            <div className="space-y-6">
              {comments.map((c) => {
                const cid = String(c.id);
                const isEditing = editingCommentId === cid;
                return (
                  <div key={cid} className="flex gap-4 group">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                      {(c.author || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] font-black uppercase tracking-widest truncate">
                            {c.author}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground shrink-0">
                            {c.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => beginEditComment(c)}
                            disabled={commentActionDisabled || isEditing}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/80 disabled:opacity-40 transition-colors"
                            aria-label="Edit comment"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentPendingDelete(c)}
                            disabled={commentActionDisabled || isEditing}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 disabled:opacity-40 transition-colors"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            rows={3}
                            disabled={updateCommentMutation.isPending}
                            className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-y min-h-[4.5rem] disabled:opacity-60"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="rounded-lg font-bold"
                              onClick={saveEditComment}
                              disabled={
                                !editDraft.trim() ||
                                updateCommentMutation.isPending
                              }
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="rounded-lg font-bold"
                              onClick={cancelEditComment}
                              disabled={updateCommentMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
                          {c.text}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/50">
              <input 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Write a message..."
                disabled={addCommentMutation.isPending}
                className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
              />
              <Button 
                type="button"
                onClick={handleAddComment}
                disabled={!canSubmitComment || addCommentMutation.isPending}
                className="rounded-xl h-11 px-6 font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
              >
                <Send size={16} />
              </Button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Properties</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-3 py-3 border-b border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                  Created
                </span>
                <span className="text-xs font-black tabular-nums text-right">
                  {formatDateOnly(task.createdAt ?? task.date)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3 py-3 border-b border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={`rounded-full font-bold text-[9px] tracking-widest capitalize ${getStatusStyles(task.status)}`}
                >
                  {formatStatusLabel(task.status)}
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-3 py-3 border-b border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                  Priority
                </span>
                <Badge
                  variant="outline"
                  className={`rounded-full font-bold text-[9px] tracking-widest ${getPriorityStyles(normalizePriority(task.priority))}`}
                >
                  {formatPriorityLabel(normalizePriority(task.priority))}
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-3 py-3 border-b border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                  Due date
                </span>
                <span className="text-xs font-black tabular-nums text-right">
                  {formatDateOnly(task.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={commentPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteCommentMutation.isPending) setCommentPendingDelete(null);
        }}
      >
        <DialogContent className="sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete this comment?</DialogTitle>
            <DialogDescription>{commentDeleteDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleteCommentMutation.isPending}
              onClick={() => setCommentPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteCommentMutation.isPending}
              onClick={confirmDeleteComment}
            >
              {deleteCommentMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingTask && (
        <EditTaskDialog
          task={editingTask as unknown as Task}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
        />
      )}
    </div>
  );
}
