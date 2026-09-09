import { pt as useI18n } from "./clinic-store-ClM7VlKI.js";
import { a as SectionHeading, o as ServicesGrid } from "./sections-Db7kKIks.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/services.tsx?tsr-split=component
function ServicesPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
		className: "hero-gradient border-b border-border pb-16 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children: /* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("page.services.eyebrow"),
				title: t("page.services.title"),
				description: t("page.services.desc"),
				as: "h1"
			})
		})
	}), /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8",
		children: /* @__PURE__ */ jsx(ServicesGrid, {})
	})] });
}
//#endregion
export { ServicesPage as component };
