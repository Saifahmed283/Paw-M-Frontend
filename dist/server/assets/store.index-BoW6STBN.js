import { t as Breadcrumbs } from "./Breadcrumbs-BzB4wbqR.js";
import { t as ProductCard } from "./ProductCard-BT0X2mDc.js";
import { t as PageIntro } from "./PageIntro-DtpNSest.js";
import { _ as Button, rt as useClinicStore } from "./router-DMCcxE3G.js";
import { t as Input } from "./input-BEFRZ_lg.js";
import { D as cn, E as useI18n } from "./api-BGK8fGh3.js";
import { n as categoryKey, r as countByCategory } from "./product-categories-CQtQycxr.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight, PackageSearch, Search, ShoppingBag } from "lucide-react";
// src/routes/store.index.tsx?tsr-split=component
var PAGE_SIZE = 12;
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
	const { t, tOr } = useI18n();
	const { products } = useClinicStore();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [petType, setPetType] = useState("all");
	const [sort, setSort] = useState("featured");
	const [page, setPage] = useState(1);
	useEffect(() => setPage(1), [
		query,
		category,
		petType,
		sort
	]);
	const q = query.trim().toLowerCase();
	const filtered = sortProducts(products.filter((p) => {
		if (category !== "all" && categoryKey(p.category) !== category) return false;
		if (petType !== "all" && (p.petType ?? "both") !== petType && (p.petType ?? "both") !== "both") return false;
		if (!q) return true;
		return `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
	}), sort);
	const categories = countByCategory(products);
	const petTypes = PET_TYPES.filter((p) => products.some((x) => (x.petType ?? "both") === p));
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const visiblePages = Array.from(/* @__PURE__ */ new Set([
		1,
		pageCount,
		currentPage - 1,
		currentPage,
		currentPage + 1
	])).filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(PageIntro, {
			eyebrow: t("page.store.eyebrow"),
			title: t("page.store.title"),
			description: t("page.store.desc"),
			crumb: /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: t("crumb.home"),
				to: "/"
			}, {
				label: t("crumb.store"),
				to: "/store"
			}] })
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
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setCategory("all"),
						className: cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", category === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: [t("store.all"), /* @__PURE__ */ jsx("span", {
							className: "tabular-nums opacity-60",
							children: products.length
						})]
					}), categories.map(({ key, count }) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setCategory(key),
						className: cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", category === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: [tOr(`store.cat.${key}`, key), /* @__PURE__ */ jsx("span", {
							className: "tabular-nums opacity-60",
							children: count
						})]
					}, key))]
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
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("p", {
						className: "mb-4 text-xs text-muted-foreground",
						children: t("dash.pager.showing", {
							from: String(filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1),
							to: String(Math.min(currentPage * PAGE_SIZE, filtered.length)),
							total: String(filtered.length)
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: pageItems.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
					}),
					pageCount > 1 && /* @__PURE__ */ jsxs("nav", {
						className: "mt-8 flex flex-wrap items-center justify-center gap-1.5",
						"aria-label": t("dash.pager.next"),
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setPage((p) => Math.max(1, p - 1)),
								disabled: currentPage <= 1,
								className: "grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
								"aria-label": t("dash.pager.prev"),
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4 rtl:rotate-180" })
							}),
							visiblePages.map((p) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setPage(p),
								"aria-current": p === currentPage ? "page" : void 0,
								className: cn("grid size-9 place-items-center rounded-lg border text-sm font-medium transition-colors", p === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
								children: p
							}, p)),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setPage((p) => Math.min(pageCount, p + 1)),
								disabled: currentPage >= pageCount,
								className: "grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
								"aria-label": t("dash.pager.next"),
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 rtl:rotate-180" })
							})
						]
					})
				] })
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
		})
	] });
}
export { StorePage as component };
