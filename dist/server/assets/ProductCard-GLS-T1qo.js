import { K as Button, Y as useI18n, Z as cn, j as useClinicStore } from "./clinic-store-DrUg0bOc.js";
import { c as useIsWished, h as formatPrice, s as toggleWishlist, u as addToCart } from "./router-CnQ8GeEY.js";
import { t as Badge } from "./badge-BpbohKIc.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/components/site/ProductCard.tsx
function AddToCartButton({ product, compact = false }) {
	const { t } = useI18n();
	const [added, setAdded] = useState(false);
	if (product.stock <= 0) return /* @__PURE__ */ jsx(Button, {
		size: "sm",
		disabled: true,
		className: cn("w-full", compact && "h-8"),
		children: t("store.outOfStock")
	});
	return /* @__PURE__ */ jsxs(Button, {
		size: "sm",
		variant: added ? "outline" : "default",
		className: cn("w-full", compact && "h-8"),
		onClick: (e) => {
			e.preventDefault();
			addToCart(product);
			setAdded(true);
			toast.success(t("store.added"));
			window.setTimeout(() => setAdded(false), 1500);
		},
		children: [added ? /* @__PURE__ */ jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsx(Plus, { className: "size-4" }), added ? t("store.added") : t("store.addToCart")]
	});
}
function WishlistButton({ productId, className }) {
	const { t } = useI18n();
	const wished = useIsWished(productId);
	return /* @__PURE__ */ jsx("button", {
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			const nowWished = toggleWishlist(productId);
			toast.success(nowWished ? t("wishlist.added") : t("wishlist.removed"), { id: `wl-${productId}` });
		},
		"aria-label": wished ? t("wishlist.remove") : t("wishlist.add"),
		"aria-pressed": wished,
		className: cn("grid size-8 place-items-center rounded-full bg-background/80 shadow-card backdrop-blur transition-colors hover:bg-background", className),
		children: /* @__PURE__ */ jsx(Heart, { className: cn("size-4", wished ? "fill-rose-500 text-rose-500" : "text-muted-foreground") })
	});
}
function ProductPrice({ product }) {
	const { settings } = useClinicStore();
	const sale = product.compareAtPrice != null && product.compareAtPrice > product.price;
	return /* @__PURE__ */ jsxs("span", {
		className: "flex items-baseline gap-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-lg font-bold",
			children: formatPrice(product.price, settings.currency)
		}), sale && /* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground line-through",
			children: formatPrice(product.compareAtPrice ?? 0, settings.currency)
		})]
	});
}
function ProductCard({ product }) {
	const { t } = useI18n();
	const out = product.stock <= 0;
	const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
	return /* @__PURE__ */ jsxs(Link, {
		to: "/store/$productId",
		params: { productId: product.id },
		className: "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-raised",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[4/3] overflow-hidden bg-muted",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: product.image,
					alt: product.name,
					loading: "lazy",
					className: "size-full object-cover transition-transform duration-500 group-hover:scale-105"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute left-3 top-3 flex gap-2",
					children: [/* @__PURE__ */ jsx(Badge, {
						className: "bg-background/80 backdrop-blur",
						children: t(`store.cat.${product.category}`)
					}), onSale && product.compareAtPrice != null && /* @__PURE__ */ jsxs(Badge, {
						className: "bg-destructive/90 text-destructive-foreground",
						children: [
							"-",
							Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100),
							"%"
						]
					})]
				}),
				/* @__PURE__ */ jsx(WishlistButton, {
					productId: product.id,
					className: "absolute right-3 top-3"
				}),
				out && /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[2px]",
					children: /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background",
						children: t("store.outOfStock")
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col gap-2 p-4",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "line-clamp-2 text-sm font-semibold leading-snug",
					children: product.name
				}),
				/* @__PURE__ */ jsx("p", {
					className: "line-clamp-2 text-xs text-muted-foreground",
					children: product.description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-auto flex items-end justify-between gap-2 pt-2",
					children: [/* @__PURE__ */ jsx(ProductPrice, { product }), /* @__PURE__ */ jsx("div", {
						className: "w-32",
						children: /* @__PURE__ */ jsx(AddToCartButton, {
							product,
							compact: true
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { WishlistButton as n, ProductCard as t };
