import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarHeart, LayoutDashboard, MapPin, PhoneCall } from "lucide-react";

import { PawMLogo } from "@/components/PawMMark";
import { Button } from "@/components/ui/button";
import { StatusOrb } from "@/design-system/primitives/StatusOrb";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { telHref } from "@/lib/sanitize";

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
        { to: "/store", label: t("nav.store") },
        { to: "/store/wishlist", label: t("header.wishlistAria") },
      ],
    },
  ] as const;

  return (
    <footer className="relative mt-8 overflow-hidden border-t-2 border-t-[var(--gold-500)] bg-[var(--navy-900)] text-white">
      {/* Fine engraved rule pattern — a badge motif, not a glow blob. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 63px, #ffc000 64px, transparent 65px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-9 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--gold-500)]/40 bg-white/5 text-[var(--gold-400)]">
              <CalendarHeart className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                {t("footer.readyTitle")}
              </h2>
              <p className="mt-1 text-sm text-white/65">{t("footer.readyDesc")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {settings.emergency && (
              <a
                href={telHref(settings.emergency) ?? undefined}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:border-[var(--gold-500)] hover:text-[var(--gold-400)]"
              >
                <StatusOrb tone="critical" size="sm" pulse={false} />
                {t("hero.emergency")}
              </a>
            )}
            <Button
              asChild
              size="lg"
              className="bg-[var(--gold-500)] text-[var(--navy-900)] shadow-none hover:bg-[var(--gold-400)]"
            >
              <Link to="/book">
                {t("footer.bookVisit")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="border-e-0 border-b border-white/10 pb-8 md:border-b-0 md:border-e md:pb-0 md:pe-8">
            <PawMLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {t("footer.tagline")}
            </p>
            <a
              href="https://maps.app.goo.gl/uGR5EibNi28JSVmP7"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex max-w-sm items-start gap-2 text-sm text-white/70 transition-colors hover:text-[var(--gold-400)]"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--gold-400)]" />
              <span>{t("footer.address")}</span>
            </a>
            {settings.emergency && (
              <a
                href={telHref(settings.emergency) ?? undefined}
                dir="ltr"
                className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--gold-400)] tabular-nums"
              >
                <PhoneCall className="size-3.5" />
                {settings.emergency}
              </a>
            )}
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]">
                <span className="h-px w-5 bg-[var(--gold-500)]" />
                {col.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group relative inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180" />
                      <span className="absolute -bottom-1 start-0 h-px w-full origin-start scale-x-0 bg-[var(--gold-500)] transition-transform duration-300 group-hover:scale-x-100 rtl:origin-end" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[var(--navy-950)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {settings.name} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/15 px-3 py-1.5 transition-colors hover:border-[var(--gold-500)] hover:text-[var(--gold-400)]"
            >
              <LayoutDashboard className="size-3.5" />
              {t("nav.staff")}
            </Link>
            <p className="hidden sm:block">{t("footer.accred")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
