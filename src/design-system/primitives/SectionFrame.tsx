import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Consistent 8px-rhythm width and padding for every content section. */
export function SectionFrame({
  children,
  tone = "plain",
  className,
  id,
}: {
  children: ReactNode;
  tone?: "plain" | "surface";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 sm:py-20",
        tone === "surface" && "border-y border-[var(--line)] bg-[var(--surface-2)]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** Section title: gold-ruled eyebrow, serif heading, short gold rule. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
  as = "h2",
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-700)] dark:text-[var(--gold-400)]",
            center && "justify-center",
          )}
        >
          <span className="pm-gild h-px w-6 bg-[var(--gold-500)]" />
          {eyebrow}
        </span>
      )}
      <Heading
        className={cn(
          "mt-4 text-[length:var(--step-3)] font-semibold tracking-tight sm:text-[length:var(--step-4)]",
          center && "mx-auto",
        )}
      >
        {title}
      </Heading>
      <div className={cn("pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]", center && "mx-auto")} />
      {description && (
        <p className={cn("mt-6 leading-relaxed text-ink-soft", center && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
