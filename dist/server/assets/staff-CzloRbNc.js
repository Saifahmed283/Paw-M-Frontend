import { N as useClinicStore, Q as cn, X as useI18n, Y as LanguageToggle, a as checkOut, i as checkIn, q as Button, y as refreshClinicData } from "./clinic-store-CwRlAe_1.js";
import { E as PawMLogo, d as logout, l as isAuthed, o as currentRole, s as currentUsername } from "./router-odAv7K6C.js";
import { t as Badge } from "./badge-C6bjIBsv.js";
import { a as CardHeader, n as Card, o as CardTitle, r as CardContent, t as Separator } from "./separator-C8y2Ge6P.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { LogIn, LogOut, Timer, User } from "lucide-react";
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
//#region src/routes/staff.tsx?tsr-split=component
function StaffPage() {
	const { t, lang } = useI18n();
	const store = useClinicStore();
	const [authed, setAuthed] = useState(false);
	useEffect(() => {
		if (isAuthed()) setAuthed(true);
		else window.location.href = "/";
	}, []);
	const signOut = () => {
		logout();
		setAuthed(false);
		window.location.href = "/";
	};
	if (!authed) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32",
		children: /* @__PURE__ */ jsx("div", {
			className: "text-sm text-muted-foreground",
			children: "Loading..."
		})
	});
	if (currentRole() !== "staff") {
		window.location.href = "/dashboard";
		return null;
	}
	store.workSession;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen bg-muted/40",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex h-14 shrink-0 items-center border-b border-border px-4",
					children: /* @__PURE__ */ jsx(PawMLogo, {})
				}),
				/* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-0.5 overflow-y-auto p-2.5" }),
				/* @__PURE__ */ jsxs("div", {
					className: "shrink-0 space-y-2 border-t border-border p-2.5",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "w-full",
						children: /* @__PURE__ */ jsx("a", {
							href: "/",
							onClick: () => signOut(),
							children: t("dash.back")
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-2 px-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate text-xs font-medium text-muted-foreground",
								title: currentUsername(),
								children: currentUsername() || t("auth.staff")
							}), /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: "text-[10px] px-1.5 py-0",
								children: "Staff"
							})]
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
								children: /* @__PURE__ */ jsx(User, { className: "size-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: t("dash.title")
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: t("dash.staff_portal")
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 lg:hidden",
							children: [
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ jsx("a", {
										href: "/",
										onClick: () => signOut(),
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
					children: /* @__PURE__ */ jsx(motion.div, {
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
						children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
								className: "text-base",
								children: t("dash.staff.kpi")
							}) }), /* @__PURE__ */ jsxs(CardContent, {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs font-medium text-muted-foreground",
										children: t("dash.staff.today_sessions")
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-2xl font-bold",
										children: 0
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs font-medium text-muted-foreground",
										children: t("dash.staff.earnings_today")
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-2xl font-bold",
										children: 0
									})]
								})]
							})] }), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
								className: "text-base",
								children: t("dash.staff.today_appointments")
							}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: t("dash.loading")
							}) })] })]
						})
					}, "staff")
				})
			]
		})]
	});
}
//#endregion
export { StaffPage as component };
