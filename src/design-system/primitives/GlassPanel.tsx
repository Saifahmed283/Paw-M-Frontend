import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Elevation = 1 | 2 | 3;
type Tone = "base" | "tint" | "solid" | "accent";

const ELEVATION: Record<Elevation, string> = {
  1: "shadow-[var(--shadow-1)]",
  2: "shadow-[var(--shadow-2)]",
  3: "shadow-[var(--shadow-3)]",
};

const TONE: Record<Tone, string> = {
  base: "bg-[var(--surface)]",
  tint: "bg-[var(--surface-2)]",
  solid: "bg-card",
  accent: "bg-[var(--navy-900)] text-white dark:bg-[var(--navy-800)]",
};

/**
 * A solid paper panel with a hairline rule — the Crest surface.
 * Elevation is semantic, never decorative. No blur, no glass.
 */
export function GlassPanel({
  elevation = 1,
  tone = "base",
  interactive = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  elevation?: Elevation;
  tone?: Tone;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--line)]",
        ELEVATION[elevation],
        TONE[tone],
        interactive &&
          "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-entrance)] hover:border-[var(--gold-500)] hover:shadow-[var(--shadow-2)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
