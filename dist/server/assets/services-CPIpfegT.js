import { t as Breadcrumbs } from "./Breadcrumbs-CT6VD5Gg.js";
import { a as SectionHeading, o as ServicesGrid } from "./sections-Dy7GqhXS.js";
import { E as useI18n } from "./api-nmFq_iEz.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/routes/services.tsx?tsr-split=component
function ServicesPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
		className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children: [/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: t("crumb.home"),
				to: "/"
			}, {
				label: t("crumb.services"),
				to: "/services"
			}] }), /* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("page.services.eyebrow"),
				title: t("page.services.title"),
				description: t("page.services.desc"),
				as: "h1"
			})]
		})
	}), /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8",
		children: /* @__PURE__ */ jsx(ServicesGrid, {})
	})] });
}
export { ServicesPage as component };
