import { y as cn } from "./api-D3RhbogT.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
//#region src/components/ui/breadcrumb.tsx
var Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", {
	ref,
	"aria-label": "breadcrumb",
	...props
}));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ol", {
	ref,
	className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
	...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	className: cn("inline-flex items-center gap-1.5", className),
	...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		ref,
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("span", {
	ref,
	role: "link",
	"aria-disabled": "true",
	"aria-current": "page",
	className: cn("font-normal text-foreground", className),
	...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsx("li", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
	...props,
	children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({ className, ...props }) => /* @__PURE__ */ jsxs("span", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
		className: "sr-only",
		children: "More"
	})]
});
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
//#endregion
//#region src/components/site/Breadcrumbs.tsx
var SITE_URL = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_SITE_URL"] || "https://pawmclinnic.com";
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
	}), /* @__PURE__ */ jsx(Breadcrumb, {
		className: "mb-6",
		children: /* @__PURE__ */ jsx(BreadcrumbList, { children: items.map((item, index) => {
			const last = index === items.length - 1;
			return /* @__PURE__ */ jsxs(BreadcrumbItem, { children: [last ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.label }) : /* @__PURE__ */ jsx(BreadcrumbLink, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Link, {
					to: item.to,
					children: item.label
				})
			}), !last && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})] }, item.to);
		}) })
	})] });
}
//#endregion
export { Breadcrumbs as t };
