import type { ReactNode } from "react";

import { GlassPanel } from "@/design-system/primitives/GlassPanel";
import { cn } from "@/lib/utils";

type TraceStatus = "calm" | "active" | "watch" | "critical";

/** A crest metric card — paper, hairline rules, a gold cap, honest numbers. */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  status = "calm",
  className,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: string;
  status?: TraceStatus;
  className?: string;
}) {
  return (
    <GlassPanel
      elevation={1}
      className={cn("group overflow-hidden border-t-2 border-t-[var(--gold-500)] p-0", className)}
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
            {label}
          </p>
          <p className="mt-3 font-data text-[length:var(--step-3)] font-bold leading-none tracking-tight text-foreground tabular-nums">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] transition-transform duration-200 group-hover:scale-105",
            tone ?? "bg-[var(--navy-900)] text-[var(--gold-400)]",
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="h-px bg-[var(--line)]" />
    </GlassPanel>
  );
}

/** A framed content region with a gold rule under its heading. */
export function OverviewCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <GlassPanel elevation={1} className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && <p className="mt-1 text-xs text-ink-soft">{description}</p>}
        </div>
        {action}
      </div>
      <div className="h-px bg-[var(--gold-500)]/60" />
      <div className="p-5">{children}</div>
    </GlassPanel>
  );
}
