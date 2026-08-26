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
import {
  Calendar,
  ListChecks,
  DollarSign,
  Banknote,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
} from "lucide-react";

interface PayrollRecord {
  id: number;
  employee?: { fullName: string } | null;
  periodStart: string;
  periodEnd: string;
  totalSessions?: number;
  totalHours?: number;
  totalBookings?: number;
  totalOrders?: number;
  totalRevenue?: number;
  basePay?: number;
  totalBonuses?: number;
  totalDeductions?: number;
  netPay?: number;
  status: string;
}

export function PayrollPanel() {
  const { t } = useI18n();
  const today = new Date().toISOString().slice(0, 10) || "";
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    periodStart: string;
    periodEnd: string;
  }>({
    periodStart: today,
    periodEnd: today,
  });

  const fetchPayrollRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        periodStart: filter.periodStart,
        periodEnd: filter.periodEnd,
      });
      const response = await api.get<PayrollRecord[]>(`/api/payroll/records?${params}`);
      if (Array.isArray(response)) {
        setRecords(response);
      }
    } catch (error) {
      console.error("Error fetching payroll records:", error);
    } finally {
      setLoading(false);
    }
  }, [filter.periodStart, filter.periodEnd]);

  useEffect(() => {
    fetchPayrollRecords();
  }, [fetchPayrollRecords]);

  const handleDateChange = (type: "start" | "end", dateStr: string) => {
    setFilter((prev) => ({
      ...prev,
      [type === "start" ? "periodStart" : "periodEnd"]: dateStr,
    }));
  };

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
          <Banknote className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{t("dash.payroll")}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <input
              type="date"
              value={filter.periodStart}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="border-input bg-background px-3 py-2 text-sm rounded"
            />
            <span className="mx-2 text-muted-foreground">–</span>
            <input
              type="date"
              value={filter.periodEnd}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="border-input bg-background px-3 py-2 text-sm rounded"
            />
          </div>

          <Button onClick={fetchPayrollRecords} className="btn-primary">
            <ListChecks className="mr-2 h-4 w-4" /> {t("dash.calculate")}
          </Button>

          <Button
            onClick={async () => {
              if (records.length === 0) {
                // No records to broadcast
                return;
              }

              try {
                await api.post("/api/notifications/broadcast", {
                  type: "payroll",
                  title: t("dash.payrollNotificationTitle"),
                  body: t("dash.payrollNotificationBody", {
                    period: `${filter.periodStart} to ${filter.periodEnd}`,
                  }),
                  data: {
                    periodStart: filter.periodStart,
                    periodEnd: filter.periodEnd,
                    recordCount: records.length,
                  },
                });

                // Also send email notifications via the payments broadcast endpoint
                await api.post("/api/payments/broadcast");
              } catch (error) {
                console.error("Error broadcasting payroll:", error);
              }
            }}
            className="btn-secondary"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("dash.notifyStaff")}
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">{t("dash.noPayrollRecords")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-x-4">
            <thead>
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="w-20">{t("dash.name")}</th>
                <th className="w-16">{t("dash.period")}</th>
                <th className="w-16">{t("dash.sessions")}</th>
                <th className="w-16">{t("dash.hours")}</th>
                <th className="w-16">{t("dash.bookings")}</th>
                <th className="w-16">{t("dash.orders")}</th>
                <th className="w-16">{t("dash.revenue")}</th>
                <th className="w-16">{t("dash.basePay")}</th>
                <th className="w-16">{t("dash.bonuses")}</th>
                <th className="w-16">{t("dash.deductions")}</th>
                <th className="w-20">{t("dash.netPay")}</th>
                <th className="w-16">{t("dash.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-muted">
                  <td className="py-3">{record.employee?.fullName || "Unknown"}</td>
                  <td className="py-3 text-center">
                    {formatDate(record.periodStart)} – {formatDate(record.periodEnd)}
                  </td>
                  <td className="py-3 text-center">
                    {record.totalSessions?.toLocaleString() ?? "0"}
                  </td>
                  <td className="py-3 text-right">
                    {(record.totalHours ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    h
                  </td>
                  <td className="py-3 text-center">
                    {record.totalBookings?.toLocaleString() ?? "0"}
                  </td>
                  <td className="py-3 text-center">
                    {record.totalOrders?.toLocaleString() ?? "0"}
                  </td>
                  <td className="py-3 text-right">
                    {t("dash.egp")}
                    {(record.totalRevenue ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    {t("dash.egp")}
                    {(record.basePay ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    {t("dash.egp")}
                    {(record.totalBonuses ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    {t("dash.egp")}
                    {(record.totalDeductions ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    {t("dash.egp")}
                    {(record.netPay ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 flex justify-center space-x-2">
                    {record.status === "calculated" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateRecordStatus(record.id, "pending_approval")}
                        title={t("dash.submitForApproval")}
                      >
                        <ListChecks className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    )}
                    {record.status === "pending_approval" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateRecordStatus(record.id, "approved")}
                          title={t("dash.approve")}
                        >
                          <Check className="h-3 w-3 text-success" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateRecordStatus(record.id, "rejected")}
                          title={t("dash.reject")}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </>
                    )}
                    {(record.status === "approved" || record.status === "paid") && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateRecordStatus(record.id, "paid")}
                        title={t("dash.markAsPaid")}
                      >
                        <DollarSign className="h-3 w-3 text-success" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateRecordAmount(record.id)}
                      title={t("dash.adjustAmount")}
                    >
                      <Edit className="h-3 w-3 text-muted-foreground" />
                    </Button>
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

// Helper functions for updating records
async function updateRecordStatus(id: number, status: string) {
  try {
    await api.patch(`/api/payroll/records/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating payroll record status:", error);
  }
}

async function updateRecordAmount(id: number) {
  console.log("Opening amount adjustment modal for record", id);
}
