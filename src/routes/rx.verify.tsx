import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { verifyRxCode } from "@/lib/client-medical";

type VerifyState =
  | { kind: "loading" }
  | {
      kind: "valid";
      rxNumber: string;
      pet?: string;
      doctor?: string;
      diagnosis?: string;
      issuedAt?: string | null;
    }
  | { kind: "invalid"; message: string };

export const Route = createFileRoute("/rx/verify")({
  validateSearch: (search: Record<string, unknown>): { code?: string } =>
    typeof search["code"] === "string" ? { code: search["code"] } : {},
  head: () => ({
    meta: ogMeta(
      "Verify a Prescription — Paw-M",
      "Check the authenticity of a Paw-M veterinary prescription online.",
      "/rx/verify",
    ),
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { code } = Route.useSearch();
  const { t } = useI18n();
  const [state, setState] = useState<VerifyState>({ kind: "loading" });
  const [input, setInput] = useState(code ?? "");

  const run = async (value: string) => {
    const clean = value.trim().toUpperCase();
    if (!clean) {
      setState({ kind: "invalid", message: "Enter a verification code to check a prescription." });
      return;
    }
    setState({ kind: "loading" });
    try {
      const res = await verifyRxCode(clean);
      if (res.valid) {
        setState({
          kind: "valid",
          rxNumber: res.rxNumber ?? clean,
          ...(res.pet?.name !== undefined ? { pet: res.pet.name } : {}),
          ...(res.doctor?.name !== undefined ? { doctor: res.doctor.name } : {}),
          ...(res.diagnosis !== undefined ? { diagnosis: res.diagnosis } : {}),
          ...(res.issuedAt !== undefined ? { issuedAt: res.issuedAt } : {}),
        });
      } else {
        setState({
          kind: "invalid",
          message: res.message ?? "This prescription could not be verified.",
        });
      }
    } catch {
      setState({
        kind: "invalid",
        message: "Verification service is unavailable right now. Try again later.",
      });
    }
  };

  useEffect(() => {
    if (code) run(code);
  }, [code]);

  return (
    <section className="hero-gradient min-h-screen pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-lg px-5 sm:px-8">
        <Breadcrumbs
          items={[
            { label: t("crumb.home"), to: "/" },
            { label: "Verify Prescription", to: "/rx/verify" },
          ]}
        />
        <h1 className="mt-3 text-3xl font-bold">Verify a prescription</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the 8-character code printed under the QR code of any Paw-M prescription, or scan
          the QR with your camera.
        </p>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="e.g. A8K3P2XQ"
            className="h-11 flex-1 rounded-xl border border-border bg-card px-4 font-mono text-sm uppercase tracking-widest outline-none focus:border-primary"
            aria-label="Verification code"
          />
          <Button type="submit" className="shadow-glow">
            Verify
          </Button>
        </form>

        <div className="mt-6">
          {state.kind === "loading" && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Checking…
              </CardContent>
            </Card>
          )}
          {state.kind === "valid" && (
            <Card className="border-emerald-300 bg-emerald-50 shadow-card">
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
                <h2 className="mt-3 text-lg font-bold text-emerald-800">
                  This prescription is authentic
                </h2>
                <p className="mt-1 font-mono text-sm font-semibold text-emerald-700">
                  {state.rxNumber}
                </p>
                <div className="mt-4 grid gap-1 text-sm text-emerald-800">
                  {state.pet && (
                    <p>
                      Patient: <span className="font-semibold">{state.pet}</span>
                    </p>
                  )}
                  {state.doctor && (
                    <p>
                      Clinician: <span className="font-semibold">{state.doctor}</span>
                    </p>
                  )}
                  {state.diagnosis && (
                    <p>
                      Diagnosis: <span className="font-semibold">{state.diagnosis}</span>
                    </p>
                  )}
                  {state.issuedAt && (
                    <p>
                      Issued:{" "}
                      <span className="font-semibold">
                        {new Date(state.issuedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {state.kind === "invalid" && (
            <Card className="border-red-200 bg-red-50 shadow-card">
              <CardContent className="py-8 text-center">
                <XCircle className="mx-auto size-10 text-red-600" />
                <h2 className="mt-3 text-lg font-bold text-red-700">Verification failed</h2>
                <p className="mt-1 text-sm text-red-700">{state.message}</p>
                <p className="mt-4 text-xs text-red-600">
                  Contact Paw Clinic Madinaty if you believe this prescription is legitimate.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 Paw Clinic Madinaty — Property of Paw-M Clinic. Reproduction prohibited.
        </p>

        <div className="mt-4 text-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
