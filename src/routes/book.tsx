import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ANIMAL_TYPES, TIME_SLOTS, bookedSlotsFor } from "@/lib/clinic-data";
import { addBookingRequest, useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const title = "Book an Appointment — Paw-M";
const description =
  "Book your pet's veterinary appointment at Paw-M in under a minute. Live availability across every clinician, with instant confirmation.";

const DRAFT_KEY = "paw-m:booking-draft";

type Draft = {
  ownerName: string;
  phone: string;
  email: string;
  petName: string;
  animalType: string;
  customAnimalType?: string;
  age: string;
  weight: string;
  symptoms: string;
  allergies: string;
  medications: string;
  doctorId: string;
  date: string;
  time: string;
  emergency: boolean;
};

const EMPTY: Draft = {
  ownerName: "",
  phone: "",
  email: "",
  petName: "",
  animalType: "Dog",
  age: "",
  weight: "",
  symptoms: "",
  allergies: "",
  medications: "",
  doctorId: "",
  date: "",
  time: "",
  emergency: false,
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { doctor?: string } =>
    typeof search["doctor"] === "string" ? { doctor: search["doctor"] as string } : {},
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/book" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <ClientAuthGate>
      <BookingForm />
    </ClientAuthGate>
  );
}

function BookingForm() {
  const { doctor } = Route.useSearch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { doctors, requests } = useClinicStore();
  const firstDoctor = doctors[0];
  const STEPS = [
    t("booking.step.owner"),
    t("booking.step.pet"),
    t("booking.step.case"),
    t("booking.step.schedule"),
  ];
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    ...EMPTY,
    doctorId: doctor ?? firstDoctor?.id ?? "",
  });

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
    if (raw) {
      try {
        setDraft((d) => ({ ...d, ...(JSON.parse(raw) as Draft), doctorId: doctor ?? d.doctorId }));
      } catch {
        /* ignore malformed draft */
      }
    }
  }, [doctor]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable */
    }
  }, [draft]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const today = new Date().toISOString().slice(0, 10);
  const activeBookings = requests.filter((r) => r.status !== "cancelled");
  const booked = draft.date ? bookedSlotsFor(draft.date, draft.doctorId, activeBookings) : [];

  const valid = [
    draft.ownerName.trim().length > 1 && draft.phone.trim().length > 5,
    draft.petName.trim().length > 0 && draft.animalType.length > 0,
    draft.symptoms.trim().length > 4,
    Boolean(draft.date && draft.time),
  ];

  const submit = async () => {
    const selDoctor = doctors.find((d) => d.id === draft.doctorId);
    if (!selDoctor) {
      toast.error(t("booking.error.doctor"));
      setStep(3);
      return;
    }
    try {
      await addBookingRequest({
        ownerName: draft.ownerName,
        phone: draft.phone,
        email: draft.email,
        petName: draft.petName,
        animalType:
          draft.animalType === "Other" && draft.customAnimalType
            ? draft.customAnimalType
            : draft.animalType,
        age: draft.age,
        weight: draft.weight,
        symptoms: draft.symptoms,
        allergies: draft.allergies,
        medications: draft.medications,
        doctorId: selDoctor.id,
        doctorName: t(`doc.${selDoctor.id}.name`),
        date: draft.date,
        time: draft.time,
        emergency: draft.emergency,
      });
    } catch {
      toast.error(t("booking.error.failed"));
      return;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
    toast.success(t("booking.requested"));
    navigate({
      to: "/booking/success",
      search: {
        pet: draft.petName,
        date: draft.date,
        time: draft.time,
        doctor: t(`doc.${selDoctor.id}.name`),
      },
    });
  };

  return (
    <section className="hero-gradient min-h-screen pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold sm:text-4xl">{t("booking.title")}</h1>
          <p className="mt-3 text-base text-muted-foreground">{t("booking.subtitle")}</p>
        </motion.div>

        <ol className="mt-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("booking.owner.fullName")} required>
                  <Input
                    value={draft.ownerName}
                    onChange={(e) => set("ownerName", e.target.value)}
                    placeholder={t("booking.ph.name")}
                  />
                </Field>
                <Field label={t("booking.owner.phone")} required>
                  <Input
                    value={draft.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder={t("booking.ph.phone")}
                  />
                </Field>
                <Field label={t("booking.owner.email")} className="sm:col-span-2">
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder={t("booking.ph.email")}
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("booking.pet.name")} required>
                  <Input
                    value={draft.petName}
                    onChange={(e) => set("petName", e.target.value)}
                    placeholder={t("booking.ph.petName")}
                  />
                </Field>
                <Field label={t("booking.pet.type")} required>
                  <div className="flex flex-wrap gap-2">
                    {ANIMAL_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          set("animalType", type);
                          // Clear custom animal type when switching from Other to a specific type
                          if (type !== "Other") {
                            set("customAnimalType", undefined);
                          }
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          draft.animalType === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {t(`animal.${type}`)}
                      </button>
                    ))}
                  </div>
                  {draft.animalType === "Other" && (
                    <Field label={t("booking.pet.otherType")}>
                      <Input
                        value={draft.customAnimalType ?? ""}
                        onChange={(e) => set("customAnimalType", e.target.value)}
                        placeholder={t("booking.ph.otherPetType")}
                      />
                    </Field>
                  )}
                </Field>
                <Field label={t("booking.pet.age")}>
                  <Input
                    value={draft.age}
                    onChange={(e) => set("age", e.target.value)}
                    placeholder={t("booking.ph.age")}
                  />
                </Field>
                <Field label={t("booking.pet.weight")}>
                  <Input
                    value={draft.weight}
                    onChange={(e) => set("weight", e.target.value)}
                    placeholder={t("booking.ph.weight")}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">
                <Field label={t("booking.case.symptoms")} required>
                  <Textarea
                    rows={4}
                    value={draft.symptoms}
                    onChange={(e) => set("symptoms", e.target.value)}
                    placeholder={t("booking.ph.symptoms")}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("booking.case.allergies")}>
                    <Input
                      value={draft.allergies}
                      onChange={(e) => set("allergies", e.target.value)}
                      placeholder={t("booking.ph.allergies")}
                    />
                  </Field>
                  <Field label={t("booking.case.medications")}>
                    <Input
                      value={draft.medications}
                      onChange={(e) => set("medications", e.target.value)}
                      placeholder={t("booking.ph.medications")}
                    />
                  </Field>
                </div>
                <label className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span>
                    <span className="block text-sm font-medium">{t("booking.case.emergency")}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {t("booking.case.emergencyDesc")}
                    </span>
                  </span>
                  <Switch checked={draft.emergency} onCheckedChange={(v) => set("emergency", v)} />
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <Field label={t("booking.schedule.doctor")}>
                  <div className="flex flex-wrap gap-2">
                    {doctors.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => set("doctorId", d.id)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          draft.doctorId === d.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {t(`doc.${d.id}.name`)}
                      </button>
                    ))}
                    {doctors.length === 0 && (
                      <p className="w-full text-xs text-muted-foreground">
                        {t("booking.empty.doctors")}
                      </p>
                    )}
                  </div>
                </Field>

                <Field label={t("booking.schedule.date")} required>
                  <Input
                    type="date"
                    min={today}
                    value={draft.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </Field>

                <Field label={t("booking.schedule.time")} required>
                  {!draft.date ? (
                    <p className="text-sm text-muted-foreground">{t("booking.schedule.hint")}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {TIME_SLOTS.map((slot) => {
                        const taken = booked.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={taken}
                            onClick={() => set("time", slot)}
                            className={cn(
                              "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                              taken &&
                                "cursor-not-allowed border-border text-muted-foreground/40 line-through",
                              !taken &&
                                draft.time === slot &&
                                "border-primary bg-primary text-primary-foreground",
                              !taken &&
                                draft.time !== slot &&
                                "border-border text-foreground hover:border-primary/40",
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Field>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="size-4" /> {t("booking.back")}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!valid[step]}
                  className="shadow-glow"
                >
                  {t("booking.continue")} <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={!valid[3]} className="shadow-glow">
                  {t("booking.confirm")} <Check className="size-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}
