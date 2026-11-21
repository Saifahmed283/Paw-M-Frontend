import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive,
  Banknote,
  CalendarClock,
  HeartPulse,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollText } from "lucide-react";

// Dashboard Panels
import { PayrollPanel } from "@/components/dashboard/PayrollPanel";
import { PaymentsPanel } from "@/components/dashboard/PaymentsPanel";
import { PaymentVerificationPanel } from "@/components/dashboard/PaymentVerificationPanel";
import { ClientsPanel } from "@/components/dashboard/ClientsPanel";
import { ShiftBanner } from "@/components/dashboard/ShiftBanner";
import { DoctorsPanel } from "@/components/dashboard/DoctorsPanel";
import { ServicesPanel } from "@/components/dashboard/ServicesPanel";
import { PrescriptionsPanel } from "@/components/dashboard/PrescriptionsPanel";
import { ArchivePanel } from "@/components/dashboard/ArchivePanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { ProductsPanel } from "@/components/dashboard/ProductsPanel";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { ReviewsPanel } from "@/components/dashboard/ReviewsPanel";
import { WorkdaysPanel } from "@/components/dashboard/WorkdaysPanel";
import { LogsPanel } from "@/components/dashboard/LogsPanel";
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";

import { useI18n } from "@/lib/i18n";
import { saveBookingClinical } from "@/lib/client-medical";
import { PrescriptionBuilderDialog } from "@/components/dashboard/PrescriptionBuilderDialog";
import {
  archiveBooking,
  createPaymentRequest,
  deleteRequest,
  refreshClinicData,
  setBookingStatus,
  useClinicStore,
  type BookingRequest,
  type ServiceItem,
  type Status,
} from "@/lib/clinic-store";
import { changeCredentials, currentRole, currentUsername, isAuthed, logout } from "@/lib/auth";
import { useNotificationSound } from "@/lib/use-notification-sound";
import { cn } from "@/lib/utils";
import { allowedTabsForRole } from "@/lib/roles";
import { StatusBadge } from "@/components/dashboard/dashboard-helpers";
import { StaffAuthGate } from "@/components/auth/StaffAuthGate";
import {
  STATUS_OPTIONS,
  clinicTodayISO,
  formatDate,
  formatMoney,
  formatTime,
} from "@/components/dashboard/dashboard-format";
import { StatCard, OverviewCard } from "@/components/dashboard/dashboard-shared";
import { StatusOrb } from "@/design-system/primitives/StatusOrb";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ALL_NAV_ITEMS } from "@/components/dashboard/dashboard-nav";
import { DASHBOARD_NAVIGATE_EVENT, type DashboardNavigateDetail } from "@/lib/dashboard-navigation";

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

/* ─── Overview Tab ───────────────────────────────────────────────────────────── */

function OverviewTab() {
  const { t, lang, tOr } = useI18n();
  const store = useClinicStore();
  const todayISO = clinicTodayISO();

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
      tone: "bg-[var(--status-watch-bg)] text-status-watch-ink",
      status: "watch" as const,
    },
    {
      label: t("dash.overview.stats.confirmed"),
      value: confirmedCount,
      icon: CalendarClock,
      tone: "bg-success/10 text-success",
      status: "active" as const,
    },
    {
      label: t("dash.overview.stats.completed"),
      value: completedCount,
      icon: HeartPulse,
      tone: "bg-primary-tint text-primary",
      status: "calm" as const,
    },
    {
      label: t("dash.overview.stats.doctors"),
      value: store.doctors.length,
      icon: Stethoscope,
      tone: "bg-accent-tint text-accent-ink",
      status: "calm" as const,
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-b-[var(--gold-500)] pb-4">
        <span className="inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
          <span className="h-px w-6 bg-[var(--gold-500)]" />
          <StatusOrb tone={pendingCount > 0 ? "watch" : "ok"} size="sm" />
          {t("story.liveStatus")}
        </span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint tabular-nums">
          {formatDate(todayISO, lang)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            tone={s.tone}
            status={s.status}
          />
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/50 p-3 transition-colors hover:border-primary/30 hover:bg-primary-tint/40"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 min-w-14 place-items-center rounded-lg border border-primary/15 bg-primary-tint px-1 font-mono text-xs font-bold text-primary-strong tabular-nums">
                    {r.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {r.petName} <span className="text-ink-faint">— {r.ownerName}</span>
                    </p>
                    <p className="text-xs text-ink-soft">
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
  const [recordFor, setRecordFor] = useState<BookingRequest | null>(null);
  const [rxFor, setRxFor] = useState<BookingRequest | null>(null);
  const [reqPayFor, setReqPayFor] = useState<BookingRequest | null>(null);

  const todayISO = clinicTodayISO();
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
                {(r.diagnosis || r.treatmentNotes) && (
                  <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                    {r.diagnosis && (
                      <p className="rounded-lg bg-muted/60 p-2">
                        <span className="font-semibold text-foreground">
                          {t("dash.diagnosis")}:
                        </span>{" "}
                        {r.diagnosis}
                      </p>
                    )}
                    {r.treatmentNotes && (
                      <p className="rounded-lg bg-muted/60 p-2">
                        <span className="font-semibold text-foreground">
                          {t("dash.treatment")}:
                        </span>{" "}
                        {r.treatmentNotes}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
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
                  <Button size="sm" variant="outline" onClick={() => setRecordFor(r)}>
                    <ScrollText className="size-4" /> {t("dash.recordVisit")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRxFor(r)}>
                    <Stethoscope className="size-4" /> {t("dash.writePrescription")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setReqPayFor(r)}>
                    <Banknote className="size-4" /> {t("reservations.reqPayment")}
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

      {recordFor && (
        <ClinicalRecordDialog
          booking={recordFor}
          onClose={() => setRecordFor(null)}
          onSaved={() => setRecordFor(null)}
        />
      )}
      {rxFor && (
        <PrescriptionBuilderDialog
          open
          onClose={() => setRxFor(null)}
          onSaved={() => setRxFor(null)}
          preset={{
            ...(rxFor.petId ? { petId: rxFor.petId } : {}),
            doctorId: rxFor.doctorId,
            bookingId: rxFor.id,
            ...(rxFor.diagnosis ? { diagnosis: rxFor.diagnosis } : {}),
          }}
        />
      )}
      {reqPayFor && <RequestPaymentDialog booking={reqPayFor} onClose={() => setReqPayFor(null)} />}
    </div>
  );
}

function ClinicalRecordDialog({
  booking,
  onClose,
  onSaved,
}: {
  booking: BookingRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [diagnosis, setDiagnosis] = useState(booking.diagnosis ?? "");
  const [treatmentNotes, setTreatmentNotes] = useState(booking.treatmentNotes ?? "");
  const [followUpDate, setFollowUpDate] = useState((booking.followUpDate ?? "").slice(0, 10));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await saveBookingClinical(booking.id, {
        diagnosis: diagnosis.trim(),
        treatmentNotes: treatmentNotes.trim(),
        followUpDate,
      });
      toast.success(t("dash.visitSaved"));
      refreshClinicData();
      onSaved();
    } catch {
      toast.error(t("dash.visitSaveError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("dash.visitRecord", { name: booking.petName })}</DialogTitle>
          <DialogDescription>
            {booking.ownerName} · {booking.doctorName} · {booking.date} {booking.time}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("dash.diagnosis")}
            </Label>
            <Textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder={t("dash.diagnosisPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("dash.treatmentNotes")}
            </Label>
            <Textarea
              rows={3}
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              placeholder={t("dash.treatmentPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("dash.followUp")}
            </Label>
            <Input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("dash.cancel")}
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy ? t("dash.saving") : t("dash.saveVisit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Request Payment Dialog ─────────────────────────────────────────────────── */

type PayItemDraft = { id: string; label: string; amount: number; kind: "service" | "other" };

function RequestPaymentDialog({
  booking,
  onClose,
}: {
  booking: BookingRequest;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { services, settings } = useClinicStore();
  const [items, setItems] = useState<PayItemDraft[]>([]);
  const [customLabel, setCustomLabel] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const pricedServices = services.filter((s) => (s.price ?? 0) > 0);
  const total = items.reduce((sum, it) => sum + it.amount, 0);

  const toggleService = (svc: ServiceItem) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === svc.slug);
      if (existing) return prev.filter((it) => it.id !== svc.slug);
      return [...prev, { id: svc.slug, label: svc.title, amount: svc.price!, kind: "service" }];
    });
  };

  const addCustom = () => {
    const value = Number.parseFloat(customAmount);
    if (!customLabel.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error(t("reservations.noItems"));
      return;
    }
    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, label: customLabel.trim(), amount: value, kind: "other" },
    ]);
    setCustomLabel("");
    setCustomAmount("");
  };

  const setAmount = (id: string, value: string) => {
    const num = Number.parseFloat(value);
    const amount = Number.isFinite(num) && num >= 0 ? num : 0;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, amount } : it)));
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
        date: clinicTodayISO(),
        items: items.map((it) => ({
          label: it.label,
          amount: it.amount,
          kind: it.kind,
          referenceId: it.kind === "service" ? it.id : undefined,
        })),
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

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t("reservations.reqPayment")} — {booking.petName}
          </DialogTitle>
          <DialogDescription>
            {booking.ownerName} · {booking.doctorName} · {formatDate(booking.date, "en")}{" "}
            {booking.time}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <p className="text-xs text-muted-foreground">{t("reservations.requestPaymentDesc")}</p>
          {pricedServices.length > 0 && (
            <div className="grid gap-1.5">
              <p className="text-xs font-semibold text-muted-foreground">
                {t("dash.form.service.title")}
              </p>
              {pricedServices.map((s) => {
                const active = items.some((it) => it.id === s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 font-medium"
                        : "border-border hover:bg-muted/60",
                    )}
                  >
                    <span>{s.title}</span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {formatMoney(s.price!, settings.currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {items.length > 0 && (
            <div className="grid gap-1.5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span>{t("reservations.serviceCol")}</span>
                <span className="w-20 text-end sm:w-28">{t("reservations.amountCol")}</span>
                <span className="w-8" />
              </div>
              {items.map((it) => (
                <div
                  key={it.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2"
                >
                  <span className="min-w-0 truncate text-sm">{it.label}</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={String(it.amount)}
                    onChange={(e) => setAmount(it.id, e.target.value)}
                    className="h-8 w-20 text-end sm:w-28"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="grid gap-1.5 rounded-lg bg-muted/40 p-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("reservations.customService")}
            </p>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <Input
                placeholder={t("reservations.customLabel")}
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder={t("reservations.customAmount")}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-28"
              />
              <Button variant="outline" size="sm" onClick={addCustom}>
                {t("reservations.addLine")}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-semibold">{t("reservations.total")}</span>
            <span className="text-lg font-bold">{formatMoney(total, settings.currency)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("dash.cancel")}
          </Button>
          <Button onClick={send} disabled={busy}>
            {busy ? t("dash.saving") : t("reservations.sendToCashier")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  // Let in-shell components (e.g. the notification bell) request a tab switch.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<DashboardNavigateDetail>).detail;
      if (!detail?.tabId) return;
      if (!allowedTabsForRole(store.settings?.rolePermissions, role).includes(detail.tabId)) return;
      setTab(detail.tabId);
    };
    window.addEventListener(DASHBOARD_NAVIGATE_EVENT, handler);
    return () => window.removeEventListener(DASHBOARD_NAVIGATE_EVENT, handler);
  }, [role, store.settings?.rolePermissions]);

  useNotificationSound({
    enabled: authed,
    interval: 30_000,
    getCount: () => orderCount + pendingRequestCount,
    // The hook only fires when the count actually increased.
    onNewItems: () => {
      toast.info(t("dash.notificationNew"));
    },
  });

  if (!authed) {
    return (
      <StaffAuthGate
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

      {tab === "staff" && <StaffPanel />}
      {tab === "payroll" && <PayrollPanel />}
      {tab === "finance" && <PaymentsPanel />}
      {tab === "payment-verification" && <PaymentVerificationPanel />}
      {tab === "clients" && <ClientsPanel />}
      {tab === "doctors" && <DoctorsPanel />}
      {tab === "services" && <ServicesPanel />}
      {tab === "prescriptions" && <PrescriptionsPanel />}
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
