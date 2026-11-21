import { _ as Button, at as telHref, bt as GlassPanel, ft as WHY_US, l as StatusOrb, lt as FAQS, mt as upcomingAvailability, rt as useClinicStore, ut as STATS } from "./router-Bo8c13TA.js";
import { D as cn, E as useI18n } from "./api-BGK8fGh3.js";
import * as React from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, ArrowRight, Bath, ChevronDown, FlaskConical, FolderHeart, PawPrint, Pill, Quote, Salad, ScanLine, Scissors, Siren, Sparkles, Star, Stethoscope, Syringe } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
// src/components/ui/accordion.tsx
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, {
	className: "flex",
	children: /* @__PURE__ */ jsxs(AccordionPrimitive.Trigger, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Content, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ jsx("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
// src/design-system/primitives/CrestFlourish.tsx
/**
* The Crest's ornamental signature — a hand-engraved divider that opens from
* a central four-point jewel. It replaces the old clinical ECG trace entirely:
* no jagged waveform, no heartbeat cadence, no scale animation. The ink simply
* draws itself once, then rests. Direction is symmetric, so it is RTL-safe.
*/
var GEOMETRY = {
	hero: {
		viewBox: "0 0 320 40",
		rules: ["M0 20 H104", "M216 20 H320"],
		vines: ["M104 20 C124 20 130 6 142 6 C148 6 150 13 150 20", "M170 20 C170 13 172 6 178 6 C190 6 196 20 216 20"],
		jewel: "M160 10 L163 17 L170 20 L163 23 L160 30 L157 23 L150 20 L157 17 Z"
	},
	divider: {
		viewBox: "0 0 320 32",
		rules: ["M0 16 H124", "M196 16 H320"],
		vines: ["M124 16 C138 16 142 8 151 8 C156 8 158 12 158 16", "M162 16 C162 12 164 8 169 8 C178 8 182 16 196 16"],
		jewel: "M160 9 L162 14 L167 16 L162 18 L160 23 L158 18 L153 16 L158 14 Z"
	},
	nav: {
		viewBox: "0 0 80 16",
		rules: ["M0 8 H32", "M48 8 H80"],
		jewel: "M40 3 L43 8 L40 13 L37 8 Z"
	},
	mark: {
		viewBox: "0 0 96 24",
		rules: ["M0 12 H38", "M58 12 H96"],
		jewel: "M48 5 L51 12 L48 19 L45 12 Z"
	},
	chart: {
		viewBox: "0 0 96 24",
		rules: [
			"M4 20 H28",
			"M4 14 H44",
			"M4 8 H60"
		],
		jewel: "M80 3 L83 8 L80 13 L77 8 Z"
	}
};
var STATUS_COLOR = {
	calm: "text-[var(--gold-600)] dark:text-[var(--gold-400)]",
	active: "text-[var(--blue-600)] dark:text-[var(--blue-400)]",
	watch: "text-[var(--gold-700)] dark:text-[var(--gold-400)]",
	critical: "text-[var(--urgent)]"
};
function CrestFlourish({ variant = "divider", status = "calm", className, strokeWidth = 1.5, animate = true }) {
	const g = GEOMETRY[variant];
	const draw = animate ? "pm-engrave" : void 0;
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: g.viewBox,
		preserveAspectRatio: "xMidYMid meet",
		fill: "none",
		"aria-hidden": "true",
		className: cn("block w-full overflow-visible", STATUS_COLOR[status], className),
		children: [
			g.rules.map((d) => /* @__PURE__ */ jsx("path", {
				d,
				stroke: "currentColor",
				strokeWidth,
				strokeLinecap: "round",
				pathLength: 1,
				vectorEffect: "non-scaling-stroke",
				className: draw
			}, d)),
			g.vines?.map((d) => /* @__PURE__ */ jsx("path", {
				d,
				stroke: "currentColor",
				strokeWidth,
				strokeLinecap: "round",
				pathLength: 1,
				vectorEffect: "non-scaling-stroke",
				className: draw
			}, d)),
			/* @__PURE__ */ jsx("path", {
				d: g.jewel,
				fill: "currentColor",
				className: animate ? "pm-seal-in" : void 0
			})
		]
	});
}
// src/design-system/primitives/MetricTile.tsx
/**
* A metric with a real value and a trace. Values are always supplied by the
* caller from the clinic store — this component never invents numbers.
*/
function MetricTile({ label, value, suffix, hint, sparkline = false, status = "calm", className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("min-w-0", className),
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint",
				children: label
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 flex items-baseline gap-0.5 font-data text-[length:var(--step-3)] font-bold leading-none tracking-tight text-foreground tabular-nums",
				children: [value, suffix && /* @__PURE__ */ jsx("span", {
					className: "text-base font-semibold text-primary",
					children: suffix
				})]
			}),
			sparkline && /* @__PURE__ */ jsx(CrestFlourish, {
				variant: "chart",
				status,
				strokeWidth: 2,
				className: "mt-2 h-5 w-full max-w-24",
				animate: false
			}),
			hint && /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 truncate text-xs text-ink-soft",
				children: hint
			})
		]
	});
}
// src/design-system/primitives/SectionFrame.tsx
/** Consistent 8px-rhythm width and padding for every content section. */
function SectionFrame({ children, tone = "plain", className, id }) {
	return /* @__PURE__ */ jsx("section", {
		id,
		className: cn("relative py-16 sm:py-20", tone === "surface" && "border-y border-[var(--line)] bg-[var(--surface-2)]", className),
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children
		})
	});
}
/** Section title: gold-ruled eyebrow, serif heading, short gold rule. */
function SectionTitle({ eyebrow, title, description, center = false, as = "h2" }) {
	const Heading = as;
	return /* @__PURE__ */ jsxs("div", {
		className: cn("max-w-2xl", center && "mx-auto text-center"),
		children: [
			eyebrow && /* @__PURE__ */ jsxs("span", {
				className: cn("inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-700)] dark:text-[var(--gold-400)]", center && "justify-center"),
				children: [/* @__PURE__ */ jsx("span", { className: "pm-gild h-px w-6 bg-[var(--gold-500)]" }), eyebrow]
			}),
			/* @__PURE__ */ jsx(Heading, {
				className: cn("mt-4 text-[length:var(--step-3)] font-semibold tracking-tight sm:text-[length:var(--step-4)]", center && "mx-auto"),
				children: title
			}),
			/* @__PURE__ */ jsx("div", { className: cn("pm-gild mt-6 h-px w-16 bg-[var(--gold-500)]", center && "mx-auto") }),
			description && /* @__PURE__ */ jsx("p", {
				className: cn("mt-6 leading-relaxed text-ink-soft", center && "mx-auto"),
				children: description
			})
		]
	});
}
// src/components/reactbits/RotatingText.tsx
var splitIntoCharacters = (text) => {
	if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
		const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
		return Array.from(segmenter.segment(text), (segment) => segment.segment);
	}
	return Array.from(text);
};
var RotatingText = forwardRef(({ texts, className = "", transition = {
	type: "spring",
	damping: 25,
	stiffness: 300
}, rotationInterval = 3e3, staggerDuration = .04, staggerFrom = "first", loop = true, auto = true, splitBy = "characters", onNext, elementClassName = "" }, ref) => {
	const [currentTextIndex, setCurrentTextIndex] = useState(0);
	const elements = useMemo(() => {
		const currentText = texts[currentTextIndex] ?? "";
		if (splitBy === "characters") {
			const words = currentText.split(" ");
			return words.map((word, i) => ({
				characters: splitIntoCharacters(word),
				needsSpace: i !== words.length - 1
			}));
		}
		if (splitBy === "words") return currentText.split(" ").map((word, i, arr) => ({
			characters: [word],
			needsSpace: i !== arr.length - 1
		}));
		if (splitBy === "lines") return currentText.split("\n").map((line, i, arr) => ({
			characters: [line],
			needsSpace: i !== arr.length - 1
		}));
		return [];
	}, [
		texts,
		currentTextIndex,
		splitBy
	]);
	const getStaggerDelay = useCallback((index, totalChars) => {
		if (staggerFrom === "first") return index * staggerDuration;
		if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
		if (staggerFrom === "center") {
			const center = Math.floor(totalChars / 2);
			return Math.abs(center - index) * staggerDuration;
		}
		if (staggerFrom === "random") {
			const randomIndex = Math.floor(Math.random() * totalChars);
			return Math.abs(randomIndex - index) * staggerDuration;
		}
		return Math.abs(staggerFrom - index) * staggerDuration;
	}, [staggerFrom, staggerDuration]);
	const next = useCallback(() => {
		setCurrentTextIndex((current) => {
			const total = texts.length;
			if (total === 0) return current;
			const nextIndex = current === total - 1 ? loop ? 0 : current : current + 1;
			onNext?.(nextIndex);
			return nextIndex;
		});
	}, [
		texts.length,
		loop,
		onNext
	]);
	const previous = useCallback(() => {
		setCurrentTextIndex((current) => {
			const total = texts.length;
			if (total === 0) return current;
			const prevIndex = current === 0 ? loop ? total - 1 : current : current - 1;
			onNext?.(prevIndex);
			return prevIndex;
		});
	}, [
		texts.length,
		loop,
		onNext
	]);
	const jumpTo = useCallback((index) => {
		const total = texts.length;
		if (total === 0) return;
		const validIndex = Math.max(0, Math.min(index, total - 1));
		setCurrentTextIndex(validIndex);
		onNext?.(validIndex);
	}, [texts.length, onNext]);
	const reset = useCallback(() => setCurrentTextIndex(0), []);
	useImperativeHandle(ref, () => ({
		next,
		previous,
		jumpTo,
		reset
	}), [
		next,
		previous,
		jumpTo,
		reset
	]);
	useEffect(() => {
		if (!auto) return;
		const id = window.setInterval(next, rotationInterval);
		return () => window.clearInterval(id);
	}, [
		next,
		rotationInterval,
		auto
	]);
	return /* @__PURE__ */ jsxs("span", {
		className: `text-rotate ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-rotate-sr-only",
			"aria-live": "polite",
			children: texts[currentTextIndex]
		}), /* @__PURE__ */ jsx(AnimatePresence, {
			mode: "wait",
			initial: false,
			children: /* @__PURE__ */ jsx(motion.span, {
				"aria-hidden": "true",
				className: "inline-flex flex-wrap",
				children: elements.map((wordObj, wordIndex, array) => {
					const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
					return /* @__PURE__ */ jsxs("span", {
						className: "text-rotate-word",
						children: [wordObj.characters.map((char, charIndex) => /* @__PURE__ */ jsx(motion.span, {
							initial: {
								y: "100%",
								opacity: 0
							},
							animate: {
								y: 0,
								opacity: 1
							},
							exit: {
								y: "-120%",
								opacity: 0
							},
							transition: {
								...transition,
								delay: getStaggerDelay(previousCharsCount + charIndex, array.reduce((sum, word) => sum + word.characters.length, 0))
							},
							className: `text-rotate-element ${elementClassName}`,
							children: char
						}, charIndex)), wordObj.needsSpace && /* @__PURE__ */ jsx("span", {
							className: "text-rotate-space",
							children: " "
						})]
					}, wordIndex);
				})
			}, currentTextIndex)
		})]
	});
});
RotatingText.displayName = "RotatingText";
// src/assets/hero-vet.jpg
var hero_vet_default = "/assets/hero-vet-BHsVaAjx.jpg";
// src/components/site/sections.tsx
var SERVICE_ICONS = {
	Stethoscope,
	Syringe,
	Scissors,
	Siren,
	FlaskConical,
	Sparkles,
	Pill,
	Bath,
	Salad,
	ScanLine,
	Activity,
	FolderHeart
};
var rise = (index) => ({ "--rise-delay": `${index * 70}ms` });
/** Kept as the shared heading export for about/contact/doctors/services/store routes. */
function SectionHeading({ eyebrow, title, description, center = false, as = "h2" }) {
	return /* @__PURE__ */ jsx(SectionTitle, {
		eyebrow,
		title,
		description,
		center,
		as
	});
}
function Hero() {
	const reduce = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const { t, lang } = useI18n();
	const { settings, doctors, requests } = useClinicStore();
	useEffect(() => setMounted(true), []);
	const firstDoctor = doctors[0];
	const next = useMemo(() => mounted && firstDoctor ? upcomingAvailability(firstDoctor, 1, /* @__PURE__ */ new Date(), requests, lang === "ar" ? "ar" : "en-US") : [], [
		mounted,
		firstDoctor,
		requests,
		lang
	])[0];
	const rotatingTexts = Array.from({ length: 5 }, (_, i) => t(`hero.rotating.${i}`));
	return /* @__PURE__ */ jsxs("section", {
		className: "hero-gradient relative overflow-hidden border-b border-[var(--line)] pb-16 pt-28 sm:pb-20 sm:pt-36",
		children: [
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[var(--gold-500)] to-transparent" }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("h1", {
						className: "text-[length:var(--step-4)] font-bold leading-[1.08] tracking-tight sm:text-[length:var(--step-5)]",
						children: [
							t("hero.title.a"),
							" ",
							/* @__PURE__ */ jsx(RotatingText, {
								texts: rotatingTexts,
								className: "align-baseline text-[var(--gold-700)] dark:text-[var(--gold-400)]",
								splitBy: "words",
								staggerDuration: .04,
								rotationInterval: 2800
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg",
						children: t("hero.subtitle")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							className: "shadow-[var(--shadow-2)]",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/book",
								children: [t("hero.book"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "hover:border-urgent/30 hover:bg-[var(--status-critical-bg)] hover:text-urgent",
							children: /* @__PURE__ */ jsxs("a", {
								href: telHref(settings.emergency) ?? void 0,
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid size-3 shrink-0 place-items-center rounded-full border border-urgent/50",
									children: /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-urgent" })
								}), t("hero.emergency")]
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-t-[var(--gold-500)] pt-7 sm:grid-cols-4",
						children: STATS.map((stat, i) => /* @__PURE__ */ jsx(MetricTile, {
							label: t(`stats.${i}`),
							value: i === 1 ? doctors.length : stat.value,
							suffix: i === 1 ? "" : stat.suffix,
							sparkline: i === 2,
							status: i === 2 ? "active" : "calm"
						}, stat.label))
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: cn("relative", reduce && "translate-x-0"),
					children: [
						/* @__PURE__ */ jsx(GlassPanel, {
							elevation: 2,
							tone: "solid",
							className: "overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] p-0",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative aspect-[4/3.4] w-full overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: hero_vet_default,
										alt: t("img.hero"),
										width: 1002,
										height: 854,
										fetchPriority: "high",
										className: "size-full object-cover"
									}),
									/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 start-4 flex items-center gap-2 rounded-[var(--radius-sm)] border-l-2 border-l-[var(--gold-500)] bg-[var(--navy-900)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[var(--shadow-2)]",
										children: [/* @__PURE__ */ jsx(PawPrint, { className: "size-3.5 text-[var(--gold-400)]" }), settings.name]
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs(GlassPanel, {
							elevation: 2,
							tone: "solid",
							className: "pm-rise absolute -bottom-8 -start-4 w-56 border-s-2 border-s-[var(--gold-500)] p-4 sm:-start-8",
							style: rise(2),
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(StatusOrb, {
										tone: next ? "ok" : "watch",
										size: "sm"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint",
										children: t("hero.nextAvailable")
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 font-data text-lg font-bold leading-tight text-foreground tabular-nums",
									children: next ? `${next.dayLabel} · ${next.slots[0]}` : "—"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-0.5 truncate text-xs text-ink-soft",
									children: firstDoctor?.name
								})
							]
						}),
						/* @__PURE__ */ jsxs(GlassPanel, {
							elevation: 2,
							tone: "solid",
							className: "pm-rise absolute -end-6 -top-8 w-48 border-e-2 border-e-[var(--gold-500)] p-4 sm:-end-8",
							style: rise(3),
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint",
									children: t("story.liveStatus")
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-2 flex items-center gap-2 font-data text-lg font-bold text-foreground",
									children: [doctors.length, /* @__PURE__ */ jsx("span", {
										className: "text-xs font-medium text-ink-soft",
										children: t("footer.vets")
									})]
								}),
								/* @__PURE__ */ jsx(CrestFlourish, {
									variant: "mark",
									className: "mt-2 h-3 w-full",
									strokeWidth: 1.5
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CrestFlourish, {
				variant: "hero",
				className: "relative mx-auto mt-16 h-10 max-w-5xl px-5 opacity-70 sm:mt-20",
				strokeWidth: 1.5
			})
		]
	});
}
function ServicesGrid({ limit }) {
	const { services } = useClinicStore();
	const { tOr } = useI18n();
	const items = limit ? services.slice(0, limit) : services;
	return /* @__PURE__ */ jsx("div", {
		className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: items.map((service, i) => {
			const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
			return /* @__PURE__ */ jsxs(GlassPanel, {
				elevation: 1,
				interactive: true,
				className: "pm-rise group flex h-full flex-col p-6",
				style: rise(i % 3),
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)] transition-colors group-hover:bg-[var(--blue-600)] group-hover:text-white",
							children: /* @__PURE__ */ jsx(Icon, { className: "size-5" })
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-[11px] font-bold text-[var(--gold-700)] dark:text-[var(--gold-400)] tabular-nums",
							children: String(i + 1).padStart(2, "0")
						})]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-5 text-base font-bold text-foreground",
						children: tOr(`svc.${service.slug}.title`, service.title)
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: tOr(`svc.${service.slug}.desc`, service.description)
					}),
					/* @__PURE__ */ jsx("div", { className: "mt-auto h-px w-10 bg-[var(--gold-500)]/60 transition-all duration-300 group-hover:w-20" })
				]
			}, service.slug);
		})
	});
}
function WhyUs() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(SectionFrame, { children: /* @__PURE__ */ jsxs("div", {
		className: "grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20",
		children: [/* @__PURE__ */ jsx(SectionTitle, {
			eyebrow: t("why.eyebrow"),
			title: t("why.title"),
			description: t("why.desc"),
			as: "h2"
		}), /* @__PURE__ */ jsx("div", {
			className: "divide-y divide-[var(--line)] border-b border-[var(--line)] border-t-2 border-t-[var(--gold-500)]",
			children: WHY_US.map((item, i) => /* @__PURE__ */ jsxs("div", {
				className: "pm-rise grid gap-2 py-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-8",
				style: rise(i),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ jsx("span", { className: "mt-0.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gold-500)]" }), /* @__PURE__ */ jsx("h3", {
						className: "font-display text-[length:var(--step-1)] font-semibold leading-snug text-foreground",
						children: t(`whyitem.${i}.title`)
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm leading-relaxed text-ink-soft",
					children: t(`whyitem.${i}.detail`)
				})]
			}, item.title))
		})]
	}) });
}
function DoctorAvailability({ doctor }) {
	const { requests } = useClinicStore();
	const { t, lang } = useI18n();
	const [days, setDays] = useState(null);
	useEffect(() => setDays(upcomingAvailability(doctor, 2, /* @__PURE__ */ new Date(), requests, lang === "ar" ? "ar" : "en-US")), [
		doctor,
		requests,
		lang
	]);
	if (!days) return /* @__PURE__ */ jsx("div", { className: "mt-4 h-[74px] animate-pulse rounded-xl bg-muted/60" });
	if (days.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "mt-4 rounded-xl bg-muted/60 px-3 py-3 text-xs text-ink-soft",
		children: t("availability.fullyBooked")
	});
	return /* @__PURE__ */ jsx("div", {
		className: "mt-4 space-y-2 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4",
		children: days.map((day) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-bold text-foreground",
					children: [
						t(`day.${day.dayLabel}`),
						" ",
						day.dateLabel
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-0.5 font-mono text-[10px] text-ink-faint tabular-nums",
					children: [
						day.openCount,
						" ",
						t("availability.slotsOpen")
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 flex-wrap justify-end gap-1",
				children: day.slots.map((slot) => /* @__PURE__ */ jsx(Link, {
					to: "/book",
					search: { doctor: doctor.id },
					className: "rounded-[var(--radius-sm)] border border-[var(--gold-500)]/40 bg-[var(--surface)] px-2 py-1 font-mono text-[11px] font-semibold text-[var(--gold-700)] shadow-[var(--shadow-1)] transition-colors hover:bg-[var(--navy-900)] hover:text-[var(--gold-400)] dark:text-[var(--gold-300)]",
					children: slot
				}, slot))
			})]
		}, day.dateISO))
	});
}
function DoctorCard({ doctor, index = 0, detailed = false }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(GlassPanel, {
		elevation: 1,
		interactive: true,
		className: "pm-rise flex h-full flex-col overflow-hidden p-0",
		style: rise(index % 3),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex h-28 items-end justify-between border-b-2 border-b-[var(--gold-500)] bg-[var(--navy-900)] p-4",
			children: [/* @__PURE__ */ jsx("span", {
				className: "grid size-14 place-items-center rounded-[var(--radius-md)] bg-white/10 font-display text-base font-semibold text-[var(--gold-400)] ring-1 ring-[var(--gold-500)]/40",
				children: doctor.initials
			}), /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1 rounded-[var(--radius-sm)] bg-white/10 px-2 py-0.5 font-mono text-xs font-bold text-white tabular-nums",
				children: [/* @__PURE__ */ jsx(Star, { className: "size-3 fill-warning text-warning" }), doctor.rating.toFixed(1)]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col p-5",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-foreground",
					children: t(`doc.${doctor.id}.name`)
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold text-[var(--blue-700)] dark:text-[var(--blue-400)]",
					children: t(`doc.${doctor.id}.spec`)
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs leading-relaxed text-ink-soft",
					children: t(`doc.${doctor.id}.bio`)
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: doctor.tags.map((tag, j) => /* @__PURE__ */ jsx("span", {
						className: "rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-semibold text-ink-soft",
						children: t(`doc.${doctor.id}.tag.${j}`)
					}, tag))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-2.5 flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(PawPrint, {
							className: "size-3 text-ink-faint",
							"aria-hidden": true
						}),
						/* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: t("availability.treats")
						}),
						doctor.pets.map((pet) => /* @__PURE__ */ jsx("span", {
							className: "rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-soft",
							children: t(`animal.${pet}`)
						}, pet))
					]
				}),
				detailed ? /* @__PURE__ */ jsx(DoctorAvailability, { doctor }) : /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: doctor.days.map((d) => /* @__PURE__ */ jsx("span", {
						className: "rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-soft",
						children: t(`day.${d}`)
					}, d))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-auto flex items-center justify-between border-t border-border pt-3.5",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "font-mono text-[11px] text-ink-faint",
						children: [
							t(`doc.${doctor.id}.exp`),
							" ",
							t("availability.experience")
						]
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/book",
							search: { doctor: doctor.id },
							children: t("availability.book")
						})
					})]
				})
			]
		})]
	});
}
function Testimonials() {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const { t } = useI18n();
	const { reviews } = useClinicStore();
	const testimonials = reviews.filter((review) => review.productId === "clinic" && review.status === "approved");
	useEffect(() => {
		if (paused || testimonials.length < 2) return;
		const id = window.setInterval(() => setActive((a) => (a + 1) % testimonials.length), 6e3);
		return () => window.clearInterval(id);
	}, [paused, testimonials.length]);
	const item = testimonials[active] ?? testimonials[0];
	if (!item) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: () => setPaused(false),
		children: [
			/* @__PURE__ */ jsx(SectionTitle, {
				center: true,
				eyebrow: t("homepage.clinicReviews.eyebrow"),
				title: t("testimonials.title")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto mt-8 w-full max-w-sm",
				children: [/* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 240 260",
					fill: "none",
					"aria-hidden": "true",
					className: "pointer-events-none w-full overflow-visible",
					children: [
						/* @__PURE__ */ jsxs("g", {
							fill: "var(--surface)",
							stroke: "var(--gold-500)",
							strokeWidth: 1.5,
							children: [
								/* @__PURE__ */ jsx("g", {
									transform: "translate(46 66) rotate(-24) scale(0.92)",
									children: /* @__PURE__ */ jsx("path", {
										className: "pm-paw-toe",
										style: { "--toe-delay": "0ms" },
										d: "M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
									})
								}),
								/* @__PURE__ */ jsx("g", {
									transform: "translate(92 42) rotate(-9)",
									children: /* @__PURE__ */ jsx("path", {
										className: "pm-paw-toe",
										style: { "--toe-delay": "80ms" },
										d: "M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
									})
								}),
								/* @__PURE__ */ jsx("g", {
									transform: "translate(148 42) rotate(9)",
									children: /* @__PURE__ */ jsx("path", {
										className: "pm-paw-toe",
										style: { "--toe-delay": "160ms" },
										d: "M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
									})
								}),
								/* @__PURE__ */ jsx("g", {
									transform: "translate(194 66) rotate(24) scale(0.92)",
									children: /* @__PURE__ */ jsx("path", {
										className: "pm-paw-toe",
										style: { "--toe-delay": "240ms" },
										d: "M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
									})
								}),
								/* @__PURE__ */ jsx("path", {
									className: "pm-paw-pad",
									d: "M120 92 C106 84 86 90 70 106 C52 124 42 152 44 180 C46 212 66 236 98 244 C112 248 128 248 142 244 C174 236 194 212 196 180 C198 152 188 124 170 106 C154 90 134 84 120 92 Z"
								})
							]
						}),
						/* @__PURE__ */ jsx("path", {
							d: "M120 92 C106 84 86 90 70 106 C52 124 42 152 44 180 C46 212 66 236 98 244 C112 248 128 248 142 244 C174 236 194 212 196 180 C198 152 188 124 170 106 C154 90 134 84 120 92 Z",
							transform: "translate(12 17) scale(0.9)",
							stroke: "var(--gold-500)",
							strokeOpacity: "0.35",
							strokeWidth: 1,
							pathLength: 1,
							className: "pm-engrave"
						}),
						/* @__PURE__ */ jsx("path", {
							d: "M120 84 L123 91 L120 98 L117 91 Z",
							fill: "var(--gold-500)",
							className: "pm-seal-in"
						})
					]
				}), /* @__PURE__ */ jsxs("figure", {
					className: "absolute inset-x-[20%] top-[43%] bottom-[8%] flex flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ jsx(Quote, { className: "size-3.5 text-[var(--gold-600)] sm:size-4" }),
						/* @__PURE__ */ jsxs(motion.blockquote, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .35,
								delay: .25,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "mt-1.5 font-display text-[11px] leading-tight text-foreground sm:text-[13px] sm:leading-snug",
							children: [
								"\"",
								item.comment,
								"\""
							]
						}),
						/* @__PURE__ */ jsx("div", { className: "mt-2 h-px w-10 bg-[var(--gold-500)]/70 sm:mt-3 sm:w-12" }),
						/* @__PURE__ */ jsxs("figcaption", {
							className: "mt-1.5 sm:mt-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex justify-center gap-0.5",
									children: Array.from({ length: item.rating }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: "size-2.5 fill-warning text-warning sm:size-3" }, i))
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[10px] font-bold text-foreground sm:text-xs",
									children: item.author
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[9px] text-ink-faint sm:text-[10px]",
									children: t("reviews.googleSource")
								})
							]
						})
					]
				})]
			}, active),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 flex justify-center gap-1.5",
				children: testimonials.map((review, i) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActive(i),
					"aria-label": `${t("testimonials.eyebrow")} ${i + 1}`,
					"aria-current": i === active,
					className: "grid h-7 min-w-7 place-items-center px-1",
					children: /* @__PURE__ */ jsx("span", { className: cn("block h-1.5 rounded-full transition-all", i === active ? "w-6 bg-[var(--gold-600)]" : "w-2.5 bg-[var(--line-strong)] hover:bg-ink-faint") })
				}, review.id))
			})
		]
	});
}
function Faq() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("section", {
		className: "border-t border-[var(--line)] bg-[var(--surface-2)] py-16 sm:py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-5 sm:px-8",
			children: [/* @__PURE__ */ jsx(SectionTitle, {
				center: true,
				eyebrow: t("faq.eyebrow"),
				title: t("faq.title")
			}), /* @__PURE__ */ jsx(Accordion, {
				type: "single",
				collapsible: true,
				className: "mt-9 w-full",
				children: FAQS.map((faq, i) => /* @__PURE__ */ jsxs(AccordionItem, {
					value: `item-${i}`,
					className: "border-border",
					children: [/* @__PURE__ */ jsx(AccordionTrigger, {
						className: "text-start text-sm font-bold text-foreground hover:no-underline",
						children: t(`faq.${i}.q`)
					}), /* @__PURE__ */ jsx(AccordionContent, {
						className: "text-sm leading-relaxed text-ink-soft",
						children: t(`faq.${i}.a`)
					})]
				}, faq.q))
			})]
		})
	});
}
function CtaBand() {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	return /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20",
		children: /* @__PURE__ */ jsxs(GlassPanel, {
			elevation: 2,
			tone: "accent",
			className: "relative overflow-hidden border-t-2 border-t-[var(--gold-500)] px-6 py-12 text-center sm:px-16",
			children: [
				/* @__PURE__ */ jsx("div", {
					"aria-hidden": "true",
					className: "pointer-events-none absolute inset-0 opacity-[0.07]",
					style: { backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 63px, #ffc000 64px, transparent 65px)" }
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "relative inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "size-3" }), t("story.careNote")]
				}),
				/* @__PURE__ */ jsxs("h2", {
					className: "relative mx-auto mt-5 max-w-2xl text-[length:var(--step-3)] font-semibold text-white sm:text-[length:var(--step-4)]",
					children: [
						t("cta.title.a"),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "text-[var(--gold-400)]",
							children: t("cta.title.b")
						}),
						" ",
						t("cta.title.c")
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70",
					children: t("cta.subtitle")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						className: "bg-[var(--gold-500)] text-[var(--navy-900)] shadow-none hover:bg-[var(--gold-400)]",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/book",
							children: [t("cta.book"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
						})
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						className: "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
						children: /* @__PURE__ */ jsx("a", {
							href: telHref(settings.emergency) ?? void 0,
							children: t("cta.call", { phone: settings.emergency })
						})
					})]
				})
			]
		})
	});
}
export { SectionHeading as a, WhyUs as c, Hero as i, SectionFrame as l, DoctorCard as n, ServicesGrid as o, Faq as r, Testimonials as s, CtaBand as t };
