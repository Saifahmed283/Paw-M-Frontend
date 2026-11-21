import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import { api, apiErrorMessage } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDate, localISODate } from "./dashboard-format";

type StaffRole = "admin" | "payroll" | "staff";
type PayType = "hourly" | "monthly";

interface Account {
  id: number;
  username: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
  employeeId: string | null;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: StaffRole;
  payRateType: PayType;
  hourlyRate: number;
  monthlySalary: number;
  roleHoursPerDay: number;
  commissionRates: Record<string, number>;
  isActive: boolean;
}

interface Kpi {
  employeeId?: string | number;
  sessions: number;
  hours: number;
  bookings: number;
  orders: number;
  revenue: number;
  grossPay: number;
}

/** One staff member = one employee profile + its dashboard login + performance. */
interface StaffRow extends Employee {
  accountId: number;
  username: string;
  loginIsActive: boolean;
  createdAt: string;
  linked: boolean;
  sessions: number;
  hours: number;
  bookings: number;
  orders: number;
  revenue: number;
  grossPay: number;
}

interface StaffForm {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: StaffRole;
  payRateType: PayType;
  hourlyRate: string;
  monthlySalary: string;
  roleHoursPerDay: string;
  commissionRates: string;
  isActive: boolean;
}

type StaffAction = { type: "suspend" | "activate" | "delete"; row: StaffRow } | null;

type RoleFilter = "all" | StaffRole;
type StatusFilter = "all" | "active" | "suspended";
type Period = "today" | "week" | "month";

const EMPLOYEE_DEFAULTS: Pick<
  StaffForm,
  "payRateType" | "hourlyRate" | "monthlySalary" | "roleHoursPerDay" | "commissionRates"
> = {
  payRateType: "hourly",
  hourlyRate: "0",
  monthlySalary: "0",
  roleHoursPerDay: "8",
  commissionRates: "{}",
};

const DEFAULT_FORM: StaffForm = {
  fullName: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  role: "staff",
  isActive: true,
  ...EMPLOYEE_DEFAULTS,
};

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "dash.today" },
  { value: "week", label: "dash.last7Days" },
  { value: "month", label: "dash.last30Days" },
];

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "dash.allRoles" },
  { value: "admin", label: "auth.role.admin" },
  { value: "payroll", label: "auth.role.payroll" },
  { value: "staff", label: "auth.role.staff" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "dash.recruitment.allStatus" },
  { value: "active", label: "dash.recruitment.active" },
  { value: "suspended", label: "dash.recruitment.suspended" },
];

const SEARCH_FIELDS: (keyof StaffRow)[] = ["fullName", "email", "phone", "username"];

function periodRange(period: Period): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  if (period === "week") start.setDate(start.getDate() - 6);
  if (period === "month") start.setDate(start.getDate() - 29);
  return { start: localISODate(start), end: localISODate(end) };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Legacy companion emails can contain two @ signs; offer a valid one on edit. */
function editableEmail(email: string, fallback: string): string {
  const value = email.trim();
  if (EMAIL_RE.test(value)) return value;
  const local = fallback
    .replace(/[^A-Za-z0-9._-]+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "")
    .toLowerCase();
  return `${local || "staff"}@paw-m.local`;
}

/** Login-less employee records are active/inactive on their profile alone. */
function isStaffActive(row: StaffRow): boolean {
  return row.accountId > 0 ? row.loginIsActive && row.isActive : row.isActive;
}

function parseCommissionRates(raw: string): Record<string, number> | null {
  try {
    const parsed = JSON.parse(raw.trim() || "{}") as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
      result[key] = value;
    }
    return result;
  } catch {
    return null;
  }
}

export function StaffPanel() {
  const { t, lang } = useI18n();

  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<Period>("week");
  const range = useMemo(() => periodRange(period), [period]);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { sort, toggle } = useSortState("name", "asc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [form, setForm] = useState<StaffForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const [action, setAction] = useState<StaffAction>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [accountsRes, employeesRes, kpisRes] = await Promise.all([
        api.get<{ accounts: Account[] }>("/api/auth/accounts"),
        api.get<Employee[] | { data: Employee[] }>("/api/employees?limit=200"),
        api.get<Kpi[] | { data: Kpi[] }>(
          `/api/work-sessions/admin/kpis?periodStart=${range.start}&periodEnd=${range.end}`,
        ),
      ]);

      const accounts = accountsRes.accounts ?? [];
      const employees = Array.isArray(employeesRes) ? employeesRes : (employeesRes?.data ?? []);
      const kpis = Array.isArray(kpisRes) ? kpisRes : (kpisRes?.data ?? []);
      const kpiByEmployee = new Map(kpis.map((k) => [String(k.employeeId), k]));

      const employeeById = new Map(employees.map((e) => [String(e.id), e]));
      const matchedIds = new Set<string>();

      const merged: StaffRow[] = accounts.map((account) => {
        let employee = account.employeeId
          ? employeeById.get(String(account.employeeId))
          : undefined;
        // Legacy accounts predate the explicit link: match username -> email.
        if (!employee) {
          employee = employees.find(
            (e) => e.email === account.username || e.email.startsWith(`${account.username}@`),
          );
        }
        if (employee) matchedIds.add(String(employee.id));
        const kpi = employee ? kpiByEmployee.get(String(employee.id)) : undefined;

        const base: Employee = employee ?? {
          id: "",
          fullName: account.username,
          email: "",
          phone: null,
          role: account.role,
          payRateType: "hourly",
          hourlyRate: 0,
          monthlySalary: 0,
          roleHoursPerDay: 8,
          commissionRates: {},
          isActive: account.isActive,
        };

        return {
          ...base,
          accountId: account.id,
          username: account.username,
          loginIsActive: account.isActive,
          createdAt: account.createdAt,
          linked: Boolean(employee),
          sessions: kpi?.sessions ?? 0,
          hours: kpi?.hours ?? 0,
          bookings: kpi?.bookings ?? 0,
          orders: kpi?.orders ?? 0,
          revenue: kpi?.revenue ?? 0,
          grossPay: kpi?.grossPay ?? 0,
        };
      });

      // Employee records with no dashboard login are still shown so nothing is
      // hidden, clearly flagged so an admin can decide what to do with them.
      for (const employee of employees) {
        if (matchedIds.has(String(employee.id))) continue;
        const kpi = kpiByEmployee.get(String(employee.id));
        merged.push({
          ...employee,
          accountId: 0,
          username: "",
          loginIsActive: false,
          createdAt: "",
          linked: false,
          sessions: kpi?.sessions ?? 0,
          hours: kpi?.hours ?? 0,
          bookings: kpi?.bookings ?? 0,
          orders: kpi?.orders ?? 0,
          revenue: kpi?.revenue ?? 0,
          grossPay: kpi?.grossPay ?? 0,
        });
      }

      setRows(merged);
    } catch (err) {
      console.error("Error loading staff:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (roleFilter !== "all" && row.role !== roleFilter) return false;
        const active = isStaffActive(row);
        if (statusFilter === "active" && !active) return false;
        if (statusFilter === "suspended" && active) return false;
        return true;
      }),
    [rows, roleFilter, statusFilter],
  );

  const comparators: Record<string, (a: StaffRow, b: StaffRow) => number> = {
    name: (a, b) =>
      (a.fullName ?? "").toLowerCase().localeCompare((b.fullName ?? "").toLowerCase()),
    hours: (a, b) => a.hours - b.hours,
    revenue: (a, b) => a.revenue - b.revenue,
    pay: (a, b) => a.grossPay - b.grossPay,
  };

  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, SEARCH_FIELDS);

  const setField = <K extends keyof StaffForm>(field: K, value: StaffForm[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (row: StaffRow) => {
    setEditing(row);
    setForm({
      fullName: row.fullName ?? "",
      email: editableEmail(row.email ?? "", row.username || row.fullName || "staff"),
      phone: row.phone ?? "",
      username: row.username,
      password: "",
      role: row.role,
      payRateType: row.payRateType,
      hourlyRate: String(row.hourlyRate ?? 0),
      monthlySalary: String(row.monthlySalary ?? 0),
      roleHoursPerDay: String(row.roleHoursPerDay ?? 8),
      commissionRates: JSON.stringify(row.commissionRates ?? {}),
      isActive: row.isActive,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(DEFAULT_FORM);
  };

  const validate = (): boolean => {
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    if (!fullName) {
      toast.error(t("dash.recruitment.requiredName"));
      return false;
    }
    if (!EMAIL_RE.test(email)) {
      toast.error(t("dash.recruitment.invalidEmail"));
      return false;
    }
    const username = form.username.trim().toLowerCase();
    if (username.length < 3) {
      toast.error(t("dash.recruitment.invalidUsername"));
      return false;
    }
    if (!editing && form.password.length < 6) {
      toast.error(t("auth.passTooShort"));
      return false;
    }
    if (editing && form.password && form.password.length < 6) {
      toast.error(t("auth.passTooShort"));
      return false;
    }
    const hourlyRate = Number.parseFloat(form.hourlyRate);
    const monthlySalary = Number.parseFloat(form.monthlySalary);
    if (
      !Number.isFinite(hourlyRate) ||
      hourlyRate < 0 ||
      !Number.isFinite(monthlySalary) ||
      monthlySalary < 0
    ) {
      toast.error(t("dash.recruitment.invalidRate"));
      return false;
    }
    const hours = Number.parseInt(form.roleHoursPerDay, 10);
    if (!Number.isFinite(hours) || hours < 1 || hours > 24) {
      toast.error(t("dash.recruitment.invalidHours"));
      return false;
    }
    if (!parseCommissionRates(form.commissionRates)) {
      toast.error(t("dash.recruitment.invalidCommission"));
      return false;
    }
    return true;
  };

  const employeePayload = () => ({
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    role: form.role,
    payRateType: form.payRateType,
    hourlyRate: Number.parseFloat(form.hourlyRate),
    monthlySalary: Number.parseFloat(form.monthlySalary),
    roleHoursPerDay: Number.parseInt(form.roleHoursPerDay, 10),
    commissionRates: parseCommissionRates(form.commissionRates) ?? {},
    isActive: form.isActive,
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    try {
      const details = employeePayload();
      if (editing && editing.accountId) {
        // One staff member: update the login and the linked profile together.
        await api.patch(`/api/auth/accounts/${editing.accountId}`, {
          username: form.username.trim().toLowerCase(),
          role: form.role,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        });
        if (editing.linked && editing.id) {
          await api.patch(`/api/employees/${editing.id}`, details);
        }
        toast.success(t("dash.recruitment.staffUpdated"));
      } else {
        // Creating a login already provisions its employee profile; then fill
        // that profile with the real details from this single form.
        const created = await api.post<{ employeeId?: string }>("/api/auth/accounts", {
          username: form.username.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        });
        if (created?.employeeId) {
          await api.patch(`/api/employees/${created.employeeId}`, details);
        }
        toast.success(t("dash.recruitment.staffCreated"));
      }
      closeDialog();
      await load();
    } catch (err) {
      toast.error(apiErrorMessage(err, t("dash.recruitment.error")));
      // The login may already have been updated before the profile step failed.
      await load();
    } finally {
      setSaving(false);
    }
  };

  const runAction = async () => {
    if (!action || actionBusy) return;
    const { type, row } = action;
    setActionBusy(true);
    try {
      if (type === "delete") {
        if (row.accountId) await api.delete(`/api/auth/accounts/${row.accountId}`);
        if (row.id) {
          try {
            await api.delete(`/api/employees/${row.id}`);
          } catch {
            // Historical records may reference this employee; suspend instead.
            await api.patch(`/api/employees/${row.id}`, { isActive: false });
          }
        }
        toast.success(t("dash.recruitment.accountDeleted"));
      } else {
        const nextActive = type === "activate";
        if (row.accountId) {
          await api.patch(`/api/auth/accounts/${row.accountId}`, { isActive: nextActive });
        }
        if (row.id) {
          await api.patch(`/api/employees/${row.id}`, { isActive: nextActive });
        }
        toast.success(t("dash.recruitment.accountStatusUpdated"));
      }
      setAction(null);
    } catch (err) {
      toast.error(
        apiErrorMessage(
          err,
          type === "delete"
            ? t("dash.recruitment.deleteFailed")
            : t("dash.recruitment.updateFailed"),
        ),
      );
    } finally {
      setActionBusy(false);
      // A failed second step can still leave the first one applied — always
      // reload so the table shows what the server actually holds.
      await load();
    }
  };

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

  const roleLabel = (role: StaffRole) => t(`auth.role.${role}`);
  const rateLabel = (row: StaffRow) =>
    row.payRateType === "monthly"
      ? `${t("dash.egp")}${(row.monthlySalary ?? 0).toLocaleString()}/${t("dash.month")}`
      : `${t("dash.egp")}${(row.hourlyRate ?? 0).toLocaleString()}/${t("dash.hour")}`;

  const actionTitle =
    action?.type === "suspend"
      ? t("dash.recruitment.suspendAccountTitle")
      : action?.type === "activate"
        ? t("dash.recruitment.activateAccountTitle")
        : t("dash.recruitment.deleteAccountTitle");
  const actionDescription = action
    ? action.type === "suspend"
      ? t("dash.recruitment.suspendAccountConfirm", { name: action.row.fullName })
      : action.type === "activate"
        ? t("dash.recruitment.activateAccountConfirm", { name: action.row.fullName })
        : t("dash.recruitment.deleteAccountConfirm", { name: action.row.fullName })
    : "";

  const formValid =
    form.fullName.trim().length > 0 &&
    EMAIL_RE.test(form.email.trim()) &&
    form.username.trim().length >= 3 &&
    (!form.password || form.password.length >= 6);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-muted-foreground" />
              {t("dash.staff")}
            </CardTitle>
            <CardDescription>{t("dash.recruitmentDesc")}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw className={loading ? "me-2 size-4 animate-spin" : "me-2 size-4"} />
              {t("dash.refresh")}
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus className="me-1 size-4" />
              {t("dash.recruitment.addStaff")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={filterBtn(period === p.value)}
                  onClick={() => setPeriod(p.value)}
                >
                  {t(p.label)}
                </button>
              ))}
            </div>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={filterBtn(roleFilter === r.value)}
                  onClick={() => {
                    setRoleFilter(r.value);
                    grid.setPage(1);
                  }}
                >
                  {t(r.label)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={filterBtn(statusFilter === s.value)}
                  onClick={() => {
                    setStatusFilter(s.value);
                    grid.setPage(1);
                  }}
                >
                  {t(s.label)}
                </button>
              ))}
            </div>
          </div>

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

          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="me-2 size-4 animate-spin" />
              {t("dash.loading")}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-muted-foreground">{t("dash.errorLoad")}</p>
              <Button variant="outline" onClick={() => void load()}>
                {t("dash.retry")}
              </Button>
            </div>
          ) : grid.total === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {rows.length === 0 ? t("dash.noStaff") : t("dash.noResults")}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("dash.recruitment.addStaff")}</TableHead>
                      <TableHead>{t("dash.recruitment.login")}</TableHead>
                      <TableHead>{t("dash.recruitment.role")}</TableHead>
                      <TableHead>{t("dash.recruitment.payRateType")}</TableHead>
                      <TableHead>{t("dash.recruitment.performance")}</TableHead>
                      <TableHead>{t("dash.recruitment.status")}</TableHead>
                      <TableHead className="text-end">{t("dash.recruitment.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grid.slice.map((row) => {
                      const active = isStaffActive(row);
                      return (
                        <TableRow key={row.accountId || `emp-${row.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-xs font-semibold text-primary">
                                {(row.fullName || "?").charAt(0).toUpperCase()}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {row.fullName}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {row.email || row.phone || "—"}
                                </span>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="block text-sm">{row.username || "—"}</span>
                            <span className="block text-xs text-muted-foreground">
                              {row.createdAt
                                ? t("dash.recruitment.createdPrefix", {
                                    date: formatDate(row.createdAt.slice(0, 10), lang),
                                  })
                                : "—"}
                            </span>
                          </TableCell>
                          <TableCell>{roleLabel(row.role)}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {rateLabel(row)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                              <span>
                                {t("dash.hours")}: {fmtHours(row.hours)}
                              </span>
                              <span>
                                {t("dash.revenue")}: {t("dash.egp")}
                                {fmt(row.revenue)}
                              </span>
                              <span>
                                {t("dash.pay")}: {t("dash.egp")}
                                {fmt(row.grossPay)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start gap-1">
                              <Badge
                                variant="outline"
                                className={
                                  row.loginIsActive
                                    ? "border-transparent bg-success/15 text-success"
                                    : "border-transparent bg-muted text-muted-foreground"
                                }
                              >
                                {row.loginIsActive
                                  ? t("dash.recruitment.active")
                                  : t("dash.recruitment.noLogin")}
                              </Badge>
                              {!row.isActive && (
                                <span className="text-[10px] text-muted-foreground">
                                  {t("dash.recruitment.suspended")}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1.5">
                              {row.accountId > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2"
                                  aria-label={t("dash.recruitment.editStaff")}
                                  onClick={() => openEdit(row)}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                aria-label={
                                  active
                                    ? t("dash.recruitment.suspend")
                                    : t("dash.recruitment.activate")
                                }
                                onClick={() =>
                                  setAction({
                                    type: active ? "suspend" : "activate",
                                    row,
                                  })
                                }
                              >
                                {active ? (
                                  <Ban className="size-3.5" />
                                ) : (
                                  <CheckCircle2 className="size-3.5" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                                aria-label={t("dash.delete")}
                                onClick={() => setAction({ type: "delete", row })}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? undefined : closeDialog())}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="size-4 text-muted-foreground" />
                {editing ? t("dash.recruitment.editStaff") : t("dash.recruitment.addStaff")}
              </DialogTitle>
              <DialogDescription>{t("dash.recruitment.staffFormDesc")}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("dash.recruitment.profileSection")}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="staff-fullName">{t("dash.recruitment.fullName")}</Label>
                    <Input
                      id="staff-fullName"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder={t("dash.recruitment.fullNamePlaceholder")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="staff-email">{t("dash.recruitment.email")}</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="ahmed@pawm.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="staff-phone">{t("dash.recruitment.phone")}</Label>
                    <Input
                      id="staff-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder={t("dash.recruitment.phonePlaceholder")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="staff-role">{t("dash.recruitment.role")}</Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) => setField("role", v as StaffRole)}
                    >
                      <SelectTrigger id="staff-role">
                        <SelectValue placeholder={t("dash.recruitment.role")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">{t("auth.role.staff")}</SelectItem>
                        <SelectItem value="payroll">{t("auth.role.payroll")}</SelectItem>
                        <SelectItem value="admin">{t("auth.role.admin")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="staff-payRateType">{t("dash.recruitment.payRateType")}</Label>
                    <Select
                      value={form.payRateType}
                      onValueChange={(v) => setField("payRateType", v as PayType)}
                    >
                      <SelectTrigger id="staff-payRateType">
                        <SelectValue placeholder={t("dash.recruitment.payRateType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">{t("dash.recruitment.hourly")}</SelectItem>
                        <SelectItem value="monthly">{t("dash.recruitment.monthly")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.payRateType === "hourly" ? (
                    <div className="grid gap-2">
                      <Label htmlFor="staff-hourlyRate">{t("dash.recruitment.hourlyRate")}</Label>
                      <Input
                        id="staff-hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.hourlyRate}
                        onChange={(e) => setField("hourlyRate", e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Label htmlFor="staff-monthlySalary">
                        {t("dash.recruitment.monthlySalary")}
                      </Label>
                      <Input
                        id="staff-monthlySalary"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.monthlySalary}
                        onChange={(e) => setField("monthlySalary", e.target.value)}
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="staff-roleHoursPerDay">
                      {t("dash.recruitment.roleHoursPerDay")}
                    </Label>
                    <Input
                      id="staff-roleHoursPerDay"
                      type="number"
                      min="1"
                      max="24"
                      value={form.roleHoursPerDay}
                      onChange={(e) => setField("roleHoursPerDay", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="staff-commissionRates">
                      {t("dash.recruitment.commissionRates")}
                    </Label>
                    <Textarea
                      id="staff-commissionRates"
                      rows={2}
                      value={form.commissionRates}
                      onChange={(e) => setField("commissionRates", e.target.value)}
                      placeholder={t("dash.recruitment.commissionPlaceholder")}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="staff-isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setField("isActive", e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="staff-isActive" className="cursor-pointer text-sm">
                    {t("dash.recruitment.isActive")}
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("dash.recruitment.loginSection")}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="staff-username">{t("dash.recruitment.username")}</Label>
                    <Input
                      id="staff-username"
                      value={form.username}
                      onChange={(e) => setField("username", e.target.value)}
                      placeholder={t("dash.recruitment.usernamePlaceholder")}
                      autoComplete="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="staff-password">
                      {editing ? t("dash.recruitment.newPassword") : t("dash.recruitment.password")}
                    </Label>
                    <Input
                      id="staff-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder={
                        editing ? t("dash.recruitment.newPasswordPlaceholder") : "••••••••"
                      }
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={closeDialog}>
                {t("dash.cancel")}
              </Button>
              <Button type="submit" disabled={saving || !formValid}>
                {saving && <Loader2 className="me-2 size-4 animate-spin" />}
                {editing ? t("dash.recruitment.saveAccount") : t("dash.recruitment.addStaff")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={action !== null} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{actionTitle}</DialogTitle>
            <DialogDescription>{actionDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={actionBusy} onClick={() => setAction(null)}>
              {t("dash.cancel")}
            </Button>
            <Button
              variant={action?.type === "activate" ? "default" : "destructive"}
              disabled={actionBusy}
              onClick={() => void runAction()}
            >
              {actionBusy && <Loader2 className="me-2 size-4 animate-spin" />}
              {action?.type === "suspend"
                ? t("dash.recruitment.suspend")
                : action?.type === "activate"
                  ? t("dash.recruitment.activate")
                  : t("dash.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
