import { N as useClinicStore, _t as cn, gt as useI18n, o as createOrder, ut as Button } from "./clinic-store-Dc-Lo-AL.js";
import { v as formatPrice } from "./router-BdiTlQ-1.js";
import { t as Input } from "./input-hqsDskb7.js";
import { a as CardHeader, i as CardDescription, n as Card, o as CardTitle, r as CardContent, t as Separator } from "./separator-i8MS8qsd.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Barcode, CheckCircle2, ChevronLeft, Minus, Plus, ReceiptText, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/cashier.tsx?tsr-split=component
var PAYMENT_METHODS = [
	{
		value: "cash",
		icon: ReceiptText,
		title: "checkout.method.cash.title",
		desc: "checkout.method.cash.desc",
		short: "checkout.method.cash.short"
	},
	{
		value: "fawry",
		icon: ReceiptText,
		title: "checkout.method.fawry.title",
		desc: "checkout.method.fawry.desc",
		short: "checkout.method.fawry.short"
	},
	{
		value: "instapay",
		icon: ReceiptText,
		title: "checkout.method.instapay.title",
		desc: "checkout.method.instapay.desc",
		short: "checkout.method.instapay.short"
	}
];
function CashierPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "hero-gradient min-h-screen px-5 py-8 sm:py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl",
			children: [/* @__PURE__ */ jsxs(Link, {
				to: "/dashboard",
				className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-6",
				children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), " Back to Dashboard"]
			}), /* @__PURE__ */ jsx(CashierApp, {})]
		})
	});
}
function CashierApp() {
	const { t } = useI18n();
	const { products, settings } = useClinicStore();
	const [cart, setCart] = useState([]);
	const [barcodeInput, setBarcodeInput] = useState("");
	const [barcodeBuffer, setBarcodeBuffer] = useState("");
	const [barcodeTimeout, setBarcodeTimeout] = useState(null);
	const [method, setMethod] = useState("cash");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState(null);
	const barcodeInputRef = useRef(null);
	const total = cart.reduce((n, i) => n + i.qty * i.price, 0);
	const itemCount = cart.reduce((n, i) => n + i.qty, 0);
	const processBarcode = useCallback((code) => {
		const cleanCode = code.trim();
		if (!cleanCode) return;
		const product = products.find((p) => p.barcode === cleanCode);
		if (!product) {
			toast.error(t("cashier.productNotFound", { code: cleanCode }));
			return;
		}
		if (product.stock <= 0) {
			toast.error(t("cashier.outOfStock", { name: product.name }));
			return;
		}
		setCart((prev) => {
			const existing = prev.find((i) => i.id === product.id);
			if (existing) {
				if (existing.qty >= product.stock) {
					toast.error(t("cashier.maxStockReached", {
						name: product.name,
						stock: String(product.stock)
					}));
					return prev;
				}
				return prev.map((i) => i.id === product.id ? {
					...i,
					qty: i.qty + 1
				} : i);
			}
			return [...prev, {
				id: product.id,
				productId: product.id,
				name: product.name,
				price: product.price,
				qty: 1,
				stock: product.stock,
				image: product.image
			}];
		});
		toast.success(t("cashier.added", { name: product.name }));
	}, [products, t]);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "Enter") {
				e.preventDefault();
				processBarcode(barcodeBuffer);
				setBarcodeBuffer("");
				if (barcodeTimeout) clearTimeout(barcodeTimeout);
				return;
			}
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
				setBarcodeBuffer((prev) => prev + e.key);
				if (barcodeTimeout) clearTimeout(barcodeTimeout);
				setBarcodeTimeout(setTimeout(() => setBarcodeBuffer(""), 200));
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (barcodeTimeout) clearTimeout(barcodeTimeout);
		};
	}, [
		barcodeBuffer,
		barcodeTimeout,
		processBarcode
	]);
	const updateQty = (productId, delta) => {
		setCart((prev) => prev.map((i) => {
			if (i.id !== productId) return i;
			const newQty = i.qty + delta;
			if (newQty <= 0) return null;
			if (newQty > i.stock) {
				toast.error(t("cashier.maxStockReached", {
					name: i.name,
					stock: String(i.stock)
				}));
				return i;
			}
			return {
				...i,
				qty: newQty
			};
		}).filter(Boolean));
	};
	const removeItem = (productId) => {
		setCart((prev) => prev.filter((i) => i.id !== productId));
	};
	const clearCart = () => {
		setCart([]);
	};
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		if (cart.length === 0) {
			toast.error(t("cashier.emptyCart"));
			return;
		}
		if (method === "instapay" && !settings.instapay) {
			toast.error(t("checkout.instapayNotConfigured"));
			return;
		}
		setBusy(true);
		try {
			const order = await createOrder({
				customerName: "Walk-in Customer",
				phone: "",
				email: "",
				address: "",
				items: cart.map((i) => ({
					id: i.id,
					name: i.name,
					price: i.price,
					qty: i.qty
				})),
				paymentMethod: method,
				paymentRef: method === "instapay" || method === "fawry" ? "" : void 0
			});
			setResult({
				id: order.id,
				paymentMethod: order.paymentMethod,
				paymentRef: order.paymentRef
			});
			setCart([]);
			toast.success(t("cashier.orderCreated", { id: order.id }));
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			if (message.includes("only")) toast.error(message);
			else toast.error(t("cashier.failed"));
		} finally {
			setBusy(false);
		}
	};
	if (result) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center min-h-[50vh] space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "size-16 grid place-items-center rounded-2xl bg-success/15 text-success",
				children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8" })
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold",
				children: t("cashier.successTitle")
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground",
				children: t("cashier.successDesc")
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "font-mono text-lg",
				children: [
					t("cashier.orderId"),
					": ",
					result.id
				]
			}),
			result.paymentMethod === "fawry" && /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-primary/25 bg-primary/8 p-4 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold text-primary",
					children: t("checkout.fawryRefTitle")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 font-mono text-xl font-bold",
					children: result.paymentRef
				})]
			}),
			/* @__PURE__ */ jsx(Button, {
				size: "lg",
				onClick: () => setResult(null),
				className: "w-full max-w-xs",
				children: t("cashier.newSale")
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_400px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("cashier.scanBarcode")
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							ref: barcodeInputRef,
							type: "text",
							value: barcodeInput,
							onChange: (e) => setBarcodeInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									processBarcode(barcodeInput);
									setBarcodeInput("");
								}
							},
							placeholder: t("cashier.scanPlaceholder"),
							className: "w-64",
							autoComplete: "off"
						})]
					})]
				}), /* @__PURE__ */ jsx(CardDescription, { children: t("cashier.scanDesc") })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("input", {
						type: "text",
						className: "absolute inset-0 opacity-0 pointer-events-none",
						autoFocus: true,
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								processBarcode(barcodeBuffer);
								setBarcodeBuffer("");
								if (barcodeTimeout) clearTimeout(barcodeTimeout);
							}
						}
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Barcode, { className: "size-5" }), /* @__PURE__ */ jsx("span", { children: barcodeBuffer || t("cashier.waitingForScan") })]
					})]
				}) })] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
					className: "flex flex-row items-center justify-between",
					children: [/* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("cashier.cart", { count: String(itemCount) })
					}), cart.length > 0 && /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: clearCart,
						className: "text-destructive",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "size-4 mr-1" }),
							" ",
							t("cashier.clearCart")
						]
					})]
				}), /* @__PURE__ */ jsx(CardContent, { children: cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
					children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "size-12 mb-3 opacity-50" }), /* @__PURE__ */ jsx("p", { children: t("cashier.emptyCart") })]
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-2 max-h-[50vh] overflow-y-auto",
					children: cart.map((item) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: item.image,
								alt: item.name,
								className: "size-14 shrink-0 rounded-lg border border-border object-cover"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium truncate",
									children: item.name
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										formatPrice(item.price, settings.currency),
										" × ",
										item.qty
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										className: "h-7 w-7",
										onClick: () => updateQty(item.id, -1),
										disabled: item.qty <= 1,
										"aria-label": t("cashier.decrease"),
										children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "w-8 text-center text-sm font-medium",
										children: item.qty
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										className: "h-7 w-7",
										onClick: () => updateQty(item.id, 1),
										disabled: item.qty >= item.stock,
										"aria-label": t("cashier.increase"),
										children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7 text-destructive",
										onClick: () => removeItem(item.id),
										"aria-label": t("cashier.remove"),
										children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
									})
								]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold w-24 text-right",
								children: formatPrice(item.price * item.qty, settings.currency)
							})
						]
					}, item.id))
				}) })] })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-24 h-fit",
				children: /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: t("cashier.payment")
				}), /* @__PURE__ */ jsx(CardDescription, { children: t("cashier.paymentDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setMethod(m.value),
								className: cn("flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors w-full", method === m.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"),
								"aria-pressed": method === m.value,
								children: [/* @__PURE__ */ jsx("span", {
									className: cn("grid size-9 shrink-0 place-items-center rounded-lg", method === m.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
									children: /* @__PURE__ */ jsx(m.icon, { className: "size-4.5" })
								}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-sm font-semibold",
									children: t(m.title)
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-0.5 block text-xs leading-relaxed text-muted-foreground",
									children: t(m.desc)
								})] })]
							}, m.value))
						}),
						method === "fawry" && /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-primary/25 bg-primary/8 p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold text-primary",
								children: t("checkout.fawryHowTitle")
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
								children: t("checkout.fawryHow")
							})]
						}),
						method === "instapay" && /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-primary/25 bg-primary/8 p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "flex items-center gap-2 text-xs font-semibold text-primary",
								children: "InstaPay"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 font-mono text-sm font-bold",
								children: settings.instapay || t("checkout.instapayMissing")
							})]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: t("cashier.subtotal")
								}), /* @__PURE__ */ jsx("span", { children: formatPrice(total, settings.currency) })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: t("cashier.items")
								}), /* @__PURE__ */ jsx("span", { children: itemCount })]
							})]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-lg font-bold",
							children: [/* @__PURE__ */ jsx("span", { children: t("cashier.total") }), /* @__PURE__ */ jsx("span", { children: formatPrice(total, settings.currency) })]
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							onClick: () => document.getElementById("cashier-form")?.requestSubmit(),
							size: "lg",
							disabled: busy || cart.length === 0,
							className: "w-full shadow-glow",
							children: busy ? "…" : t("cashier.completeSale")
						})
					]
				})] })
			}),
			/* @__PURE__ */ jsx("form", {
				id: "cashier-form",
				onSubmit: submit,
				className: "hidden",
				children: /* @__PURE__ */ jsx("button", {
					type: "submit",
					hidden: true
				})
			})
		]
	});
}
//#endregion
export { CashierPage as component };
