import { a as logoutClient, f as Button, v as useI18n, y as cn } from "./api-D3RhbogT.js";
import { t as Breadcrumbs } from "./Breadcrumbs-Cmbq3VA9.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CCY8qCB2.js";
import { t as Input } from "./input-OXLB60d-.js";
import { t as Label } from "./label-Dew9Kvkb.js";
import { t as ClientAuthGate } from "./ClientAuthGate-Byhf7r5I.js";
import { i as getMyProfile, r as deletePet, t as createPet } from "./client-medical-DNQooMV0.js";
import { t as Badge } from "./badge-oX2i6NYH.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CcCyBjC6.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Bla72SS7.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText, LayoutDashboard, LogOut, PawPrint, Pencil, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
//#region src/routes/account.tsx?tsr-split=component
var TABS = [
	{
		id: "overview",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		id: "pets",
		label: "My Pets",
		icon: PawPrint
	},
	{
		id: "appointments",
		label: "Appointments",
		icon: CalendarDays
	},
	{
		id: "orders",
		label: "Orders",
		icon: ShoppingBag
	},
	{
		id: "prescriptions",
		label: "Prescriptions",
		icon: FileText
	}
];
function AccountPage() {
	return /* @__PURE__ */ jsx(ClientAuthGate, { children: /* @__PURE__ */ jsx(AccountPortal, {}) });
}
function AccountPortal() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [tab, setTab] = useState("overview");
	const { data: profile, isLoading, refetch } = useQuery({
		queryKey: ["me"],
		queryFn: getMyProfile
	});
	const signOut = async () => {
		await logoutClient();
		toast.success("Signed out");
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
		className: "hero-gradient border-b border-border pb-4 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children: [/* @__PURE__ */ jsx(Breadcrumbs, { items: [{
				label: t("crumb.home"),
				to: "/"
			}, {
				label: "My Account",
				to: "/account"
			}] }), /* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-14 place-items-center rounded-2xl bg-primary/10 text-xl font-bold text-primary",
						children: ((profile?.client.fullName ?? "?").charAt(0) || "?").toUpperCase()
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-2xl font-bold sm:text-3xl",
						children: ["Welcome back", profile ? `, ${profile.client.fullName.split(" ")[0]}` : ""]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: profile?.client.email
					})] })]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: signOut,
					children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), " Sign out"]
				})]
			})]
		})
	}), /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-5 py-10 sm:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ jsx("nav", {
				className: "flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start",
				children: TABS.map((item) => /* @__PURE__ */ jsxs("button", {
					onClick: () => setTab(item.id),
					className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", tab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
					children: [/* @__PURE__ */ jsx(item.icon, { className: "size-4" }), item.label]
				}, item.id))
			}), /* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children: isLoading && !profile ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: "Loading your account…"
				}) }) : tab === "overview" ? /* @__PURE__ */ jsx(OverviewTab, {
					profile,
					onGoPets: () => setTab("pets"),
					onGoRx: () => setTab("prescriptions")
				}) : tab === "pets" ? /* @__PURE__ */ jsx(PetsTab, {
					profile,
					refetch
				}) : tab === "appointments" ? /* @__PURE__ */ jsx(AppointmentsTab, { profile }) : tab === "orders" ? /* @__PURE__ */ jsx(OrdersTab, { profile }) : /* @__PURE__ */ jsx(PrescriptionsTab, { profile })
			})]
		})
	})] });
}
function OverviewTab({ profile, onGoPets, onGoRx }) {
	const upcoming = profile.bookings.filter((b) => b.status === "confirmed");
	const issued = profile.prescriptions.filter((p) => p.status === "issued");
	const recent = [...profile.bookings].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 3);
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "My Pets",
					value: String(profile.pets.length),
					onClick: onGoPets
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Upcoming visits",
					value: String(upcoming.length)
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Prescriptions",
					value: String(issued.length),
					onClick: onGoRx
				})
			]
		}), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
			className: "text-base",
			children: "Recent appointments"
		}) }), /* @__PURE__ */ jsxs(CardContent, {
			className: "grid gap-3",
			children: [recent.length === 0 && /* @__PURE__ */ jsxs("p", {
				className: "py-6 text-center text-sm text-muted-foreground",
				children: [
					"No bookings yet.",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: "/book",
						className: "text-primary underline-offset-4 hover:underline",
						children: "Book a visit"
					})
				]
			}), recent.map((b) => /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
					className: "text-sm font-medium",
					children: [
						b.petName,
						" · ",
						b.doctorName
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [
						fmtTime(b.date, b.time),
						" — ",
						b.symptoms || b.status
					]
				})] }), /* @__PURE__ */ jsx(StatusBadge, { status: b.status })]
			}, b.id))]
		})] })]
	});
}
function StatCard({ label, value, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		onClick,
		className: cn("rounded-2xl border border-border p-4 text-start shadow-card transition-colors", onClick ? "hover:border-primary/40" : "cursor-default"),
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-3xl font-bold",
			children: value
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-xs font-medium text-muted-foreground",
			children: label
		})]
	});
}
function PetsTab({ profile, refetch }) {
	const [open, setOpen] = useState(false);
	const pets = profile.pets;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-semibold",
					children: "My pets"
				}), /* @__PURE__ */ jsxs(Button, {
					size: "sm",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), " Add a pet"]
				})]
			}),
			pets.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
				className: "py-14 text-center",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-14 place-items-center rounded-3xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(PawPrint, { className: "size-7" })
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No pets yet. Add your first pet to get faster bookings and visit history."
				})]
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: pets.map((pet) => /* @__PURE__ */ jsx(PetCard, {
					pet,
					refetch
				}, pet.id))
			}),
			open && /* @__PURE__ */ jsx(AddPetDialog, { onClose: () => {
				setOpen(false);
				refetch();
			} })
		]
	});
}
function PetCard({ pet, refetch }) {
	const handleDelete = async () => {
		if (!window.confirm(`Delete ${pet.name} and its medical history?`)) return;
		try {
			await deletePet(pet.id);
			toast.success(`${pet.name} deleted`);
			refetch();
		} catch {
			toast.error("Could not delete the pet");
		}
	};
	return /* @__PURE__ */ jsxs(Link, {
		to: "/account/pets/$petId",
		params: { petId: pet.id },
		className: "group flex items-center gap-4 rounded-2xl border border-border p-4 shadow-card transition-colors hover:border-primary/40",
		children: [
			pet.photo ? /* @__PURE__ */ jsx("img", {
				src: pet.photo,
				alt: pet.name,
				className: "size-14 shrink-0 rounded-full object-cover"
			}) : /* @__PURE__ */ jsx("span", {
				className: "grid size-14 shrink-0 place-items-center rounded-full bg-muted text-2xl",
				children: emojiFor(pet.species)
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "block font-semibold",
						children: pet.name
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "block truncate text-xs text-muted-foreground",
						children: [[
							pet.species,
							pet.breed,
							pet.sex ? pet.sex === "male" ? "Male" : "Female" : ""
						].filter(Boolean).join(" · "), pet.weightKg ? ` · ${pet.weightKg} kg` : ""]
					}),
					pet.dob && /* @__PURE__ */ jsxs("span", {
						className: "block text-xs text-muted-foreground",
						children: ["Born ", fmt(pet.dob)]
					})
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				size: "sm",
				variant: "ghost",
				className: "h-8 px-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
				"aria-label": "Delete pet",
				onClick: (e) => {
					e.preventDefault();
					handleDelete();
				},
				children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
			})
		]
	});
}
var EMPTY_PET = {
	name: "",
	species: "Dog",
	breed: "",
	sex: "female",
	dob: "",
	weightKg: "",
	color: "",
	microchip: "",
	notes: "",
	photo: ""
};
function AddPetDialog({ onClose }) {
	const [form, setForm] = useState(EMPTY_PET);
	const [busy, setBusy] = useState(false);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const save = async () => {
		if (!form.name.trim()) return;
		setBusy(true);
		try {
			await createPet({
				name: form.name.trim(),
				species: form.species === "Other" ? form.breed || "Other" : form.species,
				breed: form.breed.trim(),
				sex: form.sex,
				dob: form.dob,
				weightKg: form.weightKg.trim(),
				color: form.color.trim(),
				microchip: form.microchip.trim(),
				photo: form.photo,
				notes: form.notes.trim()
			});
			toast.success(`${form.name.trim()} added to your pets`);
			onClose();
		} catch {
			toast.error("Could not add the pet");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Add a pet" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Saved pets appear in the booking flow and keep a lifelong visit history." })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						form.photo ? /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: form.photo,
								alt: "Pet",
								className: "size-16 rounded-2xl object-cover"
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => set("photo", ""),
								children: "Remove photo"
							})]
						}) : /* @__PURE__ */ jsx(PetPhotoPicker, { onPicked: (dataUrl) => set("photo", dataUrl) }),
						/* @__PURE__ */ jsx(Field, {
							label: "Name",
							required: true,
							children: /* @__PURE__ */ jsx(Input, {
								value: form.name,
								onChange: (e) => set("name", e.target.value)
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Species",
								children: /* @__PURE__ */ jsxs(Select, {
									value: form.species,
									onValueChange: (v) => set("species", v),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: [
										"Dog",
										"Cat",
										"Bird",
										"Rabbit",
										"Reptile",
										"Other"
									].map((s) => /* @__PURE__ */ jsx(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Breed",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.breed,
									onChange: (e) => set("breed", e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Sex",
								children: /* @__PURE__ */ jsxs(Select, {
									value: form.sex,
									onValueChange: (v) => set("sex", v),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "female",
										children: "Female"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "male",
										children: "Male"
									})] })]
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Date of birth",
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									value: form.dob,
									onChange: (e) => set("dob", e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Weight (kg)",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.weightKg,
									onChange: (e) => set("weightKg", e.target.value)
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Color",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.color,
									onChange: (e) => set("color", e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Microchip",
							children: /* @__PURE__ */ jsx(Input, {
								value: form.microchip,
								onChange: (e) => set("microchip", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Notes",
							children: /* @__PURE__ */ jsx(Input, {
								value: form.notes,
								onChange: (e) => set("notes", e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: busy || !form.name.trim(),
					children: busy ? "Saving…" : "Add pet"
				})] })
			]
		})
	});
}
function PetPhotoPicker({ onPicked }) {
	const pick = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, 512 / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.round(img.width * scale);
			canvas.height = Math.round(img.height * scale);
			canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
			onPicked(canvas.toDataURL("image/jpeg", .82));
		};
		img.src = URL.createObjectURL(file);
	};
	return /* @__PURE__ */ jsxs("label", {
		className: "flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
		children: [
			/* @__PURE__ */ jsx(Plus, { className: "size-4" }),
			" Add a photo",
			/* @__PURE__ */ jsx("input", {
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: pick
			})
		]
	});
}
function AppointmentsTab({ profile }) {
	const sorted = [...profile.bookings].sort((a, b) => b.date.localeCompare(a.date));
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: "Appointments"
			}),
			sorted.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
				className: "py-14 text-center text-sm text-muted-foreground",
				children: "No appointments yet."
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3",
				children: sorted.map((b) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "font-medium",
								children: [
									b.petName,
									" — ",
									b.doctorName
								]
							}), /* @__PURE__ */ jsx(StatusBadge, { status: b.status })]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [fmtTime(b.date, b.time), b.followUpDate ? ` · Follow-up ${fmt(b.followUpDate)}` : ""]
						}),
						b.symptoms && /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: b.symptoms
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-2 text-xs sm:grid-cols-2",
							children: [b.diagnosis && /* @__PURE__ */ jsxs("p", {
								className: "rounded-lg bg-muted/60 p-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-foreground",
									children: "Diagnosis: "
								}), b.diagnosis]
							}), b.treatmentNotes && /* @__PURE__ */ jsxs("p", {
								className: "rounded-lg bg-muted/60 p-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-foreground",
									children: "Treatment: "
								}), b.treatmentNotes]
							})]
						})
					]
				}, b.id))
			})
		]
	});
}
function OrdersTab({ profile }) {
	const sorted = [...profile.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: "Orders"
			}),
			sorted.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
				className: "py-14 text-center text-sm text-muted-foreground",
				children: [
					"No orders yet.",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: "/store",
						className: "text-primary underline-offset-4 hover:underline",
						children: "Visit the store"
					})
				]
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3",
				children: sorted.map((o) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "font-medium",
								children: ["Order ", o.id.replace(/^order-/, "#")]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-1.5",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: o.paymentStatus.replace("_", " ")
								}), /* @__PURE__ */ jsx(StatusBadge, { status: o.status })]
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								fmt(o.createdAt),
								" · ",
								o.paymentMethod,
								" · EGP ",
								o.total.toFixed(2)
							]
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "mt-2 grid gap-1 text-xs text-muted-foreground",
							children: [o.items.slice(0, 3).map((item) => /* @__PURE__ */ jsxs("li", { children: [
								item.qty,
								"× ",
								item.name
							] }, item.id)), o.items.length > 3 && /* @__PURE__ */ jsxs("li", { children: [
								"… and ",
								o.items.length - 3,
								" more"
							] })]
						})
					]
				}, o.id))
			})
		]
	});
}
function PrescriptionsTab({ profile }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: "Prescriptions"
			}),
			profile.prescriptions.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
				className: "py-14 text-center text-sm text-muted-foreground",
				children: "No prescriptions yet."
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3",
				children: [...profile.prescriptions].sort((a, b) => (b.issuedAt ?? b.createdAt).localeCompare(a.issuedAt ?? a.createdAt)).map((rx) => /* @__PURE__ */ jsxs(Link, {
					to: "/account/rx/$rxId",
					params: { rxId: rx.id },
					className: "flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-mono text-sm font-semibold",
						children: rx.rxNumber
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							rx.petName || rx.pet?.name || "Pet",
							" · ",
							fmt(rx.issuedAt ?? rx.createdAt),
							rx.diagnosis ? ` · ${rx.diagnosis}` : ""
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(RxBadge, { status: rx.status }), /* @__PURE__ */ jsx(Pencil, { className: "size-3.5 text-muted-foreground" })]
					})]
				}, rx.id))
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", {
			pending: "bg-amber-100 text-amber-700",
			confirmed: "bg-emerald-100 text-emerald-700",
			completed: "bg-sky-100 text-sky-700",
			cancelled: "bg-red-100 text-red-700"
		}[status] ?? "bg-muted text-muted-foreground"),
		children: status
	});
}
function RxBadge({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase", {
			draft: "bg-amber-100 text-amber-700",
			issued: "bg-emerald-100 text-emerald-700",
			void: "bg-red-100 text-red-700"
		}[status]),
		children: status
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ jsxs(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: [label, required && /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: " *"
			})]
		}), children]
	});
}
function fmtTime(date, time) {
	try {
		return (/* @__PURE__ */ new Date(`${date}T${time || "00:00"}:00`)).toLocaleString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	} catch {
		return `${date} ${time}`;
	}
}
function fmt(input) {
	if (!input) return "—";
	try {
		return format(parseISO(input), "d MMM yyyy");
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
//#endregion
export { AccountPage as component };
