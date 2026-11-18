import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { B as Breadcrumbs } from "./Breadcrumbs-BvH_GNc7.js";
import { S as SectionHeading, D as DoctorCard } from "./sections-CXshZzll.js";
import { a as useClinicStore, u as useI18n, A as ANIMAL_TYPES, d as cn } from "./router-bUAwJbNn.js";
import "@tanstack/react-router";
import "@radix-ui/react-slot";
import "lucide-react";
import "@radix-ui/react-accordion";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
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
function FilterChip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, "aria-pressed": active, className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"), children });
}
function DoctorsPage() {
  const [specialty, setSpecialty] = useState("All");
  const [pet, setPet] = useState("All");
  const {
    doctors
  } = useClinicStore();
  const {
    t
  } = useI18n();
  const specialties = useMemo(() => ["All", ...Array.from(new Set(doctors.map((d) => d.specialization)))], [doctors]);
  const petFilters = useMemo(() => ANIMAL_TYPES.filter((p) => doctors.some((d) => d.pets.includes(p))), [doctors]);
  const filtered = useMemo(() => doctors.filter((d) => (specialty === "All" || d.specialization === specialty) && (pet === "All" || pet === "Other" || d.pets.includes(pet))), [specialty, pet, doctors]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
        label: t("crumb.home"),
        to: "/"
      }, {
        label: t("crumb.doctors"),
        to: "/doctors"
      }] }),
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("page.doctors.eyebrow"), title: t("page.doctors.title"), description: t("page.doctors.desc"), as: "h1" })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-5 py-16 sm:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: t("doctors.specLabel") }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: specialties.map((s) => {
            var _a;
            return /* @__PURE__ */ jsx(FilterChip, { active: specialty === s, onClick: () => setSpecialty(s), children: s === "All" ? t("filter.all") : t(`doc.${(_a = doctors.find((d) => d.specialization === s)) == null ? void 0 : _a.id}.spec`) }, s);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: t("doctors.petLabel") }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["All", ...petFilters].map((p) => /* @__PURE__ */ jsx(FilterChip, { active: pet === p, onClick: () => setPet(p), children: p === "All" ? t("filter.all") : t(`animal.${p}`) }, p)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-muted-foreground", "aria-live": "polite", children: t("doctors.showing", {
        count: String(filtered.length),
        total: String(doctors.length)
      }) }),
      filtered.length === 0 ? /* @__PURE__ */ jsx(motion.p, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, transition: {
        duration: 0.35
      }, className: "mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: t("doctors.empty") }) : /* @__PURE__ */ jsx(motion.div, { layout: true, className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }, children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((doctor, i) => /* @__PURE__ */ jsx(motion.div, { layout: true, initial: {
        opacity: 0,
        y: 16
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        scale: 0.96
      }, transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
        delay: i * 0.04
      }, children: /* @__PURE__ */ jsx(DoctorCard, { doctor, index: i, detailed: true }) }, doctor.id)) }) })
    ] })
  ] });
}
export {
  DoctorsPage as component
};
