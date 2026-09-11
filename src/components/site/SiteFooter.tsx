import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarHeart, LayoutDashboard, MapPin, PawPrint, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { PawMLogo } from "@/components/PawMMark";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { telHref } from "@/lib/sanitize";

const FLOATING_PAWS = [
  { left: "6%", size: 18, delay: 0, duration: 9 },
  { left: "16%", size: 12, delay: 1.6, duration: 7.5 },
  { left: "38%", size: 22, delay: 0.9, duration: 10.5 },
  { left: "55%", size: 14, delay: 2.4, duration: 8 },
  { left: "72%", size: 20, delay: 0.4, duration: 9.5 },
  { left: "88%", size: 13, delay: 1.2, duration: 7 },
  { left: "95%", size: 17, delay: 2.9, duration: 8.8 },
] as const;

const MARQUEE_ITEMS = 5;

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
  ];

  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] border border-b-0 border-border bg-surface">
      <div className="hero-gradient pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 size-80 rounded-full bg-brass/15 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {FLOATING_PAWS.map((paw, i) => (
          <PawPrint
            key={i}
            className="animate-paw-float absolute bottom-8 text-primary/10"
            style={{
              left: paw.left,
              width: paw.size,
              height: paw.size,
              animationDelay: `${paw.delay}s`,
              animationDuration: `${paw.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 border-b border-border/70 py-8 md:flex-row md:items-center">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <CalendarHeart className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t("footer.readyTitle")}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{t("footer.readyDesc")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {settings.emergency && (
                <a href={telHref(settings.emergency) ?? undefined}>
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive"
                  >
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" />
                      <span className="relative inline-flex size-2 rounded-full bg-destructive" />
                    </span>
                    {t("hero.emergency")}
                  </motion.span>
                </a>
              )}
              <Button
                asChild
                size="lg"
                className="shadow-glow transition-transform hover:scale-[1.03]"
              >
                <Link to="/book">
                  {t("footer.bookVisit")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 py-14 md:grid-cols-[1.35fr_1fr_1fr]">
          <div>
            <Reveal>
              <div className="rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur">
                <PawMLogo />
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t("footer.tagline")}
                </p>
                <a
                  href="https://maps.app.goo.gl/uGR5EibNi28JSVmP7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex max-w-sm items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
                  <span>{t("footer.address")}</span>
                </a>
              </div>
            </Reveal>
          </div>

          {COLUMNS.map((col, i) => (
            <Reveal key={col.heading} delay={0.08 + i * 0.08}>
              <div className="rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles className="size-3.5 text-brass" />
                  {col.heading}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="group relative inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180 rtl:-translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0" />
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="relative border-t border-border/70 bg-background/40">
        <div
          className="overflow-hidden py-3"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-8">
                {Array.from({ length: MARQUEE_ITEMS }, (_, i) => (
                  <span key={i} className="flex items-center gap-8">
                    <span>{t(`footer.marquee.${i}`)}</span>
                    <PawPrint className="size-3 text-primary/40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {settings.name} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-foreground"
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
