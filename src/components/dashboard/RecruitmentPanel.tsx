import { useState, type FormEvent } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  role: "admin" | "payroll" | "staff";
  payRateType: "hourly" | "monthly";
  hourlyRate: string;
  monthlySalary: string;
  roleHoursPerDay: string;
  commissionRates: string;
  isActive: boolean;
}

interface AccountFormData {
  username: string;
  password: string;
  role: "admin" | "payroll" | "staff";
}

const DEFAULT_EMPLOYEE: EmployeeFormData = {
  fullName: "",
  email: "",
  phone: "",
  role: "staff",
  payRateType: "hourly",
  hourlyRate: "0",
  monthlySalary: "0",
  roleHoursPerDay: "8",
  commissionRates: "{}",
  isActive: true,
};

const DEFAULT_ACCOUNT: AccountFormData = {
  username: "",
  password: "",
  role: "staff",
};

/** Returns a validated commission-rate object, or null when the text is invalid. */
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

export function RecruitmentPanel() {
  const { t } = useI18n();
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormData>(DEFAULT_EMPLOYEE);
  const [accountForm, setAccountForm] = useState<AccountFormData>(DEFAULT_ACCOUNT);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const handleEmployeeChange = (field: keyof EmployeeFormData, value: string | boolean) => {
    setEmployeeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountChange = (field: keyof AccountFormData, value: string) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
  };

  const createEmployee = async (event: FormEvent) => {
    event.preventDefault();
    if (employeeLoading) return;

    const fullName = employeeForm.fullName.trim();
    const email = employeeForm.email.trim();
    if (!fullName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t("dash.recruitment.invalidEmail"));
      return;
    }

    const hourlyRate = Number.parseFloat(employeeForm.hourlyRate);
    const monthlySalary = Number.parseFloat(employeeForm.monthlySalary);
    if (
      !Number.isFinite(hourlyRate) ||
      hourlyRate < 0 ||
      !Number.isFinite(monthlySalary) ||
      monthlySalary < 0
    ) {
      toast.error(t("dash.recruitment.invalidRate"));
      return;
    }

    const roleHoursPerDay = Number.parseInt(employeeForm.roleHoursPerDay, 10);
    if (!Number.isFinite(roleHoursPerDay) || roleHoursPerDay < 1 || roleHoursPerDay > 24) {
      toast.error(t("dash.recruitment.invalidHours"));
      return;
    }

    const commissionRates = parseCommissionRates(employeeForm.commissionRates);
    if (!commissionRates) {
      toast.error(t("dash.recruitment.invalidCommission"));
      return;
    }

    setEmployeeLoading(true);
    try {
      await api.post("/api/employees", {
        fullName,
        email,
        phone: employeeForm.phone.trim() || null,
        role: employeeForm.role,
        payRateType: employeeForm.payRateType,
        hourlyRate,
        monthlySalary,
        roleHoursPerDay,
        commissionRates,
        isActive: employeeForm.isActive,
      });
      toast.success(t("dash.recruitment.employeeCreated"));
      setEmployeeForm(DEFAULT_EMPLOYEE);
    } catch (err) {
      console.error("Error creating employee:", err);
      toast.error(t("dash.recruitment.error"));
    } finally {
      setEmployeeLoading(false);
    }
  };

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (accountLoading) return;

    const username = accountForm.username.trim().toLowerCase();
    if (username.length < 3) {
      toast.error(t("dash.recruitment.invalidUsername"));
      return;
    }
    if (accountForm.password.length < 6) {
      toast.error(t("auth.passTooShort"));
      return;
    }

    setAccountLoading(true);
    try {
      await api.post("/api/auth/accounts", {
        username,
        password: accountForm.password,
        role: accountForm.role,
      });
      toast.success(t("dash.recruitment.accountCreated"));
      setAccountForm(DEFAULT_ACCOUNT);
    } catch (err) {
      console.error("Error creating account:", err);
      toast.error(t("dash.recruitment.error"));
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus className="size-4 text-muted-foreground" />
          {t("dash.recruitment")}
        </CardTitle>
        <CardDescription>{t("dash.recruitmentDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="employee" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee">{t("dash.recruitment.employee")}</TabsTrigger>
            <TabsTrigger value="account">{t("dash.recruitment.account")}</TabsTrigger>
          </TabsList>

          {/* Employee Form Tab */}
          <form onSubmit={createEmployee}>
            <TabsContent value="employee" className="space-y-6">
              <p className="text-sm text-muted-foreground">{t("dash.recruitment.employeeDesc")}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="employee-fullName">{t("dash.recruitment.fullName")}</Label>
                  <Input
                    id="employee-fullName"
                    value={employeeForm.fullName}
                    onChange={(e) => handleEmployeeChange("fullName", e.target.value)}
                    placeholder={t("dash.recruitment.fullNamePlaceholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee-email">{t("dash.recruitment.email")}</Label>
                  <Input
                    id="employee-email"
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => handleEmployeeChange("email", e.target.value)}
                    placeholder="ahmed@pawm.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee-phone">{t("dash.recruitment.phone")}</Label>
                  <Input
                    id="employee-phone"
                    type="tel"
                    value={employeeForm.phone}
                    onChange={(e) => handleEmployeeChange("phone", e.target.value)}
                    placeholder={t("dash.recruitment.phonePlaceholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee-role">{t("dash.recruitment.role")}</Label>
                  <Select
                    value={employeeForm.role}
                    onValueChange={(v) =>
                      handleEmployeeChange("role", v as EmployeeFormData["role"])
                    }
                  >
                    <SelectTrigger id="employee-role">
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

              <Separator />

              <p className="text-sm font-medium text-muted-foreground">
                {t("dash.recruitment.payRateType")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="employee-payRateType">{t("dash.recruitment.payRateType")}</Label>
                  <Select
                    value={employeeForm.payRateType}
                    onValueChange={(v) =>
                      handleEmployeeChange("payRateType", v as EmployeeFormData["payRateType"])
                    }
                  >
                    <SelectTrigger id="employee-payRateType">
                      <SelectValue placeholder={t("dash.recruitment.payRateType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">{t("dash.recruitment.hourly")}</SelectItem>
                      <SelectItem value="monthly">{t("dash.recruitment.monthly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {employeeForm.payRateType === "hourly" && (
                  <div className="grid gap-2">
                    <Label htmlFor="employee-hourlyRate">{t("dash.recruitment.hourlyRate")}</Label>
                    <Input
                      id="employee-hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={employeeForm.hourlyRate}
                      onChange={(e) => handleEmployeeChange("hourlyRate", e.target.value)}
                      placeholder="50"
                    />
                  </div>
                )}
                {employeeForm.payRateType === "monthly" && (
                  <div className="grid gap-2">
                    <Label htmlFor="employee-monthlySalary">
                      {t("dash.recruitment.monthlySalary")}
                    </Label>
                    <Input
                      id="employee-monthlySalary"
                      type="number"
                      min="0"
                      step="0.01"
                      value={employeeForm.monthlySalary}
                      onChange={(e) => handleEmployeeChange("monthlySalary", e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="employee-roleHoursPerDay">
                    {t("dash.recruitment.roleHoursPerDay")}
                  </Label>
                  <Input
                    id="employee-roleHoursPerDay"
                    type="number"
                    min="1"
                    max="24"
                    value={employeeForm.roleHoursPerDay}
                    onChange={(e) => handleEmployeeChange("roleHoursPerDay", e.target.value)}
                    placeholder="8"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="employee-commissionRates">
                    {t("dash.recruitment.commissionRates")}
                  </Label>
                  <Textarea
                    id="employee-commissionRates"
                    rows={3}
                    value={employeeForm.commissionRates}
                    onChange={(e) => handleEmployeeChange("commissionRates", e.target.value)}
                    placeholder={t("dash.recruitment.commissionPlaceholder")}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="employee-isActive"
                  checked={employeeForm.isActive}
                  onChange={(e) => handleEmployeeChange("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="employee-isActive" className="cursor-pointer text-sm">
                  {t("dash.recruitment.isActive")}
                </Label>
              </div>

              <Button type="submit" disabled={employeeLoading} className="w-full sm:w-auto">
                {employeeLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("dash.saving")}
                  </>
                ) : (
                  t("dash.recruitment.createEmployee")
                )}
              </Button>
            </TabsContent>
          </form>

          {/* Account Form Tab */}
          <form onSubmit={createAccount}>
            <TabsContent value="account" className="space-y-6">
              <p className="text-sm text-muted-foreground">{t("dash.recruitment.accountDesc")}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="account-username">{t("dash.recruitment.username")}</Label>
                  <Input
                    id="account-username"
                    value={accountForm.username}
                    onChange={(e) => handleAccountChange("username", e.target.value)}
                    placeholder={t("dash.recruitment.usernamePlaceholder")}
                    minLength={3}
                    autoComplete="username"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-role">{t("dash.recruitment.role")}</Label>
                  <Select
                    value={accountForm.role}
                    onValueChange={(v) => handleAccountChange("role", v)}
                  >
                    <SelectTrigger id="account-role">
                      <SelectValue placeholder={t("dash.recruitment.role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">{t("auth.role.staff")}</SelectItem>
                      <SelectItem value="payroll">{t("auth.role.payroll")}</SelectItem>
                      <SelectItem value="admin">{t("auth.role.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="account-password">{t("dash.recruitment.password")}</Label>
                  <Input
                    id="account-password"
                    type="password"
                    value={accountForm.password}
                    onChange={(e) => handleAccountChange("password", e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={accountLoading} className="w-full sm:w-auto">
                {accountLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("dash.saving")}
                  </>
                ) : (
                  t("dash.recruitment.createAccount")
                )}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
