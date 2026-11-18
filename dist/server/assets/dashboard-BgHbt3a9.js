import { D as cn, E as useI18n, b as buttonVariants, d as currentUsername, f as isAuthed, h as remainingLockMs, l as changeCredentials, m as logout, n as api, p as login, t as ApiError, u as currentRole, y as Button } from "./api-Ba8azKWu.js";
import { t as Input } from "./input-jh6IDyJh.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bp-EDZb1.js";
import { t as Textarea } from "./textarea-D0IiXuL4.js";
import { t as Label } from "./label-yA-X7xfQ.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CD64Nwft.js";
import { t as Badge } from "./badge-DV9koV17.js";
import { $ as setReviewStatus, A as createPaymentRequest, B as deleteService, F as deleteOrder, G as notifyClient, H as loadAuditLogs, I as deletePayment, J as saveService, K as refreshClinicData, L as deleteProduct, N as deleteClient, P as deleteDoctor, Q as setOrderStatus, R as deleteRequest, T as archiveOrder, U as loadWorkDay, V as getClient, W as loadWorkDays, X as setClientSuspended, Y as setBookingStatus, Z as setOrderPaymentStatus, at as updateProduct, b as formatDate, d as LanguageToggle, it as updatePayment, j as createProduct, k as createPayment, nt as syncGoogleReviews, ot as updateSettings, q as saveDoctor, st as useClinicStore, u as useTheme, w as archiveBooking, xt as PawMMark, z as deleteReview } from "./router-D3jxOZse.js";
import { a as formatTime, c as PaymentMethodBadge, d as Tabs, f as TabsContent, i as formatMoney, l as PaymentStatusBadge, m as TabsTrigger, n as STATUS_OPTIONS, o as Field, p as TabsList, r as formatDate$1, s as PaymentKindBadge, t as PaymentSettleDialog, u as StatusBadge } from "./PaymentSettleDialog-D8-UGxLC.js";
import { t as ShiftBanner } from "./ShiftBanner-B0tz9iCu.js";
import { c as listPrescriptions, d as updatePrescription, n as createPrescription, o as getPets, u as saveBookingClinical } from "./client-medical-1tO014dB.js";
import { n as PrintCss, t as PrescriptionDocument } from "./PrescriptionDocument-BCbjpFq-.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DaVM5Qo9.js";
import { t as Separator } from "./separator-CtLLJm78.js";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArchiveRestore, ArrowDown, ArrowLeft, ArrowUp, Ban, Banknote, Bell, BellRing, Calendar, CalendarCheck, CalendarClock, CalendarDays, Check, CheckCheck, CheckCircle2, ChevronLeft, ChevronRight, Circle, CircleDollarSign, ClipboardList, Delete, DiamondPlus, DollarSign, Edit, Eye, FileText, FolderOpen, HeartPulse, History, LayoutDashboard, ListChecks, Loader2, Lock, LogOut, Mail, Menu, MessageSquareText, Minus, Moon, MoreHorizontal, Package, PanelLeftClose, PanelLeftOpen, PawPrint, Pencil, Phone, Plus, Printer, Radio, ReceiptText, RefreshCw, ScanLine, ScrollText, Search, Settings, Shield, ShieldAlert, ShieldCheck, ShoppingBag, Star, Stethoscope, Sun, Trash2, UserCheck, UserPlus, UserX, Users, Wallet, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { toast } from "sonner";
import QRCode from "qrcode";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
// src/components/ui/table.tsx
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
// src/components/ui/toggle-variants.ts
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
// src/components/ui/toggle-group.tsx
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
// src/components/dash-grid-hooks.ts
function useSortState(defaultKey, defaultDir = "asc") {
	const [sort, setSort] = useState({
		key: defaultKey,
		dir: defaultDir
	});
	const toggle = (key, descFirst = false) => setSort((s) => s.key !== key ? {
		key,
		dir: descFirst ? "desc" : "asc"
	} : {
		key,
		dir: s.dir === "asc" ? "desc" : "asc"
	});
	return {
		sort,
		toggle
	};
}
function sortedSlice(items, sort, comparators) {
	const cmp = comparators[sort.key];
	const sorted = cmp ? [...items].sort(cmp) : items;
	return sort.dir === "desc" ? sorted.reverse() : sorted;
}
/**
* Client-side grid state: filters by text across the given fields and pages
* the result. Reset the page whenever the dataset or filters change.
*/
function useGrid(items, searchText, searchFields = [], initialPageSize = 10) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const q = searchText.trim().toLowerCase();
	const filtered = useMemo(() => {
		if (!q || searchFields.length === 0) return items;
		return items.filter((item) => searchFields.some((f) => String(item[f] ?? "").toLowerCase().includes(q)));
	}, [
		items,
		q,
		searchFields
	]);
	const total = filtered.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	useEffect(() => {
		if (page > pageCount) setPage(pageCount);
	}, [page, pageCount]);
	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		pageCount,
		total,
		slice: useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [
			filtered,
			page,
			pageSize
		])
	};
}
// src/components/dash-grid.tsx
function SearchBox({ value, onChange, placeholder }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative w-full sm:max-w-xs",
		children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "ps-9",
			"aria-label": placeholder
		})]
	});
}
function SortChip({ label, active, dir, onToggle }) {
	return /* @__PURE__ */ jsxs("button", {
		onClick: onToggle,
		className: cn("flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
		"aria-pressed": active,
		children: [label, active && (dir === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3" }))]
	});
}
function PaginationBar({ total, page, pageSize, pageCount, onPage, onPageSize }) {
	const { t } = useI18n();
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);
	const pages = useMemo(() => {
		const set = /* @__PURE__ */ new Set([
			1,
			pageCount,
			page - 1,
			page,
			page + 1
		]);
		return Array.from(set).filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
	}, [page, pageCount]);
	const pageBtn = "grid size-8 place-items-center rounded-lg border text-xs font-medium transition-colors disabled:opacity-40";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center justify-between gap-3 pt-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: t("dash.pager.showing", {
				from: String(from),
				to: String(to),
				total: String(total)
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: () => onPage(page - 1),
					disabled: page <= 1,
					className: cn(pageBtn, "border-border bg-card text-muted-foreground hover:text-foreground"),
					"aria-label": t("dash.pager.prev"),
					children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4 rtl:rotate-180" })
				}),
				pages.map((p) => /* @__PURE__ */ jsx("button", {
					onClick: () => onPage(p),
					className: cn(pageBtn, p === page ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
					children: p
				}, p)),
				/* @__PURE__ */ jsx("button", {
					onClick: () => onPage(page + 1),
					disabled: page >= pageCount,
					className: cn(pageBtn, "border-border bg-card text-muted-foreground hover:text-foreground"),
					"aria-label": t("dash.pager.next"),
					children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 rtl:rotate-180" })
				}),
				/* @__PURE__ */ jsx("select", {
					value: pageSize,
					onChange: (e) => {
						onPageSize(Number(e.target.value));
						onPage(1);
					},
					className: "ms-1 h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground",
					"aria-label": t("dash.pager.perPage"),
					children: [
						10,
						25,
						50
					].map((n) => /* @__PURE__ */ jsxs("option", {
						value: n,
						children: [
							n,
							" ",
							t("dash.pager.perPage")
						]
					}, n))
				})
			]
		})]
	});
}
// src/components/dashboard/StaffOverviewPanel.tsx
var EMPTY_KPI = {
	sessions: 0,
	hours: 0,
	bookings: 0,
	orders: 0,
	revenue: 0,
	commission: 0,
	basePay: 0,
	grossPay: 0
};
function periodRange(period) {
	const end = /* @__PURE__ */ new Date();
	const endStr = end.toISOString().split("T")[0] ?? "";
	const start = new Date(end);
	if (period === "today") {} else if (period === "week") start.setDate(start.getDate() - 7);
	else start.setMonth(start.getMonth() - 1);
	return {
		start: start.toISOString().split("T")[0] ?? endStr,
		end: endStr
	};
}
var PERIODS = [
	{
		value: "today",
		label: "dash.today"
	},
	{
		value: "week",
		label: "dash.thisWeek"
	},
	{
		value: "month",
		label: "dash.thisMonth"
	}
];
var ROLES = [
	{
		value: "all",
		label: "dash.allRoles"
	},
	{
		value: "admin",
		label: "auth.role.admin"
	},
	{
		value: "payroll",
		label: "auth.role.payroll"
	},
	{
		value: "staff",
		label: "auth.role.staff"
	}
];
function StaffOverviewPanel() {
	const { t } = useI18n();
	const [staff, setStaff] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [role, setRole] = useState("all");
	const [period, setPeriod] = useState("week");
	const [query, setQuery] = useState("");
	const { sort, toggle } = useSortState("name", "asc");
	const fetchStaffOverview = useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const range = periodRange(period);
			const [employeesRes, kpisRes] = await Promise.all([api.get("/api/employees"), api.get(`/api/work-sessions/admin/kpis?periodStart=${range.start}&periodEnd=${range.end}`)]);
			const employees = Array.isArray(employeesRes) ? employeesRes : employeesRes?.data ?? [];
			const kpis = Array.isArray(kpisRes) ? kpisRes : kpisRes?.data ?? [];
			const kpiByEmployee = new Map(kpis.map((k) => [String(k.employeeId), k]));
			const enriched = employees.map((emp) => ({
				...emp,
				...kpiByEmployee.get(String(emp.id)) ?? EMPTY_KPI
			}));
			setStaff(enriched);
		} catch (err) {
			console.error("Error fetching staff overview:", err);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [period]);
	useEffect(() => {
		fetchStaffOverview();
	}, [fetchStaffOverview]);
	const grid = useGrid(sortedSlice(useMemo(() => role === "all" ? staff : staff.filter((emp) => emp.role === role), [staff, role]), sort, {
		name: (a, b) => (a.fullName ?? "").toLowerCase().localeCompare((b.fullName ?? "").toLowerCase()),
		hours: (a, b) => (a.hours ?? 0) - (b.hours ?? 0),
		revenue: (a, b) => (a.revenue ?? 0) - (b.revenue ?? 0),
		pay: (a, b) => (a.grossPay ?? 0) - (b.grossPay ?? 0)
	}), query, ["fullName", "email"]);
	const rateLabel = (emp) => emp.payRateType === "monthly" ? `${t("dash.egp")}${(emp.monthlySalary ?? 0).toLocaleString()}/${t("dash.month")}` : `${t("dash.egp")}${(emp.hourlyRate ?? 0).toLocaleString()}/${t("dash.hour")}`;
	const roleLabel = (r) => r === "admin" ? t("auth.role.admin") : r === "payroll" ? t("auth.role.payroll") : t("auth.role.staff");
	const fmt = (n) => (n ?? 0).toLocaleString();
	const fmtHours = (n) => (n ?? 0).toLocaleString(void 0, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
	const filterBtn = (active) => cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground");
	if (loading) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
		className: "flex flex-col items-center justify-center gap-4 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex space-x-2",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
			]
		})
	}) });
	if (error) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
		className: "flex flex-col items-center gap-4 py-16",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: t("dash.errorLoad")
		}), /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			onClick: fetchStaffOverview,
			children: t("dash.retry")
		})]
	}) });
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
		className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(CardTitle, {
			className: "flex items-center gap-2 text-base",
			children: [/* @__PURE__ */ jsx(Users, { className: "size-4 text-muted-foreground" }), t("dash.staffOverview")]
		}), /* @__PURE__ */ jsx(CardDescription, { children: period === "today" ? t("dash.today") : period === "week" ? t("dash.thisWeek") : t("dash.thisMonth") })] }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2",
				children: PERIODS.map((p) => /* @__PURE__ */ jsx("button", {
					className: filterBtn(period === p.value),
					onClick: () => {
						setPeriod(p.value);
						grid.setPage(1);
					},
					children: t(p.label)
				}, p.value))
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2",
				children: ROLES.map((r) => /* @__PURE__ */ jsx("button", {
					className: filterBtn(role === r.value),
					onClick: () => {
						setRole(r.value);
						grid.setPage(1);
					},
					children: t(r.label)
				}, r.value))
			})]
		})]
	}), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex flex-wrap items-center gap-3",
		children: [/* @__PURE__ */ jsx(SearchBox, {
			value: query,
			onChange: setQuery,
			placeholder: t("dash.search")
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-1.5",
			children: [
				/* @__PURE__ */ jsx(SortChip, {
					label: t("dash.name"),
					active: sort.key === "name",
					dir: sort.dir,
					onToggle: () => toggle("name")
				}),
				/* @__PURE__ */ jsx(SortChip, {
					label: t("dash.hours"),
					active: sort.key === "hours",
					dir: sort.dir,
					onToggle: () => toggle("hours", true)
				}),
				/* @__PURE__ */ jsx(SortChip, {
					label: t("dash.revenue"),
					active: sort.key === "revenue",
					dir: sort.dir,
					onToggle: () => toggle("revenue", true)
				}),
				/* @__PURE__ */ jsx(SortChip, {
					label: t("dash.pay"),
					active: sort.key === "pay",
					dir: sort.dir,
					onToggle: () => toggle("pay", true)
				})
			]
		})]
	}), grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "py-6 text-center text-sm text-muted-foreground",
		children: t("dash.noStaff")
	}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		className: "space-y-3",
		children: grid.slice.map((emp) => /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-border p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid size-10 place-items-center rounded-lg bg-primary/20 text-sm font-semibold",
						children: emp.fullName?.charAt(0)?.toUpperCase()
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold",
							children: emp.fullName
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: emp.email
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
							children: roleLabel(emp.role)
						})
					] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-end",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: rateLabel(emp)
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-lg font-bold",
							children: [t("dash.egp"), fmt(emp.grossPay)]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: t("dash.pay")
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5",
				children: [
					/* @__PURE__ */ jsx(Stat$1, {
						label: t("dash.sessions"),
						value: fmt(emp.sessions)
					}),
					/* @__PURE__ */ jsx(Stat$1, {
						label: t("dash.hours"),
						value: `${fmtHours(emp.hours)}h`
					}),
					/* @__PURE__ */ jsx(Stat$1, {
						label: t("dash.bookings"),
						value: fmt(emp.bookings)
					}),
					/* @__PURE__ */ jsx(Stat$1, {
						label: t("dash.orders"),
						value: fmt(emp.orders)
					}),
					/* @__PURE__ */ jsx(Stat$1, {
						label: t("dash.revenue"),
						value: `${t("dash.egp")}${fmt(emp.revenue)}`
					})
				]
			})]
		}, emp.id))
	}), /* @__PURE__ */ jsx(PaginationBar, {
		total: grid.total,
		page: grid.page,
		pageSize: grid.pageSize,
		pageCount: grid.pageCount,
		onPage: grid.setPage,
		onPageSize: grid.setPageSize
	})] })] })] });
}
function Stat$1({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg bg-muted/50 p-2.5",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-0.5 text-sm font-semibold",
			children: value
		})]
	});
}
// src/components/dashboard/PayrollPanel.tsx
function currentRange() {
	const now = /* @__PURE__ */ new Date();
	const end = now.toISOString().slice(0, 10) ?? "";
	return {
		start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10) ?? end,
		end
	};
}
var STATUS_STYLES = {
	calculated: "bg-muted text-muted-foreground",
	pending_approval: "bg-amber-500/15 text-amber-600",
	approved: "bg-success/15 text-success",
	paid: "bg-primary/15 text-primary",
	rejected: "bg-destructive/15 text-destructive line-through"
};
var REQUEST_STATUS_STYLES = {
	pending: "bg-amber-500/15 text-amber-600",
	approved: "bg-success/15 text-success",
	rejected: "bg-destructive/15 text-destructive"
};
function AdjustAmountDialog({ record, onClose, onSaved }) {
	const { t } = useI18n();
	const [basePay, setBasePay] = useState(String(record.basePay ?? ""));
	const [saving, setSaving] = useState(false);
	const save = async () => {
		const value = Number(basePay);
		if (!Number.isFinite(value) || value < 0) {
			toast.error(t("dash.errorLoad"));
			return;
		}
		setSaving(true);
		try {
			await api.patch(`/api/payroll/records/${record.id}/amount`, { basePay: value });
			toast.success(t("dash.toast.adjusted"));
			onSaved();
			onClose();
		} catch (err) {
			console.error("Error adjusting payroll amount:", err);
			toast.error(t("dash.errorLoad"));
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: t("dash.adjustAmountTitle") }), /* @__PURE__ */ jsx(DialogDescription, { children: t("dash.adjustAmountHint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [/* @__PURE__ */ jsx(Field, {
						label: t("dash.basePay"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							value: basePay,
							onChange: (e) => setBasePay(e.target.value)
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsx(Stat, {
							label: t("dash.commission"),
							value: `${t("dash.egp")}${(record.commissionPay ?? 0).toLocaleString()}`
						}), /* @__PURE__ */ jsx(Stat, {
							label: t("dash.netPay"),
							value: `${t("dash.egp")}${(record.netPay ?? 0).toLocaleString()}`
						})]
					})]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: onClose,
					disabled: saving,
					children: t("payments.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: saving,
					children: saving ? t("payments.saving") : t("dash.submitAmount")
				})] })
			]
		})
	});
}
function BonusDeductionDialog({ record, isAdmin, onClose, onChanged }) {
	const { t } = useI18n();
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [kind, setKind] = useState("bonus");
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [saving, setSaving] = useState(false);
	const fetchRequests = useCallback(async () => {
		setLoading(true);
		try {
			const res = await api.get(`/api/payroll/${record.id}/requests`);
			setRequests(Array.isArray(res) ? res : res?.data ?? []);
		} catch (err) {
			console.error("Error fetching bonus/deduction requests:", err);
			setRequests([]);
		} finally {
			setLoading(false);
		}
	}, [record.id]);
	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);
	const submit = async () => {
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0 || !reason.trim()) {
			toast.error(t("dash.errorLoad"));
			return;
		}
		setSaving(true);
		try {
			const path = kind === "bonus" ? "bonus-request" : "deduction-request";
			await api.post(`/api/payroll/${record.id}/${path}`, {
				amount: value,
				reason: reason.trim()
			});
			toast.success(t("dash.toast.requestSent"));
			setAmount("");
			setReason("");
			await fetchRequests();
			onChanged();
		} catch (err) {
			console.error("Error creating request:", err);
			toast.error(t("dash.errorLoad"));
		} finally {
			setSaving(false);
		}
	};
	const review = async (requestId, status) => {
		setSaving(true);
		try {
			await api.patch(`/api/payroll/requests/${requestId}`, { status });
			toast.success(t("dash.toast.requestReviewed"));
			await fetchRequests();
			onChanged();
		} catch (err) {
			console.error("Error reviewing request:", err);
			toast.error(t("dash.errorLoad"));
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: t("dash.bonusDeductions") }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
					record.employee?.fullName,
					" · ",
					formatDate(record.periodStart),
					" –",
					" ",
					formatDate(record.periodEnd)
				] })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border p-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: kind === "bonus" ? "default" : "outline",
									className: "h-7",
									onClick: () => setKind("bonus"),
									children: [/* @__PURE__ */ jsx(DiamondPlus, { className: "mr-1.5 size-3.5" }), t("dash.requestBonus")]
								}), /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: kind === "deduction" ? "default" : "outline",
									className: "h-7",
									onClick: () => setKind("deduction"),
									children: [/* @__PURE__ */ jsx(Minus, { className: "mr-1.5 size-3.5" }), t("dash.requestDeduction")]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsx(Field, {
									label: t("dash.requestAmount"),
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										step: "0.01",
										value: amount,
										onChange: (e) => setAmount(e.target.value)
									})
								}), /* @__PURE__ */ jsx(Field, {
									label: t("dash.requestReason"),
									children: /* @__PURE__ */ jsx(Input, {
										value: reason,
										onChange: (e) => setReason(e.target.value),
										placeholder: t("dash.requestReasonPlaceholder")
									})
								})]
							}),
							/* @__PURE__ */ jsxs(Button, {
								className: "mt-3",
								size: "sm",
								onClick: submit,
								disabled: saving,
								children: [/* @__PURE__ */ jsx(ListChecks, { className: "mr-1.5 size-3.5" }), t("dash.toast.requestSent")]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							loading && /* @__PURE__ */ jsx("p", {
								className: "py-4 text-sm text-muted-foreground",
								children: t("dash.errorLoad")
							}),
							!loading && requests.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "py-4 text-sm text-muted-foreground",
								children: t("dash.requestsEmpty")
							}),
							requests.map((r) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-border p-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												className: cn("border-transparent", r.type === "bonus" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"),
												children: r.type === "bonus" ? t("dash.bonuses") : t("dash.deductions")
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "text-sm font-bold",
												children: [t("dash.egp"), r.amount.toLocaleString()]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-muted-foreground",
												children: r.reason
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: cn("border-transparent", REQUEST_STATUS_STYLES[r.status]),
											children: t(`dash.requestStatus.${r.status}`)
										}), isAdmin && r.status === "pending" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 px-2",
											disabled: saving,
											onClick: () => review(r.id, "approved"),
											children: /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-success" })
										}), /* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 px-2",
											disabled: saving,
											onClick: () => review(r.id, "rejected"),
											children: /* @__PURE__ */ jsx(X, { className: "size-3.5 text-destructive" })
										})] })]
									})]
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										t("dash.requestedBy"),
										": ",
										r.requestedBy
									]
								})]
							}, r.id))
						]
					})]
				}),
				/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: onClose,
					children: t("payments.cancel")
				}) })
			]
		})
	});
}
function PayrollPanel() {
	const { t } = useI18n();
	const role = currentRole();
	const isAdmin = role === "admin";
	const initialRange = useMemo(currentRange, []);
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [calculating, setCalculating] = useState(false);
	const [actingId, setActingId] = useState(null);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [range, setRange] = useState(initialRange);
	const [adjusting, setAdjusting] = useState(null);
	const [bonusDialog, setBonusDialog] = useState(null);
	const { sort, toggle } = useSortState("createdAt", "desc");
	const fetchPayrollRecords = useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const params = new URLSearchParams({
				periodStart: range.start,
				periodEnd: range.end
			});
			const response = await api.get(`/api/payroll/records?${params}`);
			setRecords(Array.isArray(response) ? response : response?.data ?? []);
		} catch (err) {
			console.error("Error fetching payroll records:", err);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [range]);
	useEffect(() => {
		fetchPayrollRecords();
	}, [fetchPayrollRecords]);
	const handleCalculate = useCallback(async () => {
		setCalculating(true);
		try {
			const res = await api.post("/api/work-sessions/calculate", {
				periodStart: range.start,
				periodEnd: range.end
			});
			toast.success(t("dash.toast.calculated", { count: String(res?.count ?? res?.records?.length ?? 0) }));
			await fetchPayrollRecords();
		} catch (err) {
			console.error("Error calculating payroll:", err);
			toast.error(t("dash.toast.calcFailed"));
		} finally {
			setCalculating(false);
		}
	}, [
		range,
		fetchPayrollRecords,
		t
	]);
	const handleStatusChange = useCallback(async (record, status) => {
		setActingId(record.id);
		try {
			await api.patch(`/api/payroll/records/${record.id}/status`, { status });
			toast.success(t("dash.toast.statusUpdated"));
		} catch (err) {
			console.error("Error updating payroll record status:", err);
			toast.error(t("dash.errorLoad"));
		} finally {
			setActingId(null);
			await fetchPayrollRecords();
		}
	}, [fetchPayrollRecords, t]);
	const handleNotify = useCallback(async () => {
		if (records.length === 0) return;
		try {
			await api.post("/api/notifications/broadcast", {
				type: "payroll",
				title: t("dash.payrollNotificationTitle"),
				body: t("dash.payrollNotificationBody", { period: `${formatDate(range.start)} – ${formatDate(range.end)}` }),
				data: {
					periodStart: range.start,
					periodEnd: range.end,
					recordCount: records.length
				}
			});
			toast.success(t("dash.toast.notified"));
		} catch (err) {
			console.error("Error broadcasting payroll:", err);
			toast.error(t("dash.toast.notified") + " — " + t("dash.errorLoad"));
		}
	}, [
		records.length,
		range,
		t
	]);
	const filtered = useMemo(() => statusFilter === "all" ? records : records.filter((r) => r.status === statusFilter), [records, statusFilter]);
	const grid = useGrid(sortedSlice(useMemo(() => filtered.map((r) => ({
		...r,
		_searchName: r.employee?.fullName ?? String(r.id ?? "")
	})), [filtered]), sort, {
		createdAt: (a, b) => new Date(b.periodStart ?? 0).getTime() - new Date(a.periodStart ?? 0).getTime(),
		total: (a, b) => (a.netPay ?? 0) - (b.netPay ?? 0),
		commission: (a, b) => (a.commissionPay ?? 0) - (b.commissionPay ?? 0)
	}), query, ["_searchName", "id"]);
	const money = (n) => `${t("dash.egp")}${(n ?? 0).toLocaleString()}`;
	const hours = (n) => (n ?? 0).toLocaleString(void 0, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
	const chip = (active) => cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground");
	if (loading) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, {
		className: "flex items-center justify-center py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex space-x-2",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
			]
		})
	}) });
	if (error) return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
		className: "flex flex-col items-center gap-4 py-16",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: t("dash.errorLoad")
		}), /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			onClick: fetchPayrollRecords,
			children: t("dash.retry")
		})]
	}) });
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
			children: [/* @__PURE__ */ jsxs(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ jsx(Banknote, { className: "size-4 text-muted-foreground" }), t("dash.payroll")]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Calendar, { className: "size-3.5 text-muted-foreground" }),
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: range.start,
								onChange: (e) => setRange((r) => ({
									...r,
									start: e.target.value
								})),
								className: "rounded-lg border border-input bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "–"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: range.end,
								onChange: (e) => setRange((r) => ({
									...r,
									end: e.target.value
								})),
								className: "rounded-lg border border-input bg-background px-3 py-2 text-sm"
							})
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						onClick: handleCalculate,
						disabled: calculating,
						children: [/* @__PURE__ */ jsx(ListChecks, { className: "mr-2 size-4" }), calculating ? t("dash.calculating") : t("dash.calculate")]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						onClick: handleNotify,
						disabled: records.length === 0,
						children: [/* @__PURE__ */ jsx(Edit, { className: "mr-2 size-4" }), t("dash.notifyStaff")]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsx(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: t("dash.search")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						className: chip(statusFilter === "all"),
						onClick: () => {
							setStatusFilter("all");
							grid.setPage(1);
						},
						children: t("dash.payrollFilterAll")
					}), Object.keys(STATUS_STYLES).map((s) => /* @__PURE__ */ jsx("button", {
						className: chip(statusFilter === s),
						onClick: () => {
							setStatusFilter(s);
							grid.setPage(1);
						},
						children: t(`dash.payrollStatus.${s}`)
					}, s))]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.period"),
							active: sort.key === "createdAt",
							dir: sort.dir,
							onToggle: () => toggle("createdAt", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.netPay"),
							active: sort.key === "total",
							dir: sort.dir,
							onToggle: () => toggle("total", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.commission"),
							active: sort.key === "commission",
							dir: sort.dir,
							onToggle: () => toggle("commission", true)
						})
					]
				})
			]
		}), grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "py-6 text-center text-sm text-muted-foreground",
			children: t("dash.noPayrollRecords")
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: grid.slice.map((record) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border p-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: record.employee?.fullName || "—"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									formatDate(record.periodStart),
									" – ",
									formatDate(record.periodEnd)
								]
							}),
							/* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: cn("mt-1.5 border-transparent", STATUS_STYLES[record.status]),
								children: t(`dash.payrollStatus.${record.status}`)
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "text-end",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-lg font-bold",
								children: money(record.netPay)
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: t("dash.netPay")
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5",
						children: [
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.sessions"),
								value: (record.totalSessions ?? 0).toLocaleString()
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.hours"),
								value: `${hours(record.totalHours)}h`
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.basePay"),
								value: money(record.basePay)
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.commission"),
								value: money(record.commissionPay)
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.bonuses"),
								value: money(record.totalBonuses)
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: t("dash.deductions"),
								value: money(record.totalDeductions)
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-center gap-2",
						children: [
							record.status === "calculated" && (isAdmin || role === "payroll") && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								disabled: actingId === record.id,
								onClick: () => handleStatusChange(record, "pending_approval"),
								children: [/* @__PURE__ */ jsx(ListChecks, { className: "mr-1.5 size-3.5" }), t("dash.submitForApproval")]
							}),
							record.status === "pending_approval" && isAdmin && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								disabled: actingId === record.id,
								onClick: () => handleStatusChange(record, "approved"),
								children: [/* @__PURE__ */ jsx(Check, { className: "mr-1.5 size-3.5 text-success" }), t("dash.approve")]
							}), /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								disabled: actingId === record.id,
								onClick: () => handleStatusChange(record, "rejected"),
								children: [/* @__PURE__ */ jsx(X, { className: "mr-1.5 size-3.5 text-destructive" }), t("dash.reject")]
							})] }),
							record.status === "approved" && isAdmin && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								disabled: actingId === record.id,
								onClick: () => handleStatusChange(record, "paid"),
								children: [/* @__PURE__ */ jsx(CircleDollarSign, { className: "mr-1.5 size-3.5 text-success" }), t("dash.markAsPaid")]
							}),
							isAdmin && record.status !== "paid" && /* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7",
								disabled: actingId === record.id,
								onClick: () => setAdjusting(record),
								children: [/* @__PURE__ */ jsx(Edit, { className: "mr-1.5 size-3.5" }), t("dash.adjustAmount")]
							}),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7",
								onClick: () => setBonusDialog(record),
								children: [/* @__PURE__ */ jsx(DiamondPlus, { className: "mr-1.5 size-3.5" }), t("dash.bonusDeductions")]
							})
						]
					})
				]
			}, record.id))
		}), /* @__PURE__ */ jsx(PaginationBar, {
			total: grid.total,
			page: grid.page,
			pageSize: grid.pageSize,
			pageCount: grid.pageCount,
			onPage: grid.setPage,
			onPageSize: grid.setPageSize
		})] })] }),
		adjusting && /* @__PURE__ */ jsx(AdjustAmountDialog, {
			record: adjusting,
			onClose: () => setAdjusting(null),
			onSaved: fetchPayrollRecords
		}),
		bonusDialog && /* @__PURE__ */ jsx(BonusDeductionDialog, {
			record: bonusDialog,
			isAdmin,
			onClose: () => setBonusDialog(null),
			onChanged: fetchPayrollRecords
		})
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg bg-muted/50 p-2.5",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-0.5 text-sm font-semibold",
			children: value
		})]
	});
}
// src/components/dashboard/PaymentsPanel.tsx
function PaymentDialog({ payment, onClose }) {
	const { t } = useI18n();
	const [title, setTitle] = useState(payment?.title ?? "");
	const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
	const [method, setMethod] = useState(payment?.method ?? "cash");
	const [status, setStatus] = useState(payment?.status ?? "paid");
	const [date, setDate] = useState(payment?.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [notes, setNotes] = useState(payment?.notes ?? "");
	const [orderId, setOrderId] = useState(payment?.orderId ?? "");
	const [saving, setSaving] = useState(false);
	const save = async () => {
		const value = Number.parseFloat(amount);
		if (!title.trim() || !Number.isFinite(value) || value <= 0) {
			toast.error(t("payments.invalid"));
			return;
		}
		setSaving(true);
		try {
			if (payment) await updatePayment(payment.id, {
				title: title.trim(),
				amount: value,
				method,
				status,
				date,
				notes: notes.trim(),
				orderId: orderId.trim()
			});
			else await createPayment({
				title: title.trim(),
				amount: value,
				method,
				status,
				date,
				notes: notes.trim(),
				orderId: orderId.trim()
			});
			toast.success(t("dash.toast.saved"));
			onClose();
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: payment ? t("payments.edit") : t("payments.add") }), /* @__PURE__ */ jsx(DialogDescription, { children: payment ? t("payments.editHint") : t("payments.addHint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: t("payments.title"),
							children: /* @__PURE__ */ jsx(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: t("payments.titlePlaceholder")
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: t("payments.amount"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: "0",
									step: "0.01",
									value: amount,
									onChange: (e) => setAmount(e.target.value)
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: t("payments.date"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: t("payments.method"),
								children: /* @__PURE__ */ jsxs("select", {
									value: method,
									onChange: (e) => setMethod(e.target.value),
									className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "cash",
											children: t("checkout.method.cash.short")
										}),
										/* @__PURE__ */ jsx("option", {
											value: "fawry",
											children: t("checkout.method.fawry.short")
										}),
										/* @__PURE__ */ jsx("option", {
											value: "instapay",
											children: t("checkout.method.instapay.short")
										})
									]
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: t("payments.status"),
								children: /* @__PURE__ */ jsxs("select", {
									value: status,
									onChange: (e) => setStatus(e.target.value),
									className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
									children: [/* @__PURE__ */ jsx("option", {
										value: "paid",
										children: t("pay.paid")
									}), /* @__PURE__ */ jsx("option", {
										value: "unpaid",
										children: t("pay.unpaid")
									})]
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("payments.orderId"),
							children: /* @__PURE__ */ jsx(Input, {
								value: orderId,
								onChange: (e) => setOrderId(e.target.value),
								placeholder: t("payments.orderIdHint")
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("payments.notes"),
							children: /* @__PURE__ */ jsx(Textarea, {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								rows: 2,
								placeholder: t("payments.notesPlaceholder")
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: onClose,
					disabled: saving,
					children: t("payments.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: saving,
					children: saving ? t("payments.saving") : t("payments.save")
				})] })
			]
		})
	});
}
function PaymentsPanel() {
	const { t, lang } = useI18n();
	const { payments, settings } = useClinicStore();
	const [editing, setEditing] = useState(null);
	const [adding, setAdding] = useState(false);
	const [methodFilter, setMethodFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [instapayDraft, setInstapayDraft] = useState(settings.instapay);
	const [query, setQuery] = useState("");
	const [settling, setSettling] = useState(null);
	const settlingPayment = payments.find((p) => p.id === settling?.id) ?? settling;
	const { sort, toggle } = useSortState("date", "desc");
	const comparators = {
		date: (a, b) => a.date.localeCompare(b.date),
		amount: (a, b) => a.amount - b.amount,
		title: (a, b) => a.title.localeCompare(b.title)
	};
	const now = /* @__PURE__ */ new Date();
	const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
	const pending = payments.filter((p) => p.status === "unpaid").reduce((s, p) => s + p.amount, 0);
	const thisMonth = payments.filter((p) => p.status === "paid" && p.date.startsWith(monthPrefix)).reduce((s, p) => s + p.amount, 0);
	const summary = [
		{
			key: "payments.summary.collected",
			value: formatMoney(collected, settings.currency),
			icon: Wallet,
			tone: "text-success"
		},
		{
			key: "payments.summary.pending",
			value: formatMoney(pending, settings.currency),
			icon: Banknote,
			tone: "text-amber-500"
		},
		{
			key: "payments.summary.month",
			value: formatMoney(thisMonth, settings.currency),
			icon: CalendarClock,
			tone: "text-primary"
		},
		{
			key: "payments.summary.records",
			value: String(payments.length),
			icon: ListChecks,
			tone: "text-violet-500"
		}
	];
	const grid = useGrid(sortedSlice(payments.filter((p) => {
		if (methodFilter !== "all" && p.method !== methodFilter) return false;
		if (statusFilter !== "all" && p.status !== statusFilter) return false;
		return true;
	}), sort, comparators), query, [
		"title",
		"notes",
		"orderId"
	]);
	const remove = async (id) => {
		await deletePayment(id);
		toast.success(t("dash.toast.deleted"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: summary.map((s) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
					className: "flex items-center justify-between p-5",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-medium text-muted-foreground",
						children: t(s.key)
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-2xl font-bold",
						children: s.value
					})] }), /* @__PURE__ */ jsx(s.icon, { className: cn("size-6", s.tone) })]
				}) }, s.key))
			}),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("payments.providers")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("payments.providersDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold",
									children: t("payments.instapay")
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: cn("border-transparent", settings.instapay.trim() ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600"),
									children: settings.instapay.trim() ? t("payments.configured") : t("payments.notConfigured")
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: t("payments.instapayHint")
							}),
							/* @__PURE__ */ jsx(Input, {
								className: "mt-3",
								value: instapayDraft,
								onChange: (e) => setInstapayDraft(e.target.value),
								placeholder: t("dash.settings.instapay"),
								"aria-label": t("payments.instapay")
							})
						]
					}), /* @__PURE__ */ jsx(Button, {
						size: "sm",
						disabled: instapayDraft.trim() === settings.instapay.trim(),
						onClick: async () => {
							await updateSettings({ instapay: instapayDraft.trim() });
							toast.success(t("dash.toast.saved"));
						},
						children: t("payments.providersSave")
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "rounded-xl border border-border p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Badge, {
								className: "border-transparent bg-primary/15 text-primary",
								children: t("payments.fawry")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: t("payments.fawryInfo")
							})]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border border-border p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Badge, {
								className: "border-transparent bg-amber-500/15 text-amber-600",
								children: t("payments.cash")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: t("payments.cashInfo")
							})]
						})
					})]
				})]
			})] }),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("dash.payments")
					}), /* @__PURE__ */ jsx(CardDescription, { children: t("payments.hint") })] }), /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						onClick: () => setAdding(true),
						children: [
							/* @__PURE__ */ jsx(Plus, { className: "size-4" }),
							" ",
							t("payments.add")
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ jsx(SearchBox, {
							value: query,
							onChange: setQuery,
							placeholder: t("dash.search")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2",
							children: [
								[
									{
										value: "all",
										key: "dash.filterAll"
									},
									{
										value: "cash",
										key: "checkout.method.cash.short"
									},
									{
										value: "fawry",
										key: "checkout.method.fawry.short"
									},
									{
										value: "instapay",
										key: "checkout.method.instapay.short"
									}
								].map((m) => /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setMethodFilter(m.value);
										grid.setPage(1);
									},
									className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", methodFilter === m.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
									children: t(m.key)
								}, m.value)),
								/* @__PURE__ */ jsx("span", { className: "mx-1 hidden w-px bg-border sm:block" }),
								[
									{
										value: "all",
										key: "dash.filterAll"
									},
									{
										value: "paid",
										key: "pay.paid"
									},
									{
										value: "unpaid",
										key: "pay.unpaid"
									}
								].map((s) => /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setStatusFilter(s.value);
										grid.setPage(1);
									},
									className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === s.value ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
									children: t(s.key)
								}, s.value))
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(SortChip, {
									label: t("dash.sort.date"),
									active: sort.key === "date",
									dir: sort.dir,
									onToggle: () => toggle("date", true)
								}),
								/* @__PURE__ */ jsx(SortChip, {
									label: t("dash.sort.amount"),
									active: sort.key === "amount",
									dir: sort.dir,
									onToggle: () => toggle("amount", true)
								}),
								/* @__PURE__ */ jsx(SortChip, {
									label: t("dash.sort.title"),
									active: sort.key === "title",
									dir: sort.dir,
									onToggle: () => toggle("title")
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ jsx(CardContent, { children: grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-6 text-sm text-muted-foreground",
				children: t("dash.empty")
			}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.date") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.title") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.kind.short") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.method") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("payments.amount")
					}),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.status") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.notes") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("dash.actions")
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: formatDate$1(p.date, lang)
					}),
					/* @__PURE__ */ jsxs(TableCell, { children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: p.title
						}),
						p.orderId && /* @__PURE__ */ jsx("div", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: p.orderId
						}),
						p.client?.fullName && /* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-muted-foreground",
							children: p.client.fullName
						}),
						p.items && p.items.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: p.items.map((it) => it.label).join(" · ")
						})
					] }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentKindBadge, { kind: p.kind }) }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentMethodBadge, { method: p.method }) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-end font-bold",
						children: formatMoney(p.amount, settings.currency)
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentStatusBadge, { status: p.status }) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "max-w-[200px]",
						children: /* @__PURE__ */ jsx("div", {
							className: "truncate text-xs text-muted-foreground",
							title: p.notes,
							children: p.notes || "—"
						})
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-end",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1.5",
							children: [
								p.status === "unpaid" && /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 px-2",
									onClick: () => setSettling(p),
									children: t("payments.settle")
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 px-2",
									"aria-label": t("dash.edit"),
									onClick: () => setEditing(p),
									children: /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" })
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 px-2 text-muted-foreground hover:text-destructive",
									"aria-label": t("dash.delete"),
									onClick: () => remove(p.id),
									children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
								})
							]
						})
					})
				] }, p.id)) })] })
			}), /* @__PURE__ */ jsx(PaginationBar, {
				total: grid.total,
				page: grid.page,
				pageSize: grid.pageSize,
				pageCount: grid.pageCount,
				onPage: grid.setPage,
				onPageSize: grid.setPageSize
			})] }) })] }),
			adding && /* @__PURE__ */ jsx(PaymentDialog, {
				payment: null,
				onClose: () => setAdding(false)
			}),
			editing && /* @__PURE__ */ jsx(PaymentDialog, {
				payment: editing,
				onClose: () => setEditing(null)
			}),
			settlingPayment && /* @__PURE__ */ jsx(PaymentSettleDialog, {
				payment: settlingPayment,
				onClose: () => setSettling(null)
			})
		]
	});
}
// src/components/ui/alert-dialog.tsx
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
// src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
// src/components/dashboard/ClientsPanel.tsx
function ClientTypeBadge({ type }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			both: "bg-violet-500/15 text-violet-600",
			clinic: "bg-primary/15 text-primary",
			store: "bg-amber-500/15 text-amber-600",
			new: "bg-muted text-muted-foreground"
		}[type ?? "new"]),
		children: t(`clients.type.${type ?? "new"}`)
	});
}
function SummaryCard({ label, value, icon: Icon, tone }) {
	return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, {
		className: "flex items-center justify-between p-4",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-xl font-bold",
			children: value
		})] }), /* @__PURE__ */ jsx(Icon, { className: cn("size-5", tone) })]
	}) });
}
function ClientDetailView({ id, onBack }) {
	const { t, lang, tOr } = useI18n();
	const { settings } = useClinicStore();
	const [detail, setDetail] = useState(null);
	const [loading, setLoading] = useState(true);
	const [settling, setSettling] = useState(null);
	const load = () => {
		setLoading(true);
		getClient(id).then(setDetail).catch(() => toast.error(t("dash.toast.error"))).finally(() => setLoading(false));
	};
	useEffect(load, [id]);
	if (loading && !detail) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-[300px] place-items-center text-sm text-muted-foreground",
		children: "…"
	});
	if (!detail) return /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border border-border p-10 text-center text-sm text-muted-foreground",
		children: t("dash.empty")
	});
	const c = detail.client;
	const next = detail.stats.nextAppointment;
	const settlingPayment = detail.payments.find((p) => p.id === settling) ?? null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onBack,
				className: "-ms-2 text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4 me-1" }),
					" ",
					t("clients.back")
				]
			}),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsxs(CardTitle, {
				className: "flex flex-wrap items-center gap-2 text-lg",
				children: [c.fullName, /* @__PURE__ */ jsx(ClientTypeBadge, { type: typeOf(detail) })]
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("clients.detailHint") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground",
				children: [
					c.phone && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx(Phone, { className: "size-3.5" }),
							" ",
							c.phone
						]
					}),
					c.email && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx(Mail, { className: "size-3.5" }),
							" ",
							c.email
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx(Users, { className: "size-3.5" }),
							" ",
							t("clients.visits"),
							": ",
							detail.stats.bookingsCount
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx(PawPrint, { className: "size-3.5" }),
							" ",
							t("clients.pets"),
							": ",
							detail.pets.length
						]
					})
				]
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(SummaryCard, {
						label: t("clients.stats.visits"),
						value: String(detail.stats.bookingsCount),
						icon: CalendarDays,
						tone: "text-primary"
					}),
					/* @__PURE__ */ jsx(SummaryCard, {
						label: t("clients.stats.completed"),
						value: String(detail.stats.completedCount),
						icon: CheckCircle2,
						tone: "text-success"
					}),
					/* @__PURE__ */ jsx(SummaryCard, {
						label: t("clients.stats.paidVisit"),
						value: formatMoney(detail.stats.paidVisit, settings.currency),
						icon: Banknote,
						tone: "text-success"
					}),
					/* @__PURE__ */ jsx(SummaryCard, {
						label: t("clients.stats.outstandingVisit"),
						value: formatMoney(detail.stats.outstandingVisit, settings.currency),
						icon: ReceiptText,
						tone: detail.stats.outstandingVisit > 0 ? "text-amber-500" : "text-muted-foreground"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-sm",
						children: t("clients.nextAppointment")
					})
				}), /* @__PURE__ */ jsx(CardContent, {
					className: "text-sm",
					children: next ? /* @__PURE__ */ jsxs("p", { children: [
						formatDate$1(next.date, lang),
						" · ",
						next.time,
						" — ",
						next.petName,
						" (",
						tOr(`animal.${next.pet?.species ?? next.petName}`, next.pet?.species ?? next.petName),
						")",
						" · ",
						next.doctorName
					] }) : /* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground",
						children: t("clients.noNext")
					})
				})] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-sm",
						children: t("clients.followUp")
					})
				}), /* @__PURE__ */ jsx(CardContent, {
					className: "text-sm",
					children: detail.stats.followUpDate ? /* @__PURE__ */ jsx("p", { children: formatDate$1(detail.stats.followUpDate, lang) }) : /* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground",
						children: t("clients.noFollowUp")
					})
				})] })]
			}),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("clients.section.payments")
			}) }), /* @__PURE__ */ jsx(CardContent, { children: detail.payments.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-4 text-center text-sm text-muted-foreground",
				children: t("clients.section.paymentsEmpty")
			}) : /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.date") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.title") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("clients.type") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.method") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("payments.amount")
					}),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.status") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("clients.bill.items") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("dash.actions")
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: detail.payments.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: formatDate$1(p.date, lang)
					}),
					/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: p.title
					}), p.requestedBy && /* @__PURE__ */ jsx("div", {
						className: "text-[11px] text-muted-foreground",
						children: p.requestedBy
					})] }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentKindBadge, { kind: p.kind }) }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentMethodBadge, { method: p.method }) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-end font-bold",
						children: formatMoney(p.amount, settings.currency)
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentStatusBadge, { status: p.status }) }),
					/* @__PURE__ */ jsx(TableCell, { children: (p.items?.length ?? 0) > 0 ? p.items.length : "—" }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-end",
						children: p.status === "unpaid" && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => setSettling(p.id),
							children: t("payments.settle")
						})
					})
				] }, p.id)) })] })
			}) })] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: t("clients.section.appointments")
				}) }), /* @__PURE__ */ jsx(CardContent, { children: detail.bookings.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "py-4 text-center text-sm text-muted-foreground",
					children: t("clients.section.appointmentsEmpty")
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: detail.bookings.map((b) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-border p-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold",
									children: [
										formatDate$1(b.date, lang),
										" · ",
										b.time,
										" — ",
										b.petName
									]
								}), /* @__PURE__ */ jsx(StatusBadge, { status: b.status })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: b.doctorName
							}),
							b.diagnosis && /* @__PURE__ */ jsxs("p", {
								className: "mt-2 rounded bg-muted/60 p-2 text-xs",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: "Diagnosis:"
									}),
									" ",
									b.diagnosis
								]
							})
						]
					}, b.id))
				}) })] }), /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("clients.section.pets")
					}) }), /* @__PURE__ */ jsx(CardContent, { children: detail.pets.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "py-4 text-center text-sm text-muted-foreground",
						children: t("clients.section.petsEmpty")
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: detail.pets.map((p) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: p.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									tOr(`animal.${p.species}`, p.species),
									p.breed ? ` · ${p.breed}` : "",
									p.photo && /* @__PURE__ */ jsx("img", {
										src: p.photo,
										alt: p.name,
										className: "mt-1 inline-block size-10 rounded-lg border object-cover"
									})
								]
							})] }), p.weightKg ? /* @__PURE__ */ jsxs(Badge, {
								variant: "outline",
								children: [p.weightKg, " kg"]
							}) : null]
						}, p.id))
					}) })] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("clients.section.prescriptions")
					}) }), /* @__PURE__ */ jsx(CardContent, { children: detail.prescriptions.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "py-4 text-center text-sm text-muted-foreground",
						children: t("clients.section.prescriptionsEmpty")
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: detail.prescriptions.map((rx) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-2 rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "truncate text-sm font-semibold",
									children: [/* @__PURE__ */ jsx(ClipboardList, { className: "me-1 inline size-3.5 text-muted-foreground" }), rx.rxNumber]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: rx.issuedAt ? formatTime(rx.issuedAt, lang) : rx.followUpDate
								})]
							}), /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: rx.status
							})]
						}, rx.id))
					}) })] })]
				})]
			}),
			settlingPayment && /* @__PURE__ */ jsx(PaymentSettleDialog, {
				payment: settlingPayment,
				onClose: () => {
					setSettling(null);
					load();
				}
			})
		]
	});
}
function typeOf(detail) {
	const bookingsCount = detail.stats.bookingsCount;
	const ordersCount = detail.orders.length;
	if (bookingsCount > 0 && ordersCount > 0) return "both";
	if (bookingsCount > 0) return "clinic";
	if (ordersCount > 0) return "store";
	return "new";
}
function NotifyClientDialog({ client, onClose, onDone }) {
	const { t } = useI18n();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [busy, setBusy] = useState(false);
	const send = async () => {
		if (!title.trim() || !body.trim()) {
			toast.error(t("clients.notifyEmpty"));
			return;
		}
		setBusy(true);
		try {
			await notifyClient(client.id, {
				title: title.trim(),
				body: body.trim()
			});
			toast.success(t("clients.notifySent"));
			onDone();
			onClose();
		} catch {
			toast.error(t("dash.toast.error"));
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, { children: [
					/* @__PURE__ */ jsx(BellRing, { className: "me-2 inline size-4 text-primary" }),
					t("clients.notify"),
					" — ",
					client.fullName
				] }), /* @__PURE__ */ jsx(DialogDescription, { children: t("clients.notifyDesc") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ jsx(Label, { children: t("clients.notifyTitle") }), /* @__PURE__ */ jsx(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: t("clients.notifyTitle"),
							maxLength: 200
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ jsx(Label, { children: t("clients.notifyBody") }), /* @__PURE__ */ jsx(Textarea, {
							value: body,
							onChange: (e) => setBody(e.target.value),
							rows: 5,
							maxLength: 2e3
						})]
					})]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: t("clients.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: send,
					disabled: busy,
					children: busy ? "…" : t("clients.confirm")
				})] })
			]
		})
	});
}
function ClientActions({ client, onView }) {
	const { t } = useI18n();
	const [confirming, setConfirming] = useState(null);
	const [notifying, setNotifying] = useState(false);
	const [busy, setBusy] = useState(false);
	const suspended = client.suspended === true;
	const doToggle = async () => {
		setBusy(true);
		try {
			await setClientSuspended(client.id, !suspended);
			toast.success(t(suspended ? "clients.activateDone" : "clients.suspendDone"));
			setConfirming(null);
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	const doDelete = async () => {
		setBusy(true);
		try {
			await deleteClient(client.id);
			toast.success(t("clients.deleteDone"));
			setConfirming(null);
		} catch {
			toast.error(t("dash.toast.error"));
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				size: "sm",
				variant: "ghost",
				className: "h-7 px-2",
				"aria-label": t("clients.actions"),
				title: t("clients.actions"),
				children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-4" })
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			className: "w-44",
			children: [
				/* @__PURE__ */ jsx(DropdownMenuLabel, {
					className: "truncate",
					children: client.fullName
				}),
				/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					onClick: onView,
					children: [
						/* @__PURE__ */ jsx(Eye, { className: "size-4" }),
						" ",
						t("clients.view")
					]
				}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					disabled: suspended,
					onClick: () => setNotifying(true),
					children: [
						/* @__PURE__ */ jsx(BellRing, { className: "size-4" }),
						" ",
						t("clients.notify")
					]
				}),
				/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					onClick: () => setConfirming(suspended ? "activate" : "suspend"),
					children: [suspended ? /* @__PURE__ */ jsx(UserCheck, { className: "size-4" }) : /* @__PURE__ */ jsx(UserX, { className: "size-4" }), t(suspended ? "clients.activate" : "clients.suspend")]
				}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					className: "text-destructive focus:text-destructive",
					onClick: () => setConfirming("delete"),
					children: [
						/* @__PURE__ */ jsx(Delete, { className: "size-4" }),
						" ",
						t("clients.delete")
					]
				})
			]
		})] }),
		confirming && /* @__PURE__ */ jsx(AlertDialog, {
			open: true,
			onOpenChange: (o) => !o && setConfirming(null),
			children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: t(confirming === "delete" ? "clients.deleteTitle" : confirming === "suspend" ? "clients.suspendTitle" : "clients.activateTitle") }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: t(confirming === "delete" ? "clients.deleteConfirm" : confirming === "suspend" ? "clients.suspendConfirm" : "clients.activateConfirm", { name: client.fullName }) })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
				onClick: () => setConfirming(null),
				children: t("clients.cancel")
			}), /* @__PURE__ */ jsx(AlertDialogAction, {
				disabled: busy,
				onClick: confirming === "delete" ? doDelete : doToggle,
				className: confirming === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : void 0,
				children: busy ? "…" : t("clients.confirm")
			})] })] })
		}),
		notifying && /* @__PURE__ */ jsx(NotifyClientDialog, {
			client,
			onClose: () => setNotifying(false),
			onDone: onView
		})
	] });
}
function SuspendedBadge({ suspended }) {
	const { t } = useI18n();
	if (!suspended) return null;
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: "ms-2 border-transparent bg-destructive/10 text-destructive",
		children: t("clients.suspended")
	});
}
function ClientsPanel() {
	const { t, lang } = useI18n();
	const { clients, settings } = useClinicStore();
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [selectedId, setSelectedId] = useState(null);
	const grid = useGrid(clients.filter((c) => typeFilter === "all" || c.type === typeFilter), query, [
		"fullName",
		"email",
		"phone"
	]);
	if (selectedId) return /* @__PURE__ */ jsx(ClientDetailView, {
		id: selectedId,
		onBack: () => setSelectedId(null)
	}, selectedId);
	const totalOutstanding = clients.reduce((s, c) => s + c.outstanding, 0);
	const totalPaid = clients.reduce((s, c) => s + c.totalPaid, 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(SummaryCard, {
					label: t("clients.name"),
					value: String(clients.length),
					icon: Users,
					tone: "text-primary"
				}),
				/* @__PURE__ */ jsx(SummaryCard, {
					label: t("payments.summary.collected"),
					value: formatMoney(totalPaid, settings.currency),
					icon: Banknote,
					tone: "text-success"
				}),
				/* @__PURE__ */ jsx(SummaryCard, {
					label: t("payments.summary.pending"),
					value: formatMoney(totalOutstanding, settings.currency),
					icon: ReceiptText,
					tone: totalOutstanding > 0 ? "text-amber-500" : "text-muted-foreground"
				}),
				/* @__PURE__ */ jsx(SummaryCard, {
					label: t("clients.type.both"),
					value: String(clients.filter((c) => c.type === "both").length),
					icon: PawPrint,
					tone: "text-violet-500"
				})
			]
		}), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.clients")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("clients.hint") })] }), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsx(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: t("dash.search")
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"all",
						"new",
						"clinic",
						"store",
						"both"
					].map((v) => /* @__PURE__ */ jsx("button", {
						onClick: () => {
							setTypeFilter(v);
							grid.setPage(1);
						},
						className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", typeFilter === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: v === "all" ? t("dash.filterAll") : t(`clients.type.${v}`)
					}, v))
				})]
			})]
		}), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsx("p", {
			className: "mb-3 text-xs text-muted-foreground",
			children: t("dash.showing", {
				count: String(grid.total),
				rows: t("dash.rows")
			})
		}), grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: t("clients.empty")
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.name") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.type") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.pets") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.visits") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.orders") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("clients.paid")
				}),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("clients.outstanding")
				}),
				/* @__PURE__ */ jsx(TableHead, { children: t("clients.lastActivity") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("dash.actions")
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((c) => /* @__PURE__ */ jsxs(TableRow, {
				className: "cursor-pointer",
				onClick: () => setSelectedId(c.id),
				children: [
					/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsxs("div", {
						className: "whitespace-nowrap font-medium",
						children: [c.fullName, /* @__PURE__ */ jsx(SuspendedBadge, { suspended: c.suspended })]
					}), /* @__PURE__ */ jsx("div", {
						className: "whitespace-nowrap text-xs text-muted-foreground",
						children: c.phone || c.email || "—"
					})] }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(ClientTypeBadge, { type: c.type }) }),
					/* @__PURE__ */ jsx(TableCell, { children: c.petsCount }),
					/* @__PURE__ */ jsx(TableCell, { children: c.bookingsCount }),
					/* @__PURE__ */ jsx(TableCell, { children: c.ordersCount }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-end text-success",
						children: formatMoney(c.totalPaid, settings.currency)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: cn("whitespace-nowrap text-end", c.outstanding > 0 ? "font-semibold text-amber-500" : "text-muted-foreground"),
						children: formatMoney(c.outstanding, settings.currency)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm text-muted-foreground",
						children: formatTime(c.lastActivity, lang)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-end",
						children: /* @__PURE__ */ jsx(ClientActions, {
							client: c,
							onView: () => setSelectedId(c.id)
						})
					})
				]
			}, c.id)) })] })
		}), /* @__PURE__ */ jsx(PaginationBar, {
			total: grid.total,
			page: grid.page,
			pageSize: grid.pageSize,
			pageCount: grid.pageCount,
			onPage: grid.setPage,
			onPageSize: grid.setPageSize
		})] })] })] })]
	});
}
// src/components/dashboard/DoctorsPanel.tsx
var EMPTY_DOCTOR = {
	name: "",
	title: "",
	licenseNumber: "",
	signatureImage: "",
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
		title: doctor.title ?? "",
		licenseNumber: doctor.licenseNumber ?? "",
		signatureImage: doctor.signatureImage ?? "",
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
	const save = async () => {
		const initials = form.name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "DR";
		await saveDoctor({
			id: doctor?.id ?? `dr-${Date.now().toString(36)}`,
			name: form.name.trim() || t("dash.unnamed"),
			title: form.title.trim(),
			licenseNumber: form.licenseNumber.trim(),
			signatureImage: form.signatureImage,
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
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Title",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.title,
									onChange: (e) => set("title", e.target.value),
									placeholder: "Veterinary Surgeon"
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "License number",
								children: /* @__PURE__ */ jsx(Input, {
									value: form.licenseNumber,
									onChange: (e) => set("licenseNumber", e.target.value),
									placeholder: "VET-EG-0000"
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Signature",
							children: form.signatureImage ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("img", {
									src: form.signatureImage,
									alt: "Signature",
									className: "h-14 rounded-lg border border-border bg-muted object-contain px-2"
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => set("signatureImage", ""),
									children: "Remove"
								})]
							}) : /* @__PURE__ */ jsxs("label", {
								className: "flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
								children: ["Upload signature image (used on printed prescriptions)", /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const img = new Image();
										img.onload = () => {
											const canvas = document.createElement("canvas");
											const scale = Math.min(1, 400 / Math.max(img.width, img.height));
											canvas.width = Math.round(img.width * scale);
											canvas.height = Math.round(img.height * scale);
											canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
											set("signatureImage", canvas.toDataURL("image/png"));
										};
										img.src = URL.createObjectURL(file);
									}
								})]
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
function DoctorsPanel() {
	const { t, tOr } = useI18n();
	const { doctors } = useClinicStore();
	const [editing, setEditing] = useState(null);
	const [query, setQuery] = useState("");
	const { sort, toggle } = useSortState("name");
	const grid = useGrid(sortedSlice(doctors, sort, {
		name: (a, b) => a.name.localeCompare(b.name),
		spec: (a, b) => a.specialization.localeCompare(b.specialization),
		rating: (a, b) => a.rating - b.rating
	}), query, [
		"name",
		"specialization",
		"experience"
	]);
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
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ jsx(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: t("dash.search")
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ jsx(SortChip, {
						label: t("dash.sort.name"),
						active: sort.key === "name",
						dir: sort.dir,
						onToggle: () => toggle("name")
					}),
					/* @__PURE__ */ jsx(SortChip, {
						label: t("dash.sort.spec"),
						active: sort.key === "spec",
						dir: sort.dir,
						onToggle: () => toggle("spec")
					}),
					/* @__PURE__ */ jsx(SortChip, {
						label: t("dash.sort.rating"),
						active: sort.key === "rating",
						dir: sort.dir,
						onToggle: () => toggle("rating", true)
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "overflow-x-auto",
			children: [
				/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.name") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.specialization") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.experience") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.rating") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.days") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("dash.actions")
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
								onClick: async () => {
									await deleteDoctor(d.id);
									toast.success(t("dash.toast.deleted"));
								},
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})]
						})
					})
				] }, d.id)) })] }),
				grid.slice.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: t("dash.empty")
				}),
				/* @__PURE__ */ jsx(PaginationBar, {
					total: grid.total,
					page: grid.page,
					pageSize: grid.pageSize,
					pageCount: grid.pageCount,
					onPage: grid.setPage,
					onPageSize: grid.setPageSize
				})
			]
		})] }),
		editing && /* @__PURE__ */ jsx(DoctorDialog, {
			doctor: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		})
	] });
}
// src/components/dashboard/ServicesPanel.tsx
function ServiceDialog({ service, onClose }) {
	const { t } = useI18n();
	const [form, setForm] = useState({
		title: service?.title ?? "",
		description: service?.description ?? "",
		price: service?.price != null ? String(service.price) : "0"
	});
	const save = async () => {
		const value = Number.parseFloat(form.price);
		const price = Number.isFinite(value) && value >= 0 ? value : 0;
		await saveService({
			slug: service?.slug ?? `svc-${Date.now().toString(36)}`,
			icon: service?.icon ?? "Stethoscope",
			title: form.title.trim() || t("dash.untitled"),
			description: form.description.trim(),
			price
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
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.service.title"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.title,
								onChange: (e) => setForm((f) => ({
									...f,
									title: e.target.value
								}))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.service.desc"),
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								}))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.service.price"),
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								min: "0",
								step: "0.01",
								value: form.price,
								onChange: (e) => setForm((f) => ({
									...f,
									price: e.target.value
								}))
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
					disabled: !form.title.trim(),
					children: t("dash.save")
				})] })
			]
		})
	});
}
function ServicesPanel() {
	const { t, tOr } = useI18n();
	const { services, settings } = useClinicStore();
	const [editing, setEditing] = useState(null);
	const [query, setQuery] = useState("");
	const grid = useGrid(services, query, ["title", "description"]);
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
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsx("div", {
			className: "mb-4",
			children: /* @__PURE__ */ jsx(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: t("dash.search")
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "overflow-x-auto",
			children: [
				/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.service.title") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.service.desc") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("payments.amount")
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("dash.actions")
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap font-medium",
						children: tOr(`svc.${s.slug}.title`, s.title)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-sm text-muted-foreground",
						children: tOr(`svc.${s.slug}.desc`, s.description)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-end font-semibold",
						children: (s.price ?? 0) > 0 ? formatMoney(s.price, settings.currency) : t("dash.services.free")
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
								onClick: async () => {
									await deleteService(s.slug);
									toast.success(t("dash.toast.deleted"));
								},
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})]
						})
					})
				] }, s.slug)) })] }),
				grid.slice.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: t("dash.empty")
				}),
				/* @__PURE__ */ jsx(PaginationBar, {
					total: grid.total,
					page: grid.page,
					pageSize: grid.pageSize,
					pageCount: grid.pageCount,
					onPage: grid.setPage,
					onPageSize: grid.setPageSize
				})
			]
		})] }),
		editing && /* @__PURE__ */ jsx(ServiceDialog, {
			service: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		})
	] });
}
// src/lib/rx-options.ts
var RX_CARE_PLAN = {
	Dog: [
		{
			label: "Vaccination Schedule",
			defaults: {
				dose: "1 dose",
				route: "Subcutaneous",
				frequency: "Per protocol"
			},
			items: [
				"Rabies",
				"DHPP (3-year protocol)",
				"Bordetella",
				"Leptospirosis",
				"Lyme Disease"
			]
		},
		{
			label: "Parasite Prevention",
			defaults: {
				dose: "1 dose",
				frequency: "Monthly"
			},
			items: [
				"Flea, Tick & Mosquito Control",
				"Heartworm Prevention",
				"Intestinal Worm Control"
			]
		},
		{
			label: "Dental Health Check",
			defaults: { frequency: "During exam" },
			items: [
				"Dental Examination",
				"Dental Cleaning",
				"Oral Health & Nutrition"
			]
		},
		{
			label: "Nutrition Tips",
			defaults: { frequency: "During consult" },
			items: [
				"Balanced Diet Advice",
				"Weight Management",
				"Supplements Guidance"
			]
		}
	],
	Cat: [
		{
			label: "Vaccination Schedule",
			defaults: {
				dose: "1 dose",
				route: "Subcutaneous",
				frequency: "Per protocol"
			},
			items: [
				"FVRCP",
				"FeLV",
				"Rabies",
				"Feline Leukemia (FeLV)",
				"FIP (if at risk)"
			]
		},
		{
			label: "Flea & Worm Control",
			defaults: {
				dose: "1 dose",
				frequency: "Monthly"
			},
			items: [
				"Flea Prevention",
				"Tick Prevention",
				"Intestinal Worm Control",
				"Heartworm Prevention (if needed)"
			]
		},
		{
			label: "Litter Box Hygiene",
			defaults: { frequency: "Daily" },
			items: [
				"Litter Box Cleaning & Hygiene",
				"Odor Control",
				"Litter Box Training",
				"Multi-Cat Household Tips"
			]
		},
		{
			label: "Senior Cat Care",
			defaults: { frequency: "As recommended" },
			items: [
				"Senior Cat Nutrition",
				"Regular Health Checks",
				"Mobility & Comfort Care",
				"Monitoring & Early Detection"
			]
		}
	]
};
function carePlanFor(species) {
	const key = Object.keys(RX_CARE_PLAN).find((k) => k.toLowerCase() === species.trim().toLowerCase());
	return key ? RX_CARE_PLAN[key] ?? [] : [];
}
// src/components/dashboard/PrescriptionBuilderDialog.tsx
var EMPTY_ITEM = {
	medication: "",
	dose: "",
	frequency: "",
	route: "",
	duration: "",
	note: ""
};
function PrescriptionBuilderDialog({ open, onClose, onSaved, preset, editing }) {
	const qc = useQueryClient();
	const { doctors } = useClinicStore();
	const { data: pets = [] } = useQuery({
		queryKey: ["all-pets"],
		queryFn: getPets
	});
	const [petId, setPetId] = useState(preset?.petId ?? editing?.pet?.id ?? "");
	const [patientName, setPatientName] = useState(editing && !editing.pet ? editing.petName ?? "" : "");
	const [patientBreed, setPatientBreed] = useState(editing && !editing.pet ? editing.petBreed ?? "" : "");
	const [doctorId, setDoctorId] = useState(preset?.doctorId ?? editing?.doctor?.id ?? doctors[0]?.id ?? "");
	const [bookingId, setBookingId] = useState(preset?.bookingId ?? editing?.booking?.id ?? null);
	const [diagnosis, setDiagnosis] = useState(preset?.diagnosis ?? editing?.diagnosis ?? "");
	const [items, setItems] = useState(editing?.items?.length ? editing.items.map((i) => ({
		...EMPTY_ITEM,
		...i
	})) : [{ ...EMPTY_ITEM }]);
	const [instructions, setInstructions] = useState(editing?.instructions ?? "");
	const [followUpDate, setFollowUpDate] = useState((editing?.followUpDate ?? "").slice(0, 10));
	const [status, setStatus] = useState(editing?.status === "issued" || editing?.status === "void" ? editing.status : "draft");
	const [busy, setBusy] = useState(false);
	const selectedPet = pets.find((p) => p.id === petId);
	const isWalkIn = !petId;
	const petSpecies = selectedPet?.species ?? editing?.pet?.species ?? "";
	const [planSpecies, setPlanSpecies] = useState(carePlanFor(petSpecies).length > 0 ? petSpecies : "Dog");
	useEffect(() => {
		if (carePlanFor(petSpecies).length > 0) setPlanSpecies(petSpecies);
	}, [petSpecies]);
	const plan = useMemo(() => carePlanFor(planSpecies), [planSpecies]);
	const [planCategory, setPlanCategory] = useState(plan[0]?.label ?? "");
	const [planItem, setPlanItem] = useState(plan[0]?.items[0] ?? "");
	useEffect(() => {
		const first = plan[0];
		setPlanCategory((current) => first && plan.some((c) => c.label === current) ? current : first?.label ?? "");
		setPlanItem((current) => first && first.items.includes(current) ? current : first?.items[0] ?? "");
	}, [plan, planSpecies]);
	const changePlanCategory = (label) => {
		setPlanCategory(label);
		setPlanItem(plan.find((c) => c.label === label)?.items[0] ?? "");
	};
	const addPlanItem = () => {
		const cat = plan.find((c) => c.label === planCategory);
		if (!cat || !planItem) return;
		setItems((list) => [...list, {
			...EMPTY_ITEM,
			medication: planItem,
			...cat.defaults,
			note: cat.label
		}]);
	};
	const valid = doctorId && items.length > 0 && items.every((i) => i.medication.trim() && i.dose.trim() && i.frequency.trim()) && (isWalkIn ? patientName.trim().length > 0 : true);
	const setItem = (index, key, value) => setItems((list) => list.map((item, i) => i === index ? {
		...item,
		[key]: value
	} : item));
	const save = async () => {
		if (!valid) {
			toast.error("Medication, dose and frequency are required on every line");
			return;
		}
		setBusy(true);
		const payload = {
			diagnosis: diagnosis.trim(),
			items: items.map((i) => ({
				medication: i.medication.trim(),
				dose: i.dose.trim(),
				frequency: i.frequency.trim(),
				route: i.route.trim(),
				duration: i.duration.trim(),
				note: i.note.trim()
			})),
			instructions: instructions.trim(),
			followUpDate,
			status: editing ? status === "void" ? "void" : "issued" : status
		};
		try {
			if (editing) {
				await updatePrescription(editing.id, {
					...payload,
					status: status === "void" ? "void" : "issued"
				});
				toast.success(editing.status === "void" ? "Prescription updated" : "Prescription updated");
			} else {
				await createPrescription({
					...payload,
					status: status === "draft" ? "draft" : "issued",
					petId: petId || null,
					petName: selectedPet ? selectedPet.name : patientName.trim(),
					petSpecies: selectedPet ? selectedPet.species : planSpecies,
					petBreed: selectedPet ? selectedPet.breed : patientBreed.trim(),
					doctorId,
					bookingId: bookingId || null
				});
				toast.success(status === "draft" ? "Draft saved" : "Prescription issued");
			}
			qc.invalidateQueries({ queryKey: ["prescriptions"] });
			qc.invalidateQueries({ queryKey: ["me"] });
			onSaved();
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message.split(": ").pop() ?? "Failed to save" : "Failed to save");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: editing ? `Edit ${editing.rxNumber}` : "Write a prescription" }), /* @__PURE__ */ jsx(DialogDescription, { children: "The signed document becomes printable and verifiable once issued. A signature (if set on the clinician) is captured on the prescription." })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs(Field, {
								label: "Patient",
								children: [/* @__PURE__ */ jsxs(Select, {
									value: petId || "__walkin",
									onValueChange: (v) => setPetId(v === "__walkin" ? "" : v),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [pets.map((pet) => /* @__PURE__ */ jsxs(SelectItem, {
										value: pet.id,
										children: [
											pet.name,
											" — ",
											pet.species,
											"client" in pet && pet.client ? ` · ${pet.client.fullName}` : ""
										]
									}, pet.id)), /* @__PURE__ */ jsx(SelectItem, {
										value: "__walkin",
										children: "Walk-in patient (no pet file)"
									})] })]
								}), isWalkIn && /* @__PURE__ */ jsxs("div", {
									className: "mt-2 space-y-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ jsx(Input, {
											value: patientName,
											onChange: (e) => setPatientName(e.target.value),
											placeholder: "Patient name"
										}), /* @__PURE__ */ jsx(Input, {
											value: patientBreed,
											onChange: (e) => setPatientBreed(e.target.value),
											placeholder: "Breed (optional)"
										})]
									}), /* @__PURE__ */ jsxs(Select, {
										value: planSpecies,
										onValueChange: setPlanSpecies,
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(RX_CARE_PLAN).map((s) => /* @__PURE__ */ jsx(SelectItem, {
											value: s,
											children: s
										}, s)) })]
									})]
								})]
							}), /* @__PURE__ */ jsx(Field, {
								label: "Prescribing clinician",
								children: /* @__PURE__ */ jsxs(Select, {
									value: doctorId,
									onValueChange: setDoctorId,
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: doctors.map((d) => /* @__PURE__ */ jsx(SelectItem, {
										value: d.id,
										children: d.name
									}, d.id)) })]
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Diagnosis",
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 2,
								value: diagnosis,
								onChange: (e) => setDiagnosis(e.target.value),
								placeholder: "Clinical diagnosis for this visit"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3",
							children: [
								plan.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border bg-muted/40 p-3",
									children: [/* @__PURE__ */ jsxs("p", {
										className: "mb-2 text-xs font-semibold text-foreground",
										children: [planSpecies, " wellness & care plan"]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-end gap-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "grid min-w-0 flex-1 gap-2 sm:grid-cols-3",
											children: [
												/* @__PURE__ */ jsx(Field, {
													label: "Species",
													children: /* @__PURE__ */ jsxs(Select, {
														value: planSpecies,
														onValueChange: setPlanSpecies,
														children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(RX_CARE_PLAN).map((s) => /* @__PURE__ */ jsx(SelectItem, {
															value: s,
															children: s
														}, s)) })]
													})
												}),
												/* @__PURE__ */ jsx(Field, {
													label: "Category",
													children: /* @__PURE__ */ jsxs(Select, {
														value: planCategory,
														onValueChange: changePlanCategory,
														children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: plan.map((c) => /* @__PURE__ */ jsx(SelectItem, {
															value: c.label,
															children: c.label
														}, c.label)) })]
													})
												}),
												/* @__PURE__ */ jsx(Field, {
													label: "Care item",
													children: /* @__PURE__ */ jsxs(Select, {
														value: planItem,
														onValueChange: setPlanItem,
														children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: plan.find((c) => c.label === planCategory)?.items.map((item) => /* @__PURE__ */ jsx(SelectItem, {
															value: item,
															children: item
														}, item)) })]
													})
												})
											]
										}), /* @__PURE__ */ jsxs(Button, {
											size: "sm",
											variant: "outline",
											className: "h-9",
											onClick: addPlanItem,
											children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), " Add"]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx(Label, {
										className: "text-xs font-medium text-muted-foreground",
										children: "Medication lines"
									}), /* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7",
										onClick: () => setItems((list) => [...list, { ...EMPTY_ITEM }]),
										disabled: items.length >= 30,
										children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), " Add line"]
									})]
								}),
								/* @__PURE__ */ jsx(ItemTable, {
									items,
									setItem,
									onRemove: (i) => setItems((list) => list.filter((_, j) => j !== i))
								})
							]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Instructions",
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 2,
								value: instructions,
								onChange: (e) => setInstructions(e.target.value),
								placeholder: "How the medication should be administered"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Follow-up date",
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: followUpDate,
									onChange: (e) => setFollowUpDate(e.target.value)
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Status",
								children: /* @__PURE__ */ jsxs(Select, {
									value: status,
									onValueChange: (v) => setStatus(v),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: editing ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "issued",
										children: "Issued — printable & verifiable"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "void",
										children: "Void — invalidated"
									})] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "draft",
										children: "Draft — not yet handed out"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "issued",
										children: "Issue now — printable & verifiable"
									})] }) })]
								})
							})]
						}),
						editing?.booking?.id && /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Linked to booking ",
								editing.booking.date,
								" ",
								editing.booking.time
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: busy || !valid,
					children: busy ? "Saving…" : editing ? "Save changes" : status === "issued" ? "Issue prescription" : "Save draft"
				})] })
			]
		})
	});
}
function ItemTable({ items, setItem, onRemove }) {
	const inputCls = "h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full border-collapse text-sm",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
				className: "text-left text-xs font-medium text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Medication *"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Dose *"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Frequency *"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Route"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Duration"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-1.5",
						children: "Note"
					}),
					/* @__PURE__ */ jsx("th", { className: "w-8" })
				]
			}) }), /* @__PURE__ */ jsx("tbody", { children: items.map((item, i) => /* @__PURE__ */ jsxs("tr", { children: [[
				"medication",
				"dose",
				"frequency",
				"route",
				"duration",
				"note"
			].map((key) => /* @__PURE__ */ jsx("td", {
				className: cn("p-1.5", key === "note" ? "w-32" : ""),
				children: /* @__PURE__ */ jsx("input", {
					value: item[key],
					onChange: (e) => setItem(i, key, e.target.value),
					className: cn(inputCls, "w-full", (key === "medication" || key === "dose" || key === "frequency") && !item[key] && "border-rose-300")
				})
			}, key)), /* @__PURE__ */ jsx("td", {
				className: "p-1.5",
				children: /* @__PURE__ */ jsx(Button, {
					size: "sm",
					variant: "ghost",
					className: "h-9 w-8 px-0 text-muted-foreground hover:text-destructive",
					"aria-label": "Remove line",
					onClick: () => onRemove(i),
					disabled: items.length === 1,
					children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
				})
			})] }, i)) })]
		})
	});
}
// src/components/dashboard/PrescriptionsPanel.tsx
var FILTERS = [
	{
		value: "all",
		label: "All"
	},
	{
		value: "draft",
		label: "Draft"
	},
	{
		value: "issued",
		label: "Issued"
	},
	{
		value: "void",
		label: "Void"
	}
];
function PrescriptionsPanel() {
	const qc = useQueryClient();
	const { data: prescriptions = [], isLoading } = useQuery({
		queryKey: ["prescriptions"],
		queryFn: () => listPrescriptions()
	});
	const [filter, setFilter] = useState("all");
	const [query, setQuery] = useState("");
	const [builder, setBuilder] = useState(null);
	const [editing, setEditing] = useState(null);
	const [viewing, setViewing] = useState(null);
	const { sort, toggle } = useSortState("createdAt");
	const grid = useGrid(sortedSlice(prescriptions.filter((rx) => {
		if (filter !== "all" && rx.status !== filter) return false;
		if (!query.trim()) return true;
		const q = query.toLowerCase();
		return [
			rx.rxNumber,
			rx.petName || rx.pet?.name,
			rx.client?.fullName,
			rx.doctor?.name,
			rx.diagnosis
		].join(" ").toLowerCase().includes(q);
	}), sort, {
		createdAt: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
		rxNumber: (a, b) => a.rxNumber.localeCompare(b.rxNumber),
		pet: (a, b) => (a.petName || a.pet?.name || "").localeCompare(b.petName || b.pet?.name || "")
	}), "", [], 12);
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["prescriptions"] });
	};
	const voidRx = async (rx) => {
		if (!window.confirm(`Void ${rx.rxNumber}? It will no longer verify as authentic.`)) return;
		try {
			await updatePrescription(rx.id, { status: "void" });
			toast.success("Prescription voided");
			refresh();
		} catch {
			toast.error("Could not void the prescription");
		}
	};
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsx(PrintCss, {}),
		/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: "Prescriptions"
			}), /* @__PURE__ */ jsx(CardDescription, { children: "Signed, numbered prescriptions with QR verification for clients." })] }), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setBuilder("new"),
				children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), " New prescription"]
			})]
		}),
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsx(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: "Search by Rx, pet, owner, doctor…"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							active: sort.key === "createdAt",
							dir: sort.dir,
							label: "Recent",
							onToggle: () => toggle("createdAt", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							active: sort.key === "rxNumber",
							dir: sort.dir,
							label: "Rx number",
							onToggle: () => toggle("rxNumber")
						}),
						/* @__PURE__ */ jsx(SortChip, {
							active: sort.key === "pet",
							dir: sort.dir,
							label: "Pet",
							onToggle: () => toggle("pet")
						})
					]
				}),
				/* @__PURE__ */ jsx(ToggleGroup, {
					type: "single",
					value: filter,
					onValueChange: (v) => setFilter(v ?? "all"),
					children: FILTERS.map((f) => /* @__PURE__ */ jsx(ToggleGroupItem, {
						value: f.value,
						className: "text-xs",
						children: f.label
					}, f.value))
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Rx number" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Pet" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Owner" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Clinician" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Issued" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: "Actions"
				})
			] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [
				isLoading && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
					colSpan: 7,
					className: "h-32 text-center text-sm text-muted-foreground",
					children: "Loading…"
				}) }),
				!isLoading && grid.slice.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, {
					colSpan: 7,
					className: "h-32 text-center text-sm text-muted-foreground",
					children: [
						"No prescriptions",
						filter !== "all" ? ` in ${filter} state` : "",
						"."
					]
				}) }),
				grid.slice.map((rx) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap font-mono text-sm font-semibold",
						children: rx.rxNumber
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "whitespace-nowrap",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-medium",
							children: rx.petName || rx.pet?.name || "—"
						}), /* @__PURE__ */ jsxs("span", {
							className: "block text-xs text-muted-foreground",
							children: [rx.petSpecies || rx.pet?.species || "", rx.client?.fullName ? ` · ${rx.client.fullName}` : ""]
						})]
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: rx.client?.fullName ?? "—"
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: rx.doctor?.name ?? "—"
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-xs text-muted-foreground",
						children: rx.issuedAt ? new Date(rx.issuedAt).toLocaleDateString("en-GB") : "—"
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusPill, { status: rx.status }) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-end",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1.5",
							children: [/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: () => setViewing(rx),
								children: [/* @__PURE__ */ jsx(FileText, { className: "size-3.5" }), " View"]
							}), rx.status !== "void" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: () => setEditing(rx),
								children: /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" })
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 text-muted-foreground hover:text-destructive",
								"aria-label": "Void prescription",
								onClick: () => voidRx(rx),
								children: /* @__PURE__ */ jsx(Ban, { className: "size-3.5" })
							})] })]
						})
					})
				] }, rx.id))
			] })] })
		})] }),
		builder && /* @__PURE__ */ jsx(PrescriptionBuilderDialog, {
			open: true,
			onClose: () => setBuilder(null),
			onSaved: refresh
		}),
		editing && /* @__PURE__ */ jsx(PrescriptionBuilderDialog, {
			open: true,
			editing,
			onClose: () => setEditing(null),
			onSaved: refresh
		}),
		viewing && /* @__PURE__ */ jsx(Dialog, {
			open: true,
			onOpenChange: (o) => !o && setViewing(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl",
				children: [
					/* @__PURE__ */ jsx(DialogHeader, {
						className: "sr-only",
						children: /* @__PURE__ */ jsx(DialogTitle, { children: viewing.rxNumber })
					}),
					/* @__PURE__ */ jsx("div", {
						className: "no-print flex flex-wrap items-center gap-2 px-6 pt-4",
						children: /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => window.print(),
							children: [/* @__PURE__ */ jsx(Printer, { className: "size-4" }), " Print"]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "print-sheet px-6 pb-6",
						children: /* @__PURE__ */ jsx(PrescriptionDocument, { rx: viewing })
					})
				]
			})
		})
	] });
}
function StatusPill({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase", status === "issued" ? "bg-emerald-100 text-emerald-700" : status === "void" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"),
		children: status
	});
}
// src/components/dashboard/ArchivePanel.tsx
function ArchivePanel() {
	const { t, lang } = useI18n();
	const { requests, orders, settings } = useClinicStore();
	const [reqQuery, setReqQuery] = useState("");
	const [orderQuery, setOrderQuery] = useState("");
	const { sort: reqSort, toggle: toggleReqSort } = useSortState("newest", "desc");
	const { sort: ordSort, toggle: toggleOrdSort } = useSortState("newest", "desc");
	const archivedRequests = useMemo(() => requests.filter((r) => r.archived), [requests]);
	const archivedOrders = useMemo(() => orders.filter((o) => o.archived), [orders]);
	const reqComparators = {
		newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		appointment: (a, b) => (a.date + a.time).localeCompare(b.date + b.time),
		owner: (a, b) => a.ownerName.localeCompare(b.ownerName)
	};
	const ordComparators = {
		newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		owner: (a, b) => a.customerName.localeCompare(b.customerName),
		total: (a, b) => a.total - b.total
	};
	const sortedReqs = sortedSlice(archivedRequests, reqSort, reqComparators);
	const sortedOrds = sortedSlice(archivedOrders, ordSort, ordComparators);
	const reqGrid = useGrid(sortedReqs, reqQuery, [
		"ownerName",
		"petName",
		"doctorName",
		"phone"
	]);
	const ordGrid = useGrid(sortedOrds, orderQuery, [
		"customerName",
		"phone",
		"email",
		"id"
	]);
	const restoreReq = async (id) => {
		await archiveBooking(id, false);
		toast.success(t("dash.toast.restored"));
	};
	const deleteReq = async (id) => {
		await deleteRequest(id);
		toast.success(t("dash.toast.deleted"));
	};
	const restoreOrd = async (id) => {
		await archiveOrder(id, false);
		toast.success(t("dash.toast.restored"));
	};
	const deleteOrd = async (id) => {
		await deleteOrder(id);
		toast.success(t("dash.toast.deleted"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: t("archive.requests")
				}), /* @__PURE__ */ jsx(CardDescription, { children: t("archive.requestsDesc") })] }), archivedRequests.length > 0 && /* @__PURE__ */ jsx(Badge, {
					variant: "outline",
					className: "text-muted-foreground",
					children: archivedRequests.length
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsx(SearchBox, {
					value: reqQuery,
					onChange: setReqQuery,
					placeholder: t("dash.search")
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.recent"),
							active: reqSort.key === "newest",
							dir: reqSort.dir,
							onToggle: () => toggleReqSort("newest", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.appointment"),
							active: reqSort.key === "appointment",
							dir: reqSort.dir,
							onToggle: () => toggleReqSort("appointment")
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.owner"),
							active: reqSort.key === "owner",
							dir: reqSort.dir,
							onToggle: () => toggleReqSort("owner")
						})
					]
				})]
			})]
		}), /* @__PURE__ */ jsx(CardContent, { children: reqGrid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "py-6 text-sm text-muted-foreground",
			children: t("archive.empty")
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.owner") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.pet") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.date") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.time") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.statusCol") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("dash.actions")
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: reqGrid.slice.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
					className: "whitespace-nowrap font-medium",
					children: r.ownerName
				}), /* @__PURE__ */ jsx("div", {
					className: "whitespace-nowrap text-xs text-muted-foreground",
					children: r.phone
				})] }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap",
					children: r.petName
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap",
					children: formatDate$1(r.date, lang)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap",
					children: r.time
				}),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: r.status }) }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-end",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-1.5",
						children: [/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => restoreReq(r.id),
							children: [
								/* @__PURE__ */ jsx(ArchiveRestore, { className: "size-3.5" }),
								" ",
								t("archive.restore")
							]
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-destructive",
							"aria-label": t("dash.delete"),
							title: t("archive.deletePermanent"),
							onClick: () => deleteReq(r.id),
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
						})]
					})
				})
			] }, r.id)) })] })
		}), /* @__PURE__ */ jsx(PaginationBar, {
			total: reqGrid.total,
			page: reqGrid.page,
			pageSize: reqGrid.pageSize,
			pageCount: reqGrid.pageCount,
			onPage: reqGrid.setPage,
			onPageSize: reqGrid.setPageSize
		})] }) })] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: t("archive.orders")
				}), /* @__PURE__ */ jsx(CardDescription, { children: t("archive.ordersDesc") })] }), archivedOrders.length > 0 && /* @__PURE__ */ jsx(Badge, {
					variant: "outline",
					className: "text-muted-foreground",
					children: archivedOrders.length
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsx(SearchBox, {
					value: orderQuery,
					onChange: setOrderQuery,
					placeholder: t("dash.search")
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.recent"),
							active: ordSort.key === "newest",
							dir: ordSort.dir,
							onToggle: () => toggleOrdSort("newest", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.owner"),
							active: ordSort.key === "owner",
							dir: ordSort.dir,
							onToggle: () => toggleOrdSort("owner")
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.total"),
							active: ordSort.key === "total",
							dir: ordSort.dir,
							onToggle: () => toggleOrdSort("total", true)
						})
					]
				})]
			})]
		}), /* @__PURE__ */ jsx(CardContent, { children: ordGrid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "py-6 text-sm text-muted-foreground",
			children: t("archive.empty")
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.owner") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("payments.amount") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("payments.method") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("payments.status") }),
				/* @__PURE__ */ jsx(TableHead, { children: t("dash.statusCol") }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-end",
					children: t("dash.actions")
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: ordGrid.slice.map((o) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
					className: "whitespace-nowrap font-medium",
					children: o.customerName
				}), /* @__PURE__ */ jsx("div", {
					className: "font-mono text-[11px] text-muted-foreground",
					children: o.id
				})] }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "whitespace-nowrap font-bold",
					children: formatMoney(o.total, settings.currency)
				}),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentMethodBadge, { method: o.paymentMethod }) }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PaymentStatusBadge, { status: o.paymentStatus === "paid" ? "paid" : "unpaid" }) }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: o.status }) }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-end",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-1.5",
						children: [/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							variant: "outline",
							className: "h-7",
							onClick: () => restoreOrd(o.id),
							children: [
								/* @__PURE__ */ jsx(ArchiveRestore, { className: "size-3.5" }),
								" ",
								t("archive.restore")
							]
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-destructive",
							"aria-label": t("dash.delete"),
							title: t("archive.deletePermanent"),
							onClick: () => deleteOrd(o.id),
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
						})]
					})
				})
			] }, o.id)) })] })
		}), /* @__PURE__ */ jsx(PaginationBar, {
			total: ordGrid.total,
			page: ordGrid.page,
			pageSize: ordGrid.pageSize,
			pageCount: ordGrid.pageCount,
			onPage: ordGrid.setPage,
			onPageSize: ordGrid.setPageSize
		})] }) })] })]
	});
}
// src/components/ui/checkbox.tsx
var Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(CheckboxPrimitive.Root, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
// src/lib/roles.ts
var ALL_TAB_IDS = [
	"overview",
	"requests",
	"staff-overview",
	"payroll",
	"clients",
	"reservations",
	"finance",
	"doctors",
	"services",
	"products",
	"orders",
	"reviews",
	"workdays",
	"archive",
	"logs",
	"settings",
	"prescriptions",
	"recruitment"
];
var ROLE_ORDER = [
	"staff",
	"payroll",
	"admin"
];
var FULL_ACCESS = [...ALL_TAB_IDS];
var DEFAULT_ROLE_PERMISSIONS = {
	admin: FULL_ACCESS,
	payroll: [
		"overview",
		"requests",
		"reservations",
		"payroll",
		"clients",
		"finance",
		"doctors",
		"services",
		"products",
		"orders",
		"reviews",
		"workdays",
		"archive",
		"prescriptions"
	],
	staff: [
		"overview",
		"requests",
		"reservations",
		"prescriptions"
	]
};
function allowedTabsForRole(perms, role) {
	if (role === "admin") return FULL_ACCESS;
	return (perms && perms[role] ? perms[role] : DEFAULT_ROLE_PERMISSIONS[role]) ?? [];
}
// src/components/dashboard/SettingsPanel.tsx
function SettingsPanel() {
	const { t, lang, setLang } = useI18n();
	const { settings } = useClinicStore();
	const [gsBusy, setGsBusy] = useState(false);
	const [gsResult, setGsResult] = useState(null);
	const [gsError, setGsError] = useState(null);
	const [credsForm, setCredsForm] = useState({
		currentPassword: "",
		newUsername: "",
		newPassword: "",
		confirm: ""
	});
	const [form, setForm] = useState({
		name: settings.name,
		tagline: settings.tagline,
		phone: settings.phone,
		emergency: settings.emergency,
		whatsapp: settings.whatsapp,
		email: settings.email,
		address: settings.address,
		currency: settings.currency,
		instapay: settings.instapay
	});
	const [perms, setPerms] = useState(() => settings.rolePermissions && Object.keys(settings.rolePermissions).length ? settings.rolePermissions : DEFAULT_ROLE_PERMISSIONS);
	useEffect(() => {
		setForm({
			name: settings.name,
			tagline: settings.tagline,
			phone: settings.phone,
			emergency: settings.emergency,
			whatsapp: settings.whatsapp,
			email: settings.email,
			address: settings.address,
			currency: settings.currency,
			instapay: settings.instapay
		});
		if (settings.rolePermissions && Object.keys(settings.rolePermissions).length) setPerms(settings.rolePermissions);
	}, [settings]);
	const toggleRoleTab = (role, tab, checked) => {
		if (role === "admin") return;
		setPerms((prev) => {
			const list = new Set(prev[role] ?? []);
			if (checked) list.add(tab);
			else list.delete(tab);
			return {
				...prev,
				[role]: [...list]
			};
		});
	};
	const savePerms = async () => {
		try {
			await updateSettings({ rolePermissions: perms });
			toast.success(t("dash.toast.saved"));
		} catch {
			toast.error(t("dash.toast.error"));
		}
	};
	const save = async () => {
		if (!form.currency.trim()) {
			toast.error(t("dash.settings.currencyEmpty"));
			return;
		}
		try {
			await updateSettings({
				...form,
				currency: form.currency.trim()
			});
			toast.success(t("dash.toast.saved"));
		} catch {
			toast.error(t("dash.toast.error"));
		}
	};
	const doSync = async () => {
		setGsBusy(true);
		setGsError(null);
		setGsResult(null);
		try {
			const r = await syncGoogleReviews();
			setGsResult(r);
			toast.success(t("dash.settings.googleSyncSuccess", {
				synced: String(r.synced),
				total: String(r.total)
			}));
		} catch {
			setGsError(t("dash.settings.googleSyncFail"));
			toast.error(t("dash.settings.googleSyncFail"));
		} finally {
			setGsBusy(false);
		}
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
					/* @__PURE__ */ jsx(Field, {
						label: t("dash.settings.tagline"),
						children: /* @__PURE__ */ jsx(Input, {
							value: form.tagline,
							onChange: (e) => setForm({
								...form,
								tagline: e.target.value
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
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: t("dash.settings.currency"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.currency,
								onChange: (e) => setForm({
									...form,
									currency: e.target.value
								}),
								maxLength: 8,
								placeholder: "$"
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: t("dash.settings.instapay"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.instapay,
								onChange: (e) => setForm({
									...form,
									instapay: e.target.value
								}),
								maxLength: 80,
								placeholder: "01xxxxxxxxxx"
							})
						})]
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
				children: t("auth.changeCredentials")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("auth.changeCredentialsDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: t("auth.currentPassword"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							value: credsForm.currentPassword,
							onChange: (e) => setCredsForm({
								...credsForm,
								currentPassword: e.target.value
							}),
							autoComplete: "current-password",
							maxLength: 128
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: t("auth.newUsername"),
							children: /* @__PURE__ */ jsx(Input, {
								value: credsForm.newUsername,
								onChange: (e) => setCredsForm({
									...credsForm,
									newUsername: e.target.value
								}),
								autoComplete: "username",
								maxLength: 40
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: t("auth.newPassword"),
							children: /* @__PURE__ */ jsx(Input, {
								type: "password",
								value: credsForm.newPassword,
								onChange: (e) => setCredsForm({
									...credsForm,
									newPassword: e.target.value
								}),
								autoComplete: "new-password",
								maxLength: 128
							})
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: t("auth.confirmNewPassword"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							value: credsForm.confirm,
							onChange: (e) => setCredsForm({
								...credsForm,
								confirm: e.target.value
							}),
							autoComplete: "new-password",
							maxLength: 128
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsx(Button, {
							onClick: async () => {
								if (credsForm.newPassword !== credsForm.confirm) {
									toast.error(t("auth.mismatch"));
									return;
								}
								if (credsForm.newUsername && credsForm.newUsername.trim().length < 3) {
									toast.error(t("auth.usernameTooShort"));
									return;
								}
								if (credsForm.newPassword && credsForm.newPassword.length < 6) {
									toast.error(t("auth.passTooShort"));
									return;
								}
								if (!credsForm.newUsername && !credsForm.newPassword) {
									toast.error(t("auth.nothingToChange"));
									return;
								}
								try {
									const payload = { currentPassword: credsForm.currentPassword };
									if (credsForm.newUsername) payload.newUsername = credsForm.newUsername;
									if (credsForm.newPassword) payload.newPassword = credsForm.newPassword;
									await changeCredentials(payload);
									toast.success(t("auth.credsChanged"));
									setCredsForm({
										currentPassword: "",
										newUsername: "",
										newPassword: "",
										confirm: ""
									});
								} catch {
									toast.error(t("auth.wrongCurrent"));
								}
							},
							children: t("auth.changeCredentials")
						})
					})
				]
			})] }),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.settings.googleSync")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.settings.googleSyncDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ jsxs(Button, {
						onClick: doSync,
						disabled: gsBusy,
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: cn("size-4", gsBusy && "animate-spin") }), gsBusy ? t("dash.settings.googleSyncBtn") + "…" : t("dash.settings.googleSyncBtn")]
					}),
					gsResult && !gsError && /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-success",
						children: [
							"✓",
							" ",
							t("dash.settings.googleSyncSuccess", {
								synced: String(gsResult.synced),
								total: String(gsResult.total)
							})
						]
					}),
					gsError && /* @__PURE__ */ jsx("span", {
						className: "text-xs text-destructive",
						children: gsError
					})
				]
			})] }),
			/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.settings.roles")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.settings.rolesDesc") })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[520px] border-collapse text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-border text-start",
								children: [/* @__PURE__ */ jsx("th", {
									className: "py-2 pe-4 text-start font-medium text-muted-foreground",
									children: t("dash.settings.rolesAccess")
								}), ROLE_ORDER.map((r) => /* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-center font-medium text-muted-foreground",
									children: t(`auth.role.${r}`)
								}, r))]
							}) }), /* @__PURE__ */ jsx("tbody", { children: ALL_TAB_IDS.map((tab) => /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-border/60",
								children: [/* @__PURE__ */ jsx("td", {
									className: "py-2 pe-4 text-start",
									children: t(`dash.${tab}`)
								}), ROLE_ORDER.map((r) => {
									const isAdmin = r === "admin";
									const checked = isAdmin || (perms[r] ?? []).includes(tab);
									return /* @__PURE__ */ jsx("td", {
										className: "px-3 py-2 text-center",
										children: /* @__PURE__ */ jsx(Checkbox, {
											checked,
											disabled: isAdmin,
											onCheckedChange: (v) => toggleRoleTab(r, tab, v === true),
											"aria-label": `${t(`dash.${tab}`)} — ${t(`auth.role.${r}`)}`
										})
									}, r);
								})]
							}, tab)) })]
						})
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: t("dash.settings.rolesNote")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: savePerms,
							children: t("dash.save")
						}), /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setPerms({ ...DEFAULT_ROLE_PERMISSIONS }),
							children: t("dash.settings.rolesReset")
						})]
					})
				]
			})] })
		]
	});
}
// src/components/dashboard/ProductsPanel.tsx
var PRODUCT_CATEGORIES = [
	"food",
	"treats",
	"toys",
	"grooming",
	"health",
	"accessories"
];
var PET_TYPES = [
	"dog",
	"cat",
	"both"
];
var LOW_STOCK_THRESHOLD = 5;
var EMPTY_PRODUCT = {
	name: "",
	description: "",
	price: "",
	compareAtPrice: "",
	stock: "",
	image: "",
	category: "accessories",
	petType: "both",
	featured: false,
	barcode: "",
	barcodeImage: ""
};
function ProductDialog({ product, onClose, products }) {
	const { t } = useI18n();
	const scanInputRef = useRef(null);
	const scanTimerRef = useRef(null);
	const [scanText, setScanText] = useState("");
	const [scanBuffer, setScanBuffer] = useState("");
	const [form, setForm] = useState(() => product ? {
		name: product.name,
		description: product.description,
		price: String(product.price),
		compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
		stock: String(product.stock),
		image: product.image,
		category: product.category,
		petType: product.petType ?? "both",
		featured: product.featured,
		barcode: product.barcode ?? "",
		barcodeImage: product.barcodeImage ?? ""
	} : EMPTY_PRODUCT);
	const submitScan = useCallback((code) => {
		const clean = code.trim();
		setScanText("");
		setScanBuffer("");
		if (!clean) return;
		setForm((f) => clean === f.barcode ? f : {
			...f,
			barcode: clean
		});
		toast.success(t("dash.form.product.captured", { code: clean }));
		QRCode.toDataURL(clean, {
			margin: 1,
			width: 400
		}).then((label) => setForm((f) => ({
			...f,
			barcodeImage: label
		}))).catch((err) => console.error("Failed to generate barcode label", err));
		const existing = products.find((p) => p.barcode === clean && p.id !== product?.id);
		if (existing) toast.warning(t("dash.form.product.barcodeExists", { name: existing.name }));
		scanInputRef.current?.focus();
	}, [
		products,
		product?.id,
		t
	]);
	useEffect(() => {
		scanInputRef.current?.focus();
	}, []);
	useEffect(() => {
		const flush = () => {
			const value = scanBuffer.trim();
			if (value) submitScan(value);
			setScanBuffer("");
			if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
			scanTimerRef.current = null;
		};
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (e.key === "Enter") {
				if (!scanBuffer.trim()) return;
				e.preventDefault();
				flush();
				return;
			}
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
				setScanBuffer((prev) => prev + e.key);
				if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
				scanTimerRef.current = setTimeout(() => setScanBuffer(""), 200);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
		};
	}, [scanBuffer, submitScan]);
	const save = async () => {
		const price = Number(form.price);
		const stock = Number(form.stock);
		const compareRaw = form.compareAtPrice.trim();
		const compareAt = compareRaw ? Number(compareRaw) : null;
		if (!form.name.trim()) {
			toast.error(t("dash.form.product.requiredName"));
			return;
		}
		if (!Number.isFinite(price) || price < 0) {
			toast.error(t("dash.form.product.requiredPrice"));
			return;
		}
		if (compareAt !== null && (!Number.isFinite(compareAt) || compareAt < price)) {
			toast.error(t("dash.form.product.requiredCompare"));
			return;
		}
		if (!Number.isInteger(stock) || stock < 0) {
			toast.error(t("dash.form.product.requiredStock"));
			return;
		}
		const draft = {
			name: form.name.trim(),
			description: form.description.trim(),
			price,
			compareAtPrice: compareAt,
			stock,
			image: form.image.trim(),
			category: form.category || "accessories",
			petType: form.petType,
			featured: form.featured,
			barcode: form.barcode.trim(),
			barcodeImage: form.barcodeImage
		};
		try {
			if (product) await updateProduct(product.id, draft);
			else await createProduct(draft);
		} catch (err) {
			console.error("Failed to save product", err);
			toast.error(t("dash.toast.error"));
			return;
		}
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
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: product ? t("dash.editProduct") : t("dash.addProduct") }), /* @__PURE__ */ jsx(DialogDescription, { children: t("dash.products.hint") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.product.name"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.product.barcode"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.barcode,
								onChange: (e) => setForm({
									...form,
									barcode: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsxs(Field, {
							label: t("dash.form.product.capture"),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ jsx(ScanLine, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
										ref: scanInputRef,
										value: scanText,
										onChange: (e) => setScanText(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												submitScan(scanText);
											}
										},
										placeholder: t("dash.form.product.scanPlaceholder"),
										className: "pl-9",
										autoComplete: "off"
									})]
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "outline",
									onClick: () => submitScan(scanText),
									className: "shrink-0",
									children: t("dash.form.product.capture")
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: t("dash.form.product.captureHint")
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: t("dash.form.product.price"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 0,
									step: .01,
									value: form.price,
									onChange: (e) => setForm({
										...form,
										price: e.target.value
									})
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: t("dash.form.product.compare"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 0,
									step: .01,
									value: form.compareAtPrice,
									onChange: (e) => setForm({
										...form,
										compareAtPrice: e.target.value
									}),
									placeholder: t("dash.form.product.comparePlaceholder")
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx(Field, {
								label: t("dash.form.product.stock"),
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 0,
									step: 1,
									value: form.stock,
									onChange: (e) => setForm({
										...form,
										stock: e.target.value
									})
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: t("dash.form.product.category"),
								children: /* @__PURE__ */ jsx("select", {
									value: form.category,
									onChange: (e) => setForm({
										...form,
										category: e.target.value
									}),
									className: "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm",
									children: PRODUCT_CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
										value: c,
										children: t(`store.cat.${c}`)
									}, c))
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.product.petType"),
							children: /* @__PURE__ */ jsx("select", {
								value: form.petType,
								onChange: (e) => setForm({
									...form,
									petType: e.target.value
								}),
								className: "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm",
								children: PET_TYPES.map((p) => /* @__PURE__ */ jsx("option", {
									value: p,
									children: t(`store.pet.${p}`)
								}, p))
							})
						}),
						/* @__PURE__ */ jsxs(Field, {
							label: t("dash.form.product.image"),
							children: [
								/* @__PURE__ */ jsx(Input, {
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/gif",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										if (file.size > 4194304) {
											toast.error(t("dash.form.product.imageTooLarge"));
											return;
										}
										const reader = new FileReader();
										reader.onload = () => setForm((f) => ({
											...f,
											image: String(reader.result ?? "")
										}));
										reader.readAsDataURL(file);
									}
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: t("dash.form.product.imageHint")
								}),
								form.image && /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("img", {
										src: form.image,
										alt: "",
										className: "h-20 w-20 rounded-lg border border-border bg-muted object-contain p-1"
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => setForm((f) => ({
											...f,
											image: ""
										})),
										children: t("dash.remove")
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs(Field, {
							label: t("dash.form.product.qrCode"),
							children: [
								/* @__PURE__ */ jsx(Input, {
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/gif",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => setForm((f) => ({
											...f,
											barcodeImage: String(reader.result ?? "")
										}));
										reader.readAsDataURL(file);
									}
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: t("dash.form.product.qrHint")
								}),
								form.barcodeImage && /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("img", {
										src: form.barcodeImage,
										alt: "",
										className: "h-20 w-20 rounded-lg border border-border object-contain"
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => setForm((f) => ({
											...f,
											barcodeImage: ""
										})),
										children: t("dash.remove")
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.product.desc"),
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.featured,
								onChange: (e) => setForm({
									...form,
									featured: e.target.checked
								}),
								className: "size-4 rounded border-input accent-primary"
							}), t("dash.form.product.featured")]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: onClose,
					children: t("dash.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					children: t("dash.save")
				})] })
			]
		})
	});
}
function ProductsPanel() {
	const { t } = useI18n();
	const { products, settings, productsFailed } = useClinicStore();
	const [editing, setEditing] = useState(null);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [petType, setPetType] = useState("all");
	const { sort, toggle } = useSortState("name");
	const grid = useGrid(sortedSlice(useMemo(() => products.filter((p) => (category === "all" || p.category === category) && (petType === "all" || (p.petType ?? "both") === petType)), [
		products,
		category,
		petType
	]), sort, {
		name: (a, b) => a.name.localeCompare(b.name),
		price: (a, b) => a.price - b.price,
		stock: (a, b) => a.stock - b.stock
	}), query, [
		"name",
		"category",
		"id"
	]);
	return /* @__PURE__ */ jsxs(Card, { children: [
		productsFailed && /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-destructive/40 bg-destructive/10 px-6 py-3 text-sm text-destructive",
			children: [/* @__PURE__ */ jsx("span", { children: t("dash.errorLoad") }), /* @__PURE__ */ jsx(Button, {
				size: "sm",
				variant: "outline",
				onClick: refreshClinicData,
				children: t("dash.retry")
			})]
		}),
		/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "text-base",
				children: t("dash.products")
			}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.products.hint") })] }), /* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setEditing("new"),
				children: [
					/* @__PURE__ */ jsx(Plus, { className: "size-4" }),
					" ",
					t("dash.addProduct")
				]
			})]
		}),
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsx(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: t("dash.search")
				}),
				/* @__PURE__ */ jsxs("select", {
					value: category,
					onChange: (e) => {
						setCategory(e.target.value);
						grid.setPage(1);
					},
					className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
					"aria-label": t("dash.form.product.category"),
					children: [/* @__PURE__ */ jsx("option", {
						value: "all",
						children: t("dash.filterAll")
					}), PRODUCT_CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
						value: c,
						children: t(`store.cat.${c}`)
					}, c))]
				}),
				/* @__PURE__ */ jsxs("select", {
					value: petType,
					onChange: (e) => {
						setPetType(e.target.value);
						grid.setPage(1);
					},
					className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
					"aria-label": t("dash.form.product.petType"),
					children: [/* @__PURE__ */ jsx("option", {
						value: "all",
						children: t("dash.filterAll")
					}), PET_TYPES.map((p) => /* @__PURE__ */ jsx("option", {
						value: p,
						children: t(`store.pet.${p}`)
					}, p))]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.name"),
							active: sort.key === "name",
							dir: sort.dir,
							onToggle: () => toggle("name")
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.price"),
							active: sort.key === "price",
							dir: sort.dir,
							onToggle: () => toggle("price", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.stock"),
							active: sort.key === "stock",
							dir: sort.dir,
							onToggle: () => toggle("stock", true)
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "overflow-x-auto",
			children: [
				/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.name") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.category") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.petType") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.barcode") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.price") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.stock") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("dash.form.product.featured") }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-end",
						children: t("dash.actions")
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [p.image && /* @__PURE__ */ jsx("img", {
							src: p.image,
							alt: "",
							className: "size-10 rounded-lg border border-border bg-muted object-contain p-0.5"
						}), /* @__PURE__ */ jsx("span", {
							className: "whitespace-nowrap font-medium",
							children: p.name
						})]
					}) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: t(`store.cat.${p.category}`)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: t(`store.pet.${p.petType ?? "both"}`)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm text-muted-foreground",
						children: p.barcode ? /* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: p.barcode
						}) : "—"
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "whitespace-nowrap text-sm font-semibold",
						children: [settings.currency === "$" ? `$${p.price.toFixed(2)}` : `${settings.currency} ${p.price.toFixed(2)}`, p.compareAtPrice != null && p.compareAtPrice > p.price && /* @__PURE__ */ jsx("span", {
							className: "ml-1.5 text-xs font-normal text-muted-foreground line-through",
							children: settings.currency === "$" ? `$${p.compareAtPrice.toFixed(2)}` : `${settings.currency} ${p.compareAtPrice.toFixed(2)}`
						})]
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-sm",
						children: p.stock <= 0 ? /* @__PURE__ */ jsx(Badge, {
							className: "bg-destructive/15 text-destructive",
							children: t("store.outOfStock")
						}) : p.stock <= LOW_STOCK_THRESHOLD ? /* @__PURE__ */ jsxs(Badge, {
							className: "bg-amber-500/15 text-amber-600",
							children: [
								t("dash.lowStock"),
								" · ",
								p.stock
							]
						}) : p.stock
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 px-2",
						"aria-label": t("dash.form.product.featured"),
						onClick: async () => {
							try {
								await updateProduct(p.id, {
									...p,
									featured: !p.featured
								});
								toast.success(t("dash.toast.saved"));
							} catch (err) {
								console.error("Failed to toggle featured", err);
								toast.error(t("dash.toast.error"));
							}
						},
						children: /* @__PURE__ */ jsx(Star, { className: cn("size-4", p.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground") })
					}) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-end",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1.5",
							children: [/* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: () => setEditing(p),
								children: t("dash.edit")
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-muted-foreground hover:text-destructive",
								"aria-label": t("dash.delete"),
								onClick: async () => {
									try {
										await deleteProduct(p.id);
										toast.success(t("dash.toast.deleted"));
									} catch (err) {
										console.error("Failed to delete product", err);
										toast.error(t("dash.toast.error"));
									}
								},
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})]
						})
					})
				] }, p.id)) })] }),
				grid.slice.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: t("dash.empty")
				}),
				/* @__PURE__ */ jsx(PaginationBar, {
					total: grid.total,
					page: grid.page,
					pageSize: grid.pageSize,
					pageCount: grid.pageCount,
					onPage: grid.setPage,
					onPageSize: grid.setPageSize
				})
			]
		})] }),
		editing && /* @__PURE__ */ jsx(ProductDialog, {
			product: editing === "new" ? null : editing,
			onClose: () => setEditing(null),
			products
		})
	] });
}
// src/components/dashboard/OrdersPanel.tsx
function OrdersPanel() {
	const { t } = useI18n();
	const { orders, settings } = useClinicStore();
	const [proofOrder, setProofOrder] = useState(null);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const { sort, toggle } = useSortState("newest", "desc");
	const activeOrders = useMemo(() => orders.filter((o) => !o.archived), [orders]);
	const grid = useGrid(sortedSlice(useMemo(() => activeOrders.filter((o) => (statusFilter === "all" || o.status === statusFilter) && (paymentFilter === "all" || o.paymentStatus === paymentFilter)), [
		activeOrders,
		statusFilter,
		paymentFilter
	]), sort, {
		newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		owner: (a, b) => a.customerName.localeCompare(b.customerName),
		total: (a, b) => a.total - b.total
	}), query, [
		"customerName",
		"phone",
		"email",
		"id"
	]);
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
			className: "text-base",
			children: t("dash.orders")
		}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.orders.hint") })] }),
		/* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsx(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: t("dash.search")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsx("button", {
						onClick: () => {
							setStatusFilter(s.value);
							grid.setPage(1);
						},
						className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === s.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t(s.key)
					}, s.value))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: [
						{
							value: "all",
							key: "dash.filterAll"
						},
						{
							value: "paid",
							key: "pay.paid"
						},
						{
							value: "proof_submitted",
							key: "pay.underReview"
						},
						{
							value: "unpaid",
							key: "pay.unpaid"
						}
					].map((p) => /* @__PURE__ */ jsx("button", {
						onClick: () => {
							setPaymentFilter(p.value);
							grid.setPage(1);
						},
						className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", paymentFilter === p.value ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
						children: t(p.key)
					}, p.value))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.recent"),
							active: sort.key === "newest",
							dir: sort.dir,
							onToggle: () => toggle("newest", true)
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.owner"),
							active: sort.key === "owner",
							dir: sort.dir,
							onToggle: () => toggle("owner")
						}),
						/* @__PURE__ */ jsx(SortChip, {
							label: t("dash.sort.total"),
							active: sort.key === "total",
							dir: sort.dir,
							onToggle: () => toggle("total", true)
						})
					]
				})
			]
		}), grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "py-6 text-sm text-muted-foreground",
			children: t("dash.empty")
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: grid.slice.map((o) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border p-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: o.customerName
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									o.phone,
									" · ",
									o.email
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: o.address
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs font-mono text-muted-foreground",
								children: o.id
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "text-end",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-end gap-1.5",
									children: [
										/* @__PURE__ */ jsx(StatusBadge, { status: o.status }),
										/* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: "border-transparent bg-primary/10 text-primary",
											children: t(`checkout.method.${o.paymentMethod}.short`)
										}),
										o.paymentStatus === "paid" ? /* @__PURE__ */ jsx(Badge, {
											className: "border-transparent bg-success/15 text-success",
											children: t("pay.paid")
										}) : o.paymentStatus === "proof_submitted" ? /* @__PURE__ */ jsx(Badge, {
											className: "border-transparent bg-amber-500/15 text-amber-600",
											children: t("pay.underReview")
										}) : /* @__PURE__ */ jsx(Badge, {
											className: "border-transparent bg-muted text-muted-foreground",
											children: t("pay.unpaid")
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-lg font-bold",
									children: settings.currency === "$" ? `$${o.total.toFixed(2)}` : `${settings.currency} ${o.total.toFixed(2)}`
								}),
								o.paymentRef && /* @__PURE__ */ jsxs("p", {
									className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
									children: [
										t("track.fawryRef"),
										": ",
										o.paymentRef
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: o.items.map((item) => /* @__PURE__ */ jsxs("span", {
							className: "rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs",
							children: [
								item.name,
								" × ",
								item.qty
							]
						}, `${o.id}-${item.id}`))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							o.paymentStatus !== "paid" && o.paymentMethod !== "cash" && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 border-success/30 text-success hover:bg-success/10 hover:text-success",
								onClick: async () => {
									await setOrderPaymentStatus(o.id, "paid");
									toast.success(t("dash.toast.paid"));
								},
								children: t("dash.markPaid")
							}),
							o.paymentStatus === "proof_submitted" && (o.proofImage || o.paymentRef) && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: () => setProofOrder(o),
								children: t("dash.viewProof")
							}),
							o.status === "pending" && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: async () => {
									await setOrderStatus(o.id, "confirmed");
									toast.success(t("dash.toast.saved"));
								},
								children: t("dash.confirmRow")
							}),
							o.status !== "completed" && o.status !== "cancelled" && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7",
								onClick: async () => {
									await setOrderStatus(o.id, "completed");
									toast.success(t("dash.toast.completed"));
								},
								children: t("dash.complete")
							}),
							o.status !== "cancelled" && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 text-muted-foreground hover:text-destructive",
								onClick: async () => {
									await setOrderStatus(o.id, "cancelled");
									toast.success(t("dash.toast.saved"));
								},
								children: t("dash.cancelRow")
							}),
							(o.status === "completed" || o.status === "cancelled") && /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-muted-foreground hover:text-foreground",
								"aria-label": t("dash.archive"),
								title: t("dash.archive"),
								onClick: async () => {
									await archiveOrder(o.id, true);
									toast.success(t("dash.toast.archived"));
								},
								children: /* @__PURE__ */ jsx(Archive, { className: "size-3.5" })
							}),
							/* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-muted-foreground hover:text-destructive",
								"aria-label": t("dash.delete"),
								onClick: async () => {
									await deleteOrder(o.id);
									toast.success(t("dash.toast.deleted"));
								},
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})
						]
					})
				]
			}, o.id))
		}), /* @__PURE__ */ jsx(PaginationBar, {
			total: grid.total,
			page: grid.page,
			pageSize: grid.pageSize,
			pageCount: grid.pageCount,
			onPage: grid.setPage,
			onPageSize: grid.setPageSize
		})] })] }),
		/* @__PURE__ */ jsx(Dialog, {
			open: Boolean(proofOrder),
			onOpenChange: (open) => !open && setProofOrder(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: t("dash.paymentProof") }), /* @__PURE__ */ jsx(DialogDescription, { children: proofOrder?.id })] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3",
						children: [proofOrder?.paymentRef && /* @__PURE__ */ jsxs("p", {
							className: "rounded-xl bg-muted/50 px-4 py-2.5 font-mono text-sm",
							children: [
								t("checkout.refNumber"),
								": ",
								proofOrder.paymentRef
							]
						}), proofOrder?.proofImage ? /* @__PURE__ */ jsx("a", {
							href: proofOrder.proofImage,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ jsx("img", {
								src: proofOrder.proofImage,
								alt: t("track.proofImageAlt"),
								className: "max-h-96 w-full rounded-xl border border-border object-cover"
							})
						}) : /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: t("dash.noImage")
						})]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setProofOrder(null),
						children: t("dash.close")
					}), proofOrder && proofOrder.paymentStatus !== "paid" && /* @__PURE__ */ jsx(Button, {
						onClick: async () => {
							await setOrderPaymentStatus(proofOrder.id, "paid");
							toast.success(t("dash.toast.paid"));
							setProofOrder(null);
						},
						children: t("dash.markPaid")
					})] })
				]
			})
		})
	] });
}
// src/components/dashboard/ReviewsPanel.tsx
function ReviewsPanel() {
	const { t } = useI18n();
	const { products, reviews } = useClinicStore();
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const grid = useGrid(useMemo(() => reviews.filter((r) => statusFilter === "all" || r.status === statusFilter), [reviews, statusFilter]), query, [
		"author",
		"comment",
		"productId"
	]);
	const pending = grid.slice.filter((r) => r.status === "pending");
	const approved = grid.slice.filter((r) => r.status === "approved");
	const productName = (productId) => products.find((product) => product.id === productId)?.name ?? productId;
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
		className: "text-base",
		children: t("dash.reviews")
	}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.reviews.hint") })] }), /* @__PURE__ */ jsxs(CardContent, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ jsx(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: t("dash.search")
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2",
				children: [
					{
						value: "all",
						key: "dash.filterAll"
					},
					{
						value: "pending",
						key: "dash.reviews.pending"
					},
					{
						value: "approved",
						key: "dash.reviews.approved"
					},
					{
						value: "rejected",
						key: "dash.reviews.rejected"
					}
				].map((s) => /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setStatusFilter(s.value);
						grid.setPage(1);
					},
					className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === s.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"),
					children: t(s.key)
				}, s.value))
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				pending.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
					className: "mb-3 flex items-center gap-2 text-sm font-bold",
					children: [t("dash.reviews.pending"), /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600",
						children: pending.length
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: pending.map((r) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border p-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold",
									children: r.author
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: r.productId === "clinic" ? t("reviews.googleSource") : productName(r.productId)
									}), r.productId === "clinic" && /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "ms-1 text-[10px] px-1.5 py-0 align-middle",
										children: t("reviews.badge.google")
									})]
								})] }), /* @__PURE__ */ jsx("span", {
									className: "flex gap-0.5",
									children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(Star, { className: cn("size-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-border") }, i))
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: r.comment
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsx(Button, {
									size: "sm",
									className: "h-7",
									onClick: async () => {
										await setReviewStatus(r.id, "approved");
										toast.success(t("dash.toast.saved"));
									},
									children: t("dash.reviews.approve")
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 px-2 text-muted-foreground hover:text-destructive",
									"aria-label": t("dash.delete"),
									onClick: async () => {
										await deleteReview(r.id);
										toast.success(t("dash.toast.deleted"));
									},
									children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
								})]
							})
						]
					}, r.id))
				})] }),
				approved.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
					className: "mb-3 flex items-center gap-2 text-sm font-bold",
					children: [t("dash.reviews.approved"), /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-600",
						children: approved.length
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: approved.map((r) => /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold",
									children: [r.author, r.productId !== "clinic" && /* @__PURE__ */ jsxs("span", {
										className: "font-normal text-muted-foreground",
										children: ["— ", productName(r.productId)]
									})]
								}),
								r.productId === "clinic" && /* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: t("reviews.googleSource")
								}),
								r.productId !== "clinic" && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: r.comment
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "flex gap-0.5",
								children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(Star, { className: cn("size-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-border") }, i))
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-muted-foreground hover:text-destructive",
								"aria-label": t("dash.delete"),
								onClick: async () => {
									await deleteReview(r.id);
									toast.success(t("dash.toast.deleted"));
								},
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})]
						})]
					}, r.id))
				})] }),
				approved.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "py-4 text-sm text-muted-foreground",
					children: t("dash.empty")
				})
			]
		}),
		/* @__PURE__ */ jsx(PaginationBar, {
			total: grid.total,
			page: grid.page,
			pageSize: grid.pageSize,
			pageCount: grid.pageCount,
			onPage: grid.setPage,
			onPageSize: grid.setPageSize
		})
	] })] });
}
// src/components/dashboard/WorkdaysPanel.tsx
function formatDayName(dateISO, lang) {
	if (!dateISO) return "—";
	const d = /* @__PURE__ */ new Date(`${dateISO}T00:00:00`);
	if (Number.isNaN(d.getTime())) return dateISO;
	return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function dayCountsLine(t, bookings, orders, payments) {
	const part = (n, one, many) => n === 1 ? t(one) : t(many, { n: String(n) });
	return [
		part(bookings, "workdays.counts.apptOne", "workdays.counts.apptMany"),
		part(orders, "workdays.counts.orderOne", "workdays.counts.orderMany"),
		part(payments, "workdays.counts.payOne", "workdays.counts.payMany")
	].join(" · ");
}
function clock(iso, lang) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleTimeString(lang === "ar" ? "ar" : "en-US", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function WorkdaysPanel() {
	const { t, tOr, lang } = useI18n();
	const { workDays, workDay, settings } = useClinicStore();
	const [openDay, setOpenDay] = useState(null);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (openDay) loadWorkDay(openDay).catch(() => void 0);
		else loadWorkDays().catch(() => void 0);
	}, [openDay]);
	const restoreBooking = async (id) => {
		if (busy) return;
		setBusy(true);
		try {
			await archiveBooking(id, false);
			toast.success(t("dash.toast.restored"));
			await Promise.all([loadWorkDay(openDay), refreshClinicData()]);
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	const restoreOrder = async (id) => {
		if (busy) return;
		setBusy(true);
		try {
			await archiveOrder(id, false);
			toast.success(t("dash.toast.restored"));
			await Promise.all([loadWorkDay(openDay), refreshClinicData()]);
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	if (openDay && workDay) {
		const hasAnything = workDay.bookings.length > 0 || workDay.orders.length > 0 || workDay.payments.length > 0 || workDay.logs.length > 0;
		const sessionLine = workDay.session ? workDay.session.endedAt ? t("workdays.sessionRange", {
			from: clock(workDay.session.startedAt, lang),
			to: clock(workDay.session.endedAt, lang)
		}) : t("workdays.sessionOpen") : t("workdays.noSession");
		return /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
						className: "flex items-center gap-2 text-base font-bold",
						children: [/* @__PURE__ */ jsx(FolderOpen, { className: "size-4 text-primary" }), formatDayName(workDay.date, lang)]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: sessionLine
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 text-sm",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs text-muted-foreground",
								children: t("workdays.revenue")
							}), /* @__PURE__ */ jsx("span", {
								className: "font-bold",
								children: formatMoney(workDay.orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0), settings.currency)
							})] }),
							/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs text-muted-foreground",
								children: t("workdays.paymentsReceived")
							}), /* @__PURE__ */ jsx("span", {
								className: "font-bold",
								children: formatMoney(workDay.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0), settings.currency)
							})] }),
							/* @__PURE__ */ jsxs(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setOpenDay(null),
								children: [
									/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4 rtl:rotate-180" }),
									" ",
									t("workdays.back")
								]
							})
						]
					})]
				}),
				!hasAnything && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", {
					className: "py-6 text-sm text-muted-foreground",
					children: t("workdays.noActivity")
				}) }) }),
				workDay.bookings.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [
						/* @__PURE__ */ jsx(CalendarDays, { className: "size-4" }),
						" ",
						t("workdays.appointments"),
						/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "text-muted-foreground",
							children: workDay.bookings.length
						})
					]
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: workDay.bookings.map((r) => /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border border-border p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold",
									children: [
										r.time,
										" · ",
										r.ownerName
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
										r.doctorName
									]
								}),
								r.symptoms && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: r.symptoms
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(StatusBadge, { status: r.status }),
									r.archived && /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "border-transparent bg-muted",
										children: t("archive.title")
									}),
									r.archived && /* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7",
										disabled: busy,
										onClick: () => restoreBooking(r.id),
										children: [
											/* @__PURE__ */ jsx(ArchiveRestore, { className: "size-3.5" }),
											" ",
											t("workdays.restore")
										]
									})
								]
							})]
						})
					}, r.id))
				}) })] }),
				workDay.orders.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [
						/* @__PURE__ */ jsx(Package, { className: "size-4" }),
						" ",
						t("workdays.sales"),
						/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "text-muted-foreground",
							children: workDay.orders.length
						})
					]
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: workDay.orders.map((o) => /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border border-border p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold",
									children: [
										o.customerName,
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[11px] font-normal text-muted-foreground",
											children: o.id
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: o.items.map((it) => `${it.name} ×${it.qty}`).join(", ")
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm font-bold",
									children: formatMoney(o.total, settings.currency)
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(PaymentMethodBadge, { method: o.paymentMethod }),
									/* @__PURE__ */ jsx(PaymentStatusBadge, { status: o.paymentStatus === "paid" ? "paid" : "unpaid" }),
									/* @__PURE__ */ jsx(StatusBadge, { status: o.status }),
									o.archived && /* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7",
										disabled: busy,
										onClick: () => restoreOrder(o.id),
										children: [
											/* @__PURE__ */ jsx(ArchiveRestore, { className: "size-3.5" }),
											" ",
											t("workdays.restore")
										]
									})
								]
							})]
						})
					}, o.id))
				}) })] }),
				workDay.payments.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [
						/* @__PURE__ */ jsx(Banknote, { className: "size-4" }),
						" ",
						t("workdays.payments"),
						/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "text-muted-foreground",
							children: workDay.payments.length
						})
					]
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: workDay.payments.map((p) => /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border border-border p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold",
								children: p.title
							}), p.notes && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: p.notes
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold",
										children: formatMoney(p.amount, settings.currency)
									}),
									/* @__PURE__ */ jsx(PaymentMethodBadge, { method: p.method }),
									/* @__PURE__ */ jsx(PaymentStatusBadge, { status: p.status })
								]
							})]
						})
					}, p.id))
				}) })] }),
				workDay.logs.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [
						/* @__PURE__ */ jsx(History, { className: "size-4" }),
						" ",
						t("workdays.activity")
					]
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, {
							className: "w-44",
							children: t("logs.time")
						}),
						/* @__PURE__ */ jsx(TableHead, {
							className: "w-52",
							children: t("logs.action")
						}),
						/* @__PURE__ */ jsx(TableHead, { children: t("logs.detail") })
					] }) }), /* @__PURE__ */ jsx(TableBody, { children: workDay.logs.map((log) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "whitespace-nowrap text-xs text-muted-foreground",
							children: formatTime(log.createdAt, lang)
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "border-transparent bg-muted text-foreground",
							children: tOr(`logs.action.${log.action}`, log.action)
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-sm text-muted-foreground",
							children: log.detail
						})
					] }, log.id)) })] })
				}) })] })
			]
		});
	}
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [
			/* @__PURE__ */ jsx(FolderOpen, { className: "size-4" }),
			" ",
			t("dash.workdays")
		]
	}) }), /* @__PURE__ */ jsx(CardContent, { children: workDays.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "py-6 text-sm text-muted-foreground",
		children: t("workdays.noDays")
	}) : /* @__PURE__ */ jsx("div", {
		className: "space-y-3",
		children: workDays.map((d) => /* @__PURE__ */ jsxs("button", {
			onClick: () => setOpenDay(d.date),
			className: "flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 text-start transition-colors hover:bg-card/60",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid size-10 place-items-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(CalendarDays, { className: "size-5" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-bold",
					children: formatDayName(d.date, lang)
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: d.session ? d.session.endedAt ? t("workdays.sessionRange", {
						from: clock(d.session.startedAt, lang),
						to: clock(d.session.endedAt, lang)
					}) : t("workdays.sessionOpen") : t("workdays.noSession")
				})] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-end",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold",
						children: formatMoney(d.revenue, settings.currency)
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: dayCountsLine(t, d.bookings, d.orders, d.payments)
					})]
				}), /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 text-muted-foreground rtl:rotate-180" })]
			})]
		}, d.date))
	}) })] });
}
// src/components/dashboard/LogsPanel.tsx
function LogsPanel() {
	const { t, tOr, lang } = useI18n();
	const { auditLogs } = useClinicStore();
	const [query, setQuery] = useState("");
	const [actionFilter, setActionFilter] = useState("all");
	useEffect(() => {
		loadAuditLogs().catch(() => void 0);
	}, []);
	const grid = useGrid(useMemo(() => auditLogs.filter((l) => actionFilter === "all" || l.action === actionFilter), [auditLogs, actionFilter]), query, [
		"detail",
		"target",
		"action"
	]);
	const actionOptions = useMemo(() => Array.from(new Set(auditLogs.map((l) => l.action))).sort(), [auditLogs]);
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsxs(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [
			/* @__PURE__ */ jsx(History, { className: "size-4" }),
			" ",
			t("logs.title")
		]
	}), /* @__PURE__ */ jsx(CardDescription, { children: t("logs.desc") })] }), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex flex-wrap items-center gap-3",
		children: [/* @__PURE__ */ jsx(SearchBox, {
			value: query,
			onChange: setQuery,
			placeholder: t("dash.search")
		}), /* @__PURE__ */ jsxs("select", {
			value: actionFilter,
			onChange: (e) => {
				setActionFilter(e.target.value);
				grid.setPage(1);
			},
			className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground",
			"aria-label": t("logs.action"),
			children: [/* @__PURE__ */ jsx("option", {
				value: "all",
				children: t("dash.filterAll")
			}), actionOptions.map((a) => /* @__PURE__ */ jsx("option", {
				value: a,
				children: tOr(`logs.action.${a}`, a)
			}, a))]
		})]
	}), grid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "py-6 text-sm text-muted-foreground",
		children: t("logs.empty")
	}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableHead, {
				className: "w-44",
				children: t("logs.time")
			}),
			/* @__PURE__ */ jsx(TableHead, {
				className: "w-52",
				children: t("logs.action")
			}),
			/* @__PURE__ */ jsx(TableHead, {
				className: "w-40",
				children: t("logs.entity")
			}),
			/* @__PURE__ */ jsx(TableHead, { children: t("logs.detail") })
		] }) }), /* @__PURE__ */ jsx(TableBody, { children: grid.slice.map((log) => /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableCell, {
				className: "whitespace-nowrap text-xs text-muted-foreground",
				children: formatTime(log.createdAt, lang)
			}),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
				variant: "outline",
				className: "border-transparent bg-muted text-foreground",
				children: tOr(`logs.action.${log.action}`, log.action)
			}) }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "text-sm text-muted-foreground",
				children: log.target
			}),
			/* @__PURE__ */ jsx(TableCell, {
				className: "text-sm text-muted-foreground",
				children: log.detail
			})
		] }, log.id)) })] })
	}), /* @__PURE__ */ jsx(PaginationBar, {
		total: grid.total,
		page: grid.page,
		pageSize: grid.pageSize,
		pageCount: grid.pageCount,
		onPage: grid.setPage,
		onPageSize: grid.setPageSize
	})] })] })] });
}
// src/components/dashboard/RecruitmentPanel.tsx
var DEFAULT_EMPLOYEE = {
	fullName: "",
	email: "",
	phone: "",
	role: "staff",
	payRateType: "hourly",
	hourlyRate: "0",
	monthlySalary: "0",
	roleHoursPerDay: "8",
	commissionRates: "{}",
	isActive: true
};
var DEFAULT_ACCOUNT = {
	username: "",
	password: "",
	role: "staff"
};
function RecruitmentPanel() {
	const { t } = useI18n();
	const [employeeForm, setEmployeeForm] = useState(DEFAULT_EMPLOYEE);
	const [accountForm, setAccountForm] = useState(DEFAULT_ACCOUNT);
	const [employeeLoading, setEmployeeLoading] = useState(false);
	const [accountLoading, setAccountLoading] = useState(false);
	const handleEmployeeChange = (field, value) => {
		setEmployeeForm((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleAccountChange = (field, value) => {
		setAccountForm((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const createEmployee = async () => {
		if (!employeeForm.fullName.trim() || !employeeForm.email.trim()) {
			toast.error(t("dash.recruitment.error"));
			return;
		}
		setEmployeeLoading(true);
		try {
			const body = {
				fullName: employeeForm.fullName.trim(),
				email: employeeForm.email.trim(),
				phone: employeeForm.phone.trim() || null,
				role: employeeForm.role,
				payRateType: employeeForm.payRateType,
				hourlyRate: Number.parseFloat(employeeForm.hourlyRate) || 0,
				monthlySalary: Number.parseFloat(employeeForm.monthlySalary) || 0,
				roleHoursPerDay: Number.parseInt(employeeForm.roleHoursPerDay, 10) || 8,
				commissionRates: JSON.parse(employeeForm.commissionRates || "{}"),
				isActive: employeeForm.isActive
			};
			await api.post("/api/employees", body);
			toast.success(t("dash.recruitment.employeeCreated"));
			setEmployeeForm(DEFAULT_EMPLOYEE);
		} catch (err) {
			console.error("Error creating employee:", err);
			toast.error(t("dash.recruitment.error"));
		} finally {
			setEmployeeLoading(false);
		}
	};
	const createAccount = async () => {
		if (!accountForm.username.trim() || !accountForm.password.trim()) {
			toast.error(t("dash.recruitment.error"));
			return;
		}
		if (accountForm.password.length < 6) {
			toast.error(t("auth.passTooShort"));
			return;
		}
		setAccountLoading(true);
		try {
			await api.post("/api/auth/accounts", {
				username: accountForm.username.trim().toLowerCase(),
				password: accountForm.password,
				role: accountForm.role
			});
			toast.success(t("dash.recruitment.accountCreated"));
			setAccountForm(DEFAULT_ACCOUNT);
		} catch (err) {
			console.error("Error creating account:", err);
			toast.error(t("dash.recruitment.error"));
		} finally {
			setAccountLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "w-full",
		children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsxs(CardTitle, {
			className: "flex items-center gap-2 text-base",
			children: [/* @__PURE__ */ jsx(UserPlus, { className: "size-4 text-muted-foreground" }), t("dash.recruitment")]
		}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.recruitmentDesc") })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "employee",
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "grid w-full grid-cols-2",
					children: [/* @__PURE__ */ jsx(TabsTrigger, {
						value: "employee",
						children: t("dash.recruitment.employee")
					}), /* @__PURE__ */ jsx(TabsTrigger, {
						value: "account",
						children: t("dash.recruitment.account")
					})]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "employee",
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: t("dash.recruitment.employeeDesc")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "fullName",
										children: t("dash.recruitment.fullName")
									}), /* @__PURE__ */ jsx(Input, {
										id: "fullName",
										value: employeeForm.fullName,
										onChange: (e) => handleEmployeeChange("fullName", e.target.value),
										placeholder: "e.g., Dr. Ahmed Hassan"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "email",
										children: t("dash.recruitment.email")
									}), /* @__PURE__ */ jsx(Input, {
										id: "email",
										type: "email",
										value: employeeForm.email,
										onChange: (e) => handleEmployeeChange("email", e.target.value),
										placeholder: "ahmed@pawm.com"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "phone",
										children: t("dash.recruitment.phone")
									}), /* @__PURE__ */ jsx(Input, {
										id: "phone",
										value: employeeForm.phone,
										onChange: (e) => handleEmployeeChange("phone", e.target.value),
										placeholder: "+20 10 1234 5678"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "role",
										children: t("dash.recruitment.role")
									}), /* @__PURE__ */ jsxs(Select, {
										value: employeeForm.role,
										onValueChange: (v) => handleEmployeeChange("role", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											id: "role",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("dash.recruitment.role") })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "staff",
												children: t("auth.role.staff")
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "payroll",
												children: t("auth.role.payroll")
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "admin",
												children: t("auth.role.admin")
											})
										] })]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: t("dash.recruitment.payRateType")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "payRateType",
										children: t("dash.recruitment.payRateType")
									}), /* @__PURE__ */ jsxs(Select, {
										value: employeeForm.payRateType,
										onValueChange: (v) => handleEmployeeChange("payRateType", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											id: "payRateType",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("dash.recruitment.payRateType") })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
											value: "hourly",
											children: t("dash.recruitment.hourly")
										}), /* @__PURE__ */ jsx(SelectItem, {
											value: "monthly",
											children: t("dash.recruitment.monthly")
										})] })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									style: { display: employeeForm.payRateType === "hourly" ? "grid" : "none" },
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "hourlyRate",
										children: t("dash.recruitment.hourlyRate")
									}), /* @__PURE__ */ jsx(Input, {
										id: "hourlyRate",
										type: "number",
										min: "0",
										step: "0.01",
										value: employeeForm.hourlyRate,
										onChange: (e) => handleEmployeeChange("hourlyRate", e.target.value),
										placeholder: "50"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									style: { display: employeeForm.payRateType === "monthly" ? "grid" : "none" },
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "monthlySalary",
										children: t("dash.recruitment.monthlySalary")
									}), /* @__PURE__ */ jsx(Input, {
										id: "monthlySalary",
										type: "number",
										min: "0",
										step: "0.01",
										value: employeeForm.monthlySalary,
										onChange: (e) => handleEmployeeChange("monthlySalary", e.target.value),
										placeholder: "5000"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "roleHoursPerDay",
										children: t("dash.recruitment.roleHoursPerDay")
									}), /* @__PURE__ */ jsx(Input, {
										id: "roleHoursPerDay",
										type: "number",
										min: "1",
										max: "24",
										value: employeeForm.roleHoursPerDay,
										onChange: (e) => handleEmployeeChange("roleHoursPerDay", e.target.value),
										placeholder: "8"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2 sm:col-span-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "commissionRates",
										children: t("dash.recruitment.commissionRates")
									}), /* @__PURE__ */ jsx(Textarea, {
										id: "commissionRates",
										rows: 3,
										value: employeeForm.commissionRates,
										onChange: (e) => handleEmployeeChange("commissionRates", e.target.value),
										placeholder: "{\"consultation\": 10, \"surgery\": 15}",
										className: "font-mono text-sm"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								id: "isActive",
								checked: employeeForm.isActive,
								onChange: (e) => handleEmployeeChange("isActive", e.target.checked),
								className: "h-4 w-4 rounded border-border text-primary focus:ring-primary"
							}), /* @__PURE__ */ jsx(Label, {
								htmlFor: "isActive",
								className: "cursor-pointer text-sm",
								children: t("dash.recruitment.isActive")
							})]
						}),
						/* @__PURE__ */ jsx(Button, {
							onClick: createEmployee,
							disabled: employeeLoading,
							className: "w-full sm:w-auto",
							children: employeeLoading ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), t("dash.saving")] }) : t("dash.recruitment.createEmployee")
						})
					]
				}),
				/* @__PURE__ */ jsxs(TabsContent, {
					value: "account",
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: t("dash.recruitment.accountDesc")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "username",
										children: t("dash.recruitment.username")
									}), /* @__PURE__ */ jsx(Input, {
										id: "username",
										value: accountForm.username,
										onChange: (e) => handleAccountChange("username", e.target.value),
										placeholder: "e.g., dr.ahmed",
										minLength: 3,
										autoComplete: "username"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "role",
										children: t("dash.recruitment.role")
									}), /* @__PURE__ */ jsxs(Select, {
										value: accountForm.role,
										onValueChange: (v) => handleAccountChange("role", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											id: "role",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("dash.recruitment.role") })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "staff",
												children: t("auth.role.staff")
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "payroll",
												children: t("auth.role.payroll")
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "admin",
												children: t("auth.role.admin")
											})
										] })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2 sm:col-span-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "password",
										children: t("dash.recruitment.password")
									}), /* @__PURE__ */ jsx(Input, {
										id: "password",
										type: "password",
										value: accountForm.password,
										onChange: (e) => handleAccountChange("password", e.target.value),
										placeholder: "••••••••",
										minLength: 6,
										autoComplete: "new-password"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							onClick: createAccount,
							disabled: accountLoading,
							className: "w-full sm:w-auto",
							children: accountLoading ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), t("dash.saving")] }) : t("dash.recruitment.createAccount")
						})
					]
				})
			]
		}) })]
	});
}
// src/lib/use-notification-sound.ts
function createNotificationSound() {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
	oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + .15);
	oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + .3);
	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(.3, audioContext.currentTime + .01);
	gainNode.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .35);
	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + .4);
	return audioContext;
}
function useNotificationSound({ enabled = true, interval = 3e4, getCount, onNewItems }) {
	const prevCountRef = useRef(getCount());
	const isFirstCheck = useRef(true);
	const audioContextRef = useRef(null);
	const playSound = useCallback(() => {
		try {
			if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume();
			createNotificationSound();
		} catch {}
	}, []);
	useEffect(() => {
		if (!enabled) return;
		const checkForUpdates = () => {
			if (!enabled) return;
			const currentCount = getCount();
			if (!isFirstCheck.current && currentCount > prevCountRef.current) {
				playSound();
				onNewItems?.(currentCount, prevCountRef.current);
			}
			prevCountRef.current = currentCount;
			isFirstCheck.current = false;
		};
		checkForUpdates();
		const id = setInterval(checkForUpdates, interval);
		const ctx = audioContextRef.current;
		return () => {
			clearInterval(id);
			if (ctx) ctx.close().catch(() => {});
		};
	}, [
		enabled,
		interval,
		getCount,
		onNewItems,
		playSound
	]);
	return { play: playSound };
}
// src/components/dashboard/dashboard-shared.tsx
function StatCard({ label, value, icon: Icon, tone, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md", className),
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ jsx("p", {
					className: "text-2xl font-bold tabular-nums tracking-tight",
					children: value
				})]
			}), /* @__PURE__ */ jsx("span", {
				className: cn("grid size-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110", tone ?? "bg-primary/10 text-primary"),
				children: /* @__PURE__ */ jsx(Icon, { className: "size-5" })
			})]
		})
	});
}
function OverviewCard({ title, description, action, children, empty }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-border bg-card",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-border px-5 py-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-sm font-semibold",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: description
			})] }), action]
		}), /* @__PURE__ */ jsx("div", {
			className: "p-5",
			children
		})]
	});
}
// src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
// src/components/ui/tooltip.tsx
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
// src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
// src/components/ui/scroll-area.tsx
var ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(ScrollAreaPrimitive.Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ jsx(ScrollBar, {}),
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
	]
}));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
// src/components/dashboard/dashboard-nav.ts
var NAV_GROUPS = [
	{
		label: "nav.group.main",
		items: [
			{
				id: "overview",
				icon: LayoutDashboard,
				roles: ["all"]
			},
			{
				id: "requests",
				icon: ListChecks,
				roles: ["all"]
			},
			{
				id: "reservations",
				icon: CalendarCheck,
				roles: [
					"staff",
					"payroll",
					"admin"
				]
			}
		]
	},
	{
		label: "nav.group.team",
		items: [
			{
				id: "staff-overview",
				icon: Users,
				roles: ["admin"]
			},
			{
				id: "payroll",
				icon: Banknote,
				roles: ["payroll", "admin"]
			},
			{
				id: "finance",
				icon: Wallet,
				roles: ["payroll", "admin"]
			},
			{
				id: "clients",
				icon: Users,
				roles: ["payroll", "admin"]
			}
		]
	},
	{
		label: "nav.group.clinic",
		items: [
			{
				id: "doctors",
				icon: Stethoscope,
				roles: ["payroll", "admin"]
			},
			{
				id: "services",
				icon: HeartPulse,
				roles: ["payroll", "admin"]
			},
			{
				id: "prescriptions",
				icon: FileText,
				roles: [
					"staff",
					"payroll",
					"admin"
				]
			}
		]
	},
	{
		label: "nav.group.store",
		items: [
			{
				id: "products",
				icon: ShoppingBag,
				roles: ["payroll", "admin"]
			},
			{
				id: "orders",
				icon: Package,
				roles: ["payroll", "admin"]
			},
			{
				id: "reviews",
				icon: MessageSquareText,
				roles: ["payroll", "admin"]
			}
		]
	},
	{
		label: "nav.group.data",
		items: [
			{
				id: "workdays",
				icon: FolderOpen,
				roles: ["payroll", "admin"]
			},
			{
				id: "archive",
				icon: Archive,
				roles: ["payroll", "admin"]
			},
			{
				id: "logs",
				icon: History,
				roles: ["admin"]
			}
		]
	},
	{
		label: "nav.group.system",
		items: [{
			id: "settings",
			icon: Settings,
			roles: ["admin"]
		}]
	},
	{
		label: "nav.group.recruitment",
		items: [{
			id: "recruitment",
			icon: UserPlus,
			roles: ["admin"]
		}]
	}
];
var ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
// src/components/dashboard/DashboardSidebar.tsx
function NavBadge({ item }) {
	const store = useClinicStore();
	let count = 0;
	if (item.id === "requests") count = store.requests.filter((r) => !r.archived && r.status === "pending").length;
	else if (item.id === "orders") count = store.orders.filter((o) => !o.archived).length;
	else if (item.id === "reviews") count = store.reviews.filter((r) => r.status === "pending").length;
	if (count <= 0) return null;
	return /* @__PURE__ */ jsx("span", {
		className: "ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
		children: count > 99 ? "99+" : count
	});
}
function DashboardSidebar({ activeTab, onTabChange, canAccess, collapsed, onToggleCollapse }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs("aside", {
		className: cn("sticky top-0 flex h-screen shrink-0 flex-col border-e border-border bg-card/80 backdrop-blur-xl transition-[width] duration-300 ease-[var(--ease-entrance)]", collapsed ? "w-[68px]" : "w-60"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex h-14 shrink-0 items-center gap-2 border-b border-border px-4",
			children: [
				/* @__PURE__ */ jsx(PawMMark, { className: "size-7 text-primary" }),
				!collapsed && /* @__PURE__ */ jsx("span", {
					className: "text-lg font-bold tracking-[-0.03em] text-foreground",
					children: "Paw-M"
				}),
				/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					className: "ms-auto size-7 shrink-0 text-muted-foreground hover:text-foreground",
					onClick: onToggleCollapse,
					"aria-label": collapsed ? t("dash.expandSidebar") : t("dash.collapseSidebar"),
					children: collapsed ? /* @__PURE__ */ jsx(PanelLeftOpen, { className: "size-4" }) : /* @__PURE__ */ jsx(PanelLeftClose, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ jsx(ScrollArea, {
			className: "flex-1 py-2",
			children: /* @__PURE__ */ jsx("nav", {
				className: "space-y-4 px-2.5",
				children: NAV_GROUPS.map((group) => {
					const visible = group.items.filter((item) => canAccess(item.id));
					if (visible.length === 0) return null;
					return /* @__PURE__ */ jsxs("div", { children: [!collapsed && /* @__PURE__ */ jsx("p", {
						className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60",
						children: t(group.label)
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-0.5",
						children: visible.map((item) => /* @__PURE__ */ jsx(NavItemButton, {
							item,
							active: activeTab === item.id,
							collapsed,
							onClick: () => onTabChange(item.id)
						}, item.id))
					})] }, group.label);
				})
			})
		})]
	});
}
function NavItemButton({ item, active, collapsed, onClick }) {
	const { t } = useI18n();
	const Icon = item.icon;
	const content = /* @__PURE__ */ jsxs("button", {
		onClick,
		className: cn("group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200", collapsed && "justify-center px-0", active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
		children: [
			active && /* @__PURE__ */ jsx("span", { className: "absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-primary" }),
			/* @__PURE__ */ jsx(Icon, { className: cn("shrink-0 transition-colors", collapsed ? "size-5" : "size-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground") }),
			!collapsed && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "truncate",
				children: t(`dash.${item.id}`)
			}), /* @__PURE__ */ jsx(NavBadge, { item })] })
		]
	});
	if (collapsed) return /* @__PURE__ */ jsxs(Tooltip, {
		delayDuration: 0,
		children: [/* @__PURE__ */ jsx(TooltipTrigger, {
			asChild: true,
			children: content
		}), /* @__PURE__ */ jsx(TooltipContent, {
			side: "right",
			sideOffset: 8,
			children: t(`dash.${item.id}`)
		})]
	});
	return content;
}
// src/components/dashboard/NotificationBell.tsx
var POLL_INTERVAL = 3e4;
var TYPE_ICON = {
	payroll: DollarSign,
	task: ListChecks,
	system: Check,
	approval: Check,
	broadcast: Bell,
	order: ShoppingBag,
	booking: CalendarCheck
};
function NotificationBell() {
	const { t, lang } = useI18n();
	const [notifications, setNotifications] = useState([]);
	const [open, setOpen] = useState(false);
	const fetchNotifications = useCallback(async () => {
		try {
			const res = await api.get("/notifications/me");
			setNotifications(Array.isArray(res) ? res : res?.data ?? []);
		} catch {}
	}, []);
	useEffect(() => {
		let timer;
		const start = () => {
			if (timer === void 0) timer = setInterval(fetchNotifications, POLL_INTERVAL);
		};
		const stop = () => {
			if (timer !== void 0) {
				clearInterval(timer);
				timer = void 0;
			}
		};
		const onVisibilityChange = () => {
			if (document.hidden) stop();
			else {
				fetchNotifications();
				start();
			}
		};
		fetchNotifications();
		start();
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => {
			stop();
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [fetchNotifications]);
	const unreadCount = notifications.filter((n) => !n.isRead).length;
	const markAsRead = async (id) => {
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			isRead: true
		} : n));
		try {
			await api.patch(`/notifications/${id}/read`);
			fetchNotifications();
		} catch {}
	};
	const markAllAsRead = async () => {
		setNotifications((prev) => prev.map((n) => ({
			...n,
			isRead: true
		})));
		try {
			await Promise.all(notifications.map((n) => api.patch(`/notifications/${n.id}/read`)));
			fetchNotifications();
		} catch {}
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "icon",
				className: "relative size-8 text-muted-foreground hover:text-foreground",
				"aria-label": t("dash.notifications"),
				title: t("dash.notifications"),
				children: [/* @__PURE__ */ jsx(Bell, { className: "size-4" }), unreadCount > 0 && /* @__PURE__ */ jsx(Badge, {
					className: "absolute -end-1 -top-1 min-w-[18px] px-1 text-[10px] font-bold tabular-nums",
					children: unreadCount > 99 ? "99+" : unreadCount
				})]
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			className: "w-80 p-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2.5",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold",
					children: t("dash.notifications")
				}), unreadCount > 0 && /* @__PURE__ */ jsxs(Button, {
					variant: "ghost",
					size: "sm",
					className: "h-7 gap-1 text-xs",
					onClick: markAllAsRead,
					children: [/* @__PURE__ */ jsx(CheckCheck, { className: "size-3.5" }), t("dash.markAllRead")]
				})]
			}), notifications.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid place-items-center py-10 text-sm text-muted-foreground",
				children: t("dash.noNotifications")
			}) : /* @__PURE__ */ jsx(ScrollArea, {
				className: "max-h-[26rem]",
				children: /* @__PURE__ */ jsx("ul", {
					className: "p-1",
					children: notifications.map((notification) => {
						const Icon = TYPE_ICON[notification.type] ?? Bell;
						const unread = !notification.isRead;
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => markAsRead(notification.id),
							className: cn("flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-start transition-colors hover:bg-muted", unread && "bg-primary/5"),
							children: [
								/* @__PURE__ */ jsx("span", {
									className: cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg", unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"),
									children: /* @__PURE__ */ jsx(Icon, { className: "size-4" })
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "truncate text-sm font-medium",
												children: notification.title
											}), unread && /* @__PURE__ */ jsx("span", { className: "size-1.5 shrink-0 rounded-full bg-primary" })]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "mt-0.5 block text-xs leading-relaxed text-muted-foreground",
											children: notification.body
										}),
										/* @__PURE__ */ jsx("span", {
											className: "mt-1 block text-[11px] text-muted-foreground/70",
											children: formatDate(notification.createdAt, lang)
										})
									]
								}),
								/* @__PURE__ */ jsx(Check, { className: cn("mt-1 size-3.5 shrink-0", unread ? "text-muted-foreground/40" : "text-success") })
							]
						}) }, notification.id);
					})
				})
			})]
		})]
	});
}
// src/components/dashboard/DashboardHeader.tsx
function RoleIcon({ role }) {
	if (role === "admin") return /* @__PURE__ */ jsx(ShieldAlert, { className: "size-3.5" });
	if (role === "payroll") return /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3.5" });
	return /* @__PURE__ */ jsx(Shield, { className: "size-3.5" });
}
function RoleBadge({ role }) {
	const { t } = useI18n();
	const labels = {
		admin: t("role.admin"),
		payroll: t("role.payroll"),
		staff: t("role.staff")
	};
	const styles = {
		admin: "bg-destructive/10 text-destructive border-destructive/20",
		payroll: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-400/10 dark:text-violet-400",
		staff: "bg-primary/10 text-primary border-primary/20"
	};
	return /* @__PURE__ */ jsxs(Badge, {
		variant: "outline",
		className: cn("gap-1 text-[10px] font-semibold px-1.5 py-0", styles[role] ?? styles["staff"]),
		children: [/* @__PURE__ */ jsx(RoleIcon, { role }), labels[role] ?? role]
	});
}
function DashboardHeader({ onMobileMenuToggle }) {
	const { t } = useI18n();
	const { dark, toggle: toggleTheme } = useTheme();
	const username = currentUsername();
	const role = currentRole();
	useClinicStore().requests.filter((r) => !r.archived && r.status === "pending").length;
	const handleSignOut = () => {
		logout();
		window.location.reload();
	};
	const handleBackToSite = () => {
		logout();
		window.location.href = "/";
	};
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-6",
		children: [onMobileMenuToggle && /* @__PURE__ */ jsx(Button, {
			variant: "ghost",
			size: "icon",
			className: "size-8 shrink-0 lg:hidden",
			onClick: onMobileMenuToggle,
			children: /* @__PURE__ */ jsx(Menu, { className: "size-4" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "ms-auto flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/cashier",
					title: t("header.cashier"),
					className: "shrink-0",
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						className: "gap-1.5 px-2 text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ jsx(ScanLine, { className: "size-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "hidden text-sm font-medium md:inline",
							children: t("header.cashier")
						})]
					})
				}),
				/* @__PURE__ */ jsx(NotificationBell, {}),
				/* @__PURE__ */ jsx(LanguageToggle, { className: "size-8" }),
				/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-8 text-muted-foreground hover:text-foreground",
					onClick: toggleTheme,
					title: dark ? t("header.lightMode") : t("header.darkMode"),
					children: dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
				}),
				/* @__PURE__ */ jsx(Separator, {
					orientation: "vertical",
					className: "mx-1 h-5"
				}),
				/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						className: "gap-2 px-2 text-muted-foreground hover:text-foreground",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary",
								children: username?.[0]?.toUpperCase() ?? "S"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "hidden text-sm font-medium sm:inline-block",
								children: username || t("auth.staff")
							}),
							/* @__PURE__ */ jsx(RoleBadge, { role })
						]
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					className: "w-48",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "px-2 py-1.5",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: username || t("auth.staff")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: t(`role.${role}`)
							})]
						}),
						/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
						/* @__PURE__ */ jsxs(DropdownMenuItem, {
							onClick: handleBackToSite,
							className: "gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), t("dash.back")]
						}),
						/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
						/* @__PURE__ */ jsxs(DropdownMenuItem, {
							onClick: handleSignOut,
							className: "gap-2 text-destructive",
							children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), t("auth.signOut")]
						})
					]
				})] })
			]
		})]
	});
}
// src/components/dashboard/DashboardLayout.tsx
function DashboardLayout({ activeTab, onTabChange, canAccess, children }) {
	const isMobile = useIsMobile();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const handleTabChange = (tab) => {
		onTabChange(tab);
		setMobileOpen(false);
	};
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen bg-muted/30",
		children: [
			!isMobile && /* @__PURE__ */ jsx(DashboardSidebar, {
				activeTab,
				onTabChange: handleTabChange,
				canAccess,
				collapsed,
				onToggleCollapse: () => setCollapsed(!collapsed)
			}),
			isMobile && /* @__PURE__ */ jsx(Sheet, {
				open: mobileOpen,
				onOpenChange: setMobileOpen,
				children: /* @__PURE__ */ jsx(SheetContent, {
					side: "left",
					className: "w-60 p-0",
					children: /* @__PURE__ */ jsx(DashboardSidebar, {
						activeTab,
						onTabChange: handleTabChange,
						canAccess,
						collapsed: false,
						onToggleCollapse: () => setMobileOpen(false)
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ jsx(DashboardHeader, { onMobileMenuToggle: isMobile ? () => setMobileOpen(true) : void 0 }), /* @__PURE__ */ jsx("main", {
					className: "flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ jsx(AnimatePresence, {
						mode: "wait",
						initial: false,
						children: /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -8
							},
							transition: {
								duration: .22,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							children
						}, activeTab)
					})
				})]
			})
		]
	}) });
}
// src/routes/dashboard.tsx?tsr-split=component
function RequestsTable({ requests, onConfirm, onCancel, onDelete, onArchive }) {
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
				children: formatDate$1(r.date, lang)
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
					children: [r.emergency && /* @__PURE__ */ jsx("span", {
						className: "mb-1 me-1 inline-block rounded-full border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-600",
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
						(r.status === "completed" || r.status === "cancelled") && /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 px-2 text-muted-foreground hover:text-foreground",
							"aria-label": t("dash.archive"),
							title: t("dash.archive"),
							onClick: () => onArchive(r.id),
							children: /* @__PURE__ */ jsx(Archive, { className: "size-3.5" })
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
function AuthGate({ onUnlocked }) {
	const { t } = useI18n();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [lockedFor, setLockedFor] = useState(remainingLockMs());
	const [busy, setBusy] = useState(false);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		setError(null);
		setBusy(true);
		try {
			if (await login(username, password)) onUnlocked(currentRole());
			else setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.status === 400) setError(t("auth.missingFields"));
				else if (err.status === 429) setError(t("auth.locked", { minutes: String(err.retryAfterMinutes ?? 15) }));
				else setError(t("auth.unreachable"));
			} else setError(t("auth.unreachable"));
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
				/* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => window.location.href = "/",
					className: "mb-4 -ms-2 text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4 me-1" }),
						" ",
						t("dash.back")
					]
				}),
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(Lock, { className: "size-5" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-5 text-center text-xl font-bold",
					children: t("auth.signIn")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-center text-sm text-muted-foreground",
					children: t("auth.signInDesc")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 grid gap-4",
					children: [/* @__PURE__ */ jsx(Field, {
						label: t("auth.username"),
						children: /* @__PURE__ */ jsx(Input, {
							autoFocus: true,
							autoComplete: "username",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							placeholder: t("auth.usernamePlaceholder"),
							maxLength: 40
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: t("auth.password"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: t("auth.passwordPlaceholder"),
							maxLength: 128
						})
					})]
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}),
				lockedFor > 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs text-amber-600",
					children: t("auth.locked", { minutes: String(Math.ceil(lockedFor / 6e4)) })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 text-center",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: t("auth.signInHelp")
					})
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
function OverviewTab() {
	const { t, lang, tOr } = useI18n();
	const store = useClinicStore();
	const todayISO = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const pendingCount = store.requests.filter((r) => !r.archived && r.status === "pending").length;
	const confirmedCount = store.requests.filter((r) => !r.archived && r.status === "confirmed").length;
	const completedCount = store.requests.filter((r) => !r.archived && r.status === "completed").length;
	const stats = [
		{
			label: t("dash.overview.stats.pending"),
			value: pendingCount,
			icon: Radio,
			tone: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
		},
		{
			label: t("dash.overview.stats.confirmed"),
			value: confirmedCount,
			icon: CalendarClock,
			tone: "bg-success/10 text-success"
		},
		{
			label: t("dash.overview.stats.completed"),
			value: completedCount,
			icon: HeartPulse,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: t("dash.overview.stats.doctors"),
			value: store.doctors.length,
			icon: Stethoscope,
			tone: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400"
		}
	];
	const todayAppointments = store.requests.filter((r) => !r.archived && r.date === todayISO && r.status === "confirmed").sort((a, b) => a.time.localeCompare(b.time));
	const recent = [...store.requests].filter((r) => !r.archived).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ jsx(StatCard, {
					label: s.label,
					value: s.value,
					icon: s.icon,
					tone: s.tone
				}, s.label))
			}),
			/* @__PURE__ */ jsx(OverviewCard, {
				title: t("dash.overview.today"),
				children: todayAppointments.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "py-4 text-center text-sm text-muted-foreground",
					children: t("dash.overview.noData")
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: todayAppointments.map((r) => /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50",
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
							onClick: async () => {
								await setBookingStatus(r.id, "completed");
								toast.success(t("dash.toast.completed"));
							},
							children: t("dash.complete")
						})]
					}, r.id))
				})
			}),
			/* @__PURE__ */ jsx(OverviewCard, {
				title: t("dash.overview.recent"),
				description: t("dash.overview.recentDesc"),
				children: recent.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "py-4 text-center text-sm text-muted-foreground",
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
							children: formatDate$1(r.date, lang)
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "whitespace-nowrap",
							children: r.time
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: r.status }) })
					] }, r.id)) }) })
				})
			})
		]
	});
}
function RequestsTab() {
	const { t, lang } = useI18n();
	const store = useClinicStore();
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const reqGrid = useGrid(useMemo(() => {
		const q = query.trim().toLowerCase();
		return store.requests.filter((r) => {
			if (r.archived) return false;
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
	]), "", [], 10);
	const confirmReq = async (id) => {
		await setBookingStatus(id, "confirmed");
		toast.success(t("dash.toast.confirmed"));
	};
	const cancelReq = async (id) => {
		await setBookingStatus(id, "cancelled");
		toast.success(t("dash.toast.cancelled"));
	};
	const removeReq = async (id) => {
		await deleteRequest(id);
		toast.success(t("dash.toast.deleted"));
	};
	const archiveReq = async (id) => {
		await archiveBooking(id, true);
		toast.success(t("dash.toast.archived"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
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
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: t("dash.showing", {
					count: String(reqGrid.total),
					rows: t("dash.rows")
				})
			}),
			/* @__PURE__ */ jsx(RequestsTable, {
				requests: reqGrid.slice,
				onConfirm: confirmReq,
				onCancel: cancelReq,
				onDelete: removeReq,
				onArchive: archiveReq
			}),
			/* @__PURE__ */ jsx(PaginationBar, {
				total: reqGrid.total,
				page: reqGrid.page,
				pageSize: reqGrid.pageSize,
				pageCount: reqGrid.pageCount,
				onPage: reqGrid.setPage,
				onPageSize: reqGrid.setPageSize
			})
		]
	});
}
function ReservationsTab() {
	const { t, lang, tOr } = useI18n();
	const store = useClinicStore();
	const [resQuery, setResQuery] = useState("");
	const [recordFor, setRecordFor] = useState(null);
	const [rxFor, setRxFor] = useState(null);
	const [reqPayFor, setReqPayFor] = useState(null);
	const todayISO = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const resGrid = useGrid(useMemo(() => store.requests.filter((r) => !r.archived && r.status === "confirmed" && r.date >= todayISO).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [store.requests, todayISO]), resQuery, [
		"ownerName",
		"petName",
		"doctorName",
		"phone"
	]);
	const cancelReq = async (id) => {
		await setBookingStatus(id, "cancelled");
		toast.success(t("dash.toast.cancelled"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: t("dash.reservationsDesc")
			}),
			/* @__PURE__ */ jsx("div", {
				className: "w-full sm:max-w-xs",
				children: /* @__PURE__ */ jsx(SearchBox, {
					value: resQuery,
					onChange: setResQuery,
					placeholder: t("dash.search")
				})
			}),
			resGrid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-6 text-center text-sm text-muted-foreground",
				children: t("dash.empty")
			}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: resGrid.slice.map((r) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border p-4 transition-colors hover:bg-muted/50",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold",
									children: [
										formatDate$1(r.date, lang),
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
										") — ",
										r.ownerName
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: r.doctorName
								}),
								r.emergency && /* @__PURE__ */ jsx("span", {
									className: "mt-2 inline-block rounded-full border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-600",
									children: t("dash.emergency.yes")
								})
							] }), /* @__PURE__ */ jsx(StatusBadge, { status: r.status })]
						}),
						(r.diagnosis || r.treatmentNotes) && /* @__PURE__ */ jsxs("div", {
							className: "mt-2 grid gap-2 text-xs sm:grid-cols-2",
							children: [r.diagnosis && /* @__PURE__ */ jsxs("p", {
								className: "rounded-lg bg-muted/60 p-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Diagnosis:"
									}),
									" ",
									r.diagnosis
								]
							}), r.treatmentNotes && /* @__PURE__ */ jsxs("p", {
								className: "rounded-lg bg-muted/60 p-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Treatment:"
									}),
									" ",
									r.treatmentNotes
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									onClick: async () => {
										await setBookingStatus(r.id, "completed");
										toast.success(t("dash.toast.completed"));
									},
									children: t("dash.complete")
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setRecordFor(r),
									children: [/* @__PURE__ */ jsx(ScrollText, { className: "size-4" }), " Record visit"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setRxFor(r),
									children: [/* @__PURE__ */ jsx(Stethoscope, { className: "size-4" }), " Write prescription"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setReqPayFor(r),
									children: [
										/* @__PURE__ */ jsx(Banknote, { className: "size-4" }),
										" ",
										t("reservations.reqPayment")
									]
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => cancelReq(r.id),
									className: "text-muted-foreground hover:text-destructive",
									children: t("dash.cancelRow")
								})
							]
						})
					]
				}, r.id))
			}), /* @__PURE__ */ jsx(PaginationBar, {
				total: resGrid.total,
				page: resGrid.page,
				pageSize: resGrid.pageSize,
				pageCount: resGrid.pageCount,
				onPage: resGrid.setPage,
				onPageSize: resGrid.setPageSize
			})] }),
			recordFor && /* @__PURE__ */ jsx(ClinicalRecordDialog, {
				booking: recordFor,
				onClose: () => setRecordFor(null),
				onSaved: () => setRecordFor(null)
			}),
			rxFor && /* @__PURE__ */ jsx(PrescriptionBuilderDialog, {
				open: true,
				onClose: () => setRxFor(null),
				onSaved: () => setRxFor(null),
				preset: {
					...rxFor.petId ? { petId: rxFor.petId } : {},
					doctorId: rxFor.doctorId,
					bookingId: rxFor.id,
					...rxFor.diagnosis ? { diagnosis: rxFor.diagnosis } : {}
				}
			}),
			reqPayFor && /* @__PURE__ */ jsx(RequestPaymentDialog, {
				booking: reqPayFor,
				onClose: () => setReqPayFor(null)
			})
		]
	});
}
function ClinicalRecordDialog({ booking, onClose, onSaved }) {
	const [diagnosis, setDiagnosis] = useState(booking.diagnosis ?? "");
	const [treatmentNotes, setTreatmentNotes] = useState(booking.treatmentNotes ?? "");
	const [followUpDate, setFollowUpDate] = useState((booking.followUpDate ?? "").slice(0, 10));
	const [busy, setBusy] = useState(false);
	const save = async () => {
		setBusy(true);
		try {
			await saveBookingClinical(booking.id, {
				diagnosis: diagnosis.trim(),
				treatmentNotes: treatmentNotes.trim(),
				followUpDate
			});
			toast.success("Visit record saved");
			refreshClinicData();
			onSaved();
		} catch {
			toast.error("Could not save the visit record");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, { children: ["Record visit — ", booking.petName] }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
					booking.ownerName,
					" · ",
					booking.doctorName,
					" · ",
					booking.date,
					" ",
					booking.time
				] })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-xs font-medium text-muted-foreground",
								children: "Diagnosis"
							}), /* @__PURE__ */ jsx(Textarea, {
								rows: 2,
								value: diagnosis,
								onChange: (e) => setDiagnosis(e.target.value),
								placeholder: "Final diagnosis for this visit"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-xs font-medium text-muted-foreground",
								children: "Treatment notes"
							}), /* @__PURE__ */ jsx(Textarea, {
								rows: 3,
								value: treatmentNotes,
								onChange: (e) => setTreatmentNotes(e.target.value),
								placeholder: "Procedures, medication started, care instructions…"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-xs font-medium text-muted-foreground",
								children: "Follow-up date"
							}), /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: followUpDate,
								onChange: (e) => setFollowUpDate(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: busy,
					children: busy ? "Saving…" : "Save visit record"
				})] })
			]
		})
	});
}
function RequestPaymentDialog({ booking, onClose }) {
	const { t } = useI18n();
	const { services, settings } = useClinicStore();
	const [items, setItems] = useState([]);
	const [customLabel, setCustomLabel] = useState("");
	const [customAmount, setCustomAmount] = useState("");
	const [busy, setBusy] = useState(false);
	const pricedServices = services.filter((s) => (s.price ?? 0) > 0);
	const total = items.reduce((sum, it) => sum + it.amount, 0);
	const toggleService = (svc) => {
		setItems((prev) => {
			if (prev.find((it) => it.id === svc.slug)) return prev.filter((it) => it.id !== svc.slug);
			return [...prev, {
				id: svc.slug,
				label: svc.title,
				amount: svc.price,
				kind: "service"
			}];
		});
	};
	const addCustom = () => {
		const value = Number.parseFloat(customAmount);
		if (!customLabel.trim() || !Number.isFinite(value) || value <= 0) {
			toast.error(t("reservations.noItems"));
			return;
		}
		setItems((prev) => [...prev, {
			id: `custom-${Date.now()}`,
			label: customLabel.trim(),
			amount: value,
			kind: "other"
		}]);
		setCustomLabel("");
		setCustomAmount("");
	};
	const setAmount = (id, value) => {
		const num = Number.parseFloat(value);
		const amount = Number.isFinite(num) && num >= 0 ? num : 0;
		setItems((prev) => prev.map((it) => it.id === id ? {
			...it,
			amount
		} : it));
	};
	const send = async () => {
		if (busy) return;
		if (items.length === 0) {
			toast.error(t("reservations.noItems"));
			return;
		}
		setBusy(true);
		try {
			await createPaymentRequest({
				title: `${t("payments.kind.visit")} — ${booking.petName}`,
				bookingId: booking.id,
				kind: "visit",
				amount: total,
				method: "cash",
				status: "unpaid",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				items: items.map((it) => ({
					label: it.label,
					amount: it.amount,
					kind: it.kind,
					referenceId: it.kind === "service" ? it.id : void 0
				}))
			});
			toast.success(t("reservations.requestSent"));
			refreshClinicData();
			onClose();
		} catch {
			toast.error(t("dash.toast.error"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-xl",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, { children: [
					t("reservations.reqPayment"),
					" — ",
					booking.petName
				] }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
					booking.ownerName,
					" · ",
					booking.doctorName,
					" · ",
					formatDate$1(booking.date, "en"),
					" ",
					booking.time
				] })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: t("reservations.requestPaymentDesc")
						}),
						pricedServices.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: t("dash.form.service.title")
							}), pricedServices.map((s) => {
								const active = items.some((it) => it.id === s.slug);
								return /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => toggleService(s),
									className: cn("flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors", active ? "border-primary bg-primary/10 font-medium" : "border-border hover:bg-muted/60"),
									children: [/* @__PURE__ */ jsx("span", { children: s.title }), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-muted-foreground",
										children: formatMoney(s.price, settings.currency)
									})]
								}, s.slug);
							})]
						}),
						items.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-[1fr_auto_auto] items-center gap-2 text-xs font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("span", { children: t("reservations.serviceCol") }),
									/* @__PURE__ */ jsx("span", {
										className: "w-28 text-end",
										children: t("reservations.amountCol")
									}),
									/* @__PURE__ */ jsx("span", { className: "w-8" })
								]
							}), items.map((it) => /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-[1fr_auto_auto] items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "truncate text-sm",
										children: it.label
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										step: "0.01",
										value: String(it.amount),
										onChange: (e) => setAmount(it.id, e.target.value),
										className: "h-8 w-28 text-end"
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "icon",
										variant: "ghost",
										className: "size-8",
										onClick: () => setItems((prev) => prev.filter((x) => x.id !== it.id)),
										children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
									})
								]
							}, it.id))]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-1.5 rounded-lg bg-muted/40 p-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: t("reservations.customService")
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid gap-2 sm:grid-cols-[1fr_auto_auto]",
								children: [
									/* @__PURE__ */ jsx(Input, {
										placeholder: t("reservations.customLabel"),
										value: customLabel,
										onChange: (e) => setCustomLabel(e.target.value)
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										step: "0.01",
										placeholder: t("reservations.customAmount"),
										value: customAmount,
										onChange: (e) => setCustomAmount(e.target.value),
										className: "w-28"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "sm",
										onClick: addCustom,
										children: t("reservations.addLine")
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-t pt-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold",
								children: t("reservations.total")
							}), /* @__PURE__ */ jsx("span", {
								className: "text-lg font-bold",
								children: formatMoney(total, settings.currency)
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: onClose,
					children: t("dash.cancel")
				}), /* @__PURE__ */ jsx(Button, {
					onClick: send,
					disabled: busy,
					children: busy ? t("dash.saving") : t("reservations.sendToCashier")
				})] })
			]
		})
	});
}
function DashboardPage() {
	const { t } = useI18n();
	const store = useClinicStore();
	const [authed, setAuthed] = useState(false);
	const [role, setRole] = useState("staff");
	const [tab, setTab] = useState("overview");
	const orderCount = store.orders.filter((o) => !o.archived).length;
	const pendingRequestCount = store.requests.filter((r) => !r.archived && r.status === "pending").length;
	useEffect(() => {
		if (isAuthed()) {
			setAuthed(true);
			setRole(currentRole());
			const firstAllowed = ALL_NAV_ITEMS.find((i) => allowedTabsForRole(store.settings?.rolePermissions, currentRole()).includes(i.id));
			if (firstAllowed) setTab(firstAllowed.id);
		}
	}, []);
	const canAccess = (tabId) => allowedTabsForRole(store.settings?.rolePermissions, role).includes(tabId);
	useEffect(() => {
		if (authed && !canAccess(tab)) {
			const fallback = ALL_NAV_ITEMS.find((i) => canAccess(i.id));
			const next = fallback ? fallback.id : "overview";
			if (next !== tab) setTab(next);
		}
	});
	useNotificationSound({
		enabled: authed,
		interval: 3e4,
		getCount: () => orderCount + pendingRequestCount,
		onNewItems: (newCount, prevCount) => {
			const newOrders = store.orders.filter((o) => !o.archived).length;
			const newPending = store.requests.filter((r) => !r.archived && r.status === "pending").length;
			if (newOrders > prevCount || newPending > prevCount) toast.info(t("dash.notificationNew"));
		}
	});
	if (!authed) return /* @__PURE__ */ jsx(AuthGate, { onUnlocked: (r) => {
		setAuthed(true);
		setRole(r);
	} });
	return /* @__PURE__ */ jsxs(DashboardLayout, {
		activeTab: tab,
		onTabChange: setTab,
		canAccess,
		children: [
			/* @__PURE__ */ jsx(ShiftBanner, {}),
			tab === "overview" && /* @__PURE__ */ jsx(OverviewTab, {}),
			tab === "requests" && /* @__PURE__ */ jsx(RequestsTab, {}),
			tab === "reservations" && /* @__PURE__ */ jsx(ReservationsTab, {}),
			tab === "staff-overview" && /* @__PURE__ */ jsx(StaffOverviewPanel, {}),
			tab === "payroll" && /* @__PURE__ */ jsx(PayrollPanel, {}),
			tab === "finance" && /* @__PURE__ */ jsx(PaymentsPanel, {}),
			tab === "clients" && /* @__PURE__ */ jsx(ClientsPanel, {}),
			tab === "doctors" && /* @__PURE__ */ jsx(DoctorsPanel, {}),
			tab === "services" && /* @__PURE__ */ jsx(ServicesPanel, {}),
			tab === "prescriptions" && /* @__PURE__ */ jsx(PrescriptionsPanel, {}),
			tab === "products" && /* @__PURE__ */ jsx(ProductsPanel, {}),
			tab === "orders" && /* @__PURE__ */ jsx(OrdersPanel, {}),
			tab === "reviews" && /* @__PURE__ */ jsx(ReviewsPanel, {}),
			tab === "workdays" && /* @__PURE__ */ jsx(WorkdaysPanel, {}),
			tab === "archive" && /* @__PURE__ */ jsx(ArchivePanel, {}),
			tab === "logs" && /* @__PURE__ */ jsx(LogsPanel, {}),
			tab === "settings" && /* @__PURE__ */ jsx(SettingsPanel, {}),
			tab === "recruitment" && /* @__PURE__ */ jsx(RecruitmentPanel, {})
		]
	});
}
export { DashboardPage as component };
