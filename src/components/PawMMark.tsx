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
