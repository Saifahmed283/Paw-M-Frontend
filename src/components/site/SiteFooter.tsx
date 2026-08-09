import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { motion } from "motion/react";

import { PawCareLogo } from "@/components/PawCareMark";
import { Reveal } from "@/components/motion-primitives";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { mailtoHref, telHref, waMeHref } from "@/lib/sanitize";

export function SiteFooter() {
  const { settings } = useClinicStore();
  const { t } = useI18n();

  const COLUMNS = [
    {
      heading: t("footer.clinic"),
      links: [
        { to: "/services", label: t("nav.services") },
        { to: "/doctors", label: t("footer.vets") },
        { to: "/about", label: t("footer.about") },
        { to: "/contact", label: t("footer.contact") },
      ],
    },
    {
      heading: t("footer.care"),
      links: [
        { to: "/book", label: t("nav.book") },
        { to: "/services", label: t("footer.services") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <Reveal>
          <div className="md:col-span-2">
            <PawCareLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {settings.address}
              </p>
              <a
                href={telHref(settings.phone) ?? undefined}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-primary" />
                {settings.phone}
              </a>
              <a
                href={mailtoHref(settings.email) ?? undefined}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-primary" />
                {settings.email}
              </a>
              <a
                href={waMeHref(settings.whatsapp) ?? undefined}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <MessageCircle className="size-4 text-primary" />
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>

        {COLUMNS.map((col, i) => (
          <Reveal key={col.heading} delay={0.08 + i * 0.08}>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <p>
            © {new Date().getFullYear()} {settings.name} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="size-3.5" />
              {t("nav.staff")}
            </Link>
            <p>{t("footer.accred")}</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
