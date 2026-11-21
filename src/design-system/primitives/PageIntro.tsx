import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { CrestBackdrop } from "./CrestBackdrop";

/**
 * Shared page header: a quiet navy crest stage. The badge field drifts, an
 * engraved grid fades behind the title, and a soft blue glow follows the
 * pointer on desktop. Content arrives in a short staggered engraving gesture.
 */
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
  const reduce = !!useReducedMotion();

  const reveal = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.16 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      onPointerMove={(event) => {
        if (reduce) return;
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }}
      className={cn(
        "relative isolate overflow-hidden border-b border-[var(--navy-700)] bg-[var(--navy-950)] pb-12 pt-28 text-white sm:pb-16 sm:pt-36",
        className,
      )}
    >
      <CrestBackdrop animated={!reduce} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(20rem 20rem at var(--mx, 72%) var(--my, 18%), rgb(0 160 248 / 0.17), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {crumb}

        <div className="mt-6 min-w-0">
          {eyebrow && (
            <motion.span
              {...reveal(0.05)}
              className="inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]"
            >
              <span className="pm-gild h-px w-6 bg-[var(--gold-500)]" />
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            {...reveal(0.12)}
            className="mt-4 max-w-4xl font-display text-[length:var(--step-4)] font-semibold tracking-tight text-white sm:text-[length:var(--step-5)]"
          >
            {title}
          </motion.h1>
        </div>

        <div className="pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]" />

        {description && (
          <motion.p
            {...reveal(0.26)}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {description}
          </motion.p>
        )}

        {children}
      </div>
    </section>
  );
}
