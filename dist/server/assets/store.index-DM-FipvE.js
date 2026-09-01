import { d as Button, g as cn, m as useI18n } from "./api-Bx9sNaAQ.js";
import { Y as useClinicStore } from "./router-DVdLxzaP.js";
import { n as CtaBand, o as SectionHeading } from "./sections-_CRhKHin.js";
import { t as Input } from "./input-DYbpUre4.js";
import { t as ProductCard } from "./ProductCard-DDhiDoYK.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownWideNarrow, PackageSearch, Search, ShoppingBag } from "lucide-react";
//#region src/routes/store.index.tsx?tsr-split=component
var PRODUCT_CATEGORIES = [
	"food",
	"treats",
	"toys",
	"grooming",
	"health",
	"accessories"
];
var PET_TYPES = [
	"dog",
	"cat",
	"both"
];
var SORTS = [
	{
		key: "featured",
		label: "store.sort.featured"
	},
	{
		key: "newest",
		label: "store.sort.newest"
	},
	{
		key: "price-asc",
		label: "store.sort.priceAsc"
	},
	{
		key: "price-desc",
		label: "store.sort.priceDesc"
	},
	{
		key: "name",
		label: "store.sort.name"
	}
];
function sortProducts(products, sort) {
	const list = [...products];
	switch (sort) {
		case "price-asc": return list.sort((a, b) => a.price - b.price);
		case "price-desc": return list.sort((a, b) => b.price - a.price);
		case "name": return list.sort((a, b) => a.name.localeCompare(b.name));
		case "newest": return list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
		default: return list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
	}
}
function StorePage() {
	const { t } = useI18n();
	const { products } = useClinicStore();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [petType, setPetType] = useState("all");
	const [sort, setSort] = useState("featured");
	const q = query.trim().toLowerCase();
	const filtered = sortProducts(products.filter((p) => {
		if (category !== "all" && p.category !== category) return false;
		if (petType !== "all" && (p.petType ?? "both") !== petType && (p.petType ?? "both") !== "both") return false;
		if (!q) return true;
		return `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
	}), sort);
	const categories = PRODUCT_CATEGORIES.filter((c) => products.some((p) => p.category === c));
	const petTypes = PET_TYPES.filter((p) => products.some((x) => (x.petType ?? "both") === p));
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("section", {
			className: "hero-gradient border-b border-border pb-16 pt-32 sm:pt-40",
			children: /* @__PURE__ */ jsx("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
				children: /* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: t("page.store.eyebrow"),
					title: t("page.store.title"),
					description: t("page.store.desc"),
					as: "h1"
				})
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-full lg:max-w-sm",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: t("store.search"),
							className: "pl-9",
							"aria-label": t("store.search")
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-3",
						children: /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ jsx(ArrowDownWideNarrow, { className: "size-4" }), /* @__PURE__ */ jsx("select", {
								value: sort,
								onChange: (e) => setSort(e.target.value),
								className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
								"aria-label": t("store.sortLabel"),
								children: SORTS.map((s) => /* @__PURE__ */ jsx("option", {
									value: s.key,
									children: t(s.label)
								}, s.key))
							})]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setCategory("all"),
						className: cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", category === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t("store.all")
					}), categories.map((c) => /* @__PURE__ */ jsx("button", {
						onClick: () => setCategory(c),
						className: cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t(`store.cat.${c}`)
					}, c))]
				}),
				petTypes.length > 1 && /* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setPetType("all"),
						className: cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", petType === "all" ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t("store.pet.all")
					}), petTypes.map((p) => /* @__PURE__ */ jsx("button", {
						onClick: () => setPetType(p),
						className: cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", petType === p ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t(`store.pet.${p}`)
					}, p))]
				}),
				products.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center gap-4 py-24 text-center",
					children: [/* @__PURE__ */ jsx(PackageSearch, { className: "size-10 text-muted-foreground" }), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: t("store.loading")
					})]
				}) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center gap-4 py-24 text-center",
					children: [/* @__PURE__ */ jsx(PackageSearch, { className: "size-10 text-muted-foreground" }), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: t("store.empty")
					})]
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
					className: "mb-4 text-xs text-muted-foreground",
					children: t("store.showing", {
						count: String(filtered.length),
						total: String(products.length)
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
					children: filtered.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
				})] })
			]
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-6xl px-5 pb-12 sm:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3 rounded-3xl border border-border bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(ShoppingBag, { className: "size-5" })
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: t("store.collectHint")
					})]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/contact",
						children: t("store.contactUs")
					})
				})]
			})
		}),
		/* @__PURE__ */ jsx(CtaBand, {})
	] });
}
//#endregion
export { StorePage as component };
