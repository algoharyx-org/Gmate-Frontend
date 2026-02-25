import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyProps {
  addTaskHref?: string;
  onAdd?: () => void;
}

export default function Empty({ addTaskHref, onAdd }: EmptyProps) {
  return (
    <div className="bg-card border-border mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center shadow-sm sm:py-20 md:py-24">
      <div className="bg-primary/10 mb-5 rounded-full p-5">
        <ClipboardList className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <h3 className="text-foreground text-xl font-bold sm:text-2xl">
        No tasks yet
      </h3>
      <p className="text-muted-foreground mt-3 max-w-sm px-4 text-sm leading-relaxed sm:text-base">
        You haven't created any tasks for this week. Start organizing your work
        by adding a new task.
      </p>
      {onAdd ? (
        <Button
          className="mt-8 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all hover:scale-105"
          size="default"
          onClick={onAdd}
        >
          + Add New Task
        </Button>
      ) : addTaskHref ? (
        <Button
          className="mt-8 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all hover:scale-105"
          size="default"
          asChild
        >
          <Link to={addTaskHref}>+ Add New Task</Link>
        </Button>
      ) : (
        <Button
          className="mt-8 rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all hover:scale-105"
          size="default"
        >
          + Add New Task
        </Button>
      )}
    </div>
  );
}
