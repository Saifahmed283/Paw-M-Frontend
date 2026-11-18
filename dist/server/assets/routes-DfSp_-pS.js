import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { P as ProductCard } from "./ProductCard-DziHvoJi.js";
import { H as Hero, S as SectionHeading, a as ServicesGrid, W as WhyUs, D as DoctorCard, B as BookingTimeline, T as Testimonials, F as Faq } from "./sections-CXshZzll.js";
import { a as useClinicStore, u as useI18n, B as Button } from "./router-bUAwJbNn.js";
import "sonner";
import "./badge-C5tKWBrb.js";
import "class-variance-authority";
import "react";
import "motion/react";
import "@radix-ui/react-accordion";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
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
function Index() {
  const {
    doctors,
    products
  } = useClinicStore();
  const {
    t
  } = useI18n();
  const featured = [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 4);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-5 py-20 sm:px-8", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("services.eyebrow"), title: t("home.services.title"), description: t("home.services.desc") }),
      /* @__PURE__ */ jsx(ServicesGrid, { limit: 6 })
    ] }),
    featured.length > 0 && /* @__PURE__ */ jsx("section", { className: "border-y border-border bg-surface py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("home.shop.eyebrow"), title: t("home.shop.title"), description: t("home.shop.desc") }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "mb-1", children: /* @__PURE__ */ jsxs(Link, { to: "/store", children: [
          t("home.shop.browse"),
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: featured.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(WhyUs, {}),
    /* @__PURE__ */ jsx("section", { className: "border-t border-border bg-surface py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("team.eyebrow"), title: t("home.team.title"), description: t("home.team.desc") }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: doctors.slice(0, 3).map((doctor, i) => /* @__PURE__ */ jsx(DoctorCard, { doctor, index: i }, doctor.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(BookingTimeline, {}),
    /* @__PURE__ */ jsx(Testimonials, {}),
    /* @__PURE__ */ jsx(Faq, {})
  ] });
}
export {
  Index as component
};
