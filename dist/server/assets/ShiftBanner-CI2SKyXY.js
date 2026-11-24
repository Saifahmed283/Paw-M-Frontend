import { G as refreshClinicData, T as checkOut, at as useClinicStore, v as Button, w as checkIn } from "./router-B5xOVOWb.js";
import { D as cn, E as useI18n, i as localizedApiErrorMessage } from "./api-DvWJKWa0.js";
import { r as clinicTodayISO } from "./separator-8f5w9DgB.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { LogIn, Timer } from "lucide-react";
import { toast } from "sonner";
// src/components/dashboard/ShiftBanner.tsx
function formatDayName(dateISO, lang) {
	return (/* @__PURE__ */ new Date(`${dateISO}T00:00:00`)).toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function ShiftBanner() {
	const { t, lang } = useI18n();
	const { workSession } = useClinicStore();
	const [busy, setBusy] = useState(false);
	const startedAt = workSession ? new Date(workSession.startedAt) : null;
	const sessionStarted = startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : null;
	const doCheckIn = async () => {
		if (busy) return;
		setBusy(true);
		try {
			const result = await checkIn();
			await refreshClinicData();
			const archived = result.archived ?? {
				bookings: 0,
				orders: 0
			};
			const shiftMessage = archived.bookings > 0 || archived.orders > 0 ? t("dash.shiftArchivedOnStart", {
				requests: String(archived.bookings),
				orders: String(archived.orders)
			}) : t("dash.shiftStarted");
			const folderMessage = t("dash.dayFolderOpen", { name: formatDayName(clinicTodayISO(), lang) });
			toast.success(`${shiftMessage} · ${folderMessage}`);
		} catch (err) {
			toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
		} finally {
			setBusy(false);
		}
	};
	const doCheckOut = async () => {
		if (busy) return;
		setBusy(true);
		try {
			const result = await checkOut();
			await refreshClinicData();
			const archived = result.archived ?? {
				bookings: 0,
				orders: 0
			};
			const shiftMessage = t("dash.shiftEnded", {
				requests: String(archived.bookings),
				orders: String(archived.orders)
			});
			const folderMessage = t("dash.dayFolderSaved", { name: formatDayName(clinicTodayISO(), lang) });
			toast.success(`${shiftMessage} · ${folderMessage}`);
		} catch (err) {
			toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		"data-testid": "shift-banner",
		className: cn("mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4", sessionStarted ? "border-success/30 bg-success/10" : "border-amber-500/30 bg-amber-500/10"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("span", {
				"data-testid": "shift-status",
				className: cn("grid size-10 place-items-center rounded-xl", sessionStarted ? "bg-success/20 text-success" : "bg-amber-500/15 text-amber-600"),
				children: sessionStarted ? /* @__PURE__ */ jsx(Timer, { className: "size-5" }) : /* @__PURE__ */ jsx(LogIn, { className: "size-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm font-bold",
				children: sessionStarted ? t("dash.checkedIn") : t("dash.notCheckedIn")
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: sessionStarted ? `${t("dash.checkedInSince")} ${sessionStarted.toLocaleString(lang === "ar" ? "ar" : "en-US", {
					hour: "2-digit",
					minute: "2-digit"
				})}` : t("dash.shiftHint")
			})] })]
		}), /* @__PURE__ */ jsx(Button, {
			"data-testid": sessionStarted ? "check-out-btn" : "check-in-btn",
			variant: sessionStarted ? "outline" : "default",
			className: cn(!sessionStarted && "shadow-glow"),
			onClick: sessionStarted ? doCheckOut : doCheckIn,
			disabled: busy,
			children: sessionStarted ? t("dash.checkOut") : t("dash.checkIn")
		})]
	});
}
export { ShiftBanner as t };
