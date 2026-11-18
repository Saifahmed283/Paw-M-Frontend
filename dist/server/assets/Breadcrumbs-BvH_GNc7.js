import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Fragment as Fragment$1 } from "react";
import { Link } from "@tanstack/react-router";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight } from "lucide-react";
import { d as cn } from "./router-bUAwJbNn.js";
const Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "ol",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      ),
      ...props
    }
  )
);
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("inline-flex items-center gap-1.5", className), ...props })
);
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "span",
    {
      ref,
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("font-normal text-foreground", className),
      ...props
    }
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
const __vite_import_meta_env__ = {};
const SITE_URL = __vite_import_meta_env__["VITE_SITE_URL"] || "https://pawmclinnic.com";
function Breadcrumbs({ items }) {
  if (items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.to}`
    }))
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
      }
    ),
    /* @__PURE__ */ jsx(Breadcrumb, { className: "mb-6", children: /* @__PURE__ */ jsx(BreadcrumbList, { children: items.map((item, index) => {
      const last = index === items.length - 1;
      return (
        // The separator must be a sibling of the item, not a child of it:
        // it renders an <li>, and a nested <li> makes the HTML parser
        // auto-close the outer one, so the server markup and the React
        // tree disagree and hydration fails.
        /* @__PURE__ */ jsxs(Fragment$1, { children: [
          /* @__PURE__ */ jsx(BreadcrumbItem, { children: last ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.label }) : /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: item.to, children: item.label }) }) }),
          !last && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
        ] }, item.to)
      );
    }) }) })
  ] });
}
export {
  Breadcrumbs as B
};
