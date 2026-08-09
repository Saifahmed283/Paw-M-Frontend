import { createFileRoute } from "@tanstack/react-router";

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
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";

const title = "PawCare — Veterinary Clinic in San Francisco";
const description =
  "Same-day diagnostics, transparent estimates and a 24/7 emergency team. Book your pet's appointment with PawCare in under a minute.";

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
          name: "PawCare Veterinary Clinic",
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
  const { doctors } = useClinicStore();
  const { t } = useI18n();

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
