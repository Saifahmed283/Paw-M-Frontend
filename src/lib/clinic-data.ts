export const CLINIC = {
  name: "Paw Clinic Madinaty",
  tagline: "Veterinary care with love, under the care of Dr. Mirna.",
  phone: "012 10105624",
  emergency: "012 10105624",
  whatsapp: "012 10105624",
  email: "paw.mclinic@gmail.com",
  address: "Craft Zoon, Second New Cairo, Cairo Governorate 19519",
  currency: "EGP",
  instapay: "",
  hours: [
    { day: "Friday", time: "09:00 – 23:30" },
    { day: "Saturday", time: "09:00 – 23:30" },
    { day: "Sunday", time: "09:00 – 23:30" },
    { day: "Monday", time: "09:00 – 23:30" },
    { day: "Tuesday", time: "09:00 – 23:30" },
    { day: "Wednesday", time: "09:00 – 23:30" },
    { day: "Thursday", time: "09:00 – 23:30" },
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
    price: 300,
  },
  {
    slug: "vaccination",
    icon: "Syringe",
    title: "Vaccination",
    description: "Core and lifestyle vaccines, tracked with automatic due-date reminders.",
    price: 400,
  },
  {
    slug: "surgery",
    icon: "Scissors",
    title: "Surgery",
    description: "Soft tissue and orthopaedic procedures in a dedicated sterile theatre.",
    price: 2000,
  },
  {
    slug: "emergency",
    icon: "Siren",
    title: "Emergency Care",
    description: "Triage within minutes, any hour, with on-call critical care staff.",
    price: 600,
  },
  {
    slug: "laboratory",
    icon: "FlaskConical",
    title: "Laboratory",
    description: "In-house bloodwork and cytology with same-visit results.",
    price: 250,
  },
  {
    slug: "dental",
    icon: "Sparkles",
    title: "Dental Care",
    description: "Scaling, polishing and extractions under monitored anaesthesia.",
    price: 900,
  },
  {
    slug: "pharmacy",
    icon: "Pill",
    title: "Pharmacy",
    description: "Dispensed on site, dosage verified against your pet's chart.",
    price: 0,
  },
  {
    slug: "grooming",
    icon: "Bath",
    title: "Grooming",
    description: "Medicated baths and coat care supervised by clinical staff.",
    price: 350,
  },
  {
    slug: "nutrition",
    icon: "Salad",
    title: "Nutrition",
    description: "Weight and diet programmes built around measurable targets.",
    price: 200,
  },
  {
    slug: "x-ray",
    icon: "ScanLine",
    title: "Digital X-Ray",
    description: "Low-dose digital radiography read within the same appointment.",
    price: 500,
  },
  {
    slug: "ultrasound",
    icon: "Activity",
    title: "Ultrasound",
    description: "Abdominal and cardiac imaging performed by certified sonographers.",
    price: 700,
  },
  {
    slug: "records",
    icon: "FolderHeart",
    title: "Digital Records",
    description: "Every visit, result and prescription in one shareable history.",
    price: 150,
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
    detail: "Written estimates before treatment begins. No line item you haven't approved.",
  },
  {
    title: "Emergency services",
    detail: "A staffed critical care team on the floor, not a redirected answering service.",
  },
];

export type Doctor = {
  id: string;
  name: string;
  title?: string;
  licenseNumber?: string;
  signatureImage?: string;
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
    id: "dr-mirna",
    name: "Dr. Mirna",
    specialization: "Veterinarian",
    experience: "Experienced veterinarian",
    rating: 4.9,
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Experienced veterinarian trusted by pet owners across Madinaty, known for gentle handling, thorough diagnosis and follow-up care.",
    initials: "DM",
    title: "Veterinary Surgeon",
    licenseNumber: "VET-EG-2088",
    signatureImage: "",
    tags: ["Veterinary Consultation", "Surgery", "Spaying & Neutering", "Dental Care", "Exotics"],
    pets: ["Dog", "Cat", "Bird", "Rabbit", "Reptile"],
  },
];

export const CLINIC_REVIEWS = [
  {
    author: "Mariem Mahmoud",
    rating: 5,
    comment:
      "Had such a great experience with Dr. Mirna. She was so kind and patient with my cat, and took her time to check him and explain everything.",
  },
  { author: "Rim Ibrahim", rating: 5, comment: "The most amazing service and products." },
  { author: "Ahmed Eng", rating: 5, comment: "Very nice new admin. Nice treat and service." },
  {
    author: "Marina Emad",
    rating: 5,
    comment:
      "Perfect hospitality for my dog when I was out of my country, and every product I need for my dog is available at their shop.",
  },
  {
    author: "Nahla Sherif",
    rating: 5,
    comment:
      "My cat had a critical case of bladder blockage and Dr. Mirna was really professional in diagnosing the case and following up with me every day.",
  },
  {
    author: "Adam Agha",
    rating: 5,
    comment:
      "Dr. Mirna is very respectful, professional, and experienced. I took my cat for a neutering procedure based on a recommendation from a friend.",
  },
  {
    author: "Aziz Ali",
    rating: 5,
    comment: "The clinic is absolutely fantastic, and the doctor is lovely and does a great job.",
  },
  {
    author: "Nehal Nasef",
    rating: 5,
    comment:
      "My favorite vet and pet clinic. They are professional and I highly recommend them to anyone.",
  },
  {
    author: "Hatem El Mandarawi",
    rating: 5,
    comment:
      "Amazing clinic, very professional and extremely caring. After a surgery, the team kept checking in to make sure everything was fine.",
  },
  {
    author: "Marian Tadros",
    rating: 5,
    comment:
      "One of the most comfortable pet clinics I've ever been to. Dr. Mirna is a very skilled doctor.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Had such a great experience with Dr. Mirna. She was so kind and patient with my cat, and took her time to check him and explain everything.",
    name: "Mariem Mahmoud",
    pet: "Cat",
    rating: 5,
  },
  {
    quote:
      "My cat had a critical case of bladder blockage and Dr. Mirna was really professional in diagnosing the case and following up with me every day.",
    name: "Nahla Sherif",
    pet: "Cat",
    rating: 5,
  },
  {
    quote:
      "Perfect hospitality for my dog when I was out of my country, and every product I need for my dog is available at their shop.",
    name: "Marina Emad",
    pet: "Dog",
    rating: 5,
  },
  {
    quote:
      "Amazing clinic, very professional and extremely caring. After a surgery, the team kept checking in to make sure everything was fine.",
    name: "Hatem El Mandarawi",
    pet: "Dog",
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
    a: "Cash and InstaPay. Written estimates are provided before any procedure begins, and online store orders can be paid with transfer details submitted on the order tracking page.",
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

export const ANIMAL_TYPES = ["Dog", "Cat", "Other"];

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
