import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { B as Breadcrumbs } from "./Breadcrumbs-BvH_GNc7.js";
import { P as ProductCard } from "./ProductCard-DziHvoJi.js";
import { S as SectionHeading } from "./sections-CXshZzll.js";
import { u as useI18n, a as useClinicStore, aj as useWishlist, B as Button } from "./router-bUAwJbNn.js";
import "react";
import "@radix-ui/react-slot";
import "sonner";
import "./badge-C5tKWBrb.js";
import "class-variance-authority";
import "motion/react";
import "@radix-ui/react-accordion";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
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
function WishlistPage() {
  const {
    t
  } = useI18n();
  const {
    products
  } = useClinicStore();
  const wished = useWishlist();
  const items = products.filter((p) => wished.includes(p.id));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
        label: t("crumb.home"),
        to: "/"
      }, {
        label: t("crumb.store"),
        to: "/store"
      }, {
        label: t("page.wishlist.title"),
        to: "/store/wishlist"
      }] }),
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: t("page.wishlist.eyebrow"), title: t("page.wishlist.title"), description: t("page.wishlist.desc"), as: "h1" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-6xl px-5 py-12 sm:px-8", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 py-24 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Heart, { className: "size-8" }) }),
      /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm text-muted-foreground", children: t("store.wishlistEmpty") }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-2 shadow-glow", children: /* @__PURE__ */ jsx(Link, { to: "/store", children: t("store.wishlistBrowse") }) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-xs text-muted-foreground", children: t("store.showing", {
        count: String(items.length),
        total: String(items.length)
      }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id)) })
    ] }) })
  ] });
}
export {
  WishlistPage as component
};
