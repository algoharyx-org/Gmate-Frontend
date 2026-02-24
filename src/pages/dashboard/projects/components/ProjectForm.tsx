import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import { Loader2 } from "lucide-react";

// 1. Define Zod Schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters"),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Deadline must be in the future",
  }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// 2. Mock API call
const createProjectApi = async (data: ProjectFormData) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simulation of a success state (you can throw an error to test the error state)
  // if (Math.random() > 0.8) throw new Error("Failed to create project");
  
  return { id: Math.random().toString(36).substr(2, 9), ...data };
};

export default function ProjectForm() {
  // 3. Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      deadline: "",
    },
  });

  // 4. Setup TanStack Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: (data) => {
      toast.success(`Project "${data.name}" created successfully!`);
      reset(); // Clear form on success
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project. Please try again.");
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    mutate(data);
  };

  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Create New Project</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to start your next big thing.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          id="name"
          label="Project Name"
          placeholder="e.g., Gmate Redesign"
          disabled={isPending}
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          id="description"
          label="Description"
          placeholder="Tell us about the project goal..."
          disabled={isPending}
          error={errors.description?.message}
          {...register("description")}
        />

        <InputField
          id="deadline"
          label="Deadline"
          type="date"
          disabled={isPending}
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </form>
    </div>
  );
}
