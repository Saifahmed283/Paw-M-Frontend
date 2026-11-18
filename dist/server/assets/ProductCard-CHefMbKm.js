import { t as Badge } from "./badge-DV9koV17.js";
import { D as cn, E as useI18n, y as Button } from "./api-Ba8azKWu.js";
import { _ as removeFromCart, f as toggleWishlist, h as addToCart, p as useIsWished, st as useClinicStore, v as setCartQty, x as formatPrice, y as useCart } from "./router-D3jxOZse.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Dog, Heart, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
// src/components/site/ProductCard.tsx
var PET_ICON = {
	dog: Dog,
	cat: Dog,
	both: Dog
};
function AddToCartButton({ product, compact = false }) {
	const { t } = useI18n();
	const cart = useCart();
	const out = product.stock <= 0;
	const inCart = cart.find((i) => i.id === product.id);
	if (out) return /* @__PURE__ */ jsx(Button, {
		size: "sm",
		disabled: true,
		className: cn("w-full", compact && "h-8"),
		children: t("store.outOfStock")
	});
	if (inCart) return /* @__PURE__ */ jsxs("div", {
		className: cn("flex w-full items-stretch overflow-hidden rounded-lg border bg-background", compact ? "h-8" : "h-9"),
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": t("store.decreaseQty"),
				title: t("store.decreaseQty"),
				onClick: (e) => {
					e.preventDefault();
					if (inCart.qty <= 1) removeFromCart(product.id);
					else setCartQty(product.id, inCart.qty - 1);
				},
				className: "grid w-8 shrink-0 place-items-center bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95",
				children: /* @__PURE__ */ jsx(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ jsx("span", {
				className: "flex min-w-8 flex-1 items-center justify-center border-x border-border/60 text-sm font-semibold text-foreground",
				children: inCart.qty
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": t("store.increaseQty"),
				title: t("store.increaseQty"),
				disabled: inCart.qty >= Math.max(1, inCart.stock),
				onClick: (e) => {
					e.preventDefault();
					addToCart(product);
				},
				className: "grid w-8 shrink-0 place-items-center bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
				children: /* @__PURE__ */ jsx(Plus, { className: "size-4" })
			})
		]
	});
	return /* @__PURE__ */ jsxs(Button, {
		size: "sm",
		className: cn("w-full transition-transform hover:scale-[1.03]", compact && "h-8"),
		onClick: (e) => {
			e.preventDefault();
			addToCart(product);
		},
		children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), t("store.addToCart")]
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
		className: "flex flex-col self-start",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-lg font-bold tracking-tight text-foreground",
			children: formatPrice(product.price, settings.currency)
		}), sale && /* @__PURE__ */ jsx("span", {
			className: "text-xs font-medium text-muted-foreground line-through",
			children: formatPrice(product.compareAtPrice ?? 0, settings.currency)
		})]
	});
}
function ProductCard({ product }) {
	const { t } = useI18n();
	const out = product.stock <= 0;
	const lowStock = !out && product.stock <= 5;
	const PetIcon = PET_ICON[product.petType ?? "both"] ?? Dog;
	return /* @__PURE__ */ jsxs(Link, {
		to: "/store/$productId",
		params: { productId: product.id },
		className: "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-raised",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[4/3] overflow-hidden bg-white",
			children: [
				product.image ? /* @__PURE__ */ jsx("img", {
					src: product.image,
					alt: product.name,
					loading: "lazy",
					className: "size-full bg-white object-contain p-2 sm:p-3"
				}) : /* @__PURE__ */ jsx("div", {
					className: "flex size-full items-center justify-center text-muted-foreground",
					children: /* @__PURE__ */ jsx("svg", {
						className: "size-12",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 1.5,
							d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						})
					})
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
				product.featured && /* @__PURE__ */ jsxs(Badge, {
					className: "absolute left-6 top-6 border-0 bg-primary/90 text-primary-foreground shadow-sm backdrop-blur-md",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 size-3" }), t("store.featured")]
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
				}) : /* @__PURE__ */ jsxs("span", {
					className: cn("pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md", lowStock ? "border-amber-400/60 bg-amber-400/90 text-amber-900 dark:text-amber-950" : "border-white/20 bg-white/90 text-emerald-700 dark:border-white/10 dark:bg-foreground/90 dark:text-background"),
					children: [/* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", lowStock ? "bg-amber-700" : "bg-emerald-500") }), lowStock ? t("store.left", { count: String(product.stock) }) : t("store.inStock")]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col p-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(PetIcon, { className: "size-3.5" }), t(`store.pet.${product.petType ?? "both"}`)]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground/40",
							children: "·"
						}),
						/* @__PURE__ */ jsx("span", { children: t(`store.cat.${product.category}`) })
					]
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "mt-2.5 line-clamp-2 text-[15px] font-semibold leading-snug transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400",
					children: product.name
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
					children: product.description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3.5",
					children: [/* @__PURE__ */ jsx(ProductPrice, { product }), /* @__PURE__ */ jsx("div", {
						className: "w-28 shrink-0",
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
export { WishlistButton as n, ProductCard as t };
