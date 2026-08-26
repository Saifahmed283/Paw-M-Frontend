import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Calendar, Clock, DollarSign, ListChecks } from "lucide-react";

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
  sessions: number;
  hours: number;
  bookings: number;
  orders: number;
  revenue: number;
  basePay: number;
  grossPay: number;
}

interface EmployeeWithKPI extends Employee, EmployeeKPI {}

export function StaffOverviewPanel() {
  const { t } = useI18n();
  const [staff, setStaff] = useState<EmployeeWithKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    role: "all" | "admin" | "payroll" | "staff";
    period: "today" | "week" | "month";
  }>({ role: "all", period: "week" });

  const fetchStaffOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Employee[]>("/api/employees");
      if (Array.isArray(response)) {
        const filtered =
          filter.role === "all" ? response : response.filter((emp) => emp.role === filter.role);

        const staffWithKPI = await Promise.all(
          filtered.map(async (emp) => {
            try {
              const periodEnd = new Date().toISOString().split("T")[0] || "";
              let periodStart = "";

              if (filter.period === "today") {
                periodStart = periodEnd;
              } else if (filter.period === "week") {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                periodStart = weekAgo.toISOString().split("T")[0] || "";
              } else {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                periodStart = monthAgo.toISOString().split("T")[0] || "";
              }

              const kpiResponse = await api.get<EmployeeKPI>(
                `/api/work-sessions/admin/kpi?userId=${emp.id}&periodStart=${periodStart}&periodEnd=${periodEnd}`,
              );

              return {
                ...emp,
                ...kpiResponse,
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
                grossPay: 0,
              } as EmployeeWithKPI;
            }
          }),
        );

        setStaff(staffWithKPI);
      }
    } catch (error) {
      console.error("Error fetching staff overview:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStaffOverview();
  }, [fetchStaffOverview]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{t("dash.staffOverview")}</h2>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
                <span className="ml-2 text-xs">
                  {filter.period === "today"
                    ? t("dash.today")
                    : filter.period === "week"
                      ? t("dash.thisWeek")
                      : t("dash.thisMonth")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, period: "today" }))}>
                {t("dash.today")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, period: "week" }))}>
                {t("dash.thisWeek")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, period: "month" }))}>
                {t("dash.thisMonth")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Users className="h-4 w-4" />
                <span className="ml-2 text-xs">
                  {filter.role === "all"
                    ? t("dash.allRoles")
                    : filter.role === "admin"
                      ? t("auth.role.admin")
                      : filter.role === "payroll"
                        ? t("auth.role.payroll")
                        : t("auth.role.staff")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, role: "all" }))}>
                {t("dash.allRoles")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, role: "admin" }))}>
                {t("auth.role.admin")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, role: "payroll" }))}>
                {t("auth.role.payroll")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter((prev) => ({ ...prev, role: "staff" }))}>
                {t("auth.role.staff")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {staff.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">{t("dash.noStaff")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-x-4">
            <thead>
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="w-20">{t("dash.name")}</th>
                <th className="w-16">{t("dash.role")}</th>
                <th className="w-16">{t("dash.rate")}</th>
                <th className="w-16">{t("dash.sessions")}</th>
                <th className="w-16">{t("dash.hours")}</th>
                <th className="w-16">{t("dash.bookings")}</th>
                <th className="w-16">{t("dash.orders")}</th>
                <th className="w-16">{t("dash.revenue")}</th>
                <th className="w-20">{t("dash.pay")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted">
                  <td className="py-3 flex items-center space-x-3">
                    <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                      {emp.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{emp.fullName}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full">
                      {emp.role === "admin"
                        ? t("auth.role.admin")
                        : emp.role === "payroll"
                          ? t("auth.role.payroll")
                          : t("auth.role.staff")}
                    </span>
                  </td>
                  <td className="py-3">
                    {emp.payRateType === "monthly"
                      ? `${t("dash.egp")}${emp.monthlySalary.toLocaleString()}/${t("dash.month")}`
                      : `${t("dash.egp")}${emp.hourlyRate.toLocaleString()}/${t("dash.hour")}`}
                  </td>
                  <td className="py-3 text-center">{emp.sessions?.toLocaleString() ?? "0"}</td>
                  <td className="py-3 text-right">
                    {(emp.hours ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    h
                  </td>
                  <td className="py-3 text-center">{emp.bookings?.toLocaleString() ?? "0"}</td>
                  <td className="py-3 text-center">{emp.orders?.toLocaleString() ?? "0"}</td>
                  <td className="py-3 text-right">
                    {t("dash.egp")}
                    {(emp.revenue ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    {t("dash.egp")}
                    {(emp.grossPay ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
