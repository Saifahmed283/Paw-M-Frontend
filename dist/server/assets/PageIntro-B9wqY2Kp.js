import { D as cn } from "./api-DGScY83Q.js";
import { Ct as CrestBackdrop } from "./router-Ixc8qj2e.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion, useReducedMotion } from "motion/react";
// src/design-system/primitives/PageIntro.tsx
/**
* Shared page header: a quiet navy crest stage. The badge field drifts, an
* engraved grid fades behind the title, and a soft blue glow follows the
* pointer on desktop. Content arrives in a short staggered engraving gesture.
*/
function PageIntro({ eyebrow, title, description, crumb, children, className }) {
	const reduce = !!useReducedMotion();
	const reveal = (delay) => reduce ? {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { duration: .16 }
	} : {
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .5,
			delay,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		onPointerMove: (event) => {
			if (reduce) return;
			const el = event.currentTarget;
			const rect = el.getBoundingClientRect();
			el.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width * 100}%`);
			el.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height * 100}%`);
		},
		className: cn("relative isolate overflow-hidden border-b border-[var(--navy-700)] bg-[var(--navy-950)] pb-12 pt-28 text-white sm:pb-16 sm:pt-36", className),
		children: [
			/* @__PURE__ */ jsx(CrestBackdrop, { animated: !reduce }),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-0 opacity-70",
				style: { background: "radial-gradient(20rem 20rem at var(--mx, 72%) var(--my, 18%), rgb(0 160 248 / 0.17), transparent 70%)" }
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto max-w-6xl px-5 sm:px-8",
				children: [
					crumb,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 min-w-0",
						children: [eyebrow && /* @__PURE__ */ jsxs(motion.span, {
							...reveal(.05),
							className: "inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-400)]",
							children: [/* @__PURE__ */ jsx("span", { className: "pm-gild h-px w-6 bg-[var(--gold-500)]" }), eyebrow]
						}), /* @__PURE__ */ jsx(motion.h1, {
							...reveal(.12),
							className: "mt-4 max-w-4xl font-display text-[length:var(--step-4)] font-semibold tracking-tight text-white sm:text-[length:var(--step-5)]",
							children: title
						})]
					}),
					/* @__PURE__ */ jsx("div", { className: "pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]" }),
					description && /* @__PURE__ */ jsx(motion.p, {
						...reveal(.26),
						className: "mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg",
						children: description
					}),
					children
				]
			})
		]
	});
}
export { PageIntro as t };
