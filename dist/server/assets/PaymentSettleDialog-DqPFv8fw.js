import { D as cn, E as useI18n, b as Button } from "./api-CC0Gwk-u.js";
import { Y as settlePayment, et as useClinicStore } from "./router-Ch00M4_a.js";
import { t as Input } from "./input-BTgG6WJd.js";
import { t as Label } from "./label-DwsEZK8p.js";
import { t as Badge } from "./badge-C7BrbGU5.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bw3b6ubk.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/components/dashboard/dashboard-helpers.tsx
function StatusBadge({ status }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			pending: "bg-amber-500/15 text-amber-600",
			confirmed: "bg-success/15 text-success",
			completed: "bg-primary/15 text-primary",
			cancelled: "bg-muted text-muted-foreground line-through"
		}[status]),
		children: t(`dash.status.${status}`)
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
function PaymentMethodBadge({ method }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			cash: "bg-amber-500/15 text-amber-600",
			fawry: "bg-primary/15 text-primary",
			instapay: "bg-violet-500/15 text-violet-600"
		}[method]),
		children: t(`checkout.method.${method}.short`)
	});
}
function PaymentStatusBadge({ status }) {
	const { t } = useI18n();
	return status === "paid" ? /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-success/15 text-success",
		children: t("pay.paid")
	}) : /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-muted text-muted-foreground",
		children: t("pay.unpaid")
	});
}
function PaymentKindBadge({ kind }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			order: "bg-amber-500/15 text-amber-600",
			visit: "bg-primary/15 text-primary",
			manual: "bg-muted text-muted-foreground"
		}[kind ?? "manual"]),
		children: t(`payments.kind.${kind ?? "manual"}`)
	});
}
//#endregion
//#region src/components/dashboard/dashboard-format.ts
var STATUS_OPTIONS = [
	{
		value: "all",
		key: "dash.filterAll"
	},
	{
		value: "pending",
		key: "dash.filterPending"
	},
	{
		value: "confirmed",
		key: "dash.filterConfirmed"
	},
	{
		value: "completed",
		key: "dash.filterCompleted"
	},
	{
		value: "cancelled",
		key: "dash.filterCancelled"
	}
];
function formatDate(dateISO, lang) {
	if (!dateISO) return "—";
	const d = /* @__PURE__ */ new Date(`${dateISO}T00:00:00`);
	if (Number.isNaN(d.getTime())) return dateISO;
	return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatTime(iso, lang) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString(lang === "ar" ? "ar" : "en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatMoney(amount, currency) {
	return currency === "$" ? `$${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
}
//#endregion
//#region src/components/dashboard/PaymentSettleDialog.tsx
function PaymentSettleDialog({ payment, onClose }) {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const [method, setMethod] = useState(payment.method || "cash");
	const [notes, setNotes] = useState("");
	const [busy, setBusy] = useState(false);
	const settle = async () => {
		if (busy) return;
		setBusy(true);
		try {
			await settlePayment(payment.id, {
				method,
				notes: notes.trim()
			});
			toast.success(t("payments.settle"));
			onClose();
		} catch (err) {
			const message = err instanceof Error && err.message ? err.message : "";
			toast.error(message || t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-sm",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: t("payments.settle") }), /* @__PURE__ */ jsx(DialogDescription, { children: t("payments.settleHint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border p-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: payment.title
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xl font-bold",
								children: formatMoney(payment.amount, settings.currency)
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("payments.settleMethod"),
							children: /* @__PURE__ */ jsxs("select", {
								value: method,
								onChange: (e) => setMethod(e.target.value),
								className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "cash",
										children: t("checkout.method.cash.short")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "fawry",
										children: t("checkout.method.fawry.short")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "instapay",
										children: t("checkout.method.instapay.short")
									})
								]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("payments.settleNotes"),
							children: /* @__PURE__ */ jsx(Input, {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: t("payments.notesPlaceholder")
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					disabled: busy,
					children: t("payments.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: settle,
					disabled: busy,
					children: busy ? t("payments.saving") : t("payments.settle")
				})] })
			]
		})
	});
}
//#endregion
export { formatTime as a, PaymentMethodBadge as c, formatMoney as i, PaymentStatusBadge as l, STATUS_OPTIONS as n, Field as o, formatDate as r, PaymentKindBadge as s, PaymentSettleDialog as t, StatusBadge as u };
