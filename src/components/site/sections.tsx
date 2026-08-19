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
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CountUp, Reveal } from "@/components/motion-primitives";
import { AmbientGlobs } from "@/components/reactbits/AmbientGlobs";
import { BlurText, GradientText, ShinyText } from "@/components/reactbits/TextAnimations";
import { RotatingText } from "@/components/reactbits/RotatingText";
import type { AvailabilityDay, Doctor } from "@/lib/clinic-data";
import {
  BOOKING_STEPS,
  FAQS,
  STATS,
  TESTIMONIALS,
  upcomingAvailability,
  WHY_US,
} from "@/lib/clinic-data";
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
      <Reveal>
        <span
          className={cn(
            "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brass",
            center && "justify-center",
          )}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-brass/60 to-brass/60" />
          {eyebrow}
          {center && (
            <span className="h-px w-10 bg-gradient-to-l from-transparent via-brass/60 to-brass/60" />
          )}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        {as === "h1" ? (
          <h1 className="mt-4 text-3xl font-semibold sm:text-[2.75rem]">
            <BlurText text={title} as="span" direction="top" stepDuration={0.3} />
          </h1>
        ) : (
          <h2 className="mt-4 text-3xl font-semibold sm:text-[2.75rem]">
            <BlurText text={title} as="span" direction="top" stepDuration={0.3} />
          </h2>
        )}
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const ease = [0.16, 1, 0.3, 1] as const;
  const rotatingTexts = Array.from({ length: 5 }, (_, i) => t(`hero.rotating.${i}`));

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
      <div className="hero-gradient absolute inset-0 -z-10" />
      <AmbientGlobs className="-z-[5]" />
      <div className="grid-lines absolute inset-x-0 top-0 -z-10 h-[420px] opacity-25" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease }}
        >
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-success rtl:ml-2 rtl:mr-0" />
            <ShinyText text={t("hero.badge")} spread={90} speed={3} className="text-[inherit]" />
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[3.75rem]">
            {t("hero.title.a")}{" "}
            <span className="text-gradient-soft">
              <RotatingText
                texts={rotatingTexts}
                className="align-baseline"
                splitBy="words"
                staggerDuration={0.05}
                rotationInterval={2600}
              />
            </span>
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
            <Button asChild size="lg" variant="outline" className="group">
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
              <Reveal key={stat.label} delay={i * 0.06}>
                <div>
                  <dt className="text-2xl font-bold tracking-tight text-foreground">
                    <CountUp
                      value={i === 1 ? doctors.length : stat.value}
                      suffix={i === 1 ? "" : stat.suffix}
                    />
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {t(`stats.${i}`)}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </motion.div>

        <motion.div
          ref={frameRef}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="relative"
          style={{ transform: reduce ? "none" : `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            <img
              src={heroImage}
              alt={t("img.hero")}
              width={1408}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.45 }}
            className="glass absolute -bottom-6 -left-4 w-56 rounded-2xl p-4 shadow-lg sm:-left-8 rtl:left-auto rtl:-right-4 rtl:sm:-right-8"
          >
            <p className="text-xs font-medium text-muted-foreground">{t("hero.triage")}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">4m 12s</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-3/4 rounded-full bg-success" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.6 }}
            className="glass absolute -right-4 top-8 w-52 rounded-2xl p-4 shadow-lg sm:-right-8 rtl:right-auto rtl:-left-4 rtl:sm:-left-8"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const { services } = useClinicStore();
  const { t } = useI18n();
  const items = limit ? services.slice(0, limit) : services;
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service, i) => {
        const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
        return (
          <Reveal key={service.slug} delay={(i % 3) * 0.06}>
            <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-raised">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{t(`svc.${service.slug}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`svc.${service.slug}.desc`)}
              </p>
            </article>
          </Reveal>
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
              width={1200}
              height={1008}
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
          <ul className="mt-8 space-y-5">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <li className="flex gap-4">
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
                </li>
              </Reveal>
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
    <Reveal delay={(index % 3) * 0.06}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-raised">
        <div className="flex h-36 items-end justify-between bg-primary/8 p-5">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {doctor.initials}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-card">
            <Star className="size-3 fill-warning text-warning" />
            {doctor.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-semibold">{t(`doc.${doctor.id}.name`)}</h3>
          <p className="text-sm text-primary">{t(`doc.${doctor.id}.spec`)}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t(`doc.${doctor.id}.bio`)}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {doctor.tags.map((tag, j) => (
              <span
                key={tag}
                className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
              >
                {t(`doc.${doctor.id}.tag.${j}`)}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <PawPrint className="size-3.5 text-muted-foreground" aria-hidden />
            <span className="sr-only">{t("availability.treats")}</span>
            {doctor.pets.map((pet) => (
              <span
                key={pet}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {t(`animal.${pet}`)}
              </span>
            ))}
          </div>

          {detailed ? (
            <DoctorAvailability doctor={doctor} />
          ) : (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {doctor.days.map((d) => (
                <span
                  key={d}
                  className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {t(`day.${d}`)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {t(`doc.${doctor.id}.exp`)} {t("availability.experience")}
            </span>
            <Button asChild size="sm" variant="secondary">
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
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="relative">
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
              </li>
            </Reveal>
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

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  const item = TESTIMONIALS[active] ?? TESTIMONIALS[0]!;

  return (
    <section
      className="mx-auto max-w-6xl px-5 py-20 sm:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <SectionHeading center eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} />

      <Reveal>
        <figure className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
          <Quote className="mx-auto size-8 text-primary/30" />
          <motion.blockquote
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg leading-relaxed text-foreground sm:text-xl"
          >
            "{t(`testi.${active}.quote`)}"
          </motion.blockquote>
          <figcaption className="mt-8">
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {t(`testi.${active}.name`)}
            </p>
            <p className="text-sm text-muted-foreground">{t(`testi.${active}.pet`)}</p>
          </figcaption>
        </figure>
      </Reveal>

      <div className="mt-8 flex justify-center gap-2">
        {TESTIMONIALS.map((item, i) => (
          <button
            key={item.name}
            onClick={() => setActive(i)}
            aria-label={`${t("testimonials.eyebrow")} ${i + 1}`}
            aria-current={i === active}
            className={
              i === active
                ? "h-1.5 w-8 rounded-full bg-primary transition-all"
                : "h-1.5 w-3 rounded-full bg-border transition-all hover:bg-muted-foreground"
            }
          />
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading center eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <Accordion type="single" collapsible className="mt-10 w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {t(`faq.${i}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
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
