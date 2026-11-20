import { bt as PawMLogo, d as LanguageToggle, st as useClinicStore } from "./router-DiS3TdB9.js";
import { t as Badge } from "./badge-CwM9eKUb.js";
import { D as useI18n, b as Button, d as currentRole, f as currentUsername, h as logout, p as isAuthed } from "./api-DqDsxEfS.js";
import { t as ShiftBanner } from "./ShiftBanner-BmVXnRSJ.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DRB8aLLv.js";
import { t as Separator } from "./separator-DfSCSBsB.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, User } from "lucide-react";
// src/routes/staff.tsx?tsr-split=component
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
		className: "flex min-h-dvh items-center justify-center bg-muted/40 px-5 py-32",
		children: /* @__PURE__ */ jsx("div", {
			className: "text-sm text-muted-foreground",
			children: t("loading")
		})
	});
	if (currentRole() !== "staff") {
		window.location.href = "/dashboard";
		return null;
	}
	store.workSession;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-dvh bg-muted/40",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex",
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
								children: t("role.staff")
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
export { StaffPage as component };
