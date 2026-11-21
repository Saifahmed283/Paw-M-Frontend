import { CrestFlourish } from "@/design-system/primitives/CrestFlourish";
import { cn } from "@/lib/utils";

/**
 * A metric with a real value and a trace. Values are always supplied by the
 * caller from the clinic store — this component never invents numbers.
 */
export function MetricTile({
  label,
  value,
  suffix,
  hint,
  sparkline = false,
  status = "calm",
  className,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  sparkline?: boolean;
  status?: "calm" | "active" | "watch" | "critical";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-0.5 font-data text-[length:var(--step-3)] font-bold leading-none tracking-tight text-foreground tabular-nums">
        {value}
        {suffix && <span className="text-base font-semibold text-primary">{suffix}</span>}
      </p>
      {sparkline && (
        <CrestFlourish
          variant="chart"
          status={status}
          strokeWidth={2}
          className="mt-2 h-5 w-full max-w-24"
          animate={false}
        />
      )}
      {hint && <p className="mt-1.5 truncate text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
