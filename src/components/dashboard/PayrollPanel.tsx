import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Banknote,
  Calendar,
  Check,
  CircleDollarSign,
  DiamondPlus,
  Edit,
  ListChecks,
  Minus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import { api } from "@/lib/api";
import { currentRole } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Field } from "./dashboard-helpers";
import { localISODate } from "./dashboard-format";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

type PayrollStatus = "calculated" | "pending_approval" | "approved" | "paid" | "rejected";

interface PayrollRecord {
  id: string;
  employee?: { id: string; fullName: string; role?: string } | null;
  periodStart: string;
  periodEnd: string;
  totalSessions?: number;
  totalHours?: number;
  totalBookings?: number;
  totalOrders?: number;
  totalRevenue?: number;
  basePay?: number;
  commissionPay?: number;
  totalBonuses?: number;
  totalDeductions?: number;
  netPay?: number;
  status: PayrollStatus;
  _searchName?: string;
}

interface CalculateResponse {
  records: unknown[];
  count: number;
}

type RequestStatus = "pending" | "approved" | "rejected";
type RequestType = "bonus" | "deduction";

interface BonusDeductionRequest {
  id: string;
  type: RequestType;
  amount: number;
  reason: string;
  status: RequestStatus;
  requestedBy: string;
  reviewedBy?: string | null;
  adminComment?: string | null;
  createdAt: string;
}

function currentRange(): { start: string; end: string } {
  const now = new Date();
  // toISOString() would shift these local dates across a day boundary for users
  // outside UTC, producing an off-by-one period (typically the previous month).
  return {
    start: localISODate(new Date(now.getFullYear(), now.getMonth(), 1)),
    end: localISODate(now),
  };
}

const STATUS_STYLES: Record<PayrollStatus, string> = {
  calculated: "bg-muted text-muted-foreground",
  pending_approval: "bg-amber-500/15 text-amber-600",
  approved: "bg-success/15 text-success",
  paid: "bg-primary/15 text-primary",
  rejected: "bg-destructive/15 text-destructive line-through",
};

const REQUEST_STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-500/15 text-amber-600",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

function AdjustAmountDialog({
  record,
  onClose,
  onSaved,
}: {
  record: PayrollRecord;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [basePay, setBasePay] = useState(String(record.basePay ?? ""));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    const raw = basePay.trim();
    const value = Number.parseFloat(raw);
    if (!raw || !Number.isFinite(value) || value < 0) {
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

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dash.adjustAmountTitle")}</DialogTitle>
          <DialogDescription>{t("dash.adjustAmountHint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.basePay")}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={basePay}
              onChange={(e) => setBasePay(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label={t("dash.commission")}
              value={`${t("dash.egp")}${(record.commissionPay ?? 0).toLocaleString()}`}
            />
            <Stat
              label={t("dash.netPay")}
              value={`${t("dash.egp")}${(record.netPay ?? 0).toLocaleString()}`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t("payments.cancel")}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? t("payments.saving") : t("dash.submitAmount")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BonusDeductionDialog({
  record,
  isAdmin,
  onClose,
  onChanged,
}: {
  record: PayrollRecord;
  isAdmin: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const [requests, setRequests] = useState<BonusDeductionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<RequestType>("bonus");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<BonusDeductionRequest[] | { data: BonusDeductionRequest[] }>(
        `/api/payroll/${record.id}/requests`,
      );
      setRequests(Array.isArray(res) ? res : (res?.data ?? []));
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
    if (saving) return;
    const value = Number.parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0 || !reason.trim()) {
      toast.error(t("dash.errorLoad"));
      return;
    }
    setSaving(true);
    try {
      const path = kind === "bonus" ? "bonus-request" : "deduction-request";
      await api.post(`/api/payroll/${record.id}/${path}`, {
        amount: value,
        reason: reason.trim(),
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

  const review = async (requestId: string, status: "approved" | "rejected") => {
    if (saving) return;
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

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("dash.bonusDeductions")}</DialogTitle>
          <DialogDescription>
            {record.employee?.fullName} · {formatDate(record.periodStart)} –{" "}
            {formatDate(record.periodEnd)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={kind === "bonus" ? "default" : "outline"}
                className="h-7"
                onClick={() => setKind("bonus")}
              >
                <DiamondPlus className="mr-1.5 size-3.5" />
                {t("dash.requestBonus")}
              </Button>
              <Button
                size="sm"
                variant={kind === "deduction" ? "default" : "outline"}
                className="h-7"
                onClick={() => setKind("deduction")}
              >
                <Minus className="mr-1.5 size-3.5" />
                {t("dash.requestDeduction")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("dash.requestAmount")}>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>
              <Field label={t("dash.requestReason")}>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("dash.requestReasonPlaceholder")}
                />
              </Field>
            </div>
            <Button type="button" className="mt-3" size="sm" onClick={submit} disabled={saving}>
              <ListChecks className="mr-1.5 size-3.5" />
              {saving ? t("dash.saving") : t("dash.submitRequest")}
            </Button>
          </div>

          <div className="space-y-2">
            {loading && <p className="py-4 text-sm text-muted-foreground">{t("dash.loading")}</p>}
            {!loading && requests.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">{t("dash.requestsEmpty")}</p>
            )}
            {requests.map((r) => (
              <div key={r.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-transparent",
                        r.type === "bonus"
                          ? "bg-success/15 text-success"
                          : "bg-destructive/15 text-destructive",
                      )}
                    >
                      {r.type === "bonus" ? t("dash.bonuses") : t("dash.deductions")}
                    </Badge>
                    <span className="text-sm font-bold">
                      {t("dash.egp")}
                      {r.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.reason}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("border-transparent", REQUEST_STATUS_STYLES[r.status])}
                    >
                      {t(`dash.requestStatus.${r.status}`)}
                    </Badge>
                    {isAdmin && r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                          disabled={saving}
                          onClick={() => review(r.id, "approved")}
                        >
                          <Check className="size-3.5 text-success" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                          disabled={saving}
                          onClick={() => review(r.id, "rejected")}
                        >
                          <X className="size-3.5 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("dash.requestedBy")}: {r.requestedBy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("payments.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PayrollPanel() {
  const { t } = useI18n();
  const role = currentRole();
  const isAdmin = role === "admin";
  const initialRange = useMemo(currentRange, []);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PayrollStatus>("all");
  const [range, setRange] = useState(initialRange);
  const [adjusting, setAdjusting] = useState<PayrollRecord | null>(null);
  const [bonusDialog, setBonusDialog] = useState<PayrollRecord | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    record: PayrollRecord;
    status: PayrollStatus;
  } | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [confirmNotify, setConfirmNotify] = useState(false);
  const { sort, toggle } = useSortState("createdAt", "desc");

  const fetchPayrollRecords = useCallback(async (silent = false) => {
    // Silent refreshes after a mutation keep the panel mounted instead of
    // replacing it with the full-screen loading spinner.
    if (!silent) setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        periodStart: range.start,
        periodEnd: range.end,
        limit: "200",
      });
      const response = await api.get<PayrollRecord[] | { data: PayrollRecord[] }>(
        `/api/payroll/records?${params}`,
      );
      setRecords(Array.isArray(response) ? response : (response?.data ?? []));
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
    if (calculating) return;
    setCalculating(true);
    try {
      const res = await api.post<CalculateResponse>("/api/work-sessions/calculate", {
        periodStart: range.start,
        periodEnd: range.end,
      });
      toast.success(
        t("dash.toast.calculated", { count: String(res?.count ?? res?.records?.length ?? 0) }),
      );
      await fetchPayrollRecords();
    } catch (err) {
      console.error("Error calculating payroll:", err);
      toast.error(t("dash.toast.calcFailed"));
    } finally {
      setCalculating(false);
    }
  }, [range, fetchPayrollRecords, t, calculating]);

  const handleStatusChange = useCallback(
    async (record: PayrollRecord, status: PayrollStatus) => {
      if (actingId) return;
      setActingId(record.id);
      try {
        await api.patch(`/api/payroll/records/${record.id}/status`, { status });
        toast.success(t("dash.toast.statusUpdated"));
        setPendingStatus(null);
        await fetchPayrollRecords(true);
      } catch (err) {
        console.error("Error updating payroll record status:", err);
        toast.error(t("dash.errorLoad"));
      } finally {
        setActingId(null);
      }
    },
    [actingId, fetchPayrollRecords, t],
  );

  const handleNotify = useCallback(async () => {
    if (records.length === 0 || notifying) return;
    setNotifying(true);
    try {
      await api.post("/api/notifications/broadcast", {
        type: "payroll",
        title: t("dash.payrollNotificationTitle"),
        body: t("dash.payrollNotificationBody", {
          period: `${formatDate(range.start)} – ${formatDate(range.end)}`,
        }),
        data: {
          periodStart: range.start,
          periodEnd: range.end,
          recordCount: records.length,
        },
      });
      toast.success(t("dash.toast.notified"));
      setConfirmNotify(false);
    } catch (err) {
      console.error("Error broadcasting payroll:", err);
      toast.error(t("dash.toast.notifyFailed"));
    } finally {
      setNotifying(false);
    }
  }, [records.length, range, t, notifying]);

  const filtered = useMemo(
    () => (statusFilter === "all" ? records : records.filter((r) => r.status === statusFilter)),
    [records, statusFilter],
  );

  const searchable = useMemo(
    () =>
      filtered.map((r) => ({
        ...r,
        _searchName: r.employee?.fullName ?? String(r.id ?? ""),
      })),
    [filtered],
  );

  const comparators: Record<string, (a: PayrollRecord, b: PayrollRecord) => number> = {
    // Comparators are ascending; sortedSlice reverses them for "desc".
    createdAt: (a, b) =>
      new Date(a.periodStart ?? 0).getTime() - new Date(b.periodStart ?? 0).getTime(),
    total: (a, b) => (a.netPay ?? 0) - (b.netPay ?? 0),
    commission: (a, b) => (a.commissionPay ?? 0) - (b.commissionPay ?? 0),
  };

  const sorted = sortedSlice(searchable, sort, comparators);
  const grid = useGrid(sorted, query, ["_searchName", "id"] as (keyof PayrollRecord)[]);

  const money = (n?: number) => `${t("dash.egp")}${(n ?? 0).toLocaleString()}`;
  const hours = (n?: number) =>
    (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="flex space-x-2" aria-hidden>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16">
          <p className="text-sm text-muted-foreground">{t("dash.errorLoad")}</p>
          <Button variant="outline" onClick={() => fetchPayrollRecords()}>
            {t("dash.retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Banknote className="size-4 text-muted-foreground" />
          {t("dash.payroll")}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-muted-foreground" />
            <input
              type="date"
              value={range.start}
              onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="date"
              value={range.end}
              onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={handleCalculate} disabled={calculating}>
            <ListChecks className="mr-2 size-4" />
            {calculating ? t("dash.calculating") : t("dash.calculate")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmNotify(true)}
            disabled={records.length === 0}
          >
            <Edit className="mr-2 size-4" />
            {t("dash.notifyStaff")}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chip(statusFilter === "all")}
              onClick={() => {
                setStatusFilter("all");
                grid.setPage(1);
              }}
            >
              {t("dash.payrollFilterAll")}
            </button>
            {(Object.keys(STATUS_STYLES) as PayrollStatus[]).map((s) => (
              <button
                type="button"
                key={s}
                className={chip(statusFilter === s)}
                onClick={() => {
                  setStatusFilter(s);
                  grid.setPage(1);
                }}
              >
                {t(`dash.payrollStatus.${s}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.period")}
              active={sort.key === "createdAt"}
              dir={sort.dir}
              onToggle={() => toggle("createdAt", true)}
            />
            <SortChip
              label={t("dash.netPay")}
              active={sort.key === "total"}
              dir={sort.dir}
              onToggle={() => toggle("total", true)}
            />
            <SortChip
              label={t("dash.commission")}
              active={sort.key === "commission"}
              dir={sort.dir}
              onToggle={() => toggle("commission", true)}
            />
          </div>
        </div>

        {grid.slice.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("dash.noPayrollRecords")}
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {grid.slice.map((record) => (
                <div key={record.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{record.employee?.fullName || "—"}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(record.periodStart)} – {formatDate(record.periodEnd)}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("mt-1.5 border-transparent", STATUS_STYLES[record.status])}
                      >
                        {t(`dash.payrollStatus.${record.status}`)}
                      </Badge>
                    </div>
                    <div className="text-end">
                      <p className="text-lg font-bold">{money(record.netPay)}</p>
                      <p className="text-xs text-muted-foreground">{t("dash.netPay")}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <Stat
                      label={t("dash.sessions")}
                      value={(record.totalSessions ?? 0).toLocaleString()}
                    />
                    <Stat label={t("dash.hours")} value={`${hours(record.totalHours)}h`} />
                    <Stat label={t("dash.basePay")} value={money(record.basePay)} />
                    <Stat label={t("dash.commission")} value={money(record.commissionPay)} />
                    <Stat label={t("dash.bonuses")} value={money(record.totalBonuses)} />
                    <Stat label={t("dash.deductions")} value={money(record.totalDeductions)} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {record.status === "calculated" && (isAdmin || role === "payroll") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={actingId === record.id}
                        onClick={() => handleStatusChange(record, "pending_approval")}
                      >
                        <ListChecks className="mr-1.5 size-3.5" />
                        {t("dash.submitForApproval")}
                      </Button>
                    )}
                    {record.status === "pending_approval" && isAdmin && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          disabled={actingId === record.id}
                          onClick={() => handleStatusChange(record, "approved")}
                        >
                          <Check className="mr-1.5 size-3.5 text-success" />
                          {t("dash.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          disabled={actingId === record.id}
                          onClick={() => handleStatusChange(record, "rejected")}
                        >
                          <X className="mr-1.5 size-3.5 text-destructive" />
                          {t("dash.reject")}
                        </Button>
                      </>
                    )}
                    {record.status === "approved" && isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={actingId === record.id}
                        onClick={() => setPendingStatus({ record, status: "paid" })}
                      >
                        <CircleDollarSign className="mr-1.5 size-3.5 text-success" />
                        {t("dash.markAsPaid")}
                      </Button>
                    )}
                    {isAdmin && record.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7"
                        disabled={actingId === record.id}
                        onClick={() => setAdjusting(record)}
                      >
                        <Edit className="mr-1.5 size-3.5" />
                        {t("dash.adjustAmount")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7"
                      onClick={() => setBonusDialog(record)}
                    >
                      <DiamondPlus className="mr-1.5 size-3.5" />
                      {t("dash.bonusDeductions")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              total={grid.total}
              page={grid.page}
              pageSize={grid.pageSize}
              pageCount={grid.pageCount}
              onPage={grid.setPage}
              onPageSize={grid.setPageSize}
            />
          </>
        )}
      </CardContent>

      {adjusting && (
        <AdjustAmountDialog
          record={adjusting}
          onClose={() => setAdjusting(null)}
          onSaved={fetchPayrollRecords}
        />
      )}
      {bonusDialog && (
        <BonusDeductionDialog
          record={bonusDialog}
          isAdmin={isAdmin}
          onClose={() => setBonusDialog(null)}
          onChanged={() => fetchPayrollRecords(true)}
        />
      )}
      <ConfirmActionDialog
        open={pendingStatus !== null}
        title={t("dash.markAsPaid")}
        description={t("dash.confirmMarkPaid")}
        busy={actingId !== null}
        onConfirm={() =>
          pendingStatus ? handleStatusChange(pendingStatus.record, pendingStatus.status) : undefined
        }
        onClose={() => !actingId && setPendingStatus(null)}
      />
      <ConfirmActionDialog
        open={confirmNotify}
        title={t("dash.notifyStaff")}
        description={t("dash.confirmNotify")}
        busy={notifying}
        onConfirm={handleNotify}
        onClose={() => !notifying && setConfirmNotify(false)}
      />
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
