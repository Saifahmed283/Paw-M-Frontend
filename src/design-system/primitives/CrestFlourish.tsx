import { cn } from "@/lib/utils";

type Variant = "hero" | "divider" | "nav" | "mark" | "chart";
type Status = "calm" | "active" | "watch" | "critical";

/**
 * The Crest's ornamental signature — a hand-engraved divider that opens from
 * a central four-point jewel. It replaces the old clinical ECG trace entirely:
 * no jagged waveform, no heartbeat cadence, no scale animation. The ink simply
 * draws itself once, then rests. Direction is symmetric, so it is RTL-safe.
 */
const GEOMETRY: Record<
  Variant,
  { viewBox: string; rules: string[]; vines?: string[]; jewel: string }
> = {
  hero: {
    viewBox: "0 0 320 40",
    rules: ["M0 20 H104", "M216 20 H320"],
    vines: [
      "M104 20 C124 20 130 6 142 6 C148 6 150 13 150 20",
      "M170 20 C170 13 172 6 178 6 C190 6 196 20 216 20",
    ],
    jewel: "M160 10 L163 17 L170 20 L163 23 L160 30 L157 23 L150 20 L157 17 Z",
  },
  divider: {
    viewBox: "0 0 320 32",
    rules: ["M0 16 H124", "M196 16 H320"],
    vines: [
      "M124 16 C138 16 142 8 151 8 C156 8 158 12 158 16",
      "M162 16 C162 12 164 8 169 8 C178 8 182 16 196 16",
    ],
    jewel: "M160 9 L162 14 L167 16 L162 18 L160 23 L158 18 L153 16 L158 14 Z",
  },
  nav: {
    viewBox: "0 0 80 16",
    rules: ["M0 8 H32", "M48 8 H80"],
    jewel: "M40 3 L43 8 L40 13 L37 8 Z",
  },
  mark: {
    viewBox: "0 0 96 24",
    rules: ["M0 12 H38", "M58 12 H96"],
    jewel: "M48 5 L51 12 L48 19 L45 12 Z",
  },
  chart: {
    viewBox: "0 0 96 24",
    rules: ["M4 20 H28", "M4 14 H44", "M4 8 H60"],
    jewel: "M80 3 L83 8 L80 13 L77 8 Z",
  },
};

const STATUS_COLOR: Record<Status, string> = {
  calm: "text-[var(--gold-600)] dark:text-[var(--gold-400)]",
  active: "text-[var(--blue-600)] dark:text-[var(--blue-400)]",
  watch: "text-[var(--gold-700)] dark:text-[var(--gold-400)]",
  critical: "text-[var(--urgent)]",
};

export function CrestFlourish({
  variant = "divider",
  status = "calm",
  className,
  strokeWidth = 1.5,
  animate = true,
}: {
  variant?: Variant;
  status?: Status;
  className?: string;
  strokeWidth?: number;
  animate?: boolean;
}) {
  const g = GEOMETRY[variant];
  const draw = animate ? "pm-engrave" : undefined;

  return (
    <svg
      viewBox={g.viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      className={cn("block w-full overflow-visible", STATUS_COLOR[status], className)}
    >
      {g.rules.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          className={draw}
        />
      ))}
      {g.vines?.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          className={draw}
        />
      ))}
      <path d={g.jewel} fill="currentColor" className={animate ? "pm-seal-in" : undefined} />
    </svg>
  );
}
