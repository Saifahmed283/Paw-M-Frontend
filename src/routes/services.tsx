import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading, ServicesGrid } from "@/components/site/sections";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";

const title = "Veterinary Services — Paw-M";
const description =
  "Checkups, vaccination, surgery, emergency care, in-house laboratory, dentistry, imaging and more at Paw-M Veterinary Clinic in New Cairo, Egypt.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: ogMeta(title, description, "/services"),
    links: [{ rel: "canonical", href: withSiteUrl("/services") }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useI18n();
  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.services"), to: "/services" },
            ]}
          />
          <SectionHeading
            eyebrow={t("page.services.eyebrow")}
            title={t("page.services.title")}
            description={t("page.services.desc")}
            as="h1"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-4 sm:px-8">
        <ServicesGrid />
      </section>
    </>
  );
}
