import { k as useI18n, m as useClinicStore } from "./router-Cv6iU0mZ.js";
import { a as Hero, c as Testimonials, i as Faq, l as WhyUs, n as CtaBand, o as SectionHeading, r as DoctorCard, s as ServicesGrid, t as BookingTimeline } from "./sections-B9FkTKCo.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	const { doctors } = useClinicStore();
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-6xl px-5 py-20 sm:px-8",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("services.eyebrow"),
				title: t("home.services.title"),
				description: t("home.services.desc")
			}), /* @__PURE__ */ jsx(ServicesGrid, { limit: 6 })]
		}),
		/* @__PURE__ */ jsx(WhyUs, {}),
		/* @__PURE__ */ jsx("section", {
			className: "border-t border-border bg-surface py-20",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
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
			})
		}),
		/* @__PURE__ */ jsx(BookingTimeline, {}),
		/* @__PURE__ */ jsx(Testimonials, {}),
		/* @__PURE__ */ jsx(Faq, {}),
		/* @__PURE__ */ jsx(CtaBand, {})
	] });
}
//#endregion
export { Index as component };
