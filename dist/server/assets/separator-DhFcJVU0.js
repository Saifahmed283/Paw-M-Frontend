import { D as cn } from "./api-dSNieQTv.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
// src/components/dashboard/dashboard-format.ts
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
/** Format a date as YYYY-MM-DD in the user's local timezone (never UTC). */
function localISODate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/** Current calendar date in the user's local timezone (YYYY-MM-DD). */
function localTodayISO() {
	return localISODate(/* @__PURE__ */ new Date());
}
function formatDate(dateISO, lang) {
	if (!dateISO) return "—";
	const iso = /^\d{4}-\d{2}-\d{2}$/.test(dateISO) ? `${dateISO}T00:00:00` : dateISO;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return dateISO;
	return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatTime(iso, lang) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatMoney(amount, currency) {
	const safe = Number.isFinite(amount) ? Number(amount) : 0;
	return currency === "$" ? `$${safe.toFixed(2)}` : `${currency} ${safe.toFixed(2)}`;
}
// src/components/ui/separator.tsx
var Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
export { formatTime as a, formatMoney as i, STATUS_OPTIONS as n, localISODate as o, formatDate as r, localTodayISO as s, Separator as t };
