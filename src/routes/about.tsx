import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/sections";
import { PageIntro } from "@/design-system/primitives/PageIntro";
import { CountUp, Reveal } from "@/components/motion-primitives";
import { STATS, WHY_US } from "@/lib/clinic-data";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import clinicImage from "@/assets/clinic-interior.jpg";

const title = "About Paw-M — A Boutique Veterinary Hospital in Cairo";
const description =
  "Paw-M was built around clear diagnostics, honest estimates and medical records pet owners actually own. Our licensed veterinarians care for dogs, cats and exotic pets in New Cairo.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: ogMeta(title, description, "/about"),
    links: [{ rel: "canonical", href: withSiteUrl("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { doctors } = useClinicStore();
  const { t } = useI18n();

  return (
    <>
      <PageIntro
        eyebrow={t("page.about.eyebrow")}
        title={t("page.about.title")}
        description={t("page.about.desc")}
        crumb={
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.about"), to: "/about" },
            ]}
          />
        }
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
              <img
                src={clinicImage}
                alt={t("img.clinic")}
                loading="lazy"
                width={1036}
                height={870}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="space-y-8">
            {Array.from({ length: 3 }, (_, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="border-l-2 border-primary pl-5">
                  <h3 className="text-base font-semibold">{t(`about.principle.${i}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`about.principle.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div>
                <dt className="text-3xl font-bold tracking-tight">
                  <CountUp
                    value={i === 1 ? doctors.length : stat.value}
                    suffix={i === 1 ? "" : stat.suffix}
                  />
                </dt>
                <dd className="mt-1.5 text-sm text-muted-foreground">{t(`stats.${i}`)}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={t("page.about.standards")} title={t("why.title")} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold">{t(`whyitem.${i}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`whyitem.${i}.detail`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
