import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/context/ThemeContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useDarkMode();

  return (
    <div className="bg-background flex min-h-screen">
      <div className="bg-gradient-card border-border relative hidden items-center justify-center border-r lg:flex lg:w-1/2">
        <div className="max-w-md p-12">
          <div className="mb-8 flex items-center gap-2">
            <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <img
                src={
                  isDarkMode
                    ? "/assets/logo-dark.png"
                    : "/assets/logo-light.png"
                }
                alt="Logo"
                className="rounded-full"
              />
            </div>
            <span className="text-foreground text-2xl font-bold">GMATE</span>
          </div>
          <h2 className="text-foreground mb-4 text-3xl font-bold">
            Welcome back
          </h2>
          <p className="text-muted-foreground">
            Sign in to access your projects, manage tasks, and collaborate with
            your team.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <img
                src={
                  isDarkMode
                    ? "/assets/logo-dark.png"
                    : "/assets/logo-light.png"
                }
                alt="Logo"
                className="rounded-full"
              />
            </div>
            <span className="text-foreground text-lg font-bold">GMATE</span>
          </div>

          <h1 className="text-foreground mb-1 text-2xl font-bold">Sign in</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Enter your credentials to continue
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forget-password"
                  className="text-primary text-xs hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Sign in
            </Button>
          </form>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
