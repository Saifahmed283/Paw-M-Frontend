import { t as Badge } from "./badge-B87V8P7c.js";
import { _ as formatPrice, at as useClinicStore, i as Route, tt as trackOrder, v as Button } from "./router-B5xOVOWb.js";
import { n as FawryPaymentPanel, t as InstapayQrPanel } from "./InstapayQrPanel-BPXbJxIJ.js";
import { t as Input } from "./input-CLaFl1xb.js";
import { t as Label } from "./label-tgWk4l4_.js";
import { t as Textarea } from "./textarea-PIULPONN.js";
import { E as useI18n, a as clientIsAuthed, i as localizedApiErrorMessage } from "./api-DvWJKWa0.js";
import { c as canSubmitTransfer, v as showCashPickupNotice, y as submitTransferSubmission } from "./payment-verification-CJ-UYr7R.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ImageUp, Loader2, PackageSearch, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
// src/routes/store.track.tsx?tsr-split=component
function PaymentStatusBadge({ order }) {
	const { t } = useI18n();
	if (order.paymentStatus === "paid") return /* @__PURE__ */ jsx(Badge, {
		className: "bg-success/15 text-success",
		children: t("pay.paid")
	});
	if (order.paymentStatus === "proof_submitted" || order.paymentStatus === "under_review") return /* @__PURE__ */ jsx(Badge, {
		className: "bg-amber-500/15 text-amber-600",
		children: t("pay.underReview")
	});
	if (order.paymentStatus === "rejected") return /* @__PURE__ */ jsx(Badge, {
		className: "bg-destructive/15 text-destructive",
		children: t("track.statusRejected")
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
function toIso(localDateTime) {
	if (!localDateTime) return void 0;
	const date = new Date(localDateTime);
	return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
/** Pre-fill the datetime-local field with "now" in the browser's timezone. */
function localDateTimeNow() {
	const now = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(now.getTime() - now.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function TransferSubmissionForm({ order, phone, onUpdated, autoFocus = false }) {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const [senderName, setSenderName] = useState("");
	const [transferReference, setTransferReference] = useState("");
	const [transferredAt, setTransferredAt] = useState(localDateTimeNow);
	const [note, setNote] = useState("");
	const [evidenceBase64, setEvidenceBase64] = useState("");
	const [busy, setBusy] = useState(false);
	const fileRef = useRef(null);
	const total = formatPrice(order.total, settings.currency);
	const submit = async () => {
		if (busy) return;
		if (!senderName.trim() || !transferReference.trim() || !transferredAt || !evidenceBase64) {
			toast.error(t("track.allProofFieldsRequired"));
			return;
		}
		if (!toIso(transferredAt)) {
			toast.error(t("track.allProofFieldsRequired"));
			return;
		}
		setBusy(true);
		try {
			const isGuest = !clientIsAuthed();
			const result = await submitTransferSubmission(order.id, {
				senderName,
				transferReference,
				...toIso(transferredAt) ? { transferredAt: toIso(transferredAt) } : {},
				...evidenceBase64 ? { evidenceBase64 } : {},
				...note.trim() ? { note } : {},
				...isGuest ? { phone: phone.trim() } : {}
			});
			try {
				onUpdated(await trackOrder(order.id, phone.trim()));
			} catch {
				const paymentStatus = result.decision === "approved" ? "paid" : result.decision === "rejected" ? "rejected" : result.decision === "submitted" ? "proof_submitted" : "under_review";
				onUpdated({
					...order,
					paymentStatus
				});
			}
			setSenderName("");
			setTransferReference("");
			setTransferredAt(localDateTimeNow());
			setNote("");
			setEvidenceBase64("");
			toast.success(t("track.submittedOk"));
		} catch (err) {
			toast.error(localizedApiErrorMessage(err, t, t("track.submissionFailed")));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-5 rounded-2xl border border-primary/25 bg-muted/30 p-4",
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "flex items-center gap-2 text-sm font-bold text-primary",
				children: [/* @__PURE__ */ jsx(Smartphone, { className: "size-4" }), t("track.proofStepTwo")]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs font-semibold text-muted-foreground",
				children: order.paymentStatus === "rejected" ? t("track.resubmitTitle") : t("track.proofTitle")
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
				children: order.paymentMethod === "fawry" ? t("track.fawryProofDesc") : t("track.instapayProofDesc", { amount: total })
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
				className: "mt-4 grid gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Label, {
						htmlFor: "track-sender",
						className: "text-xs font-medium",
						children: [
							t("track.senderName"),
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-destructive",
								children: "*"
							})
						]
					}), /* @__PURE__ */ jsx(Input, {
						id: "track-sender",
						value: senderName,
						onChange: (e) => setSenderName(e.target.value),
						className: "mt-1",
						autoComplete: "name",
						required: true
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Label, {
						htmlFor: "track-ref",
						className: "text-xs font-medium",
						children: [
							order.paymentMethod === "fawry" ? t("track.fawryRef") : t("track.transferReference"),
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-destructive",
								children: "*"
							})
						]
					}), /* @__PURE__ */ jsx(Input, {
						id: "track-ref",
						value: transferReference,
						onChange: (e) => setTransferReference(e.target.value),
						className: "mt-1",
						placeholder: t("checkout.refPlaceholder"),
						autoFocus,
						required: true
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Label, {
						htmlFor: "track-date",
						className: "text-xs font-medium",
						children: [
							t("track.transferredAt"),
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-destructive",
								children: "*"
							})
						]
					}), /* @__PURE__ */ jsx(Input, {
						id: "track-date",
						type: "datetime-local",
						value: transferredAt,
						onChange: (e) => setTransferredAt(e.target.value),
						className: "mt-1",
						required: true
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "track-note",
						className: "text-xs font-medium text-muted-foreground",
						children: t("verif.note")
					}), /* @__PURE__ */ jsx(Textarea, {
						id: "track-note",
						rows: 2,
						value: note,
						onChange: (e) => setNote(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs(Label, {
							className: "text-xs font-medium",
							children: [
								t("checkout.proofImage"),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-destructive",
									children: "*"
								})
							]
						}),
						/* @__PURE__ */ jsx("input", {
							ref: fileRef,
							type: "file",
							accept: "image/png,image/jpeg,image/webp,image/gif",
							className: "hidden",
							onChange: async (e) => {
								try {
									setEvidenceBase64(await readImageFile(e.target.files?.[0]));
								} catch {
									toast.error(t("checkout.imageError"));
								}
							}
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: "mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
							children: [/* @__PURE__ */ jsx(ImageUp, { className: "size-4" }), evidenceBase64 ? t("checkout.imageChosen") : t("track.chooseScreenshot")]
						}),
						evidenceBase64 && /* @__PURE__ */ jsxs("div", {
							className: "mt-2 space-y-2",
							children: [/* @__PURE__ */ jsx("img", {
								src: evidenceBase64,
								alt: t("track.proofImageAlt"),
								className: "h-32 w-full rounded-xl border border-border object-cover"
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									setEvidenceBase64("");
									if (fileRef.current) fileRef.current.value = "";
								},
								className: "flex items-center gap-1 text-xs font-medium text-destructive",
								children: [/* @__PURE__ */ jsx(X, { className: "size-3.5" }), t("track.removeScreenshot")]
							})]
						})
					] }),
					/* @__PURE__ */ jsxs(Button, {
						size: "lg",
						onClick: submit,
						disabled: busy,
						className: "w-full",
						children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : null, order.paymentStatus === "rejected" ? t("track.resubmit") : t("track.sendProof")]
					})
				]
			})
		]
	});
}
function OrderCard({ order, phone, onUpdated, autoOpenProof = false }) {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const total = formatPrice(order.total, settings.currency);
	const canSubmit = canSubmitTransfer(order);
	const showCash = showCashPickupNotice(order);
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
					children: total
				})]
			}),
			showCash && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold",
						children: t("track.payAtPickup", { amount: total })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 font-mono text-xs text-muted-foreground",
						children: t("track.pickupReference", { orderId: order.id })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs font-medium text-amber-600",
						children: t("checkout.notPaidNote")
					})
				]
			}),
			(order.paymentMethod === "instapay" || order.paymentMethod === "fawry") && canSubmit && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 space-y-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold",
					children: order.paymentMethod === "fawry" ? t("track.fawryProofStepOne") : t("track.proofStepOne")
				}), order.paymentMethod === "fawry" ? /* @__PURE__ */ jsx(FawryPaymentPanel, {
					amountLabel: total,
					reference: order.id,
					compact: true
				}) : /* @__PURE__ */ jsx(InstapayQrPanel, {
					account: settings.instapay,
					amountLabel: total,
					compact: true
				})]
			}),
			canSubmit && /* @__PURE__ */ jsx(TransferSubmissionForm, {
				order,
				phone,
				onUpdated,
				autoFocus: autoOpenProof
			})
		]
	});
}
function TrackPage() {
	const { t } = useI18n();
	const { order: searchOrder, phone: searchPhone, proof } = Route.useSearch();
	const [orderId, setOrderId] = useState(searchOrder);
	const [phone, setPhone] = useState(searchPhone);
	const [order, setOrder] = useState(null);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const autoLookedUp = useRef(false);
	const performLookup = useCallback(async (oid, ph) => {
		const cleanOrder = oid.trim();
		const cleanPhone = ph.trim();
		if (!cleanOrder || !cleanPhone) {
			setError(t("track.required"));
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const found = await trackOrder(cleanOrder, cleanPhone);
			setOrder(found);
		} catch {
			setOrder(null);
			setError(t("track.notFound"));
		} finally {
			setBusy(false);
		}
	}, [t]);
	useEffect(() => {
		if (autoLookedUp.current || !searchOrder || !searchPhone) return;
		autoLookedUp.current = true;
		performLookup(searchOrder, searchPhone);
	}, [
		searchOrder,
		searchPhone,
		performLookup
	]);
	const lookup = (e) => {
		e.preventDefault();
		performLookup(orderId, phone);
	};
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-dvh px-5 py-32 sm:py-36",
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
					phone,
					onUpdated: setOrder,
					autoOpenProof: proof === "1"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: t("track.help")
				})
			]
		})
	});
}
export { TrackPage as component };
