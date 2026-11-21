import { cn } from "@/lib/utils";

type Tone = "ok" | "watch" | "critical" | "idle";

const TONES: Record<Tone, { text: string }> = {
  ok: { text: "text-status-ok" },
  watch: { text: "text-status-watch-ink" },
  critical: { text: "text-status-critical" },
  idle: { text: "text-ink-faint" },
};

/**
 * A live-state seal. The Crest keeps the dot perfectly still — status is shown
 * by a thin ring that blooms in opacity only. There is no scaling heartbeat
 * and no expanding box-shadow; the ring never grows or moves.
 */
export function StatusOrb({
  tone = "ok",
  label,
  pulse = true,
  size = "md",
  className,
}: {
  tone?: Tone | undefined;
  label?: string | undefined;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string | undefined;
}) {
  const t = TONES[tone];
  return (
    <span className={cn("inline-flex items-center gap-2", t.text, className)}>
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full",
          size === "sm" ? "size-1.5" : "size-2",
        )}
      >
        {pulse && (
          <span className="pm-halo pointer-events-none absolute -inset-1 rounded-full border border-current" />
        )}
        <span
          className={cn("relative rounded-full bg-current", size === "sm" ? "size-1.5" : "size-2")}
        />
      </span>
      {label && <span className="text-xs font-semibold">{label}</span>}
    </span>
  );
}
