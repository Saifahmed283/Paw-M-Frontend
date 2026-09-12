import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useI18n } from "@/lib/i18n";
import { getPrescription } from "@/lib/client-medical";
import { PrescriptionDocument, PrintCss } from "@/components/PrescriptionDocument";

export const Route = createFileRoute("/account/rx/$rxId")({
  head: () => ({
    meta: {
      title: "Prescription — My Account",
    },
  }),
  component: RxPage,
});

function RxPage() {
  const { rxId } = Route.useParams();
  const { t } = useI18n();
  const {
    data: rx,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prescription", rxId],
    queryFn: () => getPrescription(rxId),
    retry: 1,
  });

  const copyNumber = async () => {
    if (!rx) return;
    try {
      await navigator.clipboard.writeText(rx.rxNumber);
      toast.success("Prescription number copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <ClientAuthGate>
      <PrintCss />
      <section className="hero-gradient min-h-screen pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: "My Account", to: "/account" },
              { label: "Prescriptions", to: "/account" },
              { label: rx?.rxNumber ?? "Rx", to: `/account/rx/${rxId}` },
            ]}
          />

          {isLoading && (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Loading…
              </CardContent>
            </Card>
          )}
          {error && (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                This prescription could not be loaded.{" "}
                <Link to="/account" className="text-primary underline-offset-4 hover:underline">
                  Back to My Account
                </Link>
              </CardContent>
            </Card>
          )}

          {rx && (
            <div className="grid gap-4">
              <div className="no-print flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/account">
                    <ArrowLeft className="size-4" /> My Account
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={copyNumber}>
                  <Copy className="size-4" /> {rx.rxNumber}
                </Button>
                <Button size="sm" className="ml-auto shadow-glow" onClick={() => window.print()}>
                  <Printer className="size-4" /> Print / Save PDF
                </Button>
              </div>

              <div className="print-sheet overflow-hidden rounded-2xl border border-border shadow-card">
                <PrescriptionDocument rx={rx} />
              </div>

              <p className="no-print text-center text-xs text-muted-foreground">
                Show the printed copy when collecting medication. The QR code lets any clinic verify
                this prescription instantly.
              </p>
            </div>
          )}
        </div>
      </section>
    </ClientAuthGate>
  );
}
