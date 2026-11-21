import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold cursor-pointer transition-colors duration-200 ease-[var(--ease-entrance)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--navy-700)] text-white shadow-[var(--shadow-1)] hover:bg-[var(--navy-900)]",
        destructive: "bg-[var(--urgent)] text-white shadow-[var(--shadow-1)] hover:brightness-110",
        outline:
          "border border-[var(--line-strong)] bg-transparent text-foreground hover:border-[var(--navy-700)] hover:bg-[var(--surface-2)]",
        secondary:
          "border border-[var(--line)] bg-[var(--surface-2)] text-foreground hover:bg-[var(--primary-tint)]",
        ghost: "text-ink-soft hover:bg-[var(--surface-2)] hover:text-foreground",
        link: "text-[var(--blue-700)] underline-offset-4 hover:underline dark:text-[var(--blue-400)]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
