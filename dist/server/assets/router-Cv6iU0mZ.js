import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { n as getCookie } from "./server-v6kVJSYH.js";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useLocation, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, Mail, MapPin, Menu, MessageCircle, Moon, Phone, Sun, X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-ALvcHYIP.css";
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/PawCareMark.tsx
/**
* The PawCare mark: a single continuous line that reads as a pulse/heartbeat
* and resolves into a paw at its peak. Used in the intro line-draw animation,
* the header and the footer.
*/
function PawCareMark({ className, animated = false }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 64 64",
		fill: "none",
		className: cn("h-8 w-8", className),
		"aria-hidden": "true",
		role: "presentation",
		children: [
			/* @__PURE__ */ jsx("path", {
				d: "M4 42h9l5-11 6 20 5-15 4 6h6",
				stroke: "currentColor",
				strokeWidth: "3.5",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				pathLength: 1,
				className: animated ? "pawcare-draw" : void 0
			}),
			/* @__PURE__ */ jsxs("g", {
				fill: "currentColor",
				className: animated ? "pawcare-pads" : void 0,
				children: [
					/* @__PURE__ */ jsx("ellipse", {
						cx: "43.5",
						cy: "20",
						rx: "3.1",
						ry: "4.2"
					}),
					/* @__PURE__ */ jsx("ellipse", {
						cx: "52",
						cy: "16.5",
						rx: "3.1",
						ry: "4.4"
					}),
					/* @__PURE__ */ jsx("ellipse", {
						cx: "60",
						cy: "21",
						rx: "2.9",
						ry: "4"
					})
				]
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z",
				fill: "currentColor",
				className: animated ? "pawcare-pads" : void 0
			})
		]
	});
}
function PawCareLogo({ className }) {
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ jsx(PawCareMark, { className: "h-7 w-7 text-primary" }), /* @__PURE__ */ jsx("span", {
			className: "text-[20px] font-bold tracking-[-0.03em] text-foreground",
			children: "PawCare"
		})]
	});
}
//#endregion
//#region src/lib/lang-cookie.ts
var LANG_COOKIE = "pawcare_lang";
function parseLang(value) {
	return value === "ar" ? "ar" : "en";
}
var readLangCookie = () => parseLang(getCookie(LANG_COOKIE));
function writeLangCookie(lang, days = 365) {
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
//#endregion
//#region src/lib/i18n.tsx
var LANG_KEY = "pawcare:lang";
var EN = {
	"nav.home": "Home",
	"nav.services": "Services",
	"nav.doctors": "Doctors",
	"nav.about": "About",
	"nav.contact": "Contact",
	"nav.book": "Book appointment",
	"nav.staff": "Staff dashboard",
	"hero.badge": "Accepting new patients this week",
	"hero.title.a": "Professional veterinary care for your",
	"hero.rotating.0": "beloved pets",
	"hero.rotating.1": "dogs & cats",
	"hero.rotating.2": "bunnies",
	"hero.rotating.3": "birds",
	"hero.rotating.4": "small friends",
	"hero.subtitle": "Same-day diagnostics, written estimates before treatment, and a 24/7 emergency team — so the worry ends the moment you walk in.",
	"hero.book": "Book appointment",
	"hero.emergency": "Emergency contact",
	"hero.triage": "Average triage time",
	"hero.nextAvailable": "Next available",
	"stats.0": "Pets under our care",
	"stats.1": "Licensed veterinarians",
	"stats.2": "Emergency availability",
	"stats.3": "Owner satisfaction",
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
	"auth.signIn": "Staff sign-in",
	"auth.signInDesc": "Restricted area. Enter the admin PIN to continue.",
	"auth.pin": "Admin PIN",
	"auth.pinPlaceholder": "••••••",
	"auth.unlock": "Unlock dashboard",
	"auth.setupTitle": "Set up admin PIN",
	"auth.setupDesc": "Choose a PIN to secure the staff dashboard. You'll need it each time you sign in.",
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
	"booking.requestedDesc": "Our reception team confirms every booking by phone or WhatsApp within 30 minutes during opening hours.",
	"booking.addCalendar": "Add to calendar",
	"booking.home": "Back to home",
	"booking.genericDoctor": "First available",
	"footer.tagline": "A boutique veterinary hospital built around clear diagnostics, honest estimates and records you actually own.",
	"footer.accred": "AAHA accredited · Fear Free certified · ISO 9001 quality managed",
	"footer.clinic": "Clinic",
	"footer.care": "Care",
	"footer.services": "Services",
	"footer.vets": "Our veterinarians",
	"footer.about": "About PawCare",
	"footer.contact": "Contact",
	"page.services.eyebrow": "Services",
	"page.services.title": "Clinical services, end to end",
	"page.services.desc": "Twelve service lines, one medical record. Whatever your pet needs next, the team already has the history.",
	"page.doctors.eyebrow": "Our team",
	"page.doctors.title": "Fourteen clinicians. One shared chart.",
	"page.doctors.desc": "Each veterinarian leads a specialty, and complex cases are reviewed together before a plan is signed off.",
	"page.about.eyebrow": "About",
	"page.about.title": "A medical practice that happens to treat animals",
	"page.about.desc": "PawCare opened in 2016 with six clinicians and one rule: never send an owner home without an explanation they understood.",
	"page.about.standards": "What we hold ourselves to",
	"page.contact.eyebrow": "Contact",
	"page.contact.title": "We're easy to reach, always",
	"page.contact.desc": "The emergency line is answered by a person, not a menu — at any hour of any day.",
	"home.services.title": "Everything your pet needs, under one roof",
	"home.services.desc": "From a routine booster to overnight critical care — no referrals across town, no repeated paperwork.",
	"home.team.eyebrow": "Our team",
	"home.team.title": "Clinicians who explain the whole picture",
	"home.team.desc": "Every veterinarian here holds a specialty focus, and every chart is reviewed by two of them.",
	"why.title": "The standard of care you'd want for yourself",
	"why.desc": "Everything here is built to remove guesswork — for you and for the clinician holding the chart.",
	"timeline.title": "Booked in under a minute",
	"timeline.desc": "Five short steps. Your progress saves as you go, so a refresh never costs you anything.",
	"testimonials.title": "What pet owners tell us",
	"faq.title": "Questions we hear most",
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
	"whyitem.0.title": "Experienced veterinarians",
	"whyitem.0.detail": "An average of 12 years in practice, with board certifications across five specialties.",
	"whyitem.1.title": "Modern equipment",
	"whyitem.1.detail": "Digital radiography, in-house diagnostics and monitored anaesthesia as standard.",
	"whyitem.2.title": "Transparent pricing",
	"whyitem.2.detail": "Written estimates before treatment begins. No line item you haven't approved.",
	"whyitem.3.title": "Emergency services",
	"whyitem.3.detail": "A staffed critical care team on the floor, not a redirected answering service.",
	"whyitem.4.title": "Personalised treatment",
	"whyitem.4.detail": "Care plans built around your pet's age, breed and history — not a template.",
	"whyitem.5.title": "Digital medical records",
	"whyitem.5.detail": "Your pet's complete chart, available to you and any clinic you choose.",
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
	"testi.0.quote": "Our terrier was triaged in under four minutes at 2am. The follow-up notes were in my inbox before we got home.",
	"testi.0.name": "Hannah Doyle",
	"testi.0.pet": "Rufus · Border Terrier",
	"testi.1.quote": "They explained every line of the estimate before touching anything. That kind of honesty is rare.",
	"testi.1.name": "Marcus Bell",
	"testi.1.pet": "Nala · Maine Coon",
	"testi.2.quote": "The vaccination reminders alone are worth it. I have never missed a booster since switching.",
	"testi.2.name": "Aisha Rahman",
	"testi.2.pet": "Kobi · Shiba Inu",
	"testi.3.quote": "Dr. Lindqvist is the only vet in the city my rabbit doesn't panic around. Genuinely gentle people.",
	"testi.3.name": "Theo Marchetti",
	"testi.3.pet": "Bramble · Lionhead Rabbit",
	"faq.0.q": "Do you take walk-in emergencies?",
	"faq.0.a": "Yes. Our emergency line is staffed 24/7 and our triage team assesses every walk-in on arrival. Life-threatening cases are always seen first, ahead of scheduled appointments.",
	"faq.1.q": "How far in advance should I book a routine visit?",
	"faq.1.a": "Most routine appointments are available within 48 hours. Specialist consultations — dermatology, dentistry, exotics — usually book five to seven days out.",
	"faq.2.q": "Can I transfer my pet's records from another clinic?",
	"faq.2.a": "Absolutely. Send us your previous clinic's details when you book and we'll request the full history, then merge it into your pet's digital chart before the first visit.",
	"faq.3.q": "What payment methods do you accept?",
	"faq.3.a": "All major cards, bank transfer and most pet insurance providers via direct billing. Written estimates are provided before any procedure begins.",
	"faq.4.q": "Do you treat animals other than cats and dogs?",
	"faq.4.a": "Yes — rabbits, ferrets, guinea pigs, reptiles and birds are all seen by our exotics team, with species-specific handling and anaesthesia protocols.",
	"faq.5.q": "How do vaccination reminders work?",
	"faq.5.a": "Every vaccine is logged with its due date. You'll get a reminder 30 days, 7 days and 1 day before it lapses, by email or WhatsApp — whichever you prefer.",
	"doc.dr-elena-marsh.name": "Dr. Elena Marsh",
	"doc.dr-elena-marsh.spec": "Internal Medicine",
	"doc.dr-elena-marsh.exp": "16 years",
	"doc.dr-elena-marsh.bio": "Leads our diagnostics team and holds a specialty in feline endocrinology.",
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
	"doc.dr-james-oconnell.bio": "Focused on pain-managed dental care for senior and small-breed patients.",
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
	"doc.dr-tomas-lindqvist.bio": "Cares for rabbits, reptiles and birds with species-specific protocols.",
	"doc.dr-tomas-lindqvist.tag.0": "Exotics anaesthesia",
	"doc.dr-tomas-lindqvist.tag.1": "Avian medicine",
	"doc.dr-tomas-lindqvist.tag.2": "Dental burring",
	"doc.dr-tomas-lindqvist.tag.3": "Husbandry",
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
	"filter.all": "All",
	"doctors.specLabel": "Specialization",
	"doctors.petLabel": "Pet type",
	"doctors.showing": "Showing {count} of {total} clinicians",
	"doctors.empty": "No clinician matches that combination. Try a different pet type.",
	"about.principle.0.title": "Diagnose before you treat",
	"about.principle.0.body": "No presumptive prescriptions. If we can't explain the finding, we run the test that will.",
	"about.principle.1.title": "Price it in writing",
	"about.principle.1.body": "A written estimate reaches you before anything begins, and we call if it needs to change.",
	"about.principle.2.title": "The record belongs to you",
	"about.principle.2.body": "Every note, image and result is exportable the day you ask, for any clinic you choose.",
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
	"booking.ph.medications": "None"
};
var DICTS = {
	en: EN,
	ar: {
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
		"hero.subtitle": "تشخيصات في نفس اليوم، وتقديرات مكتوبة قبل العلاج، وفريق طوارئ متاح 24/7 — ليتلاشى القلق فور دخولكم.",
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
		"booking.requestedDesc": "يؤكد فريق الاستقبال كل حجز عبر الهاتف أو واتساب خلال 30 دقيقة في ساعات العمل.",
		"booking.addCalendar": "أضف إلى التقويم",
		"booking.home": "العودة إلى الرئيسية",
		"booking.genericDoctor": "أول طبيب متاح",
		"footer.tagline": "مستشفى بيطري متخصص مبني على تشخيصات واضحة وتقديرات صادقة وسجلات طبية تملكها أنت بالفعل.",
		"footer.clinic": "العيادة",
		"footer.care": "الرعاية",
		"footer.services": "الخدمات",
		"footer.vets": "أطباؤنا البيطريون",
		"footer.about": "حول باوكير",
		"footer.contact": "اتصل بنا",
		"footer.accred": "معتمد من AAHA · معتمد من Fear Free · إدارة جودة وفق ISO 9001",
		"page.services.eyebrow": "الخدمات",
		"page.services.title": "خدمات سريرية متكاملة",
		"page.services.desc": "اثنتا عشرة خدمة في ملف طبي واحد. مهما كان ما يحتاجه حيوانك، فإن الفريق يعرف تاريخه الكامل.",
		"page.doctors.eyebrow": "فريقنا",
		"page.doctors.title": "أربعة عشر طبيباً بيطرياً. ملف طبي مشترك.",
		"page.doctors.desc": "يترأس كل طبيب تخصصًا محددًا، وتُراجع الحالات المعقدة معًا قبل اعتماد أي خطة علاج.",
		"page.about.eyebrow": "حول باوكير",
		"page.about.title": "ممارسة طبية تصادف أنها تعالج الحيوانات",
		"page.about.desc": "افتتحت باوكير في عام 2016 بستة أطباء وقاعدة واحدة: لا يُرسَل صاحب حيوان إلى منزله دون شرح مفهوم.",
		"page.about.standards": "ما نلتزم به",
		"page.contact.eyebrow": "الاتصال",
		"page.contact.title": "يسهل الوصول إلينا، دائمًا",
		"page.contact.desc": "خط الطوارئ يرد عليه شخص وليس قائمة نقرات، في أي ساعة من أي يوم.",
		"home.services.title": "كل ما يحتاجه حيوانك تحت سقف واحد",
		"home.services.desc": "من اللقاح الدوري إلى الرعاية الحرجة ليلًا، دون تحويلات أو أوراق متكررة.",
		"home.team.eyebrow": "فريقنا",
		"home.team.title": "أطباء يشرحون الصورة بأكملها",
		"home.team.desc": "لكل طبيب هنا تخصص محدد، ويُستعرض كل ملف طبي من قبل اثنين منهم.",
		"why.title": "المعيار الطبي الذي تريد لنفسك",
		"why.desc": "كل شيء هنا مصمم لإزالة التخمين، لك وللطبيب الذي يحمل الملف.",
		"timeline.title": "الحجز في أقل من دقيقة",
		"timeline.desc": "خمس خطوات قصيرة. يُحفظ تقدمك أثناء التنقل، فلا يكلفك التحديث شيئًا.",
		"testimonials.title": "ماذا يقول أصحاب الحيوانات؟",
		"faq.title": "الأسئلة التي نسمعها كثيرًا",
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
		"testi.0.quote": "تم فرز كلبنا الجحر في أقل من أربع دقائق عند الساعة الثانية فجرًا. وصلت ملاحظات المتابعة إلى بريدي قبل وصولنا إلى البيت.",
		"testi.0.name": "هانا دويل",
		"testi.0.pet": "روفوس · بوردر تيرير",
		"testi.1.quote": "شرحوا كل بند في التقدير قبل لمس أي شيء. هذا الصدق نادر.",
		"testi.1.name": "ماركوس بيل",
		"testi.1.pet": "نالا · مين كون",
		"testi.2.quote": "تذكيرات التطعيم وحدها تستحق الانتقال. لم أفوّت أي إعادة تطعيم منذ ذلك الحين.",
		"testi.2.name": "عائشة رحمن",
		"testi.2.pet": "كوبي · شيبا اينو",
		"testi.3.quote": "الدكتور لينكفيست هو الطبيب الوحيد في المدينة الذي لا يصاب أرنبي بالذعر معه. ناس لطيفون حقًا.",
		"testi.3.name": "تيو ماركيتي",
		"testi.3.pet": "برامبل · أرنب ليون هيد",
		"faq.0.q": "هل تستقبلون حالات الطوارئ دون موعد؟",
		"faq.0.a": "نعم. خط الطوارئ يعمل 24/7 وفريق الفرز يقيم كل حالة عند الوصول. الحالات الحرجة تُعالج دائمًا أولًا.",
		"faq.1.q": "كم مقدمًا يجب أن أحجز زيارة روتينية؟",
		"faq.1.a": "معظم المواعيد الروتينية متاحة خلال 48 ساعة. الاستشارات التخصصية عادة ما تُحجز قبل خمسة إلى سبعة أيام.",
		"faq.2.q": "هل يمكنني نقل سجلات حيواني من عيادة أخرى؟",
		"faq.2.a": "بالطبع. أرسل لنا تفاصيل عيادتك السابقة عند الحجز وسنطلب التاريخ الكامل وندمجه في ملف حيوانك قبل الزيارة.",
		"faq.3.q": "ما طرق الدفع المقبولة؟",
		"faq.3.a": "جميع البطاقات الرئيسية والتحويل البنكي ومعظم شركات التأمين عبر الفوترة المباشرة، مع تقديرات مكتوبة قبل كل إجراء.",
		"faq.4.q": "هل تعالجون حيوانات غير القطط والكلاب؟",
		"faq.4.a": "نعم — الأرانب وخنازير غينيا والزواحف والطيور يعالجها فريق الحيوانات الغريبة بأساليب خاصة بالأنواع.",
		"faq.5.q": "كيف تعمل تذكيرات التطعيم؟",
		"faq.5.a": "يُسجل كل لقاح مع تاريخ استحقاقه، وتصلك تذكيرات قبل 30 و7 و1 يوم عبر البريد أو واتساب حسب اختيارك.",
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
		"doc.dr-samir-haddad.tag.2": "إصلاح الرباط الصليبي",
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
		"doc.dr-james-oconnell.bio": "مركز على العناية بالأسنان مع إدارة الألم للمرضى المسنين والسلالات الصغيرة.",
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
		"doc.dr-tomas-lindqvist.spec": "الحيوانات الغريبة والثدييات الصغيرة",
		"doc.dr-tomas-lindqvist.exp": "14 عامًا",
		"doc.dr-tomas-lindqvist.bio": "يرعى الأرانب والزواحف والطيور بأساليب خاصة بها.",
		"doc.dr-tomas-lindqvist.tag.0": "تخدير الحيوانات الغريبة",
		"doc.dr-tomas-lindqvist.tag.1": "طب الطيور",
		"doc.dr-tomas-lindqvist.tag.2": "برد الأسنان",
		"doc.dr-tomas-lindqvist.tag.3": "التربية والرعاية",
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
		"filter.all": "الكل",
		"doctors.specLabel": "التخصص",
		"doctors.petLabel": "نوع الحيوان",
		"doctors.showing": "عرض {count} من {total} أطباء",
		"doctors.empty": "لا يوجد طبيب يطابق هذا المزيج. جرّب نوع حيوان آخر.",
		"about.principle.0.title": "شخّص قبل أن تعالج",
		"about.principle.0.body": "لا وصفات تخمينية. إذا لم نستطع شرح النتيجة، نجري التحليل الذي سيجعلها واضحة.",
		"about.principle.1.title": "السعر مكتوب",
		"about.principle.1.body": "يصلك تقدير مكتوب قبل أي إجراء، ونتصل بك إذا تغير السعر.",
		"about.principle.2.title": "السجل ملكك",
		"about.principle.2.body": "كل ملاحظة وصورة ونتيجة قابلة للتصدير في نفس اليوم الذي تطلبها، لأي عيادة تختارها.",
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
		"dash.statusCol": "الحالة",
		"dash.srSection": "قسم لوحة التحكم",
		"dash.unnamed": "طبيب بدون اسم",
		"dash.untitled": "خدمة بدون عنوان",
		"availability.fullyBooked": "مكتمل الحجز هذا الشهر — انضم لقائمة الانتظار عند الحجز.",
		"availability.slotsOpen": "مواعيد متاحة",
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
		"booking.ph.breed": "بوردر تيرير",
		"booking.ph.age": "4 سنوات",
		"booking.ph.weight": "8.2 كجم",
		"booking.ph.symptoms": "يعرج في الساق الأمامية اليسرى منذ الثلاثاء ويأكل بشكل طبيعي.",
		"booking.ph.allergies": "لا توجد حساسية معروفة",
		"booking.ph.medications": "لا شيء"
	}
};
var I18nContext = createContext(null);
function applyLang(lang) {
	if (typeof document === "undefined") return;
	document.documentElement.lang = lang;
	document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	document.documentElement.classList.toggle("lang-ar", lang === "ar");
}
function I18nProvider({ children, initialLang = "en" }) {
	const [lang, setLangState] = useState(initialLang);
	useEffect(() => {
		let stored = null;
		try {
			stored = window.localStorage.getItem(LANG_KEY);
		} catch {}
		if (stored === "ar") {
			setLangState("ar");
			writeLangCookie("ar");
		}
	}, []);
	useEffect(() => {
		applyLang(lang);
		try {
			window.localStorage.setItem(LANG_KEY, lang);
		} catch {}
	}, [lang]);
	const setLang = useCallback((next) => {
		setLangState(next);
		applyLang(next);
		writeLangCookie(next);
	}, []);
	const t = useCallback((key, params) => {
		let str = DICTS[lang][key] ?? EN[key] ?? key;
		if (params) for (const [k, v] of Object.entries(params)) str = str.replace(`{${k}}`, v);
		return str;
	}, [lang]);
	const tOr = useCallback((key, fallback, params) => {
		let str = DICTS[lang][key] ?? EN[key] ?? fallback;
		if (params) for (const [k, v] of Object.entries(params)) str = str.replace(`{${k}}`, v);
		return str;
	}, [lang]);
	const value = useMemo(() => ({
		lang,
		dir: lang === "ar" ? "rtl" : "ltr",
		t,
		tOr,
		setLang,
		toggleLang: () => setLang(lang === "en" ? "ar" : "en")
	}), [
		lang,
		t,
		tOr,
		setLang
	]);
	return /* @__PURE__ */ jsx(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
	return ctx;
}
function LanguageToggle({ className = "" }) {
	const { lang, toggleLang } = useI18n();
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: toggleLang,
		"aria-label": lang === "en" ? "Switch to العربية" : "Switch to English",
		className: `grid size-9 place-items-center rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`,
		children: lang === "en" ? "ع" : "EN"
	});
}
//#endregion
//#region src/components/IntroAnimation.tsx
var MAX_DURATION = 900;
var INTRO_SEEN_KEY = "pawcare:intro-seen";
function hasSeenIntro() {
	try {
		return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
	} catch {
		return false;
	}
}
function markIntroSeen() {
	try {
		window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
	} catch {}
}
function IntroAnimation() {
	const reduceMotion = useReducedMotion();
	const reduceRef = useRef(reduceMotion);
	reduceRef.current = reduceMotion;
	const { t } = useI18n();
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showSkip, setShowSkip] = useState(false);
	useEffect(() => {
		if (hasSeenIntro()) return;
		markIntroSeen();
		setVisible(true);
		const start = performance.now();
		const total = reduceRef.current ? 400 : MAX_DURATION;
		let raf = 0;
		let fontsDone = false;
		document.fonts?.ready.then(() => {
			fontsDone = true;
		});
		const tick = () => {
			const elapsed = performance.now() - start;
			const timed = Math.min(1, elapsed / total);
			const eased = 1 - Math.pow(1 - timed, 3);
			setProgress(fontsDone ? Math.max(eased, Math.min(1, elapsed / (total * .75))) : eased);
			if (elapsed >= total) finish();
			else raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		const skipTimer = window.setTimeout(() => setShowSkip(true), 500);
		function finish() {
			cancelAnimationFrame(raf);
			window.clearTimeout(skipTimer);
			setVisible(false);
			window.removeEventListener("keydown", finish);
			window.removeEventListener("pointerdown", finish);
		}
		window.addEventListener("keydown", finish);
		window.addEventListener("pointerdown", finish);
		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(skipTimer);
			window.removeEventListener("keydown", finish);
			window.removeEventListener("pointerdown", finish);
		};
	}, []);
	const ease = [
		.16,
		1,
		.3,
		1
	];
	return /* @__PURE__ */ jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-background",
		initial: { opacity: 1 },
		exit: reduceMotion ? { opacity: 0 } : {
			opacity: 0,
			scale: .96
		},
		transition: {
			duration: reduceMotion ? .15 : .25,
			ease
		},
		role: "status",
		"aria-label": t("intro.loadingAria"),
		children: [
			/* @__PURE__ */ jsx("div", { className: "hero-gradient absolute inset-0" }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative flex flex-col items-center gap-5 px-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx(motion.div, {
							initial: reduceMotion ? { opacity: 0 } : {
								opacity: 0,
								scale: .9
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							transition: {
								duration: .5,
								ease,
								delay: .05
							},
							className: "text-primary",
							children: /* @__PURE__ */ jsx(IntroMark, { reduceMotion: !!reduceMotion })
						}), /* @__PURE__ */ jsx(motion.span, {
							initial: reduceMotion ? { opacity: 0 } : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .45,
								ease,
								delay: reduceMotion ? .05 : .5
							},
							className: "text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl",
							children: "PawCare"
						})]
					}),
					/* @__PURE__ */ jsx(motion.p, {
						initial: {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .4,
							ease,
							delay: reduceMotion ? .1 : .62
						},
						className: "text-sm text-muted-foreground",
						children: t("intro.tagline")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-2 h-[2px] w-52 overflow-hidden rounded-full bg-border",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full rounded-full bg-primary transition-[width] duration-100 ease-linear",
							style: { width: `${Math.round(progress * 100)}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: showSkip && /* @__PURE__ */ jsx(motion.span, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "absolute bottom-8 text-xs tracking-wide text-muted-foreground",
				children: t("intro.skip")
			}) })
		]
	}, "pawcare-intro") });
}
function IntroMark({ reduceMotion }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 64 64",
		className: "h-14 w-14 sm:h-16 sm:w-16",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx(motion.path, {
			d: "M4 42h9l5-11 6 20 5-15 4 6h6",
			stroke: "currentColor",
			strokeWidth: "3.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			initial: reduceMotion ? {
				pathLength: 1,
				opacity: 1
			} : {
				pathLength: 0,
				opacity: 1
			},
			animate: { pathLength: 1 },
			transition: {
				duration: reduceMotion ? 0 : .6,
				ease: [
					.16,
					1,
					.3,
					1
				]
			}
		}), /* @__PURE__ */ jsxs(motion.g, {
			fill: "currentColor",
			initial: reduceMotion ? { opacity: 1 } : {
				opacity: 0,
				scale: .7
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			style: { transformOrigin: "52px 28px" },
			transition: {
				duration: .4,
				delay: reduceMotion ? 0 : .45,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			children: [
				/* @__PURE__ */ jsx("ellipse", {
					cx: "43.5",
					cy: "20",
					rx: "3.1",
					ry: "4.2"
				}),
				/* @__PURE__ */ jsx("ellipse", {
					cx: "52",
					cy: "16.5",
					rx: "3.1",
					ry: "4.4"
				}),
				/* @__PURE__ */ jsx("ellipse", {
					cx: "60",
					cy: "21",
					rx: "2.9",
					ry: "4"
				}),
				/* @__PURE__ */ jsx("path", { d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z" })
			]
		})]
	});
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/lib/clinic-data.ts
var CLINIC = {
	name: "PawCare",
	tagline: "Veterinary care, quietly excellent.",
	phone: "+1 (415) 555-0142",
	emergency: "+1 (415) 555-0911",
	whatsapp: "+1 (415) 555-0142",
	email: "hello@pawcare.clinic",
	address: "218 Marlow Street, Suite 4 · San Francisco, CA 94110",
	hours: [
		{
			day: "Monday – Friday",
			time: "08:00 – 20:00"
		},
		{
			day: "Saturday",
			time: "09:00 – 18:00"
		},
		{
			day: "Sunday",
			time: "10:00 – 16:00"
		},
		{
			day: "Emergency line",
			time: "24 / 7"
		}
	]
};
var STATS = [
	{
		value: 5e3,
		suffix: "+",
		label: "Pets under our care"
	},
	{
		value: 14,
		suffix: "",
		label: "Licensed veterinarians"
	},
	{
		value: 24,
		suffix: "/7",
		label: "Emergency availability"
	},
	{
		value: 98,
		suffix: "%",
		label: "Owner satisfaction"
	}
];
var SERVICES = [
	{
		slug: "general-checkup",
		icon: "Stethoscope",
		title: "General Checkup",
		description: "Full physical exams with a written wellness plan after every visit."
	},
	{
		slug: "vaccination",
		icon: "Syringe",
		title: "Vaccination",
		description: "Core and lifestyle vaccines, tracked with automatic due-date reminders."
	},
	{
		slug: "surgery",
		icon: "Scissors",
		title: "Surgery",
		description: "Soft tissue and orthopaedic procedures in a dedicated sterile theatre."
	},
	{
		slug: "emergency",
		icon: "Siren",
		title: "Emergency Care",
		description: "Triage within minutes, any hour, with on-call critical care staff."
	},
	{
		slug: "laboratory",
		icon: "FlaskConical",
		title: "Laboratory",
		description: "In-house bloodwork and cytology with same-visit results."
	},
	{
		slug: "dental",
		icon: "Sparkles",
		title: "Dental Care",
		description: "Scaling, polishing and extractions under monitored anaesthesia."
	},
	{
		slug: "pharmacy",
		icon: "Pill",
		title: "Pharmacy",
		description: "Dispensed on site, dosage verified against your pet's chart."
	},
	{
		slug: "grooming",
		icon: "Bath",
		title: "Grooming",
		description: "Medicated baths and coat care supervised by clinical staff."
	},
	{
		slug: "nutrition",
		icon: "Salad",
		title: "Nutrition",
		description: "Weight and diet programmes built around measurable targets."
	},
	{
		slug: "x-ray",
		icon: "ScanLine",
		title: "Digital X-Ray",
		description: "Low-dose digital radiography read within the same appointment."
	},
	{
		slug: "ultrasound",
		icon: "Activity",
		title: "Ultrasound",
		description: "Abdominal and cardiac imaging performed by certified sonographers."
	},
	{
		slug: "records",
		icon: "FolderHeart",
		title: "Digital Records",
		description: "Every visit, result and prescription in one shareable history."
	}
];
var WHY_US = [
	{
		title: "Experienced veterinarians",
		detail: "An average of 12 years in practice, with board certifications across five specialties."
	},
	{
		title: "Modern equipment",
		detail: "Digital radiography, in-house diagnostics and monitored anaesthesia as standard."
	},
	{
		title: "Transparent pricing",
		detail: "Written estimates before treatment begins. No line item you haven't approved."
	},
	{
		title: "Emergency services",
		detail: "A staffed critical care team on the floor, not a redirected answering service."
	},
	{
		title: "Personalised treatment",
		detail: "Care plans built around your pet's age, breed and history — not a template."
	},
	{
		title: "Digital medical records",
		detail: "Your pet's complete chart, available to you and any clinic you choose."
	}
];
var DOCTORS = [
	{
		id: "dr-elena-marsh",
		name: "Dr. Elena Marsh",
		specialization: "Internal Medicine",
		experience: "16 years",
		rating: 4.9,
		days: [
			"Mon",
			"Tue",
			"Thu",
			"Fri"
		],
		bio: "Leads our diagnostics team and holds a specialty in feline endocrinology.",
		initials: "EM",
		tags: [
			"Endocrinology",
			"Chronic disease",
			"Senior care",
			"Ultrasound"
		],
		pets: ["Dog", "Cat"]
	},
	{
		id: "dr-samir-haddad",
		name: "Dr. Samir Haddad",
		specialization: "Surgery & Orthopaedics",
		experience: "13 years",
		rating: 4.8,
		days: [
			"Mon",
			"Wed",
			"Thu"
		],
		bio: "Performs over 300 soft tissue and orthopaedic procedures each year.",
		initials: "SH",
		tags: [
			"Orthopaedics",
			"Soft tissue",
			"Cruciate repair",
			"Post-op rehab"
		],
		pets: ["Dog", "Cat"]
	},
	{
		id: "dr-nadia-osei",
		name: "Dr. Nadia Osei",
		specialization: "Emergency & Critical Care",
		experience: "11 years",
		rating: 5,
		days: [
			"Tue",
			"Wed",
			"Fri",
			"Sat"
		],
		bio: "Runs the overnight critical care rotation and our triage protocol.",
		initials: "NO",
		tags: [
			"Triage",
			"Critical care",
			"Trauma",
			"Overnight"
		],
		pets: [
			"Dog",
			"Cat",
			"Rabbit"
		]
	},
	{
		id: "dr-james-oconnell",
		name: "Dr. James O'Connell",
		specialization: "Dentistry & Oral Surgery",
		experience: "9 years",
		rating: 4.8,
		days: [
			"Wed",
			"Thu",
			"Sat"
		],
		bio: "Focused on pain-managed dental care for senior and small-breed patients.",
		initials: "JO",
		tags: [
			"Dental surgery",
			"Extractions",
			"Pain management",
			"Small breeds"
		],
		pets: ["Dog", "Cat"]
	},
	{
		id: "dr-priya-raman",
		name: "Dr. Priya Raman",
		specialization: "Dermatology & Allergy",
		experience: "10 years",
		rating: 4.9,
		days: [
			"Mon",
			"Tue",
			"Fri"
		],
		bio: "Builds long-term plans for chronic skin, ear and allergy conditions.",
		initials: "PR",
		tags: [
			"Allergy testing",
			"Ear disease",
			"Skin cytology",
			"Immunotherapy"
		],
		pets: ["Dog", "Cat"]
	},
	{
		id: "dr-tomas-lindqvist",
		name: "Dr. Tomas Lindqvist",
		specialization: "Exotics & Small Mammals",
		experience: "14 years",
		rating: 4.7,
		days: [
			"Tue",
			"Thu",
			"Sat"
		],
		bio: "Cares for rabbits, reptiles and birds with species-specific protocols.",
		initials: "TL",
		tags: [
			"Exotics anaesthesia",
			"Avian medicine",
			"Dental burring",
			"Husbandry"
		],
		pets: [
			"Rabbit",
			"Bird",
			"Reptile",
			"Ferret",
			"Guinea Pig"
		]
	}
];
var BOOKING_STEPS = [
	{
		title: "Choose a date",
		detail: "Live availability across every clinician."
	},
	{
		title: "Pick a time",
		detail: "Booked slots disappear as you look."
	},
	{
		title: "Tell us about your pet",
		detail: "Species, breed, age, weight, history."
	},
	{
		title: "Describe the case",
		detail: "Symptoms, medications, allergies."
	},
	{
		title: "Confirm",
		detail: "Summary, calendar invite and reminders."
	}
];
var TESTIMONIALS = [
	{
		quote: "Our terrier was triaged in under four minutes at 2am. The follow-up notes were in my inbox before we got home.",
		name: "Hannah Doyle",
		pet: "Rufus · Border Terrier",
		rating: 5
	},
	{
		quote: "They explained every line of the estimate before touching anything. That kind of honesty is rare.",
		name: "Marcus Bell",
		pet: "Nala · Maine Coon",
		rating: 5
	},
	{
		quote: "The vaccination reminders alone are worth it. I have never missed a booster since switching.",
		name: "Aisha Rahman",
		pet: "Kobi · Shiba Inu",
		rating: 5
	},
	{
		quote: "Dr. Lindqvist is the only vet in the city my rabbit doesn't panic around. Genuinely gentle people.",
		name: "Theo Marchetti",
		pet: "Bramble · Lionhead Rabbit",
		rating: 5
	}
];
var FAQS = [
	{
		q: "Do you take walk-in emergencies?",
		a: "Yes. Our emergency line is staffed 24/7 and our triage team assesses every walk-in on arrival. Life-threatening cases are always seen first, ahead of scheduled appointments."
	},
	{
		q: "How far in advance should I book a routine visit?",
		a: "Most routine appointments are available within 48 hours. Specialist consultations — dermatology, dentistry, exotics — usually book five to seven days out."
	},
	{
		q: "Can I transfer my pet's records from another clinic?",
		a: "Absolutely. Send us your previous clinic's details when you book and we'll request the full history, then merge it into your pet's digital chart before the first visit."
	},
	{
		q: "What payment methods do you accept?",
		a: "All major cards, bank transfer and most pet insurance providers via direct billing. Written estimates are provided before any procedure begins."
	},
	{
		q: "Do you treat animals other than cats and dogs?",
		a: "Yes — rabbits, ferrets, guinea pigs, reptiles and birds are all seen by our exotics team, with species-specific handling and anaesthesia protocols."
	},
	{
		q: "How do vaccination reminders work?",
		a: "Every vaccine is logged with its due date. You'll get a reminder 30 days, 7 days and 1 day before it lapses, by email or WhatsApp — whichever you prefer."
	}
];
var ANIMAL_TYPES = [
	"Dog",
	"Cat",
	"Rabbit",
	"Bird",
	"Reptile",
	"Ferret",
	"Guinea Pig",
	"Other"
];
var TIME_SLOTS = [
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
	"17:30"
];
/** Deterministic pseudo-booked slots so the picker feels alive without a backend yet. */
function bookedSlotsFor(dateISO, doctorId, confirmed) {
	let seed = 0;
	const key = `${dateISO}|${doctorId}`;
	for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) % 1e5;
	const pseudo = TIME_SLOTS.filter((_, i) => (seed >> i % 12) % 3 === 0);
	const real = new Set((confirmed ?? []).filter((b) => b.date === dateISO && b.doctorId === doctorId).map((b) => b.time));
	return [.../* @__PURE__ */ new Set([...pseudo, ...real])];
}
var DAY_ORDER = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
/**
* Next `count` working days for a doctor, with the first open slots on each.
* Uses the same deterministic pseudo-booking source as the booking picker, plus
* any real non-cancelled requests so the public availability matches the dashboard.
*/
function upcomingAvailability(doctor, count = 3, from = /* @__PURE__ */ new Date(), confirmed, locale = "en-US") {
	const out = [];
	const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	const realBookings = (confirmed ?? []).filter((c) => c.status !== "cancelled" && c.status !== "completed");
	for (let i = 0; i < 30 && out.length < count; i++) {
		cursor.setDate(cursor.getDate() + 1);
		const dayLabel = DAY_ORDER[cursor.getDay()];
		if (!doctor.days.includes(dayLabel)) continue;
		const dateISO = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
		const booked = new Set(bookedSlotsFor(dateISO, doctor.id, realBookings));
		const open = TIME_SLOTS.filter((t) => !booked.has(t));
		if (open.length === 0) continue;
		out.push({
			dateISO,
			dayLabel,
			dateLabel: cursor.toLocaleDateString(locale, {
				month: "short",
				day: "numeric"
			}),
			openCount: open.length,
			slots: open.slice(0, 3)
		});
	}
	return out;
}
ANIMAL_TYPES.filter((a) => DOCTORS.some((d) => d.pets.includes(a)));
//#endregion
//#region src/lib/sanitize.ts
/** Strip anything that is not a valid dialable phone character. */
function sanitizePhone(raw) {
	return raw.replace(/[^\d+()\-\s]/g, "").trim();
}
/** Strip everything except digits (used for wa.me links). */
function sanitizeWhatsapp(raw) {
	return raw.replace(/\D/g, "");
}
var EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
/** Normalize + validate an email address; returns `null` when invalid. */
function sanitizeEmail(raw) {
	const email = raw.trim().toLowerCase();
	return EMAIL_RE.test(email) ? email : null;
}
/**
* Build a safe `tel:` href. Returns null when the input contains no dialable
* characters, guarding against `javascript:` or control-char injection.
*/
function telHref(phone) {
	const digits = sanitizePhone(phone);
	if (!digits) return null;
	return `tel:${digits}`;
}
/** Build a safe `mailto:` href, or null when the email is invalid. */
function mailtoHref(email) {
	const clean = sanitizeEmail(email);
	return clean ? `mailto:${clean}` : null;
}
/** Build a safe `https://wa.me/` href, or null when no digits exist. */
function waMeHref(whatsapp) {
	const digits = sanitizeWhatsapp(whatsapp);
	if (!digits) return null;
	return `https://wa.me/${digits}`;
}
//#endregion
//#region src/lib/clinic-store.ts
var STORAGE_KEY = "pawcare:clinic-store";
function seed() {
	return {
		requests: [],
		doctors: DOCTORS,
		services: SERVICES,
		settings: { ...CLINIC }
	};
}
function persist(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
}
function load() {
	if (typeof window === "undefined") return seed();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			const s = seed();
			persist(s);
			return s;
		}
		const parsed = JSON.parse(raw);
		const base = seed();
		return {
			requests: Array.isArray(parsed.requests) ? parsed.requests : base.requests,
			doctors: Array.isArray(parsed.doctors) && parsed.doctors.length ? parsed.doctors : base.doctors,
			services: Array.isArray(parsed.services) && parsed.services.length ? parsed.services : base.services,
			settings: parsed.settings ? {
				...base.settings,
				...parsed.settings
			} : base.settings
		};
	} catch {
		return seed();
	}
}
var state = load();
var listeners = /* @__PURE__ */ new Set();
function emit() {
	for (const l of listeners) l();
}
function set(mutator) {
	state = mutator(state);
	persist(state);
	emit();
}
function getSnapshot() {
	return state;
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function uid(prefix) {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function addBookingRequest(input) {
	set((s) => ({
		...s,
		requests: [{
			...input,
			id: uid("req"),
			status: "pending",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...s.requests]
	}));
	return getSnapshot();
}
function setBookingStatus(id, status) {
	set((s) => ({
		...s,
		requests: s.requests.map((r) => r.id === id ? {
			...r,
			status
		} : r)
	}));
}
function deleteRequest(id) {
	set((s) => ({
		...s,
		requests: s.requests.filter((r) => r.id !== id)
	}));
}
function saveDoctor(doctor) {
	set((s) => {
		const exists = s.doctors.some((d) => d.id === doctor.id);
		return {
			...s,
			doctors: exists ? s.doctors.map((d) => d.id === doctor.id ? doctor : d) : [doctor, ...s.doctors]
		};
	});
}
function deleteDoctor(id) {
	set((s) => ({
		...s,
		doctors: s.doctors.filter((d) => d.id !== id)
	}));
}
function saveService(service) {
	set((s) => {
		const exists = s.services.some((sv) => sv.slug === service.slug);
		return {
			...s,
			services: exists ? s.services.map((sv) => sv.slug === service.slug ? service : sv) : [service, ...s.services]
		};
	});
}
function deleteService(slug) {
	set((s) => ({
		...s,
		services: s.services.filter((sv) => sv.slug !== slug)
	}));
}
function updateSettings(patch) {
	const clean = { ...patch };
	if (patch.phone !== void 0) clean.phone = sanitizePhone(patch.phone);
	if (patch.emergency !== void 0) clean.emergency = sanitizePhone(patch.emergency);
	if (patch.whatsapp !== void 0) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
	if (patch.email !== void 0) clean.email = sanitizeEmail(patch.email) ?? "";
	set((s) => ({
		...s,
		settings: {
			...s.settings,
			...clean
		}
	}));
}
function useClinicStore() {
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
//#endregion
//#region src/components/site/SiteHeader.tsx
function useNav() {
	const { t } = useI18n();
	return [
		{
			to: "/",
			label: t("nav.home")
		},
		{
			to: "/services",
			label: t("nav.services")
		},
		{
			to: "/doctors",
			label: t("nav.doctors")
		},
		{
			to: "/about",
			label: t("nav.about")
		},
		{
			to: "/contact",
			label: t("nav.contact")
		}
	];
}
function useTheme() {
	const [dark, setDark] = useState(false);
	useEffect(() => {
		let stored = null;
		try {
			stored = localStorage.getItem("pawcare:theme");
		} catch {}
		const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const next = stored ? stored === "dark" : prefers;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
	}, []);
	const toggle = () => {
		setDark((d) => {
			const next = !d;
			document.documentElement.classList.toggle("dark", next);
			try {
				localStorage.setItem("pawcare:theme", next ? "dark" : "light");
			} catch {}
			return next;
		});
	};
	return {
		dark,
		toggle
	};
}
function SiteHeader() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const { dark, toggle } = useTheme();
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const NAV = useNav();
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsxs("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-background shadow-card" : "border-b border-transparent bg-transparent"),
		style: scrolled ? { borderBottom: "1px solid var(--border)" } : void 0,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					"aria-label": t("header.homeAria"),
					children: /* @__PURE__ */ jsx(PawCareLogo, {})
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": t("header.mainAria"),
					children: NAV.map((item) => /* @__PURE__ */ jsx(Link, {
						to: item.to,
						className: "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
						activeOptions: { exact: item.to === "/" },
						activeProps: { className: "text-foreground" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(LanguageToggle, {}),
						/* @__PURE__ */ jsx("button", {
							onClick: toggle,
							"aria-label": dark ? t("header.lightMode") : t("header.darkMode"),
							className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
							children: dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
						}),
						/* @__PURE__ */ jsxs("a", {
							href: telHref(settings.emergency) ?? void 0,
							className: "hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex",
							children: [/* @__PURE__ */ jsx(Phone, { className: "size-4" }), settings.emergency]
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							className: "hidden shadow-glow sm:inline-flex",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/book",
								children: t("nav.book")
							})
						}),
						/* @__PURE__ */ jsx("button", {
							className: "grid size-9 place-items-center rounded-lg text-foreground md:hidden",
							onClick: () => setOpen((o) => !o),
							"aria-label": open ? t("header.closeMenu") : t("header.openMenu"),
							"aria-expanded": open,
							children: open ? /* @__PURE__ */ jsx(X, { className: "size-5" }) : /* @__PURE__ */ jsx(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
			initial: {
				height: 0,
				opacity: 0
			},
			animate: {
				height: "auto",
				opacity: 1
			},
			exit: {
				height: 0,
				opacity: 0
			},
			transition: {
				duration: .3,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			className: "overflow-hidden border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ jsxs("nav", {
				className: "mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4",
				"aria-label": t("header.mobileAria"),
				children: [NAV.map((item, i) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						x: -10
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						delay: .06 * i,
						duration: .28,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					children: /* @__PURE__ */ jsx(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: "block rounded-lg bg-muted/50 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground",
						children: item.label
					})
				}, item.to)), /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						delay: .3,
						duration: .28,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					children: /* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "mt-2 w-full shadow-glow",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/book",
							onClick: () => setOpen(false),
							children: t("nav.book")
						})
					})
				})]
			})
		}, "mobile-menu") })]
	});
}
//#endregion
//#region src/components/motion-primitives.tsx
var EASE = [
	.16,
	1,
	.3,
	1
];
function Reveal({ children, delay = 0, y = 16, className }) {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ jsx(motion.div, {
		className,
		initial: reduce ? { opacity: 0 } : {
			opacity: 0,
			y
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .55,
			delay,
			ease: EASE
		},
		children
	});
}
function CountUp({ value, suffix = "", duration = 1400 }) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-60px"
	});
	const reduce = useReducedMotion();
	const [display, setDisplay] = useState(0);
	useEffect(() => {
		if (!inView) return;
		if (reduce) {
			setDisplay(value);
			return;
		}
		const start = performance.now();
		let raf = 0;
		const tick = (now) => {
			const t = Math.min(1, (now - start) / duration);
			setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		inView,
		value,
		duration,
		reduce
	]);
	return /* @__PURE__ */ jsxs("span", {
		ref,
		children: [display.toLocaleString(), suffix]
	});
}
//#endregion
//#region src/components/site/SiteFooter.tsx
function SiteFooter() {
	const { settings } = useClinicStore();
	const { t } = useI18n();
	const COLUMNS = [{
		heading: t("footer.clinic"),
		links: [
			{
				to: "/services",
				label: t("nav.services")
			},
			{
				to: "/doctors",
				label: t("footer.vets")
			},
			{
				to: "/about",
				label: t("footer.about")
			},
			{
				to: "/contact",
				label: t("footer.contact")
			}
		]
	}, {
		heading: t("footer.care"),
		links: [{
			to: "/book",
			label: t("nav.book")
		}, {
			to: "/services",
			label: t("footer.services")
		}]
	}];
	return /* @__PURE__ */ jsxs("footer", {
		className: "border-t border-border bg-surface",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4",
			children: [/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", {
				className: "md:col-span-2",
				children: [
					/* @__PURE__ */ jsx(PawCareLogo, {}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground",
						children: t("footer.tagline")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 space-y-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }), settings.address]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: telHref(settings.phone) ?? void 0,
								className: "flex items-center gap-2 transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ jsx(Phone, { className: "size-4 text-primary" }), settings.phone]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: mailtoHref(settings.email) ?? void 0,
								className: "flex items-center gap-2 transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ jsx(Mail, { className: "size-4 text-primary" }), settings.email]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: waMeHref(settings.whatsapp) ?? void 0,
								className: "flex items-center gap-2 transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ jsx(MessageCircle, { className: "size-4 text-primary" }), "WhatsApp"]
							})
						]
					})
				]
			}) }), COLUMNS.map((col, i) => /* @__PURE__ */ jsx(Reveal, {
				delay: .08 + i * .08,
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold text-foreground",
					children: col.heading
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-4 space-y-2.5",
					children: col.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: link.to,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: link.label
					}) }, link.label))
				})] })
			}, col.heading))]
		}), /* @__PURE__ */ jsx("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ jsxs(motion.div, {
				initial: { opacity: 0 },
				whileInView: { opacity: 1 },
				viewport: {
					once: true,
					margin: "-60px"
				},
				transition: {
					duration: .7,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8",
				children: [/* @__PURE__ */ jsxs("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					settings.name,
					" ",
					t("footer.rights")
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/dashboard",
						className: "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
						children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "size-3.5" }), t("nav.staff")]
					}), /* @__PURE__ */ jsx("p", { children: t("footer.accred") })]
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/lib/runtime-error-reporting.ts
function reportRuntimeError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__runtimeEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__reportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: t("notfound.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("notfound.desc")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("notfound.home")
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	const { t } = useI18n();
	useEffect(() => {
		reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: t("error.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("error.desc")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("error.retry")
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: t("error.home")
					})]
				})
			]
		})
	});
}
var FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";
var Route$9 = createRootRouteWithContext()({
	beforeLoad: () => ({ lang: readLangCookie() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PawCare Veterinary Clinic" },
			{
				name: "description",
				content: "PawCare is a boutique veterinary hospital: same-day diagnostics, transparent estimates and 24/7 emergency care."
			},
			{
				name: "author",
				content: "PawCare Veterinary Clinic"
			},
			{
				property: "og:site_name",
				content: "PawCare"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#7BA882"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	const { lang } = Route$9.useRouteContext();
	return /* @__PURE__ */ jsxs("html", {
		lang,
		dir: lang === "ar" ? "rtl" : "ltr",
		className: lang === "ar" ? "lang-ar" : void 0,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient, lang } = Route$9.useRouteContext();
	const { pathname } = useLocation();
	useEffect(() => {
		let link;
		let cancelled = false;
		const id = window.setTimeout(() => {
			if (cancelled) return;
			link = document.createElement("link");
			link.rel = "stylesheet";
			link.media = "print";
			link.onload = () => {
				if (link) link.media = "all";
			};
			link.href = FONT_CSS_URL;
			document.head.appendChild(link);
		}, 100);
		return () => {
			cancelled = true;
			window.clearTimeout(id);
		};
	}, []);
	return /* @__PURE__ */ jsx(I18nProvider, {
		initialLang: lang,
		children: /* @__PURE__ */ jsxs(QueryClientProvider, {
			client: queryClient,
			children: [
				/* @__PURE__ */ jsx(IntroAnimation, {}),
				/* @__PURE__ */ jsx(SiteHeader, {}),
				/* @__PURE__ */ jsx(motion.main, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .45,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "min-h-screen",
					children: /* @__PURE__ */ jsx(Outlet, {})
				}, pathname),
				/* @__PURE__ */ jsx(SiteFooter, {}),
				/* @__PURE__ */ jsx(Toaster$1, {
					position: "top-center",
					richColors: true
				})
			]
		})
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$7 = () => import("./routes-pdn3E5o_.js");
var title$6 = "PawCare — Veterinary Clinic in San Francisco";
var description$6 = "Same-day diagnostics, transparent estimates and a 24/7 emergency team. Book your pet's appointment with PawCare in under a minute.";
var Route$8 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: title$6 },
			{
				name: "description",
				content: description$6
			},
			{
				property: "og:title",
				content: title$6
			},
			{
				property: "og:description",
				content: description$6
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "VeterinaryCare",
				name: "PawCare Veterinary Clinic",
				description: description$6,
				url: "/",
				address: {
					"@type": "PostalAddress",
					addressLocality: "San Francisco",
					addressRegion: "CA",
					addressCountry: "US"
				}
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$6 = () => import("./about-CivVXoSp.js");
var title$5 = "About PawCare — A Boutique Veterinary Hospital";
var description$5 = "PawCare was built around clear diagnostics, honest estimates and medical records pet owners actually own. Meet the practice behind the care.";
var Route$7 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: title$5 },
			{
				name: "description",
				content: description$5
			},
			{
				property: "og:title",
				content: title$5
			},
			{
				property: "og:description",
				content: description$5
			},
			{
				property: "og:url",
				content: "/about"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/book.tsx
var $$splitComponentImporter$5 = () => import("./book-DYoWYu_h.js");
var title$4 = "Book an Appointment — PawCare";
var description$4 = "Book your pet's veterinary appointment at PawCare in under a minute. Live availability across every clinician, with instant confirmation.";
var Route$6 = createFileRoute("/book")({
	validateSearch: (search) => typeof search["doctor"] === "string" ? { doctor: search["doctor"] } : {},
	head: () => ({
		meta: [
			{ title: title$4 },
			{
				name: "description",
				content: description$4
			},
			{
				property: "og:title",
				content: title$4
			},
			{
				property: "og:description",
				content: description$4
			},
			{
				property: "og:url",
				content: "/book"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/book"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$4 = () => import("./contact-BQj0u72P.js");
var title$3 = "Contact PawCare — Hours, Location & Emergency Line";
var description$3 = "Call, message or visit PawCare Veterinary Clinic in San Francisco. Emergency line answered 24/7, seven days a week.";
var Route$5 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: title$3 },
			{
				name: "description",
				content: description$3
			},
			{
				property: "og:title",
				content: title$3
			},
			{
				property: "og:description",
				content: description$3
			},
			{
				property: "og:url",
				content: "/contact"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$3 = () => import("./dashboard-04UglinM.js");
var Route$4 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Staff Dashboard — PawCare" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/doctors.tsx
var $$splitComponentImporter$2 = () => import("./doctors-cL8NerMu.js");
var title$2 = "Our Veterinarians — PawCare";
var description$2 = "Meet the PawCare veterinary team: internal medicine, surgery, emergency care, dentistry, dermatology and exotics specialists, with live availability.";
var Route$3 = createFileRoute("/doctors")({
	head: () => ({
		meta: [
			{ title: title$2 },
			{
				name: "description",
				content: description$2
			},
			{
				property: "og:title",
				content: title$2
			},
			{
				property: "og:description",
				content: description$2
			},
			{
				property: "og:url",
				content: "/doctors"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/doctors"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/services.tsx
var $$splitComponentImporter$1 = () => import("./services-NS-u6vpu.js");
var title$1 = "Veterinary Services — PawCare";
var description$1 = "Checkups, vaccination, surgery, emergency care, in-house laboratory, dentistry, imaging and more at PawCare Veterinary Clinic.";
var Route$2 = createFileRoute("/services")({
	head: () => ({
		meta: [
			{ title: title$1 },
			{
				name: "description",
				content: description$1
			},
			{
				property: "og:title",
				content: title$1
			},
			{
				property: "og:description",
				content: description$1
			},
			{
				property: "og:url",
				content: "/services"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "canonical",
			href: "/services"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/sitemap[.]xml.ts
var BASE_URL = "";
var Route$1 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/services",
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/doctors",
				changefreq: "monthly",
				priority: "0.8"
			},
			{
				path: "/about",
				changefreq: "yearly",
				priority: "0.6"
			},
			{
				path: "/contact",
				changefreq: "yearly",
				priority: "0.7"
			},
			{
				path: "/book",
				changefreq: "monthly",
				priority: "0.9"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
//#endregion
//#region src/routes/booking.success.tsx
var $$splitComponentImporter = () => import("./booking.success-BnMNoJVv.js");
var title = "Appointment Confirmed — PawCare";
var description = "Your PawCare veterinary appointment request has been received.";
var Route = createFileRoute("/booking/success")({
	validateSearch: (search) => ({
		pet: typeof search["pet"] === "string" ? search["pet"] : "",
		date: typeof search["date"] === "string" ? search["date"] : "",
		time: typeof search["time"] === "string" ? search["time"] : "",
		doctor: typeof search["doctor"] === "string" ? search["doctor"] : ""
	}),
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AboutRoute: Route$7.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$9
	}),
	BookRoute: Route$6.update({
		id: "/book",
		path: "/book",
		getParentRoute: () => Route$9
	}),
	ContactRoute: Route$5.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$9
	}),
	DashboardRoute: Route$4.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$9
	}),
	DoctorsRoute: Route$3.update({
		id: "/doctors",
		path: "/doctors",
		getParentRoute: () => Route$9
	}),
	ServicesRoute: Route$2.update({
		id: "/services",
		path: "/services",
		getParentRoute: () => Route$9
	}),
	SitemapDotxmlRoute: Route$1.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$9
	}),
	BookingSuccessRoute: Route.update({
		id: "/booking/success",
		path: "/booking/success",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { cn as A, TESTIMONIALS as C, upcomingAvailability as D, bookedSlotsFor as E, Button as O, STATS as S, WHY_US as T, waMeHref as _, Reveal as a, CLINIC as b, deleteRequest as c, saveService as d, setBookingStatus as f, telHref as g, getRouter, mailtoHref as h, CountUp as i, useI18n as k, deleteService as l, useClinicStore as m, Route as n, addBookingRequest as o, updateSettings as p, Route$6 as r, deleteDoctor as s, router_exports as t, saveDoctor as u, ANIMAL_TYPES as v, TIME_SLOTS as w, FAQS as x, BOOKING_STEPS as y };
