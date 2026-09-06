import { A as useClinicStore, E as submitPaymentProof, O as trackOrder, pt as useI18n, st as Button } from "./clinic-store-ClM7VlKI.js";
import { v as formatPrice } from "./router-DxrPtWw3.js";
import { t as Input } from "./input-BRZDssNB.js";
import { t as Label } from "./label-BG5ltDDz.js";
import { t as Badge } from "./badge-CwBph07w.js";
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ImageUp, Landmark, Loader2, PackageSearch, Smartphone } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/store.track.tsx?tsr-split=component
function PaymentStatusBadge({ order }) {
	const { t } = useI18n();
	if (order.paymentStatus === "paid") return /* @__PURE__ */ jsx(Badge, {
		className: "bg-success/15 text-success",
		children: t("pay.paid")
	});
	if (order.paymentStatus === "proof_submitted") return /* @__PURE__ */ jsx(Badge, {
		className: "bg-amber-500/15 text-amber-600",
		children: t("pay.underReview")
	});
	return /* @__PURE__ */ jsx(Badge, {
		className: "bg-muted text-muted-foreground",
		children: t("pay.unpaid")
	});
}
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
function OrderCard({ order, onUpdated }) {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const [ref, setRef] = useState("");
	const [proofImage, setProofImage] = useState("");
	const [busy, setBusy] = useState(false);
	const fileRef = useRef(null);
	const submitProof = async () => {
		if (busy) return;
		const hasRef = ref.trim().length > 0;
		const hasImage = proofImage.length > 0;
		if (order.paymentMethod === "fawry" && !hasRef) {
			toast.error(t("track.refRequired"));
			return;
		}
		if (order.paymentMethod === "instapay" && !hasRef && !hasImage) {
			toast.error(t("track.proofRequired"));
			return;
		}
		setBusy(true);
		try {
			onUpdated(await submitPaymentProof(order.id, {
				paymentRef: ref.trim() || void 0,
				proofImage: hasImage ? proofImage : void 0
			}));
			setRef("");
			setProofImage("");
			toast.success(t("track.proofSent"));
		} catch {
			toast.error(t("track.failed"));
		} finally {
			setBusy(false);
		}
	};
	const canSubmitProof = order.paymentStatus !== "paid" && order.paymentMethod !== "cash";
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-6 rounded-3xl border border-border bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-mono text-sm text-muted-foreground",
						children: order.id
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-lg font-bold",
						children: order.customerName
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							order.phone,
							" · ",
							order.email
						]
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-end gap-1.5",
					children: [/* @__PURE__ */ jsx(Badge, { children: t(`dash.status.${order.status}`) }), /* @__PURE__ */ jsx(PaymentStatusBadge, { order })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: order.items.map((item) => /* @__PURE__ */ jsxs("span", {
					className: "rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs",
					children: [
						item.name,
						" × ",
						item.qty
					]
				}, `${order.id}-${item.id}`))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm text-muted-foreground",
					children: t(`checkout.method.${order.paymentMethod}.title`)
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xl font-bold",
					children: formatPrice(order.total, settings.currency)
				})]
			}),
			order.paymentRef && order.paymentMethod === "fawry" && /* @__PURE__ */ jsxs("p", {
				className: "mt-3 rounded-xl bg-muted/50 px-4 py-2.5 font-mono text-sm",
				children: [
					t("track.fawryRef"),
					":",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-bold tracking-widest",
						children: order.paymentRef
					})
				]
			}),
			order.proofImage && /* @__PURE__ */ jsx("a", {
				href: order.proofImage,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-3 block",
				children: /* @__PURE__ */ jsx("img", {
					src: order.proofImage,
					alt: t("track.proofImageAlt"),
					className: "h-40 w-full rounded-xl border border-border object-cover"
				})
			}),
			canSubmitProof && /* @__PURE__ */ jsxs("div", {
				className: "mt-5 rounded-2xl border border-border bg-muted/30 p-4",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [order.paymentMethod === "fawry" ? /* @__PURE__ */ jsx(Landmark, { className: "size-4 text-primary" }) : /* @__PURE__ */ jsx(Smartphone, { className: "size-4 text-primary" }), t("track.proofTitle")]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
						children: order.paymentMethod === "fawry" ? t("track.fawryProofDesc") : t("track.instapayProofDesc")
					}),
					order.paymentMethod === "instapay" && settings.instapay && /* @__PURE__ */ jsxs("p", {
						className: "mt-2 rounded-lg bg-background px-3 py-2 font-mono text-sm font-bold",
						children: [
							t("checkout.method.instapay.short"),
							": ",
							settings.instapay
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 grid gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "track-ref",
								className: "text-xs font-medium text-muted-foreground",
								children: t("track.refNumber")
							}), /* @__PURE__ */ jsx(Input, {
								id: "track-ref",
								value: ref,
								onChange: (e) => setRef(e.target.value),
								className: "mt-1",
								placeholder: t("checkout.refPlaceholder")
							})] }),
							order.paymentMethod === "instapay" && /* @__PURE__ */ jsxs("div", { children: [
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
									className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
									children: [/* @__PURE__ */ jsx(ImageUp, { className: "size-4" }), proofImage ? t("checkout.imageChosen") : t("checkout.uploadProof")]
								}),
								proofImage && /* @__PURE__ */ jsx("img", {
									src: proofImage,
									alt: "",
									className: "mt-2 h-32 w-full rounded-xl border border-border object-cover"
								})
							] }),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								onClick: submitProof,
								disabled: busy,
								className: "w-full sm:w-auto",
								children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : null, t("track.sendProof")]
							})
						]
					})
				]
			}),
			order.paymentMethod === "cash" && order.paymentStatus !== "paid" && /* @__PURE__ */ jsx("p", {
				className: "mt-4 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground",
				children: t("checkout.cashNote")
			})
		]
	});
}
function TrackPage() {
	const { t } = useI18n();
	const [orderId, setOrderId] = useState("");
	const [phone, setPhone] = useState("");
	const [order, setOrder] = useState(null);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const lookup = async (e) => {
		e.preventDefault();
		if (busy) return;
		if (!orderId.trim() || !phone.trim()) {
			setError(t("track.required"));
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const found = await trackOrder(orderId.trim(), phone.trim());
			setOrder(found);
		} catch {
			setOrder(null);
			setError(t("track.notFound"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-screen px-5 py-32 sm:py-36",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-2xl",
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
					children: t("track.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("track.desc")
				}),
				/* @__PURE__ */ jsx("form", {
					onSubmit: lookup,
					className: "mt-8 rounded-3xl border border-border bg-card p-6 shadow-card",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "track-order",
								children: t("track.orderId")
							}), /* @__PURE__ */ jsx(Input, {
								id: "track-order",
								value: orderId,
								onChange: (e) => setOrderId(e.target.value),
								className: "mt-1.5 font-mono",
								placeholder: "…"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "track-phone",
								children: t("track.phone")
							}), /* @__PURE__ */ jsx(Input, {
								id: "track-phone",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "mt-1.5",
								autoComplete: "tel"
							})] }),
							error && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-destructive",
								children: error
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: busy,
								className: "shadow-glow",
								children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(PackageSearch, { className: "size-4" }), t("track.lookup")]
							})
						]
					})
				}),
				order && /* @__PURE__ */ jsx(OrderCard, {
					order,
					onUpdated: setOrder
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: t("track.help")
				})
			]
		})
	});
}
//#endregion
export { TrackPage as component };
