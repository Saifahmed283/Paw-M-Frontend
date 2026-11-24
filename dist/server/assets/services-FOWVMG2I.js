import { t as Breadcrumbs } from "./Breadcrumbs-k8oN6GwC.js";
import { o as ServicesGrid } from "./sections-DfemFlRo.js";
import { t as PageIntro } from "./PageIntro-DzkH02Sn.js";
import { E as useI18n } from "./api-ByZyPq3i.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/routes/services.tsx?tsr-split=component
function ServicesPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageIntro, {
		eyebrow: t("page.services.eyebrow"),
		title: t("page.services.title"),
		description: t("page.services.desc"),
		crumb: /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
			label: t("crumb.home"),
			to: "/"
		}, {
			label: t("crumb.services"),
			to: "/services"
		}] })
	}), /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8",
		children: /* @__PURE__ */ jsx(ServicesGrid, {})
	})] });
}
export { ServicesPage as component };
