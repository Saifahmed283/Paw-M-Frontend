import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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
import { useI18n } from "@/lib/i18n";

const title = "Paw-M — Veterinary Clinic in Cairo, Egypt";
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
            addressLocality: "Cairo",
            addressRegion: "Cairo Governorate",
            addressCountry: "EG",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { doctors, products } = useClinicStore();
  const { t } = useI18n();

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

      <CtaBand />
    </>
  );
}
