import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { i as getCookie } from "./server-DBhxmfzs.js";
import { c as storageGet, d as Button, f as I18nProvider, g as cn, h as readLangCookie, l as storageRemove, m as useI18n, p as LanguageToggle, s as SESSION_KEY, t as api, u as storageSet } from "./api-Bx9sNaAQ.js";
import { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useLocation, useRouteContext, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarHeart, Heart, LayoutDashboard, Menu, Minus, Moon, PawPrint, Phone, Plus, ShoppingBag, Sparkles, Sun, Trash2, X } from "lucide-react";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-Dmoawe3o.css";
//#endregion
//#region src/components/PawMMark.tsx
/**
* The Paw-M mark: a single continuous line that reads as a pulse/heartbeat
* and resolves into a paw at its peak. Used in the intro line-draw animation,
* the header and the footer.
*/
function PawMMark({ className, animated = false }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 64 64",
		fill: "none",
		className: cn("h-8 w-8", className),
		"aria-hidden": "true",
		role: "presentation",
		children: [
			/* @__PURE__ */ jsx("path", {
				d: "M4 42h9l5-11 6 20 5-15 4 6h6",
				stroke: "currentColor",
				strokeWidth: "3.5",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				pathLength: 1,
				className: animated ? "pawm-draw" : void 0
			}),
			/* @__PURE__ */ jsxs("g", {
				fill: "currentColor",
				className: animated ? "pawm-pads" : void 0,
				children: [
					/* @__PURE__ */ jsx("ellipse", {
						cx: "43.5",
						cy: "20",
						rx: "3.1",
						ry: "4.2"
					}),
					/* @__PURE__ */ jsx("ellipse", {
						cx: "52",
						cy: "16.5",
						rx: "3.1",
						ry: "4.4"
					}),
					/* @__PURE__ */ jsx("ellipse", {
						cx: "60",
						cy: "21",
						rx: "2.9",
						ry: "4"
					})
				]
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z",
				fill: "currentColor",
				className: animated ? "pawm-pads" : void 0
			})
		]
	});
}
function PawMLogo({ className }) {
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ jsx(PawMMark, { className: "h-7 w-7 text-primary" }), /* @__PURE__ */ jsx("span", {
			className: "text-[20px] font-bold tracking-[-0.03em] text-foreground",
			children: "Paw-M"
		})]
	});
}
//#endregion
//#region src/components/IntroAnimation.tsx
var MAX_DURATION = 900;
function IntroAnimation() {
	const reduceMotion = useReducedMotion();
	const reduceRef = useRef(reduceMotion);
	reduceRef.current = reduceMotion;
	const { t } = useI18n();
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showSkip, setShowSkip] = useState(false);
	useEffect(() => {
		setVisible(true);
		const start = performance.now();
		const total = reduceRef.current ? 400 : MAX_DURATION;
		let raf = 0;
		let fontsDone = false;
		document.fonts?.ready.then(() => {
			fontsDone = true;
		});
		const tick = () => {
			const elapsed = performance.now() - start;
			const timed = Math.min(1, elapsed / total);
			const eased = 1 - Math.pow(1 - timed, 3);
			setProgress(fontsDone ? Math.max(eased, Math.min(1, elapsed / (total * .75))) : eased);
			if (elapsed >= total) finish();
			else raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		const skipTimer = window.setTimeout(() => setShowSkip(true), 500);
		function finish() {
			cancelAnimationFrame(raf);
			window.clearTimeout(skipTimer);
			setVisible(false);
			window.removeEventListener("keydown", finish);
			window.removeEventListener("pointerdown", finish);
		}
		window.addEventListener("keydown", finish);
		window.addEventListener("pointerdown", finish);
		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(skipTimer);
			window.removeEventListener("keydown", finish);
			window.removeEventListener("pointerdown", finish);
		};
	}, []);
	const ease = [
		.16,
		1,
		.3,
		1
	];
	return /* @__PURE__ */ jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-background",
		initial: { opacity: 1 },
		exit: reduceMotion ? { opacity: 0 } : {
			opacity: 0,
			scale: .96
		},
		transition: {
			duration: reduceMotion ? .15 : .25,
			ease
		},
		role: "status",
		"aria-label": t("intro.loadingAria"),
		children: [
			/* @__PURE__ */ jsx("div", { className: "hero-gradient absolute inset-0" }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative flex flex-col items-center gap-5 px-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx(motion.div, {
							initial: reduceMotion ? { opacity: 0 } : {
								opacity: 0,
								scale: .9
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							transition: {
								duration: .5,
								ease,
								delay: .05
							},
							className: "text-primary",
							children: /* @__PURE__ */ jsx(IntroMark, { reduceMotion: !!reduceMotion })
						}), /* @__PURE__ */ jsx(motion.span, {
							initial: reduceMotion ? { opacity: 0 } : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .45,
								ease,
								delay: reduceMotion ? .05 : .5
							},
							className: "text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl",
							children: "Paw-M"
						})]
					}),
					/* @__PURE__ */ jsx(motion.p, {
						initial: {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .4,
							ease,
							delay: reduceMotion ? .1 : .62
						},
						className: "text-sm text-muted-foreground",
						children: t("intro.tagline")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-2 h-[2px] w-52 overflow-hidden rounded-full bg-border",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full rounded-full bg-primary transition-[width] duration-100 ease-linear",
							style: { width: `${Math.round(progress * 100)}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: showSkip && /* @__PURE__ */ jsx(motion.span, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "absolute bottom-8 text-xs tracking-wide text-muted-foreground",
				children: t("intro.skip")
			}) })
		]
	}, "paw-m-intro") });
}
function IntroMark({ reduceMotion }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 64 64",
		className: "h-14 w-14 sm:h-16 sm:w-16",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx(motion.path, {
			d: "M4 42h9l5-11 6 20 5-15 4 6h6",
			stroke: "currentColor",
			strokeWidth: "3.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			initial: reduceMotion ? {
				pathLength: 1,
				opacity: 1
			} : {
				pathLength: 0,
				opacity: 1
			},
			animate: { pathLength: 1 },
			transition: {
				duration: reduceMotion ? 0 : .6,
				ease: [
					.16,
					1,
					.3,
					1
				]
			}
		}), /* @__PURE__ */ jsxs(motion.g, {
			fill: "currentColor",
			initial: reduceMotion ? { opacity: 1 } : {
				opacity: 0,
				scale: .7
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			style: { transformOrigin: "52px 28px" },
			transition: {
				duration: .4,
				delay: reduceMotion ? 0 : .45,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			children: [
				/* @__PURE__ */ jsx("ellipse", {
					cx: "43.5",
					cy: "20",
					rx: "3.1",
					ry: "4.2"
				}),
				/* @__PURE__ */ jsx("ellipse", {
					cx: "52",
					cy: "16.5",
					rx: "3.1",
					ry: "4.4"
				}),
				/* @__PURE__ */ jsx("ellipse", {
					cx: "60",
					cy: "21",
					rx: "2.9",
					ry: "4"
				}),
				/* @__PURE__ */ jsx("path", { d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z" })
			]
		})]
	});
}
//#endregion
//#region src/lib/clinic-data.ts
var CLINIC = {
	name: "Paw Clinic Madinaty",
	tagline: "Veterinary care with love, under the care of Dr. Mirna.",
	phone: "012 10105624",
	emergency: "012 10105624",
	whatsapp: "012 10105624",
	email: "paw.mclinic@gmail.com",
	address: "Craft Zoon, Second New Cairo, Cairo Governorate 19519",
	currency: "EGP",
	instapay: "",
	hours: [
		{
			day: "Tuesday (Mawlid)",
			time: "09:00 – 23:30",
			note: "Holiday hours"
		},
		{
			day: "Wednesday (Mawlid)",
			time: "09:00 – 23:30",
			note: "Holiday hours"
		},
		{
			day: "Thursday",
			time: "09:00 – 23:30"
		},
		{
			day: "Friday",
			time: "09:00 – 23:30"
		},
		{
			day: "Saturday",
			time: "09:00 – 23:30"
		},
		{
			day: "Sunday",
			time: "09:00 – 23:30"
		},
		{
			day: "Monday",
			time: "09:00 – 23:30"
		}
	]
};
var STATS = [
	{
		value: 5e3,
		suffix: "+",
		label: "Pets under our care"
	},
	{
		value: 14,
		suffix: "",
		label: "Licensed veterinarians"
	},
	{
		value: 24,
		suffix: "/7",
		label: "Emergency availability"
	},
	{
		value: 98,
		suffix: "%",
		label: "Owner satisfaction"
	}
];
var SERVICES = [
	{
		slug: "general-checkup",
		icon: "Stethoscope",
		title: "General Checkup",
		description: "Full physical exams with a written wellness plan after every visit."
	},
	{
		slug: "vaccination",
		icon: "Syringe",
		title: "Vaccination",
		description: "Core and lifestyle vaccines, tracked with automatic due-date reminders."
	},
	{
		slug: "surgery",
		icon: "Scissors",
		title: "Surgery",
		description: "Soft tissue and orthopaedic procedures in a dedicated sterile theatre."
	},
	{
		slug: "emergency",
		icon: "Siren",
		title: "Emergency Care",
		description: "Triage within minutes, any hour, with on-call critical care staff."
	},
	{
		slug: "laboratory",
		icon: "FlaskConical",
		title: "Laboratory",
		description: "In-house bloodwork and cytology with same-visit results."
	},
	{
		slug: "dental",
		icon: "Sparkles",
		title: "Dental Care",
		description: "Scaling, polishing and extractions under monitored anaesthesia."
	},
	{
		slug: "pharmacy",
		icon: "Pill",
		title: "Pharmacy",
		description: "Dispensed on site, dosage verified against your pet's chart."
	},
	{
		slug: "grooming",
		icon: "Bath",
		title: "Grooming",
		description: "Medicated baths and coat care supervised by clinical staff."
	},
	{
		slug: "nutrition",
		icon: "Salad",
		title: "Nutrition",
		description: "Weight and diet programmes built around measurable targets."
	},
	{
		slug: "x-ray",
		icon: "ScanLine",
		title: "Digital X-Ray",
		description: "Low-dose digital radiography read within the same appointment."
	},
	{
		slug: "ultrasound",
		icon: "Activity",
		title: "Ultrasound",
		description: "Abdominal and cardiac imaging performed by certified sonographers."
	},
	{
		slug: "records",
		icon: "FolderHeart",
		title: "Digital Records",
		description: "Every visit, result and prescription in one shareable history."
	}
];
var WHY_US = [
	{
		title: "Experienced veterinarians",
		detail: "An average of 12 years in practice, with board certifications across five specialties."
	},
	{
		title: "Modern equipment",
		detail: "Digital radiography, in-house diagnostics and monitored anaesthesia as standard."
	},
	{
		title: "Transparent pricing",
		detail: "Written estimates before treatment begins. No line item you haven't approved."
	},
	{
		title: "Emergency services",
		detail: "A staffed critical care team on the floor, not a redirected answering service."
	},
	{
		title: "Personalised treatment",
		detail: "Care plans built around your pet's age and history — not a template."
	},
	{
		title: "Digital medical records",
		detail: "Your pet's complete chart, available to you and any clinic you choose."
	}
];
var DOCTORS = [{
	id: "dr-mirna",
	name: "Dr. Mirna",
	specialization: "Veterinarian",
	experience: "Experienced veterinarian",
	rating: 4.9,
	days: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	bio: "Experienced veterinarian trusted by pet owners across Madinaty, known for gentle handling, thorough diagnosis and follow-up care.",
	initials: "DM",
	tags: [
		"Veterinary Consultation",
		"Surgery",
		"Spaying & Neutering",
		"Dental Care",
		"Exotics"
	],
	pets: [
		"Dog",
		"Cat",
		"Bird",
		"Rabbit",
		"Reptile"
	]
}];
var CLINIC_REVIEWS = [
	{
		author: "Mariem Mahmoud",
		rating: 5,
		comment: "Had such a great experience with Dr. Mirna. She was so kind and patient with my cat, and took her time to check him and explain everything."
	},
	{
		author: "Rim Ibrahim",
		rating: 5,
		comment: "The most amazing service and products."
	},
	{
		author: "Ahmed Eng",
		rating: 5,
		comment: "Very nice new admin. Nice treat and service."
	},
	{
		author: "Marina Emad",
		rating: 5,
		comment: "Perfect hospitality for my dog when I was out of my country, and every product I need for my dog is available at their shop."
	},
	{
		author: "Nahla Sherif",
		rating: 5,
		comment: "My cat had a critical case of bladder blockage and Dr. Mirna was really professional in diagnosing the case and following up with me every day."
	},
	{
		author: "Adam Agha",
		rating: 5,
		comment: "Dr. Mirna is very respectful, professional, and experienced. I took my cat for a neutering procedure based on a recommendation from a friend."
	},
	{
		author: "Aziz Ali",
		rating: 5,
		comment: "The clinic is absolutely fantastic, and the doctor is lovely and does a great job."
	},
	{
		author: "Nehal Nasef",
		rating: 5,
		comment: "My favorite vet and pet clinic. They are professional and I highly recommend them to anyone."
	},
	{
		author: "Hatem El Mandarawi",
		rating: 5,
		comment: "Amazing clinic, very professional and extremely caring. After a surgery, the team kept checking in to make sure everything was fine."
	},
	{
		author: "Marian Tadros",
		rating: 5,
		comment: "One of the most comfortable pet clinics I've ever been to. Dr. Mirna is a very skilled doctor."
	}
];
var BOOKING_STEPS = [
	{
		title: "Choose a date",
		detail: "Live availability across every clinician."
	},
	{
		title: "Pick a time",
		detail: "Booked slots disappear as you look."
	},
	{
		title: "Tell us about your pet",
		detail: "Species, age, weight, history."
	},
	{
		title: "Describe the case",
		detail: "Symptoms, medications, allergies."
	},
	{
		title: "Confirm",
		detail: "Summary, calendar invite and reminders."
	}
];
var FAQS = [
	{
		q: "Do you take walk-in emergencies?",
		a: "Yes. Our emergency line is staffed 24/7 and our triage team assesses every walk-in on arrival. Life-threatening cases are always seen first, ahead of scheduled appointments."
	},
	{
		q: "How far in advance should I book a routine visit?",
		a: "Most routine appointments are available within 48 hours. Specialist consultations — dermatology, dentistry, exotics — usually book five to seven days out."
	},
	{
		q: "Can I transfer my pet's records from another clinic?",
		a: "Absolutely. Send us your previous clinic's details when you book and we'll request the full history, then merge it into your pet's digital chart before the first visit."
	},
	{
		q: "What payment methods do you accept?",
		a: "All major cards, bank transfer and most pet insurance providers via direct billing. Written estimates are provided before any procedure begins."
	},
	{
		q: "Do you treat animals other than cats and dogs?",
		a: "Yes — rabbits, ferrets, guinea pigs, reptiles and birds are all seen by our exotics team, with species-specific handling and anaesthesia protocols."
	},
	{
		q: "How do vaccination reminders work?",
		a: "Every vaccine is logged with its due date. You'll get a reminder 30 days, 7 days and 1 day before it lapses, by email or WhatsApp — whichever you prefer."
	}
];
var ANIMAL_TYPES = [
	"Dog",
	"Cat",
	"Other"
];
var TIME_SLOTS = [
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30"
];
/** Deterministic pseudo-booked slots so the picker feels alive without a backend yet. */
function bookedSlotsFor(dateISO, doctorId, confirmed) {
	let seed = 0;
	const key = `${dateISO}|${doctorId}`;
	for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) % 1e5;
	const pseudo = TIME_SLOTS.filter((_, i) => (seed >> i % 12) % 3 === 0);
	const real = new Set((confirmed ?? []).filter((b) => b.date === dateISO && b.doctorId === doctorId).map((b) => b.time));
	return [.../* @__PURE__ */ new Set([...pseudo, ...real])];
}
var DAY_ORDER = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
/**
* Next `count` working days for a doctor, with the first open slots on each.
* Uses the same deterministic pseudo-booking source as the booking picker, plus
* any real non-cancelled requests so the public availability matches the dashboard.
*/
function upcomingAvailability(doctor, count = 3, from = /* @__PURE__ */ new Date(), confirmed, locale = "en-US") {
	const out = [];
	const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	const realBookings = (confirmed ?? []).filter((c) => c.status !== "cancelled" && c.status !== "completed");
	for (let i = 0; i < 30 && out.length < count; i++) {
		cursor.setDate(cursor.getDate() + 1);
		const dayLabel = DAY_ORDER[cursor.getDay()];
		if (!doctor.days.includes(dayLabel)) continue;
		const dateISO = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
		const booked = new Set(bookedSlotsFor(dateISO, doctor.id, realBookings));
		const open = TIME_SLOTS.filter((t) => !booked.has(t));
		if (open.length === 0) continue;
		out.push({
			dateISO,
			dayLabel,
			dateLabel: cursor.toLocaleDateString(locale, {
				month: "short",
				day: "numeric"
			}),
			openCount: open.length,
			slots: open.slice(0, 3)
		});
	}
	return out;
}
ANIMAL_TYPES.filter((a) => DOCTORS.some((d) => d.pets.includes(a)));
//#endregion
//#region src/lib/sanitize.ts
/** Strip anything that is not a valid dialable phone character. */
function sanitizePhone(raw) {
	return raw.replace(/[^\d+()\-\s]/g, "").trim();
}
/** Strip everything except digits (used for wa.me links). */
function sanitizeWhatsapp(raw) {
	return raw.replace(/\D/g, "");
}
var EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
/** Normalize + validate an email address; returns `null` when invalid. */
function sanitizeEmail(raw) {
	const email = raw.trim().toLowerCase();
	return EMAIL_RE.test(email) ? email : null;
}
/**
* Build a safe `tel:` href. Returns null when the input contains no dialable
* characters, guarding against `javascript:` or control-char injection.
*/
function telHref(phone) {
	const digits = sanitizePhone(phone);
	if (!digits) return null;
	return `tel:${digits}`;
}
/** Build a safe `mailto:` href, or null when the email is invalid. */
function mailtoHref(email) {
	const clean = sanitizeEmail(email);
	return clean ? `mailto:${clean}` : null;
}
/** Build a safe `https://wa.me/` href, or null when no digits exist. */
function waMeHref(whatsapp) {
	const digits = sanitizeWhatsapp(whatsapp);
	if (!digits) return null;
	return `https://wa.me/${digits}`;
}
//#endregion
//#region src/lib/auth.ts
var SESSION_TTL_MS = 288e5;
async function isAuthConfigured() {
	try {
		return (await api.get("/auth/config")).configured;
	} catch {
		return false;
	}
}
/** Create the staff account on first run. Throws if one already exists. */
async function register(username, password) {
	const name = username.trim();
	if (name.length < 3) throw new Error(`Username must be at least 3 characters.`);
	if (password.length < 6) throw new Error(`Password must be at least 6 characters.`);
	await api.post("/auth/register", {
		username: name,
		password
	});
}
/** Sign in with staff credentials; opens a session on success. */
async function login(username, password) {
	try {
		const r = await api.post("/auth/login", {
			username: username.trim(),
			password
		});
		if (!r.ok) return false;
		const session = {
			username: username.trim(),
			role: r.role ?? "staff",
			expiresAt: Date.now() + SESSION_TTL_MS
		};
		storageSet("session", SESSION_KEY, JSON.stringify(session));
		return true;
	} catch {
		return false;
	}
}
/** Change the staff username and/or password. Throws if the current password is wrong. */
async function changeCredentials(input) {
	const { currentPassword, newUsername, newPassword } = input;
	if (newUsername !== void 0 && newUsername.trim().length < 3) throw new Error(`Username must be at least 3 characters.`);
	if (newPassword !== void 0 && newPassword.length < 6) throw new Error(`Password must be at least 6 characters.`);
	await api.put("/auth/credentials", {
		currentPassword,
		newUsername: newUsername?.trim() || void 0,
		newPassword
	});
}
/** @deprecated Lockout removed — always returns 0 */
function remainingLockMs() {
	return 0;
}
function readSession() {
	const raw = storageGet("session", SESSION_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed.username === "string" && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now()) return parsed;
		return null;
	} catch {
		return null;
	}
}
function currentUsername() {
	return readSession()?.username ?? "";
}
function currentRole() {
	return readSession()?.role ?? "staff";
}
function isAuthed() {
	return readSession() !== null;
}
async function logout() {
	try {
		await api.post("/auth/logout");
	} catch {}
	storageRemove("session", SESSION_KEY);
}
//#endregion
//#region src/lib/clinic-store.ts
var QUERY_KEYS = {
	doctors: ["doctors"],
	services: ["services"],
	products: ["products"],
	bookings: ["bookings"],
	orders: ["orders"],
	reviews: ["reviews"],
	payments: ["payments"],
	settings: ["settings"],
	workSession: ["work-session"],
	auditLogs: ["audit-logs"],
	workDays: ["work-days"]
};
var seedDefaults = {
	doctors: DOCTORS,
	services: SERVICES,
	reviews: CLINIC_REVIEWS.map((review, index) => ({
		...review,
		id: `clinic-review-${index + 1}`,
		productId: "clinic",
		status: "approved",
		createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
	})),
	settings: { ...CLINIC },
	requests: [],
	products: [],
	orders: [],
	payments: [],
	auditLogs: [],
	workDays: []
};
function seed() {
	return {
		requests: [],
		doctors: DOCTORS,
		services: SERVICES,
		products: [],
		orders: [],
		reviews: CLINIC_REVIEWS.map((review, index) => ({
			...review,
			id: `clinic-review-${index + 1}`,
			productId: "clinic",
			status: "approved",
			createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
		})),
		payments: [],
		settings: { ...CLINIC },
		workSession: null,
		auditLogs: [],
		workDays: [],
		workDay: null
	};
}
var queryClientInstance = null;
function getQc() {
	return queryClientInstance;
}
function invalidate(key) {
	getQc()?.invalidateQueries({
		queryKey: key,
		exact: true
	});
}
function useClinicStore() {
	queryClientInstance = useQueryClient();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	const { data: doctors = seedDefaults.doctors } = useQuery({
		queryKey: QUERY_KEYS.doctors,
		queryFn: () => api.get("/doctors"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.doctors,
		enabled: mounted
	});
	const { data: services = seedDefaults.services } = useQuery({
		queryKey: QUERY_KEYS.services,
		queryFn: () => api.get("/services"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.services,
		enabled: mounted
	});
	const { data: products = seedDefaults.products } = useQuery({
		queryKey: QUERY_KEYS.products,
		queryFn: () => api.get("/products"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.products,
		enabled: mounted
	});
	const { data: requests = seedDefaults.requests } = useQuery({
		queryKey: QUERY_KEYS.bookings,
		queryFn: () => api.get("/bookings"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.requests,
		enabled: mounted && isAuthed()
	});
	const { data: orders = seedDefaults.orders } = useQuery({
		queryKey: QUERY_KEYS.orders,
		queryFn: () => api.get("/orders"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.orders,
		enabled: mounted && isAuthed()
	});
	const { data: reviews = seedDefaults.reviews } = useQuery({
		queryKey: QUERY_KEYS.reviews,
		queryFn: () => api.get("/reviews"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.reviews,
		enabled: mounted
	});
	const { data: payments = seedDefaults.payments } = useQuery({
		queryKey: QUERY_KEYS.payments,
		queryFn: () => api.get("/payments"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.payments,
		enabled: mounted && isAuthed()
	});
	const { data: settings = seedDefaults.settings } = useQuery({
		queryKey: QUERY_KEYS.settings,
		queryFn: () => api.get("/settings"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.settings,
		enabled: mounted
	});
	const { data: workSession = null } = useQuery({
		queryKey: QUERY_KEYS.workSession,
		queryFn: () => api.get("/work-session"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? null,
		enabled: mounted && isAuthed()
	});
	const { data: auditLogs = seedDefaults.auditLogs } = useQuery({
		queryKey: QUERY_KEYS.auditLogs,
		queryFn: () => api.get("/audit-logs"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.auditLogs,
		enabled: mounted && isAuthed()
	});
	const { data: workDays = seedDefaults.workDays } = useQuery({
		queryKey: QUERY_KEYS.workDays,
		queryFn: () => api.get("/work-days"),
		staleTime: Infinity,
		placeholderData: (prev) => prev ?? seedDefaults.workDays,
		enabled: mounted && isAuthed()
	});
	const { data: workDay } = useQuery({
		queryKey: ["work-day"],
		queryFn: () => api.get("/work-days/today"),
		staleTime: Infinity,
		enabled: false
	});
	return useMemo(() => ({
		requests,
		doctors,
		services,
		products,
		orders,
		reviews,
		payments,
		settings,
		workSession,
		auditLogs,
		workDays,
		workDay: workDay ?? null
	}), [
		requests,
		doctors,
		services,
		products,
		orders,
		reviews,
		payments,
		settings,
		workSession,
		auditLogs,
		workDays,
		workDay
	]);
}
/** Refreshes all clinic data from the backend (no-op while one is in flight). */
function refreshClinicData() {
	invalidate(QUERY_KEYS.bookings);
	invalidate(QUERY_KEYS.doctors);
	invalidate(QUERY_KEYS.services);
	invalidate(QUERY_KEYS.products);
	invalidate(QUERY_KEYS.orders);
	invalidate(QUERY_KEYS.reviews);
	invalidate(QUERY_KEYS.payments);
	invalidate(QUERY_KEYS.settings);
	invalidate(QUERY_KEYS.workSession);
	invalidate(QUERY_KEYS.auditLogs);
	invalidate(QUERY_KEYS.workDays);
}
async function refreshPublicData() {
	invalidate(QUERY_KEYS.settings);
	invalidate(QUERY_KEYS.doctors);
	invalidate(QUERY_KEYS.services);
	invalidate(QUERY_KEYS.products);
	invalidate(QUERY_KEYS.reviews);
}
async function addBookingRequest(input) {
	try {
		await api.post("/bookings", {
			...input,
			status: "pending",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		invalidate(QUERY_KEYS.bookings);
		return get();
	} catch (err) {
		console.error("Failed to add booking", err);
		throw err;
	}
}
async function setBookingStatus(id, status) {
	try {
		await api.patch(`/bookings/${id}/status`, { status });
		invalidate(QUERY_KEYS.bookings);
	} catch (err) {
		console.error("Failed to update booking status", err);
		throw err;
	}
}
async function deleteRequest(id) {
	try {
		await api.delete(`/bookings/${id}`);
		invalidate(QUERY_KEYS.bookings);
	} catch (err) {
		console.error("Failed to delete booking", err);
		throw err;
	}
}
async function archiveBooking(id, archived) {
	try {
		await api.patch(`/bookings/${id}/archive`, { archived });
		invalidate(QUERY_KEYS.bookings);
	} catch (err) {
		console.error("Failed to archive booking", err);
		throw err;
	}
}
async function saveDoctor(doctor) {
	try {
		(getQc()?.getQueryData(QUERY_KEYS.doctors) ?? DOCTORS).some((d) => d.id === doctor.id) ? await api.patch(`/doctors/${doctor.id}`, doctor) : await api.post("/doctors", doctor);
		invalidate(QUERY_KEYS.doctors);
	} catch (err) {
		console.error("Failed to save doctor", err);
		throw err;
	}
}
async function deleteDoctor(id) {
	try {
		await api.delete(`/doctors/${id}`);
		invalidate(QUERY_KEYS.doctors);
	} catch (err) {
		console.error("Failed to delete doctor", err);
		throw err;
	}
}
async function saveService(service) {
	try {
		(getQc()?.getQueryData(QUERY_KEYS.services) ?? SERVICES).some((sv) => sv.slug === service.slug) ? await api.patch(`/services/${service.slug}`, service) : await api.post("/services", service);
		invalidate(QUERY_KEYS.services);
	} catch (err) {
		console.error("Failed to save service", err);
		throw err;
	}
}
async function deleteService(slug) {
	try {
		await api.delete(`/services/${slug}`);
		invalidate(QUERY_KEYS.services);
	} catch (err) {
		console.error("Failed to delete service", err);
		throw err;
	}
}
async function saveProduct(product) {
	try {
		(getQc()?.getQueryData(QUERY_KEYS.products) ?? []).some((p) => p.id === product.id) ? await api.patch(`/products/${product.id}`, product) : await api.post("/products", product);
		invalidate(QUERY_KEYS.products);
	} catch (err) {
		console.error("Failed to save product", err);
		throw err;
	}
}
async function deleteProduct(id) {
	try {
		await api.delete(`/products/${id}`);
		invalidate(QUERY_KEYS.products);
	} catch (err) {
		console.error("Failed to delete product", err);
		throw err;
	}
}
async function createOrder(input) {
	try {
		const created = await api.post("/orders", input);
		invalidate(QUERY_KEYS.orders);
		return created;
	} catch (err) {
		console.error("Failed to create order", err);
		throw err;
	}
}
async function trackOrder(orderId, phone) {
	return api.get(`/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
}
async function submitPaymentProof(id, proof) {
	try {
		const updated = await api.post(`/orders/${id}/payment-proof`, proof);
		invalidate(QUERY_KEYS.orders);
		return updated;
	} catch (err) {
		console.error("Failed to submit payment proof", err);
		throw err;
	}
}
async function setOrderPaymentStatus(id, paymentStatus) {
	try {
		await api.patch(`/orders/${id}/payment`, { paymentStatus });
		invalidate(QUERY_KEYS.orders);
	} catch (err) {
		console.error("Failed to update order payment status", err);
		throw err;
	}
}
async function setOrderStatus(id, status) {
	try {
		await api.patch(`/orders/${id}/status`, { status });
		invalidate(QUERY_KEYS.orders);
	} catch (err) {
		console.error("Failed to update order status", err);
		throw err;
	}
}
async function deleteOrder(id) {
	try {
		await api.delete(`/orders/${id}`);
		invalidate(QUERY_KEYS.orders);
	} catch (err) {
		console.error("Failed to delete order", err);
		throw err;
	}
}
async function archiveOrder(id, archived) {
	try {
		await api.patch(`/orders/${id}/archive`, { archived });
		invalidate(QUERY_KEYS.orders);
	} catch (err) {
		console.error("Failed to archive order", err);
		throw err;
	}
}
async function createReview(input) {
	try {
		const created = await api.post("/reviews", input);
		invalidate(QUERY_KEYS.reviews);
		return created;
	} catch (err) {
		console.error("Failed to create review", err);
		throw err;
	}
}
async function setReviewStatus(id, status) {
	try {
		await api.patch(`/reviews/${id}`, { status });
		invalidate(QUERY_KEYS.reviews);
	} catch (err) {
		console.error("Failed to update review", err);
		throw err;
	}
}
async function deleteReview(id) {
	try {
		await api.delete(`/reviews/${id}`);
		invalidate(QUERY_KEYS.reviews);
	} catch (err) {
		console.error("Failed to delete review", err);
		throw err;
	}
}
async function syncGoogleReviews(placeId) {
	try {
		const data = await api.post("/google/sync-reviews", placeId ? { placeId } : void 0);
		invalidate(QUERY_KEYS.reviews);
		return data;
	} catch (err) {
		console.error("Failed to sync Google reviews", err);
		throw err;
	}
}
async function createPayment(input) {
	try {
		const created = await api.post("/payments", input);
		invalidate(QUERY_KEYS.payments);
		return created;
	} catch (err) {
		console.error("Failed to create payment", err);
		throw err;
	}
}
async function updatePayment(id, patch) {
	try {
		const updated = await api.patch(`/payments/${id}`, patch);
		invalidate(QUERY_KEYS.payments);
		return updated;
	} catch (err) {
		console.error("Failed to update payment", err);
		throw err;
	}
}
async function deletePayment(id) {
	try {
		await api.delete(`/payments/${id}`);
		invalidate(QUERY_KEYS.payments);
	} catch (err) {
		console.error("Failed to delete payment", err);
		throw err;
	}
}
async function updateSettings(patch) {
	const clean = { ...patch };
	if (patch.phone !== void 0) clean.phone = sanitizePhone(patch.phone);
	if (patch.emergency !== void 0) clean.emergency = sanitizePhone(patch.emergency);
	if (patch.whatsapp !== void 0) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
	if (patch.email !== void 0) clean.email = sanitizeEmail(patch.email) ?? "";
	try {
		await api.patch("/settings", clean);
		invalidate(QUERY_KEYS.settings);
	} catch (err) {
		console.error("Failed to update settings", err);
		throw err;
	}
}
async function checkIn() {
	try {
		const result = await api.post("/work-session/check-in", {});
		invalidate(QUERY_KEYS.workSession);
		return result;
	} catch (err) {
		console.error("Failed to check in", err);
		throw err;
	}
}
async function checkOut() {
	try {
		const result = await api.post("/work-session/check-out", {});
		invalidate(QUERY_KEYS.workSession);
		return result;
	} catch (err) {
		console.error("Failed to check out", err);
		throw err;
	}
}
async function loadAuditLogs() {
	try {
		const logs = await api.get("/audit-logs");
		invalidate(QUERY_KEYS.auditLogs);
		return logs;
	} catch (err) {
		console.error("Failed to load audit logs", err);
		throw err;
	}
}
async function loadWorkDays() {
	try {
		const days = await api.get("/work-days");
		invalidate(QUERY_KEYS.workDays);
		return days;
	} catch (err) {
		console.error("Failed to load workday folders", err);
		throw err;
	}
}
async function loadWorkDay(date) {
	try {
		const day = await api.get(`/work-days/${date}`);
		getQc()?.setQueryData(["work-day"], day);
		return day;
	} catch (err) {
		console.error("Failed to load workday folder", err);
		throw err;
	}
}
function get() {
	const qc = getQc();
	if (!qc) return seed();
	return {
		requests: qc.getQueryData(QUERY_KEYS.bookings) ?? [],
		doctors: qc.getQueryData(QUERY_KEYS.doctors) ?? DOCTORS,
		services: qc.getQueryData(QUERY_KEYS.services) ?? SERVICES,
		products: qc.getQueryData(QUERY_KEYS.products) ?? [],
		orders: qc.getQueryData(QUERY_KEYS.orders) ?? [],
		reviews: qc.getQueryData(QUERY_KEYS.reviews) ?? CLINIC_REVIEWS.map((review, index) => ({
			...review,
			id: `clinic-review-${index + 1}`,
			productId: "clinic",
			status: "approved",
			createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
		})),
		payments: qc.getQueryData(QUERY_KEYS.payments) ?? [],
		settings: qc.getQueryData(QUERY_KEYS.settings) ?? { ...CLINIC },
		workSession: qc.getQueryData(QUERY_KEYS.workSession) ?? null,
		auditLogs: qc.getQueryData(QUERY_KEYS.auditLogs) ?? [],
		workDays: qc.getQueryData(QUERY_KEYS.workDays) ?? [],
		workDay: qc.getQueryData(["work-day"]) ?? null
	};
}
//#endregion
//#region src/lib/format.ts
function formatPrice(price, currency = "EGP") {
	const n = Number.isFinite(price) ? price : 0;
	return currency === "$" ? `$${n.toFixed(2)}` : `${currency} ${n.toFixed(2)}`;
}
function formatDate(value, locale) {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString(locale || "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
//#endregion
//#region src/lib/cart-store.ts
var CART_KEY = "paw-m:cart";
function readCart() {
	const raw = storageGet("local", CART_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.id === "string") : [];
	} catch {
		return [];
	}
}
var state$1 = readCart();
var listeners$1 = /* @__PURE__ */ new Set();
function emit$1() {
	for (const l of listeners$1) l();
}
function commit$1(next) {
	state$1 = next;
	storageSet("local", CART_KEY, JSON.stringify(next));
	emit$1();
}
function subscribe$1(listener) {
	listeners$1.add(listener);
	return () => listeners$1.delete(listener);
}
function getSnapshot$1() {
	return state$1;
}
/**
* The server always renders an empty cart, so hydration must use an empty
* snapshot too — otherwise a cart that persisted in localStorage would make
* the client's first render disagree with the server HTML.
*/
var serverSnapshot$1 = [];
function useCart() {
	return useSyncExternalStore(subscribe$1, getSnapshot$1, () => serverSnapshot$1);
}
function useCartCount() {
	return useSyncExternalStore(subscribe$1, () => state$1.reduce((n, i) => n + i.qty, 0), () => 0);
}
function addToCart(product, qty = 1) {
	const safeQty = Math.max(1, qty);
	if (state$1.find((i) => i.id === product.id)) commit$1(state$1.map((i) => i.id === product.id ? {
		...i,
		qty: Math.min(i.qty + safeQty, Math.max(1, i.stock))
	} : i));
	else commit$1([...state$1, {
		id: product.id,
		name: product.name,
		price: product.price,
		image: product.image,
		qty: safeQty,
		stock: product.stock
	}]);
}
function setCartQty(id, qty) {
	commit$1(state$1.map((i) => i.id === id ? {
		...i,
		qty: Math.min(Math.max(1, qty), Math.max(1, i.stock))
	} : i));
}
function removeFromCart(id) {
	commit$1(state$1.filter((i) => i.id !== id));
}
function clearCart() {
	commit$1([]);
	storageRemove("local", CART_KEY);
}
//#endregion
//#region src/components/site/CartDrawer.tsx
function CartDrawer({ open, onClose }) {
	const { t } = useI18n();
	const cart = useCart();
	const { settings } = useClinicStore();
	const total = cart.reduce((n, i) => n + i.qty * i.price, 0);
	return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		className: "fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-[2px]",
		onClick: onClose
	}, "cart-backdrop"), /* @__PURE__ */ jsxs(motion.aside, {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
		transition: {
			duration: .3,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		className: "fixed inset-y-0 right-0 z-[90] flex w-full max-w-sm flex-col bg-card shadow-raised",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-border px-5 py-4",
			children: [/* @__PURE__ */ jsxs("h2", {
				className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(ShoppingBag, { className: "size-4" }),
					" ",
					t("cart.title")
				]
			}), /* @__PURE__ */ jsx("button", {
				onClick: onClose,
				className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
				"aria-label": t("header.closeMenu"),
				children: /* @__PURE__ */ jsx(X, { className: "size-5" })
			})]
		}), cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center",
			children: [
				/* @__PURE__ */ jsx(ShoppingBag, { className: "size-10 text-muted-foreground" }),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: t("cart.empty")
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					onClick: onClose,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/store",
						children: t("cart.continue")
					})
				})
			]
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "flex-1 space-y-4 overflow-y-auto px-5 py-4",
			children: cart.map((item) => /* @__PURE__ */ jsxs("div", {
				className: "flex gap-3",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: item.image,
						alt: "",
						className: "size-16 shrink-0 rounded-xl border border-border object-cover"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "line-clamp-2 text-sm font-medium leading-snug",
								children: item.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: formatPrice(item.price, settings.currency)
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-1.5 flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: () => setCartQty(item.id, item.qty - 1),
										className: "grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground",
										"aria-label": t("store.decreaseQty"),
										children: /* @__PURE__ */ jsx(Minus, { className: "size-3" })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "w-8 text-center text-xs font-semibold",
										children: item.qty
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setCartQty(item.id, item.qty + 1),
										className: "grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground",
										"aria-label": t("store.increaseQty"),
										children: /* @__PURE__ */ jsx(Plus, { className: "size-3" })
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => removeFromCart(item.id),
										className: "ml-auto grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
										"aria-label": t("cart.remove"),
										children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-sm font-semibold",
						children: formatPrice(item.price * item.qty, settings.currency)
					})
				]
			}, item.id))
		}), /* @__PURE__ */ jsxs("div", {
			className: "border-t border-border px-5 py-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm font-medium text-muted-foreground",
						children: t("cart.total")
					}), /* @__PURE__ */ jsx("span", {
						className: "text-lg font-bold",
						children: formatPrice(total, settings.currency)
					})]
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					className: "mt-4 w-full shadow-glow",
					onClick: onClose,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/store/checkout",
						children: t("cart.checkout")
					})
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "ghost",
					className: "mt-2 w-full",
					onClick: onClose,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/store",
						children: t("cart.continue")
					})
				})
			]
		})] })]
	}, "cart-panel")] }) });
}
//#endregion
//#region src/lib/wishlist-store.ts
var WISHLIST_KEY = "paw-m:wishlist";
function readWishlist() {
	const raw = storageGet("local", WISHLIST_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
	} catch {
		return [];
	}
}
var state = readWishlist();
var listeners = /* @__PURE__ */ new Set();
function emit() {
	for (const l of listeners) l();
}
function commit(next) {
	state = next;
	storageSet("local", WISHLIST_KEY, JSON.stringify(next));
	emit();
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function getSnapshot() {
	return state;
}
function useWishlist() {
	return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
function useIsWished(id) {
	return useSyncExternalStore(subscribe, () => state.includes(id), () => false);
}
/**
* The server never has a wishlist, so hydration must assume empty — otherwise
* localStorage items would make the client's first render disagree with the
* server HTML.
*/
var serverSnapshot = [];
function isWished(id) {
	return state.includes(id);
}
function toggleWishlist(id) {
	const wished = isWished(id);
	commit(wished ? state.filter((x) => x !== id) : [...state, id]);
	return !wished;
}
//#endregion
//#region src/lib/theme-cookie.ts
var THEME_COOKIE = "paw-m-theme";
function parseTheme(value) {
	return value === "dark" ? "dark" : "light";
}
var readThemeCookie = () => parseTheme(getCookie(THEME_COOKIE));
function writeThemeCookie(theme, days = 365) {
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
//#endregion
//#region src/lib/use-theme.tsx
var ThemeContext = createContext(null);
function ThemeProvider({ children }) {
	const { dark: initialDark } = useRouteContext();
	const [dark, setDark] = useState(initialDark);
	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);
	const toggle = () => {
		setDark((d) => {
			const next = !d;
			document.documentElement.classList.toggle("dark", next);
			writeThemeCookie(next ? "dark" : "light");
			try {
				localStorage.setItem("paw-m:theme", next ? "dark" : "light");
			} catch {}
			return next;
		});
	};
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			dark,
			toggle
		},
		children
	});
}
function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
}
//#endregion
//#region src/components/site/SiteHeader.tsx
function useNav() {
	const { t } = useI18n();
	return [
		{
			to: "/",
			label: t("nav.home")
		},
		{
			to: "/services",
			label: t("nav.services")
		},
		{
			to: "/doctors",
			label: t("nav.doctors")
		},
		{
			to: "/store",
			label: t("nav.store")
		},
		{
			to: "/about",
			label: t("nav.about")
		},
		{
			to: "/contact",
			label: t("nav.contact")
		}
	];
}
function SiteHeader() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const { dark, toggle } = useTheme();
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const NAV = useNav();
	const count = useCartCount();
	const wished = useWishlist();
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsxs("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-background shadow-card" : "border-b border-transparent bg-transparent"),
		style: scrolled ? { borderBottom: "1px solid var(--border)" } : void 0,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						"aria-label": t("header.homeAria"),
						children: /* @__PURE__ */ jsx(PawMLogo, {})
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "hidden items-center gap-1 md:flex",
						"aria-label": t("header.mainAria"),
						children: NAV.map((item) => /* @__PURE__ */ jsx(Link, {
							to: item.to,
							className: "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
							activeOptions: { exact: item.to === "/" },
							activeProps: { className: "text-foreground" },
							children: item.label
						}, item.to))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(LanguageToggle, {}),
							/* @__PURE__ */ jsx("button", {
								onClick: toggle,
								"aria-label": dark ? t("header.lightMode") : t("header.darkMode"),
								className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
								children: dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
							}),
							/* @__PURE__ */ jsxs("a", {
								href: telHref(settings.emergency) ?? void 0,
								className: "hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex",
								children: [/* @__PURE__ */ jsx(Phone, { className: "size-4" }), settings.emergency]
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								className: "hidden shadow-glow sm:inline-flex",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/book",
									children: t("nav.book")
								})
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/store/wishlist",
								"aria-label": t("header.wishlistAria"),
								className: "relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
								children: [/* @__PURE__ */ jsx(Heart, { className: "size-4" }), wished.length > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground",
									children: wished.length
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setCartOpen(true),
								"aria-label": t("header.cartAria"),
								className: "relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
								children: [/* @__PURE__ */ jsx(ShoppingBag, { className: "size-4" }), count > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground",
									children: count
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "grid size-9 place-items-center rounded-lg text-foreground md:hidden",
								onClick: () => setOpen((o) => !o),
								"aria-label": open ? t("header.closeMenu") : t("header.openMenu"),
								"aria-expanded": open,
								children: open ? /* @__PURE__ */ jsx(X, { className: "size-5" }) : /* @__PURE__ */ jsx(Menu, { className: "size-5" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .3,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "overflow-hidden border-t border-border bg-background md:hidden",
				children: /* @__PURE__ */ jsxs("nav", {
					className: "mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4",
					"aria-label": t("header.mobileAria"),
					children: [NAV.map((item, i) => /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							x: -10
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							delay: .06 * i,
							duration: .28,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						children: /* @__PURE__ */ jsx(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: "block rounded-lg bg-muted/50 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground",
							children: item.label
						})
					}, item.to)), /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: .3,
							duration: .28,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						children: /* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "mt-2 w-full shadow-glow",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/book",
								onClick: () => setOpen(false),
								children: t("nav.book")
							})
						})
					})]
				})
			}, "mobile-menu") }),
			/* @__PURE__ */ jsx(CartDrawer, {
				open: cartOpen,
				onClose: () => setCartOpen(false)
			})
		]
	});
}
//#endregion
//#region src/components/motion-primitives.tsx
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
//#endregion
//#region src/components/site/SiteFooter.tsx
var FLOATING_PAWS = [
	{
		left: "6%",
		size: 18,
		delay: 0,
		duration: 9
	},
	{
		left: "16%",
		size: 12,
		delay: 1.6,
		duration: 7.5
	},
	{
		left: "38%",
		size: 22,
		delay: .9,
		duration: 10.5
	},
	{
		left: "55%",
		size: 14,
		delay: 2.4,
		duration: 8
	},
	{
		left: "72%",
		size: 20,
		delay: .4,
		duration: 9.5
	},
	{
		left: "88%",
		size: 13,
		delay: 1.2,
		duration: 7
	},
	{
		left: "95%",
		size: 17,
		delay: 2.9,
		duration: 8.8
	}
];
var MARQUEE_ITEMS = 5;
function SiteFooter() {
	const { settings } = useClinicStore();
	const { t } = useI18n();
	const COLUMNS = [{
		heading: t("footer.clinic"),
		links: [
			{
				to: "/services",
				label: t("nav.services")
			},
			{
				to: "/doctors",
				label: t("footer.vets")
			},
			{
				to: "/about",
				label: t("footer.about")
			},
			{
				to: "/contact",
				label: t("footer.contact")
			}
		]
	}, {
		heading: t("footer.care"),
		links: [
			{
				to: "/book",
				label: t("nav.book")
			},
			{
				to: "/services",
				label: t("footer.services")
			},
			{
				to: "/store",
				label: t("nav.store")
			},
			{
				to: "/store/wishlist",
				label: t("header.wishlistAria")
			}
		]
	}];
	return /* @__PURE__ */ jsxs("footer", {
		className: "relative overflow-hidden rounded-t-[2.5rem] border border-b-0 border-border bg-surface",
		children: [
			/* @__PURE__ */ jsx("div", { className: "hero-gradient pointer-events-none absolute inset-0 opacity-50" }),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" }),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-20 bottom-24 size-80 rounded-full bg-brass/15 blur-3xl" }),
			/* @__PURE__ */ jsx("div", {
				className: "pointer-events-none absolute inset-0 overflow-hidden",
				children: FLOATING_PAWS.map((paw, i) => /* @__PURE__ */ jsx(PawPrint, {
					className: "animate-paw-float absolute bottom-8 text-primary/10",
					style: {
						left: paw.left,
						width: paw.size,
						height: paw.size,
						animationDelay: `${paw.delay}s`,
						animationDuration: `${paw.duration}s`
					}
				}, i))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto max-w-6xl px-5 sm:px-8",
				children: [/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-start justify-between gap-5 border-b border-border/70 py-8 md:flex-row md:items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(CalendarHeart, { className: "size-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-foreground",
							children: t("footer.readyTitle")
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: t("footer.readyDesc")
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [settings.emergency && /* @__PURE__ */ jsx("a", {
							href: telHref(settings.emergency) ?? void 0,
							children: /* @__PURE__ */ jsxs(motion.span, {
								whileHover: { scale: 1.03 },
								className: "inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "relative flex size-2",
									children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-2 rounded-full bg-destructive" })]
								}), t("hero.emergency")]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							className: "shadow-glow transition-transform hover:scale-[1.03]",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/book",
								children: [t("footer.bookVisit"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
							})
						})]
					})]
				}) }), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-10 py-14 md:grid-cols-[1.35fr_1fr_1fr]",
					children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur",
						children: [/* @__PURE__ */ jsx(PawMLogo, {}), /* @__PURE__ */ jsx("p", {
							className: "mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground",
							children: t("footer.tagline")
						})]
					}) }) }), COLUMNS.map((col, i) => /* @__PURE__ */ jsx(Reveal, {
						delay: .08 + i * .08,
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "flex items-center gap-2 text-sm font-semibold text-foreground",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "size-3.5 text-brass" }), col.heading]
							}), /* @__PURE__ */ jsx("ul", {
								className: "mt-5 space-y-3",
								children: col.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
									to: link.to,
									className: "group relative inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
									children: [
										link.label,
										/* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180 rtl:-translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0" }),
										/* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" })
									]
								}) }, link.label))
							})]
						})
					}, col.heading))]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative border-t border-border/70 bg-background/40",
				children: [/* @__PURE__ */ jsx("div", {
					className: "overflow-hidden py-3",
					style: { maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" },
					children: /* @__PURE__ */ jsx("div", {
						className: "animate-marquee flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: [0, 1].map((half) => /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-8",
							children: Array.from({ length: MARQUEE_ITEMS }, (_, i) => /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-8",
								children: [/* @__PURE__ */ jsx("span", { children: t(`footer.marquee.${i}`) }), /* @__PURE__ */ jsx(PawPrint, { className: "size-3 text-primary/40" })]
							}, i))
						}, half))
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8",
					children: [/* @__PURE__ */ jsxs("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						settings.name,
						" ",
						t("footer.rights")
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-5",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/dashboard",
							className: "inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-foreground",
							children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "size-3.5" }), t("nav.staff")]
						}), /* @__PURE__ */ jsx("p", {
							className: "hidden sm:block",
							children: t("footer.accred")
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/lib/runtime-error-reporting.ts
function reportRuntimeError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__runtimeEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__reportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: t("notfound.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("notfound.desc")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("notfound.home")
					})
				})
			]
		})
	});
}
function RouteLoadingSkeleton() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading..."
			})]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "An unexpected error occurred. Please try again."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";
var Route$19 = createRootRouteWithContext()({
	beforeLoad: () => ({
		lang: readLangCookie(),
		dark: readThemeCookie() === "dark"
	}),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Paw-M Veterinary Clinic" },
			{
				name: "description",
				content: "Paw-M is a boutique veterinary hospital: same-day diagnostics, transparent estimates and 24/7 emergency care."
			},
			{
				name: "author",
				content: "Paw-M Veterinary Clinic"
			},
			{
				property: "og:site_name",
				content: "Paw-M"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: "/og-image.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:image",
				content: "/og-image.png"
			},
			{
				name: "theme-color",
				content: "#7BA882"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	const { lang, dark } = Route$19.useRouteContext();
	const classes = [lang === "ar" ? "lang-ar" : void 0, dark ? "dark" : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ jsxs("html", {
		lang,
		dir: lang === "ar" ? "rtl" : "ltr",
		className: classes,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient, lang } = Route$19.useRouteContext();
	const { pathname } = useLocation();
	const isDashboard = pathname.startsWith("/dashboard");
	useEffect(() => {
		let cancelled = false;
		const loadId = window.setTimeout(() => {
			if (cancelled) return;
			refreshPublicData();
			if (isAuthed()) refreshClinicData();
		}, 0);
		let link;
		const id = window.setTimeout(() => {
			if (cancelled) return;
			link = document.createElement("link");
			link.rel = "stylesheet";
			link.media = "print";
			link.onload = () => {
				if (link) link.media = "all";
			};
			link.href = FONT_CSS_URL;
			document.head.appendChild(link);
		}, 100);
		return () => {
			cancelled = true;
			window.clearTimeout(loadId);
			window.clearTimeout(id);
		};
	}, []);
	return /* @__PURE__ */ jsx(I18nProvider, {
		initialLang: lang,
		children: /* @__PURE__ */ jsx(QueryClientProvider, {
			client: queryClient,
			children: /* @__PURE__ */ jsxs(ThemeProvider, { children: [
				!isDashboard && /* @__PURE__ */ jsx(IntroAnimation, {}),
				!isDashboard && /* @__PURE__ */ jsx(SiteHeader, {}),
				/* @__PURE__ */ jsx(motion.main, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .45,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "min-h-screen",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx(RouteLoadingSkeleton, {}),
						children: /* @__PURE__ */ jsx(Outlet, {})
					})
				}, pathname),
				!isDashboard && /* @__PURE__ */ jsx(SiteFooter, {}),
				/* @__PURE__ */ jsx(Toaster$1, {
					position: "top-center",
					richColors: true
				})
			] })
		})
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$17 = () => import("./routes-DlDxTr8l.js");
var title$8 = "Paw-M — Veterinary Clinic in Cairo, Egypt";
var description$8 = "Same-day diagnostics, transparent estimates and a 24/7 emergency team. Book your pet's appointment with Paw-M in under a minute.";
var Route$18 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: title$8 },
			{
				name: "description",
				content: description$8
			},
			{
				property: "og:title",
				content: title$8
			},
			{
				property: "og:description",
				content: description$8
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "VeterinaryCare",
				name: "Paw-M Veterinary Clinic",
				description: description$8,
				url: "/",
				address: {
					"@type": "PostalAddress",
					addressLocality: "Cairo",
					addressRegion: "Cairo Governorate",
					addressCountry: "EG"
				}
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$16 = () => import("./about-1V_-yUJP.js");
var title$7 = "About Paw-M — A Boutique Veterinary Hospital";
var description$7 = "Paw-M was built around clear diagnostics, honest estimates and medical records pet owners actually own. Meet the practice behind the care.";
var Route$17 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: title$7 },
			{
				name: "description",
				content: description$7
			},
			{
				property: "og:title",
				content: title$7
			},
			{
				property: "og:description",
				content: description$7
			},
			{
				property: "og:url",
				content: "/about"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/book.tsx
var $$splitComponentImporter$15 = () => import("./book-DfsCsCkF.js");
var title$6 = "Book an Appointment — Paw-M";
var description$6 = "Book your pet's veterinary appointment at Paw-M in under a minute. Live availability across every clinician, with instant confirmation.";
var Route$16 = createFileRoute("/book")({
	validateSearch: (search) => typeof search["doctor"] === "string" ? { doctor: search["doctor"] } : {},
	head: () => ({
		meta: [
			{ title: title$6 },
			{
				name: "description",
				content: description$6
			},
			{
				property: "og:title",
				content: title$6
			},
			{
				property: "og:description",
				content: description$6
			},
			{
				property: "og:url",
				content: "/book"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/book"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/cashier.tsx
var $$splitComponentImporter$14 = () => import("./cashier-BYixTzVO.js");
var Route$15 = createFileRoute("/cashier")({
	head: () => ({ meta: [
		{ title: "Cashier — Paw-M" },
		{
			name: "description",
			content: "Point of sale for Paw-M Clinic"
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$13 = () => import("./contact-BMzFP5Zr.js");
var title$5 = "Contact Paw-M — Hours, Location & Emergency Line";
var description$5 = "Call, message or visit Paw-M Veterinary Clinic in San Francisco. Emergency line answered 24/7, seven days a week.";
var Route$14 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: title$5 },
			{
				name: "description",
				content: description$5
			},
			{
				property: "og:title",
				content: title$5
			},
			{
				property: "og:description",
				content: description$5
			},
			{
				property: "og:url",
				content: "/contact"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$12 = () => import("./dashboard-CYTXeQWh.js");
var Route$13 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Staff Dashboard — Paw-M" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/doctors.tsx
var $$splitComponentImporter$11 = () => import("./doctors-CSEeZDXt.js");
var title$4 = "Our Veterinarians — Paw-M";
var description$4 = "Meet the Paw-M veterinary team: internal medicine, surgery, emergency care, dentistry, dermatology and exotics specialists, with live availability.";
var Route$12 = createFileRoute("/doctors")({
	head: () => ({
		meta: [
			{ title: title$4 },
			{
				name: "description",
				content: description$4
			},
			{
				property: "og:title",
				content: title$4
			},
			{
				property: "og:description",
				content: description$4
			},
			{
				property: "og:url",
				content: "/doctors"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/doctors"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/forgot-password.tsx
var $$splitComponentImporter$10 = () => import("./forgot-password-C3PNt5NA.js");
var Route$11 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$9 = () => import("./reset-password-D1RL46HL.js");
var Route$10 = createFileRoute("/reset-password")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/services.tsx
var $$splitComponentImporter$8 = () => import("./services-CYNJkPqN.js");
var title$3 = "Veterinary Services — Paw-M";
var description$3 = "Checkups, vaccination, surgery, emergency care, in-house laboratory, dentistry, imaging and more at Paw-M Veterinary Clinic.";
var Route$9 = createFileRoute("/services")({
	head: () => ({
		meta: [
			{ title: title$3 },
			{
				name: "description",
				content: description$3
			},
			{
				property: "og:title",
				content: title$3
			},
			{
				property: "og:description",
				content: description$3
			},
			{
				property: "og:url",
				content: "/services"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/services"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/sitemap[.]xml.ts
var BASE_URL = "";
var Route$8 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/services",
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/doctors",
				changefreq: "monthly",
				priority: "0.8"
			},
			{
				path: "/about",
				changefreq: "yearly",
				priority: "0.6"
			},
			{
				path: "/contact",
				changefreq: "yearly",
				priority: "0.7"
			},
			{
				path: "/book",
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/store",
				changefreq: "weekly",
				priority: "0.8"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
//#endregion
//#region src/routes/staff.tsx
var $$splitComponentImporter$7 = () => import("./staff-CmXirT3p.js");
var Route$7 = createFileRoute("/staff")({
	head: () => ({ meta: [{ title: "Staff Portal — Paw-M" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/store.tsx
var $$splitComponentImporter$6 = () => import("./store-DaQ1DYrZ.js");
/**
* Layout route for /store/* pages. Renders nothing itself — the index page
* (store.index.tsx) is the catalog and /store/checkout, /store/track and
* /store/$productId are sibling pages rendered in place of it.
*/
var Route$6 = createFileRoute("/store")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/booking.success.tsx
var $$splitComponentImporter$5 = () => import("./booking.success-bnVFZcWf.js");
var title$2 = "Appointment Confirmed — Paw-M";
var description$2 = "Your Paw-M veterinary appointment request has been received.";
var Route$5 = createFileRoute("/booking/success")({
	validateSearch: (search) => ({
		pet: typeof search["pet"] === "string" ? search["pet"] : "",
		date: typeof search["date"] === "string" ? search["date"] : "",
		time: typeof search["time"] === "string" ? search["time"] : "",
		doctor: typeof search["doctor"] === "string" ? search["doctor"] : ""
	}),
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/store.index.tsx
var $$splitComponentImporter$4 = () => import("./store.index-DM-FipvE.js");
var title$1 = "Pet Supply Store — Paw-M";
var description$1 = "Food, treats, toys, grooming, health and accessories for dogs and cats, available at Paw-M Veterinary Clinic.";
var Route$4 = createFileRoute("/store/")({
	head: () => ({
		meta: [
			{ title: title$1 },
			{
				name: "description",
				content: description$1
			},
			{
				property: "og:title",
				content: title$1
			},
			{
				property: "og:description",
				content: description$1
			},
			{
				property: "og:url",
				content: "/store"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/store"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/store.$productId.tsx
var $$splitComponentImporter$3 = () => import("./store._productId-QrTcV_3H.js");
var Route$3 = createFileRoute("/store/$productId")({
	head: () => ({ meta: [
		{ title: "Product — Paw-M Store" },
		{
			name: "description",
			content: "Pet supplies from Paw-M Veterinary Clinic."
		},
		{
			name: "robots",
			content: "index,follow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/store.checkout.tsx
var $$splitComponentImporter$2 = () => import("./store.checkout-ChpS2ciF.js");
var Route$2 = createFileRoute("/store/checkout")({
	head: () => ({ meta: [
		{ title: "Checkout — Paw-M Store" },
		{
			name: "description",
			content: "Place your pet supply order with Paw-M."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/store.track.tsx
var $$splitComponentImporter$1 = () => import("./store.track-Bf5LAky4.js");
var Route$1 = createFileRoute("/store/track")({
	head: () => ({ meta: [
		{ title: "Track Order — Paw-M Store" },
		{
			name: "description",
			content: "Check the status of your Paw-M store order."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/store.wishlist.tsx
var $$splitComponentImporter = () => import("./store.wishlist-dARQmuCk.js");
var title = "Your Wishlist — Paw-M";
var description = "All the products you saved at Paw-M Veterinary Clinic, back in one place.";
var Route = createFileRoute("/store/wishlist")({
	head: () => ({
		meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:url",
				content: "/store/wishlist"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/store/wishlist"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$17.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var BookRoute = Route$16.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => Route$19
});
var CashierRoute = Route$15.update({
	id: "/cashier",
	path: "/cashier",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$14.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var DashboardRoute = Route$13.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$19
});
var DoctorsRoute = Route$12.update({
	id: "/doctors",
	path: "/doctors",
	getParentRoute: () => Route$19
});
var ForgotPasswordRoute = Route$11.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$19
});
var ResetPasswordRoute = Route$10.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$19
});
var ServicesRoute = Route$9.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$19
});
var SitemapDotxmlRoute = Route$8.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$19
});
var StaffRoute = Route$7.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => Route$19
});
var StoreRoute = Route$6.update({
	id: "/store",
	path: "/store",
	getParentRoute: () => Route$19
});
var BookingSuccessRoute = Route$5.update({
	id: "/booking/success",
	path: "/booking/success",
	getParentRoute: () => Route$19
});
var StoreIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => StoreRoute
});
var StoreRouteChildren = {
	StoreProductIdRoute: Route$3.update({
		id: "/$productId",
		path: "/$productId",
		getParentRoute: () => StoreRoute
	}),
	StoreCheckoutRoute: Route$2.update({
		id: "/checkout",
		path: "/checkout",
		getParentRoute: () => StoreRoute
	}),
	StoreTrackRoute: Route$1.update({
		id: "/track",
		path: "/track",
		getParentRoute: () => StoreRoute
	}),
	StoreWishlistRoute: Route.update({
		id: "/wishlist",
		path: "/wishlist",
		getParentRoute: () => StoreRoute
	}),
	StoreIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	BookRoute,
	CashierRoute,
	ContactRoute,
	DashboardRoute,
	DoctorsRoute,
	ForgotPasswordRoute,
	ResetPasswordRoute,
	ServicesRoute,
	SitemapDotxmlRoute,
	StaffRoute,
	StoreRoute: StoreRoute._addFileChildren(StoreRouteChildren),
	BookingSuccessRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { isAuthConfigured as $, deleteRequest as A, setBookingStatus as B, createOrder as C, deleteOrder as D, deleteDoctor as E, loadWorkDays as F, syncGoogleReviews as G, setOrderStatus as H, refreshClinicData as I, updateSettings as J, trackOrder as K, saveDoctor as L, deleteService as M, loadAuditLogs as N, deletePayment as O, loadWorkDay as P, currentUsername as Q, saveProduct as R, checkOut as S, createReview as T, setReviewStatus as U, setOrderPaymentStatus as V, submitPaymentProof as W, changeCredentials as X, useClinicStore as Y, currentRole as Z, formatPrice as _, PawMLogo as _t, CountUp as a, mailtoHref as at, archiveOrder as b, toggleWishlist as c, ANIMAL_TYPES as ct, addToCart as d, FAQS as dt, isAuthed as et, clearCart as f, STATS as ft, formatDate as g, getRouter, upcomingAvailability as gt, useCart as h, bookedSlotsFor as ht, Route$16 as i, remainingLockMs as it, deleteReview as j, deleteProduct as k, useIsWished as l, BOOKING_STEPS as lt, setCartQty as m, WHY_US as mt, Route$3 as n, logout as nt, Reveal as o, telHref as ot, removeFromCart as p, TIME_SLOTS as pt, updatePayment as q, Route$5 as r, register as rt, useTheme as s, waMeHref as st, router_exports as t, login as tt, useWishlist as u, CLINIC as ut, addBookingRequest as v, createPayment as w, checkIn as x, archiveBooking as y, saveService as z };
