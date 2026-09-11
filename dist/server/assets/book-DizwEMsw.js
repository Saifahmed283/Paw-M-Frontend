import { A as useClinicStore, Q as ANIMAL_TYPES, at as bookedSlotsFor, mt as cn, pt as useI18n, rt as TIME_SLOTS, st as Button, t as addBookingRequest } from "./clinic-store-DRj_-uzr.js";
import { i as Route } from "./router-DapoMgG1.js";
import { t as Breadcrumbs } from "./Breadcrumbs-DrSldUTP.js";
import { t as Input } from "./input-DBSwC7Xn.js";
import { t as Label } from "./label-BefElnIl.js";
import { t as ClientAuthGate } from "./ClientAuthGate-C7i4_3Vv.js";
import { t as Textarea } from "./textarea-BGyj1G50.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region src/components/ui/switch.tsx
var Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
//#region src/routes/book.tsx?tsr-split=component
var DRAFT_KEY = "paw-m:booking-draft";
var EMPTY = {
	ownerName: "",
	phone: "",
	email: "",
	petName: "",
	animalType: "Dog",
	age: "",
	weight: "",
	symptoms: "",
	allergies: "",
	medications: "",
	doctorId: "",
	date: "",
	time: "",
	emergency: false
};
function BookPage() {
	return /* @__PURE__ */ jsx(ClientAuthGate, { children: /* @__PURE__ */ jsx(BookingForm, {}) });
}
function BookingForm() {
	const { doctor } = Route.useSearch();
	const navigate = useNavigate();
	const { t } = useI18n();
	const { doctors, requests } = useClinicStore();
	const firstDoctor = doctors[0];
	const STEPS = [
		t("booking.step.owner"),
		t("booking.step.pet"),
		t("booking.step.case"),
		t("booking.step.schedule")
	];
	const [step, setStep] = useState(0);
	const [draft, setDraft] = useState({
		...EMPTY,
		doctorId: doctor ?? firstDoctor?.id ?? ""
	});
	useEffect(() => {
		let raw = null;
		try {
			raw = localStorage.getItem(DRAFT_KEY);
		} catch {}
		if (raw) try {
			setDraft((d) => ({
				...d,
				...JSON.parse(raw),
				doctorId: doctor ?? d.doctorId
			}));
		} catch {}
	}, [doctor]);
	useEffect(() => {
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
		} catch {}
	}, [draft]);
	const set = (key, value) => setDraft((d) => ({
		...d,
		[key]: value
	}));
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const activeBookings = requests.filter((r) => r.status !== "cancelled");
	const booked = draft.date ? bookedSlotsFor(draft.date, draft.doctorId, activeBookings) : [];
	const valid = [
		draft.ownerName.trim().length > 1 && draft.phone.trim().length > 5,
		draft.petName.trim().length > 0 && draft.animalType.length > 0,
		draft.symptoms.trim().length > 4,
		Boolean(draft.date && draft.time)
	];
	const submit = async () => {
		const selDoctor = doctors.find((d) => d.id === draft.doctorId);
		if (!selDoctor) {
			toast.error(t("booking.error.doctor"));
			setStep(3);
			return;
		}
		try {
			await addBookingRequest({
				ownerName: draft.ownerName,
				phone: draft.phone,
				email: draft.email,
				petName: draft.petName,
				animalType: draft.animalType === "Other" && draft.customAnimalType ? draft.customAnimalType : draft.animalType,
				age: draft.age,
				weight: draft.weight,
				symptoms: draft.symptoms,
				allergies: draft.allergies,
				medications: draft.medications,
				doctorId: selDoctor.id,
				doctorName: t(`doc.${selDoctor.id}.name`),
				date: draft.date,
				time: draft.time,
				emergency: draft.emergency
			});
		} catch {
			toast.error(t("booking.error.failed"));
			return;
		}
		try {
			localStorage.removeItem(DRAFT_KEY);
		} catch {}
		toast.success(t("booking.requested"));
		navigate({
			to: "/booking/success",
			search: {
				pet: draft.petName,
				date: draft.date,
				time: draft.time,
				doctor: t(`doc.${selDoctor.id}.name`)
			}
		});
	};
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient min-h-screen pb-24 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-5 sm:px-8",
			children: [
				/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
					label: t("crumb.home"),
					to: "/"
				}, {
					label: t("crumb.book"),
					to: "/book"
				}] }),
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .55,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold sm:text-4xl",
						children: t("booking.title")
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-base text-muted-foreground",
						children: t("booking.subtitle")
					})]
				}),
				/* @__PURE__ */ jsx("ol", {
					className: "mt-8 flex items-center gap-2",
					children: STEPS.map((label, i) => /* @__PURE__ */ jsxs("li", {
						className: "flex flex-1 items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors", i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
								children: i < step ? /* @__PURE__ */ jsx(Check, {
									className: "size-3.5",
									strokeWidth: 3
								}) : i + 1
							}),
							/* @__PURE__ */ jsx("span", {
								className: cn("hidden text-xs font-medium sm:inline", i === step ? "text-foreground" : "text-muted-foreground"),
								children: label
							}),
							i < STEPS.length - 1 && /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
						]
					}, label))
				}),
				/* @__PURE__ */ jsx(AnimatePresence, {
					mode: "wait",
					initial: false,
					children: /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: 24
						},
						animate: {
							opacity: 1,
							x: 0
						},
						exit: {
							opacity: 0,
							x: -24
						},
						transition: {
							duration: .3,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: "mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8",
						children: [
							step === 0 && /* @__PURE__ */ jsxs("div", {
								className: "grid gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.owner.fullName"),
										required: true,
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.ownerName,
											onChange: (e) => set("ownerName", e.target.value),
											placeholder: t("booking.ph.name")
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.owner.phone"),
										required: true,
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.phone,
											onChange: (e) => set("phone", e.target.value),
											placeholder: t("booking.ph.phone")
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.owner.email"),
										className: "sm:col-span-2",
										children: /* @__PURE__ */ jsx(Input, {
											type: "email",
											value: draft.email,
											onChange: (e) => set("email", e.target.value),
											placeholder: t("booking.ph.email")
										})
									})
								]
							}),
							step === 1 && /* @__PURE__ */ jsxs("div", {
								className: "grid gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.pet.name"),
										required: true,
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.petName,
											onChange: (e) => set("petName", e.target.value),
											placeholder: t("booking.ph.petName")
										})
									}),
									/* @__PURE__ */ jsxs(Field, {
										label: t("booking.pet.type"),
										required: true,
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: ANIMAL_TYPES.map((type) => /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													set("animalType", type);
													if (type !== "Other") set("customAnimalType", void 0);
												},
												className: cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", draft.animalType === type ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"),
												children: t(`animal.${type}`)
											}, type))
										}), draft.animalType === "Other" && /* @__PURE__ */ jsx(Field, {
											label: t("booking.pet.otherType"),
											children: /* @__PURE__ */ jsx(Input, {
												value: draft.customAnimalType ?? "",
												onChange: (e) => set("customAnimalType", e.target.value),
												placeholder: t("booking.ph.otherPetType")
											})
										})]
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.pet.age"),
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.age,
											onChange: (e) => set("age", e.target.value),
											placeholder: t("booking.ph.age")
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.pet.weight"),
										children: /* @__PURE__ */ jsx(Input, {
											value: draft.weight,
											onChange: (e) => set("weight", e.target.value),
											placeholder: t("booking.ph.weight")
										})
									})
								]
							}),
							step === 2 && /* @__PURE__ */ jsxs("div", {
								className: "grid gap-5",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.case.symptoms"),
										required: true,
										children: /* @__PURE__ */ jsx(Textarea, {
											rows: 4,
											value: draft.symptoms,
											onChange: (e) => set("symptoms", e.target.value),
											placeholder: t("booking.ph.symptoms")
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-5 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsx(Field, {
											label: t("booking.case.allergies"),
											children: /* @__PURE__ */ jsx(Input, {
												value: draft.allergies,
												onChange: (e) => set("allergies", e.target.value),
												placeholder: t("booking.ph.allergies")
											})
										}), /* @__PURE__ */ jsx(Field, {
											label: t("booking.case.medications"),
											children: /* @__PURE__ */ jsx(Input, {
												value: draft.medications,
												onChange: (e) => set("medications", e.target.value),
												placeholder: t("booking.ph.medications")
											})
										})]
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "flex items-center justify-between rounded-xl border border-border p-4",
										children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
											className: "block text-sm font-medium",
											children: t("booking.case.emergency")
										}), /* @__PURE__ */ jsx("span", {
											className: "mt-0.5 block text-xs text-muted-foreground",
											children: t("booking.case.emergencyDesc")
										})] }), /* @__PURE__ */ jsx(Switch, {
											checked: draft.emergency,
											onCheckedChange: (v) => set("emergency", v)
										})]
									})
								]
							}),
							step === 3 && /* @__PURE__ */ jsxs("div", {
								className: "grid gap-6",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.schedule.doctor"),
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap gap-2",
											children: [doctors.map((d) => /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => set("doctorId", d.id),
												className: cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", draft.doctorId === d.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"),
												children: t(`doc.${d.id}.name`)
											}, d.id)), doctors.length === 0 && /* @__PURE__ */ jsx("p", {
												className: "w-full text-xs text-muted-foreground",
												children: t("booking.empty.doctors")
											})]
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.schedule.date"),
										required: true,
										children: /* @__PURE__ */ jsx(Input, {
											type: "date",
											min: today,
											value: draft.date,
											onChange: (e) => set("date", e.target.value)
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: t("booking.schedule.time"),
										required: true,
										children: !draft.date ? /* @__PURE__ */ jsx("p", {
											className: "text-sm text-muted-foreground",
											children: t("booking.schedule.hint")
										}) : /* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-3 gap-2 sm:grid-cols-6",
											children: TIME_SLOTS.map((slot) => {
												const taken = booked.includes(slot);
												return /* @__PURE__ */ jsx("button", {
													type: "button",
													disabled: taken,
													onClick: () => set("time", slot),
													className: cn("rounded-lg border px-2 py-2 text-xs font-medium transition-colors", taken && "cursor-not-allowed border-border text-muted-foreground/40 line-through", !taken && draft.time === slot && "border-primary bg-primary text-primary-foreground", !taken && draft.time !== slot && "border-border text-foreground hover:border-primary/40"),
													children: slot
												}, slot);
											})
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-8 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ jsxs(Button, {
									variant: "ghost",
									onClick: () => setStep((s) => Math.max(0, s - 1)),
									disabled: step === 0,
									children: [
										/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
										" ",
										t("booking.back")
									]
								}), step < STEPS.length - 1 ? /* @__PURE__ */ jsxs(Button, {
									onClick: () => setStep((s) => s + 1),
									disabled: !valid[step],
									className: "shadow-glow",
									children: [
										t("booking.continue"),
										" ",
										/* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
									]
								}) : /* @__PURE__ */ jsxs(Button, {
									onClick: submit,
									disabled: !valid[3],
									className: "shadow-glow",
									children: [
										t("booking.confirm"),
										" ",
										/* @__PURE__ */ jsx(Check, { className: "size-4" })
									]
								})]
							})
						]
					}, step)
				})
			]
		})
	});
}
function Field({ label, required, className, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("grid gap-2", className),
		children: [/* @__PURE__ */ jsxs(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: [label, required && /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: " *"
			})]
		}), children]
	});
}
//#endregion
export { BookPage as component };
