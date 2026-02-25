import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { tasks as initialTasks, type Task } from "@/data/tasks";

type TasksContextValue = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, updates: Partial<Omit<Task, "id">>) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { ...task, id: nextId }];
    });
  }, []);

  const updateTask = useCallback(
    (id: number, updates: Partial<Omit<Task, "id">>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      );
    },
    [],
  );

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error("useTasks must be used within TasksProvider");
  }
  return ctx;
}
