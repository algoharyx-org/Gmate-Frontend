import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/context/ThemeContext";

export default function ForgetPassword() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <img
              src={
                isDarkMode ? "/assets/logo-dark.png" : "/assets/logo-light.png"
              }
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <span className="text-foreground text-lg font-bold">GMATE</span>
        </div>

        <h1 className="text-foreground mb-1 text-2xl font-bold">
          Forgot password?
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Enter your email and we'll send you a reset link.
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
          <Button className="w-full" size="lg">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
