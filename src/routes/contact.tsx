import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/site/sections";
import { CLINIC } from "@/lib/clinic-data";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { mailtoHref, telHref, waMeHref } from "@/lib/sanitize";

const title = "Contact Paw-M — Hours, Location & Emergency Line";
const description =
  "Call, message or visit Paw-M Veterinary Clinic in New Cairo, Egypt. Emergency line answered 24/7, seven days a week.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: ogMeta(title, description, "/contact"),
    links: [{ rel: "canonical", href: withSiteUrl("/contact") }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const contact = {
    emergency: settings.emergency,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    hours: CLINIC.hours,
  };

  const cards = [
    {
      icon: Siren,
      label: t("contact.emergency"),
      value: contact.emergency,
      href: telHref(contact.emergency),
      urgent: true,
    },
    {
      icon: Phone,
      label: t("contact.reception"),
      value: contact.phone,
      href: telHref(contact.phone),
    },
    {
      icon: MessageCircle,
      label: t("contact.whatsapp"),
      value: contact.whatsapp,
      href: waMeHref(contact.whatsapp),
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: contact.email,
      href: mailtoHref(contact.email),
    },
  ];

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.contact"), to: "/contact" },
            ]}
          />
          <SectionHeading
            eyebrow={t("page.contact.eyebrow")}
            title={t("page.contact.title")}
            description={t("page.contact.desc")}
            as="h1"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.06}>
              <a
                href={card.href ?? undefined}
                className="block h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-raised"
              >
                <span
                  className={
                    card.urgent
                      ? "grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive"
                      : "grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"
                  }
                >
                  <card.icon className="size-5" />
                </span>
                <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{card.value}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <iframe
                title={t("contact.map")}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.744861831012!2d31.66746777507489!3d30.0728470172253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1457f5c79b7ae3ed%3A0x95e26a47780b144a!2sPaw%20Clinic%20Madinaty!5e0!3m2!1sen!2seg!4v1789144957782!5m2!1sen!2seg"
                className="h-[420px] w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="size-4 text-primary" /> {t("contact.hours")}
              </h3>
              <ul className="mt-4 space-y-3">
                {CLINIC.hours.map((h, i) => (
                  <li key={`${h.day}-${i}`} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{t(`hour.${i}`)}</span>
                    <span className="font-medium text-foreground">{h.time}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="size-4 text-primary" /> {t("contact.address")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {contact.address}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
