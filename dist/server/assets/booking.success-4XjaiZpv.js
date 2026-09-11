import { A as useClinicStore, pt as useI18n, st as Button } from "./clinic-store-DRj_-uzr.js";
import { r as Route } from "./router-DM0S-N0s.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { CalendarCheck, Check } from "lucide-react";
//#region src/routes/booking.success.tsx?tsr-split=component
function SuccessPage() {
	const { pet, date, time, doctor } = Route.useSearch();
	const { settings } = useClinicStore();
	const { t } = useI18n();
	const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${t("success.icsSummary")}${pet ? ` — ${pet}` : ""}\nDESCRIPTION:${doctor}\nLOCATION:${settings.address}\nEND:VEVENT\nEND:VCALENDAR`;
	const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient flex min-h-screen items-center justify-center px-5 py-32",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 16,
				scale: .98
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			transition: {
				duration: .5,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			className: "w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success",
					children: /* @__PURE__ */ jsx(Check, {
						className: "size-7",
						strokeWidth: 3
					})
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-6 text-2xl font-bold sm:text-3xl",
					children: t("booking.requested")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: t("booking.requestedDesc")
				}),
				/* @__PURE__ */ jsx("dl", {
					className: "mt-8 space-y-3 rounded-2xl border border-border bg-muted/40 p-5 text-left text-sm rtl:text-right",
					children: [
						[t("booking.pet.name"), pet || "—"],
						[t("booking.schedule.date"), date || "—"],
						[t("booking.schedule.time"), time || "—"],
						[t("booking.schedule.doctor"), doctor || t("booking.genericDoctor")]
					].map(([k, v]) => /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ jsx("dt", {
							className: "text-muted-foreground",
							children: k
						}), /* @__PURE__ */ jsx("dd", {
							className: "font-medium text-foreground",
							children: v
						})]
					}, k))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "shadow-glow",
						children: /* @__PURE__ */ jsxs("a", {
							href: icsHref,
							download: "paw-m-appointment.ics",
							children: [
								/* @__PURE__ */ jsx(CalendarCheck, { className: "size-4" }),
								" ",
								t("booking.addCalendar")
							]
						})
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							children: t("booking.home")
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { SuccessPage as component };
