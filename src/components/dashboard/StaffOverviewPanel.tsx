import { useCallback, useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { localISODate } from "./dashboard-format";

interface Employee {
  id: number | string;
  fullName: string;
  email: string;
  role: "admin" | "payroll" | "staff";
  payRateType: "monthly" | "hourly";
  monthlySalary?: number;
  hourlyRate?: number;
}

interface EmployeeKPI {
  employeeId?: number | string;
  sessions: number;
  hours: number;
  bookings: number;
  orders: number;
  revenue: number;
  commission: number;
  basePay: number;
  grossPay: number;
}

type EmployeeWithKPI = Employee & Partial<EmployeeKPI>;

type RoleFilter = "all" | "admin" | "payroll" | "staff";
type PeriodFilter = "today" | "week" | "month";

const EMPTY_KPI: Omit<EmployeeKPI, "commission"> & { commission: number } = {
  sessions: 0,
  hours: 0,
  bookings: 0,
  orders: 0,
  revenue: 0,
  commission: 0,
  basePay: 0,
  grossPay: 0,
};

function periodRange(period: PeriodFilter): { start: string; end: string } {
  // Use local calendar days throughout — toISOString() shifts the date by a day
  // for users west of UTC and would query the wrong range.
  const end = new Date();
  const start = new Date(end);
  if (period === "week") start.setDate(start.getDate() - 6);
  if (period === "month") start.setDate(start.getDate() - 29);
  return { start: localISODate(start), end: localISODate(end) };
}

const PERIODS: { value: PeriodFilter; label: string }[] = [
  { value: "today", label: "dash.today" },
  { value: "week", label: "dash.last7Days" },
  { value: "month", label: "dash.last30Days" },
];

const SEARCH_FIELDS: (keyof EmployeeWithKPI)[] = ["fullName", "email"];

const ROLES: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "dash.allRoles" },
  { value: "admin", label: "auth.role.admin" },
  { value: "payroll", label: "auth.role.payroll" },
  { value: "staff", label: "auth.role.staff" },
];

export function StaffOverviewPanel() {
  const { t } = useI18n();
  const [staff, setStaff] = useState<EmployeeWithKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [role, setRole] = useState<RoleFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const [query, setQuery] = useState("");
  const { sort, toggle } = useSortState("name", "asc");
  const range = useMemo(() => periodRange(period), [period]);

  const fetchStaffOverview = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [employeesRes, kpisRes] = await Promise.all([
        api.get<Employee[] | { data: Employee[] }>("/api/employees"),
        api.get<EmployeeKPI[] | { data: EmployeeKPI[] }>(
          `/api/work-sessions/admin/kpis?periodStart=${range.start}&periodEnd=${range.end}`,
        ),
      ]);
      const employees = Array.isArray(employeesRes) ? employeesRes : (employeesRes?.data ?? []);
      const kpis = Array.isArray(kpisRes) ? kpisRes : (kpisRes?.data ?? []);
      const kpiByEmployee = new Map(kpis.map((k) => [String(k.employeeId), k]));

      const enriched: EmployeeWithKPI[] = employees.map((emp) => ({
        ...emp,
        ...(kpiByEmployee.get(String(emp.id)) ?? EMPTY_KPI),
      }));
      setStaff(enriched);
    } catch (err) {
      console.error("Error fetching staff overview:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchStaffOverview();
  }, [fetchStaffOverview]);

  const filtered = useMemo(
    () => (role === "all" ? staff : staff.filter((emp) => emp.role === role)),
    [staff, role],
  );

  const comparators: Record<string, (a: EmployeeWithKPI, b: EmployeeWithKPI) => number> = {
    name: (a, b) =>
      (a.fullName ?? "").toLowerCase().localeCompare((b.fullName ?? "").toLowerCase()),
    hours: (a, b) => (a.hours ?? 0) - (b.hours ?? 0),
    revenue: (a, b) => (a.revenue ?? 0) - (b.revenue ?? 0),
    pay: (a, b) => (a.grossPay ?? 0) - (b.grossPay ?? 0),
  };

  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, SEARCH_FIELDS);

  const rateLabel = (emp: Employee) =>
    emp.payRateType === "monthly"
      ? `${t("dash.egp")}${(emp.monthlySalary ?? 0).toLocaleString()}/${t("dash.month")}`
      : `${t("dash.egp")}${(emp.hourlyRate ?? 0).toLocaleString()}/${t("dash.hour")}`;

  const roleLabel = (r: Employee["role"]) =>
    r === "admin"
      ? t("auth.role.admin")
      : r === "payroll"
        ? t("auth.role.payroll")
        : t("auth.role.staff");

  const fmt = (n?: number) => (n ?? 0).toLocaleString();
  const fmtHours = (n?: number) =>
    (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const filterBtn = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
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
          <Button variant="outline" onClick={fetchStaffOverview}>
            {t("dash.retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-muted-foreground" />
            {t("dash.staffOverview")}
          </CardTitle>
          <CardDescription>
            {t("dash.periodRange", { start: range.start, end: range.end })}
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                type="button"
                key={p.value}
                className={filterBtn(period === p.value)}
                onClick={() => {
                  setPeriod(p.value);
                  grid.setPage(1);
                }}
              >
                {t(p.label)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                className={filterBtn(role === r.value)}
                onClick={() => {
                  setRole(r.value);
                  grid.setPage(1);
                }}
              >
                {t(r.label)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.name")}
              active={sort.key === "name"}
              dir={sort.dir}
              onToggle={() => toggle("name")}
            />
            <SortChip
              label={t("dash.hours")}
              active={sort.key === "hours"}
              dir={sort.dir}
              onToggle={() => toggle("hours", true)}
            />
            <SortChip
              label={t("dash.revenue")}
              active={sort.key === "revenue"}
              dir={sort.dir}
              onToggle={() => toggle("revenue", true)}
            />
            <SortChip
              label={t("dash.pay")}
              active={sort.key === "pay"}
              dir={sort.dir}
              onToggle={() => toggle("pay", true)}
            />
          </div>
        </div>

        {grid.slice.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {staff.length === 0 ? t("dash.noStaff") : t("dash.noResults")}
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {grid.slice.map((emp) => (
                <div key={emp.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid size-10 place-items-center rounded-lg bg-primary/20 text-sm font-semibold">
                        {emp.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{emp.fullName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{emp.email}</p>
                        <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {roleLabel(emp.role)}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-xs text-muted-foreground">{rateLabel(emp)}</p>
                      <p className="mt-1 text-lg font-bold">
                        {t("dash.egp")}
                        {fmt(emp.grossPay)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("dash.pay")}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <Stat label={t("dash.sessions")} value={fmt(emp.sessions)} />
                    <Stat label={t("dash.hours")} value={`${fmtHours(emp.hours)}h`} />
                    <Stat label={t("dash.bookings")} value={fmt(emp.bookings)} />
                    <Stat label={t("dash.orders")} value={fmt(emp.orders)} />
                    <Stat label={t("dash.revenue")} value={`${t("dash.egp")}${fmt(emp.revenue)}`} />
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
