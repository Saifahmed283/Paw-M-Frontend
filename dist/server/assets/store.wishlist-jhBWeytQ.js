import { K as Button, Y as useI18n, j as useClinicStore } from "./clinic-store-DrUg0bOc.js";
import { l as useWishlist } from "./router-CnQ8GeEY.js";
import { n as CtaBand, o as SectionHeading } from "./sections-C3XF9aXT.js";
import { t as ProductCard } from "./ProductCard-GLS-T1qo.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Heart } from "lucide-react";
//#region src/routes/store.wishlist.tsx?tsr-split=component
function WishlistPage() {
	const { t } = useI18n();
	const { products } = useClinicStore();
	const wished = useWishlist();
	const items = products.filter((p) => wished.includes(p.id));
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("section", {
			className: "hero-gradient border-b border-border pb-16 pt-32 sm:pt-40",
			children: /* @__PURE__ */ jsx("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
				children: /* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: t("page.wishlist.eyebrow"),
					title: t("page.wishlist.title"),
					description: t("page.wishlist.desc"),
					as: "h1"
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-6xl px-5 py-12 sm:px-8",
			children: items.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center gap-4 py-24 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(Heart, { className: "size-8" })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "max-w-md text-sm text-muted-foreground",
						children: t("store.wishlistEmpty")
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "mt-2 shadow-glow",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/store",
							children: t("store.wishlistBrowse")
						})
					})
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
				className: "mb-4 text-xs text-muted-foreground",
				children: t("store.showing", {
					count: String(items.length),
					total: String(items.length)
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
			})] })
		}),
		/* @__PURE__ */ jsx(CtaBand, {})
	] });
}
//#endregion
export { WishlistPage as component };
