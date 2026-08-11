import { A as cn, O as Button, c as deleteRequest, d as saveService, f as setBookingStatus, k as useI18n, l as deleteService, m as useClinicStore, p as updateSettings, s as deleteDoctor, u as saveDoctor } from "./router-DU-JlYMr.js";
import { t as Badge } from "./badge-BfWTLi3d.js";
import { n as Label, r as Input, t as Textarea } from "./textarea-C3wr4mAr.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CalendarClock, HeartPulse, LayoutDashboard, ListChecks, Lock, LogOut, Plus, Radio, Settings, Stethoscope, Trash2, Users, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as TogglePrimitive from "@radix-ui/react-toggle";
//#region src/components/ui/card.tsx
var Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
//#endregion
//#region src/components/ui/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/separator.tsx
var Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/table.tsx
var Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ jsx("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
//#endregion
//#region src/components/ui/toggle.tsx
var toggleVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-9 px-2 min-w-9",
			sm: "h-8 px-1.5 min-w-8",
			lg: "h-10 px-2.5 min-w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ jsx(TogglePrimitive.Root, {
	ref,
	className: cn(toggleVariants({
		variant,
		size,
		className
	})),
	...props
}));
Toggle.displayName = TogglePrimitive.Root.displayName;
//#endregion
//#region src/components/ui/toggle-group.tsx
var ToggleGroupContext = React.createContext({
	size: "default",
	variant: "default"
});
var ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ jsx(ToggleGroupPrimitive.Root, {
	ref,
	className: cn("flex items-center justify-center gap-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ToggleGroupContext.Provider, {
		value: {
			variant,
			size
		},
		children
	})
}));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
var ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
	const context = React.useContext(ToggleGroupContext);
	return /* @__PURE__ */ jsx(ToggleGroupPrimitive.Item, {
		ref,
		className: cn(toggleVariants({
			variant: context.variant || variant,
			size: context.size || size
		}), className),
		...props,
		children
	});
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
//#endregion
//#region src/lib/storage.ts
/**
* Safe localStorage / sessionStorage accessors that never throw.
* Storage can be unavailable (private mode, sandboxed iframes, SSR), so every
* read/write is wrapped in try/catch.
*/
function storage(kind) {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}
function storageGet(kind, key) {
	try {
		return storage(kind)?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function storageSet(kind, key, value) {
	try {
		storage(kind)?.setItem(key, value);
	} catch {}
}
function storageRemove(kind, key) {
	try {
		storage(kind)?.removeItem(key);
	} catch {}
}
//#endregion
//#region src/lib/auth.ts
var PIN_KEY = "pawcare:admin-pin";
var SESSION_KEY = "pawcare:admin-session";
var LOCK_KEY = "pawcare:admin-attempts";
var SESSION_TTL_MS = 288e5;
var LOCKOUT_MS = 6e5;
async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomHex(bytes) {
	const buf = new Uint8Array(bytes);
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) crypto.getRandomValues(buf);
	else for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
	return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPin(pin, salt) {
	return sha256Hex(`${salt}:${pin}`);
}
function readRecord() {
	const raw = storageGet("local", PIN_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed.salt === "string" && typeof parsed.hash === "string" ? parsed : null;
	} catch {
		return null;
	}
}
function isPinConfigured() {
	return readRecord() !== null;
}
/** Set the PIN on first run, or change it when `currentPin` matches. */
async function setPin(currentPin, newPin) {
	const normalized = newPin.trim();
	if (normalized.length < 4) throw new Error("PIN must be at least 4 characters.");
	const record = readRecord();
	if (record) {
		if (await hashPin(currentPin.trim(), record.salt) !== record.hash) throw new Error("Current PIN is incorrect.");
	}
	const salt = randomHex(16);
	const next = {
		salt,
		hash: await hashPin(normalized, salt)
	};
	storageSet("local", PIN_KEY, JSON.stringify(next));
}
async function verifyPin(pin) {
	const record = readRecord();
	if (!record) return false;
	return await hashPin(pin.trim(), record.salt) === record.hash;
}
function readAttempts() {
	const raw = storageGet("local", LOCK_KEY);
	if (!raw) return {
		count: 0,
		lockedUntil: 0
	};
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed.count === "number" ? parsed : {
			count: 0,
			lockedUntil: 0
		};
	} catch {
		return {
			count: 0,
			lockedUntil: 0
		};
	}
}
function isLocked() {
	return readAttempts().lockedUntil > Date.now();
}
function remainingLockMs() {
	return Math.max(0, readAttempts().lockedUntil - Date.now());
}
function recordFailedAttempt() {
	const attempts = readAttempts();
	const count = attempts.count + 1;
	const lockedUntil = count >= 5 ? Date.now() + LOCKOUT_MS : attempts.lockedUntil;
	storageSet("local", LOCK_KEY, JSON.stringify({
		count,
		lockedUntil
	}));
}
function clearAttempts() {
	storageRemove("local", LOCK_KEY);
}
async function unlock(pin) {
	if (isLocked()) return false;
	if (!await verifyPin(pin)) {
		recordFailedAttempt();
		return false;
	}
	clearAttempts();
	const session = {
		token: randomHex(24),
		expiresAt: Date.now() + SESSION_TTL_MS
	};
	storageSet("session", SESSION_KEY, JSON.stringify(session));
	return true;
}
function isAuthed() {
	const raw = storageGet("session", SESSION_KEY);
	if (!raw) return false;
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
	} catch {
		return false;
	}
}
function logout() {
	storageRemove("session", SESSION_KEY);
}
//#endregion
//#region src/routes/dashboard.tsx?tsr-split=component
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
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
function RequestsTable({ requests, onConfirm, onCancel, onDelete }) {
	const { t, lang } = useI18n();
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.owner") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.pet") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.doctor") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.date") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.time") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.requestedAt") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.notes") }),
			/* @__PURE__ */ jsx(TableHead, { children: t("dash.statusCol") }),
			/* @__PURE__ */ jsx(TableHead, {
				className: "text-end",
				children: t("dash.actions")
			})
		] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [requests.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
			colSpan: 9,
			className: "h-32 text-center text-sm text-muted-foreground",
			children: t("dash.empty")
		}) }), requests.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
				className: "whitespace-nowrap font-medium",
				children: r.ownerName
			}), /* @__PURE__ */ jsx("div", {
				className: "whitespace-nowrap text-xs text-muted-foreground",
				children: r.phone
			})] }),
			/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
				className: "whitespace-nowrap font-medium",
				children: r.petName
			}), /* @__PURE__ */ jsx("div", {
				className: "text-xs text-muted-foreground",
				children: r.animalType
			})] }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "whitespace-nowrap text-sm",
				children: r.doctorName
			}),
			/* @__PURE__ */ jsx(TableCell, {
				className: "whitespace-nowrap text-sm",
				children: formatDate(r.date, lang)
			}),
			/* @__PURE__ */ jsx(TableCell, {
				className: "whitespace-nowrap text-sm",
				children: r.time
			}),
			/* @__PURE__ */ jsx(TableCell, {
				className: "whitespace-nowrap text-xs text-muted-foreground",
				children: formatTime(r.createdAt, lang)
			}),
			/* @__PURE__ */ jsx(TableCell, {
				className: "max-w-[220px]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "truncate text-xs text-muted-foreground",
					title: r.symptoms,
					children: [r.emergency && /* @__PURE__ */ jsx(Badge, {
						className: "mb-1 border-amber-500/30 bg-rose-500/15 text-rose-600",
						children: t("dash.emergency.yes")
					}), r.symptoms]
				})
			}),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: r.status }) }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "text-end",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-1.5",
					children: [
						r.status === "pending" && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => onConfirm(r.id),
							children: t("dash.confirmRow")
						}),
						r.status !== "cancelled" && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => onCancel(r.id),
							children: t("dash.cancelRow")
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-destructive",
							"aria-label": t("dash.delete"),
							onClick: () => onDelete(r.id),
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
						})
					]
				})
			})
		] }, r.id))] })] })
	});
}
var EMPTY_DOCTOR = {
	name: "",
	specialization: "",
	experience: "",
	rating: "4.8",
	bio: "",
	tags: "",
	pets: "",
	days: "Mon, Tue, Wed, Thu, Fri, Sat"
};
function DoctorDialog({ doctor, onClose }) {
	const { t } = useI18n();
	const [form, setForm] = useState(() => doctor ? {
		name: doctor.name,
		specialization: doctor.specialization,
		experience: doctor.experience,
		rating: String(doctor.rating),
		bio: doctor.bio,
		tags: doctor.tags.join(", "),
		pets: doctor.pets.join(", "),
		days: doctor.days.join(", ")
	} : EMPTY_DOCTOR);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const save = () => {
		const initials = form.name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "DR";
		saveDoctor({
			id: doctor?.id ?? `dr-${Date.now().toString(36)}`,
			name: form.name.trim() || t("dash.unnamed"),
			specialization: form.specialization.trim(),
			experience: form.experience.trim(),
			rating: Math.min(5, Math.max(1, Number(form.rating) || 4.8)),
			bio: form.bio.trim(),
			initials,
			days: form.days.split(",").map((d) => d.trim()).filter(Boolean),
			tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
			pets: form.pets.split(",").map((x) => x.trim()).filter(Boolean)
		});
		toast.success(t("dash.toast.saved"));
		onClose();
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: doctor ? t("dash.editDoctor") : t("dash.addDoctor") }), /* @__PURE__ */ jsx(DialogDescription, { children: t("dash.doctors.hint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.name"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.name,
								onChange: (e) => set("name", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.specialization"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.specialization,
								onChange: (e) => set("specialization", e.target.value)
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: t("dash.form.experience"),
								children: /* @__PURE__ */ jsx(Input, {
									value: form.experience,
									onChange: (e) => set("experience", e.target.value)
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: t("dash.form.rating"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 1,
									max: 5,
									step: .1,
									value: form.rating,
									onChange: (e) => set("rating", e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.bio"),
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 2,
								value: form.bio,
								onChange: (e) => set("bio", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.pets"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.pets,
								onChange: (e) => set("pets", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.tags"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.tags,
								onChange: (e) => set("tags", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.days"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.days,
								onChange: (e) => set("days", e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: t("dash.close")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: !form.name.trim(),
					children: t("dash.save")
				})] })
			]
		})
	});
}
function ServiceDialog({ service, onClose }) {
	const { t } = useI18n();
	const [form, setForm] = useState({
		title: service?.title ?? "",
		description: service?.description ?? ""
	});
	const save = () => {
		saveService({
			slug: service?.slug ?? `svc-${Date.now().toString(36)}`,
			icon: service?.icon ?? "Stethoscope",
			title: form.title.trim() || t("dash.untitled"),
			description: form.description.trim()
		});
		toast.success(t("dash.toast.saved"));
		onClose();
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: service ? t("dash.editService") : t("dash.addService") }), /* @__PURE__ */ jsx(DialogDescription, { children: t("dash.services.hint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [/* @__PURE__ */ jsx(Field, {
						label: t("dash.form.service.title"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.title,
							onChange: (e) => setForm((f) => ({
								...f,
								title: e.target.value
							}))
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: t("dash.form.service.desc"),
						children: /* @__PURE__ */ jsx(Textarea, {
							rows: 3,
							value: form.description,
							onChange: (e) => setForm((f) => ({
								...f,
								description: e.target.value
							}))
						})
					})]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: t("dash.close")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: !form.title.trim(),
					children: t("dash.save")
				})] })
			]
		})
	});
}
function DoctorsPanel() {
	const { t, tOr } = useI18n();
	const { doctors } = useClinicStore();
	const [editing, setEditing] = useState(null);
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.doctors")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.doctors.hint") })] }), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setEditing("new"),
				children: [
					/* @__PURE__ */ jsx(Plus, { className: "size-4" }),
					" ",
					t("dash.addDoctor")
				]
			})]
		}),
		/* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
			className: "overflow-x-auto",
			children: [/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.name") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.specialization") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.experience") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.rating") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.days") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("dash.actions")
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: doctors.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap font-medium",
					children: tOr(`doc.${d.id}.name`, d.name)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap text-sm",
					children: tOr(`doc.${d.id}.spec`, d.specialization)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap text-sm",
					children: tOr(`doc.${d.id}.exp`, d.experience)
				}),
				/* @__PURE__ */ jsxs(TableCell, {
					className: "whitespace-nowrap text-sm",
					children: ["★ ", d.rating.toFixed(1)]
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap text-sm",
					children: d.days.map((day) => tOr(`day.${day}`, day)).join(", ")
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-end",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-1.5",
						children: [/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => setEditing(d),
							children: t("dash.edit")
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-destructive",
							"aria-label": t("dash.delete"),
							onClick: () => {
								deleteDoctor(d.id);
								toast.success(t("dash.toast.deleted"));
							},
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
						})]
					})
				})
			] }, d.id)) })] }), doctors.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: t("dash.empty")
			})]
		}) }),
		editing && /* @__PURE__ */ jsx(DoctorDialog, {
			doctor: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		})
	] });
}
function ServicesPanel() {
	const { t, tOr } = useI18n();
	const { services } = useClinicStore();
	const [editing, setEditing] = useState(null);
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.services")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.services.hint") })] }), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setEditing("new"),
				children: [
					/* @__PURE__ */ jsx(Plus, { className: "size-4" }),
					" ",
					t("dash.addService")
				]
			})]
		}),
		/* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
			className: "overflow-x-auto",
			children: [/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.service.title") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.service.desc") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("dash.actions")
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: services.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap font-medium",
					children: tOr(`svc.${s.slug}.title`, s.title)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-sm text-muted-foreground",
					children: tOr(`svc.${s.slug}.desc`, s.description)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-end",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-1.5",
						children: [/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => setEditing(s),
							children: t("dash.edit")
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-destructive",
							"aria-label": t("dash.delete"),
							onClick: () => {
								deleteService(s.slug);
								toast.success(t("dash.toast.deleted"));
							},
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
						})]
					})
				})
			] }, s.slug)) })] }), services.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: t("dash.empty")
			})]
		}) }),
		editing && /* @__PURE__ */ jsx(ServiceDialog, {
			service: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		})
	] });
}
function SettingsPanel() {
	const { t, lang, setLang } = useI18n();
	const { settings } = useClinicStore();
	const [pinForm, setPinForm] = useState({
		current: "",
		next: "",
		confirm: ""
	});
	const [form, setForm] = useState({
		name: settings.name,
		phone: settings.phone,
		emergency: settings.emergency,
		whatsapp: settings.whatsapp,
		email: settings.email,
		address: settings.address
	});
	const save = () => {
		updateSettings(form);
		toast.success(t("dash.toast.saved"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.settings.general")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.settings.generalDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: t("dash.settings.name"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: t("dash.settings.phone"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								})
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: t("dash.settings.emergency"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.emergency,
								onChange: (e) => setForm({
									...form,
									emergency: e.target.value
								})
							})
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: t("dash.settings.email"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: t("dash.settings.whatsapp"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.whatsapp,
							onChange: (e) => setForm({
								...form,
								whatsapp: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: t("dash.settings.address"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.address,
							onChange: (e) => setForm({
								...form,
								address: e.target.value
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: save,
							children: t("dash.save")
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground",
							children: t("dash.settings.persist")
						})]
					})
				]
			})] }),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.settings.lang")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.settings.langDesc") })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(ToggleGroup, {
				type: "single",
				value: lang,
				onValueChange: (v) => {
					if (v === "en" || v === "ar") setLang(v);
				},
				children: [/* @__PURE__ */ jsx(ToggleGroupItem, {
					value: "en",
					size: "sm",
					children: "English"
				}), /* @__PURE__ */ jsx(ToggleGroupItem, {
					value: "ar",
					size: "sm",
					children: "العربية"
				})]
			}) })] }),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("auth.changePin")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("auth.setupDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: t("auth.currentPin"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							value: pinForm.current,
							onChange: (e) => setPinForm({
								...pinForm,
								current: e.target.value
							}),
							autoComplete: "off",
							inputMode: "numeric",
							maxLength: 32
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: t("auth.newPin"),
							children: /* @__PURE__ */ jsx(Input, {
								type: "password",
								value: pinForm.next,
								onChange: (e) => setPinForm({
									...pinForm,
									next: e.target.value
								}),
								autoComplete: "new-password",
								inputMode: "numeric",
								maxLength: 32
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: t("auth.confirmNewPin"),
							children: /* @__PURE__ */ jsx(Input, {
								type: "password",
								value: pinForm.confirm,
								onChange: (e) => setPinForm({
									...pinForm,
									confirm: e.target.value
								}),
								autoComplete: "new-password",
								inputMode: "numeric",
								maxLength: 32
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsx(Button, {
							onClick: async () => {
								if (pinForm.next !== pinForm.confirm) {
									toast.error(t("auth.mismatch"));
									return;
								}
								if (pinForm.next.length < 4) {
									toast.error(t("auth.pinTooShort"));
									return;
								}
								try {
									await setPin(pinForm.current, pinForm.next);
									toast.success(t("auth.pinChanged"));
									setPinForm({
										current: "",
										next: "",
										confirm: ""
									});
								} catch {
									toast.error(t("auth.wrongCurrent"));
								}
							},
							children: t("auth.changePin")
						})
					})
				]
			})] })
		]
	});
}
var NAV_ITEMS = [
	{
		id: "overview",
		icon: LayoutDashboard
	},
	{
		id: "requests",
		icon: ListChecks
	},
	{
		id: "reservations",
		icon: CalendarCheck
	},
	{
		id: "doctors",
		icon: Users
	},
	{
		id: "services",
		icon: HeartPulse
	},
	{
		id: "settings",
		icon: Settings
	}
];
function AuthGate({ onUnlocked }) {
	const { t } = useI18n();
	const [pin, setPinInput] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState(null);
	const [lockedFor, setLockedFor] = useState(remainingLockMs());
	const setup = !isPinConfigured();
	const [busy, setBusy] = useState(false);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		setError(null);
		setBusy(true);
		try {
			if (setup) {
				if (pin.length < 4) setError(t("auth.pinTooShort"));
				else if (pin !== confirm) setError(t("auth.mismatch"));
				else {
					await setPin("", pin);
					await unlock(pin);
					onUnlocked();
				}
			} else if (await unlock(pin)) onUnlocked();
			else setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidPin"));
		} catch {
			setError(t("auth.invalidPin"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(Lock, { className: "size-5" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-5 text-center text-xl font-bold",
					children: setup ? t("auth.setupTitle") : t("auth.signIn")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-center text-sm text-muted-foreground",
					children: setup ? t("auth.setupDesc") : t("auth.signInDesc")
				}),
				/* @__PURE__ */ jsx(Field, {
					label: t("auth.pin"),
					children: /* @__PURE__ */ jsx(Input, {
						type: "password",
						autoFocus: true,
						autoComplete: "off",
						value: pin,
						onChange: (e) => setPinInput(e.target.value),
						placeholder: t("auth.pinPlaceholder"),
						inputMode: "numeric",
						maxLength: 32
					})
				}),
				setup && /* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsx(Field, {
						label: t("auth.setupConfirm"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							value: confirm,
							onChange: (e) => setConfirm(e.target.value),
							placeholder: t("auth.pinPlaceholder"),
							inputMode: "numeric",
							maxLength: 32
						})
					})
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}),
				lockedFor > 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs text-amber-600",
					children: t("auth.locked", { minutes: String(Math.ceil(lockedFor / 6e4)) })
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
function DashboardPage() {
	const { t, tOr, lang } = useI18n();
	const store = useClinicStore();
	const [authed, setAuthed] = useState(false);
	useEffect(() => {
		if (isAuthed()) setAuthed(true);
	}, []);
	const [tab, setTab] = useState("overview");
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const requests = useMemo(() => {
		const q = query.trim().toLowerCase();
		return store.requests.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			return [
				r.ownerName,
				r.petName,
				r.doctorName,
				r.phone,
				r.symptoms
			].join(" ").toLowerCase().includes(q);
		});
	}, [
		store.requests,
		query,
		statusFilter
	]);
	if (!authed) return /* @__PURE__ */ jsx(AuthGate, { onUnlocked: () => setAuthed(true) });
	const signOut = () => {
		logout();
		setAuthed(false);
	};
	const pendingCount = store.requests.filter((r) => r.status === "pending").length;
	const confirmedCount = store.requests.filter((r) => r.status === "confirmed").length;
	const completedCount = store.requests.filter((r) => r.status === "completed").length;
	const todayISO = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const stats = [
		{
			key: "dash.overview.stats.pending",
			value: pendingCount,
			icon: Radio,
			tone: "text-amber-500"
		},
		{
			key: "dash.overview.stats.confirmed",
			value: confirmedCount,
			icon: CalendarClock,
			tone: "text-success"
		},
		{
			key: "dash.overview.stats.completed",
			value: completedCount,
			icon: HeartPulse,
			tone: "text-primary"
		},
		{
			key: "dash.overview.stats.doctors",
			value: store.doctors.length,
			icon: Stethoscope,
			tone: "text-violet-500"
		}
	];
	const confirmReq = (id) => {
		setBookingStatus(id, "confirmed");
		toast.success(t("dash.toast.confirmed"));
	};
	const cancelReq = (id) => {
		setBookingStatus(id, "cancelled");
		toast.success(t("dash.toast.cancelled"));
	};
	const removeReq = (id) => {
		deleteRequest(id);
		toast.success(t("dash.toast.deleted"));
	};
	const todayAppointments = store.requests.filter((r) => r.date === todayISO && r.status === "confirmed").sort((a, b) => a.time.localeCompare(b.time));
	const upcoming = store.requests.filter((r) => r.status === "confirmed" && r.date >= todayISO).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
	const recent = [...store.requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-muted/40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-7xl gap-6 px-5 py-10 pt-20 sm:px-8 sm:pt-24",
			children: [/* @__PURE__ */ jsxs("aside", {
				className: "sticky top-24 hidden h-fit min-w-[200px] shrink-0 lg:block",
				children: [
					/* @__PURE__ */ jsx("nav", {
						className: "space-y-1",
						children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsxs("button", {
							onClick: () => setTab(item.id),
							className: cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", tab === item.id ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"),
							children: [
								/* @__PURE__ */ jsx(item.icon, { className: "size-4" }),
								t(`dash.${item.id}`),
								item.id === "requests" && pendingCount > 0 && /* @__PURE__ */ jsx("span", {
									className: "ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600",
									children: pendingCount
								})
							]
						}, item.id))
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-6 w-full",
						children: /* @__PURE__ */ jsx("a", {
							href: "/",
							children: t("dash.back")
						})
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						className: "mt-2 w-full",
						onClick: signOut,
						children: [
							/* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
							" ",
							t("auth.signOut")
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold",
							children: t("dash.title")
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: t("dash.subtitle")
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 lg:hidden",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "sr-only",
									children: t("dash.srSection")
								}),
								/* @__PURE__ */ jsx("select", {
									value: tab,
									onChange: (e) => setTab(e.target.value),
									className: "h-9 rounded-lg border border-input bg-background px-3 text-sm",
									"aria-label": t("dash.title"),
									children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsx("option", {
										value: item.id,
										children: t(`dash.${item.id}`)
									}, item.id))
								}),
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsx("a", {
										href: "/",
										children: t("dash.back")
									})
								}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "ghost",
									size: "sm",
									onClick: signOut,
									children: [
										/* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
										" ",
										t("auth.signOut")
									]
								})
							]
						})]
					}), /* @__PURE__ */ jsx(Separator, { className: "mt-4" })]
				}), /* @__PURE__ */ jsx(AnimatePresence, {
					mode: "wait",
					initial: false,
					children: /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -10
						},
						transition: {
							duration: .28,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						children: [
							tab === "overview" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
										children: stats.map((s) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
											className: "flex items-center justify-between p-5",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs font-medium text-muted-foreground",
												children: t(s.key)
											}), /* @__PURE__ */ jsx("p", {
												className: "mt-1 text-3xl font-bold",
												children: s.value
											})] }), /* @__PURE__ */ jsx(s.icon, { className: cn("size-6", s.tone) })]
										}) }, s.key))
									}),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: t("dash.overview.today")
									}) }), /* @__PURE__ */ jsx(CardContent, { children: todayAppointments.length === 0 ? /* @__PURE__ */ jsx("p", {
										className: "py-4 text-sm text-muted-foreground",
										children: t("dash.overview.noData")
									}) : /* @__PURE__ */ jsx("div", {
										className: "space-y-2",
										children: todayAppointments.map((r) => /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx("span", {
													className: "grid size-9 place-items-center rounded-lg bg-success/15 font-mono text-xs font-bold text-success",
													children: r.time
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
													className: "text-sm font-semibold",
													children: [
														r.petName,
														" ",
														/* @__PURE__ */ jsxs("span", {
															className: "text-muted-foreground",
															children: ["— ", r.ownerName]
														})
													]
												}), /* @__PURE__ */ jsxs("p", {
													className: "text-xs text-muted-foreground",
													children: [
														r.doctorName,
														" · ",
														tOr(`animal.${r.animalType}`, r.animalType)
													]
												})] })]
											}), /* @__PURE__ */ jsx(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setBookingStatus(r.id, "completed");
													toast.success(t("dash.toast.completed"));
												},
												children: t("dash.complete")
											})]
										}, r.id))
									}) })] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
										className: "flex flex-row items-center justify-between",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
											className: "text-base",
											children: t("dash.overview.recent")
										}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.overview.recentDesc") })] }), /* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => setTab("requests"),
											children: t("dash.overview.viewAll")
										})]
									}), /* @__PURE__ */ jsx(CardContent, { children: recent.length === 0 ? /* @__PURE__ */ jsx("p", {
										className: "py-4 text-sm text-muted-foreground",
										children: t("dash.empty")
									}) : /* @__PURE__ */ jsx("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ jsx(Table, { children: /* @__PURE__ */ jsx(TableBody, { children: recent.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
											/* @__PURE__ */ jsx(TableCell, {
												className: "whitespace-nowrap font-medium",
												children: r.ownerName
											}),
											/* @__PURE__ */ jsx(TableCell, {
												className: "whitespace-nowrap",
												children: r.petName
											}),
											/* @__PURE__ */ jsx(TableCell, {
												className: "whitespace-nowrap",
												children: formatDate(r.date, lang)
											}),
											/* @__PURE__ */ jsx(TableCell, {
												className: "whitespace-nowrap",
												children: r.time
											}),
											/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: r.status }) }),
											/* @__PURE__ */ jsx(TableCell, {
												className: "text-end",
												children: /* @__PURE__ */ jsx(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-7",
													onClick: () => setTab("requests"),
													children: t("dash.openRow")
												})
											})
										] }, r.id)) }) })
									}) })] })
								]
							}),
							tab === "requests" && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsx(CardTitle, {
									className: "text-base",
									children: t("dash.requests")
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-full sm:max-w-xs",
										children: /* @__PURE__ */ jsx(Input, {
											placeholder: t("dash.search"),
											value: query,
											onChange: (e) => setQuery(e.target.value),
											"aria-label": t("dash.search")
										})
									}), /* @__PURE__ */ jsx(ToggleGroup, {
										type: "single",
										value: statusFilter,
										onValueChange: (v) => setStatusFilter(v ?? "all"),
										children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsx(ToggleGroupItem, {
											value: o.value,
											className: "text-xs",
											children: t(o.key)
										}, o.value))
									})]
								})]
							}), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: t("dash.showing", {
										count: String(requests.length),
										rows: t("dash.rows")
									})
								}), /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setTab("reservations"),
									children: [
										/* @__PURE__ */ jsx(CalendarCheck, { className: "size-4" }),
										" ",
										t("dash.viewReservations")
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "pt-3",
								children: /* @__PURE__ */ jsx(RequestsTable, {
									requests,
									onConfirm: confirmReq,
									onCancel: cancelReq,
									onDelete: removeReq
								})
							})] })] }),
							tab === "reservations" && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
								className: "text-base",
								children: t("dash.reservations")
							}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.reservationsDesc") })] }), /* @__PURE__ */ jsx(CardContent, { children: upcoming.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "py-6 text-sm text-muted-foreground",
								children: t("dash.empty")
							}) : /* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: upcoming.map((r) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border p-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("p", {
												className: "text-sm font-semibold",
												children: [
													formatDate(r.date, lang),
													" · ",
													r.time
												]
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "mt-1 text-sm text-muted-foreground",
												children: [
													r.petName,
													" (",
													tOr(`animal.${r.animalType}`, r.animalType),
													") —",
													" ",
													r.ownerName
												]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted-foreground",
												children: r.doctorName
											}),
											r.emergency && /* @__PURE__ */ jsx(Badge, {
												className: "mt-2 border-amber-500/30 bg-rose-500/15 text-rose-600",
												children: t("dash.emergency.yes")
											})
										] }), /* @__PURE__ */ jsx(StatusBadge, { status: r.status })]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex gap-2",
										children: [/* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => {
												setBookingStatus(r.id, "completed");
												toast.success(t("dash.toast.completed"));
											},
											children: t("dash.complete")
										}), /* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => cancelReq(r.id),
											className: "text-muted-foreground hover:text-destructive",
											children: t("dash.cancelRow")
										})]
									})]
								}, r.id))
							}) })] }),
							tab === "doctors" && /* @__PURE__ */ jsx(DoctorsPanel, {}),
							tab === "services" && /* @__PURE__ */ jsx(ServicesPanel, {}),
							tab === "settings" && /* @__PURE__ */ jsx(SettingsPanel, {})
						]
					}, tab)
				})]
			})]
		})
	});
}
//#endregion
export { DashboardPage as component };
