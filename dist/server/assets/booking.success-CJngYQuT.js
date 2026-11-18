import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Check, Banknote, CalendarCheck } from "lucide-react";
import { motion } from "motion/react";
import { aB as Route, a as useClinicStore, u as useI18n, B as Button } from "./router-bUAwJbNn.js";
import "@tanstack/react-query";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./server-nkD8CjI6.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "@tanstack/router-core/ssr/server";
import "node:async_hooks";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "sonner";
function SuccessPage() {
  const {
    pet,
    date,
    time,
    doctor
  } = Route.useSearch();
  const {
    settings
  } = useClinicStore();
  const {
    t
  } = useI18n();
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${t("success.icsSummary")}${pet ? ` — ${pet}` : ""}
DESCRIPTION:${doctor}
LOCATION:${settings.address}
END:VEVENT
END:VCALENDAR`;
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  return /* @__PURE__ */ jsx("section", { className: "hero-gradient flex min-h-screen items-center justify-center px-5 py-32", children: /* @__PURE__ */ jsxs(motion.div, { initial: {
    opacity: 0,
    y: 16,
    scale: 0.98
  }, animate: {
    opacity: 1,
    y: 0,
    scale: 1
  }, transition: {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1]
  }, className: "w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12", children: [
    /* @__PURE__ */ jsx("span", { className: "mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success", children: /* @__PURE__ */ jsx(Check, { className: "size-7", strokeWidth: 3 }) }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold sm:text-3xl", children: t("booking.requested") }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: t("booking.requestedDesc") }),
    /* @__PURE__ */ jsx("dl", { className: "mt-8 space-y-3 rounded-2xl border border-border bg-muted/40 p-5 text-left text-sm rtl:text-right", children: [[t("booking.pet.name"), pet || "—"], [t("booking.schedule.date"), date || "—"], [t("booking.schedule.time"), time || "—"], [t("booking.schedule.doctor"), doctor || t("booking.genericDoctor")]].map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
      /* @__PURE__ */ jsx("dt", { className: "text-muted-foreground", children: k }),
      /* @__PURE__ */ jsx("dd", { className: "font-medium text-foreground", children: v })
    ] }, k)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Banknote, { className: "size-4 shrink-0 text-primary/70" }),
      /* @__PURE__ */ jsx("span", { children: t("booking.success.fee") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "shadow-glow", children: /* @__PURE__ */ jsxs("a", { href: icsHref, download: "paw-m-appointment.ics", children: [
        /* @__PURE__ */ jsx(CalendarCheck, { className: "size-4" }),
        " ",
        t("booking.addCalendar")
      ] }) }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/", children: t("booking.home") }) })
    ] })
  ] }) });
}
export {
  SuccessPage as component
};
