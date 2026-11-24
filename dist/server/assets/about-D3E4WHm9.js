import { t as Breadcrumbs } from "./Breadcrumbs-k8oN6GwC.js";
import { a as SectionHeading } from "./sections-DfemFlRo.js";
import { t as PageIntro } from "./PageIntro-DzkH02Sn.js";
import { n as Reveal, t as CountUp } from "./motion-primitives-Cr0Ewoch.js";
import { at as useClinicStore, ft as STATS, mt as WHY_US } from "./router-DPSQYpfo.js";
import { E as useI18n } from "./api-ByZyPq3i.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/assets/clinic-interior.jpg
var clinic_interior_default = "/assets/clinic-interior-BfMocDbV.jpg";
// src/routes/about.tsx?tsr-split=component
function AboutPage() {
	const { doctors } = useClinicStore();
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageIntro, {
			eyebrow: t("page.about.eyebrow"),
			title: t("page.about.title"),
			description: t("page.about.desc"),
			crumb: /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: t("crumb.home"),
				to: "/"
			}, {
				label: t("crumb.about"),
				to: "/about"
			}] })
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-6xl px-5 py-16 sm:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid items-center gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", {
					className: "overflow-hidden rounded-3xl border border-border shadow-lg",
					children: /* @__PURE__ */ jsx("img", {
						src: clinic_interior_default,
						alt: t("img.clinic"),
						loading: "lazy",
						width: 1036,
						height: 870,
						className: "h-full w-full object-cover"
					})
				}) }), /* @__PURE__ */ jsx("div", {
					className: "space-y-8",
					children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsx(Reveal, {
						delay: i * .06,
						children: /* @__PURE__ */ jsxs("div", {
							className: "border-l-2 border-primary pl-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-base font-semibold",
								children: t(`about.principle.${i}.title`)
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: t(`about.principle.${i}.body`)
							})]
						})
					}, i))
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "border-y border-border bg-surface py-16",
			children: /* @__PURE__ */ jsx("dl", {
				className: "mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4",
				children: STATS.map((stat, i) => /* @__PURE__ */ jsx(Reveal, {
					delay: i * .06,
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
						className: "text-3xl font-bold tracking-tight",
						children: /* @__PURE__ */ jsx(CountUp, {
							value: i === 1 ? doctors.length : stat.value,
							suffix: i === 1 ? "" : stat.suffix
						})
					}), /* @__PURE__ */ jsx("dd", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: t(`stats.${i}`)
					})] })
				}, stat.label))
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-6xl px-5 py-20 sm:px-8",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("page.about.standards"),
				title: t("why.title")
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: WHY_US.map((item, i) => /* @__PURE__ */ jsx(Reveal, {
					delay: i % 3 * .06,
					children: /* @__PURE__ */ jsxs("div", {
						className: "h-full rounded-2xl border border-border bg-card p-6 shadow-card",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold",
							children: t(`whyitem.${i}.title`)
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t(`whyitem.${i}.detail`)
						})]
					})
				}, item.title))
			})]
		})
	] });
}
export { AboutPage as component };
