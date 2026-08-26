import { N as useClinicStore, Q as cn, X as useI18n, q as Button } from "./clinic-store-CwRlAe_1.js";
import { T as formatPrice, _ as useIsWished, g as toggleWishlist, y as addToCart } from "./router-odAv7K6C.js";
import { t as Badge } from "./badge-C6bjIBsv.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { Check, Dog, Heart, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/components/site/ProductCard.tsx
var PET_ICON = {
	dog: Dog,
	cat: Dog,
	both: Dog
};
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
			toast.success(nowWished ? t("wishlist.removed") : t("wishlist.added"), { id: `wl-${productId}` });
		},
		"aria-label": wished ? t("wishlist.remove") : t("wishlist.add"),
		"aria-pressed": wished,
		className: cn("grid size-8 place-items-center rounded-full bg-background/80 shadow-card backdrop-blur transition-all hover:scale-110", className),
		children: /* @__PURE__ */ jsx(Heart, { className: cn("size-4 transition-colors", wished ? "fill-rose-500 text-rose-500" : "text-muted-foreground") })
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
	const lowStock = !out && product.stock <= 5;
	const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
	const PetIcon = PET_ICON[product.petType ?? "both"] ?? Dog;
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
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute left-3 top-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Badge, {
							className: "border border-border/60 bg-background/60 text-foreground backdrop-blur-md dark:bg-background/80 dark:text-foreground",
							children: t(`store.cat.${product.category}`)
						}),
						onSale && product.compareAtPrice != null && /* @__PURE__ */ jsxs(Badge, {
							className: "border-amber-300/60 bg-amber-400 text-amber-900 backdrop-blur-md dark:border-amber-400/40 dark:bg-amber-500/90 dark:text-amber-50",
							children: [
								"-",
								Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100),
								"%"
							]
						}),
						product.featured && /* @__PURE__ */ jsxs(Badge, {
							className: "border border-amber-300/60 bg-amber-500 text-amber-900 backdrop-blur-md dark:border-amber-400/50 dark:bg-amber-400/90 dark:text-amber-950",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 size-3" }), t("store.featured")]
						})
					]
				}),
				/* @__PURE__ */ jsx(WishlistButton, {
					productId: product.id,
					className: "absolute right-3 top-3"
				}),
				out ? /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[2px]",
					children: /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background",
						children: t("store.outOfStock")
					})
				}) : /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 6
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						delay: .3,
						duration: .3
					},
					className: "absolute bottom-3 right-3",
					children: /* @__PURE__ */ jsxs("span", {
						className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md border", lowStock ? "border-amber-400/60 bg-amber-400/90 text-amber-900 dark:text-amber-950" : "border-success/60 bg-success/90 text-success-foreground dark:text-success-foreground"),
						children: [/* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", lowStock ? "bg-amber-700" : "bg-success-foreground") }), lowStock ? `${product.stock} left` : "In stock"]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col gap-2 p-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ jsx(PetIcon, { className: "size-3" }), t(`store.pet.${product.petType ?? "both"}`)]
					})
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "line-clamp-2 text-sm font-semibold leading-snug",
					children: product.name
				}),
				/* @__PURE__ */ jsx("p", {
					className: "line-clamp-2 text-xs leading-relaxed text-muted-foreground",
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
