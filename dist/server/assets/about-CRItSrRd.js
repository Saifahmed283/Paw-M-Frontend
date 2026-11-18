import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { B as Breadcrumbs } from "./Breadcrumbs-BvH_GNc7.js";
import { S as SectionHeading, c as clinicImage } from "./sections-CXshZzll.js";
import { a as useClinicStore, u as useI18n, a3 as Reveal, ag as STATS, ah as CountUp, ai as WHY_US } from "./router-bUAwJbNn.js";
import "react";
import "@tanstack/react-router";
import "@radix-ui/react-slot";
import "lucide-react";
import "motion/react";
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
function AboutPage() {
  const {
    doctors
  } = useClinicStore();
  const {
    t
  } = useI18n();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
        label: t("crumb.home"),
        to: "/"
      }, {
        label: t("crumb.about"),
        to: "/about"
      }] }),
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("page.about.eyebrow"), title: t("page.about.title"), description: t("page.about.desc"), as: "h1" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-6xl px-5 py-16 sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-12 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl border border-border shadow-lg", children: /* @__PURE__ */ jsx("img", { src: clinicImage, alt: t("img.clinic"), loading: "lazy", width: 1036, height: 870, className: "h-full w-full object-cover" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: Array.from({
        length: 3
      }, (_, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 0.06, children: /* @__PURE__ */ jsxs("div", { className: "border-l-2 border-primary pl-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: t(`about.principle.${i}.title`) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: t(`about.principle.${i}.body`) })
      ] }) }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-y border-border bg-surface py-16", children: /* @__PURE__ */ jsx("dl", { className: "mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4", children: STATS.map((stat, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 0.06, children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("dt", { className: "text-3xl font-bold tracking-tight", children: /* @__PURE__ */ jsx(CountUp, { value: i === 1 ? doctors.length : stat.value, suffix: i === 1 ? "" : stat.suffix }) }),
      /* @__PURE__ */ jsx("dd", { className: "mt-1.5 text-sm text-muted-foreground", children: t(`stats.${i}`) })
    ] }) }, stat.label)) }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-5 py-20 sm:px-8", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("page.about.standards"), title: t("why.title") }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: WHY_US.map((item, i) => /* @__PURE__ */ jsx(Reveal, { delay: i % 3 * 0.06, children: /* @__PURE__ */ jsxs("div", { className: "h-full rounded-2xl border border-border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: t(`whyitem.${i}.title`) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: t(`whyitem.${i}.detail`) })
      ] }) }, item.title)) })
    ] })
  ] });
}
export {
  AboutPage as component
};
