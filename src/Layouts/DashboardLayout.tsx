import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import HeadView from "@/components/HeadView";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardLayout() {
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen, setSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar />

      <main className="bg-muted-foreground/10 relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile menu button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-background border-border hover:bg-accent absolute top-3 left-3 z-50 touch-manipulation rounded-lg border p-2.5 shadow-sm transition-colors lg:hidden"
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="text-foreground h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <HeadView />

        <div className="w-full flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
