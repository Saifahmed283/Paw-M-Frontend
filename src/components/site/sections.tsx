import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bath,
  Check,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountUp, Reveal } from "@/components/motion-primitives";
import { AmbientGlobs } from "@/components/reactbits/AmbientGlobs";
import { BlurText, GradientText } from "@/components/reactbits/TextAnimations";
import { RotatingText } from "@/components/reactbits/RotatingText";
import type { AvailabilityDay, Doctor } from "@/lib/clinic-data";
import { BOOKING_STEPS, FAQS, STATS, upcomingAvailability, WHY_US } from "@/lib/clinic-data";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/sanitize";
import heroImage from "@/assets/hero-vet.jpg";
import clinicImage from "@/assets/clinic-interior.jpg";

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
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span
        className={cn(
          "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brass-strong animate-fade-in",
          center && "justify-center",
        )}
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-brass/60 to-brass/60" />
        {eyebrow}
        {center && (
          <span className="h-px w-10 bg-gradient-to-l from-transparent via-brass/60 to-brass/60" />
        )}
      </span>
      {as === "h1" ? (
        <h1 className="mt-4 text-3xl font-semibold sm:text-[2.75rem] animate-fade-in delay-100">
          <span className="text-brass-strong">{title}</span>
        </h1>
      ) : (
        <h2 className="mt-4 text-3xl font-semibold sm:text-[2.75rem] animate-fade-in delay-100">
          <span className="text-brass-strong">{title}</span>
        </h2>
      )}
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground animate-fade-in delay-200">{description}</p>
      )}
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const { settings, doctors, requests } = useClinicStore();
  const { lang } = useI18n();

  const firstDoctor = doctors[0];
  const nextDay = useMemo(
    () =>
      firstDoctor
        ? upcomingAvailability(firstDoctor, 1, new Date(), requests, lang === "ar" ? "ar" : "en-US")
        : [],
    [firstDoctor, requests, lang],
  );

  return (
    <section className="relative overflow-hidden pb-12 pt-20 sm:pt-24">
      <div className="hero-gradient absolute inset-0 -z-10" />
      <AmbientGlobs className="-z-[5]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.75rem]">
            {t("hero.title.a")}{" "}
            <RotatingText
              texts={[
                t("hero.rotating.0"),
                t("hero.rotating.1"),
                t("hero.rotating.2"),
                t("hero.rotating.3"),
                t("hero.rotating.4"),
              ]}
              className="align-baseline"
              splitBy="words"
              staggerDuration={0.05}
              rotationInterval={2600}
            />
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Link to="/book">
                {t("hero.book")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group hover:border-destructive/60 hover:bg-destructive/10 hover:text-foreground"
            >
              <a href={telHref(settings.emergency) ?? undefined}>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-destructive" />
                </span>
                {t("hero.emergency")}
              </a>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60}>
                <dt className="text-2xl font-bold tracking-tight text-foreground">
                  <CountUp
                    value={i === 1 ? doctors.length : stat.value}
                    suffix={i === 1 ? "" : stat.suffix}
                  />
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                  {t(`stats.${i}`)}
                </dd>
              </Reveal>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            <img
              src={heroImage}
              alt={t("img.hero")}
              width={1002}
              height={854}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="glass absolute -bottom-10 -left-4 w-56 rounded-2xl p-4 shadow-lg sm:-left-8 rtl:left-auto rtl:-right-4 rtl:sm:-right-8 animate-slide-up">
            <p className="text-xs font-medium text-muted-foreground">{t("hero.triage")}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">4m 12s</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-3/4 rounded-full bg-success" />
            </div>
          </div>

          <div className="glass absolute -right-10 -top-12 w-52 rounded-2xl p-4 shadow-lg sm:-right-8 rtl:right-auto rtl:-left-10 rtl:sm:-left-8 animate-slide-up delay-100">
            <p className="text-xs font-medium text-muted-foreground">{t("hero.nextAvailable")}</p>
            {nextDay[0] ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {nextDay[0].dayLabel} · {nextDay[0].slots[0]}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{firstDoctor?.name}</p>
              </>
            ) : (
              <p className="mt-1 text-sm font-semibold text-foreground">—</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const { services } = useClinicStore();
  const { tOr } = useI18n();
  const items = limit ? services.slice(0, limit) : services;
  return (
    <div className="pawm-stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service, i) => {
        const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
        return (
          <article key={service.slug} className="pawm-stagger-item group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-raised">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold">
              {tOr(`svc.${service.slug}.title`, service.title)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tOr(`svc.${service.slug}.desc`, service.description)}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function WhyUs() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
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

        <div>
          <SectionHeading
            eyebrow={t("why.eyebrow")}
            title={t("why.title")}
            description={t("why.desc")}
          />
          <ul className="pawm-stagger mt-8 space-y-5">
            {WHY_US.map((item, i) => (
              <li key={item.title}>
                <div className="pawm-stagger-item">
                  <div className="flex gap-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(`whyitem.${i}.title`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {t(`whyitem.${i}.detail`)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DoctorAvailability({ doctor }: { doctor: Doctor }) {
  // Computed after mount: it depends on today's date, which differs between
  // the server render and the browser.
  const { requests } = useClinicStore();
  const { t } = useI18n();
  const { lang } = useI18n();
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
      <p className="mt-4 rounded-xl bg-muted/60 px-3 py-3 text-xs text-muted-foreground">
        {t("availability.fullyBooked")}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-xl bg-muted/50 p-3">
      {days.map((day) => (
        <div key={day.dateISO} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">
              {t(`day.${day.dayLabel}`)} {day.dateLabel}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {day.openCount} {t("availability.slotsOpen")}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            {day.slots.map((slot) => (
              <Link
                key={slot}
                to="/book"
                search={{ doctor: doctor.id }}
                className="rounded-md bg-background px-1.5 py-1 text-[11px] font-medium text-primary shadow-card transition-colors hover:bg-primary hover:text-primary-foreground"
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
    <Reveal delay={(index % 3) * 60}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-raised">
        <div className="flex h-32 items-end justify-between bg-primary/8 p-4">
          <span className="grid size-14 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
            {doctor.initials}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-foreground shadow-card">
            <Star className="size-3 fill-warning text-warning" />
            {doctor.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-sm font-semibold">{t(`doc.${doctor.id}.name`)}</h3>
          <p className="text-xs text-primary">{t(`doc.${doctor.id}.spec`)}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {t(`doc.${doctor.id}.bio`)}
          </p>

          <div className="mt-3 flex flex-wrap gap-1">
            {doctor.tags.map((tag, j) => (
              <span
                key={tag}
                className="rounded-full border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[10px] font-medium text-primary"
              >
                {t(`doc.${doctor.id}.tag.${j}`)}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1">
            <PawPrint className="size-3 text-muted-foreground" aria-hidden />
            <span className="sr-only">{t("availability.treats")}</span>
            {doctor.pets.map((pet) => (
              <span
                key={pet}
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {t(`animal.${pet}`)}
              </span>
            ))}
          </div>

          {detailed ? (
            <DoctorAvailability doctor={doctor} />
          ) : (
            <div className="mt-3 flex flex-wrap gap-1">
              {doctor.days.map((d) => (
                <span
                  key={d}
                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {t(`day.${d}`)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-[11px] text-muted-foreground">
              {t(`doc.${doctor.id}.exp`)} {t("availability.experience")}
            </span>
            <Button asChild size="sm" variant="secondary" className="h-7 px-2 text-xs">
              <Link to="/book" search={{ doctor: doctor.id }}>
                {t("availability.book")}
              </Link>
            </Button>
          </div>
        </div>
      </article>
  </Reveal>
);
}

export function BookingTimeline() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          center
          eyebrow={t("booking.eyebrow")}
          title={t("timeline.title")}
          description={t("timeline.desc")}
        />
        <ol className="mt-14 grid gap-8 md:grid-cols-5">
          {BOOKING_STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <Reveal delay={i * 80}>
                <div className="flex items-center gap-3 md:block">
                  <span className="grid size-10 place-items-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="hidden md:absolute md:left-10 md:top-5 md:block md:h-px md:w-[calc(100%-2.5rem)] md:bg-border" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{t(`step.${i}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`step.${i}.detail`)}
                </p>
              </div>
            </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
    const id = window.setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5000);
    return () => window.clearInterval(id);
  }, [paused, testimonials.length]);

  const item = testimonials[active] ?? testimonials[0];
  if (!item) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-5 py-20 sm:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          center
          eyebrow={t("homepage.clinicReviews.eyebrow")}
          title={t("testimonials.title")}
        />
      </div>

      <div className="animate-fade-in">
        <figure className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
          <Quote className="mx-auto size-8 text-primary/30" />
          <motion.blockquote
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg leading-relaxed text-foreground sm:text-xl"
          >
            "{item.comment}"
          </motion.blockquote>
          <figcaption className="mt-8">
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{item.author}</p>
            <p className="text-sm text-muted-foreground">{t("reviews.googleSource")}</p>
          </figcaption>
        </figure>
      </div>
      <div className="mt-8 flex justify-center gap-1">
        {testimonials.map((review, i) => (
          <button
            key={review.id}
            onClick={() => setActive(i)}
            aria-label={`${t("testimonials.eyebrow")} ${i + 1}`}
            aria-current={i === active}
            className="grid h-7 min-w-7 place-items-center px-1"
          >
            <span
              className={
                i === active
                  ? "block h-1.5 w-5 rounded-full bg-primary transition-all"
                  : "block h-1.5 w-3 rounded-full bg-border transition-all hover:bg-muted-foreground"
              }
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
    <section className="border-t border-border bg-surface py-20">
      <Reveal>
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading center eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 80}>
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {t(`faq.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {t(`faq.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </section>
  );
}

export function CtaBand() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center shadow-lg sm:px-16">
          <div className="hero-gradient absolute inset-0" />
          <AmbientGlobs className="opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("cta.title.a")}{" "}
              <GradientText className="font-bold" animationSpeed={6}>
                {t("cta.title.b")}
              </GradientText>{" "}
              {t("cta.title.c")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/book">
                  {t("cta.book")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={telHref(settings.emergency) ?? undefined}>
                  {t("cta.call", { phone: settings.emergency })}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
