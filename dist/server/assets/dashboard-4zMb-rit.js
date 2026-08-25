import { $ as LanguageToggle, A as updatePayment, C as setBookingStatus, E as setReviewStatus, M as useClinicStore, N as api, O as syncGoogleReviews, S as saveService, T as setOrderStatus, Z as Button, _ as loadWorkDay, a as checkOut, b as saveDoctor, d as deletePayment, et as useI18n, f as deleteProduct, g as loadAuditLogs, h as deleteService, i as checkIn, j as updateSettings, l as deleteDoctor, m as deleteReview, n as archiveBooking, nt as cn, p as deleteRequest, r as archiveOrder, s as createPayment, u as deleteOrder, v as loadWorkDays, w as setOrderPaymentStatus, x as saveProduct, y as refreshClinicData } from "./clinic-store-B7Osi1UD.js";
import { E as PawMLogo, a as changeCredentials, c as isAuthConfigured, d as logout, f as register, l as isAuthed, o as currentRole, p as remainingLockMs, s as currentUsername, u as login, w as formatDate$1 } from "./router-BtxvXHrA.js";
import { t as Input } from "./input-BHmT5Meh.js";
import { t as Label } from "./label-DfnW5NSw.js";
import { t as Textarea } from "./textarea-B3Bd2TID.js";
import { t as Badge } from "./badge-dr-UWvFT.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-m1r64jh_.js";
import { t as Separator } from "./separator-D2q5SDbY.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArchiveRestore, ArrowDown, ArrowLeft, ArrowUp, Banknote, Bell, Calendar, CalendarCheck, CalendarClock, CalendarDays, Check, CheckCircle, ChevronLeft, ChevronRight, Circle, Clock, DollarSign, Edit, FolderOpen, HeartPulse, History, LayoutDashboard, ListChecks, Lock, LogIn, LogOut, MessageSquareText, Package, Pencil, Plus, Radio, RefreshCw, Search, Settings, ShoppingBag, Star, Stethoscope, Timer, Trash2, Users, Wallet, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { toast } from "sonner";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as TogglePrimitive from "@radix-ui/react-toggle";
//#region src/components/ui/dropdown-menu.tsx
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
//#endregion
//#region src/components/dashboard/StaffOverviewPanel.tsx
function StaffOverviewPanel() {
	const { t } = useI18n();
	const [staff, setStaff] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState({
		role: "all",
		period: "week"
	});
	useEffect(() => {
		fetchStaffOverview();
	}, [filter]);
	async function fetchStaffOverview() {
		setLoading(true);
		try {
			const response = await api.get("/api/employees");
			if (Array.isArray(response)) {
				const filtered = filter.role === "all" ? response : response.filter((emp) => emp.role === filter.role);
				const staffWithKPI = await Promise.all(filtered.map(async (emp) => {
					try {
						const periodEnd = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
						let periodStart = "";
						switch (filter.period) {
							case "today":
								periodStart = periodEnd;
								break;
							case "week":
								const weekAgo = /* @__PURE__ */ new Date();
								weekAgo.setDate(weekAgo.getDate() - 7);
								periodStart = weekAgo.toISOString().split("T")[0];
								break;
							case "month":
								const monthAgo = /* @__PURE__ */ new Date();
								monthAgo.setMonth(monthAgo.getMonth() - 1);
								periodStart = monthAgo.toISOString().split("T")[0];
						}
						const kpiResponse = await api.get(`/api/work-sessions/me/kpi?periodStart=${periodStart}&periodEnd=${periodEnd}`, { headers: {
							"x-user-id": emp.id.toString(),
							"x-user-role": emp.role
						} });
						return {
							...emp,
							...kpiResponse
						};
					} catch (error) {
						console.error(`Error fetching KPI for employee ${emp.id}:`, error);
						return {
							...emp,
							sessions: 0,
							hours: 0,
							bookings: 0,
							orders: 0,
							revenue: 0,
							basePay: 0,
							grossPay: 0
						};
					}
				}));
				setStaff(staffWithKPI);
			}
		} catch (error) {
			console.error("Error fetching staff overview:", error);
		} finally {
			setLoading(false);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "p-6",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex space-x-2",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
				]
			})
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: t("dash.staffOverview")
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "icon",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
							className: "ml-2 text-xs",
							children: filter.period === "today" ? t("dash.today") : filter.period === "week" ? t("dash.thisWeek") : t("dash.thisMonth")
						})]
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					className: "w-48",
					children: [
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								period: "today"
							})),
							children: t("dash.today")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								period: "week"
							})),
							children: t("dash.thisWeek")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								period: "month"
							})),
							children: t("dash.thisMonth")
						})
					]
				})] }), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "icon",
						children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
							className: "ml-2 text-xs",
							children: filter.role === "all" ? t("dash.allRoles") : filter.role === "admin" ? t("auth.role.admin") : filter.role === "payroll" ? t("auth.role.payroll") : t("auth.role.staff")
						})]
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					className: "w-48",
					children: [
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								role: "all"
							})),
							children: t("dash.allRoles")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								role: "admin"
							})),
							children: t("auth.role.admin")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								role: "payroll"
							})),
							children: t("auth.role.payroll")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter((prev) => ({
								...prev,
								role: "staff"
							})),
							children: t("auth.role.staff")
						})
					]
				})] })]
			})]
		}), staff.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-center py-8 text-muted-foreground",
			children: t("dash.noStaff")
		}) : /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm border-separate border-spacing-x-4",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					className: "text-left text-xs font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.name")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.role")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.rate")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.sessions")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.hours")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.bookings")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.orders")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.revenue")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.pay")
						})
					]
				}) }), /* @__PURE__ */ jsx("tbody", {
					className: "divide-y",
					children: staff.map((emp) => /* @__PURE__ */ jsxs("tr", {
						className: "hover:bg-muted",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 flex items-center space-x-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "h-8 w-8 rounded bg-primary/20 flex items-center justify-center",
									children: emp.fullName?.charAt(0)
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: emp.fullName
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: emp.email
								})] })]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 text-xs rounded-full",
									children: emp.role === "admin" ? t("auth.role.admin") : emp.role === "payroll" ? t("auth.role.payroll") : t("auth.role.staff")
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: emp.payRateType === "monthly" ? `${t("dash.egp")}${emp.monthlySalary.toLocaleString()}/${t("dash.month")}` : `${t("dash.egp")}${emp.hourlyRate.toLocaleString()}/${t("dash.hour")}`
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: emp.sessions?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [(emp.hours ?? 0).toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								}), "h"]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: emp.bookings?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: emp.orders?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [t("dash.egp"), (emp.revenue ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right font-semibold",
								children: [t("dash.egp"), (emp.grossPay ?? 0).toLocaleString()]
							})
						]
					}, emp.id))
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/PayrollPanel.tsx
function PayrollPanel() {
	const { t } = useI18n();
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState({
		periodStart: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		periodEnd: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	});
	useEffect(() => {
		fetchPayrollRecords();
	}, [filter]);
	async function fetchPayrollRecords() {
		setLoading(true);
		try {
			const response = await api.get("/api/payroll/records", { params: {
				periodStart: filter.periodStart,
				periodEnd: filter.periodEnd
			} });
			if (Array.isArray(response)) setRecords(response);
		} catch (error) {
			console.error("Error fetching payroll records:", error);
		} finally {
			setLoading(false);
		}
	}
	const handleDateChange = (type, dateStr) => {
		setFilter((prev) => ({
			...prev,
			[type === "start" ? "periodStart" : "periodEnd"]: dateStr
		}));
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "p-6",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex space-x-2",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
				]
			})
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: t("dash.payroll")
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-muted-foreground" }),
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: filter.periodStart,
								onChange: (e) => handleDateChange("start", e.target.value),
								className: "border-input bg-background px-3 py-2 text-sm rounded"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mx-2 text-muted-foreground",
								children: "–"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: filter.periodEnd,
								onChange: (e) => handleDateChange("end", e.target.value),
								className: "border-input bg-background px-3 py-2 text-sm rounded"
							})
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						onClick: fetchPayrollRecords,
						className: "btn-primary",
						children: [
							/* @__PURE__ */ jsx(ListChecks, { className: "mr-2 h-4 w-4" }),
							" ",
							t("dash.calculate")
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						onClick: async () => {
							if (records.length === 0) return;
							try {
								await api.post("/api/notifications/broadcast", {
									type: "payroll",
									title: t("dash.payrollNotificationTitle"),
									body: t("dash.payrollNotificationBody", { period: `${filter.periodStart} to ${filter.periodEnd}` }),
									data: {
										periodStart: filter.periodStart,
										periodEnd: filter.periodEnd,
										recordCount: records.length
									}
								});
								await api.post("/api/payments/broadcast");
							} catch (error) {
								console.error("Error broadcasting payroll:", error);
							}
						},
						className: "btn-secondary",
						children: [
							/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
							" ",
							t("dash.notifyStaff")
						]
					})
				]
			})]
		}), records.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-center py-8 text-muted-foreground",
			children: t("dash.noPayrollRecords")
		}) : /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm border-separate border-spacing-x-4",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					className: "text-left text-xs font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.name")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.period")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.sessions")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.hours")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.bookings")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.orders")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.revenue")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.basePay")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.bonuses")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.deductions")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.netPay")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-16",
							children: t("dash.actions")
						})
					]
				}) }), /* @__PURE__ */ jsx("tbody", {
					className: "divide-y",
					children: records.map((record) => /* @__PURE__ */ jsxs("tr", {
						className: "hover:bg-muted",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: record.employee?.fullName || "Unknown"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-center",
								children: [
									formatDate$1(record.periodStart),
									" – ",
									formatDate$1(record.periodEnd)
								]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: record.totalSessions?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [(record.totalHours ?? 0).toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								}), "h"]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: record.totalBookings?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: record.totalOrders?.toLocaleString() ?? "0"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [t("dash.egp"), (record.totalRevenue ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [t("dash.egp"), (record.basePay ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [t("dash.egp"), (record.totalBonuses ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right",
								children: [t("dash.egp"), (record.totalDeductions ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-right font-semibold",
								children: [t("dash.egp"), (record.netPay ?? 0).toLocaleString()]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 flex justify-center space-x-2",
								children: [
									record.status === "calculated" && /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateRecordStatus(record.id, "pending_approval"),
										title: t("dash.submitForApproval"),
										children: /* @__PURE__ */ jsx(ListChecks, { className: "h-3 w-3 text-muted-foreground" })
									}),
									record.status === "pending_approval" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateRecordStatus(record.id, "approved"),
										title: t("dash.approve"),
										children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-success" })
									}), /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateRecordStatus(record.id, "rejected"),
										title: t("dash.reject"),
										children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3 text-destructive" })
									})] }),
									(record.status === "approved" || record.status === "paid") && /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateRecordStatus(record.id, "paid"),
										title: t("dash.markAsPaid"),
										children: /* @__PURE__ */ jsx(DollarSign, { className: "h-3 w-3 text-success" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateRecordAmount(record.id),
										title: t("dash.adjustAmount"),
										children: /* @__PURE__ */ jsx(Edit, { className: "h-3 w-3 text-muted-foreground" })
									})
								]
							})
						]
					}, record.id))
				})]
			})
		})]
	});
}
async function updateRecordStatus(id, status) {
	try {
		await api.patch(`/api/payroll/records/${id}/status`, { status });
	} catch (error) {
		console.error("Error updating payroll record status:", error);
	}
}
async function updateRecordAmount(id) {
	console.log("Opening amount adjustment modal for record", id);
}
//#endregion
//#region src/components/dashboard/TasksPanel.tsx
function TasksPanel() {
	const { t } = useI18n();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState({ status: "all" });
	const userId = localStorage.getItem("paw-m:admin-session") ? JSON.parse(localStorage.getItem("paw-m:admin-session") || "{}").id : null;
	useEffect(() => {
		fetchTasks();
	}, [filter, userId]);
	async function fetchTasks() {
		setLoading(true);
		try {
			let url = `/api/tasks/mine`;
			if (userId) {
				const response = await api.get(url);
				if (Array.isArray(response)) {
					const filtered = filter.status === "all" ? response : response.filter((task) => task.status === filter.status);
					setTasks(filtered);
				}
			}
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setLoading(false);
		}
	}
	async function createTask() {
		console.log("Opening create task modal");
	}
	async function updateTaskStatus(taskId, status) {
		try {
			await api.patch(`/api/tasks/${taskId}/status`, { status });
			await fetchTasks();
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	}
	async function deleteTask(taskId) {
		try {
			await api.delete(`/api/tasks/${taskId}`);
			await fetchTasks();
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "p-6",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex space-x-2",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
				]
			})
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(ListChecks, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: t("dash.tasks")
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "icon",
						children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
							className: "ml-2 text-xs",
							children: filter.status === "all" ? t("dash.allTasks") : filter.status === "open" ? t("dash.openTasks") : filter.status === "in_progress" ? t("dash.inProgress") : filter.status === "completed" ? t("dash.completed") : t("dash.cancelled")
						})]
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					className: "w-48",
					children: [
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter({ status: "all" }),
							children: t("dash.allTasks")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter({ status: "open" }),
							children: t("dash.openTasks")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter({ status: "in_progress" }),
							children: t("dash.inProgress")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter({ status: "completed" }),
							children: t("dash.completed")
						}),
						/* @__PURE__ */ jsx(DropdownMenuItem, {
							onClick: () => setFilter({ status: "cancelled" }),
							children: t("dash.cancelled")
						})
					]
				})] }), /* @__PURE__ */ jsxs(Button, {
					onClick: createTask,
					className: "btn-primary",
					children: [
						/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
						" ",
						t("dash.newTask")
					]
				})]
			})]
		}), tasks.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-center py-8 text-muted-foreground",
			children: t("dash.noTasks")
		}) : /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm border-separate border-spacing-x-4",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					className: "text-left text-xs font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.title")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-20",
							children: t("dash.description")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-12",
							children: t("dash.priority")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-12",
							children: t("dash.dueDate")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-12",
							children: t("dash.status")
						}),
						/* @__PURE__ */ jsx("th", {
							className: "w-12",
							children: t("dash.actions")
						})
					]
				}) }), /* @__PURE__ */ jsx("tbody", {
					className: "divide-y",
					children: tasks.map((task) => /* @__PURE__ */ jsxs("tr", {
						className: "hover:bg-muted",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "py-3",
								children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: task.title
								}), task.description && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: task.description
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 max-w-[200px] break-words",
								children: task.description || "-"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 text-xs rounded-full",
									children: task.priority === "high" ? t("dash.priorityHigh") : task.priority === "medium" ? t("dash.priorityMedium") : t("dash.priorityLow")
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-center",
								children: task.dueDate ? formatDate$1(task.dueDate) : "-"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 text-xs rounded-full",
									children: task.status === "open" ? t("dash.taskOpen") : task.status === "in_progress" ? t("dash.taskInProgress") : task.status === "completed" ? t("dash.taskCompleted") : t("dash.taskCancelled")
								})
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 flex justify-center space-x-2",
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateTaskStatus(task.id, "completed"),
										title: t("dash.markComplete"),
										children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => updateTaskStatus(task.id, "in_progress"),
										title: t("dash.markInProgress"),
										children: /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => deleteTask(task.id),
										title: t("dash.delete"),
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3 text-destructive" })
									})
								]
							})
						]
					}, task.id))
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/dashboard/NotificationsPanel.tsx
function NotificationsPanel() {
	const { t } = useI18n();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [unreadCount, setUnreadCount] = useState(0);
	const userId = localStorage.getItem("paw-m:admin-session") ? JSON.parse(localStorage.getItem("paw-m:admin-session") || "{}").id : null;
	useEffect(() => {
		fetchNotifications();
	}, [userId]);
	async function fetchNotifications() {
		setLoading(true);
		try {
			if (userId) {
				const response = await api.get("/api/notifications/me");
				if (Array.isArray(response)) {
					setNotifications(response);
					const unread = response.filter((n) => !n.readBy || !n.readBy.includes(userId.toString())).length;
					setUnreadCount(unread);
				}
			}
		} catch (error) {
			console.error("Error fetching notifications:", error);
		} finally {
			setLoading(false);
		}
	}
	async function markAsRead(notificationId) {
		try {
			await api.patch(`/api/notifications/${notificationId}/read`);
			await fetchNotifications();
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	}
	async function markAllAsRead() {
		try {
			await Promise.all(notifications.map((n) => api.patch(`/api/notifications/${n.id}/read`)));
			await fetchNotifications();
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "p-6",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex space-x-2",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "h-4 w-4 bg-muted rounded-full animate-pulse" })
				]
			})
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: t("dash.notifications")
				})]
			}), unreadCount > 0 && /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "icon",
				onClick: markAllAsRead,
				className: "ml-4",
				children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-success" }), /* @__PURE__ */ jsx("span", {
					className: "ml-1 text-xs",
					children: unreadCount
				})]
			})]
		}), notifications.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-center py-8 text-muted-foreground",
			children: t("dash.noNotifications")
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: notifications.map((notification) => /* @__PURE__ */ jsxs("div", {
				className: "border rounded-xl p-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-start mb-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								notification.type === "payroll" && /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-success" }),
								notification.type === "task" && /* @__PURE__ */ jsx(ListChecks, { className: "h-4 w-4 text-muted-foreground" }),
								notification.type === "system" && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" }),
								notification.type === "approval" && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-success" }),
								notification.type === "broadcast" && /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 text-muted-foreground" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: notification.title
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: formatDate$1(notification.createdAt)
								})] })
							]
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => markAsRead(notification.id),
							className: notification.readBy && notification.readBy.includes(userId.toString()) ? "text-muted-foreground" : "text-primary",
							children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm",
						children: notification.body
					}),
					notification.data && /* @__PURE__ */ jsxs("div", {
						className: "mt-3 p-3 bg-muted rounded",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-medium",
							children: t("dash.details")
						}), /* @__PURE__ */ jsx("pre", {
							className: "text-xs mt-1 whitespace-pre-wrap",
							children: JSON.stringify(notification.data, null, 2)
						})]
					})
				]
			}, notification.id))
		})]
	});
}
//#endregion
//#region src/components/dash-grid.tsx
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
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
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
	const save = async () => {
		const initials = form.name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "DR";
		await saveDoctor({
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
	const save = async () => {
		await saveService({
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
function ServicesPanel() {
	const { t, tOr } = useI18n();
	const { services } = useClinicStore();
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
function formatMoney(amount, currency) {
	return currency === "$" ? `$${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
}
function PaymentMethodBadge({ method }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: cn("border-transparent", {
			cash: "bg-amber-500/15 text-amber-600",
			fawry: "bg-primary/15 text-primary",
			instapay: "bg-violet-500/15 text-violet-600"
		}[method]),
		children: t(`checkout.method.${method}.short`)
	});
}
function PaymentStatusBadge({ status }) {
	const { t } = useI18n();
	return status === "paid" ? /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-success/15 text-success",
		children: t("pay.paid")
	}) : /* @__PURE__ */ jsx(Badge, {
		className: "border-transparent bg-muted text-muted-foreground",
		children: t("pay.unpaid")
	});
}
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
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.date") }),
					/* @__PURE__ */ jsx(TableHead, { children: t("payments.title") }),
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
						children: formatDate(p.date, lang)
					}),
					/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: p.title
					}), p.orderId && /* @__PURE__ */ jsx("div", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: p.orderId
					})] }),
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
							children: [/* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2",
								"aria-label": t("dash.edit"),
								onClick: () => setEditing(p),
								children: /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" })
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-2 text-muted-foreground hover:text-destructive",
								"aria-label": t("dash.delete"),
								onClick: () => remove(p.id),
								children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
							})]
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
			})
		]
	});
}
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
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
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
					children: formatDate(r.date, lang)
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
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
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
		phone: settings.phone,
		emergency: settings.emergency,
		whatsapp: settings.whatsapp,
		email: settings.email,
		address: settings.address,
		currency: settings.currency,
		instapay: settings.instapay
	});
	const save = async () => {
		if (!form.currency.trim()) {
			toast.error(t("dash.settings.currencyEmpty"));
			return;
		}
		await updateSettings({
			...form,
			currency: form.currency.trim()
		});
		toast.success(t("dash.toast.saved"));
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
			})] })
		]
	});
}
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
	featured: false
};
function ProductDialog({ product, onClose }) {
	const { t } = useI18n();
	const [form, setForm] = useState(() => product ? {
		name: product.name,
		description: product.description,
		price: String(product.price),
		compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
		stock: String(product.stock),
		image: product.image,
		category: product.category,
		petType: product.petType ?? "both",
		featured: product.featured
	} : EMPTY_PRODUCT);
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
		await saveProduct({
			id: product?.id ?? `prod-${Date.now().toString(36)}`,
			name: form.name.trim(),
			description: form.description.trim(),
			price,
			compareAtPrice: compareAt,
			stock,
			image: form.image.trim(),
			category: form.category || "accessories",
			petType: form.petType,
			featured: form.featured,
			createdAt: product?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
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
						/* @__PURE__ */ jsx(Field, {
							label: t("dash.form.product.image"),
							children: /* @__PURE__ */ jsx(Input, {
								value: form.image,
								onChange: (e) => setForm({
									...form,
									image: e.target.value
								}),
								placeholder: "https://…"
							})
						}),
						form.image && /* @__PURE__ */ jsx("img", {
							src: form.image,
							alt: "",
							className: "h-32 w-full rounded-xl border border-border object-cover"
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
	const { products, settings } = useClinicStore();
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
							className: "size-10 rounded-lg border border-border object-cover"
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
							await saveProduct({
								...p,
								featured: !p.featured
							});
							toast.success(t("dash.toast.saved"));
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
									await deleteProduct(p.id);
									toast.success(t("dash.toast.deleted"));
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
			onClose: () => setEditing(null)
		})
	] });
}
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
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
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
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsxs(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [
			/* @__PURE__ */ jsx(FolderOpen, { className: "size-4" }),
			" ",
			t("dash.workdays")
		]
	}), /* @__PURE__ */ jsx(CardDescription, { children: t("dash.workdays.hint") })] }), /* @__PURE__ */ jsx(CardContent, { children: workDays.length === 0 ? /* @__PURE__ */ jsx("p", {
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
	}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
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
			if (result.archived.bookings > 0 || result.archived.orders > 0) toast.success(t("dash.shiftArchivedOnStart", {
				requests: String(result.archived.bookings),
				orders: String(result.archived.orders)
			}));
			else toast.success(t("dash.shiftStarted"));
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
var NAV_ITEMS = [
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
		id: "tasks",
		icon: ListChecks,
		roles: ["staff"]
	},
	{
		id: "notifications",
		icon: Bell,
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
	},
	{
		id: "doctors",
		icon: Users,
		roles: ["payroll", "admin"]
	},
	{
		id: "services",
		icon: HeartPulse,
		roles: ["payroll", "admin"]
	},
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
	},
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
	},
	{
		id: "settings",
		icon: Settings,
		roles: ["admin"]
	}
];
function AuthGate({ onUnlocked }) {
	const { t } = useI18n();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState(null);
	const [lockedFor, setLockedFor] = useState(remainingLockMs());
	const [setup, setSetup] = useState(false);
	const [checked, setChecked] = useState(false);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		isAuthConfigured().then((configured) => {
			setSetup(!configured);
			setChecked(true);
		}).catch(() => setChecked(true));
	}, []);
	const submit = async (e) => {
		e.preventDefault();
		if (busy) return;
		setError(null);
		setBusy(true);
		try {
			if (setup) {
				if (username.trim().length < 3) setError(t("auth.usernameTooShort"));
				else if (password.length < 6) setError(t("auth.passTooShort"));
				else if (password !== confirm) setError(t("auth.mismatch"));
				else {
					await register(username, password);
					await login(username, password);
					onUnlocked(currentRole());
				}
			} else if (await login(username, password)) onUnlocked(currentRole());
			else setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
		} catch {
			setError(t("auth.invalidCreds"));
		} finally {
			setBusy(false);
		}
	};
	if (!checked) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32",
		children: /* @__PURE__ */ jsx("div", {
			className: "text-sm text-muted-foreground",
			children: "…"
		})
	});
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
					onClick: () => {
						window.location.href = "/";
					},
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
					children: setup ? t("auth.setupTitle") : t("auth.signIn")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-center text-sm text-muted-foreground",
					children: setup ? t("auth.setupDesc") : t("auth.signInDesc")
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
							autoComplete: setup ? "new-password" : "current-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: t("auth.passwordPlaceholder"),
							maxLength: 128
						})
					})]
				}),
				setup && /* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsx(Field, {
						label: t("auth.setupConfirm"),
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							autoComplete: "new-password",
							value: confirm,
							onChange: (e) => setConfirm(e.target.value),
							placeholder: t("auth.passwordPlaceholder"),
							maxLength: 128
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
	const [role, setRole] = useState("staff");
	useEffect(() => {
		if (isAuthed()) {
			setAuthed(true);
			setRole(currentRole());
			const firstAllowed = NAV_ITEMS.find((i) => i.roles.includes("all") || i.roles.includes(currentRole()));
			if (firstAllowed) setTab(firstAllowed.id);
		}
	}, []);
	const [tab, setTab] = useState("overview");
	const [query, setQuery] = useState("");
	const [resQuery, setResQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const currentNav = NAV_ITEMS.find((i) => i.id === tab) ?? NAV_ITEMS[0];
	const todayISO = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
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
	const resGrid = useGrid(useMemo(() => store.requests.filter((r) => !r.archived && r.status === "confirmed" && r.date >= todayISO).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [store.requests, todayISO]), resQuery, [
		"ownerName",
		"petName",
		"doctorName",
		"phone"
	]);
	if (!authed) return /* @__PURE__ */ jsx(AuthGate, { onUnlocked: (r) => {
		setAuthed(true);
		setRole(r);
	} });
	const signOut = () => {
		logout();
		setAuthed(false);
	};
	const backToSite = () => {
		logout();
		setAuthed(false);
		window.location.href = "/";
	};
	const pendingCount = store.requests.filter((r) => !r.archived && r.status === "pending").length;
	const confirmedCount = store.requests.filter((r) => !r.archived && r.status === "confirmed").length;
	const completedCount = store.requests.filter((r) => !r.archived && r.status === "completed").length;
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
	const todayAppointments = store.requests.filter((r) => !r.archived && r.date === todayISO && r.status === "confirmed").sort((a, b) => a.time.localeCompare(b.time));
	const recent = [...store.requests].filter((r) => !r.archived).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen bg-muted/40",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex h-14 shrink-0 items-center border-b border-border px-4",
					children: /* @__PURE__ */ jsx(PawMLogo, {})
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "flex-1 space-y-0.5 overflow-y-auto p-2.5",
					children: NAV_ITEMS.filter((item) => item.roles.includes("all") || item.roles.includes(currentRole())).map((item) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setTab(item.id),
						className: cn("relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors", tab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-card hover:text-foreground"),
						children: [
							tab === item.id && /* @__PURE__ */ jsx("span", { className: "absolute inset-y-1.5 start-0 w-1 rounded-full bg-primary" }),
							/* @__PURE__ */ jsx(item.icon, { className: "size-3.5" }),
							t(`dash.${item.id}`),
							item.id === "requests" && pendingCount > 0 && /* @__PURE__ */ jsx("span", {
								className: "ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600",
								children: pendingCount
							}),
							item.id === "reviews" && store.reviews.filter((r) => r.status === "pending").length > 0 && /* @__PURE__ */ jsx("span", {
								className: "ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600",
								children: store.reviews.filter((r) => r.status === "pending").length
							})
						]
					}, item.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "shrink-0 space-y-2 border-t border-border p-2.5",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "w-full",
						children: /* @__PURE__ */ jsx("a", {
							href: "/",
							onClick: backToSite,
							children: t("dash.back")
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-2 px-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "truncate text-xs font-medium text-muted-foreground",
									title: currentUsername(),
									children: currentUsername() || t("auth.staff")
								}),
								role === "admin" && /* @__PURE__ */ jsx(Badge, {
									variant: "default",
									className: "text-[10px] px-1.5 py-0",
									children: "Admin"
								}),
								role === "payroll" && /* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "text-[10px] px-1.5 py-0",
									children: "Payroll"
								}),
								role === "staff" && /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "text-[10px] px-1.5 py-0",
									children: "Staff"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 shrink-0",
							children: [/* @__PURE__ */ jsx(LanguageToggle, {}), /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: signOut,
								children: [
									/* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
									" ",
									t("auth.signOut")
								]
							})]
						})]
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(currentNav.icon, { className: "size-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: t("dash.title")
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: t("dash.subtitle")
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
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
									children: NAV_ITEMS.filter((item) => item.roles.includes("all") || item.roles.includes(currentRole())).map((item) => /* @__PURE__ */ jsx("option", {
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
										onClick: backToSite,
										children: t("dash.back")
									})
								}),
								/* @__PURE__ */ jsx(LanguageToggle, {}),
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
				}),
				/* @__PURE__ */ jsx(ShiftBanner, {}),
				/* @__PURE__ */ jsx(AnimatePresence, {
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
												onClick: async () => {
													await setBookingStatus(r.id, "completed");
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
										count: String(reqGrid.total),
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
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-3",
								children: [/* @__PURE__ */ jsx(RequestsTable, {
									requests: reqGrid.slice,
									onConfirm: confirmReq,
									onCancel: cancelReq,
									onDelete: removeReq,
									onArchive: archiveReq
								}), /* @__PURE__ */ jsx("div", {
									className: "pt-3",
									children: /* @__PURE__ */ jsx(PaginationBar, {
										total: reqGrid.total,
										page: reqGrid.page,
										pageSize: reqGrid.pageSize,
										pageCount: reqGrid.pageCount,
										onPage: reqGrid.setPage,
										onPageSize: reqGrid.setPageSize
									})
								})]
							})] })] }),
							tab === "staff-overview" && /* @__PURE__ */ jsx(StaffOverviewPanel, {}),
							tab === "payroll" && /* @__PURE__ */ jsx(PayrollPanel, {}),
							tab === "tasks" && /* @__PURE__ */ jsx(TasksPanel, {}),
							tab === "notifications" && /* @__PURE__ */ jsx(NotificationsPanel, {}),
							tab === "reservations" && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: t("dash.reservations")
									}),
									/* @__PURE__ */ jsx(CardDescription, { children: t("dash.reservationsDesc") }),
									/* @__PURE__ */ jsx("div", {
										className: "w-full sm:max-w-xs",
										children: /* @__PURE__ */ jsx(SearchBox, {
											value: resQuery,
											onChange: setResQuery,
											placeholder: t("dash.search")
										})
									})
								]
							}), /* @__PURE__ */ jsx(CardContent, { children: resGrid.slice.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "py-6 text-sm text-muted-foreground",
								children: t("dash.empty")
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: resGrid.slice.map((r) => /* @__PURE__ */ jsxs("div", {
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
											onClick: async () => {
												await setBookingStatus(r.id, "completed");
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
							}), /* @__PURE__ */ jsx(PaginationBar, {
								total: resGrid.total,
								page: resGrid.page,
								pageSize: resGrid.pageSize,
								pageCount: resGrid.pageCount,
								onPage: resGrid.setPage,
								onPageSize: resGrid.setPageSize
							})] }) })] }),
							tab === "doctors" && /* @__PURE__ */ jsx(DoctorsPanel, {}),
							tab === "services" && /* @__PURE__ */ jsx(ServicesPanel, {}),
							tab === "products" && /* @__PURE__ */ jsx(ProductsPanel, {}),
							tab === "orders" && /* @__PURE__ */ jsx(OrdersPanel, {}),
							tab === "payments" && /* @__PURE__ */ jsx(PaymentsPanel, {}),
							tab === "reviews" && /* @__PURE__ */ jsx(ReviewsPanel, {}),
							tab === "workdays" && /* @__PURE__ */ jsx(WorkdaysPanel, {}),
							tab === "archive" && /* @__PURE__ */ jsx(ArchivePanel, {}),
							tab === "logs" && /* @__PURE__ */ jsx(LogsPanel, {}),
							tab === "settings" && /* @__PURE__ */ jsx(SettingsPanel, {})
						]
					}, tab)
				})
			]
		})]
	});
}
//#endregion
export { DashboardPage as component };
