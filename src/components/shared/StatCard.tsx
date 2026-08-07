import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: { direction: "up" | "down" | "neutral"; label: string };
  accent?: "primary" | "blue" | "purple";
  className?: string;
}

const accentMap = {
  primary: {
    icon: "bg-primary-soft text-primary",
    value: "text-gradient-brand",
  },
  blue: {
    icon: "bg-brand-blue-soft text-brand-blue",
    value: "text-brand-blue",
  },
  purple: {
    icon: "bg-brand-purple-soft text-brand-purple",
    value: "text-brand-purple",
  },
};

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  accent = "primary",
  className,
}: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={cn(
        "card-surface p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl text-sm",
              colors.icon,
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p className={cn("text-3xl font-bold", colors.value)}>{value}</p>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trend.direction === "up" && "text-primary",
                trend.direction === "down" && "text-destructive",
              )}
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{" "}
              {trend.label}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
