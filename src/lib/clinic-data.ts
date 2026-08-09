export const CLINIC = {
  name: "PawCare",
  tagline: "Veterinary care, quietly excellent.",
  phone: "+1 (415) 555-0142",
  emergency: "+1 (415) 555-0911",
  whatsapp: "+1 (415) 555-0142",
  email: "hello@pawcare.clinic",
  address: "218 Marlow Street, Suite 4 · San Francisco, CA 94110",
  hours: [
    { day: "Monday – Friday", time: "08:00 – 20:00" },
    { day: "Saturday", time: "09:00 – 18:00" },
    { day: "Sunday", time: "10:00 – 16:00" },
    { day: "Emergency line", time: "24 / 7" },
  ],
};

export const STATS = [
  { value: 5000, suffix: "+", label: "Pets under our care" },
  { value: 14, suffix: "", label: "Licensed veterinarians" },
  { value: 24, suffix: "/7", label: "Emergency availability" },
  { value: 98, suffix: "%", label: "Owner satisfaction" },
];

export const SERVICES = [
  {
    slug: "general-checkup",
    icon: "Stethoscope",
    title: "General Checkup",
    description: "Full physical exams with a written wellness plan after every visit.",
  },
  {
    slug: "vaccination",
    icon: "Syringe",
    title: "Vaccination",
    description: "Core and lifestyle vaccines, tracked with automatic due-date reminders.",
  },
  {
    slug: "surgery",
    icon: "Scissors",
    title: "Surgery",
    description: "Soft tissue and orthopaedic procedures in a dedicated sterile theatre.",
  },
  {
    slug: "emergency",
    icon: "Siren",
    title: "Emergency Care",
    description: "Triage within minutes, any hour, with on-call critical care staff.",
  },
  {
    slug: "laboratory",
    icon: "FlaskConical",
    title: "Laboratory",
    description: "In-house bloodwork and cytology with same-visit results.",
  },
  {
    slug: "dental",
    icon: "Sparkles",
    title: "Dental Care",
    description: "Scaling, polishing and extractions under monitored anaesthesia.",
  },
  {
    slug: "pharmacy",
    icon: "Pill",
    title: "Pharmacy",
    description: "Dispensed on site, dosage verified against your pet's chart.",
  },
  {
    slug: "grooming",
    icon: "Bath",
    title: "Grooming",
    description: "Medicated baths and coat care supervised by clinical staff.",
  },
  {
    slug: "nutrition",
    icon: "Salad",
    title: "Nutrition",
    description: "Weight and diet programmes built around measurable targets.",
  },
  {
    slug: "x-ray",
    icon: "ScanLine",
    title: "Digital X-Ray",
    description: "Low-dose digital radiography read within the same appointment.",
  },
  {
    slug: "ultrasound",
    icon: "Activity",
    title: "Ultrasound",
    description: "Abdominal and cardiac imaging performed by certified sonographers.",
  },
  {
    slug: "records",
    icon: "FolderHeart",
    title: "Digital Records",
    description: "Every visit, result and prescription in one shareable history.",
  },
];

export const WHY_US = [
  {
    title: "Experienced veterinarians",
    detail:
      "An average of 12 years in practice, with board certifications across five specialties.",
  },
  {
    title: "Modern equipment",
    detail: "Digital radiography, in-house diagnostics and monitored anaesthesia as standard.",
  },
  {
    title: "Transparent pricing",
    detail: "Written estimates before treatment begins. No line item you didn't approve.",
  },
  {
    title: "Emergency services",
    detail: "A staffed critical care team on the floor, not a redirected answering service.",
  },
  {
    title: "Personalised treatment",
    detail: "Care plans built around your pet's age, breed and history — not a template.",
  },
  {
    title: "Digital medical records",
    detail: "Your pet's complete chart, available to you and any clinic you choose.",
  },
];

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  days: string[];
  bio: string;
  initials: string;
  /** Short clinical focus tags shown as badges. */
  tags: string[];
  /** Animal types this clinician primarily treats. */
  pets: string[];
};

export const DOCTORS: Doctor[] = [
  {
    id: "dr-elena-marsh",
    name: "Dr. Elena Marsh",
    specialization: "Internal Medicine",
    experience: "16 years",
    rating: 4.9,
    days: ["Mon", "Tue", "Thu", "Fri"],
    bio: "Leads our diagnostics team and holds a specialty in feline endocrinology.",
    initials: "EM",
    tags: ["Endocrinology", "Chronic disease", "Senior care", "Ultrasound"],
    pets: ["Dog", "Cat"],
  },
  {
    id: "dr-samir-haddad",
    name: "Dr. Samir Haddad",
    specialization: "Surgery & Orthopaedics",
    experience: "13 years",
    rating: 4.8,
    days: ["Mon", "Wed", "Thu"],
    bio: "Performs over 300 soft tissue and orthopaedic procedures each year.",
    initials: "SH",
    tags: ["Orthopaedics", "Soft tissue", "Cruciate repair", "Post-op rehab"],
    pets: ["Dog", "Cat"],
  },
  {
    id: "dr-nadia-osei",
    name: "Dr. Nadia Osei",
    specialization: "Emergency & Critical Care",
    experience: "11 years",
    rating: 5.0,
    days: ["Tue", "Wed", "Fri", "Sat"],
    bio: "Runs the overnight critical care rotation and our triage protocol.",
    initials: "NO",
    tags: ["Triage", "Critical care", "Trauma", "Overnight"],
    pets: ["Dog", "Cat", "Rabbit"],
  },
  {
    id: "dr-james-oconnell",
    name: "Dr. James O'Connell",
    specialization: "Dentistry & Oral Surgery",
    experience: "9 years",
    rating: 4.8,
    days: ["Wed", "Thu", "Sat"],
    bio: "Focused on pain-managed dental care for senior and small-breed patients.",
    initials: "JO",
    tags: ["Dental surgery", "Extractions", "Pain management", "Small breeds"],
    pets: ["Dog", "Cat"],
  },
  {
    id: "dr-priya-raman",
    name: "Dr. Priya Raman",
    specialization: "Dermatology & Allergy",
    experience: "10 years",
    rating: 4.9,
    days: ["Mon", "Tue", "Fri"],
    bio: "Builds long-term plans for chronic skin, ear and allergy conditions.",
    initials: "PR",
    tags: ["Allergy testing", "Ear disease", "Skin cytology", "Immunotherapy"],
    pets: ["Dog", "Cat"],
  },
  {
    id: "dr-tomas-lindqvist",
    name: "Dr. Tomas Lindqvist",
    specialization: "Exotics & Small Mammals",
    experience: "14 years",
    rating: 4.7,
    days: ["Tue", "Thu", "Sat"],
    bio: "Cares for rabbits, reptiles and birds with species-specific protocols.",
    initials: "TL",
    tags: ["Exotics anaesthesia", "Avian medicine", "Dental burring", "Husbandry"],
    pets: ["Rabbit", "Bird", "Reptile", "Ferret", "Guinea Pig"],
  },
];

export const BOOKING_STEPS = [
  { title: "Choose a date", detail: "Live availability across every clinician." },
  { title: "Pick a time", detail: "Booked slots disappear as you look." },
  { title: "Tell us about your pet", detail: "Species, breed, age, weight, history." },
  { title: "Describe the case", detail: "Symptoms, medications, allergies." },
  { title: "Confirm", detail: "Summary, calendar invite and reminders." },
];

export const TESTIMONIALS = [
  {
    quote:
      "Our terrier was triaged in under four minutes at 2am. The follow-up notes were in my inbox before we got home.",
    name: "Hannah Doyle",
    pet: "Rufus · Border Terrier",
    rating: 5,
  },
  {
    quote:
      "They explained every line of the estimate before touching anything. That kind of honesty is rare.",
    name: "Marcus Bell",
    pet: "Nala · Maine Coon",
    rating: 5,
  },
  {
    quote:
      "The vaccination reminders alone are worth it. I have never missed a booster since switching.",
    name: "Aisha Rahman",
    pet: "Kobi · Shiba Inu",
    rating: 5,
  },
  {
    quote:
      "Dr. Lindqvist is the only vet in the city my rabbit doesn't panic around. Genuinely gentle people.",
    name: "Theo Marchetti",
    pet: "Bramble · Lionhead Rabbit",
    rating: 5,
  },
];

export const FAQS = [
  {
    q: "Do you take walk-in emergencies?",
    a: "Yes. Our emergency line is staffed 24/7 and our triage team assesses every walk-in on arrival. Life-threatening cases are always seen first, ahead of scheduled appointments.",
  },
  {
    q: "How far in advance should I book a routine visit?",
    a: "Most routine appointments are available within 48 hours. Specialist consultations — dermatology, dentistry, exotics — usually book five to seven days out.",
  },
  {
    q: "Can I transfer my pet's records from another clinic?",
    a: "Absolutely. Send us your previous clinic's details when you book and we'll request the full history, then merge it into your pet's digital chart before the first visit.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major cards, bank transfer and most pet insurance providers via direct billing. Written estimates are provided before any procedure begins.",
  },
  {
    q: "Do you treat animals other than cats and dogs?",
    a: "Yes — rabbits, ferrets, guinea pigs, reptiles and birds are all seen by our exotics team, with species-specific handling and anaesthesia protocols.",
  },
  {
    q: "How do vaccination reminders work?",
    a: "Every vaccine is logged with its due date. You'll get a reminder 30 days, 7 days and 1 day before it lapses, by email or WhatsApp — whichever you prefer.",
  },
];

export const ANIMAL_TYPES = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Reptile",
  "Ferret",
  "Guinea Pig",
  "Other",
];

export const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

/** Deterministic pseudo-booked slots so the picker feels alive without a backend yet. */
export function bookedSlotsFor(
  dateISO: string,
  doctorId: string,
  confirmed?: { doctorId: string; date: string; time: string }[],
): string[] {
  let seed = 0;
  const key = `${dateISO}|${doctorId}`;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) % 100000;
  const pseudo = TIME_SLOTS.filter((_, i) => (seed >> (i % 12)) % 3 === 0);
  const real = new Set(
    (confirmed ?? [])
      .filter((b) => b.date === dateISO && b.doctorId === doctorId)
      .map((b) => b.time),
  );
  return [...new Set([...pseudo, ...real])];
}

export const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type AvailabilityDay = {
  dateISO: string;
  dayLabel: string;
  dateLabel: string;
  openCount: number;
  slots: string[];
};

/**
 * Next `count` working days for a doctor, with the first open slots on each.
 * Uses the same deterministic pseudo-booking source as the booking picker, plus
 * any real non-cancelled requests so the public availability matches the dashboard.
 */
export function upcomingAvailability(
  doctor: Doctor,
  count = 3,
  from = new Date(),
  confirmed?: { doctorId: string; date: string; time: string; status: string }[],
  locale = "en-US",
): AvailabilityDay[] {
  const out: AvailabilityDay[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const realBookings = (confirmed ?? []).filter(
    (c) => c.status !== "cancelled" && c.status !== "completed",
  );
  for (let i = 0; i < 30 && out.length < count; i++) {
    cursor.setDate(cursor.getDate() + 1);
    const dayLabel = DAY_ORDER[cursor.getDay()]!;
    if (!doctor.days.includes(dayLabel)) continue;
    const dateISO = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const booked = new Set(bookedSlotsFor(dateISO, doctor.id, realBookings));
    const open = TIME_SLOTS.filter((t) => !booked.has(t));
    if (open.length === 0) continue;
    out.push({
      dateISO,
      dayLabel,
      dateLabel: cursor.toLocaleDateString(locale, { month: "short", day: "numeric" }),
      openCount: open.length,
      slots: open.slice(0, 3),
    });
  }
  return out;
}

/** Every distinct pet type covered by the team, in a stable order. */
export const DOCTOR_PET_FILTERS = ANIMAL_TYPES.filter((a) =>
  DOCTORS.some((d) => d.pets.includes(a)),
);
