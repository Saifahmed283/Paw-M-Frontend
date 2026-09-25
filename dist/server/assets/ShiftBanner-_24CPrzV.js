import { D as useI18n, O as cn, b as Button } from "./api-EL8QtWhp.js";
import { D as checkOut, E as checkIn, X as refreshClinicData, dt as useClinicStore } from "./router-mnwS-WLu.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { LogIn, Timer } from "lucide-react";
import { toast } from "sonner";
//#region src/components/dashboard/ShiftBanner.tsx
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
	const sessionStarted = workSession ? new Date(workSession.startedAt) : null;
	const doCheckIn = async () => {
		if (busy) return;
		setBusy(true);
		try {
			const result = await checkIn();
			await refreshClinicData();
			toast.success(result.archived.bookings > 0 || result.archived.orders > 0 ? t("dash.shiftArchivedOnStart", {
				requests: String(result.archived.bookings),
				orders: String(result.archived.orders)
			}) : t("dash.shiftStarted"));
			toast.success(t("dash.dayFolderOpen", { name: formatDayName((/* @__PURE__ */ new Date()).toISOString().slice(0, 10), lang) }));
		} catch {
			toast.error(t("dash.toast.error"));
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
			toast.success(t("dash.shiftEnded", {
				requests: String(result.archived.bookings),
				orders: String(result.archived.orders)
			}));
			toast.success(t("dash.dayFolderSaved", { name: formatDayName((/* @__PURE__ */ new Date()).toISOString().slice(0, 10), lang) }));
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4", sessionStarted ? "border-success/30 bg-success/10" : "border-amber-500/30 bg-amber-500/10"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("span", {
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
			variant: sessionStarted ? "outline" : "default",
			className: cn(!sessionStarted && "shadow-glow"),
			onClick: sessionStarted ? doCheckOut : doCheckIn,
			disabled: busy,
			children: sessionStarted ? t("dash.checkOut") : t("dash.checkIn")
		})]
	});
}
//#endregion
export { ShiftBanner as t };
