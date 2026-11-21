import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import {
  CtaBand,
  DoctorCard,
  Faq,
  Hero,
  SectionHeading,
  ServicesGrid,
  Testimonials,
  WhyUs,
} from "@/components/site/sections";
import { SectionFrame } from "@/design-system/primitives/SectionFrame";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl, SITE_URL } from "@/lib/seo";

const title = "Paw-M — Veterinary Clinic in Cairo, Egypt";
const description =
  "Same-day diagnostics, transparent estimates and a 24/7 emergency team in New Cairo. Book your pet's appointment with Paw-M in under a minute.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: ogMeta(title, description, "/"),
    links: [{ rel: "canonical", href: withSiteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VeterinaryCare",
          "@id": `${SITE_URL}/#veterinary-care`,
          name: "Paw-M Veterinary Clinic",
          description,
          url: SITE_URL,
          telephone: "+201210105624",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Craft Zoon, Second New Cairo",
            addressLocality: "Cairo",
            addressRegion: "Cairo Governorate",
            postalCode: "19519",
            addressCountry: "EG",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 30.0314,
            longitude: 31.4734,
          },
          priceRange: "$$",
          medicalSpecialty: "https://schema.org/VeterinaryCare",
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

      <SectionFrame>
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("home.services.title")}
          description={t("home.services.desc")}
        />
        <ServicesGrid limit={6} />
      </SectionFrame>

      {featured.length > 0 && (
        <SectionFrame tone="surface">
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
        </SectionFrame>
      )}

      <WhyUs />

      <SectionFrame tone="surface">
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
      </SectionFrame>

      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
