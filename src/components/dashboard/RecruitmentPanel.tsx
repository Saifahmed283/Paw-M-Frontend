import { useState } from "react";
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
import { cn } from "@/lib/utils";

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

  const createEmployee = async () => {
    if (!employeeForm.fullName.trim() || !employeeForm.email.trim()) {
      toast.error(t("dash.recruitment.error"));
      return;
    }

    setEmployeeLoading(true);
    try {
      const body = {
        fullName: employeeForm.fullName.trim(),
        email: employeeForm.email.trim(),
        phone: employeeForm.phone.trim() || null,
        role: employeeForm.role,
        payRateType: employeeForm.payRateType,
        hourlyRate: Number.parseFloat(employeeForm.hourlyRate) || 0,
        monthlySalary: Number.parseFloat(employeeForm.monthlySalary) || 0,
        roleHoursPerDay: Number.parseInt(employeeForm.roleHoursPerDay, 10) || 8,
        commissionRates: JSON.parse(employeeForm.commissionRates || "{}"),
        isActive: employeeForm.isActive,
      };

      await api.post("/api/employees", body);
      toast.success(t("dash.recruitment.employeeCreated"));
      setEmployeeForm(DEFAULT_EMPLOYEE);
    } catch (err) {
      console.error("Error creating employee:", err);
      toast.error(t("dash.recruitment.error"));
    } finally {
      setEmployeeLoading(false);
    }
  };

  const createAccount = async () => {
    if (!accountForm.username.trim() || !accountForm.password.trim()) {
      toast.error(t("dash.recruitment.error"));
      return;
    }

    if (accountForm.password.length < 6) {
      toast.error(t("auth.passTooShort"));
      return;
    }

    setAccountLoading(true);
    try {
      await api.post("/api/auth/accounts", {
        username: accountForm.username.trim().toLowerCase(),
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

  const roleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return t("auth.role.admin");
      case "payroll":
        return t("auth.role.payroll");
      default:
        return t("auth.role.staff");
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
            <TabsTrigger value="employee">
              {t("dash.recruitment.employee")}
            </TabsTrigger>
            <TabsTrigger value="account">
              {t("dash.recruitment.account")}
            </TabsTrigger>
          </TabsList>

          {/* Employee Form Tab */}
          <TabsContent value="employee" className="space-y-6">
            <p className="text-sm text-muted-foreground">{t("dash.recruitment.employeeDesc")}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fullName">{t("dash.recruitment.fullName")}</Label>
                <Input
                  id="fullName"
                  value={employeeForm.fullName}
                  onChange={(e) => handleEmployeeChange("fullName", e.target.value)}
                  placeholder="e.g., Dr. Ahmed Hassan"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("dash.recruitment.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => handleEmployeeChange("email", e.target.value)}
                  placeholder="ahmed@pawm.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("dash.recruitment.phone")}</Label>
                <Input
                  id="phone"
                  value={employeeForm.phone}
                  onChange={(e) => handleEmployeeChange("phone", e.target.value)}
                  placeholder="+20 10 1234 5678"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">{t("dash.recruitment.role")}</Label>
                <Select
                  value={employeeForm.role}
                  onValueChange={(v) => handleEmployeeChange("role", v as "admin" | "payroll" | "staff")}
                >
                  <SelectTrigger id="role">
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
                <Label htmlFor="payRateType">{t("dash.recruitment.payRateType")}</Label>
                <Select
                  value={employeeForm.payRateType}
                  onValueChange={(v) => handleEmployeeChange("payRateType", v as "hourly" | "monthly")}
                >
                  <SelectTrigger id="payRateType">
                    <SelectValue placeholder={t("dash.recruitment.payRateType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">{t("dash.recruitment.hourly")}</SelectItem>
                    <SelectItem value="monthly">{t("dash.recruitment.monthly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2" style={{ display: employeeForm.payRateType === "hourly" ? "grid" : "none" }}>
                <Label htmlFor="hourlyRate">{t("dash.recruitment.hourlyRate")}</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={employeeForm.hourlyRate}
                  onChange={(e) => handleEmployeeChange("hourlyRate", e.target.value)}
                  placeholder="50"
                />
              </div>
              <div className="grid gap-2" style={{ display: employeeForm.payRateType === "monthly" ? "grid" : "none" }}>
                <Label htmlFor="monthlySalary">{t("dash.recruitment.monthlySalary")}</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={employeeForm.monthlySalary}
                  onChange={(e) => handleEmployeeChange("monthlySalary", e.target.value)}
                  placeholder="5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roleHoursPerDay">{t("dash.recruitment.roleHoursPerDay")}</Label>
                <Input
                  id="roleHoursPerDay"
                  type="number"
                  min="1"
                  max="24"
                  value={employeeForm.roleHoursPerDay}
                  onChange={(e) => handleEmployeeChange("roleHoursPerDay", e.target.value)}
                  placeholder="8"
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="commissionRates">{t("dash.recruitment.commissionRates")}</Label>
                <Textarea
                  id="commissionRates"
                  rows={3}
                  value={employeeForm.commissionRates}
                  onChange={(e) => handleEmployeeChange("commissionRates", e.target.value)}
                  placeholder='{"consultation": 10, "surgery": 15}'
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={employeeForm.isActive}
                onChange={(e) => handleEmployeeChange("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive" className="cursor-pointer text-sm">
                {t("dash.recruitment.isActive")}
              </Label>
            </div>

            <Button
              onClick={createEmployee}
              disabled={employeeLoading}
              className="w-full sm:w-auto"
            >
              {employeeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dash.saving")}
                </>
              ) : (
                t("dash.recruitment.createEmployee")
              )}
            </Button>
          </TabsContent>

          {/* Account Form Tab */}
          <TabsContent value="account" className="space-y-6">
            <p className="text-sm text-muted-foreground">{t("dash.recruitment.accountDesc")}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">{t("dash.recruitment.username")}</Label>
                <Input
                  id="username"
                  value={accountForm.username}
                  onChange={(e) => handleAccountChange("username", e.target.value)}
                  placeholder="e.g., dr.ahmed"
                  minLength={3}
                  autoComplete="username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">{t("dash.recruitment.role")}</Label>
                <Select
                  value={accountForm.role}
                  onValueChange={(v) => handleAccountChange("role", v)}
                >
                  <SelectTrigger id="role">
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
                <Label htmlFor="password">{t("dash.recruitment.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={accountForm.password}
                  onChange={(e) => handleAccountChange("password", e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              onClick={createAccount}
              disabled={accountLoading}
              className="w-full sm:w-auto"
            >
              {accountLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dash.saving")}
                </>
              ) : (
                t("dash.recruitment.createAccount")
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}