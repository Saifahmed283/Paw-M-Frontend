import { cn } from "@/lib/utils";

/**
 * The Crest mark: a paw seated inside an engraved cradle, crowned by a small
 * four-point jewel. The old heartbeat zigzag is gone — this reads as a heraldic
 * badge, matching the clinic's real logo rather than a cardiac monitor.
 */
export function PawMMark({
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
        d="M8 45 C20 53 44 53 56 45"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        className={animated ? "pawm-draw" : undefined}
      />
      <g fill="currentColor" className={animated ? "pawm-pads" : undefined}>
        <ellipse cx="43.5" cy="22" rx="3.1" ry="4.2" />
        <ellipse cx="52" cy="18.5" rx="3.1" ry="4.4" />
        <ellipse cx="60" cy="23" rx="2.9" ry="4" />
        <path d="M45 36.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 40.7 45 36.5Z" />
        <path d="M52 4 L54.4 9 L52 14 L49.6 9 Z" />
      </g>
    </svg>
  );
}

export function PawMLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/assets/logos/logo-colored.png"
        alt="Paw-M Clinic logo"
        className="h-7 w-7 shrink-0"
        decoding="async"
      />
      <span className="font-display text-[22px] font-semibold tracking-[-0.02em]">Paw-M</span>
    </span>
  );
}

/**
 * The bare badge seal. We use the traced SVG here: it has no paper chip, no
 * white plate behind the mark, and stays crisp when the opening enlarges it.
 * A gold hairline and a slow compass ring keep the heraldic Crest framing.
 */
export function PawMLogoSeal({
  className,
  size = "md",
  animated = true,
}: {
  className?: string;
  size?: "rail" | "sm" | "md" | "lg" | "display";
  /** The compass ring spins in openings and page headers, but sits still in rails. */
  animated?: boolean;
}) {
  const dimension = {
    rail: "size-10",
    sm: "size-12",
    md: "size-16",
    lg: "size-24",
    display: "size-[clamp(10rem,32vw,16rem)]",
  }[size];
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", dimension, className)}>
      <img
        src="/assets/logos/logo-badge.svg"
        alt="Paw-M"
        className="size-full object-contain drop-shadow-[0_8px_28px_rgba(0,0,0,0.42)]"
        decoding="async"
        draggable={false}
      />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-[5%] size-[110%] text-[var(--gold-500)] opacity-50",
          animated && "pm-compass",
        )}
        style={{ transformOrigin: "50% 50%" }}
      >
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.35" />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="currentColor"
          strokeWidth="0.25"
          strokeDasharray="1 3"
        />
      </svg>
    </span>
  );
}
