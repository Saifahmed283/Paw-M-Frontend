import { D as cn, E as useI18n, _ as remainingLockMs, f as currentRole, h as login, t as ApiError } from "./api-BGK8fGh3.js";
import { Ct as PawMLogoSeal, Z as settlePayment, _ as Button, rt as useClinicStore, xt as CrestBackdrop } from "./router-Bo8c13TA.js";
import { t as Input } from "./input-BEFRZ_lg.js";
import { t as Label } from "./label-DIwKHqlh.js";
import { t as Badge } from "./badge-pkxl7qbf.js";
import { c as DialogDescription, d as DialogTitle, l as DialogFooter, o as Dialog, s as DialogContent, u as DialogHeader } from "./select-C5u_BJLy.js";
import { h as isOrderPayment } from "./payment-verification-D0Oa8ruD.js";
import { a as formatMoney } from "./separator-CJfS561-.js";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Radio, ShieldCheck, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
// src/components/dashboard/dashboard-helpers.tsx
function StatusBadge({ status }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			pending: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
			confirmed: "bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
			completed: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
			cancelled: "bg-[var(--surface-2)] text-ink-soft line-through"
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
			cash: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
			fawry: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
			instapay: "bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]"
		}[method]),
		children: t(`checkout.method.${method}.short`)
	});
}
function PaymentStatusBadge({ status }) {
	const { t } = useI18n();
	if (status === "paid") return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
		children: t("pay.paid")
	});
	if (status === "proof_submitted" || status === "under_review") return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
		children: t("pay.underReview")
	});
	if (status === "rejected") return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-[var(--urgent-tint)] text-[var(--urgent)]",
		children: t("verif.rejected")
	});
	return /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-[var(--surface-2)] text-ink-soft",
		children: t("pay.unpaid")
	});
}
function PaymentKindBadge({ kind }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			order: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
			visit: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
			manual: "bg-[var(--surface-2)] text-ink-soft",
			refund: "bg-[var(--urgent-tint)] text-[var(--urgent)]"
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
	const reduce = !!useReducedMotion();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [revealed, setRevealed] = useState(false);
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
				else if (err.status === 403) setError(t("auth.suspended"));
				else if (err.status === 429) setError(t("auth.locked", { minutes: String(err.retryAfterMinutes ?? 15) }));
				else setError(t("auth.unreachable"));
			} else setError(t("auth.unreachable"));
		} finally {
			setBusy(false);
		}
	};
	const rise = (delay) => reduce ? {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { duration: .16 }
	} : {
		initial: {
			opacity: 0,
			y: 14
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .45,
			delay,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}
	};
	const promises = [
		{
			icon: ShieldCheck,
			label: t("auth.point.secure")
		},
		{
			icon: Radio,
			label: t("auth.point.clear")
		},
		{
			icon: Sparkles,
			label: t("auth.point.care")
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex min-h-dvh flex-col bg-[var(--canvas)] lg:flex-row",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "relative flex shrink-0 flex-col justify-between overflow-hidden bg-[var(--navy-950)] px-6 py-10 text-white sm:px-10 lg:w-[42%] lg:px-14 lg:py-14",
			children: [
				/* @__PURE__ */ jsx(CrestBackdrop, { animated: !reduce }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx(PawMLogoSeal, { size: "md" }),
						/* @__PURE__ */ jsx(motion.p, {
							...rise(.08),
							className: "mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold-400)]",
							children: t("auth.portal")
						}),
						/* @__PURE__ */ jsx(motion.h2, {
							...rise(.14),
							className: "mt-3 max-w-sm font-display text-[length:var(--step-2)] font-semibold leading-tight sm:text-[length:var(--step-3)]",
							children: t("auth.brandTitle")
						}),
						/* @__PURE__ */ jsx("div", { className: "pm-gild mt-5 h-px w-14 bg-[var(--gold-500)]" }),
						/* @__PURE__ */ jsx(motion.p, {
							...rise(.2),
							className: "mt-5 max-w-sm text-sm leading-relaxed text-white/65",
							children: t("auth.brandDesc")
						})
					]
				}),
				/* @__PURE__ */ jsx(motion.div, {
					...rise(.28),
					className: "relative mt-10 hidden gap-2 lg:grid",
					children: promises.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 border-t border-white/10 py-3 text-sm text-white/75",
						children: [/* @__PURE__ */ jsx(Icon, { className: "size-4 text-[var(--gold-400)]" }), label]
					}, label))
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8 lg:py-16",
			children: /* @__PURE__ */ jsxs(motion.form, {
				onSubmit: submit,
				...rise(.1),
				className: "w-full max-w-md",
				children: [
					showBack && /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						onClick: () => window.location.href = "/",
						className: "-ms-2 mb-8 text-ink-soft",
						children: [
							/* @__PURE__ */ jsx(ArrowLeft, { className: "me-1 size-4 rtl:rotate-180" }),
							" ",
							t("dash.back")
						]
					}),
					/* @__PURE__ */ jsx("div", { className: "pm-gild h-px w-12 bg-[var(--gold-500)]" }),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-5 font-display text-[length:var(--step-3)] font-semibold text-foreground",
						children: t("auth.signIn")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: showBack ? t("auth.signInDesc") : t("cashier.signInDesc")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 grid gap-5",
						children: [/* @__PURE__ */ jsx(Field, {
							label: t("auth.username"),
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" }), /* @__PURE__ */ jsx(Input, {
									autoFocus: true,
									autoComplete: "username",
									value: username,
									onChange: (e) => setUsername(e.target.value),
									placeholder: t("auth.usernamePlaceholder"),
									maxLength: 40,
									className: "h-11 ps-10",
									"aria-invalid": !!error
								})]
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: t("auth.password"),
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" }),
									/* @__PURE__ */ jsx(Input, {
										type: revealed ? "text" : "password",
										autoComplete: "current-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: t("auth.passwordPlaceholder"),
										maxLength: 128,
										className: "h-11 ps-10 pe-11",
										"aria-invalid": !!error
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setRevealed((v) => !v),
										"aria-label": revealed ? t("auth.hidePassword") : t("auth.showPassword"),
										"aria-pressed": revealed,
										className: "absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-ink-faint transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: revealed ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
									})
								]
							})
						})]
					}),
					error && /* @__PURE__ */ jsx(motion.p, {
						role: "alert",
						className: "pm-shake mt-5 rounded-[var(--radius-md)] border border-[var(--urgent)]/25 bg-[var(--urgent-tint)] px-3 py-2 text-sm text-[var(--urgent)]",
						children: error
					}, error),
					lockedFor > 0 && /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs text-[var(--gold-700)] dark:text-[var(--gold-400)]",
						children: t("auth.locked", { minutes: String(Math.ceil(lockedFor / 6e4)) })
					}),
					/* @__PURE__ */ jsx(motion.div, {
						...reduce ? {} : {
							whileHover: { y: -2 },
							whileTap: { scale: .99 }
						},
						transition: {
							type: "spring",
							stiffness: 320,
							damping: 24
						},
						children: /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: busy,
							className: "mt-8 h-11 w-full bg-[var(--navy-700)] text-white hover:bg-[var(--navy-800)]",
							children: busy ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(LoaderCircle, { className: "me-2 size-4 animate-spin" }), t("dash.saving")] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [t("auth.unlock"), /* @__PURE__ */ jsx(ArrowRight, { className: "ms-2 size-4 rtl:rotate-180" })] })
						})
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-ink-faint",
						children: t("auth.signInHelp")
					})
				]
			})
		})]
	});
}
// src/lib/dashboard-navigation.ts
/**
* Lightweight bridge for cross-component dashboard navigation.
*
* The dashboard keeps its active tab in local state (it is not URL-driven), so
* components rendered inside the shell — e.g. the notification bell — use this
* event to ask the shell to switch tabs without prop-drilling through layout.
*/
var DASHBOARD_NAVIGATE_EVENT = "pawm:dashboard-navigate";
function navigateToDashboardTab(tabId, recordId) {
	if (typeof window === "undefined") return;
	const detail = recordId === void 0 ? { tabId } : {
		tabId,
		recordId
	};
	window.dispatchEvent(new CustomEvent(DASHBOARD_NAVIGATE_EVENT, { detail }));
}
// src/components/dashboard/PaymentSettleDialog.tsx
function PaymentSettleDialog({ payment, onClose }) {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const [method, setMethod] = useState(payment.method || "cash");
	const [notes, setNotes] = useState("");
	const [busy, setBusy] = useState(false);
	const orderPayment = isOrderPayment(payment);
	const settle = async () => {
		if (busy || orderPayment) return;
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
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold",
							children: payment.title
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xl font-bold",
							children: formatMoney(payment.amount, settings.currency)
						})]
					}), orderPayment ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-sm",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-amber-600",
							children: t("verif.orderSettled")
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							className: "mt-3",
							onClick: () => {
								navigateToDashboardTab("payment-verification");
								onClose();
							},
							children: t("verif.goQueue")
						})]
					}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Field, {
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
					}), /* @__PURE__ */ jsx(Field, {
						label: t("payments.settleNotes"),
						children: /* @__PURE__ */ jsx(Input, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: t("payments.notesPlaceholder")
						})
					})] })]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					disabled: busy,
					children: t("payments.cancel")
				}), !orderPayment && /* @__PURE__ */ jsx(Button, {
					onClick: settle,
					disabled: busy,
					children: busy ? t("payments.saving") : t("payments.settle")
				})] })
			]
		})
	});
}
export { Field as a, PaymentStatusBadge as c, StaffAuthGate as i, StatusBadge as l, DASHBOARD_NAVIGATE_EVENT as n, PaymentKindBadge as o, navigateToDashboardTab as r, PaymentMethodBadge as s, PaymentSettleDialog as t };
