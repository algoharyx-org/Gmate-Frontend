import { useState } from "react";
import {
  ClipboardList,
  TriangleAlert,
  Info,
  AtSign,
  Clock,
  Check,
  ChevronRight,
} from "lucide-react";

type NotificationType = "task" | "deadline" | "system" | "mention";
type FilterTab = "All" | "Unread" | "Tasks" | "Mentions";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  hasLink: boolean;
}

const INITIAL: Notification[] = [
  {
    id: 1,
    type: "task",
    title: "New Task Assigned",
    message: "Sarah Chen assigned you to 'Review Button States'.",
    time: "15m ago",
    read: false,
    hasLink: true,
  },
  {
    id: 2,
    type: "deadline",
    title: "Deadline Approaching",
    message: "The project 'Mobile App Launch' is due in 2 days.",
    time: "18h ago",
    read: true,
    hasLink: true,
  },
  {
    id: 3,
    type: "system",
    title: "System Maintenance",
    message: "TaskFlow will be down for maintenance on Feb 25th at 02:00 UTC.",
    time: "2/21/2026",
    read: false,
    hasLink: false,
  },
  {
    id: 4,
    type: "mention",
    title: "Marcus mentioned you",
    message: "@Alex, what do you think about the new API auth flow?",
    time: "1h ago",
    read: false,
    hasLink: true,
  },
];

type TypeStyle = {
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  unreadBorderClass: string;
  unreadTitleClass: string;
};

const TYPE_STYLES: Record<NotificationType, TypeStyle> = {
  task: {
    icon: <ClipboardList size={18} />,
    iconBgClass: "bg-[var(--inline-background)]",
    iconColorClass: "text-[var(--inline-primary)]",
    unreadBorderClass: "border-l-[var(--inline-primary)]",
    unreadTitleClass: "text-[var(--inline-primary)]",
  },
  deadline: {
    icon: <TriangleAlert size={18} />,
    iconBgClass: "bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]",
    iconColorClass: "text-[var(--destructive)]",
    unreadBorderClass: "border-l-[var(--destructive)]",
    unreadTitleClass: "text-[var(--foreground)]",
  },
  system: {
    icon: <Info size={18} />,
    iconBgClass: "bg-[var(--secondary)]",
    iconColorClass: "text-[var(--muted-foreground)]",
    unreadBorderClass: "border-l-[var(--ring)]",
    unreadTitleClass: "text-[var(--inline-primary)]",
  },
  mention: {
    icon: <AtSign size={18} />,
    iconBgClass: "bg-[var(--inline-background)]",
    iconColorClass: "text-[var(--inline-primary)]",
    unreadBorderClass: "border-l-[var(--inline-primary)]",
    unreadTitleClass: "text-[var(--inline-primary)]",
  },
};

const TABS: FilterTab[] = ["All", "Unread", "Tasks", "Mentions"];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const [tab, setTab] = useState<FilterTab>("All");

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const visible = items.filter((n) => {
    if (tab === "Unread") return !n.read;
    if (tab === "Tasks") return n.type === "task";
    if (tab === "Mentions") return n.type === "mention";
    return true;
  });

  return (
    <div className="text-foreground flex justify-center">
      <div className="w-full">
        <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
          <div className="w-full sm:w-auto">
            <div className="mb-1 flex items-center gap-2.5">
              <h1 className="text-foreground m-0 text-2xl font-bold tracking-tight">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="bg-destructive rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">
                  {unreadCount} New
                </span>
              )}
            </div>

            <p className="text-muted-foreground m-0 text-sm">
              Stay updated with your latest activities and mentions.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="border-border bg-card text-foreground hover:bg-secondary mt-4 flex cursor-pointer items-center gap-1.5 rounded-md border px-3.5 py-2 text-[0.8125rem] font-medium shadow-sm transition-colors sm:mt-0"
          >
            <Check size={14} />
            Mark all as read
          </button>
        </div>

        <div className="border-border mb-5 border-b">
          <div className="hide-scrollbar flex overflow-x-auto">
            {TABS.map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "relative cursor-pointer border-none bg-transparent px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground font-normal",
                  ].join(" ")}
                >
                  {t}
                  {active && (
                    <span className="bg-inline-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {visible.length === 0 && (
            <div className="text-muted-foreground py-16 text-center text-sm">
              No notifications here.
            </div>
          )}

          {visible.map((notif) => {
            const ts = TYPE_STYLES[notif.type];
            const unread = !notif.read;

            return (
              <div
                key={notif.id}
                className={[
                  "border-border bg-card flex gap-4 rounded-md border border-l-4 px-4 py-4 shadow-sm transition-[border-left-color] duration-200 sm:px-5 sm:py-4.5",
                  unread ? ts.unreadBorderClass : "border-l-transparent",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10",
                    ts.iconBgClass,
                    ts.iconColorClass,
                  ].join(" ")}
                >
                  {ts.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={[
                        "text-sm font-semibold",
                        unread ? ts.unreadTitleClass : "text-foreground",
                      ].join(" ")}
                    >
                      {notif.title}
                    </span>

                    <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs whitespace-nowrap">
                      <Clock size={12} />
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.hasLink && (
                    <button className="text-inline-primary mt-2 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[0.8125rem] font-medium hover:underline">
                      View details
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
