import { D as cn, E as useI18n } from "./api-Caz6rqB5.js";
import { _ as Button } from "./router-B_iZtHQd.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Copy, ExternalLink, ReceiptText, Smartphone } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
// src/components/store/FawryPaymentPanel.tsx
/**
* Fawry has no account number to configure — the order ID is the reference the
* customer quotes at an outlet or in the app. We show that reference, the total,
* and the same proof-verification promise as InstaPay.
*/
function FawryPaymentPanel({ amountLabel, reference, compact = false }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-2xl border border-[var(--gold-500)]/35 bg-[var(--surface-2)] p-4", compact && "p-3"),
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "flex items-center gap-2 text-sm font-semibold text-[var(--gold-700)] dark:text-[var(--gold-400)]",
				children: [/* @__PURE__ */ jsx(ReceiptText, { className: "size-4" }), t("checkout.fawryHowTitle")]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs leading-relaxed text-muted-foreground",
				children: t("checkout.fawryHow")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--gold-500)]/20 pt-3", compact && "mt-2 pt-2"),
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: t("checkout.method.fawry.short")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-sm font-semibold",
					children: t("checkout.fawrySteps")
				})] }), /* @__PURE__ */ jsx("p", {
					className: "font-data text-lg font-bold tabular-nums",
					children: amountLabel
				})]
			}),
			reference && /* @__PURE__ */ jsxs("div", {
				className: "mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--gold-500)]/45 bg-[var(--canvas)] p-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: t("checkout.fawryRefTitle")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 font-mono text-sm font-bold break-all",
					children: reference
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-xs font-medium text-amber-600",
				children: t("checkout.notPaidNote")
			})
		]
	});
}
// src/lib/instapay-payment.ts
/**
* Helpers for the customer-facing InstaPay payment step.
*
* We never invent a bank deep link. If the clinic configured a real URL
* (https, http or instapay://) it is offered as an "Open InstaPay" action;
* otherwise the configured value is treated as the account/number to display
* and encode in the QR code.
*/
var ALLOWED_LINK_PROTOCOLS = /* @__PURE__ */ new Set([
	"http:",
	"https:",
	"instapay:"
]);
function instapayLink(account) {
	const value = account.trim();
	if (!value) return null;
	try {
		const url = new URL(value);
		return ALLOWED_LINK_PROTOCOLS.has(url.protocol) ? url.toString() : null;
	} catch {
		return null;
	}
}
/** Plain-text QR payload — shows the account and amount on any scanner. */
function instapayQrText(account, amountLabel) {
	return `InstaPay\nAccount: ${account.trim()}\nAmount: ${amountLabel}`;
}
function instapayAccountLabel(account) {
	return account.trim();
}
// src/components/store/InstapayQrPanel.tsx
/** Shows exactly how to pay: a scannable QR, the raw number, and a real link if configured. */
function InstapayQrPanel({ account, amountLabel, compact = false }) {
	const { t } = useI18n();
	const [qr, setQr] = useState("");
	const number = instapayAccountLabel(account);
	const href = instapayLink(account);
	useEffect(() => {
		let active = true;
		setQr("");
		if (!number) return;
		QRCode.toDataURL(instapayQrText(number, amountLabel), {
			margin: 1,
			width: compact ? 256 : 384,
			color: {
				dark: "#17301f",
				light: "#ffffff"
			}
		}).then((dataUrl) => {
			if (active) setQr(dataUrl);
		}).catch(() => {
			if (active) setQr("");
		});
		return () => {
			active = false;
		};
	}, [
		number,
		amountLabel,
		compact
	]);
	if (!number) return /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700",
		children: t("checkout.instapayMissing")
	});
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(number);
			toast.success(t("checkout.instapayCopied"));
		} catch {
			toast.error(t("checkout.instapayCopyFailed"));
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-2xl border border-primary/25 bg-primary/8 p-4", compact && "p-3"),
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "flex items-center gap-2 text-sm font-semibold text-primary",
				children: [/* @__PURE__ */ jsx(Smartphone, { className: "size-4" }), t("checkout.instapayQrTitle")]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs leading-relaxed text-muted-foreground",
				children: t("checkout.instapayQrHint", { amount: amountLabel })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-start", compact && "mt-2"),
				children: [/* @__PURE__ */ jsx("div", {
					className: cn("grid shrink-0 place-items-center rounded-xl border border-border bg-white p-2", compact ? "size-32" : "size-40"),
					children: qr ? /* @__PURE__ */ jsx("img", {
						src: qr,
						alt: t("checkout.instapayQrAlt"),
						className: "size-full"
					}) : /* @__PURE__ */ jsx(Smartphone, { className: "size-8 animate-pulse text-muted-foreground" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1 text-center sm:text-left",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
							children: t("checkout.method.instapay.short")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-0.5 font-mono text-base font-bold break-all",
							children: number
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm font-semibold",
							children: amountLabel
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-[11px] leading-relaxed text-muted-foreground",
							children: t("checkout.instapayScanNote")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex flex-wrap justify-center gap-2 sm:justify-start",
							children: [/* @__PURE__ */ jsxs(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: copy,
								children: [/* @__PURE__ */ jsx(Copy, { className: "size-3.5" }), t("checkout.instapayCopy")]
							}), href && /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								children: /* @__PURE__ */ jsxs("a", {
									href,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ jsx(ExternalLink, { className: "size-3.5" }), t("checkout.instapayOpen")]
								})
							})]
						})
					]
				})]
			})
		]
	});
}
export { FawryPaymentPanel as n, InstapayQrPanel as t };
