import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bath,
  FlaskConical,
  FolderHeart,
  PawPrint,
  Pill,
  Quote,
  Salad,
  ScanLine,
  Scissors,
  Siren,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassPanel } from "@/design-system/primitives/GlassPanel";
import { MetricTile } from "@/design-system/primitives/MetricTile";
import { CrestFlourish } from "@/design-system/primitives/CrestFlourish";
import { SectionFrame, SectionTitle } from "@/design-system/primitives/SectionFrame";
import { StatusOrb } from "@/design-system/primitives/StatusOrb";
import { RotatingText } from "@/components/reactbits/RotatingText";
import type { AvailabilityDay, Doctor } from "@/lib/clinic-data";
import { FAQS, STATS, upcomingAvailability, WHY_US } from "@/lib/clinic-data";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/sanitize";
import heroImage from "@/assets/hero-vet.jpg";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Syringe,
  Scissors,
  Siren,
  FlaskConical,
  Sparkles,
  Pill,
  Bath,
  Salad,
  ScanLine,
  Activity,
  FolderHeart,
};

const rise = (index: number): CSSProperties =>
  ({ "--rise-delay": `${index * 70}ms` }) as CSSProperties;

/** Kept as the shared heading export for about/contact/doctors/services/store routes. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <SectionTitle
      eyebrow={eyebrow}
      title={title}
      description={description}
      center={center}
      as={as}
    />
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { t, lang } = useI18n();
  const { settings, doctors, requests } = useClinicStore();

  useEffect(() => setMounted(true), []);

  const firstDoctor = doctors[0];
  const nextDay = useMemo(
    // Availability depends on today's date, which differs between server and
    // browser. Compute only after mount so hydration renders the same fallback.
    () =>
      mounted && firstDoctor
        ? upcomingAvailability(firstDoctor, 1, new Date(), requests, lang === "ar" ? "ar" : "en-US")
        : [],
    [mounted, firstDoctor, requests, lang],
  );

  const next = nextDay[0];
  const rotatingTexts = Array.from({ length: 5 }, (_, i) => t(`hero.rotating.${i}`));

  return (
    <section className="hero-gradient relative overflow-hidden border-b border-[var(--line)] pb-16 pt-28 sm:pb-20 sm:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[var(--gold-500)] to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <h1 className="text-[length:var(--step-4)] font-bold leading-[1.08] tracking-tight sm:text-[length:var(--step-5)]">
            {t("hero.title.a")}{" "}
            <RotatingText
              texts={rotatingTexts}
              className="align-baseline text-[var(--gold-700)] dark:text-[var(--gold-400)]"
              splitBy="words"
              staggerDuration={0.04}
              rotationInterval={2800}
            />
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="shadow-[var(--shadow-2)]">
              <Link to="/book">
                {t("hero.book")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hover:border-urgent/30 hover:bg-[var(--status-critical-bg)] hover:text-urgent"
            >
              <a href={telHref(settings.emergency) ?? undefined}>
                <span className="grid size-3 shrink-0 place-items-center rounded-full border border-urgent/50">
                  <span className="size-1.5 rounded-full bg-urgent" />
                </span>
                {t("hero.emergency")}
              </a>
            </Button>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-t-[var(--gold-500)] pt-7 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <MetricTile
                key={stat.label}
                label={t(`stats.${i}`)}
                value={i === 1 ? doctors.length : stat.value}
                suffix={i === 1 ? "" : stat.suffix}
                sparkline={i === 2}
                status={i === 2 ? "active" : "calm"}
              />
            ))}
          </div>
        </div>

        <div className={cn("relative", reduce && "translate-x-0")}>
          <GlassPanel
            elevation={2}
            tone="solid"
            className="overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] p-0"
          >
            <div className="relative aspect-[4/3.4] w-full overflow-hidden">
              <img
                src={heroImage}
                alt={t("img.hero")}
                width={1002}
                height={854}
                fetchPriority="high"
                className="size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 flex items-center gap-2 rounded-[var(--radius-sm)] border-l-2 border-l-[var(--gold-500)] bg-[var(--navy-900)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[var(--shadow-2)]">
                <PawPrint className="size-3.5 text-[var(--gold-400)]" />
                {settings.name}
              </div>
            </div>
          </GlassPanel>

          <GlassPanel
            elevation={2}
            tone="solid"
            className="pm-rise absolute -bottom-8 -start-4 w-56 border-s-2 border-s-[var(--gold-500)] p-4 sm:-start-8"
            style={rise(2)}
          >
            <div className="flex items-center gap-2">
              <StatusOrb tone={next ? "ok" : "watch"} size="sm" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {t("hero.nextAvailable")}
              </span>
            </div>
            <p className="mt-2 font-data text-lg font-bold leading-tight text-foreground tabular-nums">
              {next ? `${next.dayLabel} · ${next.slots[0]}` : "—"}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink-soft">{firstDoctor?.name}</p>
          </GlassPanel>

          <GlassPanel
            elevation={2}
            tone="solid"
            className="pm-rise absolute -end-6 -top-8 w-48 border-e-2 border-e-[var(--gold-500)] p-4 sm:-end-8"
            style={rise(3)}
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              {t("story.liveStatus")}
            </p>
            <p className="mt-2 flex items-center gap-2 font-data text-lg font-bold text-foreground">
              {doctors.length}
              <span className="text-xs font-medium text-ink-soft">{t("footer.vets")}</span>
            </p>
            <CrestFlourish variant="mark" className="mt-2 h-3 w-full" strokeWidth={1.5} />
          </GlassPanel>
        </div>
      </div>

      <CrestFlourish
        variant="hero"
        className="relative mx-auto mt-16 h-10 max-w-5xl px-5 opacity-70 sm:mt-20"
        strokeWidth={1.5}
      />
    </section>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const { services } = useClinicStore();
  const { tOr } = useI18n();
  const items = limit ? services.slice(0, limit) : services;

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service, i) => {
        const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
        return (
          <GlassPanel
            key={service.slug}
            elevation={1}
            interactive
            className="pm-rise group flex h-full flex-col p-6"
            style={rise(i % 3)}
          >
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)] transition-colors group-hover:bg-[var(--blue-600)] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <span className="font-mono text-[11px] font-bold text-[var(--gold-700)] dark:text-[var(--gold-400)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-base font-bold text-foreground">
              {tOr(`svc.${service.slug}.title`, service.title)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {tOr(`svc.${service.slug}.desc`, service.description)}
            </p>
            <div className="mt-auto h-px w-10 bg-[var(--gold-500)]/60 transition-all duration-300 group-hover:w-20" />
          </GlassPanel>
        );
      })}
    </div>
  );
}

export function WhyUs() {
  const { t } = useI18n();
  return (
    <SectionFrame>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionTitle
          eyebrow={t("why.eyebrow")}
          title={t("why.title")}
          description={t("why.desc")}
          as="h2"
        />

        <div className="divide-y divide-[var(--line)] border-b border-[var(--line)] border-t-2 border-t-[var(--gold-500)]">
          {WHY_US.map((item, i) => (
            <div
              key={item.title}
              className="pm-rise grid gap-2 py-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-8"
              style={rise(i)}
            >
              <div className="flex items-baseline gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gold-500)]" />
                <h3 className="font-display text-[length:var(--step-1)] font-semibold leading-snug text-foreground">
                  {t(`whyitem.${i}.title`)}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{t(`whyitem.${i}.detail`)}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function DoctorAvailability({ doctor }: { doctor: Doctor }) {
  const { requests } = useClinicStore();
  const { t, lang } = useI18n();
  const [days, setDays] = useState<AvailabilityDay[] | null>(null);

  useEffect(
    () =>
      setDays(
        upcomingAvailability(doctor, 2, new Date(), requests, lang === "ar" ? "ar" : "en-US"),
      ),
    [doctor, requests, lang],
  );

  if (!days) {
    return <div className="mt-4 h-[74px] animate-pulse rounded-xl bg-muted/60" />;
  }

  if (days.length === 0) {
    return (
      <p className="mt-4 rounded-xl bg-muted/60 px-3 py-3 text-xs text-ink-soft">
        {t("availability.fullyBooked")}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4">
      {days.map((day) => (
        <div key={day.dateISO} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">
              {t(`day.${day.dayLabel}`)} {day.dateLabel}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-ink-faint tabular-nums">
              {day.openCount} {t("availability.slotsOpen")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1">
            {day.slots.map((slot) => (
              <Link
                key={slot}
                to="/book"
                search={{ doctor: doctor.id }}
                className="rounded-[var(--radius-sm)] border border-[var(--gold-500)]/40 bg-[var(--surface)] px-2 py-1 font-mono text-[11px] font-semibold text-[var(--gold-700)] shadow-[var(--shadow-1)] transition-colors hover:bg-[var(--navy-900)] hover:text-[var(--gold-400)] dark:text-[var(--gold-300)]"
              >
                {slot}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DoctorCard({
  doctor,
  index = 0,
  detailed = false,
}: {
  doctor: Doctor;
  index?: number;
  detailed?: boolean;
}) {
  const { t } = useI18n();
  return (
    <GlassPanel
      elevation={1}
      interactive
      className="pm-rise flex h-full flex-col overflow-hidden p-0"
      style={rise(index % 3)}
    >
      <div className="flex h-28 items-end justify-between border-b-2 border-b-[var(--gold-500)] bg-[var(--navy-900)] p-4">
        <span className="grid size-14 place-items-center rounded-[var(--radius-md)] bg-white/10 font-display text-base font-semibold text-[var(--gold-400)] ring-1 ring-[var(--gold-500)]/40">
          {doctor.initials}
        </span>
        <span className="flex items-center gap-1 rounded-[var(--radius-sm)] bg-white/10 px-2 py-0.5 font-mono text-xs font-bold text-white tabular-nums">
          <Star className="size-3 fill-warning text-warning" />
          {doctor.rating.toFixed(1)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-foreground">{t(`doc.${doctor.id}.name`)}</h3>
        <p className="text-xs font-semibold text-[var(--blue-700)] dark:text-[var(--blue-400)]">
          {t(`doc.${doctor.id}.spec`)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{t(`doc.${doctor.id}.bio`)}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {doctor.tags.map((tag, j) => (
            <span
              key={tag}
              className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-semibold text-ink-soft"
            >
              {t(`doc.${doctor.id}.tag.${j}`)}
            </span>
          ))}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <PawPrint className="size-3 text-ink-faint" aria-hidden />
          <span className="sr-only">{t("availability.treats")}</span>
          {doctor.pets.map((pet) => (
            <span
              key={pet}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-soft"
            >
              {t(`animal.${pet}`)}
            </span>
          ))}
        </div>

        {detailed ? (
          <DoctorAvailability doctor={doctor} />
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.days.map((d) => (
              <span
                key={d}
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-soft"
              >
                {t(`day.${d}`)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3.5">
          <span className="font-mono text-[11px] text-ink-faint">
            {t(`doc.${doctor.id}.exp`)} {t("availability.experience")}
          </span>
          <Button asChild size="sm" variant="secondary">
            <Link to="/book" search={{ doctor: doctor.id }}>
              {t("availability.book")}
            </Link>
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t } = useI18n();
  const { reviews } = useClinicStore();
  const testimonials = reviews.filter(
    (review) => review.productId === "clinic" && review.status === "approved",
  );

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % testimonials.length), 6000);
    return () => window.clearInterval(id);
  }, [paused, testimonials.length]);

  const item = testimonials[active] ?? testimonials[0];
  if (!item) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <SectionTitle
        center
        eyebrow={t("homepage.clinicReviews.eyebrow")}
        title={t("testimonials.title")}
      />
      <div key={active} className="relative mx-auto mt-8 w-full max-w-sm">
        <svg
          viewBox="0 0 240 260"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none w-full overflow-visible"
        >
          <g fill="var(--surface)" stroke="var(--gold-500)" strokeWidth={1.5}>
            <g transform="translate(46 66) rotate(-24) scale(0.92)">
              <path
                className="pm-paw-toe"
                style={{ "--toe-delay": "0ms" } as CSSProperties}
                d="M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
              />
            </g>
            <g transform="translate(92 42) rotate(-9)">
              <path
                className="pm-paw-toe"
                style={{ "--toe-delay": "80ms" } as CSSProperties}
                d="M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
              />
            </g>
            <g transform="translate(148 42) rotate(9)">
              <path
                className="pm-paw-toe"
                style={{ "--toe-delay": "160ms" } as CSSProperties}
                d="M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
              />
            </g>
            <g transform="translate(194 66) rotate(24) scale(0.92)">
              <path
                className="pm-paw-toe"
                style={{ "--toe-delay": "240ms" } as CSSProperties}
                d="M0 -24 C6 -24 12 -15 13 -5 C14 6 9 17 0 19 C-9 17 -14 6 -13 -5 C-12 -15 -6 -24 0 -24 Z"
              />
            </g>
            <path
              className="pm-paw-pad"
              d="M120 92 C106 84 86 90 70 106 C52 124 42 152 44 180 C46 212 66 236 98 244 C112 248 128 248 142 244 C174 236 194 212 196 180 C198 152 188 124 170 106 C154 90 134 84 120 92 Z"
            />
          </g>
          <path
            d="M120 92 C106 84 86 90 70 106 C52 124 42 152 44 180 C46 212 66 236 98 244 C112 248 128 248 142 244 C174 236 194 212 196 180 C198 152 188 124 170 106 C154 90 134 84 120 92 Z"
            transform="translate(12 17) scale(0.9)"
            stroke="var(--gold-500)"
            strokeOpacity="0.35"
            strokeWidth={1}
            pathLength={1}
            className="pm-engrave"
          />
          <path
            d="M120 84 L123 91 L120 98 L117 91 Z"
            fill="var(--gold-500)"
            className="pm-seal-in"
          />
        </svg>

        <figure className="absolute inset-x-[20%] top-[43%] bottom-[8%] flex flex-col items-center justify-center text-center">
          <Quote className="size-3.5 text-[var(--gold-600)] sm:size-4" />
          <motion.blockquote
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1.5 font-display text-[11px] leading-tight text-foreground sm:text-[13px] sm:leading-snug"
          >
            "{item.comment}"
          </motion.blockquote>
          <div className="mt-2 h-px w-10 bg-[var(--gold-500)]/70 sm:mt-3 sm:w-12" />
          <figcaption className="mt-1.5 sm:mt-2">
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="size-2.5 fill-warning text-warning sm:size-3" />
              ))}
            </div>
            <p className="mt-1 text-[10px] font-bold text-foreground sm:text-xs">{item.author}</p>
            <p className="text-[9px] text-ink-faint sm:text-[10px]">{t("reviews.googleSource")}</p>
          </figcaption>
        </figure>
      </div>
      <div className="mt-6 flex justify-center gap-1.5">
        {testimonials.map((review, i) => (
          <button
            key={review.id}
            onClick={() => setActive(i)}
            aria-label={`${t("testimonials.eyebrow")} ${i + 1}`}
            aria-current={i === active}
            className="grid h-7 min-w-7 place-items-center px-1"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all",
                i === active
                  ? "w-6 bg-[var(--gold-600)]"
                  : "w-2.5 bg-[var(--line-strong)] hover:bg-ink-faint",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="border-t border-[var(--line)] bg-[var(--surface-2)] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionTitle center eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <Accordion type="single" collapsible className="mt-9 w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-start text-sm font-bold text-foreground hover:no-underline">
                {t(`faq.${i}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-ink-soft">
                {t(`faq.${i}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <GlassPanel
        elevation={2}
        tone="accent"
        className="relative overflow-hidden border-t-2 border-t-[var(--gold-500)] px-6 py-12 text-center sm:px-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 63px, #ffc000 64px, transparent 65px)",
          }}
        />
        <span className="relative inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]">
          <Sparkles className="size-3" />
          {t("story.careNote")}
        </span>
        <h2 className="relative mx-auto mt-5 max-w-2xl text-[length:var(--step-3)] font-semibold text-white sm:text-[length:var(--step-4)]">
          {t("cta.title.a")} <span className="text-[var(--gold-400)]">{t("cta.title.b")}</span>{" "}
          {t("cta.title.c")}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
          {t("cta.subtitle")}
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[var(--gold-500)] text-[var(--navy-900)] shadow-none hover:bg-[var(--gold-400)]"
          >
            <Link to="/book">
              {t("cta.book")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a href={telHref(settings.emergency) ?? undefined}>
              {t("cta.call", { phone: settings.emergency })}
            </a>
          </Button>
        </div>
      </GlassPanel>
    </section>
  );
}
