import { r as Route, v as Button } from "./router-BUQCqre7.js";
import { n as CardContent, t as Card } from "./card-5mwmfuOp.js";
import { t as ClientAuthGate } from "./ClientAuthGate-CKlwY5LS.js";
import { t as Breadcrumbs } from "./Breadcrumbs-DPWcdaqD.js";
import { a as getPetHistory } from "./client-medical-DQP12hZX.js";
import { D as cn, E as useI18n } from "./api-FSDIrj9h.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, PawPrint } from "lucide-react";
// src/routes/account.pets.$petId.tsx?tsr-split=component
function PetHistoryPage() {
	const { petId } = Route.useParams();
	const { t } = useI18n();
	const { data: history, isLoading, error } = useQuery({
		queryKey: ["pet-history", petId],
		queryFn: () => getPetHistory(petId),
		retry: 1
	});
	return /* @__PURE__ */ jsx(ClientAuthGate, { children: /* @__PURE__ */ jsx("section", {
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
						label: history?.pet.name ?? "Pet",
						to: `/account/pets/${petId}`
					}
				] }),
				isLoading && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: "Loading…"
				}) }),
				error && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [
						"Could not load this pet.",
						` `,
						/* @__PURE__ */ jsx(Link, {
							to: "/account",
							className: "text-primary underline-offset-4 hover:underline",
							children: "Back to My Account"
						})
					]
				}) }),
				history && /* @__PURE__ */ jsxs("div", {
					className: "grid gap-6",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-card",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [history.pet.photo ? /* @__PURE__ */ jsx("img", {
									src: history.pet.photo,
									alt: history.pet.name,
									className: "size-20 rounded-full object-cover"
								}) : /* @__PURE__ */ jsx("span", {
									className: "grid size-20 place-items-center rounded-full bg-primary/10 text-3xl",
									children: emojiFor(history.pet.species)
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-2xl font-bold",
										children: history.pet.name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm text-muted-foreground",
										children: [history.pet.species, history.pet.breed].filter(Boolean).join(" · ")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 flex flex-wrap gap-1.5 text-xs font-medium",
										children: [
											history.pet.weightKg && /* @__PURE__ */ jsx(Chip, { children: `${history.pet.weightKg} kg` }),
											history.pet.color && /* @__PURE__ */ jsx(Chip, { children: history.pet.color }),
											history.pet.dob && /* @__PURE__ */ jsx(Chip, { children: `Born ${formatShort(history.pet.dob)}` })
										]
									})
								] })]
							})
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
							className: "mb-3 flex items-center gap-2 text-lg font-semibold",
							children: [
								/* @__PURE__ */ jsx(PawPrint, { className: "size-5 text-primary" }),
								" Visits",
								/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: [
										"(",
										history.bookings.length,
										")"
									]
								})
							]
						}), history.bookings.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "No visits recorded yet."
						}) }) : /* @__PURE__ */ jsx("div", {
							className: "grid gap-3",
							children: [...history.bookings].sort((a, b) => b.date.localeCompare(a.date)).map((b) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border p-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ jsxs("p", {
											className: "text-sm font-medium",
											children: [
												formatShort(b.date),
												" · ",
												b.time,
												" — ",
												b.doctorName
											]
										}), /* @__PURE__ */ jsx("span", {
											className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", b.status === "completed" ? "bg-sky-100 text-sky-700" : b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : b.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"),
											children: b.status
										})]
									}),
									b.symptoms && /* @__PURE__ */ jsxs("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium text-foreground",
											children: "Symptoms: "
										}), b.symptoms]
									}),
									(b.diagnosis || b.treatmentNotes) && /* @__PURE__ */ jsxs("div", {
										className: "mt-2 grid gap-2 text-sm sm:grid-cols-2",
										children: [b.diagnosis && /* @__PURE__ */ jsxs("p", {
											className: "rounded-lg bg-muted/60 p-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold",
													children: "Diagnosis:"
												}),
												" ",
												b.diagnosis
											]
										}), b.treatmentNotes && /* @__PURE__ */ jsxs("p", {
											className: "rounded-lg bg-muted/60 p-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold",
													children: "Treatment:"
												}),
												" ",
												b.treatmentNotes
											]
										})]
									})
								]
							}, b.id))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
							className: "mb-3 flex items-center gap-2 text-lg font-semibold",
							children: [
								/* @__PURE__ */ jsx(FileText, { className: "size-5 text-primary" }),
								" Prescriptions",
								/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: [
										"(",
										history.prescriptions.length,
										")"
									]
								})
							]
						}), history.prescriptions.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "No prescriptions yet."
						}) }) : /* @__PURE__ */ jsx("div", {
							className: "grid gap-3",
							children: history.prescriptions.map((rx) => /* @__PURE__ */ jsxs(Link, {
								to: "/account/rx/$rxId",
								params: { rxId: rx.id },
								className: "flex items-center justify-between gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-mono text-sm font-semibold break-all",
										children: rx.rxNumber
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground",
										children: [
											formatShort(rx.issuedAt ?? rx.createdAt),
											" ·",
											" ",
											rx.doctor?.name ?? "Clinic"
										]
									})]
								}), /* @__PURE__ */ jsx("span", {
									className: cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase", rx.status === "issued" ? "bg-emerald-100 text-emerald-700" : rx.status === "void" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"),
									children: rx.status
								})]
							}, rx.id))
						})] }),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							className: "justify-self-start",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/account",
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), " Back to My Account"]
							})
						})
					]
				})
			]
		})
	}) });
}
function Chip({ children }) {
	return /* @__PURE__ */ jsx("span", {
		className: "rounded-full bg-muted px-2.5 py-1 text-muted-foreground",
		children
	});
}
function formatShort(input) {
	if (!input) return "—";
	try {
		return (/* @__PURE__ */ new Date(`${input}T00:00:00`)).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	} catch {
		return input;
	}
}
function emojiFor(species) {
	const clean = species.toLowerCase();
	if (clean.includes("cat")) return "🐱";
	if (clean.includes("bird")) return "🐦";
	if (clean.includes("rabbit")) return "🐰";
	if (clean.includes("reptile") || clean.includes("lizard") || clean.includes("turtle")) return "🦎";
	if (clean.includes("hamster") || clean.includes("rodent") || clean.includes("rat")) return "🐹";
	return "🐶";
}
export { PetHistoryPage as component };
