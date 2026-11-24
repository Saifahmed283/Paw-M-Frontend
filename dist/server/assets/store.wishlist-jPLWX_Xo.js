import { t as Breadcrumbs } from "./Breadcrumbs-Dx-Tv5xV.js";
import { t as ProductCard } from "./ProductCard-DGUWJ98E.js";
import { t as PageIntro } from "./PageIntro-CHwQkb3u.js";
import { h as useWishlist, it as useClinicStore, v as Button } from "./router-DDcxr_bL.js";
import { E as useI18n } from "./api-BJSb2KbP.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Heart } from "lucide-react";
// src/routes/store.wishlist.tsx?tsr-split=component
function WishlistPage() {
	const { t } = useI18n();
	const { products } = useClinicStore();
	const wished = useWishlist();
	const items = products.filter((p) => wished.includes(p.id));
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageIntro, {
		eyebrow: t("page.wishlist.eyebrow"),
		title: t("page.wishlist.title"),
		description: t("page.wishlist.desc"),
		crumb: /* @__PURE__ */ jsx(Breadcrumbs, { items: [
			{
				label: t("crumb.home"),
				to: "/"
			},
			{
				label: t("crumb.store"),
				to: "/store"
			},
			{
				label: t("page.wishlist.title"),
				to: "/store/wishlist"
			}
		] })
	}), /* @__PURE__ */ jsx("section", {
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
	})] });
}
export { WishlistPage as component };
