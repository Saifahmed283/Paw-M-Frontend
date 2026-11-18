import { t as Breadcrumbs } from "./Breadcrumbs-DGkWoc1l.js";
import { D as useI18n, b as Button } from "./api-C5O-PhXZ.js";
import { n as CardContent, t as Card } from "./card-DjShPZvl.js";
import { f as verifyRxCode } from "./client-medical-DxIdMvXP.js";
import { a as Route } from "./router-DIpJac25.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, XCircle } from "lucide-react";
// src/routes/rx.verify.tsx?tsr-split=component
function VerifyPage() {
	const { code } = Route.useSearch();
	const { t } = useI18n();
	const [state, setState] = useState({ kind: "loading" });
	const [input, setInput] = useState(code ?? "");
	const run = async (value) => {
		const clean = value.trim().toUpperCase();
		if (!clean) {
			setState({
				kind: "invalid",
				message: "Enter a verification code to check a prescription."
			});
			return;
		}
		setState({ kind: "loading" });
		try {
			const res = await verifyRxCode(clean);
			if (res.valid) setState({
				kind: "valid",
				rxNumber: res.rxNumber ?? clean,
				...res.pet?.name !== void 0 ? { pet: res.pet.name } : {},
				...res.doctor?.name !== void 0 ? { doctor: res.doctor.name } : {},
				...res.diagnosis !== void 0 ? { diagnosis: res.diagnosis } : {},
				...res.issuedAt !== void 0 ? { issuedAt: res.issuedAt } : {}
			});
			else setState({
				kind: "invalid",
				message: res.message ?? "This prescription could not be verified."
			});
		} catch {
			setState({
				kind: "invalid",
				message: "Verification service is unavailable right now. Try again later."
			});
		}
	};
	useEffect(() => {
		if (code) run(code);
	}, [code]);
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-screen pb-24 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-lg px-5 sm:px-8",
			children: [
				/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
					label: t("crumb.home"),
					to: "/"
				}, {
					label: "Verify Prescription",
					to: "/rx/verify"
				}] }),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-3 text-3xl font-bold",
					children: "Verify a prescription"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Enter the 8-character code printed under the QR code of any Paw-M prescription, or scan the QR with your camera."
				}),
				/* @__PURE__ */ jsxs("form", {
					className: "mt-6 flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						run(input);
					},
					children: [/* @__PURE__ */ jsx("input", {
						value: input,
						onChange: (e) => setInput(e.target.value.toUpperCase()),
						placeholder: "e.g. A8K3P2XQ",
						className: "h-11 flex-1 rounded-xl border border-border bg-card px-4 font-mono text-sm uppercase tracking-widest outline-none focus:border-primary",
						"aria-label": "Verification code"
					}), /* @__PURE__ */ jsx(Button, {
						type: "submit",
						className: "shadow-glow",
						children: "Verify"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6",
					children: [
						state.kind === "loading" && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
							className: "py-10 text-center text-sm text-muted-foreground",
							children: "Checking…"
						}) }),
						state.kind === "valid" && /* @__PURE__ */ jsx(Card, {
							className: "border-emerald-300 bg-emerald-50 shadow-card",
							children: /* @__PURE__ */ jsxs(CardContent, {
								className: "py-8 text-center",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "mx-auto size-10 text-emerald-600" }),
									/* @__PURE__ */ jsx("h2", {
										className: "mt-3 text-lg font-bold text-emerald-800",
										children: "This prescription is authentic"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 font-mono text-sm font-semibold text-emerald-700",
										children: state.rxNumber
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-4 grid gap-1 text-sm text-emerald-800",
										children: [
											state.pet && /* @__PURE__ */ jsxs("p", { children: ["Patient: ", /* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: state.pet
											})] }),
											state.doctor && /* @__PURE__ */ jsxs("p", { children: ["Clinician: ", /* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: state.doctor
											})] }),
											state.diagnosis && /* @__PURE__ */ jsxs("p", { children: ["Diagnosis: ", /* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: state.diagnosis
											})] }),
											state.issuedAt && /* @__PURE__ */ jsxs("p", { children: [
												"Issued:",
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold",
													children: new Date(state.issuedAt).toLocaleDateString("en-GB", {
														day: "numeric",
														month: "short",
														year: "numeric"
													})
												})
											] })
										]
									})
								]
							})
						}),
						state.kind === "invalid" && /* @__PURE__ */ jsx(Card, {
							className: "border-red-200 bg-red-50 shadow-card",
							children: /* @__PURE__ */ jsxs(CardContent, {
								className: "py-8 text-center",
								children: [
									/* @__PURE__ */ jsx(XCircle, { className: "mx-auto size-10 text-red-600" }),
									/* @__PURE__ */ jsx("h2", {
										className: "mt-3 text-lg font-bold text-red-700",
										children: "Verification failed"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm text-red-700",
										children: state.message
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-4 text-xs text-red-600",
										children: "Contact Paw Clinic Madinaty if you believe this prescription is legitimate."
									})
								]
							})
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-8 text-center text-xs text-muted-foreground",
					children: "© 2026 Paw Clinic Madinaty — Property of Paw-M Clinic. Reproduction prohibited."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 text-center",
					children: /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							children: "Back to home"
						})
					})
				})
			]
		})
	});
}
export { VerifyPage as component };
