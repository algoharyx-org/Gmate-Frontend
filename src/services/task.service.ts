import { tasks as initialTasks } from "@/data/tasks";
import { type Task, type CreateTaskInput } from "@/types/task";

// Mocking a database with a local variable for the session
let mockTasks: Task[] = [...initialTasks];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await delay(500);
    return [...mockTasks];
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    await delay(800);
    const newTask: Task = {
      ...data,
      id: Math.max(...mockTasks.map((t) => t.id), 0) + 1,
      date: data.date || new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    } as Task;
    mockTasks.push(newTask);
    return newTask;
  },

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    await delay(600);
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    
    mockTasks[index] = { ...mockTasks[index], ...data };
    return mockTasks[index];
  },

  async deleteTask(id: number): Promise<void> {
    await delay(400);
    mockTasks = mockTasks.filter((t) => t.id !== id);
  },
};
