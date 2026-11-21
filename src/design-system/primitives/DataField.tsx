import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Mono label/value pair for vitals, prices, codes and times. */
export function DataField({
  label,
  value,
  align = "start",
  className,
}: {
  label: string;
  value: ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  return (
    <div className={cn(align === "end" && "text-end", "min-w-0", className)}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
