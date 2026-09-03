import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { PawMLogo } from "@/components/PawMMark";
import {
  Archive,
  ArrowLeft,
  Banknote,
  Bell,
  CalendarCheck,
  CalendarClock,
  FolderOpen,
  HeartPulse,
  History,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogOut,
  MessageSquareText,
  Moon,
  Package,
  Radio,
  ScrollText,
  Settings,
  ShoppingBag,
  Stethoscope,
  Sun,
  Trash2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Dashboard Panels
import { StaffOverviewPanel } from "@/components/dashboard/StaffOverviewPanel";
import { PayrollPanel } from "@/components/dashboard/PayrollPanel";
import { TasksPanel } from "@/components/dashboard/TasksPanel";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { useNotificationCount } from "@/lib/use-notification-count";
import { AuditLogPanel } from "@/components/dashboard/AuditLogPanel";
import { ShiftBanner } from "@/components/dashboard/ShiftBanner";
import { DoctorsPanel } from "@/components/dashboard/DoctorsPanel";
import { ServicesPanel } from "@/components/dashboard/ServicesPanel";
import { PaymentsPanel } from "@/components/dashboard/PaymentsPanel";
import { ArchivePanel } from "@/components/dashboard/ArchivePanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { ProductsPanel } from "@/components/dashboard/ProductsPanel";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { ReviewsPanel } from "@/components/dashboard/ReviewsPanel";
import { WorkdaysPanel } from "@/components/dashboard/WorkdaysPanel";
import { LogsPanel } from "@/components/dashboard/LogsPanel";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";
import { useTheme } from "@/lib/use-theme-hook";
import { StatusBadge, Field } from "@/components/dashboard/dashboard-helpers";
import { STATUS_OPTIONS, formatDate, formatTime } from "@/components/dashboard/dashboard-format";
import {
  archiveBooking,
  deleteRequest,
  setBookingStatus,
  useClinicStore,
  type BookingRequest,
  type Status,
} from "@/lib/clinic-store";
import {
  changeCredentials,
  currentRole,
  currentUsername,
  isAuthConfigured,
  isAuthed,
  login,
  logout,
  MIN_PASSWORD,
  MIN_USERNAME,
  register,
  remainingLockMs,
} from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/lib/i18n-components";
import { useNotificationSound } from "@/lib/use-notification-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Staff Dashboard — Paw-M" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: DashboardPage,
});

function RequestsTable({
  requests,
  onConfirm,
  onCancel,
  onDelete,
  onArchive,
}: {
  requests: BookingRequest[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const { t, lang } = useI18n();
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dash.owner")}</TableHead>
            <TableHead>{t("dash.pet")}</TableHead>
            <TableHead>{t("dash.doctor")}</TableHead>
            <TableHead>{t("dash.date")}</TableHead>
            <TableHead>{t("dash.time")}</TableHead>
            <TableHead>{t("dash.requestedAt")}</TableHead>
            <TableHead>{t("dash.notes")}</TableHead>
            <TableHead>{t("dash.statusCol")}</TableHead>
            <TableHead className="text-end">{t("dash.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-sm text-muted-foreground">
                {t("dash.empty")}
              </TableCell>
            </TableRow>
          )}
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="whitespace-nowrap font-medium">{r.ownerName}</div>
                <div className="whitespace-nowrap text-xs text-muted-foreground">{r.phone}</div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap font-medium">{r.petName}</div>
                <div className="text-xs text-muted-foreground">{r.animalType}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{r.doctorName}</TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDate(r.date, lang)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{r.time}</TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatTime(r.createdAt, lang)}
              </TableCell>
              <TableCell className="max-w-[220px]">
                <div className="truncate text-xs text-muted-foreground" title={r.symptoms}>
                  {r.emergency && (
                    <Badge className="mb-1 border-amber-500/30 bg-rose-500/15 text-rose-600">
                      {t("dash.emergency.yes")}
                    </Badge>
                  )}
                  {r.symptoms}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1.5">
                  {r.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => onConfirm(r.id)}
                    >
                      {t("dash.confirmRow")}
                    </Button>
                  )}
                  {r.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => onCancel(r.id)}
                    >
                      {t("dash.cancelRow")}
                    </Button>
                  )}
                  {(r.status === "completed" || r.status === "cancelled") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-muted-foreground hover:text-foreground"
                      aria-label={t("dash.archive")}
                      title={t("dash.archive")}
                      onClick={() => onArchive(r.id)}
                    >
                      <Archive className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-muted-foreground hover:text-destructive"
                    aria-label={t("dash.delete")}
                    onClick={() => onDelete(r.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const NAV_ITEMS: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}[] = [
  { id: "overview", icon: LayoutDashboard, roles: ["all"] },
  { id: "requests", icon: ListChecks, roles: ["all"] },
  { id: "staff-overview", icon: Users, roles: ["admin"] },
  { id: "payroll", icon: Banknote, roles: ["payroll", "admin"] },
  { id: "tasks", icon: ListChecks, roles: ["staff"] },
  { id: "notifications", icon: Bell, roles: ["all"] },
  { id: "reservations", icon: CalendarCheck, roles: ["staff", "payroll", "admin"] },
  { id: "doctors", icon: Users, roles: ["payroll", "admin"] },
  { id: "services", icon: HeartPulse, roles: ["payroll", "admin"] },
  { id: "products", icon: ShoppingBag, roles: ["payroll", "admin"] },
  { id: "orders", icon: Package, roles: ["payroll", "admin"] },
  { id: "reviews", icon: MessageSquareText, roles: ["payroll", "admin"] },
  { id: "workdays", icon: FolderOpen, roles: ["payroll", "admin"] },
  { id: "archive", icon: Archive, roles: ["payroll", "admin"] },
  { id: "logs", icon: History, roles: ["admin"] },
  { id: "audit", icon: ScrollText, roles: ["admin"] },
  { id: "settings", icon: Settings, roles: ["admin"] },
];

function AuthGate({ onUnlocked }: { onUnlocked: (role: string) => void }) {
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockedFor, setLockedFor] = useState(remainingLockMs());
  const [setup, setSetup] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isAuthConfigured()
      .then((configured) => {
        setSetup(!configured);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (setup) {
        if (username.trim().length < MIN_USERNAME) {
          setError(t("auth.usernameTooShort"));
        } else if (password.length < MIN_PASSWORD) {
          setError(t("auth.passTooShort"));
        } else if (password !== confirm) {
          setError(t("auth.mismatch"));
        } else {
          await register(username, password);
          await login(username, password);
          onUnlocked(currentRole());
        }
      } else {
        if (await login(username, password)) {
          onUnlocked(currentRole());
        } else {
          setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
        }
      }
    } catch {
      setError(t("auth.invalidCreds"));
    } finally {
      setBusy(false);
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
        <div className="text-sm text-muted-foreground">…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            window.location.href = "/";
          }}
          className="mb-4 -ms-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4 me-1" /> {t("dash.back")}
        </Button>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">
          {setup ? t("auth.setupTitle") : t("auth.signIn")}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {setup ? t("auth.setupDesc") : t("auth.signInDesc")}
        </p>

        <div className="mt-5 grid gap-4">
          <Field label={t("auth.username")}>
            <Input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.usernamePlaceholder")}
              maxLength={40}
            />
          </Field>
          <Field label={t("auth.password")}>
            <Input
              type="password"
              autoComplete={setup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              maxLength={128}
            />
          </Field>
        </div>

        {setup && (
          <div className="mt-4">
            <Field label={t("auth.setupConfirm")}>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                maxLength={128}
              />
            </Field>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {lockedFor > 0 && (
          <p className="mt-2 text-xs text-amber-600">
            {t("auth.locked", { minutes: String(Math.ceil(lockedFor / 60000)) })}
          </p>
        )}

        {!setup && (
          <div className="mt-3 text-center">
            <Link to="/forgot-password" className="text-sm text-primary underline">
              {t("auth.forgotPassword")}?
            </Link>
          </div>
        )}

        <Button type="submit" disabled={busy} className="mt-6 w-full shadow-glow">
          {t("auth.unlock")}
        </Button>
      </form>
    </div>
  );
}

function DashboardPage() {
  const { t, tOr, lang } = useI18n();
  const store = useClinicStore();
  const { dark, toggle: toggleTheme } = useTheme();
  const unreadNotifications = useNotificationCount();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string>("staff");

  useEffect(() => {
    if (isAuthed()) {
      setAuthed(true);
      setRole(currentRole());
      const firstAllowed = NAV_ITEMS.find(
        (i) => i.roles.includes("all") || i.roles.includes(currentRole()),
      );
      if (firstAllowed) setTab(firstAllowed.id);
    }
  }, []);
  const [tab, setTab] = useState<string>("overview");
  const [query, setQuery] = useState("");
  const [resQuery, setResQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const currentNav = NAV_ITEMS.find((i) => i.id === tab) ?? NAV_ITEMS[0]!;

  const todayISO = new Date().toISOString().slice(0, 10);

  const requests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.requests.filter((r) => {
      if (r.archived) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.ownerName, r.petName, r.doctorName, r.phone, r.symptoms]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [store.requests, query, statusFilter]);

  const reqGrid = useGrid(requests, "", [], 10);

  const upcomingBase = useMemo(
    () =>
      store.requests
        .filter((r) => !r.archived && r.status === "confirmed" && r.date >= todayISO)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [store.requests, todayISO],
  );
  const resGrid = useGrid(upcomingBase, resQuery, ["ownerName", "petName", "doctorName", "phone"]);

  const orderCount = store.orders.filter((o) => !o.archived).length;
  const pendingRequestCount = store.requests.filter(
    (r) => !r.archived && r.status === "pending",
  ).length;

  useNotificationSound({
    enabled: authed,
    interval: 30_000,
    getCount: () => orderCount + pendingRequestCount,
    onNewItems: (newCount, prevCount) => {
      const newOrders = store.orders.filter((o) => !o.archived).length;
      const newPending = store.requests.filter((r) => !r.archived && r.status === "pending").length;
      if (newOrders > prevCount || newPending > prevCount) {
        toast.info("New order or booking received!");
      }
    },
  });

  if (!authed) {
    return (
      <AuthGate
        onUnlocked={(r) => {
          setAuthed(true);
          setRole(r);
        }}
      />
    );
  }

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
  const confirmedCount = store.requests.filter(
    (r) => !r.archived && r.status === "confirmed",
  ).length;
  const completedCount = store.requests.filter(
    (r) => !r.archived && r.status === "completed",
  ).length;

  const stats = [
    {
      key: "dash.overview.stats.pending",
      value: pendingCount,
      icon: Radio,
      tone: "text-amber-500",
    },
    {
      key: "dash.overview.stats.confirmed",
      value: confirmedCount,
      icon: CalendarClock,
      tone: "text-success",
    },
    {
      key: "dash.overview.stats.completed",
      value: completedCount,
      icon: HeartPulse,
      tone: "text-primary",
    },
    {
      key: "dash.overview.stats.doctors",
      value: store.doctors.length,
      icon: Stethoscope,
      tone: "text-violet-500",
    },
  ];

  const confirmReq = async (id: string) => {
    await setBookingStatus(id, "confirmed");
    toast.success(t("dash.toast.confirmed"));
  };
  const cancelReq = async (id: string) => {
    await setBookingStatus(id, "cancelled");
    toast.success(t("dash.toast.cancelled"));
  };
  const removeReq = async (id: string) => {
    await deleteRequest(id);
    toast.success(t("dash.toast.deleted"));
  };
  const archiveReq = async (id: string) => {
    await archiveBooking(id, true);
    toast.success(t("dash.toast.archived"));
  };

  const todayAppointments = store.requests
    .filter((r) => !r.archived && r.date === todayISO && r.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time));

  const recent = [...store.requests]
    .filter((r) => !r.archived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <PawMLogo />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {NAV_ITEMS.filter(
            (item) => item.roles.includes("all") || item.roles.includes(currentRole()),
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                tab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              {tab === item.id && (
                <span className="absolute inset-y-1.5 start-0 w-1 rounded-full bg-primary" />
              )}
              <item.icon className="size-3.5" />
              {t(`dash.${item.id}`)}
              {item.id === "requests" && pendingCount > 0 && (
                <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {pendingCount}
                </span>
              )}
              {item.id === "orders" && store.orders.filter((o) => !o.archived).length > 0 && (
                <span className="ms-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                  {store.orders.filter((o) => !o.archived).length}
                </span>
              )}
              {item.id === "reviews" &&
                store.reviews.filter((r) => r.status === "pending").length > 0 && (
                  <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                    {store.reviews.filter((r) => r.status === "pending").length}
                  </span>
                )}
              {item.id === "notifications" && unreadNotifications > 0 && (
                <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {unreadNotifications}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="shrink-0 space-y-2 border-t border-border p-2.5">
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href="/" onClick={backToSite}>
              {t("dash.back")}
            </a>
          </Button>
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="truncate text-xs font-medium text-muted-foreground"
                title={currentUsername()}
              >
                {currentUsername() || t("auth.staff")}
              </span>
              {role === "admin" && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  Admin
                </Badge>
              )}
              {role === "payroll" && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Payroll
                </Badge>
              )}
              {role === "staff" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Staff
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={toggleTheme}
                title={dark ? t("header.lightMode") : t("header.darkMode")}
              >
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <currentNav.icon className="size-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{t("dash.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("dash.subtitle")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:hidden">
              <label className="sr-only">{t("dash.srSection")}</label>
              <select
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                aria-label={t("dash.title")}
              >
                {NAV_ITEMS.filter(
                  (item) => item.roles.includes("all") || item.roles.includes(currentRole()),
                ).map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(`dash.${item.id}`)}
                  </option>
                ))}
              </select>
              <Button asChild variant="outline" size="sm">
                <a href="/" onClick={backToSite}>
                  {t("dash.back")}
                </a>
              </Button>
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        <ShiftBanner />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((s) => (
                    <Card key={s.key}>
                      <CardContent className="flex items-center justify-between p-5">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">{t(s.key)}</p>
                          <p className="mt-1 text-3xl font-bold">{s.value}</p>
                        </div>
                        <s.icon className={cn("size-6", s.tone)} />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t("dash.overview.today")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todayAppointments.length === 0 ? (
                      <p className="py-4 text-sm text-muted-foreground">
                        {t("dash.overview.noData")}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {todayAppointments.map((r) => (
                          <div
                            key={r.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="grid size-9 place-items-center rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
                                {r.time}
                              </span>
                              <div>
                                <p className="text-sm font-semibold">
                                  {r.petName}{" "}
                                  <span className="text-muted-foreground">— {r.ownerName}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {r.doctorName} · {tOr(`animal.${r.animalType}`, r.animalType)}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await setBookingStatus(r.id, "completed");
                                toast.success(t("dash.toast.completed"));
                              }}
                            >
                              {t("dash.complete")}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{t("dash.overview.recent")}</CardTitle>
                      <CardDescription>{t("dash.overview.recentDesc")}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setTab("requests")}>
                      {t("dash.overview.viewAll")}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recent.length === 0 ? (
                      <p className="py-4 text-sm text-muted-foreground">{t("dash.empty")}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableBody>
                            {recent.map((r) => (
                              <TableRow key={r.id}>
                                <TableCell className="whitespace-nowrap font-medium">
                                  {r.ownerName}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{r.petName}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {formatDate(r.date, lang)}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{r.time}</TableCell>
                                <TableCell>
                                  <StatusBadge status={r.status} />
                                </TableCell>
                                <TableCell className="text-end">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7"
                                    onClick={() => setTab("requests")}
                                  >
                                    {t("dash.openRow")}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === "requests" && (
              <Card>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-base">{t("dash.requests")}</CardTitle>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:max-w-xs">
                      <Input
                        placeholder={t("dash.search")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label={t("dash.search")}
                      />
                    </div>
                    <ToggleGroup
                      type="single"
                      value={statusFilter}
                      onValueChange={(v) => setStatusFilter((v as Status | "all") ?? "all")}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <ToggleGroupItem key={o.value} value={o.value} className="text-xs">
                          {t(o.key)}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <p className="text-xs text-muted-foreground">
                      {t("dash.showing", {
                        count: String(reqGrid.total),
                        rows: t("dash.rows"),
                      })}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setTab("reservations")}>
                      <CalendarCheck className="size-4" /> {t("dash.viewReservations")}
                    </Button>
                  </div>
                  <div className="pt-3">
                    <RequestsTable
                      requests={reqGrid.slice}
                      onConfirm={confirmReq}
                      onCancel={cancelReq}
                      onDelete={removeReq}
                      onArchive={archiveReq}
                    />
                    <div className="pt-3">
                      <PaginationBar
                        total={reqGrid.total}
                        page={reqGrid.page}
                        pageSize={reqGrid.pageSize}
                        pageCount={reqGrid.pageCount}
                        onPage={reqGrid.setPage}
                        onPageSize={reqGrid.setPageSize}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {tab === "staff-overview" && <StaffOverviewPanel />}
            {tab === "payroll" && <PayrollPanel />}
            {tab === "tasks" && <TasksPanel />}
            {tab === "notifications" && <NotificationsPanel />}
            {tab === "reservations" && (
              <Card>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-base">{t("dash.reservations")}</CardTitle>
                  <CardDescription>{t("dash.reservationsDesc")}</CardDescription>
                  <div className="w-full sm:max-w-xs">
                    <SearchBox
                      value={resQuery}
                      onChange={setResQuery}
                      placeholder={t("dash.search")}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {resGrid.slice.length === 0 ? (
                    <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {resGrid.slice.map((r) => (
                          <div key={r.id} className="rounded-xl border border-border p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {formatDate(r.date, lang)} · {r.time}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) —{" "}
                                  {r.ownerName}
                                </p>
                                <p className="text-xs text-muted-foreground">{r.doctorName}</p>
                                {r.emergency && (
                                  <Badge className="mt-2 border-amber-500/30 bg-rose-500/15 text-rose-600">
                                    {t("dash.emergency.yes")}
                                  </Badge>
                                )}
                              </div>
                              <StatusBadge status={r.status} />
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  await setBookingStatus(r.id, "completed");
                                  toast.success(t("dash.toast.completed"));
                                }}
                              >
                                {t("dash.complete")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelReq(r.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                {t("dash.cancelRow")}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <PaginationBar
                        total={resGrid.total}
                        page={resGrid.page}
                        pageSize={resGrid.pageSize}
                        pageCount={resGrid.pageCount}
                        onPage={resGrid.setPage}
                        onPageSize={resGrid.setPageSize}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "doctors" && <DoctorsPanel />}
            {tab === "services" && <ServicesPanel />}
            {tab === "products" && <ProductsPanel />}
            {tab === "orders" && <OrdersPanel />}
            {tab === "payments" && <PaymentsPanel />}
            {tab === "reviews" && <ReviewsPanel />}
            {tab === "workdays" && <WorkdaysPanel />}
            {tab === "archive" && <ArchivePanel />}
            {tab === "logs" && <LogsPanel />}
            {tab === "audit" && <AuditLogPanel />}
            {tab === "settings" && <SettingsPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
