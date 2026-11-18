import { D as cn, E as useI18n, y as Button } from "./api-BY91_jdy.js";
import { et as settlePayment, st as useClinicStore } from "./router-C6zS3_is.js";
import { t as Input } from "./input-DjI89rmP.js";
import { t as Label } from "./label-DkPzuOJu.js";
import { t as Badge } from "./badge-SL37kaga.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-7npZtFra.js";
import { r as formatMoney } from "./dashboard-format-U7ryx9v3.js";
import * as React from "react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import * as TabsPrimitive from "@radix-ui/react-tabs";
// src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
// src/components/dashboard/dashboard-helpers.tsx
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
	if (status === "paid") return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-success/15 text-success",
		children: t("pay.paid")
	});
	if (status === "proof_submitted") return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-amber-500/15 text-amber-600",
		children: t("pay.underReview")
	});
	return /* @__PURE__ */ jsx(Badge, {
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
// src/components/dashboard/PaymentSettleDialog.tsx
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
			toast.success(t("payments.settled"));
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
export { PaymentStatusBadge as a, TabsContent as c, PaymentMethodBadge as i, TabsList as l, Field as n, StatusBadge as o, PaymentKindBadge as r, Tabs as s, PaymentSettleDialog as t, TabsTrigger as u };
