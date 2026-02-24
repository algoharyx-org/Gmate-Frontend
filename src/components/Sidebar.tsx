import { CheckSquare, FolderKanban, LayoutDashboard, Users, X } from "lucide-react";
import { useDarkMode } from "@/context/ThemeContext";
import { NavLink } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function Sidebar() {
  const { isDarkMode } = useDarkMode();
  const { isSidebarOpen, setSidebarOpen, currentUser } = useAppStore();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/my-tasks", label: "My Tasks", icon: CheckSquare },
    { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    { to: "/dashboard/team", label: "Team", icon: Users },
  ];

  return (
    <>
      <aside
        className={`border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="hover:bg-inline-background text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-lg p-2 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div className="border-sidebar-border flex items-center gap-3 border-b p-4 sm:p-6">
          <div className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12">
            <img
              src={
                isDarkMode ? "/assets/logo-dark.png" : "/assets/logo-light.png"
              }
              alt="GMATE"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="text-primary truncate text-sm font-semibold sm:text-base lg:text-lg">
              GMATE
            </p>
            <p className="text-inline-primary truncate text-xs font-medium">
              Workspace
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 sm:p-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm transition-all sm:px-4 sm:py-3 ${
                  isActive
                    ? "bg-inline-background text-inline-primary font-semibold before:absolute before:inset-0 before:top-0 before:left-0 before:block before:h-full before:w-1 before:rounded-l-md before:bg-inline-primary sm:before:w-2"
                    : "text-muted-foreground font-medium hover:bg-inline-background hover:text-foreground"
                }`
              }
            >
              <item.icon className="shrink-0" size={20} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mock User Section */}
        {currentUser && (
          <div className="border-sidebar-border mt-auto border-t p-4">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors cursor-pointer">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="size-9 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
