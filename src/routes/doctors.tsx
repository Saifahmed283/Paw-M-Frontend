import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { DoctorCard, SectionHeading } from "@/components/site/sections";
import { ANIMAL_TYPES } from "@/lib/clinic-data";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

const title = "Our Veterinarians — Paw-M";
const description =
  "Meet the Paw-M veterinary team in New Cairo: internal medicine, surgery, emergency care, dentistry and exotics specialists, with live availability.";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: ogMeta(title, description, "/doctors"),
    links: [{ rel: "canonical", href: withSiteUrl("/doctors") }],
  }),
  component: DoctorsPage,
});

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function DoctorsPage() {
  const [specialty, setSpecialty] = useState<string>("All");
  const [pet, setPet] = useState<string>("All");
  const { doctors } = useClinicStore();
  const { t } = useI18n();

  const specialties = useMemo(
    () => ["All", ...Array.from(new Set(doctors.map((d) => d.specialization)))],
    [doctors],
  );

  const petFilters = useMemo(
    () => ANIMAL_TYPES.filter((p) => doctors.some((d) => d.pets.includes(p))),
    [doctors],
  );

  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) =>
          (specialty === "All" || d.specialization === specialty) &&
          (pet === "All" || pet === "Other" || d.pets.includes(pet)),
      ),
    [specialty, pet, doctors],
  );

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.doctors"), to: "/doctors" },
            ]}
          />
          <SectionHeading
            eyebrow={t("page.doctors.eyebrow")}
            title={t("page.doctors.title")}
            description={t("page.doctors.desc")}
            as="h1"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("doctors.specLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <FilterChip key={s} active={specialty === s} onClick={() => setSpecialty(s)}>
                  {s === "All"
                    ? t("filter.all")
                    : t(`doc.${doctors.find((d) => d.specialization === s)?.id}.spec`)}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("doctors.petLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["All", ...petFilters].map((p) => (
                <FilterChip key={p} active={pet === p} onClick={() => setPet(p)}>
                  {p === "All" ? t("filter.all") : t(`animal.${p}`)}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {t("doctors.showing", { count: String(filtered.length), total: String(doctors.length) })}
        </p>

        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground"
          >
            {t("doctors.empty")}
          </motion.p>
        ) : (
          <motion.div
            layout
            className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                >
                  <DoctorCard doctor={doctor} index={i} detailed />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  );
}
