/**
 * ProtectedRoute — redirects unauthenticated users to /auth/login.
 * Wrap any route component or layout with this.
 */

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground animate-pulse">
            <Sparkles className="h-6 w-6" />
          </span>
          <p className="text-sm text-muted-foreground">Loading your journey…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
