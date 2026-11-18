import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { B as Breadcrumbs } from "./Breadcrumbs-BvH_GNc7.js";
import { S as SectionHeading, a as ServicesGrid } from "./sections-CXshZzll.js";
import { u as useI18n } from "./router-bUAwJbNn.js";
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
function ServicesPage() {
  const {
    t
  } = useI18n();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
        label: t("crumb.home"),
        to: "/"
      }, {
        label: t("crumb.services"),
        to: "/services"
      }] }),
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("page.services.eyebrow"), title: t("page.services.title"), description: t("page.services.desc"), as: "h1" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8", children: /* @__PURE__ */ jsx(ServicesGrid, {}) })
  ] });
}
export {
  ServicesPage as component
};
