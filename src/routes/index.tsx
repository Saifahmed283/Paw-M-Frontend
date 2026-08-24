import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare, Star } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import {
  BookingTimeline,
  CtaBand,
  DoctorCard,
  Faq,
  Hero,
  SectionHeading,
  ServicesGrid,
  Testimonials,
  WhyUs,
} from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";

const title = "Paw-M — Veterinary Clinic in San Francisco";
const description =
  "Same-day diagnostics, transparent estimates and a 24/7 emergency team. Book your pet's appointment with Paw-M in under a minute.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VeterinaryCare",
          name: "Paw-M Veterinary Clinic",
          description,
          url: "/",
          address: {
            "@type": "PostalAddress",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            addressCountry: "US",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { doctors, products, reviews } = useClinicStore();
  const { t, lang } = useI18n();

  const featured = [...products]
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
    )
    .slice(0, 4);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("home.services.title")}
          description={t("home.services.desc")}
        />
        <ServicesGrid limit={6} />
      </section>

      {featured.length > 0 && (
        <section className="border-y border-border bg-surface py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={t("home.shop.eyebrow")}
                title={t("home.shop.title")}
                description={t("home.shop.desc")}
              />
              <Button asChild variant="outline" className="mb-1">
                <Link to="/store">
                  {t("home.shop.browse")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <WhyUs />

      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={t("team.eyebrow")}
            title={t("home.team.title")}
            description={t("home.team.desc")}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </div>
        </div>
      </section>

      <BookingTimeline />
      <Testimonials />
      <Faq />

      {(() => {
        const googleReviews = reviews
          .filter((r) => r.productId === "clinic" && r.status === "approved")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);

        if (googleReviews.length === 0) return null;

        const avgRating =
          googleReviews.reduce((s, r) => s + r.rating, 0) / googleReviews.length;

        return (
          <section className="border-t border-border py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <div className="mb-4 flex items-center gap-2 text-sm text-amber-600">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({googleReviews.length} reviews)</span>
              </div>
              <SectionHeading
                eyebrow="GOOGLE"
                title={t("homepage.clinicReviews.title")}
                description={t("homepage.clinicReviews.subtitle")}
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {googleReviews.map((r) => (
                  <Card key={r.id} className="flex flex-col">
                    <CardContent className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{r.author}</span>
                        <time
                          className="text-xs text-muted-foreground"
                          dateTime={r.createdAt}
                        >
                          {new Date(r.createdAt).toLocaleDateString(
                            lang === "ar" ? "ar" : "en-US",
                            { month: "short", year: "numeric" },
                          )}
                        </time>
                      </div>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-border",
                            )}
                          />
                        ))}
                      </span>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                        {r.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <a
                    href={`https://search.google.com/local/writereview?placeid={{googlePlaceId}}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="size-4" />
                    {t("homepage.clinicReviews.allReviews")}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        );
      })()}

      <CtaBand />
    </>
  );
}
