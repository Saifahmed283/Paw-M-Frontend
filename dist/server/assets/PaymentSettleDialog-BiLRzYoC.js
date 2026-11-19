import { D as cn, E as useI18n, h as remainingLockMs, p as login, t as ApiError, u as currentRole, y as Button } from "./api-dSNieQTv.js";
import { Z as setOrderPaymentStatus, et as settlePayment, st as useClinicStore } from "./router-CRhjkK4N.js";
import { t as Input } from "./input-DhvdL-_X.js";
import { t as Label } from "./label-BCBRTiEp.js";
import { t as Badge } from "./badge-BTdo5bHS.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-HM8L1FCw.js";
import { i as formatMoney } from "./separator-DhFcJVU0.js";
import * as React from "react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Lock } from "lucide-react";
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
			manual: "bg-muted text-muted-foreground",
			refund: "bg-destructive/15 text-destructive"
		}[kind ?? "manual"]),
		children: t(`payments.kind.${kind ?? "manual"}`)
	});
}
// src/components/auth/StaffAuthGate.tsx
/**
* Staff sign-in gate shared by the dashboard and the cashier. Staff accounts
* are provisioned out of band, so this is sign-in only — it never offers to
* create an admin when the API is unreachable.
*/
function StaffAuthGate({ onUnlocked, showBack = true }) {
	const { t } = useI18n();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [lockedFor, setLockedFor] = useState(remainingLockMs());
	const [busy, setBusy] = useState(false);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		setError(null);
		setBusy(true);
		try {
			if (await login(username, password)) onUnlocked(currentRole());
			else setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.status === 400) setError(t("auth.missingFields"));
				else if (err.status === 429) setError(t("auth.locked", { minutes: String(err.retryAfterMinutes ?? 15) }));
				else setError(t("auth.unreachable"));
			} else setError(t("auth.unreachable"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-dvh items-center justify-center bg-muted/40 px-5 py-32",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card",
			children: [
				showBack && /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => window.location.href = "/",
					className: "mb-4 -ms-2 text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4 me-1" }),
						" ",
						t("dash.back")
					]
				}),
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(Lock, { className: "size-5" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-5 text-center text-xl font-bold",
					children: t("auth.signIn")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-center text-sm text-muted-foreground",
					children: showBack ? t("auth.signInDesc") : t("cashier.signInDesc")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 grid gap-4",
					children: [/* @__PURE__ */ jsx(Field, {
						label: t("auth.username"),
						children: /* @__PURE__ */ jsx(Input, {
							autoFocus: true,
							autoComplete: "username",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							placeholder: t("auth.usernamePlaceholder"),
							maxLength: 40
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: t("auth.password"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: t("auth.passwordPlaceholder"),
							maxLength: 128
						})
					})]
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}),
				lockedFor > 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs text-amber-600",
					children: t("auth.locked", { minutes: String(Math.ceil(lockedFor / 6e4)) })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 text-center",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: t("auth.signInHelp")
					})
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: busy,
					className: "mt-6 w-full shadow-glow",
					children: t("auth.unlock")
				})
			]
		})
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
			if (payment.orderId) await setOrderPaymentStatus(payment.orderId, "paid", method);
			else await settlePayment(payment.id, {
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
export { PaymentMethodBadge as a, Tabs as c, TabsTrigger as d, PaymentKindBadge as i, TabsContent as l, StaffAuthGate as n, PaymentStatusBadge as o, Field as r, StatusBadge as s, PaymentSettleDialog as t, TabsList as u };
