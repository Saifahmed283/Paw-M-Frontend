import { B as telHref, G as FAQS, J as WHY_US, K as STATS, N as useClinicStore, U as BOOKING_STEPS, X as upcomingAvailability, Z as Button, et as useI18n, nt as cn } from "./clinic-store-DIjEN_jj.js";
import { h as Reveal, m as CountUp } from "./router-CgUtbw6Z.js";
import * as React from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, ArrowRight, Bath, Check, ChevronDown, FlaskConical, FolderHeart, PawPrint, Pill, Quote, Salad, ScanLine, Scissors, Siren, Sparkles, Star, Stethoscope, Syringe } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
//#region src/components/ui/accordion.tsx
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
//#endregion
//#region src/components/reactbits/AmbientGlobs.tsx
/**
* Soft drifting aurora "blobs" — a lightweight, dependency-free take on the
* React Bits Aurora background. Floating translucent gradient discs breathe
* slowly behind a section (default: hero / CTA bands).
*/
function AmbientGlobs({ className = "" }) {
	if (useReducedMotion()) return null;
	return /* @__PURE__ */ jsx("div", {
		className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
		"aria-hidden": "true",
		children: [
			{
				className: "blob size-[34rem] bg-[var(--blob-1)]",
				style: {
					left: "-12%",
					top: "-22%"
				},
				drift: {
					x: [
						0,
						60,
						0
					],
					y: [
						0,
						40,
						0
					]
				},
				duration: 26
			},
			{
				className: "blob size-[38rem] bg-[var(--blob-2)]",
				style: {
					right: "-14%",
					top: "-12%"
				},
				drift: {
					x: [
						0,
						-50,
						0
					],
					y: [
						0,
						60,
						0
					]
				},
				duration: 32
			},
			{
				className: "blob size-[32rem] bg-[var(--blob-3)]",
				style: {
					left: "28%",
					top: "38%"
				},
				drift: {
					x: [
						0,
						40,
						0
					],
					y: [
						0,
						-30,
						0
					]
				},
				duration: 38
			},
			{
				className: "blob size-[26rem] bg-[var(--blob-4)]",
				style: {
					right: "6%",
					top: "48%"
				},
				drift: {
					x: [
						0,
						-30,
						0
					],
					y: [
						0,
						40,
						0
					]
				},
				duration: 30
			}
		].map((b, i) => /* @__PURE__ */ jsx(motion.div, {
			className: b.className,
			style: b.style,
			animate: b.drift,
			transition: {
				duration: b.duration,
				ease: "easeInOut",
				repeat: Infinity,
				repeatType: "mirror"
			}
		}, i))
	});
}
//#endregion
//#region src/components/reactbits/TextAnimations.tsx
function buildKeyframes(from, steps) {
	const keys = /* @__PURE__ */ new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
	const keyframes = {};
	keys.forEach((k) => {
		keyframes[k] = [from[k] ?? "", ...steps.map((s) => s[k] ?? from[k] ?? "")];
	});
	return keyframes;
}
function BlurText({ text, delay = 160, className = "", animateBy = "words", direction = "top", threshold = .1, rootMargin = "0px 0px -10% 0px", easing, onAnimationComplete, stepDuration = .4, as: Tag = "span" }) {
	const elements = animateBy === "words" ? text.split(" ") : text.split("");
	const [inView, setInView] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setInView(true);
				observer.unobserve(ref.current);
			}
		}, {
			threshold,
			rootMargin
		});
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [threshold, rootMargin]);
	const defaultFrom = useMemo(() => direction === "top" ? {
		filter: "blur(10px)",
		opacity: 0,
		y: -50
	} : {
		filter: "blur(10px)",
		opacity: 0,
		y: 50
	}, [direction]);
	const defaultTo = useMemo(() => [{
		filter: "blur(5px)",
		opacity: .5,
		y: direction === "top" ? 5 : -5
	}, {
		filter: "blur(0px)",
		opacity: 1,
		y: 0
	}], [direction]);
	const stepCount = defaultTo.length + 1;
	const totalDuration = stepDuration * (stepCount - 1);
	const times = Array.from({ length: stepCount }, (_, i) => stepCount === 1 ? 0 : i / (stepCount - 1));
	return /* @__PURE__ */ jsx(Tag, {
		ref,
		className,
		style: {
			display: "inline-flex",
			flexWrap: "wrap"
		},
		children: elements.map((segment, index) => /* @__PURE__ */ jsxs(motion.span, {
			className: "inline-block will-change-[transform,filter,opacity]",
			initial: defaultFrom,
			animate: inView ? buildKeyframes(defaultFrom, defaultTo) : defaultFrom,
			transition: {
				duration: totalDuration,
				times,
				delay: index * delay / 1e3,
				ease: easing ?? ((t) => t)
			},
			...index === elements.length - 1 && onAnimationComplete ? { onAnimationComplete } : {},
			children: [segment === " " ? "\xA0" : segment, animateBy === "words" && index < elements.length - 1 && "\xA0"]
		}, index))
	});
}
function GradientText({ children, className = "", colors = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)"
], animationSpeed = 8, showBorder = false, direction = "horizontal", pauseOnHover = false }) {
	const [isPaused, setIsPaused] = useState(false);
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		let raf = 0;
		let last = performance.now();
		const tick = (now) => {
			const dt = now - last;
			last = now;
			setProgress((p) => (p + dt / (animationSpeed * 1e3) * 50) % 100);
			raf = requestAnimationFrame(tick);
		};
		if (isPaused) return;
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [isPaused, animationSpeed]);
	const style = {
		backgroundImage: `linear-gradient(${direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right"}, ${[
			colors[0],
			colors.at(-1),
			...colors.slice(0, -1),
			colors[0]
		].join(", ")})`,
		backgroundSize: direction === "horizontal" ? "300% 100%" : "100% 300%",
		backgroundRepeat: "repeat",
		backgroundPosition: direction === "horizontal" ? `${progress}% 50%` : `50% ${progress}%`,
		WebkitBackgroundClip: "text",
		backgroundClip: "text",
		color: "transparent"
	};
	return /* @__PURE__ */ jsx("span", {
		className: `${className} ${showBorder ? "rounded-full ring-1 ring-border" : ""}`,
		style,
		onMouseEnter: () => pauseOnHover && setIsPaused(true),
		onMouseLeave: () => pauseOnHover && setIsPaused(false),
		children
	});
}
//#endregion
//#region src/components/reactbits/RotatingText.tsx
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
//#endregion
//#region src/assets/hero-vet.jpg
var hero_vet_default = "/assets/hero-vet-Du4NkQGO.jpg";
//#endregion
//#region src/assets/clinic-interior.jpg
var clinic_interior_default = "/assets/clinic-interior-DKN0pY3w.jpg";
//#endregion
//#region src/components/site/sections.tsx
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
function SectionHeading({ eyebrow, title, description, center = false, as = "h2" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: center ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
		children: [
			/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("span", {
				className: cn("flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brass", center && "justify-center"),
				children: [
					/* @__PURE__ */ jsx("span", { className: "h-px w-10 bg-gradient-to-r from-transparent via-brass/60 to-brass/60" }),
					eyebrow,
					center && /* @__PURE__ */ jsx("span", { className: "h-px w-10 bg-gradient-to-l from-transparent via-brass/60 to-brass/60" })
				]
			}) }),
			/* @__PURE__ */ jsx(Reveal, {
				delay: .05,
				children: as === "h1" ? /* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-3xl font-semibold sm:text-[2.75rem]",
					children: /* @__PURE__ */ jsx(BlurText, {
						text: title,
						as: "span",
						direction: "top",
						stepDuration: .3
					})
				}) : /* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-3xl font-semibold sm:text-[2.75rem]",
					children: /* @__PURE__ */ jsx(BlurText, {
						text: title,
						as: "span",
						direction: "top",
						stepDuration: .3
					})
				})
			}),
			description && /* @__PURE__ */ jsx(Reveal, {
				delay: .1,
				children: /* @__PURE__ */ jsx("p", {
					className: "mt-5 text-base leading-relaxed text-muted-foreground",
					children: description
				})
			})
		]
	});
}
function Hero() {
	const reduce = useReducedMotion();
	const [offset, setOffset] = useState({
		x: 0,
		y: 0
	});
	const [mounted, setMounted] = useState(false);
	const frameRef = useRef(null);
	const { t } = useI18n();
	const { settings, doctors, requests } = useClinicStore();
	const { lang } = useI18n();
	useEffect(() => {
		setMounted(true);
	}, []);
	const firstDoctor = doctors[0];
	const nextDay = useMemo(() => firstDoctor ? upcomingAvailability(firstDoctor, 1, /* @__PURE__ */ new Date(), requests, lang === "ar" ? "ar" : "en-US") : [], [
		firstDoctor,
		requests,
		lang
	]);
	useEffect(() => {
		if (reduce) return;
		const onMove = (e) => {
			const x = (e.clientX / window.innerWidth - .5) * 16;
			const y = (e.clientY / window.innerHeight - .5) * 12;
			setOffset({
				x,
				y
			});
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, [reduce]);
	const ease = [
		.16,
		1,
		.3,
		1
	];
	const rotatingTexts = Array.from({ length: 5 }, (_, i) => t(`hero.rotating.${i}`));
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden pb-12 pt-20 sm:pt-24",
		children: [
			/* @__PURE__ */ jsx("div", { className: "hero-gradient absolute inset-0 -z-10" }),
			/* @__PURE__ */ jsx(AmbientGlobs, { className: "-z-[5]" }),
			/* @__PURE__ */ jsx("div", { className: "grid-lines absolute inset-x-0 top-0 -z-10 h-[420px] opacity-25" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]",
				children: [/* @__PURE__ */ jsxs(motion.div, {
					initial: mounted ? reduce ? { opacity: 0 } : {
						opacity: 0,
						y: 20,
						scale: .99
					} : false,
					animate: {
						opacity: 1,
						y: 0,
						scale: 1
					},
					transition: {
						duration: .7,
						ease
					},
					children: [
						/* @__PURE__ */ jsxs("h1", {
							className: "text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.75rem]",
							children: [
								t("hero.title.a"),
								" ",
								/* @__PURE__ */ jsx(RotatingText, {
									texts: rotatingTexts,
									className: "align-baseline",
									splitBy: "words",
									staggerDuration: .05,
									rotationInterval: 2600
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground",
							children: t("hero.subtitle")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								className: "shadow-glow transition-transform hover:scale-[1.02]",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/book",
									children: [t("hero.book"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								className: "group",
								children: /* @__PURE__ */ jsxs("a", {
									href: telHref(settings.emergency) ?? void 0,
									children: [/* @__PURE__ */ jsxs("span", {
										className: "relative flex size-2",
										children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-2 rounded-full bg-destructive" })]
									}), t("hero.emergency")]
								})
							})]
						}),
						/* @__PURE__ */ jsx("dl", {
							className: "mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4",
							children: STATS.map((stat, i) => /* @__PURE__ */ jsx(Reveal, {
								delay: i * .06,
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: /* @__PURE__ */ jsx(CountUp, {
										value: i === 1 ? doctors.length : stat.value,
										suffix: i === 1 ? "" : stat.suffix
									})
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-xs leading-snug text-muted-foreground",
									children: t(`stats.${i}`)
								})] })
							}, stat.label))
						})
					]
				}), /* @__PURE__ */ jsxs(motion.div, {
					ref: frameRef,
					initial: mounted ? reduce ? { opacity: 0 } : {
						opacity: 0,
						scale: .97
					} : false,
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: {
						duration: .8,
						ease,
						delay: .1
					},
					className: "relative",
					style: { transform: reduce ? "none" : `translate3d(${offset.x}px, ${offset.y}px, 0)` },
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-3xl border border-border shadow-lg",
							children: /* @__PURE__ */ jsx("img", {
								src: hero_vet_default,
								alt: t("img.hero"),
								width: 1408,
								height: 1200,
								className: "h-full w-full object-cover"
							})
						}),
						/* @__PURE__ */ jsxs(motion.div, {
							initial: mounted ? {
								opacity: 0,
								y: 14
							} : false,
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								ease,
								delay: .45
							},
							className: "glass absolute -bottom-6 -left-4 w-56 rounded-2xl p-4 shadow-lg sm:-left-8 rtl:left-auto rtl:-right-4 rtl:sm:-right-8",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: t("hero.triage")
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-2xl font-bold text-foreground",
									children: "4m 12s"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border",
									children: /* @__PURE__ */ jsx("div", { className: "h-full w-3/4 rounded-full bg-success" })
								})
							]
						}),
						/* @__PURE__ */ jsxs(motion.div, {
							initial: mounted ? {
								opacity: 0,
								y: 14
							} : false,
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								ease,
								delay: .6
							},
							className: "glass absolute -right-4 top-8 w-52 rounded-2xl p-4 shadow-lg sm:-right-8 rtl:right-auto rtl:-left-4 rtl:sm:-left-8",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium text-muted-foreground",
								children: t("hero.nextAvailable")
							}), nextDay[0] ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-sm font-semibold text-foreground",
								children: [
									nextDay[0].dayLabel,
									" · ",
									nextDay[0].slots[0]
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: firstDoctor?.name
							})] }) : /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm font-semibold text-foreground",
								children: "—"
							})]
						})
					]
				})]
			})
		]
	});
}
function ServicesGrid({ limit }) {
	const { services } = useClinicStore();
	const { t } = useI18n();
	const items = limit ? services.slice(0, limit) : services;
	return /* @__PURE__ */ jsx("div", {
		className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: items.map((service, i) => {
			const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
			return /* @__PURE__ */ jsx(Reveal, {
				delay: i % 3 * .06,
				children: /* @__PURE__ */ jsxs("article", {
					className: "group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-raised",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
							children: /* @__PURE__ */ jsx(Icon, { className: "size-5" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-5 text-base font-semibold",
							children: t(`svc.${service.slug}.title`)
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t(`svc.${service.slug}.desc`)
						})
					]
				})
			}, service.slug);
		})
	});
}
function WhyUs() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 py-20 sm:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid items-center gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-3xl border border-border shadow-lg",
				children: /* @__PURE__ */ jsx("img", {
					src: clinic_interior_default,
					alt: t("img.clinic"),
					loading: "lazy",
					width: 1200,
					height: 1008,
					className: "h-full w-full object-cover"
				})
			}) }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("why.eyebrow"),
				title: t("why.title"),
				description: t("why.desc")
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-8 space-y-5",
				children: WHY_US.map((item, i) => /* @__PURE__ */ jsx(Reveal, {
					delay: i * .05,
					children: /* @__PURE__ */ jsxs("li", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-success",
							children: /* @__PURE__ */ jsx(Check, {
								className: "size-3.5",
								strokeWidth: 3
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold text-foreground",
							children: t(`whyitem.${i}.title`)
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm leading-relaxed text-muted-foreground",
							children: t(`whyitem.${i}.detail`)
						})] })]
					})
				}, item.title))
			})] })]
		})
	});
}
function DoctorAvailability({ doctor }) {
	const { requests } = useClinicStore();
	const { t } = useI18n();
	const { lang } = useI18n();
	const [days, setDays] = useState(null);
	useEffect(() => setDays(upcomingAvailability(doctor, 2, /* @__PURE__ */ new Date(), requests, lang === "ar" ? "ar" : "en-US")), [
		doctor,
		requests,
		lang
	]);
	if (!days) return /* @__PURE__ */ jsx("div", { className: "mt-4 h-[74px] animate-pulse rounded-xl bg-muted/60" });
	if (days.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "mt-4 rounded-xl bg-muted/60 px-3 py-3 text-xs text-muted-foreground",
		children: t("availability.fullyBooked")
	});
	return /* @__PURE__ */ jsx("div", {
		className: "mt-4 space-y-2 rounded-xl bg-muted/50 p-3",
		children: days.map((day) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-semibold text-foreground",
					children: [
						t(`day.${day.dayLabel}`),
						" ",
						day.dateLabel
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[11px] text-muted-foreground",
					children: [
						day.openCount,
						" ",
						t("availability.slotsOpen")
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 gap-1",
				children: day.slots.map((slot) => /* @__PURE__ */ jsx(Link, {
					to: "/book",
					search: { doctor: doctor.id },
					className: "rounded-md bg-background px-1.5 py-1 text-[11px] font-medium text-primary shadow-card transition-colors hover:bg-primary hover:text-primary-foreground",
					children: slot
				}, slot))
			})]
		}, day.dateISO))
	});
}
function DoctorCard({ doctor, index = 0, detailed = false }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Reveal, {
		delay: index % 3 * .06,
		children: /* @__PURE__ */ jsxs("article", {
			className: "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-raised",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex h-36 items-end justify-between bg-primary/8 p-5",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid size-16 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground",
					children: doctor.initials
				}), /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-card",
					children: [/* @__PURE__ */ jsx(Star, { className: "size-3 fill-warning text-warning" }), doctor.rating.toFixed(1)]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col p-5",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold",
						children: t(`doc.${doctor.id}.name`)
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-primary",
						children: t(`doc.${doctor.id}.spec`)
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: t(`doc.${doctor.id}.bio`)
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: doctor.tags.map((tag, j) => /* @__PURE__ */ jsx("span", {
							className: "rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary",
							children: t(`doc.${doctor.id}.tag.${j}`)
						}, tag))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx(PawPrint, {
								className: "size-3.5 text-muted-foreground",
								"aria-hidden": true
							}),
							/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: t("availability.treats")
							}),
							doctor.pets.map((pet) => /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
								children: t(`animal.${pet}`)
							}, pet))
						]
					}),
					detailed ? /* @__PURE__ */ jsx(DoctorAvailability, { doctor }) : /* @__PURE__ */ jsx("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: doctor.days.map((d) => /* @__PURE__ */ jsx("span", {
							className: "rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground",
							children: t(`day.${d}`)
						}, d))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex items-center justify-between pt-1",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-muted-foreground",
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
		})
	});
}
function BookingTimeline() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("section", {
		className: "border-y border-border bg-surface py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				center: true,
				eyebrow: t("booking.eyebrow"),
				title: t("timeline.title"),
				description: t("timeline.desc")
			}), /* @__PURE__ */ jsx("ol", {
				className: "mt-14 grid gap-8 md:grid-cols-5",
				children: BOOKING_STEPS.map((step, i) => /* @__PURE__ */ jsx(Reveal, {
					delay: i * .08,
					children: /* @__PURE__ */ jsxs("li", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 md:block",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid size-10 place-items-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary",
									children: i + 1
								}), /* @__PURE__ */ jsx("span", { className: "hidden md:absolute md:left-10 md:top-5 md:block md:h-px md:w-[calc(100%-2.5rem)] md:bg-border" })]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "mt-4 text-sm font-semibold",
								children: t(`step.${i}.title`)
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
								children: t(`step.${i}.detail`)
							})
						]
					})
				}, step.title))
			})]
		})
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
		const id = window.setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5e3);
		return () => window.clearInterval(id);
	}, [paused, testimonials.length]);
	const item = testimonials[active] ?? testimonials[0];
	if (!item) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-6xl px-5 py-20 sm:px-8",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: () => setPaused(false),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsx(SectionHeading, {
					center: true,
					eyebrow: "GOOGLE REVIEWS",
					title: t("testimonials.title")
				}), /* @__PURE__ */ jsxs("div", {
					className: "mb-1 flex items-center gap-2 text-sm text-amber-600",
					children: [
						/* @__PURE__ */ jsx(Star, { className: "size-4 fill-amber-400 text-amber-400" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-bold",
							children: item.rating.toFixed(1)
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: t("reviews.count")
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("figure", {
				className: "mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-12",
				children: [
					/* @__PURE__ */ jsx(Quote, { className: "mx-auto size-8 text-primary/30" }),
					/* @__PURE__ */ jsxs(motion.blockquote, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .4,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: "mt-6 text-lg leading-relaxed text-foreground sm:text-xl",
						children: [
							"\"",
							item.comment,
							"\""
						]
					}, active),
					/* @__PURE__ */ jsxs("figcaption", {
						className: "mt-8",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-center gap-0.5",
								children: Array.from({ length: item.rating }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: "size-4 fill-warning text-warning" }, i))
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 text-sm font-semibold text-foreground",
								children: item.author
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: t("reviews.googleSource")
							})
						]
					})
				]
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 flex justify-center gap-2",
				children: testimonials.map((review, i) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActive(i),
					"aria-label": `${t("testimonials.eyebrow")} ${i + 1}`,
					"aria-current": i === active,
					className: i === active ? "h-1.5 w-8 rounded-full bg-primary transition-all" : "h-1.5 w-3 rounded-full bg-border transition-all hover:bg-muted-foreground"
				}, review.id))
			})
		]
	});
}
function Faq() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("section", {
		className: "border-t border-border bg-surface py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-5 sm:px-8",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				center: true,
				eyebrow: t("faq.eyebrow"),
				title: t("faq.title")
			}), /* @__PURE__ */ jsx(Accordion, {
				type: "single",
				collapsible: true,
				className: "mt-10 w-full",
				children: FAQS.map((faq, i) => /* @__PURE__ */ jsxs(AccordionItem, {
					value: `item-${i}`,
					children: [/* @__PURE__ */ jsx(AccordionTrigger, {
						className: "text-left text-base font-semibold hover:no-underline",
						children: t(`faq.${i}.q`)
					}), /* @__PURE__ */ jsx(AccordionContent, {
						className: "text-sm leading-relaxed text-muted-foreground",
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
		className: "mx-auto max-w-6xl px-5 py-20 sm:px-8",
		children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", {
			className: "relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center shadow-lg sm:px-16",
			children: [
				/* @__PURE__ */ jsx("div", { className: "hero-gradient absolute inset-0" }),
				/* @__PURE__ */ jsx(AmbientGlobs, { className: "opacity-70" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsxs("h2", {
							className: "text-3xl font-bold sm:text-4xl",
							children: [
								t("cta.title.a"),
								" ",
								/* @__PURE__ */ jsx(GradientText, {
									className: "font-bold",
									animationSpeed: 6,
									children: t("cta.title.b")
								}),
								" ",
								t("cta.title.c")
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground",
							children: t("cta.subtitle")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								className: "shadow-glow",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/book",
									children: [t("cta.book"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ jsx("a", {
									href: telHref(settings.emergency) ?? void 0,
									children: t("cta.call", { phone: settings.emergency })
								})
							})]
						})
					]
				})
			]
		}) })
	});
}
//#endregion
export { Hero as a, Testimonials as c, Faq as i, WhyUs as l, CtaBand as n, SectionHeading as o, DoctorCard as r, ServicesGrid as s, BookingTimeline as t, clinic_interior_default as u };
