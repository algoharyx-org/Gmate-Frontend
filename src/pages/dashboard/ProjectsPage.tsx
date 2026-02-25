import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    id: "1",
    name: "Mobile App Redesign",
    desc: "Redesigning the mobile experience",
    tasks: 24,
    completed: 18,
    members: 4,
    status: "active",
  },
  {
    id: "2",
    name: "Backend API v2",
    desc: "New REST API architecture",
    tasks: 32,
    completed: 12,
    members: 3,
    status: "active",
  },
  {
    id: "3",
    name: "DevOps Pipeline",
    desc: "CI/CD and infrastructure setup",
    tasks: 15,
    completed: 10,
    members: 2,
    status: "active",
  },
  {
    id: "4",
    name: "Design System",
    desc: "Component library and tokens",
    tasks: 20,
    completed: 20,
    members: 3,
    status: "completed",
  },
  {
    id: "5",
    name: "User Research",
    desc: "Interviews and surveys",
    tasks: 8,
    completed: 5,
    members: 2,
    status: "active",
  },
  {
    id: "6",
    name: "Marketing Site",
    desc: "Landing pages and SEO",
    tasks: 12,
    completed: 3,
    members: 2,
    status: "active",
  },
];

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">
            {projects.length} projects
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
