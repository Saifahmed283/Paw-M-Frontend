import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Check } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";

const title = "Appointment Confirmed — PawCare";
const description = "Your PawCare veterinary appointment request has been received.";

export const Route = createFileRoute("/booking/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    pet: typeof search["pet"] === "string" ? (search["pet"] as string) : "",
    date: typeof search["date"] === "string" ? (search["date"] as string) : "",
    time: typeof search["time"] === "string" ? (search["time"] as string) : "",
    doctor: typeof search["doctor"] === "string" ? (search["doctor"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { pet, date, time, doctor } = Route.useSearch();
  const { settings } = useClinicStore();
  const { t } = useI18n();

  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${t("success.icsSummary")}${pet ? ` — ${pet}` : ""}\nDESCRIPTION:${doctor}\nLOCATION:${settings.address}\nEND:VEVENT\nEND:VCALENDAR`;
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;

  return (
    <section className="hero-gradient flex min-h-screen items-center justify-center px-5 py-32">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-7" strokeWidth={3} />
        </span>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{t("booking.requested")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("booking.requestedDesc")}
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl border border-border bg-muted/40 p-5 text-left text-sm rtl:text-right">
          {[
            [t("booking.pet.name"), pet || "—"],
            [t("booking.schedule.date"), date || "—"],
            [t("booking.schedule.time"), time || "—"],
            [t("booking.schedule.doctor"), doctor || t("booking.genericDoctor")],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="shadow-glow">
            <a href={icsHref} download="pawcare-appointment.ics">
              <CalendarCheck className="size-4" /> {t("booking.addCalendar")}
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">{t("booking.home")}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
