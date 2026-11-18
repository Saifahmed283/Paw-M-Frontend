import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clientIsAuthed,
  loginClient,
  requestClientVerification,
  verifyClientEmail,
} from "@/lib/client-auth";

export function ClientAuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(clientIsAuthed);
  const [registering, setRegistering] = useState(true);
  const [verification, setVerification] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", code: "" });

  if (authed) return children;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (verification) {
        await verifyClientEmail(form.email, form.code);
        setAuthed(true);
        toast.success("Email verified. Your account is ready.");
      } else if (registering) {
        await requestClientVerification(form);
        setVerification(true);
        toast.success("Verification code sent to your email.");
      } else {
        await loginClient(form.email, form.password);
        setAuthed(true);
        toast.success("Signed in successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="hero-gradient flex min-h-dvh items-center justify-center px-5 py-32">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            {verification ? (
              <MailCheck className="size-6" />
            ) : registering ? (
              <ShieldCheck className="size-6" />
            ) : (
              <LockKeyhole className="size-6" />
            )}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Paw Clinic Madinaty
            </p>
            <h1 className="text-2xl font-bold">
              {verification
                ? "Verify your email"
                : registering
                  ? "Create your account"
                  : "Welcome back"}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {verification
            ? `Enter the six-digit code sent to ${form.email}.`
            : "Your account keeps appointments, orders, and activity together."}
        </p>
        <div className="mt-6 grid gap-4">
          {verification ? (
            <Label>
              Verification code
              <Input
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "") })}
              />
            </Label>
          ) : registering ? (
            <>
              <Label>
                Full name
                <Input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </Label>
              <Label>
                Phone
                <Input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Label>
            </>
          ) : null}
          {!verification && (
            <Label>
              Email
              <Input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Label>
          )}
          {!verification && (
            <Label>
              Password
              <Input
                required
                type="password"
                minLength={8}
                autoComplete={registering ? "new-password" : "current-password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Label>
          )}
          <Button type="submit" disabled={busy}>
            {busy
              ? "Please wait..."
              : verification
                ? "Verify and continue"
                : registering
                  ? "Create account"
                  : "Sign in"}
            <ArrowRight className="size-4" />
          </Button>
          {verification ? (
            <Button type="button" variant="ghost" onClick={() => setVerification(false)}>
              Use a different email
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setRegistering(!registering)}>
              {registering ? "Already have an account? Sign in" : "New client? Create an account"}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
