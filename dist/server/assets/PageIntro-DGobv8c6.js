import { D as cn } from "./i18n-B17xJ44j.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/design-system/primitives/PageIntro.tsx
/** Shared page header: the navy crest band with a gold hairline and serif title. */
function PageIntro({ eyebrow, title, description, crumb, children, className }) {
	return /* @__PURE__ */ jsxs("section", {
		className: cn("relative overflow-hidden border-b border-[var(--navy-700)] bg-[var(--navy-900)] pb-12 pt-28 text-white sm:pb-16 sm:pt-36", className),
		children: [/* @__PURE__ */ jsx("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 opacity-[0.07]",
			style: { backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 63px, #ffc000 64px, transparent 65px)" }
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative mx-auto max-w-6xl px-5 sm:px-8",
			children: [
				crumb,
				eyebrow && /* @__PURE__ */ jsxs("span", {
					className: "mt-6 inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]",
					children: [/* @__PURE__ */ jsx("span", { className: "pm-gild h-px w-6 bg-[var(--gold-500)]" }), eyebrow]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 max-w-4xl font-display text-[length:var(--step-4)] font-semibold tracking-tight text-white sm:text-[length:var(--step-5)]",
					children: title
				}),
				/* @__PURE__ */ jsx("div", { className: "pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]" }),
				description && /* @__PURE__ */ jsx("p", {
					className: "mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg",
					children: description
				}),
				children
			]
		})]
	});
}
export { PageIntro as t };
