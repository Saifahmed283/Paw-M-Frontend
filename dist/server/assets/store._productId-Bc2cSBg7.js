import { t as Breadcrumbs } from "./Breadcrumbs-DGkWoc1l.js";
import { n as WishlistButton, t as ProductCard } from "./ProductCard-COYhDigR.js";
import { t as Badge } from "./badge-BrfPAPM8.js";
import { D as useI18n, b as Button } from "./api-C5O-PhXZ.js";
import { t as Input } from "./input-ByZaljcB.js";
import { t as Label } from "./label-CmTMewK2.js";
import { t as Textarea } from "./textarea-Bn5H-gaJ.js";
import { M as createReview, h as addToCart, i as Route, st as useClinicStore, x as formatPrice } from "./router-DI83Hg0_.js";
import { n as categoryKey } from "./product-categories-CQtQycxr.js";
import { r as withSiteUrl, t as SITE_URL } from "./seo-BkFmoGFZ.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronLeft, Minus, Plus, ShoppingBag, Star, StarHalf } from "lucide-react";
import { toast } from "sonner";
// src/routes/store.$productId.tsx?tsr-split=component
function AddToCartButton({ product, qty }) {
	const { t } = useI18n();
	const [added, setAdded] = useState(false);
	return /* @__PURE__ */ jsxs(Button, {
		size: "lg",
		variant: added ? "outline" : "default",
		className: "w-full shadow-glow sm:w-auto",
		onClick: () => {
			addToCart(product, qty);
			setAdded(true);
			toast.success(t("store.added"));
			window.setTimeout(() => setAdded(false), 1500);
		},
		children: [added ? /* @__PURE__ */ jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsx(ShoppingBag, { className: "size-4" }), added ? t("store.added") : t("store.addToCart")]
	});
}
function Stars({ rating, className = "size-4" }) {
	return /* @__PURE__ */ jsx("span", {
		className: "inline-flex items-center gap-0.5",
		"aria-label": `${rating}/5`,
		children: Array.from({ length: 5 }, (_, i) => {
			const filled = rating >= i + 1;
			return !filled && rating > i && rating < i + 1 ? /* @__PURE__ */ jsx(StarHalf, { className: `${className} fill-amber-400 text-amber-400` }, i) : /* @__PURE__ */ jsx(Star, { className: `${className} ${filled ? "fill-amber-400 text-amber-400" : "text-border"}` }, i);
		})
	});
}
function ReviewForm({ productId }) {
	const { t } = useI18n();
	const [author, setAuthor] = useState("");
	const [rating, setRating] = useState(5);
	const [hover, setHover] = useState(0);
	const [comment, setComment] = useState("");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		if (!author.trim() || comment.trim().length < 4) {
			toast.error(t("reviews.required"));
			return;
		}
		setBusy(true);
		try {
			await createReview({
				productId,
				author: author.trim(),
				rating,
				comment: comment.trim()
			});
			setSent(true);
			toast.success(t("reviews.thanks"));
		} catch {
			toast.error(t("reviews.failed"));
		} finally {
			setBusy(false);
		}
	};
	if (sent) return /* @__PURE__ */ jsx("div", {
		className: "rounded-2xl border border-success/25 bg-success/10 p-5 text-sm",
		children: t("reviews.sent")
	});
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		className: "grid gap-4 rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
				className: "text-xs font-medium text-muted-foreground",
				children: t("reviews.rating")
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-1.5 flex gap-1",
				children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setRating(i + 1),
					onMouseEnter: () => setHover(i + 1),
					onMouseLeave: () => setHover(0),
					"aria-label": `${i + 1} ${t("reviews.stars")}`,
					className: "transition-transform hover:scale-110",
					children: /* @__PURE__ */ jsx(Star, { className: `size-6 ${(hover || rating) > i ? "fill-amber-400 text-amber-400" : "text-border"}` })
				}, i))
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "rv-name",
					className: "text-xs font-medium text-muted-foreground",
					children: t("reviews.name")
				}), /* @__PURE__ */ jsx(Input, {
					id: "rv-name",
					value: author,
					onChange: (e) => setAuthor(e.target.value),
					className: "mt-1.5",
					maxLength: 80,
					placeholder: t("reviews.namePlaceholder")
				})] }), /* @__PURE__ */ jsx("div", {
					className: "sm:self-end",
					children: /* @__PURE__ */ jsx(Button, {
						type: "submit",
						size: "sm",
						disabled: busy,
						className: "w-full sm:w-auto",
						children: t("reviews.submit")
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
				htmlFor: "rv-comment",
				className: "text-xs font-medium text-muted-foreground",
				children: t("reviews.comment")
			}), /* @__PURE__ */ jsx(Textarea, {
				id: "rv-comment",
				rows: 3,
				value: comment,
				onChange: (e) => setComment(e.target.value),
				className: "mt-1.5",
				placeholder: t("reviews.commentPlaceholder")
			})] })
		]
	});
}
function ReviewsSection({ productId }) {
	const { t } = useI18n();
	const { reviews } = useClinicStore();
	const list = useMemo(() => reviews.filter((r) => r.productId === productId && r.status === "approved").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [reviews, productId]);
	const avg = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
	return /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold",
					children: t("reviews.title")
				}), list.length > 0 && /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold",
					children: [
						/* @__PURE__ */ jsx(Stars, { rating: avg }),
						avg.toFixed(1),
						" · ",
						list.length,
						" ",
						t("reviews.count")
					]
				})]
			}), list.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "mt-5 text-sm text-muted-foreground",
				children: t("reviews.none")
			}) : /* @__PURE__ */ jsx("ul", {
				className: "mt-5 space-y-4",
				children: list.map((r) => /* @__PURE__ */ jsxs("li", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: r.author
							}), /* @__PURE__ */ jsx(Stars, {
								rating: r.rating,
								className: "size-3.5"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: r.comment
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-[11px] text-muted-foreground",
							children: new Date(r.createdAt).toLocaleDateString()
						})
					]
				}, r.id))
			})] }), /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-bold uppercase tracking-wide text-muted-foreground",
					children: t("reviews.writeTitle")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("reviews.writeDesc")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsx(ReviewForm, { productId })
				})
			] })]
		})
	});
}
function ProductPage() {
	const { productId } = Route.useParams();
	const { t, tOr } = useI18n();
	const { products, settings } = useClinicStore();
	const [qty, setQty] = useState(1);
	const product = products.find((p) => p.id === productId);
	useEffect(() => {
		setQty(1);
	}, [productId]);
	useEffect(() => {
		if (product) document.title = `${product.name} — Paw-M Store`;
	}, [product, product?.name]);
	if (!product) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center px-5 pt-32",
		children: /* @__PURE__ */ jsx("div", {
			className: "text-center",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: t("store.loading")
			})
		})
	});
	const out = product.stock <= 0;
	const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
	const related = products.filter((p) => p.id !== product.id && categoryKey(p.category) === categoryKey(product.category)).slice(0, 4);
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description,
		image: product.image ? withSiteUrl(product.image) : `${SITE_URL}/og-image.png`,
		brand: {
			"@type": "Brand",
			name: "Paw-M"
		},
		offers: {
			"@type": "Offer",
			url: withSiteUrl(`/store/${product.id}`),
			priceCurrency: settings.currency,
			price: product.price,
			availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
			seller: {
				"@type": "Organization",
				name: "Paw-M Veterinary Clinic"
			}
		}
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(productJsonLd) }
		}),
		/* @__PURE__ */ jsx("section", {
			className: "hero-gradient border-b border-border pb-16 pt-32 sm:pt-40",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-5 sm:px-8",
				children: [
					/* @__PURE__ */ jsx(Breadcrumbs, { items: [
						{
							label: t("crumb.home"),
							to: "/"
						},
						{
							label: t("crumb.store"),
							to: "/store"
						},
						{
							label: product.name,
							to: `/store/${product.id}`
						}
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/store",
							className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
							children: [
								/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }),
								" ",
								t("store.back")
							]
						}), /* @__PURE__ */ jsx(WishlistButton, { productId: product.id })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 grid gap-10 lg:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative overflow-hidden rounded-3xl border border-border bg-white shadow-card",
							children: [product.image ? /* @__PURE__ */ jsx("img", {
								src: product.image,
								alt: product.name,
								className: "aspect-square size-full bg-white object-contain p-4 sm:p-8"
							}) : /* @__PURE__ */ jsx("div", { className: "aspect-square size-full bg-white" }), onSale && product.compareAtPrice != null && /* @__PURE__ */ jsxs(Badge, {
								className: "absolute left-4 top-4 bg-destructive/90 text-destructive-foreground",
								children: [
									t("store.sale"),
									" −",
									Math.round((product.compareAtPrice - product.price) / product.compareAtPrice * 100),
									"%"
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ jsx(Badge, { children: tOr(`store.cat.${categoryKey(product.category)}`, product.category) }),
										product.featured && /* @__PURE__ */ jsx(Badge, {
											className: "bg-primary/90 text-primary-foreground",
											children: t("store.featured")
										}),
										/* @__PURE__ */ jsx(Badge, {
											variant: out ? "secondary" : "default",
											className: out ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success",
											children: out ? t("store.outOfStock") : t("store.inStock", { count: String(product.stock) })
										})
									]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "mt-4 text-3xl font-bold tracking-tight",
									children: product.name
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex items-baseline gap-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-lg font-bold text-primary",
										children: formatPrice(product.price, settings.currency)
									}), onSale && product.compareAtPrice != null && /* @__PURE__ */ jsx("p", {
										className: "text-sm text-muted-foreground line-through",
										children: formatPrice(product.compareAtPrice, settings.currency)
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 leading-relaxed text-muted-foreground",
									children: product.description
								}),
								!out && /* @__PURE__ */ jsxs("div", {
									className: "mt-8 flex flex-wrap items-center gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center rounded-xl border border-input",
										children: [
											/* @__PURE__ */ jsx("button", {
												onClick: () => setQty((q) => Math.max(1, q - 1)),
												className: "grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground",
												"aria-label": t("store.decreaseQty"),
												children: /* @__PURE__ */ jsx(Minus, { className: "size-4" })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "w-10 text-center text-sm font-semibold",
												children: qty
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => setQty((q) => Math.min(product.stock, q + 1)),
												className: "grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground",
												"aria-label": t("store.increaseQty"),
												children: /* @__PURE__ */ jsx(Plus, { className: "size-4" })
											})
										]
									}), /* @__PURE__ */ jsx(AddToCartButton, {
										product,
										qty
									})]
								})
							]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(ReviewsSection, { productId: product.id }),
		related.length > 0 && /* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-6xl px-5 pb-16 pt-2 sm:px-8",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-bold",
				children: t("store.related")
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: related.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
			})]
		})
	] });
}
export { ProductPage as component };
