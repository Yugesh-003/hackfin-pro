import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  Bot,
  TrendingUp,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    to: "/app/transactions",
    icon: Receipt,
  },
  {
    label: "My Lessons",
    to: "/app/lessons",
    icon: BookOpen,
  },
  {
    label: "AI Mentor",
    to: "/app/mentor",
    icon: Bot,
  },
  {
    label: "Progress",
    to: "/app/progress",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border bg-sidebar transition-all duration-300 ease-[0.22,1,0.36,1]",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border overflow-hidden">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="truncate text-base font-bold tracking-tight text-foreground">
              FinMentor <span className="text-gradient-brand">AI</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath.startsWith(item.to);
            const Icon = item.icon;

            const linkEl = (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return linkEl;
          })}
        </nav>

        {/* User + Sign Out */}
        <div className="border-t border-border p-3 space-y-1">
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-muted/50 mb-1">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-primary-foreground text-xs font-bold">
                {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user.displayName ?? "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className={cn(
                  "w-full text-muted-foreground hover:text-destructive justify-start gap-2",
                  collapsed && "justify-center px-2",
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Sign out</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Sign out</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[4.5rem] grid h-6 w-6 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-soft transition-colors hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
