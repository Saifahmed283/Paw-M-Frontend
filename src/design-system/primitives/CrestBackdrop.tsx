import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * The Crest ambient field: a navy plate with badge-derived gold/blue glows,
 * a masked engraved grid, slow orbit rings and a single gilded sweep.
 * Pure CSS transforms and opacity, so the global reduced-motion rule stops it
 * everywhere at once. Used by page intros, the opening seal and staff sign-in.
 */
export function CrestBackdrop({
  animated = true,
  className,
}: {
  animated?: boolean;
  className?: string;
}) {
  const motion = (name: string) => (animated ? name : undefined);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[var(--navy-950)]" />

      <div
        className={cn("absolute inset-[-12%]", motion("pm-field-drift"))}
        style={{
          backgroundImage: [
            "radial-gradient(60% 46% at 10% 0%, rgb(0 64 160 / 0.55) 0%, transparent 66%)",
            "radial-gradient(52% 44% at 94% 16%, rgb(255 192 0 / 0.15) 0%, transparent 62%)",
            "radial-gradient(56% 50% at 72% 104%, rgb(0 160 248 / 0.13) 0%, transparent 66%)",
          ].join(", "),
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 192 0 / 0.42) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 192 0 / 0.32) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(82% 72% at 50% 22%, black, transparent)",
        }}
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        className={cn(
          "absolute -right-[14%] -top-[48%] size-[92%] text-[var(--gold-500)] opacity-[0.14]",
          motion("pm-compass"),
        )}
        style={{ transformOrigin: "50% 50%" }}
      >
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.7" />
        <circle
          cx="100"
          cy="100"
          r="56"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 7"
        />
        <path d="M100 4 L103 12 L100 20 L97 12 Z" fill="currentColor" />
      </svg>

      <div
        className={cn(
          "absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[var(--gold-300)]/10 to-transparent",
          motion("pm-sweep"),
        )}
      />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn("absolute size-1 rounded-full bg-[var(--gold-300)]", motion("pm-mote"))}
          style={
            {
              left: `${12 + i * 14}%`,
              top: `${22 + (i % 3) * 21}%`,
              "--mote-delay": `${i * 850}ms`,
            } as CSSProperties
          }
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-500)]/60 to-transparent" />
    </div>
  );
}
