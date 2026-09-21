import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getPetHistory } from "@/lib/client-medical";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/pets/$petId")({
  head: ({ params }) => ({
    meta: ogMeta(
      "Pet History — My Account",
      "Your pet's complete visit and prescription history at Paw-M.",
      `/account/pets/${params.petId}`,
    ),
  }),
  component: PetHistoryPage,
});

function PetHistoryPage() {
  const { petId } = Route.useParams();
  const { t } = useI18n();
  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pet-history", petId],
    queryFn: () => getPetHistory(petId),
    retry: 1,
  });

  return (
    <ClientAuthGate>
      <section className="hero-gradient min-h-screen pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: "My Account", to: "/account" },
              { label: history?.pet.name ?? "Pet", to: `/account/pets/${petId}` },
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
                Could not load this pet.{` `}
                <Link to="/account" className="text-primary underline-offset-4 hover:underline">
                  Back to My Account
                </Link>
              </CardContent>
            </Card>
          )}
          {history && (
            <div className="grid gap-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-4">
                  {history.pet.photo ? (
                    <img
                      src={history.pet.photo}
                      alt={history.pet.name}
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-20 place-items-center rounded-full bg-primary/10 text-3xl">
                      {emojiFor(history.pet.species)}
                    </span>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold">{history.pet.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {[history.pet.species, history.pet.breed].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
                      {history.pet.weightKg && <Chip>{`${history.pet.weightKg} kg`}</Chip>}
                      {history.pet.color && <Chip>{history.pet.color}</Chip>}
                      {history.pet.dob && <Chip>{`Born ${formatShort(history.pet.dob)}`}</Chip>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <PawPrint className="size-5 text-primary" /> Visits
                  <span className="text-sm font-normal text-muted-foreground">
                    ({history.bookings.length})
                  </span>
                </h2>
                {history.bookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                      No visits recorded yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {[...history.bookings]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((b) => (
                        <div key={b.id} className="rounded-2xl border border-border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {formatShort(b.date)} · {b.time} — {b.doctorName}
                            </p>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                                b.status === "completed"
                                  ? "bg-sky-100 text-sky-700"
                                  : b.status === "confirmed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : b.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700",
                              )}
                            >
                              {b.status}
                            </span>
                          </div>
                          {b.symptoms && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Symptoms: </span>
                              {b.symptoms}
                            </p>
                          )}
                          {(b.diagnosis || b.treatmentNotes) && (
                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                              {b.diagnosis && (
                                <p className="rounded-lg bg-muted/60 p-2">
                                  <span className="font-semibold">Diagnosis:</span> {b.diagnosis}
                                </p>
                              )}
                              {b.treatmentNotes && (
                                <p className="rounded-lg bg-muted/60 p-2">
                                  <span className="font-semibold">Treatment:</span>{" "}
                                  {b.treatmentNotes}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <FileText className="size-5 text-primary" /> Prescriptions
                  <span className="text-sm font-normal text-muted-foreground">
                    ({history.prescriptions.length})
                  </span>
                </h2>
                {history.prescriptions.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                      No prescriptions yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {history.prescriptions.map((rx) => (
                      <Link
                        key={rx.id}
                        to="/account/rx/$rxId"
                        params={{ rxId: rx.id }}
                        className="flex items-center justify-between rounded-2xl border border-border p-4 transition-colors hover:border-primary/40"
                      >
                        <div>
                          <p className="font-mono text-sm font-semibold">{rx.rxNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatShort(rx.issuedAt ?? rx.createdAt)} ·{" "}
                            {rx.doctor?.name ?? "Clinic"}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                            rx.status === "issued"
                              ? "bg-emerald-100 text-emerald-700"
                              : rx.status === "void"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700",
                          )}
                        >
                          {rx.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Button asChild variant="outline" className="justify-self-start">
                <Link to="/account">
                  <ArrowLeft className="size-4" /> Back to My Account
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </ClientAuthGate>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{children}</span>
  );
}

function formatShort(input?: string | null): string {
  if (!input) return "—";
  try {
    return new Date(`${input}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return input;
  }
}

function emojiFor(species: string): string {
  const clean = species.toLowerCase();
  if (clean.includes("cat")) return "🐱";
  if (clean.includes("bird")) return "🐦";
  if (clean.includes("rabbit")) return "🐰";
  if (clean.includes("reptile") || clean.includes("lizard") || clean.includes("turtle"))
    return "🦎";
  if (clean.includes("hamster") || clean.includes("rodent") || clean.includes("rat")) return "🐹";
  return "🐶";
}
