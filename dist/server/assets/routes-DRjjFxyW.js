import { t as ProductCard } from "./ProductCard-DGUWJ98E.js";
import { a as SectionHeading, c as WhyUs, i as Hero, l as SectionFrame, n as DoctorCard, o as ServicesGrid, r as Faq, s as Testimonials, t as CtaBand } from "./sections-7s5mmibJ.js";
import { it as useClinicStore, v as Button } from "./router-DDcxr_bL.js";
import { E as useI18n } from "./api-BJSb2KbP.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
// src/routes/index.tsx?tsr-split=component
function Index() {
	const { doctors, products } = useClinicStore();
	const { t } = useI18n();
	const featured = [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 4);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsxs(SectionFrame, { children: [/* @__PURE__ */ jsx(SectionHeading, {
			eyebrow: t("services.eyebrow"),
			title: t("home.services.title"),
			description: t("home.services.desc")
		}), /* @__PURE__ */ jsx(ServicesGrid, { limit: 6 })] }),
		featured.length > 0 && /* @__PURE__ */ jsxs(SectionFrame, {
			tone: "surface",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: t("home.shop.eyebrow"),
					title: t("home.shop.title"),
					description: t("home.shop.desc")
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					className: "mb-1",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/store",
						children: [t("home.shop.browse"), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })]
					})
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: featured.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
			})]
		}),
		/* @__PURE__ */ jsx(WhyUs, {}),
		/* @__PURE__ */ jsxs(SectionFrame, {
			tone: "surface",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("team.eyebrow"),
				title: t("home.team.title"),
				description: t("home.team.desc")
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: doctors.slice(0, 3).map((doctor, i) => /* @__PURE__ */ jsx(DoctorCard, {
					doctor,
					index: i
				}, doctor.id))
			})]
		}),
		/* @__PURE__ */ jsx(Testimonials, {}),
		/* @__PURE__ */ jsx(Faq, {}),
		/* @__PURE__ */ jsx(CtaBand, {})
	] });
}
export { Index as component };
