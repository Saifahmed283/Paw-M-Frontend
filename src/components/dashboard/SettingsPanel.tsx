import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useClinicStore,
  updateSettings,
  syncGoogleReviews as syncReviews,
} from "@/lib/clinic-store";
import { useI18n, type Lang } from "@/lib/i18n";
import { changeCredentials, MIN_PASSWORD, MIN_USERNAME } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Field } from "./dashboard-helpers";

export function SettingsPanel() {
  const { t, lang, setLang } = useI18n();
  const { settings } = useClinicStore();
  const [gsBusy, setGsBusy] = useState(false);
  const [gsResult, setGsResult] = useState<{ synced: number; total: number } | null>(null);
  const [gsError, setGsError] = useState<string | null>(null);
  const [credsForm, setCredsForm] = useState({
    currentPassword: "",
    newUsername: "",
    newPassword: "",
    confirm: "",
  });
  const [form, setForm] = useState({
    name: settings.name,
    tagline: settings.tagline,
    phone: settings.phone,
    emergency: settings.emergency,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    currency: settings.currency,
    instapay: settings.instapay,
  });

  useEffect(() => {
    setForm({
      name: settings.name,
      tagline: settings.tagline,
      phone: settings.phone,
      emergency: settings.emergency,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      currency: settings.currency,
      instapay: settings.instapay,
    });
  }, [settings]);

  const save = async () => {
    if (!form.currency.trim()) {
      toast.error(t("dash.settings.currencyEmpty"));
      return;
    }
    try {
      await updateSettings({ ...form, currency: form.currency.trim() });
      toast.success(t("dash.toast.saved"));
    } catch {
      toast.error(t("dash.toast.error"));
    }
  };

  const doSync = async () => {
    setGsBusy(true);
    setGsError(null);
    setGsResult(null);
    try {
      const r = await syncReviews();
      setGsResult(r);
      toast.success(
        t("dash.settings.googleSyncSuccess", {
          synced: String(r.synced),
          total: String(r.total),
        }),
      );
    } catch {
      setGsError(t("dash.settings.googleSyncFail"));
      toast.error(t("dash.settings.googleSyncFail"));
    } finally {
      setGsBusy(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.general")}</CardTitle>
          <CardDescription>{t("dash.settings.generalDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label={t("dash.settings.name")}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("dash.settings.tagline")}>
            <Input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("dash.settings.phone")}>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label={t("dash.settings.emergency")}>
              <Input
                value={form.emergency}
                onChange={(e) => setForm({ ...form, emergency: e.target.value })}
              />
            </Field>
          </div>
          <Field label={t("dash.settings.email")}>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label={t("dash.settings.whatsapp")}>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("dash.settings.currency")}>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                maxLength={8}
                placeholder="$"
              />
            </Field>
            <Field label={t("dash.settings.instapay")}>
              <Input
                value={form.instapay}
                onChange={(e) => setForm({ ...form, instapay: e.target.value })}
                maxLength={80}
                placeholder="01xxxxxxxxxx"
              />
            </Field>
          </div>
          <Field label={t("dash.settings.address")}>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button onClick={save}>{t("dash.save")}</Button>
            <span className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">
              {t("dash.settings.persist")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.lang")}</CardTitle>
          <CardDescription>{t("dash.settings.langDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={lang}
            onValueChange={(v) => {
              if (v === "en" || v === "ar") setLang(v as Lang);
            }}
          >
            <ToggleGroupItem value="en" size="sm">
              English
            </ToggleGroupItem>
            <ToggleGroupItem value="ar" size="sm">
              العربية
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("auth.changeCredentials")}</CardTitle>
          <CardDescription>{t("auth.changeCredentialsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label={t("auth.currentPassword")}>
            <Input
              type="password"
              value={credsForm.currentPassword}
              onChange={(e) => setCredsForm({ ...credsForm, currentPassword: e.target.value })}
              autoComplete="current-password"
              maxLength={128}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.newUsername")}>
              <Input
                value={credsForm.newUsername}
                onChange={(e) => setCredsForm({ ...credsForm, newUsername: e.target.value })}
                autoComplete="username"
                maxLength={40}
              />
            </Field>
            <Field label={t("auth.newPassword")}>
              <Input
                type="password"
                value={credsForm.newPassword}
                onChange={(e) => setCredsForm({ ...credsForm, newPassword: e.target.value })}
                autoComplete="new-password"
                maxLength={128}
              />
            </Field>
          </div>
          <Field label={t("auth.confirmNewPassword")}>
            <Input
              type="password"
              value={credsForm.confirm}
              onChange={(e) => setCredsForm({ ...credsForm, confirm: e.target.value })}
              autoComplete="new-password"
              maxLength={128}
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button
              onClick={async () => {
                if (credsForm.newPassword !== credsForm.confirm) {
                  toast.error(t("auth.mismatch"));
                  return;
                }
                if (credsForm.newUsername && credsForm.newUsername.trim().length < MIN_USERNAME) {
                  toast.error(t("auth.usernameTooShort"));
                  return;
                }
                if (credsForm.newPassword && credsForm.newPassword.length < MIN_PASSWORD) {
                  toast.error(t("auth.passTooShort"));
                  return;
                }
                if (!credsForm.newUsername && !credsForm.newPassword) {
                  toast.error(t("auth.nothingToChange"));
                  return;
                }
                try {
                  const payload: {
                    currentPassword: string;
                    newUsername?: string;
                    newPassword?: string;
                  } = { currentPassword: credsForm.currentPassword };
                  if (credsForm.newUsername) payload.newUsername = credsForm.newUsername;
                  if (credsForm.newPassword) payload.newPassword = credsForm.newPassword;
                  await changeCredentials(payload);
                  toast.success(t("auth.credsChanged"));
                  setCredsForm({
                    currentPassword: "",
                    newUsername: "",
                    newPassword: "",
                    confirm: "",
                  });
                } catch {
                  toast.error(t("auth.wrongCurrent"));
                }
              }}
            >
              {t("auth.changeCredentials")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.googleSync")}</CardTitle>
          <CardDescription>{t("dash.settings.googleSyncDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={doSync} disabled={gsBusy} variant="outline" size="sm">
            <RefreshCw className={cn("size-4", gsBusy && "animate-spin")} />
            {gsBusy ? t("dash.settings.googleSyncBtn") + "…" : t("dash.settings.googleSyncBtn")}
          </Button>
          {gsResult && !gsError && (
            <span className="text-xs text-success">
              ✓{" "}
              {t("dash.settings.googleSyncSuccess", {
                synced: String(gsResult.synced),
                total: String(gsResult.total),
              })}
            </span>
          )}
          {gsError && <span className="text-xs text-destructive">{gsError}</span>}
        </CardContent>
      </Card>
    </div>
  );
}
