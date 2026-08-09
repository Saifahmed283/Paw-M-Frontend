import { cn } from "@/lib/utils";

/**
 * The PawCare mark: a single continuous line that reads as a pulse/heartbeat
 * and resolves into a paw at its peak. Used in the intro line-draw animation,
 * the header and the footer.
 */
export function PawCareMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M4 42h9l5-11 6 20 5-15 4 6h6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={animated ? "pawcare-draw" : undefined}
      />
      <g fill="currentColor" className={animated ? "pawcare-pads" : undefined}>
        <ellipse cx="43.5" cy="20" rx="3.1" ry="4.2" />
        <ellipse cx="52" cy="16.5" rx="3.1" ry="4.4" />
        <ellipse cx="60" cy="21" rx="2.9" ry="4" />
      </g>
      <path
        d="M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z"
        fill="currentColor"
        className={animated ? "pawcare-pads" : undefined}
      />
    </svg>
  );
}

export function PawCareLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PawCareMark className="h-7 w-7 text-primary" />
      <span className="text-[20px] font-bold tracking-[-0.03em] text-foreground">PawCare</span>
    </span>
  );
}
