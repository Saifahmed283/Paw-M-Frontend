import { d as Button, g as cn, m as useI18n, r as currentClient } from "./api-Bx9sNaAQ.js";
import { C as createOrder, Y as useClinicStore, _ as formatPrice, f as clearCart, h as useCart, m as setCartQty, p as removeFromCart } from "./router-DVdLxzaP.js";
import { t as Input } from "./input-DYbpUre4.js";
import { t as Label } from "./label-DS8D3_7C.js";
import { t as ClientAuthGate } from "./ClientAuthGate-DfOpvOhe.js";
import { t as Textarea } from "./textarea-U3jWhuaD.js";
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Banknote, CheckCircle2, ChevronLeft, ImageUp, Landmark, QrCode, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/store.checkout.tsx?tsr-split=component
var PAYMENT_METHODS = [
	{
		value: "cash",
		icon: Banknote,
		title: "checkout.method.cash.title",
		desc: "checkout.method.cash.desc"
	},
	{
		value: "fawry",
		icon: Landmark,
		title: "checkout.method.fawry.title",
		desc: "checkout.method.fawry.desc"
	},
	{
		value: "instapay",
		icon: Smartphone,
		title: "checkout.method.instapay.title",
		desc: "checkout.method.instapay.desc"
	}
];
function readImageFile(file) {
	return new Promise((resolve, reject) => {
		if (!file) return reject(/* @__PURE__ */ new Error("no file"));
		if (file.size > 4194304) return reject(/* @__PURE__ */ new Error("too large"));
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("read failed"));
		reader.readAsDataURL(file);
	});
}
function SuccessScreen({ orderId, paymentMethod, paymentRef, instapay }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient flex min-h-screen items-center justify-center px-5 py-32",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-14 place-items-center rounded-2xl bg-success/15 text-success",
					children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-7" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-5 text-2xl font-bold",
					children: t("checkout.successTitle")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm leading-relaxed text-muted-foreground",
					children: t("checkout.successDesc")
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3 font-mono text-sm",
					children: [
						t("checkout.orderId"),
						": ",
						orderId
					]
				}),
				paymentMethod === "fawry" && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4 text-left",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "flex items-center gap-2 text-xs font-semibold text-primary",
							children: [
								/* @__PURE__ */ jsx(Landmark, { className: "size-4" }),
								" ",
								t("checkout.fawryRefTitle")
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 font-mono text-xl font-bold tracking-widest",
							children: paymentRef
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-xs leading-relaxed text-muted-foreground",
							children: t("checkout.fawrySteps")
						})
					]
				}),
				paymentMethod === "instapay" && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4 text-left",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "flex items-center gap-2 text-xs font-semibold text-primary",
							children: [/* @__PURE__ */ jsx(Smartphone, { className: "size-4" }), " InstaPay"]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 font-mono text-lg font-bold",
							children: instapay
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-xs leading-relaxed text-muted-foreground",
							children: t("checkout.instapaySteps")
						})
					]
				}),
				paymentMethod === "cash" && /* @__PURE__ */ jsx("p", {
					className: "mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground",
					children: t("checkout.cashNote")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "flex-1 shadow-glow",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/store/track",
							children: t("checkout.trackOrder")
						})
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "flex-1",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/store",
							children: t("checkout.continueShopping")
						})
					})]
				})
			]
		})
	});
}
function CheckoutPage() {
	return /* @__PURE__ */ jsx(ClientAuthGate, { children: /* @__PURE__ */ jsx(CheckoutForm, {}) });
}
function CheckoutForm() {
	const { t } = useI18n();
	const cart = useCart();
	const { settings } = useClinicStore();
	const client = currentClient();
	const [form, setForm] = useState({
		name: client?.fullName ?? "",
		phone: client?.phone ?? "",
		email: client?.email ?? "",
		address: ""
	});
	const [method, setMethod] = useState("cash");
	const [ref, setRef] = useState("");
	const [proofImage, setProofImage] = useState("");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState(null);
	const fileRef = useRef(null);
	const total = cart.reduce((n, i) => n + i.qty * i.price, 0);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		const isDeliveryRequired = method !== "cash";
		if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
			toast.error(t("checkout.required"));
			return;
		}
		if (isDeliveryRequired && !form.address.trim()) {
			toast.error(t("checkout.addressRequiredError"));
			return;
		}
		if (method === "instapay" && !settings.instapay) {
			toast.error(t("checkout.instapayNotConfigured"));
			return;
		}
		setBusy(true);
		try {
			const order = await createOrder({
				customerName: form.name.trim(),
				phone: form.phone.trim(),
				email: form.email.trim(),
				address: form.address.trim(),
				items: cart.map((i) => ({
					id: i.id,
					name: i.name,
					price: i.price,
					qty: i.qty
				})),
				paymentMethod: method,
				paymentRef: method === "instapay" || method === "fawry" ? ref.trim() : void 0,
				proofImage: method === "instapay" ? proofImage : void 0
			});
			clearCart();
			setResult({
				id: order.id,
				paymentMethod: order.paymentMethod,
				paymentRef: order.paymentRef
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			if (message.includes("only")) toast.error(message);
			else toast.error(t("checkout.failed"));
		} finally {
			setBusy(false);
		}
	};
	if (result) return /* @__PURE__ */ jsx(SuccessScreen, {
		orderId: result.id,
		paymentMethod: result.paymentMethod,
		paymentRef: result.paymentRef,
		instapay: settings.instapay
	});
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-screen px-5 py-32 sm:py-36",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/store",
					className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
					children: [
						/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }),
						" ",
						t("store.back")
					]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-3xl font-bold",
					children: t("checkout.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: method === "cash" ? t("checkout.descCollect") : t("checkout.descDelivery")
				}),
				cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-card",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: t("cart.empty")
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-5",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/store",
							children: t("cart.continue")
						})
					})]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "mt-8 grid gap-6 lg:grid-cols-[1fr_360px]",
					children: [/* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "co-name",
										children: t("checkout.name")
									}), /* @__PURE__ */ jsx(Input, {
										id: "co-name",
										autoComplete: "name",
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value
										}),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "co-phone",
											children: t("checkout.phone")
										}), /* @__PURE__ */ jsx(Input, {
											id: "co-phone",
											autoComplete: "tel",
											value: form.phone,
											onChange: (e) => setForm({
												...form,
												phone: e.target.value
											}),
											className: "mt-1.5"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "co-email",
											children: t("checkout.email")
										}), /* @__PURE__ */ jsx(Input, {
											id: "co-email",
											type: "email",
											autoComplete: "email",
											value: form.email,
											onChange: (e) => setForm({
												...form,
												email: e.target.value
											}),
											className: "mt-1.5"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx(Label, {
											htmlFor: "co-address",
											children: method === "cash" ? t("checkout.addressOptional") : t("checkout.addressRequired")
										}),
										/* @__PURE__ */ jsx(Textarea, {
											id: "co-address",
											rows: 2,
											autoComplete: "street-address",
											value: form.address,
											onChange: (e) => setForm({
												...form,
												address: e.target.value
											}),
											className: "mt-1.5",
											placeholder: t("checkout.addressHint")
										}),
										method === "cash" && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: t("checkout.collectInClinic")
										})
									] })
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(Label, {
									className: "text-sm font-medium",
									children: t("checkout.paymentMethod")
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-2 grid gap-2.5",
									children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setMethod(m.value),
										className: cn("flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors", method === m.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"),
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
									className: "mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4",
									children: [/* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-2 text-xs font-semibold text-primary",
										children: [
											/* @__PURE__ */ jsx(Landmark, { className: "size-4" }),
											" ",
											t("checkout.fawryHowTitle")
										]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
										children: t("checkout.fawryHow")
									})]
								}),
								method === "instapay" && /* @__PURE__ */ jsxs("div", {
									className: "mt-4 space-y-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "rounded-xl border border-primary/25 bg-primary/8 p-4",
											children: [
												/* @__PURE__ */ jsxs("p", {
													className: "flex items-center gap-2 text-xs font-semibold text-primary",
													children: [/* @__PURE__ */ jsx(Smartphone, { className: "size-4" }), " InstaPay"]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1.5 font-mono text-sm font-bold",
													children: settings.instapay || t("checkout.instapayMissing")
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
													children: t("checkout.instapayHint")
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "co-ref",
											className: "text-xs font-medium text-muted-foreground",
											children: t("checkout.refNumber")
										}), /* @__PURE__ */ jsx(Input, {
											id: "co-ref",
											value: ref,
											onChange: (e) => setRef(e.target.value),
											className: "mt-1.5",
											placeholder: t("checkout.refPlaceholder")
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx(Label, {
												className: "text-xs font-medium text-muted-foreground",
												children: t("checkout.proofImage")
											}),
											/* @__PURE__ */ jsx("input", {
												ref: fileRef,
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: async (e) => {
													try {
														setProofImage(await readImageFile(e.target.files?.[0]));
													} catch {
														toast.error(t("checkout.imageError"));
													}
												}
											}),
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => fileRef.current?.click(),
												className: "mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-6 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
												children: [/* @__PURE__ */ jsx(ImageUp, { className: "size-4" }), proofImage ? t("checkout.imageChosen") : t("checkout.uploadProof")]
											}),
											proofImage && /* @__PURE__ */ jsx("img", {
												src: proofImage,
												alt: "",
												className: "mt-2 h-32 w-full rounded-xl border border-border object-cover"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1.5 text-[11px] text-muted-foreground",
												children: t("checkout.proofLater")
											})
										] })
									]
								})
							] }),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								size: "lg",
								disabled: busy,
								className: "w-full shadow-glow",
								children: busy ? "…" : t("checkout.placeOrder")
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "h-fit rounded-3xl border border-border bg-card p-6 shadow-card",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold uppercase tracking-wide text-muted-foreground",
								children: t("cart.title")
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 space-y-3",
								children: cart.map((item) => /* @__PURE__ */ jsxs("div", {
									className: "flex gap-3",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: item.image,
											alt: "",
											className: "size-14 shrink-0 rounded-xl border border-border object-cover"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "truncate text-sm font-medium",
													children: item.name
												}),
												/* @__PURE__ */ jsxs("p", {
													className: "text-xs text-muted-foreground",
													children: [
														item.qty,
														" × ",
														formatPrice(item.price, settings.currency)
													]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-1 flex items-center gap-1",
													children: [/* @__PURE__ */ jsx("select", {
														value: item.qty,
														onChange: (e) => setCartQty(item.id, Number(e.target.value)),
														className: "h-7 rounded-lg border border-input bg-background px-1.5 text-xs",
														"aria-label": t("store.quantity"),
														children: Array.from({ length: Math.min(item.stock, 10) }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx("option", {
															value: n,
															children: n
														}, n))
													}), /* @__PURE__ */ jsx("button", {
														onClick: () => removeFromCart(item.id),
														className: "ml-1 grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
														"aria-label": t("cart.remove"),
														children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
													})]
												})
											]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-semibold",
											children: formatPrice(item.price * item.qty, settings.currency)
										})
									]
								}, item.id))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-5 flex items-center justify-between border-t border-border pt-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm font-medium text-muted-foreground",
									children: t("cart.total")
								}), /* @__PURE__ */ jsx("span", {
									className: "text-lg font-bold",
									children: formatPrice(total, settings.currency)
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-[11px] leading-relaxed text-muted-foreground",
								children: [/* @__PURE__ */ jsx(QrCode, { className: "mt-0.5 size-3.5 shrink-0" }), t("checkout.paymentNote")]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { CheckoutPage as component };
