import { D as cn } from "./api-BSVeo-E7.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
// src/components/ui/badge-variants.ts
var badgeVariants = cva("inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-[var(--line)] bg-[var(--primary-tint)] text-[var(--navy-700)] dark:text-[var(--blue-300)]",
		secondary: "border-[var(--line)] bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-300)]",
		destructive: "border-transparent bg-[var(--status-critical-bg)] text-[var(--urgent)]",
		outline: "border-[var(--line-strong)] bg-transparent text-ink-soft"
	} },
	defaultVariants: { variant: "default" }
});
// src/components/ui/badge.tsx
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
export { Badge as t };
