import { M as useClinicStore, Q as cn, X as useI18n, q as Button } from "./clinic-store-Cm06Z7c8.js";
import { a as Hero, c as Testimonials, i as Faq, l as WhyUs, n as CtaBand, o as SectionHeading, r as DoctorCard, s as ServicesGrid, t as BookingTimeline } from "./sections-DQl3cnjY.js";
import { n as CardContent, t as Card } from "./card-CLYrNcV8.js";
import { t as ProductCard } from "./ProductCard-Cv6NcjWa.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	const { doctors, products, reviews } = useClinicStore();
	const { t, lang } = useI18n();
	const featured = [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 4);
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
		featured.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "border-y border-border bg-surface py-20",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
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
			})
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
		(() => {
			const googleReviews = reviews.filter((r) => r.productId === "clinic" && r.status === "approved").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
			if (googleReviews.length === 0) return null;
			const avgRating = googleReviews.reduce((s, r) => s + r.rating, 0) / googleReviews.length;
			return /* @__PURE__ */ jsx("section", {
				className: "border-t border-border py-20",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-6xl px-5 sm:px-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center gap-2 text-sm text-amber-600",
							children: [
								/* @__PURE__ */ jsx(Star, { className: "size-4 fill-amber-400 text-amber-400" }),
								/* @__PURE__ */ jsx("span", {
									className: "font-bold",
									children: avgRating.toFixed(1)
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground",
									children: [
										"(",
										googleReviews.length,
										" reviews)"
									]
								})
							]
						}),
						/* @__PURE__ */ jsx(SectionHeading, {
							eyebrow: "GOOGLE",
							title: t("homepage.clinicReviews.title"),
							description: t("homepage.clinicReviews.subtitle")
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: googleReviews.map((r) => /* @__PURE__ */ jsx(Card, {
								className: "flex flex-col",
								children: /* @__PURE__ */ jsxs(CardContent, {
									className: "flex flex-1 flex-col gap-3 p-5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-sm font-semibold",
												children: r.author
											}), /* @__PURE__ */ jsx("time", {
												className: "text-xs text-muted-foreground",
												dateTime: r.createdAt,
												children: new Date(r.createdAt).toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
													month: "short",
													year: "numeric"
												})
											})]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "flex gap-0.5",
											children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(Star, { className: cn("size-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-border") }, i))
										}),
										/* @__PURE__ */ jsx("p", {
											className: "flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4",
											children: r.comment
										})
									]
								})
							}, r.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-8 text-center",
							children: /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "gap-2",
								children: /* @__PURE__ */ jsxs("a", {
									href: `https://search.google.com/local/writereview?placeid={{googlePlaceId}}`,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ jsx(MessageSquare, { className: "size-4" }), t("homepage.clinicReviews.allReviews")]
								})
							})
						})
					]
				})
			});
		})(),
		/* @__PURE__ */ jsx(CtaBand, {})
	] });
}
//#endregion
export { Index as component };
