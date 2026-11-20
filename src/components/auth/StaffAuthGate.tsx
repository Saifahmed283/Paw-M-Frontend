import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/dashboard-helpers";
import { useI18n } from "@/lib/i18n";
import { currentRole, login, remainingLockMs } from "@/lib/auth";
import { ApiError } from "@/lib/api";

type Props = {
  onUnlocked: (role: string) => void;
  /** Hide the "back to site" link on focused surfaces such as the POS. */
  showBack?: boolean;
};

/**
 * Staff sign-in gate shared by the dashboard and the cashier. Staff accounts
 * are provisioned out of band, so this is sign-in only — it never offers to
 * create an admin when the API is unreachable.
 */
export function StaffAuthGate({ onUnlocked, showBack = true }: Props) {
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockedFor, setLockedFor] = useState(remainingLockMs());
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (await login(username, password)) {
        onUnlocked(currentRole());
      } else {
        setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
      }
    } catch (err) {
      // Only a rejected credential pair means "invalid credentials". A 400 is a
      // validation failure, 429 is the auth rate limiter, and a fetch rejection
      // means the API is unreachable — each needs its own message.
      if (err instanceof ApiError) {
        if (err.status === 400) setError(t("auth.missingFields"));
        else if (err.status === 403) setError(t("auth.suspended"));
        else if (err.status === 429)
          setError(t("auth.locked", { minutes: String(err.retryAfterMinutes ?? 15) }));
        else setError(t("auth.unreachable"));
      } else {
        setError(t("auth.unreachable"));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-5 py-32">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        {showBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="mb-4 -ms-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4 me-1" /> {t("dash.back")}
          </Button>
        )}
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">{t("auth.signIn")}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {showBack ? t("auth.signInDesc") : t("cashier.signInDesc")}
        </p>

        <div className="mt-5 grid gap-4">
          <Field label={t("auth.username")}>
            <Input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.usernamePlaceholder")}
              maxLength={40}
            />
          </Field>
          <Field label={t("auth.password")}>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              maxLength={128}
            />
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {lockedFor > 0 && (
          <p className="mt-2 text-xs text-amber-600">
            {t("auth.locked", { minutes: String(Math.ceil(lockedFor / 60000)) })}
          </p>
        )}

        <div className="mt-3 text-center">
          <span className="text-xs text-muted-foreground">{t("auth.signInHelp")}</span>
        </div>

        <Button type="submit" disabled={busy} className="mt-6 w-full shadow-glow">
          {t("auth.unlock")}
        </Button>
      </form>
    </div>
  );
}
