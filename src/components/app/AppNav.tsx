import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  Bot,
  TrendingUp,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Transactions", to: "/app/transactions", icon: Receipt },
  { label: "My Lessons", to: "/app/lessons", icon: BookOpen },
  { label: "AI Mentor", to: "/app/mentor", icon: Bot },
  { label: "Progress", to: "/app/progress", icon: TrendingUp },
];

export function AppNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const pageTitle =
    NAV_ITEMS.find((n) => currentPath.startsWith(n.to))?.label ?? "FinMentor AI";

  return (
    <>
      {/* Top Bar — visible on mobile / tablet */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3 lg:hidden">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-base font-bold text-foreground">
            {pageTitle}
          </span>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-xl border border-border text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-border flex flex-col shadow-lift">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-base font-bold">
                  FinMentor <span className="text-gradient-brand">AI</span>
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-sidebar-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="border-t border-border p-3">
              {user && (
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-muted/50 mb-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-primary-foreground text-xs font-bold">
                    {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {user.displayName ?? "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
