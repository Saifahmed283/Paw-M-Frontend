import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[var(--line)] bg-[var(--primary-tint)] text-[var(--navy-700)] dark:text-[var(--blue-300)]",
        secondary:
          "border-[var(--line)] bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-300)]",
        destructive: "border-transparent bg-[var(--status-critical-bg)] text-[var(--urgent)]",
        outline: "border-[var(--line-strong)] bg-transparent text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
