import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Banknote, Calendar, Check, DollarSign, Edit, ListChecks, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type PayrollStatus = "calculated" | "pending_approval" | "approved" | "paid" | "rejected";

interface PayrollRecord {
  id: string;
  employee?: { fullName: string; role?: string } | null;
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

const STATUS_FLOW: Partial<Record<PayrollStatus, PayrollStatus>> = {
  calculated: "pending_approval",
  pending_approval: "approved",
  approved: "paid",
};

function currentRange(): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().slice(0, 10) ?? "";
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10) ?? end;
  return { start, end };
}

const STATUS_STYLES: Record<PayrollStatus, string> = {
  calculated: "bg-muted text-muted-foreground",
  pending_approval: "bg-amber-500/15 text-amber-600",
  approved: "bg-success/15 text-success",
  paid: "bg-primary/15 text-primary",
  rejected: "bg-destructive/15 text-destructive line-through",
};

export function PayrollPanel() {
  const { t } = useI18n();
  const initialRange = useMemo(currentRange, []);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PayrollStatus>("all");
  const [range, setRange] = useState(initialRange);
  const { sort, toggle } = useSortState("createdAt", "desc");

  const fetchPayrollRecords = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ periodStart: range.start, periodEnd: range.end });
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
  }, [range, fetchPayrollRecords, t]);

  const handleStatusChange = useCallback(
    async (record: PayrollRecord, status: PayrollStatus) => {
      setActingId(record.id);
      try {
        await api.patch(`/api/payroll/records/${record.id}/status`, { status });
        toast.success(t("dash.toast.statusUpdated"));
      } catch (err) {
        console.error("Error updating payroll record status:", err);
        toast.error(t("dash.toast.statusUpdated") + " — " + t("dash.errorLoad"));
      } finally {
        setActingId(null);
        await fetchPayrollRecords();
      }
    },
    [fetchPayrollRecords, t],
  );

  const handleAdjustAmount = useCallback(
    async (record: PayrollRecord) => {
      const input = window.prompt(
        `${t("dash.adjustAmount")} (${t("dash.basePay")}):`,
        String(record.basePay ?? ""),
      );
      if (input === null || input.trim() === "") return;
      const basePay = Number(input);
      if (!Number.isFinite(basePay) || basePay < 0) {
        toast.error(t("dash.errorLoad"));
        return;
      }
      setActingId(record.id);
      try {
        await api.patch(`/api/payroll/records/${record.id}/amount`, { basePay });
        toast.success(t("dash.toast.adjusted"));
      } catch (err) {
        console.error("Error adjusting payroll amount:", err);
        toast.error(t("dash.toast.adjusted") + " — " + t("dash.errorLoad"));
      } finally {
        setActingId(null);
        await fetchPayrollRecords();
      }
    },
    [fetchPayrollRecords, t],
  );

  const handleNotify = useCallback(async () => {
    if (records.length === 0) return;
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
      await api.post("/api/payments/broadcast");
      toast.success(t("dash.toast.notified"));
    } catch (err) {
      console.error("Error broadcasting payroll:", err);
      toast.error(t("dash.toast.notified") + " — " + t("dash.errorLoad"));
    }
  }, [records.length, range, t]);

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
    createdAt: (a, b) =>
      new Date(b.periodStart ?? 0).getTime() - new Date(a.periodStart ?? 0).getTime(),
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
          <Button variant="outline" onClick={fetchPayrollRecords}>
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
          <Button variant="outline" onClick={handleNotify} disabled={records.length === 0}>
            <Plus className="mr-2 size-4" />
            {t("dash.notifyStaff")}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            <button
              className={chip(statusFilter === "all")}
              onClick={() => {
                setStatusFilter("all");
                grid.setPage(1);
              }}
            >
              {t("dash.payrollFilterAll")}
            </button>
            {(Object.keys(STATUS_FLOW) as PayrollStatus[]).map((s) => (
              <button
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
                    <Stat label={t("dash.bonuses")} value={money(record.totalBonuses)} />
                    <Stat label={t("dash.deductions")} value={money(record.totalDeductions)} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {record.status === "calculated" && (
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
                    {record.status === "pending_approval" && (
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
                    {(record.status === "approved" || record.status === "paid") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={actingId === record.id}
                        onClick={() => handleStatusChange(record, "paid")}
                      >
                        <DollarSign className="mr-1.5 size-3.5 text-success" />
                        {t("dash.markAsPaid")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7"
                      disabled={actingId === record.id}
                      onClick={() => handleAdjustAmount(record)}
                    >
                      <Edit className="mr-1.5 size-3.5" />
                      {t("dash.adjustAmount")}
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
