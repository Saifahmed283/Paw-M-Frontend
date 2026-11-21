import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared page header: the navy crest band with a gold hairline and serif title. */
export function PageIntro({
  eyebrow,
  title,
  description,
  crumb,
  children,
  className,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  crumb?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[var(--navy-700)] bg-[var(--navy-900)] pb-12 pt-28 text-white sm:pb-16 sm:pt-36",
        className,
      )}
    >
      {/* Fine engraved lines — a badge motif, not a decorative gradient blob. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 63px, #ffc000 64px, transparent 65px)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {crumb}
        {eyebrow && (
          <span className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]">
            <span className="pm-gild h-px w-6 bg-[var(--gold-500)]" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-4xl font-display text-[length:var(--step-4)] font-semibold tracking-tight text-white sm:text-[length:var(--step-5)]">
          {title}
        </h1>
        <div className="pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]" />
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
