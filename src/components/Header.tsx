import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useDarkMode } from "@/context/ThemeContext";

type HeaderProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  handleSmoothScroll?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string,
  ) => void;
};

export default function Header({ mobileOpen, setMobileOpen }: HeaderProps) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-full sm:h-11 sm:w-11">
            <img
              src={
                isDarkMode ? "/assets/logo-dark.png" : "/assets/logo-light.png"
              }
              alt="GMATE"
              className="rounded-full"
            />
          </div>
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            GMATE
          </span>
        </Link>

        <nav className="text-muted-foreground hidden items-center gap-8 text-sm font-medium md:flex">
          <NavLink
            to="/"
            className="navLinkClass"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="navLinkClass"
            onClick={() => setMobileOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="navLinkClass"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          className="text-muted-foreground hover:bg-accent inline-flex items-center justify-center rounded-lg p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-border bg-background border-t md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <NavLink
              to="/"
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </NavLink>
            <div className="border-border mt-2 flex flex-col gap-2 border-t pt-2">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
