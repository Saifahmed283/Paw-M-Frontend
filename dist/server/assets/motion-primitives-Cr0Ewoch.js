import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion, useInView, useReducedMotion } from "motion/react";
// src/components/motion-primitives.tsx
var EASE = [
	.16,
	1,
	.3,
	1
];
function Reveal({ children, delay = 0, y = 16, className }) {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ jsx(motion.div, {
		className,
		initial: reduce ? { opacity: 0 } : {
			opacity: 0,
			y
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .55,
			delay,
			ease: EASE
		},
		children
	});
}
function CountUp({ value, suffix = "", duration = 1400 }) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-60px"
	});
	const reduce = useReducedMotion();
	const [display, setDisplay] = useState(0);
	useEffect(() => {
		if (!inView) return;
		if (reduce) {
			setDisplay(value);
			return;
		}
		const start = performance.now();
		let raf = 0;
		const tick = (now) => {
			const t = Math.min(1, (now - start) / duration);
			setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		inView,
		value,
		duration,
		reduce
	]);
	return /* @__PURE__ */ jsxs("span", {
		ref,
		children: [display.toLocaleString(), suffix]
	});
}
export { Reveal as n, CountUp as t };
