import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function Layout() {
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
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <Sidebar />
      
      <main className="flex-1 w-full min-w-0 max-h-screen overflow-auto lg:max-h-screen">
        {/* Mobile menu button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-50 lg:hidden p-2.5 rounded-lg bg-background border border-border shadow-md hover:bg-accent transition-colors touch-manipulation"
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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
        
        <div className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

