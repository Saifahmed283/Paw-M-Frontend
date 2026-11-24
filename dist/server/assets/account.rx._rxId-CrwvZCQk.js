import { _ as Button, n as Route } from "./router-yukFS4ln.js";
import { n as CardContent, t as Card } from "./card-GWMxhZOk.js";
import { t as ClientAuthGate } from "./ClientAuthGate-HEJQ6SuY.js";
import { t as Breadcrumbs } from "./Breadcrumbs-Bip_0wCP.js";
import { E as useI18n } from "./api-Bh9u3hbQ.js";
import { s as getPrescription } from "./client-medical-B0CR7VQ5.js";
import { n as PrintCss, t as PrescriptionDocument } from "./PrescriptionDocument-DUTA96bT.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Printer } from "lucide-react";
import { toast } from "sonner";
// src/routes/account.rx.$rxId.tsx?tsr-split=component
function RxPage() {
	const { rxId } = Route.useParams();
	const { t } = useI18n();
	const { data: rx, isLoading, error } = useQuery({
		queryKey: ["prescription", rxId],
		queryFn: () => getPrescription(rxId),
		retry: 1
	});
	const copyNumber = async () => {
		if (!rx) return;
		try {
			await navigator.clipboard.writeText(rx.rxNumber);
			toast.success("Prescription number copied");
		} catch {
			toast.error("Could not copy");
		}
	};
	return /* @__PURE__ */ jsxs(ClientAuthGate, { children: [/* @__PURE__ */ jsx(PrintCss, {}), /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-dvh pb-24 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-5 sm:px-8",
			children: [
				/* @__PURE__ */ jsx(Breadcrumbs, { items: [
					{
						label: t("crumb.home"),
						to: "/"
					},
					{
						label: "My Account",
						to: "/account"
					},
					{
						label: "Prescriptions",
						to: "/account"
					},
					{
						label: rx?.rxNumber ?? "Rx",
						to: `/account/rx/${rxId}`
					}
				] }),
				isLoading && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: "Loading…"
				}) }),
				error && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [
						"This prescription could not be loaded.",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: "/account",
							className: "text-primary underline-offset-4 hover:underline",
							children: "Back to My Account"
						})
					]
				}) }),
				rx && /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "no-print flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/account",
										children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), " My Account"]
									})
								}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									size: "sm",
									onClick: copyNumber,
									children: [
										/* @__PURE__ */ jsx(Copy, { className: "size-4" }),
										" ",
										rx.rxNumber
									]
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									className: "ml-auto shadow-glow",
									onClick: () => window.print(),
									children: [/* @__PURE__ */ jsx(Printer, { className: "size-4" }), " Print / Save PDF"]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "print-sheet overflow-hidden rounded-2xl border border-border shadow-card",
							children: /* @__PURE__ */ jsx(PrescriptionDocument, { rx })
						}),
						/* @__PURE__ */ jsx("p", {
							className: "no-print text-center text-xs text-muted-foreground",
							children: "Show the printed copy when collecting medication. The QR code lets any clinic verify this prescription instantly."
						})
					]
				})
			]
		})
	})] });
}
export { RxPage as component };
