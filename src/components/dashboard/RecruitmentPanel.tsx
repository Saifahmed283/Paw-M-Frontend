import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Ban, CheckCircle2, Loader2, Pencil, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { api, apiErrorMessage } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "./dashboard-format";

type AccountRole = "admin" | "payroll" | "staff";

interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  role: AccountRole;
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
  role: AccountRole;
}

interface DashboardAccount {
  id: number;
  username: string;
  role: AccountRole;
  isActive: boolean;
  createdAt: string;
}

type AccountAction = { type: "suspend" | "activate" | "delete"; account: DashboardAccount } | null;

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
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<"employee" | "account">("employee");
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormData>(DEFAULT_EMPLOYEE);
  const [accountForm, setAccountForm] = useState<AccountFormData>(DEFAULT_ACCOUNT);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const [accounts, setAccounts] = useState<DashboardAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<DashboardAccount | null>(null);
  const [accountAction, setAccountAction] = useState<AccountAction>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true);
    try {
      const result = await api.get<{ accounts: DashboardAccount[] }>("/api/auth/accounts");
      setAccounts(result.accounts ?? []);
    } catch (err) {
      toast.error(apiErrorMessage(err, t("dash.recruitment.updateFailed")));
    } finally {
      setAccountsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

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
      toast.error(apiErrorMessage(err, t("dash.recruitment.error")));
    } finally {
      setEmployeeLoading(false);
    }
  };

  const resetAccountForm = () => {
    setAccountForm(DEFAULT_ACCOUNT);
    setEditingAccount(null);
  };

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (accountLoading || editingAccount) return;

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
      resetAccountForm();
      await loadAccounts();
    } catch (err) {
      toast.error(apiErrorMessage(err, t("dash.recruitment.error")));
    } finally {
      setAccountLoading(false);
    }
  };

  const saveAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (accountLoading || !editingAccount) return;

    const username = accountForm.username.trim().toLowerCase();
    if (username.length < 3) {
      toast.error(t("dash.recruitment.invalidUsername"));
      return;
    }
    if (accountForm.password && accountForm.password.length < 6) {
      toast.error(t("auth.passTooShort"));
      return;
    }

    const payload: { username: string; role: AccountRole; password?: string } = {
      username,
      role: accountForm.role,
    };
    // A blank password means "keep the current one" (the API rejects empty passwords).
    if (accountForm.password) payload.password = accountForm.password;

    setAccountLoading(true);
    try {
      await api.patch(`/api/auth/accounts/${editingAccount.id}`, payload);
      toast.success(t("dash.recruitment.accountUpdated"));
      resetAccountForm();
      await loadAccounts();
    } catch (err) {
      toast.error(apiErrorMessage(err, t("dash.recruitment.updateFailed")));
    } finally {
      setAccountLoading(false);
    }
  };

  const startEditAccount = (account: DashboardAccount) => {
    setTab("account");
    setEditingAccount(account);
    setAccountForm({
      username: account.username,
      password: "",
      role: account.role,
    });
  };

  const runAccountAction = async () => {
    if (!accountAction || actionBusy) return;
    const { type, account } = accountAction;
    setActionBusy(true);
    try {
      if (type === "delete") {
        await api.delete(`/api/auth/accounts/${account.id}`);
        toast.success(t("dash.recruitment.accountDeleted"));
      } else {
        await api.patch(`/api/auth/accounts/${account.id}`, { isActive: type === "activate" });
        toast.success(t("dash.recruitment.accountStatusUpdated"));
      }
      setAccountAction(null);
      await loadAccounts();
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
    }
  };

  const actionTitle =
    accountAction?.type === "suspend"
      ? t("dash.recruitment.suspendAccountTitle")
      : accountAction?.type === "activate"
        ? t("dash.recruitment.activateAccountTitle")
        : t("dash.recruitment.deleteAccountTitle");
  const actionDescription = accountAction
    ? accountAction.type === "suspend"
      ? t("dash.recruitment.suspendAccountConfirm", { name: accountAction.account.username })
      : accountAction.type === "activate"
        ? t("dash.recruitment.activateAccountConfirm", { name: accountAction.account.username })
        : t("dash.recruitment.deleteAccountConfirm", { name: accountAction.account.username })
    : "";

  const accountFormValid =
    accountForm.username.trim().length >= 3 &&
    (!accountForm.password || accountForm.password.length >= 6);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="size-4 text-muted-foreground" />
            {t("dash.recruitment")}
          </CardTitle>
          <CardDescription>{t("dash.recruitmentDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "employee" | "account")}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employee">{t("dash.recruitment.employee")}</TabsTrigger>
              <TabsTrigger value="account">{t("dash.recruitment.account")}</TabsTrigger>
            </TabsList>

            {/* Employee Form Tab */}
            <form onSubmit={createEmployee}>
              <TabsContent value="employee" className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t("dash.recruitment.employeeDesc")}
                </p>

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
                    <Label htmlFor="employee-payRateType">
                      {t("dash.recruitment.payRateType")}
                    </Label>
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
                      <Label htmlFor="employee-hourlyRate">
                        {t("dash.recruitment.hourlyRate")}
                      </Label>
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
            <form onSubmit={editingAccount ? saveAccount : createAccount}>
              <TabsContent value="account" className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {editingAccount
                    ? t("dash.recruitment.editAccountDesc")
                    : t("dash.recruitment.accountDesc")}
                </p>
                {!editingAccount && (
                  <p className="rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground">
                    {t("dash.recruitment.accountEmployeeHint")}
                  </p>
                )}

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
                      onValueChange={(v) => handleAccountChange("role", v as AccountRole)}
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
                    <Label htmlFor="account-password">
                      {editingAccount
                        ? t("dash.recruitment.newPassword")
                        : t("dash.recruitment.password")}
                    </Label>
                    <Input
                      id="account-password"
                      type="password"
                      value={accountForm.password}
                      onChange={(e) => handleAccountChange("password", e.target.value)}
                      placeholder={
                        editingAccount ? t("dash.recruitment.newPasswordPlaceholder") : "••••••••"
                      }
                      minLength={editingAccount ? 0 : 6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={accountLoading || !accountFormValid}>
                    {accountLoading ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        {t("dash.saving")}
                      </>
                    ) : editingAccount ? (
                      t("dash.recruitment.saveAccount")
                    ) : (
                      t("dash.recruitment.createAccount")
                    )}
                  </Button>
                  {editingAccount && (
                    <Button type="button" variant="outline" onClick={resetAccountForm}>
                      {t("dash.recruitment.cancelEdit")}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {/* Manage existing dashboard accounts */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("dash.recruitment.manageAccounts")}</CardTitle>
              <CardDescription>{t("dash.recruitment.manageAccountsDesc")}</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void loadAccounts()}
              disabled={accountsLoading}
            >
              <RefreshCw className={accountsLoading ? "me-2 size-4 animate-spin" : "me-2 size-4"} />
              {t("dash.refresh")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accountsLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="me-2 size-4 animate-spin" />
              {t("dash.loading")}
            </div>
          ) : accounts.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("dash.recruitment.noAccounts")}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dash.recruitment.username")}</TableHead>
                    <TableHead>{t("dash.recruitment.role")}</TableHead>
                    <TableHead>{t("dash.recruitment.status")}</TableHead>
                    <TableHead>{t("dash.recruitment.created")}</TableHead>
                    <TableHead className="text-end">{t("dash.recruitment.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.username}</TableCell>
                      <TableCell>{t(`auth.role.${account.role}`)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            account.isActive
                              ? "border-transparent bg-success/15 text-success"
                              : "border-transparent bg-muted text-muted-foreground"
                          }
                        >
                          {t(
                            account.isActive
                              ? "dash.recruitment.active"
                              : "dash.recruitment.suspended",
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(account.createdAt.slice(0, 10), lang)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            aria-label={t("dash.recruitment.editAccount")}
                            onClick={() => startEditAccount(account)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            aria-label={t(
                              account.isActive
                                ? "dash.recruitment.suspend"
                                : "dash.recruitment.activate",
                            )}
                            onClick={() =>
                              setAccountAction({
                                type: account.isActive ? "suspend" : "activate",
                                account,
                              })
                            }
                          >
                            {account.isActive ? (
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
                            onClick={() => setAccountAction({ type: "delete", account })}
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
          )}
        </CardContent>
      </Card>

      <Dialog
        open={accountAction !== null}
        onOpenChange={(open) => !open && setAccountAction(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{actionTitle}</DialogTitle>
            <DialogDescription>{actionDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={actionBusy} onClick={() => setAccountAction(null)}>
              {t("dash.cancel")}
            </Button>
            <Button
              variant={accountAction?.type === "activate" ? "default" : "destructive"}
              disabled={actionBusy}
              onClick={() => void runAccountAction()}
            >
              {actionBusy ? (
                <Loader2 className="me-2 size-4 animate-spin" />
              ) : accountAction?.type === "suspend" ? (
                <Ban className="me-2 size-4" />
              ) : accountAction?.type === "activate" ? (
                <CheckCircle2 className="me-2 size-4" />
              ) : (
                <Trash2 className="me-2 size-4" />
              )}
              {accountAction?.type === "suspend"
                ? t("dash.recruitment.suspend")
                : accountAction?.type === "activate"
                  ? t("dash.recruitment.activate")
                  : t("dash.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
