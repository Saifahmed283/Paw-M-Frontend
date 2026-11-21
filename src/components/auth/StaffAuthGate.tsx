import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/dashboard-helpers";
import { PawMLogoSeal } from "@/components/PawMMark";
import { CrestBackdrop } from "@/design-system/primitives/CrestBackdrop";
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
  const reduce = !!useReducedMotion();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
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

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.16 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  const promises = [
    { icon: ShieldCheck, label: t("auth.point.secure") },
    { icon: Radio, label: t("auth.point.clear") },
    { icon: Sparkles, label: t("auth.point.care") },
  ];

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--canvas)] lg:flex-row">
      <aside className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-[var(--navy-950)] px-6 py-10 text-white sm:px-10 lg:w-[42%] lg:px-14 lg:py-14">
        <CrestBackdrop animated={!reduce} />

        <div className="relative">
          <PawMLogoSeal size="md" />
          <motion.p
            {...rise(0.08)}
            className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold-400)]"
          >
            {t("auth.portal")}
          </motion.p>
          <motion.h2
            {...rise(0.14)}
            className="mt-3 max-w-sm font-display text-[length:var(--step-2)] font-semibold leading-tight sm:text-[length:var(--step-3)]"
          >
            {t("auth.brandTitle")}
          </motion.h2>
          <div className="pm-gild mt-5 h-px w-14 bg-[var(--gold-500)]" />
          <motion.p {...rise(0.2)} className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {t("auth.brandDesc")}
          </motion.p>
        </div>

        <motion.div {...rise(0.28)} className="relative mt-10 hidden gap-2 lg:grid">
          {promises.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 border-t border-white/10 py-3 text-sm text-white/75"
            >
              <Icon className="size-4 text-[var(--gold-400)]" />
              {label}
            </div>
          ))}
        </motion.div>
      </aside>

      <div className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
        <motion.form onSubmit={submit} {...rise(0.1)} className="w-full max-w-md">
          {showBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="-ms-2 mb-8 text-ink-soft"
            >
              <ArrowLeft className="me-1 size-4 rtl:rotate-180" /> {t("dash.back")}
            </Button>
          )}

          <div className="pm-gild h-px w-12 bg-[var(--gold-500)]" />
          <h1 className="mt-5 font-display text-[length:var(--step-3)] font-semibold text-foreground">
            {t("auth.signIn")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {showBack ? t("auth.signInDesc") : t("cashier.signInDesc")}
          </p>

          <div className="mt-8 grid gap-5">
            <Field label={t("auth.username")}>
              <div className="relative">
                <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("auth.usernamePlaceholder")}
                  maxLength={40}
                  className="h-11 ps-10"
                  aria-invalid={!!error}
                />
              </div>
            </Field>
            <Field label={t("auth.password")}>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  type={revealed ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  maxLength={128}
                  className="h-11 ps-10 pe-11"
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setRevealed((v) => !v)}
                  aria-label={revealed ? t("auth.hidePassword") : t("auth.showPassword")}
                  aria-pressed={revealed}
                  className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-ink-faint transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
          </div>

          {error && (
            <motion.p
              key={error}
              role="alert"
              className="pm-shake mt-5 rounded-[var(--radius-md)] border border-[var(--urgent)]/25 bg-[var(--urgent-tint)] px-3 py-2 text-sm text-[var(--urgent)]"
            >
              {error}
            </motion.p>
          )}
          {lockedFor > 0 && (
            <p className="mt-2 text-xs text-[var(--gold-700)] dark:text-[var(--gold-400)]">
              {t("auth.locked", { minutes: String(Math.ceil(lockedFor / 60000)) })}
            </p>
          )}

          <motion.div
            {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.99 } })}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <Button
              type="submit"
              disabled={busy}
              className="mt-8 h-11 w-full bg-[var(--navy-700)] text-white hover:bg-[var(--navy-800)]"
            >
              {busy ? (
                <>
                  <LoaderCircle className="me-2 size-4 animate-spin" />
                  {t("dash.saving")}
                </>
              ) : (
                <>
                  {t("auth.unlock")}
                  <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
                </>
              )}
            </Button>
          </motion.div>

          <p className="mt-6 text-center text-xs text-ink-faint">{t("auth.signInHelp")}</p>
        </motion.form>
      </div>
    </div>
  );
}
