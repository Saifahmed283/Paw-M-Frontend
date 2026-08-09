import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { writeLangCookie } from "./lang-cookie";

export type Lang = "en" | "ar";

const LANG_KEY = "pawcare:lang";

type Dict = Record<string, string>;

const EN: Dict = {
  // General / nav
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.doctors": "Doctors",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.book": "Book appointment",
  "nav.staff": "Staff dashboard",

  // Hero
  "hero.badge": "Accepting new patients this week",
  "hero.title.a": "Professional veterinary care for your",
  "hero.rotating.0": "beloved pets",
  "hero.rotating.1": "dogs & cats",
  "hero.rotating.2": "bunnies",
  "hero.rotating.3": "birds",
  "hero.rotating.4": "small friends",
  "hero.subtitle":
    "Same-day diagnostics, written estimates before treatment, and a 24/7 emergency team — so the worry ends the moment you walk in.",
  "hero.book": "Book appointment",
  "hero.emergency": "Emergency contact",
  "hero.triage": "Average triage time",
  "hero.nextAvailable": "Next available",

  // Stats
  "stats.0": "Pets under our care",
  "stats.1": "Licensed veterinarians",
  "stats.2": "Emergency availability",
  "stats.3": "Owner satisfaction",

  // Sections
  "services.eyebrow": "Services",
  "why.eyebrow": "Why PawCare",
  "team.eyebrow": "Our team",
  "booking.eyebrow": "How it works",
  "testimonials.eyebrow": "Testimonials",
  "faq.eyebrow": "FAQ",
  "cta.title.a": "Your pet deserves",
  "cta.title.b": "a calm, clear answer",
  "cta.title.c": "today",
  "cta.subtitle": "Book online in under a minute, or call the emergency line if it can't wait.",
  "cta.book": "Book appointment",
  "cta.call": "Call {phone}",

  // Dashboard
  "dash.title": "Staff dashboard",
  "dash.subtitle": "Manage requests, reservations, the team and services.",
  "dash.overview": "Overview",
  "dash.requests": "Requests",
  "dash.reservations": "Reservations",
  "dash.doctors": "Doctors",
  "dash.services": "Services",
  "dash.settings": "Settings",
  "dash.back": "Back to site",
  "dash.overview.stats.pending": "Pending requests",
  "dash.overview.stats.confirmed": "Confirmed reservations",
  "dash.overview.stats.completed": "Completed visits",
  "dash.overview.stats.doctors": "Active doctors",
  "dash.overview.today": "Today's schedule",
  "dash.overview.noData": "Nothing scheduled today.",
  "dash.overview.recent": "Recent requests",
  "dash.overview.viewAll": "View all",
  "dash.empty": "Nothing here yet.",
  "dash.search": "Search…",
  "dash.filterAll": "All",
  "dash.filterPending": "Pending",
  "dash.filterConfirmed": "Confirmed",
  "dash.filterCompleted": "Completed",
  "dash.filterCancelled": "Cancelled",
  "dash.status.pending": "Pending",
  "dash.status.confirmed": "Confirmed",
  "dash.status.completed": "Completed",
  "dash.status.cancelled": "Cancelled",
  "dash.confirm": "Confirm",
  "dash.complete": "Mark done",
  "dash.cancel": "Cancel",
  "dash.delete": "Delete",
  "dash.edit": "Edit",
  "dash.add": "Add",
  "dash.save": "Save changes",
  "dash.close": "Close",
  "dash.addDoctor": "Add doctor",
  "dash.editDoctor": "Edit doctor",
  "dash.form.name": "Full name",
  "dash.form.specialization": "Specialization",
  "dash.form.experience": "Experience",
  "dash.form.rating": "Rating",
  "dash.form.bio": "Short bio",
  "dash.form.initials": "Initials",
  "dash.form.pets": "Pets treated (comma separated)",
  "dash.form.tags": "Tags (comma separated)",
  "dash.form.days": "Working days (comma separated)",
  "dash.form.service.title": "Service title",
  "dash.form.service.desc": "Description",
  "dash.addService": "Add service",
  "dash.editService": "Edit service",
  "dash.owner": "Owner",
  "dash.pet": "Pet",
  "dash.doctor": "Veterinarian",
  "dash.date": "Date",
  "dash.time": "Time",
  "dash.requestedAt": "Requested",
  "dash.emergency.yes": "Emergency",
  "dash.notes": "Symptoms",
  "dash.actions": "Actions",
  "dash.actionsCancel": "Cancel this request?",
  "dash.viewReservations": "View reservations",
  "dash.overview.recentDesc": "Latest booking requests, newest first.",
  "dash.reservationsDesc": "Confirmed appointments, from today forward.",
  "dash.settings.general": "Clinic details",
  "dash.settings.generalDesc": "These details are used across the public site.",
  "dash.settings.emergency": "Emergency phone",
  "dash.settings.address": "Address",
  "dash.settings.persist": "Saved to this browser",
  "dash.specialization.col": "Specialization",
  "dash.experience.col": "Experience",
  "dash.rating.col": "Rating",
  "dash.toast.confirmed": "Reservation confirmed.",
  "dash.toast.completed": "Visit marked as completed.",
  "dash.toast.cancelled": "Reservation cancelled.",
  "dash.toast.deleted": "Item deleted.",
  "dash.toast.saved": "Saved.",
  "dash.doctors.hint": "Changes appear on the public Doctors page immediately.",
  "dash.services.hint": "Changes appear on the public Services page immediately.",
  "dash.settings.lang": "Interface language",
  "dash.settings.langDesc": "Switch between English and Arabic (العربية).",
  "dash.settings.theme": "Theme",
  "dash.settings.name": "Clinic name",
  "dash.settings.email": "Contact email",
  "dash.settings.phone": "Phone",
  "dash.settings.whatsapp": "WhatsApp",
  "dash.confirmRow": "Confirm",
  "dash.cancelRow": "Cancel",
  "dash.openRow": "Open",
  "dash.rows": "rows",
  "dash.showing": "Showing {count} {rows}",

  // Auth / staff sign-in
  "auth.signIn": "Staff sign-in",
  "auth.signInDesc": "Restricted area. Enter the admin PIN to continue.",
  "auth.pin": "Admin PIN",
  "auth.pinPlaceholder": "••••••",
  "auth.unlock": "Unlock dashboard",
  "auth.setupTitle": "Set up admin PIN",
  "auth.setupDesc":
    "Choose a PIN to secure the staff dashboard. You'll need it each time you sign in.",
  "auth.setupConfirm": "Confirm PIN",
  "auth.mismatch": "PINs do not match.",
  "auth.pinTooShort": "PIN must be at least 4 characters.",
  "auth.invalidPin": "Incorrect PIN. Try again.",
  "auth.locked": "Too many attempts. Try again in {minutes}m.",
  "auth.signOut": "Sign out",
  "auth.changePin": "Change PIN",
  "auth.currentPin": "Current PIN",
  "auth.newPin": "New PIN",
  "auth.confirmNewPin": "Confirm new PIN",
  "auth.pinChanged": "PIN changed.",
  "auth.wrongCurrent": "Current PIN is incorrect.",

  // Booking page
  "booking.title": "Book an appointment",
  "booking.subtitle": "Four short steps. Your answers save automatically as you type.",
  "booking.step.owner": "Owner",
  "booking.step.pet": "Pet",
  "booking.step.case": "Case",
  "booking.step.schedule": "Schedule",
  "booking.owner.fullName": "Full name",
  "booking.owner.phone": "Phone",
  "booking.owner.email": "Email",
  "booking.pet.name": "Pet name",
  "booking.pet.type": "Animal type",
  "booking.pet.breed": "Breed",
  "booking.pet.age": "Age",
  "booking.pet.weight": "Weight",
  "booking.case.symptoms": "Symptoms and case description",
  "booking.case.allergies": "Known allergies",
  "booking.case.medications": "Current medications",
  "booking.case.emergency": "This is an emergency",
  "booking.case.emergencyDesc": "Flags the case for immediate triage by the on-call team.",
  "booking.schedule.doctor": "Preferred veterinarian",
  "booking.schedule.date": "Date",
  "booking.schedule.time": "Time",
  "booking.schedule.hint": "Pick a date to see available times.",
  "booking.back": "Back",
  "booking.continue": "Continue",
  "booking.confirm": "Confirm appointment",
  "booking.error.doctor": "Please choose a veterinarian first.",
  "booking.empty.doctors": "No veterinarians available right now.",
  "booking.requested": "Appointment requested",
  "booking.requestedDesc":
    "Our reception team confirms every booking by phone or WhatsApp within 30 minutes during opening hours.",
  "booking.addCalendar": "Add to calendar",
  "booking.home": "Back to home",
  "booking.genericDoctor": "First available",

  // Footer
  "footer.tagline":
    "A boutique veterinary hospital built around clear diagnostics, honest estimates and records you actually own.",
  "footer.accred": "AAHA accredited · Fear Free certified · ISO 9001 quality managed",
  "footer.clinic": "Clinic",
  "footer.care": "Care",
  "footer.services": "Services",
  "footer.vets": "Our veterinarians",
  "footer.about": "About PawCare",
  "footer.contact": "Contact",

  // Public page headers
  "page.services.eyebrow": "Services",
  "page.services.title": "Clinical services, end to end",
  "page.services.desc":
    "Twelve service lines, one medical record. Whatever your pet needs next, the team already has the history.",
  "page.doctors.eyebrow": "Our team",
  "page.doctors.title": "Fourteen clinicians. One shared chart.",
  "page.doctors.desc":
    "Each veterinarian leads a specialty, and complex cases are reviewed together before a plan is signed off.",
  "page.about.eyebrow": "About",
  "page.about.title": "A medical practice that happens to treat animals",
  "page.about.desc":
    "PawCare opened in 2016 with six clinicians and one rule: never send an owner home without an explanation they understood.",
  "page.about.standards": "What we hold ourselves to",
  "page.contact.eyebrow": "Contact",
  "page.contact.title": "We're easy to reach, always",
  "page.contact.desc":
    "The emergency line is answered by a person, not a menu — at any hour of any day.",

  // Home sections
  "home.services.title": "Everything your pet needs, under one roof",
  "home.services.desc":
    "From a routine booster to overnight critical care — no referrals across town, no repeated paperwork.",
  "home.team.eyebrow": "Our team",
  "home.team.title": "Clinicians who explain the whole picture",
  "home.team.desc":
    "Every veterinarian here holds a specialty focus, and every chart is reviewed by two of them.",

  // Why / timeline / testimonials / faq sections
  "why.title": "The standard of care you'd want for yourself",
  "why.desc":
    "Everything here is built to remove guesswork — for you and for the clinician holding the chart.",
  "timeline.title": "Booked in under a minute",
  "timeline.desc":
    "Five short steps. Your progress saves as you go, so a refresh never costs you anything.",
  "testimonials.title": "What pet owners tell us",
  "faq.title": "Questions we hear most",

  // Services content
  "svc.general-checkup.title": "General Checkup",
  "svc.general-checkup.desc": "Full physical exams with a written wellness plan after every visit.",
  "svc.vaccination.title": "Vaccination",
  "svc.vaccination.desc": "Core and lifestyle vaccines, tracked with automatic due-date reminders.",
  "svc.surgery.title": "Surgery",
  "svc.surgery.desc": "Soft tissue and orthopaedic procedures in a dedicated sterile theatre.",
  "svc.emergency.title": "Emergency Care",
  "svc.emergency.desc": "Triage within minutes, any hour, with on-call critical care staff.",
  "svc.laboratory.title": "Laboratory",
  "svc.laboratory.desc": "In-house bloodwork and cytology with same-visit results.",
  "svc.dental.title": "Dental Care",
  "svc.dental.desc": "Scaling, polishing and extractions under monitored anaesthesia.",
  "svc.pharmacy.title": "Pharmacy",
  "svc.pharmacy.desc": "Dispensed on site, dosage verified against your pet's chart.",
  "svc.grooming.title": "Grooming",
  "svc.grooming.desc": "Medicated baths and coat care supervised by clinical staff.",
  "svc.nutrition.title": "Nutrition",
  "svc.nutrition.desc": "Weight and diet programmes built around measurable targets.",
  "svc.x-ray.title": "Digital X-Ray",
  "svc.x-ray.desc": "Low-dose digital radiography read within the same appointment.",
  "svc.ultrasound.title": "Ultrasound",
  "svc.ultrasound.desc": "Abdominal and cardiac imaging performed by certified sonographers.",
  "svc.records.title": "Digital Records",
  "svc.records.desc": "Every visit, result and prescription in one shareable history.",

  // Why items
  "whyitem.0.title": "Experienced veterinarians",
  "whyitem.0.detail":
    "An average of 12 years in practice, with board certifications across five specialties.",
  "whyitem.1.title": "Modern equipment",
  "whyitem.1.detail":
    "Digital radiography, in-house diagnostics and monitored anaesthesia as standard.",
  "whyitem.2.title": "Transparent pricing",
  "whyitem.2.detail": "Written estimates before treatment begins. No line item you didn't approve.",
  "whyitem.3.title": "Emergency services",
  "whyitem.3.detail":
    "A staffed critical care team on the floor, not a redirected answering service.",
  "whyitem.4.title": "Personalised treatment",
  "whyitem.4.detail": "Care plans built around your pet's age, breed and history — not a template.",
  "whyitem.5.title": "Digital medical records",
  "whyitem.5.detail": "Your pet's complete chart, available to you and any clinic you choose.",

  // Booking steps
  "step.0.title": "Choose a date",
  "step.0.detail": "Live availability across every clinician.",
  "step.1.title": "Pick a time",
  "step.1.detail": "Booked slots disappear as you look.",
  "step.2.title": "Tell us about your pet",
  "step.2.detail": "Species, breed, age, weight, history.",
  "step.3.title": "Describe the case",
  "step.3.detail": "Symptoms, medications, allergies.",
  "step.4.title": "Confirm",
  "step.4.detail": "Summary, calendar invite and reminders.",

  // Testimonials
  "testi.0.quote":
    "Our terrier was triaged in under four minutes at 2am. The follow-up notes were in my inbox before we got home.",
  "testi.0.name": "Hannah Doyle",
  "testi.0.pet": "Rufus · Border Terrier",
  "testi.1.quote":
    "They explained every line of the estimate before touching anything. That kind of honesty is rare.",
  "testi.1.name": "Marcus Bell",
  "testi.1.pet": "Nala · Maine Coon",
  "testi.2.quote":
    "The vaccination reminders alone are worth it. I have never missed a booster since switching.",
  "testi.2.name": "Aisha Rahman",
  "testi.2.pet": "Kobi · Shiba Inu",
  "testi.3.quote":
    "Dr. Lindqvist is the only vet in the city my rabbit doesn't panic around. Genuinely gentle people.",
  "testi.3.name": "Theo Marchetti",
  "testi.3.pet": "Bramble · Lionhead Rabbit",

  // FAQ
  "faq.0.q": "Do you take walk-in emergencies?",
  "faq.0.a":
    "Yes. Our emergency line is staffed 24/7 and our triage team assesses every walk-in on arrival. Life-threatening cases are always seen first, ahead of scheduled appointments.",
  "faq.1.q": "How far in advance should I book a routine visit?",
  "faq.1.a":
    "Most routine appointments are available within 48 hours. Specialist consultations — dermatology, dentistry, exotics — usually book five to seven days out.",
  "faq.2.q": "Can I transfer my pet's records from another clinic?",
  "faq.2.a":
    "Absolutely. Send us your previous clinic's details when you book and we'll request the full history, then merge it into your pet's digital chart before the first visit.",
  "faq.3.q": "What payment methods do you accept?",
  "faq.3.a":
    "All major cards, bank transfer and most pet insurance providers via direct billing. Written estimates are provided before any procedure begins.",
  "faq.4.q": "Do you treat animals other than cats and dogs?",
  "faq.4.a":
    "Yes — rabbits, ferrets, guinea pigs, reptiles and birds are all seen by our exotics team, with species-specific handling and anaesthesia protocols.",
  "faq.5.q": "How do vaccination reminders work?",
  "faq.5.a":
    "Every vaccine is logged with its due date. You'll get a reminder 30 days, 7 days and 1 day before it lapses, by email or WhatsApp — whichever you prefer.",

  // Doctors content
  "doc.dr-elena-marsh.name": "Dr. Elena Marsh",
  "doc.dr-elena-marsh.spec": "Internal Medicine",
  "doc.dr-elena-marsh.exp": "16 years",
  "doc.dr-elena-marsh.bio":
    "Leads our diagnostics team and holds a specialty in feline endocrinology.",
  "doc.dr-elena-marsh.tag.0": "Endocrinology",
  "doc.dr-elena-marsh.tag.1": "Chronic disease",
  "doc.dr-elena-marsh.tag.2": "Senior care",
  "doc.dr-elena-marsh.tag.3": "Ultrasound",
  "doc.dr-samir-haddad.name": "Dr. Samir Haddad",
  "doc.dr-samir-haddad.spec": "Surgery & Orthopaedics",
  "doc.dr-samir-haddad.exp": "13 years",
  "doc.dr-samir-haddad.bio": "Performs over 300 soft tissue and orthopaedic procedures each year.",
  "doc.dr-samir-haddad.tag.0": "Orthopaedics",
  "doc.dr-samir-haddad.tag.1": "Soft tissue",
  "doc.dr-samir-haddad.tag.2": "Cruciate repair",
  "doc.dr-samir-haddad.tag.3": "Post-op rehab",
  "doc.dr-nadia-osei.name": "Dr. Nadia Osei",
  "doc.dr-nadia-osei.spec": "Emergency & Critical Care",
  "doc.dr-nadia-osei.exp": "11 years",
  "doc.dr-nadia-osei.bio": "Runs the overnight critical care rotation and our triage protocol.",
  "doc.dr-nadia-osei.tag.0": "Triage",
  "doc.dr-nadia-osei.tag.1": "Critical care",
  "doc.dr-nadia-osei.tag.2": "Trauma",
  "doc.dr-nadia-osei.tag.3": "Overnight",
  "doc.dr-james-oconnell.name": "Dr. James O'Connell",
  "doc.dr-james-oconnell.spec": "Dentistry & Oral Surgery",
  "doc.dr-james-oconnell.exp": "9 years",
  "doc.dr-james-oconnell.bio":
    "Focused on pain-managed dental care for senior and small-breed patients.",
  "doc.dr-james-oconnell.tag.0": "Dental surgery",
  "doc.dr-james-oconnell.tag.1": "Extractions",
  "doc.dr-james-oconnell.tag.2": "Pain management",
  "doc.dr-james-oconnell.tag.3": "Small breeds",
  "doc.dr-priya-raman.name": "Dr. Priya Raman",
  "doc.dr-priya-raman.spec": "Dermatology & Allergy",
  "doc.dr-priya-raman.exp": "10 years",
  "doc.dr-priya-raman.bio": "Builds long-term plans for chronic skin, ear and allergy conditions.",
  "doc.dr-priya-raman.tag.0": "Allergy testing",
  "doc.dr-priya-raman.tag.1": "Ear disease",
  "doc.dr-priya-raman.tag.2": "Skin cytology",
  "doc.dr-priya-raman.tag.3": "Immunotherapy",
  "doc.dr-tomas-lindqvist.name": "Dr. Tomas Lindqvist",
  "doc.dr-tomas-lindqvist.spec": "Exotics & Small Mammals",
  "doc.dr-tomas-lindqvist.exp": "14 years",
  "doc.dr-tomas-lindqvist.bio":
    "Cares for rabbits, reptiles and birds with species-specific protocols.",
  "doc.dr-tomas-lindqvist.tag.0": "Exotics anaesthesia",
  "doc.dr-tomas-lindqvist.tag.1": "Avian medicine",
  "doc.dr-tomas-lindqvist.tag.2": "Dental burring",
  "doc.dr-tomas-lindqvist.tag.3": "Husbandry",

  // Animal types & days
  "animal.Dog": "Dog",
  "animal.Cat": "Cat",
  "animal.Rabbit": "Rabbit",
  "animal.Bird": "Bird",
  "animal.Reptile": "Reptile",
  "animal.Ferret": "Ferret",
  "animal.Guinea Pig": "Guinea Pig",
  "animal.Other": "Other",
  "day.Mon": "Mon",
  "day.Tue": "Tue",
  "day.Wed": "Wed",
  "day.Thu": "Thu",
  "day.Fri": "Fri",
  "day.Sat": "Sat",
  "day.Sun": "Sun",

  // Doctors page
  "filter.all": "All",
  "doctors.specLabel": "Specialization",
  "doctors.petLabel": "Pet type",
  "doctors.showing": "Showing {count} of {total} clinicians",
  "doctors.empty": "No clinician matches that combination. Try a different pet type.",

  // About page
  "about.principle.0.title": "Diagnose before you treat",
  "about.principle.0.body":
    "No presumptive prescriptions. If we can't explain the finding, we run the test that will.",
  "about.principle.1.title": "Price it in writing",
  "about.principle.1.body":
    "A written estimate reaches you before anything begins, and we call if it needs to change.",
  "about.principle.2.title": "The record belongs to you",
  "about.principle.2.body":
    "Every note, image and result is exportable the day you ask, for any clinic you choose.",

  // Contact page
  "contact.emergency": "Emergency line",
  "contact.reception": "Reception",
  "contact.whatsapp": "WhatsApp",
  "contact.email": "Email",
  "contact.hours": "Opening hours",
  "contact.address": "Address",
  "contact.map": "PawCare clinic location map",
  "hour.0": "Monday – Friday",
  "hour.1": "Saturday",
  "hour.2": "Sunday",
  "hour.3": "Emergency line",

  // Misc
  "dash.statusCol": "Status",
  "dash.srSection": "Dashboard section",
  "dash.unnamed": "Unnamed clinician",
  "dash.untitled": "Untitled service",
  "availability.fullyBooked": "Fully booked this month — join the waitlist when you book.",
  "availability.slotsOpen": "slots open",
  "availability.treats": "Treats:",
  "availability.experience": "experience",
  "availability.book": "Book",
  "header.homeAria": "PawCare home",
  "header.mainAria": "Main",
  "header.lightMode": "Switch to light mode",
  "header.darkMode": "Switch to dark mode",
  "header.closeMenu": "Close menu",
  "header.openMenu": "Open menu",
  "header.mobileAria": "Mobile",
  "footer.rights": "Veterinary Clinic. All rights reserved.",
  "intro.tagline": "Veterinary care, quietly excellent.",
  "intro.skip": "Press any key to skip",
  "intro.loadingAria": "PawCare is loading",
  "success.calendarTitle": "PawCare appointment",
  "success.icsSummary": "PawCare appointment",
  "dash.defaultDays": "Mon, Tue, Wed, Thu, Fri, Sat",
  "dash.xAria": "Close",
  "img.hero": "A veterinarian examining a golden retriever in a bright consultation room",
  "img.clinic": "Diagnostic imaging equipment inside the PawCare clinic",
  "notfound.title": "Page not found",
  "notfound.desc": "The page you're looking for doesn't exist or has been moved.",
  "notfound.home": "Go home",
  "error.title": "This page didn't load",
  "error.desc": "Something went wrong on our end. You can try refreshing or head back home.",
  "error.retry": "Try again",
  "error.home": "Go home",
  "booking.ph.name": "Alex Moreno",
  "booking.ph.phone": "+1 415 555 0100",
  "booking.ph.email": "alex@example.com",
  "booking.ph.petName": "Rufus",
  "booking.ph.breed": "Border Terrier",
  "booking.ph.age": "4 years",
  "booking.ph.weight": "8.2 kg",
  "booking.ph.symptoms": "Limping on the front left leg since Tuesday, eating normally.",
  "booking.ph.allergies": "None known",
  "booking.ph.medications": "None",
};

const AR: Dict = {
  "nav.home": "الرئيسية",
  "nav.services": "الخدمات",
  "nav.doctors": "الأطباء",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.book": "احجز موعداً",
  "nav.staff": "لوحة الموظفين",

  "hero.badge": "نستقبل مرضى جدد هذا الأسبوع",
  "hero.title.a": "رعاية بيطرية احترافية لحيواناتكم",
  "hero.rotating.0": "الأليفة العزيزة",
  "hero.rotating.1": "الكلاب والقطط",
  "hero.rotating.2": "الأرانب",
  "hero.rotating.3": "الطيور",
  "hero.rotating.4": "الأصدقاء الصغار",
  "hero.subtitle":
    "تشخيصات في نفس اليوم، وتقديرات مكتوبة قبل العلاج، وفريق طوارئ متاح 24/7 — ليتلاشى القلق فور دخولكم.",
  "hero.book": "احجز موعداً",
  "hero.emergency": "اتصال الطوارئ",
  "hero.triage": "متوسط زمن الفرز",
  "hero.nextAvailable": "أقرب موعد",

  "stats.0": "حيوانات تحت رعايتنا",
  "stats.1": "أطباء مرخّصون",
  "stats.2": "توفر الطوارئ",
  "stats.3": "رضا المالكين",

  "services.eyebrow": "الخدمات",
  "why.eyebrow": "لماذا باوكير",
  "team.eyebrow": "فريقنا",
  "booking.eyebrow": "كيف يعمل",
  "testimonials.eyebrow": "آراء المالكين",
  "faq.eyebrow": "الأسئلة الشائعة",
  "cta.title.a": "حيوانكم يستحق",
  "cta.title.b": "إجابة واضحة هادئة",
  "cta.title.c": "اليوم",
  "cta.subtitle": "احجز أونلاين خلال دقيقة، أو اتصل بخط الطوارئ إذا لم يكن الانتظار ممكناً.",
  "cta.book": "احجز موعداً",
  "cta.call": "اتصل {phone}",

  "dash.title": "لوحة الموظفين",
  "dash.subtitle": "إدارة الطلبات والحجوزات والفريق والخدمات.",
  "dash.overview": "نظرة عامة",
  "dash.requests": "الطلبات",
  "dash.reservations": "الحجوزات",
  "dash.doctors": "الأطباء",
  "dash.services": "الخدمات",
  "dash.settings": "الإعدادات",
  "dash.back": "العودة إلى الموقع",
  "dash.overview.stats.pending": "طلبات معلّقة",
  "dash.overview.stats.confirmed": "حجوزات مؤكدة",
  "dash.overview.stats.completed": "زيارات مكتملة",
  "dash.overview.stats.doctors": "أطباء نشطون",
  "dash.overview.today": "جدول اليوم",
  "dash.overview.noData": "لا توجد مواعيد اليوم.",
  "dash.overview.recent": "أحدث الطلبات",
  "dash.overview.viewAll": "عرض الكل",
  "dash.empty": "لا يوجد شيء هنا بعد.",
  "dash.search": "بحث…",
  "dash.filterAll": "الكل",
  "dash.filterPending": "معلّق",
  "dash.filterConfirmed": "مؤكد",
  "dash.filterCompleted": "مكتمل",
  "dash.filterCancelled": "ملغي",
  "dash.status.pending": "معلّق",
  "dash.status.confirmed": "مؤكد",
  "dash.status.completed": "مكتمل",
  "dash.status.cancelled": "ملغي",
  "dash.confirm": "تأكيد",
  "dash.complete": "إنهاء",
  "dash.cancel": "إلغاء",
  "dash.delete": "حذف",
  "dash.edit": "تعديل",
  "dash.add": "إضافة",
  "dash.save": "حفظ التغييرات",
  "dash.close": "إغلاق",
  "dash.addDoctor": "إضافة طبيب",
  "dash.editDoctor": "تعديل طبيب",
  "dash.form.name": "الاسم الكامل",
  "dash.form.specialization": "التخصص",
  "dash.form.experience": "الخبرة",
  "dash.form.rating": "التقييم",
  "dash.form.bio": "نبذة مختصرة",
  "dash.form.initials": "الأحرف الأولى",
  "dash.form.pets": "الحيوانات المعالَجة (مفصولة بفاصلة)",
  "dash.form.tags": "العلامات (مفصولة بفاصلة)",
  "dash.form.days": "أيام العمل (مفصولة بفاصلة)",
  "dash.form.service.title": "عنوان الخدمة",
  "dash.form.service.desc": "الوصف",
  "dash.addService": "إضافة خدمة",
  "dash.editService": "تعديل خدمة",
  "dash.owner": "المالك",
  "dash.pet": "الحيوان",
  "dash.doctor": "الطبيب البيطري",
  "dash.date": "التاريخ",
  "dash.time": "الوقت",
  "dash.requestedAt": "وقت الطلب",
  "dash.emergency.yes": "حالة طارئة",
  "dash.notes": "الأعراض",
  "dash.actions": "إجراءات",
  "dash.viewReservations": "عرض الحجوزات",
  "dash.overview.recentDesc": "أحدث طلبات الحجز، الأحدث أولاً.",
  "dash.reservationsDesc": "مواعيد مؤكدة ابتداءً من اليوم.",
  "dash.settings.general": "بيانات العيادة",
  "dash.settings.generalDesc": "تُستخدم هذه البيانات في جميع أنحاء الموقع العام.",
  "dash.settings.emergency": "هاتف الطوارئ",
  "dash.settings.address": "العنوان",
  "dash.settings.persist": "محفوظ في هذا المتصفح",
  "dash.specialization.col": "التخصص",
  "dash.experience.col": "الخبرة",
  "dash.rating.col": "التقييم",
  "dash.actionsCancel": "إلغاء هذا الطلب؟",
  "dash.toast.confirmed": "تم تأكيد الحجز.",
  "dash.toast.completed": "تم وضع الزيارة كمكتملة.",
  "dash.toast.cancelled": "تم إلغاء الحجز.",
  "dash.toast.deleted": "تم الحذف.",
  "dash.toast.saved": "تم الحفظ.",
  "dash.doctors.hint": "تظهر التغييرات فوراً في صفحة الأطباء العامة.",
  "dash.services.hint": "تظهر التغييرات فوراً في صفحة الخدمات العامة.",
  "dash.settings.lang": "لغة الواجهة",
  "dash.settings.langDesc": "اختر بين الإنجليزية أو العربية.",
  "dash.settings.theme": "المظهر",
  "dash.settings.name": "اسم العيادة",
  "dash.settings.email": "البريد الإلكتروني",
  "dash.settings.phone": "الهاتف",
  "dash.settings.whatsapp": "واتساب",
  "dash.confirmRow": "تأكيد",
  "dash.cancelRow": "إلغاء",
  "dash.openRow": "فتح",
  "dash.rows": "صفوف",
  "dash.showing": "عرض {count} {rows}",

  // Auth / staff sign-in
  "auth.signIn": "دخول الموظفين",
  "auth.signInDesc": "منطقة محظورة. أدخل الرمز الإداري للمتابعة.",
  "auth.pin": "الرمز الإداري",
  "auth.pinPlaceholder": "••••••",
  "auth.unlock": "فتح لوحة التحكم",
  "auth.setupTitle": "إعداد الرمز الإداري",
  "auth.setupDesc": "اختر رمزاً لتأمين لوحة الموظفين. ستحتاجه في كل مرة تدخل فيها.",
  "auth.setupConfirm": "تأكيد الرمز",
  "auth.mismatch": "الرمزان غير متطابقين.",
  "auth.pinTooShort": "يجب ألا يقل الرمز عن 4 أحرف.",
  "auth.invalidPin": "الرمز غير صحيح. حاول مجدداً.",
  "auth.locked": "محاولات كثيرة. حاول بعد {minutes} دقيقة.",
  "auth.signOut": "تسجيل الخروج",
  "auth.changePin": "تغيير الرمز",
  "auth.currentPin": "الرمز الحالي",
  "auth.newPin": "الرمز الجديد",
  "auth.confirmNewPin": "تأكيد الرمز الجديد",
  "auth.pinChanged": "تم تغيير الرمز.",
  "auth.wrongCurrent": "الرمز الحالي غير صحيح.",

  "booking.title": "احجز موعداً",
  "booking.subtitle": "أربع خطوات قصيرة. تُحفظ إجاباتك تلقائياً أثناء الكتابة.",
  "booking.step.owner": "المالك",
  "booking.step.pet": "الحيوان",
  "booking.step.case": "الحالة",
  "booking.step.schedule": "الموعد",
  "booking.owner.fullName": "الاسم الكامل",
  "booking.owner.phone": "الهاتف",
  "booking.owner.email": "البريد الإلكتروني",
  "booking.pet.name": "اسم الحيوان",
  "booking.pet.type": "نوع الحيوان",
  "booking.pet.breed": "السلالة",
  "booking.pet.age": "العمر",
  "booking.pet.weight": "الوزن",
  "booking.case.symptoms": "الأعراض ووصف الحالة",
  "booking.case.allergies": "حساسية معروفة",
  "booking.case.medications": "الأدوية الحالية",
  "booking.case.emergency": "هذه حالة طارئة",
  "booking.case.emergencyDesc": "يُعلّم الحالة للفرز الفوري لفريق الطوارئ.",
  "booking.schedule.doctor": "الطبيب المفضل",
  "booking.schedule.date": "التاريخ",
  "booking.schedule.time": "الوقت",
  "booking.schedule.hint": "اختر التاريخ لعرض الأوقات المتاحة.",
  "booking.back": "رجوع",
  "booking.continue": "متابعة",
  "booking.confirm": "تأكيد الحجز",
  "booking.error.doctor": "يرجى اختيار الطبيب البيطري أولاً.",
  "booking.empty.doctors": "لا يوجد أطباء متاحون حالياً.",
  "booking.requested": "تم إرسال طلب الحجز",
  "booking.requestedDesc":
    "يؤكد فريق الاستقبال كل حجز عبر الهاتف أو واتساب خلال 30 دقيقة في ساعات العمل.",
  "booking.addCalendar": "أضف إلى التقويم",
  "booking.home": "العودة إلى الرئيسية",
  "booking.genericDoctor": "أول طبيب متاح",

  "footer.tagline":
    "مستشفى بيتي متخصص مبني على تشخيصات واضحة وراحة تامة وسجلات طبية تملكها أنت بالفعل.",
  "footer.clinic": "العيادة",
  "footer.care": "الرعاية",
  "footer.services": "الخدمات",
  "footer.vets": "أطباؤنا البيطريون",
  "footer.about": "حول باوكير",
  "footer.contact": "اتصل بنا",
  "footer.accred": "معتمد من AAHA · معتمد من Fear Free · إدارة جودة وفق ISO 9001",

  // عناوين الصفحات العامة
  "page.services.eyebrow": "الخدمات",
  "page.services.title": "خدمات سريرية متكاملة",
  "page.services.desc":
    "اثنتا عشرة خدمة في ملف طبي واحد. مهما كان ما يحتاجه حيوانك، فإن الفريق يعرف تاريخه الكامل.",
  "page.doctors.eyebrow": "فريقنا",
  "page.doctors.title": "أربعة عشر طبيباً بيطرياً. ملف طبي مشترك.",
  "page.doctors.desc":
    "يترأس كل طبيب تخصصًا محددًا، وتُعرض الحالات المعقدة على الفريق فيقتل قبل اعتماد أي خطة علاج.",
  "page.about.eyebrow": "حول باوكير",
  "page.about.title": "ممارسة طبية تصادف أنها تعالج الحيوانات",
  "page.about.desc":
    "افتتحت باوكير في عام 2016 بستة أطباء وقاعدة واحدة: لا يُرسَل صاحب حيوان إلى منزله دون شرح مفهوم.",
  "page.about.standards": "ما نلتزم به",
  "page.contact.eyebrow": "الاتصال",
  "page.contact.title": "يسهل الوصول إلينا، دائمًا",
  "page.contact.desc": "خط الطوارئ يرد عليه شخص وليس قائمة نقرات، في أي ساعة من أي يوم.",

  // أقسام الصفحة الرئيسية
  "home.services.title": "كل ما يحتاجه حيوانك تحت سقف واحد",
  "home.services.desc": "من اللقاح الدوري إلى الرعاية الحرجة ليلًا، دون تحويلات أو أوراق متكررة.",
  "home.team.eyebrow": "فريقنا",
  "home.team.title": "أطباء يشرحون الصورة بأكملها",
  "home.team.desc": "لكل طبيب هنا تخصص محدد، ويُستعرض كل ملف طبي من قبل اثنين منهم.",

  // أقسام لماذا / الخطوات / آراء العملاء / الأسئلة
  "why.title": "المعيار الطبي الذي تريد لنفسك",
  "why.desc": "كل شيء هنا مصمم لإزالة التخمين، لك وللطبيب الذي يحمل الملف.",
  "timeline.title": "الحجز في أقل من دقيقة",
  "timeline.desc": "خمس خطوات قصيرة. يُحفظ تقدمك أثناء التنقل، فلا يكلفك التحديث شيئًا.",
  "testimonials.title": "ماذا يقول أصحاب الحيوانات؟",
  "faq.title": "الأسئلة التي نسمعها كثيرًا",

  // محتوى الخدمات
  "svc.general-checkup.title": "الفحص العام",
  "svc.general-checkup.desc": "فحوصات جسدية كاملة مع خطة عافية مكتوبة بعد كل زيارة.",
  "svc.vaccination.title": "التطعيم",
  "svc.vaccination.desc": "التطعيمات الأساسية والاختيارية مع تذكير تلقائي بمواعيد الاستحقاق.",
  "svc.surgery.title": "الجراحة",
  "svc.surgery.desc": "عمليات الأنسجة الرخوة والعظام في غرفة عمليات معقمة.",
  "svc.emergency.title": "الرعاية الطارئة",
  "svc.emergency.desc": "فرز فوري في أي ساعة مع فريق رعاية حرجة على مدار الساعة.",
  "svc.laboratory.title": "المختبر",
  "svc.laboratory.desc": "تحاليل الدم داخل العيادة بنتائج في نفس الزيارة.",
  "svc.dental.title": "العناية بالأسنان",
  "svc.dental.desc": "التنظيف والتلميع والخلع تحت تخدير مراقب.",
  "svc.pharmacy.title": "الصيدلية",
  "svc.pharmacy.desc": "تصرف في العيادة ويُتحقق من الجرعة حسب ملف حيوانك.",
  "svc.grooming.title": "التجميل والعناية",
  "svc.grooming.desc": "أحواض علاجية والعناية بالفراء تحت إشراف طبي.",
  "svc.nutrition.title": "التغذية",
  "svc.nutrition.desc": "برامج وزن وغذاء مبنية على أهداف قابلة للقياس.",
  "svc.x-ray.title": "الأشعة الرقمية",
  "svc.x-ray.desc": "تصوير إشعاعي رقمي بجرعة منخفضة يُقرأ في نفس الموعد.",
  "svc.ultrasound.title": "الموجات فوق الصوتية",
  "svc.ultrasound.desc": "تصوير للبطن والقلب بواسطة فنيين معتمدين.",
  "svc.records.title": "السجلات الرقمية",
  "svc.records.desc": "كل زيارة ونتيجة ووصفة في سجل واحد قابل للمشاركة.",

  // لماذا نحن
  "whyitem.0.title": "أطباء بيطريون ذوو خبرة",
  "whyitem.0.detail": "متوسط خبرة 12 عامًا، بشهادات تخصص في خمس مجالات.",
  "whyitem.1.title": "تجهيزات حديثة",
  "whyitem.1.detail": "تصوير رقمي وتشخيص مخبري وتخدير مراقب كمعيار أساسي.",
  "whyitem.2.title": "أسعار شفافة",
  "whyitem.2.detail": "تقديرات مكتوبة قبل بدء أي علاج. لا بند لم توافق عليه.",
  "whyitem.3.title": "خدمات الطوارئ",
  "whyitem.3.detail": "فريق رعاية حرجة حاضر في المكان، وليس خدمة تحويل مكالمات.",
  "whyitem.4.title": "علاج مخصص",
  "whyitem.4.detail": "خطط رعاية مبنية على عمر وتاريخ حيوانك، لا على قالب جاهز.",
  "whyitem.5.title": "سجلات رقمية كاملة",
  "whyitem.5.detail": "ملف حيوانك الكامل متاح لك ولأي عيادة تختار.",

  // خطوات الحجز
  "step.0.title": "اختر التاريخ",
  "step.0.detail": "مواعيد متاحة أمام جميع الأطباء.",
  "step.1.title": "اختر الوقت",
  "step.1.detail": "المواعيد المحجوزة تختفي أمامك.",
  "step.2.title": "حدثنا عن حيوانك",
  "step.2.detail": "النوع والسلالة والعمر والوزن والتاريخ.",
  "step.3.title": "صف الحالة",
  "step.3.detail": "الأعراض والأدوية والحساسية.",
  "step.4.title": "تأكيد الحجز",
  "step.4.detail": "ملخص ودعوة للتقويم وتذكيرات.",

  // آراء العملاء
  "testi.0.quote":
    "تمت تخصيص الكلب في أقل من أربع دقائق في الثانية فجرًا. وصلت الملاحظات إلى بريدي قبل وصولنا للبيت.",
  "testi.0.name": "هانا دويل",
  "testi.0.pet": "روفوس · جحر بريطاني",
  "testi.1.quote": "شرحوا كل بند في التقدير قبل لمس أي شيء. هذا الصدق نادر.",
  "testi.1.name": "ماركوس بيل",
  "testi.1.pet": "نالا · مين كون",
  "testi.2.quote": "تذكيرات التطعيم وحدها تستحق الانتقال. لم أفوّت أي إعادة تطعيم منذ ذلك الحين.",
  "testi.2.name": "عائشة رحمن",
  "testi.2.pet": "كوبي · شيبا اينو",
  "testi.3.quote":
    "الدكتور لينكفيست هو الطبيب الوحيد في المدينة الذي لا يصاب أرنبي بالذعر معه. ناس لطيفون حقًا.",
  "testi.3.name": "تيو ماركيتي",
  "testi.3.pet": "برامبل · أرنب ليون هيد",

  // الأسئلة الشائعة
  "faq.0.q": "هل تستقبلون حالات الطوارئ دون موعد؟",
  "faq.0.a":
    "نعم. خط الطوارئ يعمل 24/7 وفريق الفرز يقيم كل حالة عند الوصول. الحالات الحرجة تُعالج دائمًا أولًا.",
  "faq.1.q": "كم مقدمًا يجب أن أحجز زيارة روتينية؟",
  "faq.1.a":
    "معظم المواعيد الروتينية متاحة خلال 48 ساعة. الاستشارات التخصصية عادة ما تُحجز قبل خمسة إلى سبعة أيام.",
  "faq.2.q": "هل يمكنني نقل سجلات حيواني من عيادة أخرى؟",
  "faq.2.a":
    "بالطبع. أرسل لنا تفاصيل عيادتك السابقة عند الحجز وسنطلب التاريخ الكامل وندمجه في ملف حيوانك قبل الزيارة.",
  "faq.3.q": "ما طرق الدفع المقبولة؟",
  "faq.3.a":
    "جميع البطاقات الرئيسية والتحويل البنكي ومعظم شركات التأمين عبر الفوترة المباشرة، مع تقديرات مكتوبة قبل كل إجراء.",
  "faq.4.q": "هل تعالجون حيوانات غير القطط والكلاب؟",
  "faq.4.a":
    "نعم — الأرانب والقوارض الحية والزرعات والطيور يعالجها فريق الحيوانات الغريبة بأساليب خاصة بالأنواع.",
  "faq.5.q": "كيف تعمل تذكيرات التطعيم؟",
  "faq.5.a":
    "يُسجل كل لقاح مع تاريخ استحقاقه، وتصلك تذكيرات قبل 30 و7 و1 يوم عبر البريد أو واتساب حسب اختيارك.",

  // محتوى الأطباء
  "doc.dr-elena-marsh.name": "د. إلينا مارش",
  "doc.dr-elena-marsh.spec": "الطب الباطني",
  "doc.dr-elena-marsh.exp": "16 عامًا",
  "doc.dr-elena-marsh.bio": "ترأس فريق التشخيص وتحمل تخصصًا في الغدد الصماء لدى القطط.",
  "doc.dr-elena-marsh.tag.0": "الغدد الصماء",
  "doc.dr-elena-marsh.tag.1": "الأمراض المزمنة",
  "doc.dr-elena-marsh.tag.2": "رعاية الكبار سنًا",
  "doc.dr-elena-marsh.tag.3": "الموجات فوق الصوتية",
  "doc.dr-samir-haddad.name": "د. سمير حداد",
  "doc.dr-samir-haddad.spec": "الجراحة والعظام",
  "doc.dr-samir-haddad.exp": "13 عامًا",
  "doc.dr-samir-haddad.bio": "يُجري أكثر من 300 عملية أنسجة رخوة وعظام كل عام.",
  "doc.dr-samir-haddad.tag.0": "جراحة العظام",
  "doc.dr-samir-haddad.tag.1": "الأنسجة الرخوة",
  "doc.dr-samir-haddad.tag.2": "إصلاح الرباطع الصليبي",
  "doc.dr-samir-haddad.tag.3": "إعادة التأهيل بعد الجراحة",
  "doc.dr-nadia-osei.name": "د. نادية أوساي",
  "doc.dr-nadia-osei.spec": "الطوارئ والرعاية الحرجة",
  "doc.dr-nadia-osei.exp": "11 عامًا",
  "doc.dr-nadia-osei.bio": "تدير نوبة الرعاية الحرجة الليلية وبروتوكول الفرز لدينا.",
  "doc.dr-nadia-osei.tag.0": "الفرز",
  "doc.dr-nadia-osei.tag.1": "الرعاية الحرجة",
  "doc.dr-nadia-osei.tag.2": "الصدمات",
  "doc.dr-nadia-osei.tag.3": "النوبات الليلية",
  "doc.dr-james-oconnell.name": "د. جيمس أوكونل",
  "doc.dr-james-oconnell.spec": "طب وجراحة الأسنان",
  "doc.dr-james-oconnell.exp": "9 سنوات",
  "doc.dr-james-oconnell.bio":
    "مركع على العناية بالأسنان مع إدارة الألم للحيوانات الكبيرة الصغيرة.",
  "doc.dr-james-oconnell.tag.0": "جراحة الأسنان",
  "doc.dr-james-oconnell.tag.1": "خلع الأسنان",
  "doc.dr-james-oconnell.tag.2": "إدارة الألم",
  "doc.dr-james-oconnell.tag.3": "السلالات الصغيرة",
  "doc.dr-priya-raman.name": "د. بريا رامان",
  "doc.dr-priya-raman.spec": "الأمراض الجلدية والحساسية",
  "doc.dr-priya-raman.exp": "10 سنوات",
  "doc.dr-priya-raman.bio": "تبني خططًا طويلة الأمد للأمراض الجلدية والأذنية والحساسية المزمنة.",
  "doc.dr-priya-raman.tag.0": "اختبار الحساسية",
  "doc.dr-priya-raman.tag.1": "أمراض الأذن",
  "doc.dr-priya-raman.tag.2": "علم خلايا الجلد",
  "doc.dr-priya-raman.tag.3": "العلاج المناعي",
  "doc.dr-tomas-lindqvist.name": "د. توماس لينكيست",
  "doc.dr-tomas-lindqvist.spec": "الحيوانات الغريبة والثديات الصغيرة",
  "doc.dr-tomas-lindqvist.exp": "14 عامًا",
  "doc.dr-tomas-lindqvist.bio": "يرعى الأرانب والزواحف والطيور بأساليب خاصة بها.",
  "doc.dr-tomas-lindqvist.tag.0": "تخدير الحيوانات الغريبة",
  "doc.dr-tomas-lindqvist.tag.1": "طب الطيور",
  "doc.dr-tomas-lindqvist.tag.2": "برد الأسنان",
  "doc.dr-tomas-lindqvist.tag.3": "التربية والرعاية",

  // أنواع الحيوانات وأيام الأسبوع
  "animal.Dog": "كلب",
  "animal.Cat": "قط",
  "animal.Rabbit": "أرنب",
  "animal.Bird": "طائر",
  "animal.Reptile": "زواحف",
  "animal.Ferret": "ابن عرس",
  "animal.Guinea Pig": "خنزير غينيا",
  "animal.Other": "أخرى",
  "day.Mon": "الاثنين",
  "day.Tue": "الثلاثاء",
  "day.Wed": "الأربعاء",
  "day.Thu": "الخميس",
  "day.Fri": "الجمعة",
  "day.Sat": "السبت",
  "day.Sun": "الأحد",

  // صفحة الأطباء
  "filter.all": "الكل",
  "doctors.specLabel": "التخصص",
  "doctors.petLabel": "نوع الحيوان",
  "doctors.showing": "عرض {count} من {total} أطباء",
  "doctors.empty": "لا يوجد طبيب يطابق هذا الجمع. جرّب نوع حيوان آخر.",

  // صفحة حول
  "about.principle.0.title": "شخّص قبل أن تعالج",
  "about.principle.0.body":
    "لا وصفات تخمينية. إذا لم نستطع شرح النتيجة، نجري التحليل الذي سيجعلها واضحة.",
  "about.principle.1.title": "السعر مكتوب",
  "about.principle.1.body": "يصلك تقدير مكتوب قبل أي إجراء، ونتصل بك إذا تغير السعر.",
  "about.principle.2.title": "السجل ملكك",
  "about.principle.2.body":
    "كل ملاحظة وصورة ونتيجة قابلة للتصدير في نفس اليوم الذي تطلبها، لأي عيادة تختارها.",

  // صفحة الاتصال
  "contact.emergency": "خط الطوارئ",
  "contact.reception": "الاستقبال",
  "contact.whatsapp": "واتساب",
  "contact.email": "البريد الإلكتروني",
  "contact.hours": "ساعات العمل",
  "contact.address": "العنوان",
  "contact.map": "موقع عيادة باوكير",
  "hour.0": "الاثنين – الجمعة",
  "hour.1": "السبت",
  "hour.2": "الأحد",
  "hour.3": "خط الطوارئ",

  // متفرقات
  "dash.statusCol": "الحالة",
  "dash.srSection": "قسم لوحة التحكم",
  "dash.unnamed": "طبيب بدون اسم",
  "dash.untitled": "خدمة بدون عنوان",
  "availability.fullyBooked": "مكتمل الحجز هذا الشهر — انضم لقائمة الانتظار عند الحجز.",
  "availability.slotsOpen": "موعد متاح",
  "availability.treats": "يعالج:",
  "availability.experience": "خبرة",
  "availability.book": "احجز",
  "header.homeAria": "باوكير الرئيسية",
  "header.mainAria": "القائمة الرئيسية",
  "header.lightMode": "التبديل إلى الوضع الفاتح",
  "header.darkMode": "التبديل إلى الوضع الداكن",
  "header.closeMenu": "إغلاق القائمة",
  "header.openMenu": "فتح القائمة",
  "header.mobileAria": "القائمة الجوالة",
  "footer.rights": "العيادة البيطرية. جميع الحقوق محفوظة.",
  "intro.tagline": "رعاية بيطرية، بامتياز هادئ.",
  "intro.skip": "اضغط أي مفتاح للتخطي",
  "intro.loadingAria": "باوكير قيد التحميل",
  "success.calendarTitle": "موعد باوكير",
  "success.icsSummary": "موعد باوكير",
  "dash.defaultDays": "الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت",
  "dash.xAria": "إغلاق",
  "img.hero": "طبيب بيطري يفحص كلبًا من فصيلة غولدن ريتريفر في غرفة استشارات مضيئة",
  "img.clinic": "معدات التصوير التشخيصي داخل عيادة باوكير",
  "notfound.title": "الصفحة غير موجودة",
  "notfound.desc": "لا توجد الصفحة التي تبحث عنها أو تم نقلها.",
  "notfound.home": "العودة للرئيسية",
  "error.title": "لم يتم تحميل الصفحة",
  "error.desc": "حدث خطأ من جهتنا. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.",
  "error.retry": "إعادة المحاولة",
  "error.home": "العودة للرئيسية",
  "booking.ph.name": "أليكس مورينو",
  "booking.ph.phone": "+1 415 555 0100",
  "booking.ph.email": "alex@example.com",
  "booking.ph.petName": "روفوس",
  "booking.ph.breed": "جحر بيطري",
  "booking.ph.age": "4 سنوات",
  "booking.ph.weight": "8.2 كجم",
  "booking.ph.symptoms": "يعرج في الساق الأمامية اليسرى منذ الثلاثاء ويأكل بشكل طبيعي.",
  "booking.ph.allergies": "لا توجد حساسية معروفة",
  "booking.ph.medications": "لا شيء",
};

const DICTS: Record<Lang, Dict> = { en: EN, ar: AR };

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string, params?: Record<string, string>) => string;
  tOr: (key: string, fallback: string, params?: Record<string, string>) => string;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function applyLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.classList.toggle("lang-ar", lang === "ar");
}

export function I18nProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  // `initialLang` comes from the SSR cookie (via the root route's beforeLoad),
  // so the server HTML, the client hydration pass and the first client render
  // all agree on the same language — no hydration mismatch and no English
  // flash. localStorage is still kept in sync as a fallback.
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LANG_KEY);
    } catch {
      /* storage unavailable */
    }
    if (stored === "ar") {
      setLangState("ar");
      writeLangCookie("ar");
    }
  }, []);

  useEffect(() => {
    applyLang(lang);
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyLang(next);
    writeLangCookie(next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let str = DICTS[lang][key] ?? EN[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang],
  );

  const tOr = useCallback(
    (key: string, fallback: string, params?: Record<string, string>) => {
      const found = DICTS[lang][key] ?? EN[key];
      let str = found ?? fallback;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t,
      tOr,
      setLang,
      toggleLang: () => setLang(lang === "en" ? "ar" : "en"),
    }),
    [lang, t, tOr, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "en" ? "Switch to العربية" : "Switch to English"}
      className={`grid size-9 place-items-center rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`}
    >
      {lang === "en" ? "ع" : "EN"}
    </button>
  );
}
