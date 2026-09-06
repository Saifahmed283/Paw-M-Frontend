import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive,
  ArrowLeft,
  CalendarClock,
  HeartPulse,
  Lock,
  Radio,
  Stethoscope,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ShiftBanner } from "@/components/dashboard/ShiftBanner";
import { DoctorsPanel } from "@/components/dashboard/DoctorsPanel";
import { ServicesPanel } from "@/components/dashboard/ServicesPanel";
import { ArchivePanel } from "@/components/dashboard/ArchivePanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { ProductsPanel } from "@/components/dashboard/ProductsPanel";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { ReviewsPanel } from "@/components/dashboard/ReviewsPanel";
import { WorkdaysPanel } from "@/components/dashboard/WorkdaysPanel";
import { LogsPanel } from "@/components/dashboard/LogsPanel";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";

import { useI18n } from "@/lib/i18n";
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
import { useNotificationSound } from "@/lib/use-notification-sound";
import { cn } from "@/lib/utils";
import { allowedTabsForRole } from "@/lib/roles";
import { StatusBadge, Field } from "@/components/dashboard/dashboard-helpers";
import { STATUS_OPTIONS, formatDate, formatTime } from "@/components/dashboard/dashboard-format";
import { StatCard, OverviewCard } from "@/components/dashboard/dashboard-shared";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ALL_NAV_ITEMS } from "@/components/dashboard/dashboard-nav";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Staff Dashboard — Paw-M" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: DashboardPage,
});

/* ─── Requests Table ────────────────────────────────────────────────────────── */

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
                    <span className="mb-1 me-1 inline-block rounded-full border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                      {t("dash.emergency.yes")}
                    </span>
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

/* ─── Auth Gate ──────────────────────────────────────────────────────────────── */

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
          onClick={() => (window.location.href = "/")}
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
            <span className="text-xs text-muted-foreground">{t("auth.signInHelp")}</span>
          </div>
        )}

        <Button type="submit" disabled={busy} className="mt-6 w-full shadow-glow">
          {t("auth.unlock")}
        </Button>
      </form>
    </div>
  );
}

/* ─── Overview Tab ───────────────────────────────────────────────────────────── */

function OverviewTab() {
  const { t, lang, tOr } = useI18n();
  const store = useClinicStore();
  const todayISO = new Date().toISOString().slice(0, 10);

  const pendingCount = store.requests.filter((r) => !r.archived && r.status === "pending").length;
  const confirmedCount = store.requests.filter(
    (r) => !r.archived && r.status === "confirmed",
  ).length;
  const completedCount = store.requests.filter(
    (r) => !r.archived && r.status === "completed",
  ).length;

  const stats = [
    {
      label: t("dash.overview.stats.pending"),
      value: pendingCount,
      icon: Radio,
      tone: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    },
    {
      label: t("dash.overview.stats.confirmed"),
      value: confirmedCount,
      icon: CalendarClock,
      tone: "bg-success/10 text-success",
    },
    {
      label: t("dash.overview.stats.completed"),
      value: completedCount,
      icon: HeartPulse,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: t("dash.overview.stats.doctors"),
      value: store.doctors.length,
      icon: Stethoscope,
      tone: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400",
    },
  ];

  const todayAppointments = store.requests
    .filter((r) => !r.archived && r.date === todayISO && r.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time));

  const recent = [...store.requests]
    .filter((r) => !r.archived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
        ))}
      </div>

      <OverviewCard title={t("dash.overview.today")}>
        {todayAppointments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t("dash.overview.noData")}
          </p>
        ) : (
          <div className="space-y-2">
            {todayAppointments.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
                    {r.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {r.petName} <span className="text-muted-foreground">— {r.ownerName}</span>
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
      </OverviewCard>

      <OverviewCard title={t("dash.overview.recent")} description={t("dash.overview.recentDesc")}>
        {recent.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                {recent.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap font-medium">{r.ownerName}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.petName}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(r.date, lang)}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.time}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </OverviewCard>
    </div>
  );
}

/* ─── Requests Tab ───────────────────────────────────────────────────────────── */

function RequestsTab() {
  const { t, lang } = useI18n();
  const store = useClinicStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

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

  return (
    <div className="space-y-4">
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

      <p className="text-xs text-muted-foreground">
        {t("dash.showing", { count: String(reqGrid.total), rows: t("dash.rows") })}
      </p>

      <RequestsTable
        requests={reqGrid.slice}
        onConfirm={confirmReq}
        onCancel={cancelReq}
        onDelete={removeReq}
        onArchive={archiveReq}
      />

      <PaginationBar
        total={reqGrid.total}
        page={reqGrid.page}
        pageSize={reqGrid.pageSize}
        pageCount={reqGrid.pageCount}
        onPage={reqGrid.setPage}
        onPageSize={reqGrid.setPageSize}
      />
    </div>
  );
}

/* ─── Reservations Tab ───────────────────────────────────────────────────────── */

function ReservationsTab() {
  const { t, lang, tOr } = useI18n();
  const store = useClinicStore();
  const [resQuery, setResQuery] = useState("");

  const todayISO = new Date().toISOString().slice(0, 10);
  const upcomingBase = useMemo(
    () =>
      store.requests
        .filter((r) => !r.archived && r.status === "confirmed" && r.date >= todayISO)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [store.requests, todayISO],
  );
  const resGrid = useGrid(upcomingBase, resQuery, ["ownerName", "petName", "doctorName", "phone"]);

  const cancelReq = async (id: string) => {
    await setBookingStatus(id, "cancelled");
    toast.success(t("dash.toast.cancelled"));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("dash.reservationsDesc")}</p>
      <div className="w-full sm:max-w-xs">
        <SearchBox value={resQuery} onChange={setResQuery} placeholder={t("dash.search")} />
      </div>

      {resGrid.slice.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
      ) : (
        <>
          <div className="space-y-3">
            {resGrid.slice.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {formatDate(r.date, lang)} · {r.time}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) — {r.ownerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.doctorName}</p>
                    {r.emergency && (
                      <span className="mt-2 inline-block rounded-full border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                        {t("dash.emergency.yes")}
                      </span>
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
    </div>
  );
}

/* ─── Main Dashboard Page ────────────────────────────────────────────────────── */

function DashboardPage() {
  const { t } = useI18n();
  const store = useClinicStore();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string>("staff");
  const [tab, setTab] = useState<string>("overview");

  const orderCount = store.orders.filter((o) => !o.archived).length;
  const pendingRequestCount = store.requests.filter(
    (r) => !r.archived && r.status === "pending",
  ).length;

  useEffect(() => {
    if (isAuthed()) {
      setAuthed(true);
      setRole(currentRole());
      const firstAllowed = ALL_NAV_ITEMS.find((i) =>
        allowedTabsForRole(store.settings?.rolePermissions, currentRole()).includes(i.id),
      );
      if (firstAllowed) setTab(firstAllowed.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAccess = (tabId: string) =>
    allowedTabsForRole(store.settings?.rolePermissions, role).includes(tabId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (authed && !canAccess(tab)) {
      const fallback = ALL_NAV_ITEMS.find((i) => canAccess(i.id));
      const next = fallback ? fallback.id : "overview";
      if (next !== tab) setTab(next);
    }
  });

  useNotificationSound({
    enabled: authed,
    interval: 30_000,
    getCount: () => orderCount + pendingRequestCount,
    onNewItems: (newCount, prevCount) => {
      const newOrders = store.orders.filter((o) => !o.archived).length;
      const newPending = store.requests.filter((r) => !r.archived && r.status === "pending").length;
      if (newOrders > prevCount || newPending > prevCount) {
        toast.info(t("dash.notificationNew"));
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

  return (
    <DashboardLayout activeTab={tab} onTabChange={setTab} canAccess={canAccess}>
      <ShiftBanner />

      {tab === "overview" && <OverviewTab />}
      {tab === "requests" && <RequestsTab />}
      {tab === "reservations" && <ReservationsTab />}

      {tab === "staff-overview" && <StaffOverviewPanel />}
      {tab === "payroll" && <PayrollPanel />}
      {tab === "doctors" && <DoctorsPanel />}
      {tab === "services" && <ServicesPanel />}
      {tab === "products" && <ProductsPanel />}
      {tab === "orders" && <OrdersPanel />}
      {tab === "reviews" && <ReviewsPanel />}
      {tab === "workdays" && <WorkdaysPanel />}
      {tab === "archive" && <ArchivePanel />}
      {tab === "logs" && <LogsPanel />}
      {tab === "settings" && <SettingsPanel />}
    </DashboardLayout>
  );
}
