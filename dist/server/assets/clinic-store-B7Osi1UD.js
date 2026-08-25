import { i as getCookie } from "./server-C-JSWbfV.js";
import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/lib/lang-cookie.ts
var LANG_COOKIE = "paw_m_lang";
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
var LANG_KEY = "paw-m:lang";
var EN = {
	"nav.home": "Home",
	"nav.services": "Services",
	"nav.doctors": "Doctors",
	"nav.about": "About",
	"nav.contact": "Contact",
	"nav.book": "Book appointment",
	"nav.staff": "Staff dashboard",
	"nav.store": "Store",
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
	"why.eyebrow": "Why Paw-M",
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
	"dash.toast.error": "Something went wrong — please try again.",
	"dash.toast.archived": "Moved to archive.",
	"dash.toast.restored": "Restored from archive.",
	"dash.payments": "Payments",
	"dash.archive": "Archive",
	"dash.logs": "Activity log",
	"dash.checkIn": "Check in",
	"dash.checkOut": "Check out & archive",
	"dash.checkedIn": "You're checked in",
	"dash.notCheckedIn": "You're not checked in yet",
	"dash.checkedInSince": "Checked in since",
	"dash.shiftHint": "Check in at the start of your shift, then check out at the end — finished requests and orders are archived automatically.",
	"dash.shiftStarted": "Checked in. Have a great shift!",
	"dash.shiftEnded": "Shift ended — {requests} requests and {orders} orders archived.",
	"dash.shiftArchivedOnStart": "Previous shift closed — {requests} requests and {orders} orders archived.",
	"dash.pager.showing": "Showing {from}–{to} of {total}",
	"dash.pager.perPage": "per page",
	"dash.pager.prev": "Previous",
	"dash.pager.next": "Next",
	"dash.sort.newest": "Newest",
	"dash.sort.oldest": "Oldest",
	"dash.sort.name": "Name",
	"dash.sort.price": "Price",
	"dash.sort.stock": "Stock",
	"dash.sort.rating": "Rating",
	"dash.sort.amount": "Amount",
	"dash.sort.total": "Total",
	"dash.sort.date": "Date",
	"dash.sort.appointment": "Appointment",
	"dash.sort.owner": "Owner",
	"dash.sort.spec": "Specialization",
	"dash.sort.title": "Title",
	"dash.sort.recent": "Recent",
	"logs.title": "Activity log",
	"logs.desc": "Every action on the system is recorded here, newest first.",
	"logs.empty": "No activity recorded yet.",
	"logs.time": "When",
	"logs.action": "Action",
	"logs.detail": "Details",
	"dash.workdays": "Workdays",
	"dash.workdays.hint": "A folder for every day with activity — open one to see appointments, sales and payments.",
	"workdays.noDays": "No workday folders yet — start one by checking in.",
	"workdays.empty": "Nothing recorded for this day.",
	"workdays.folder": "Folder",
	"workdays.openFolder": "Open folder",
	"workdays.back": "Back to folders",
	"workdays.appointments": "Appointments",
	"workdays.sales": "Sales & orders",
	"workdays.payments": "Payments",
	"workdays.activity": "Activity",
	"workdays.revenue": "Sales",
	"workdays.paymentsReceived": "Payments received",
	"workdays.counts.apptOne": "1 appointment",
	"workdays.counts.apptMany": "{n} appointments",
	"workdays.counts.orderOne": "1 order",
	"workdays.counts.orderMany": "{n} orders",
	"workdays.counts.payOne": "1 payment",
	"workdays.counts.payMany": "{n} payments",
	"workdays.noSession": "No shift recorded",
	"workdays.sessionOpen": "Shift in progress",
	"workdays.sessionRange": "Shift {from} → {to}",
	"workdays.noActivity": "No activity in this folder.",
	"workdays.restore": "Restore",
	"dash.dayFolderSaved": "Day folder saved: {name}",
	"dash.dayFolderOpen": "Day folder open: {name}",
	"logs.action.check_in": "Checked in",
	"logs.action.check_out": "Checked out",
	"logs.action.auto_archive": "Auto-archived at shift end",
	"logs.action.login": "Staff sign-in",
	"logs.action.credentials_update": "Credentials changed",
	"logs.action.settings_update": "Settings updated",
	"logs.action.booking_status": "Request status changed",
	"logs.action.booking_archive": "Request archived",
	"logs.action.booking_restore": "Request restored",
	"logs.action.booking_delete": "Request deleted",
	"logs.action.order_status": "Order status changed",
	"logs.action.order_payment": "Order payment marked",
	"logs.action.order_archive": "Order archived",
	"logs.action.order_restore": "Order restored",
	"logs.action.order_delete": "Order deleted",
	"logs.action.payment_create": "Payment recorded",
	"logs.action.payment_update": "Payment updated",
	"logs.action.payment_delete": "Payment deleted",
	"logs.action.doctor_create": "Doctor created",
	"logs.action.doctor_update": "Doctor updated",
	"logs.action.doctor_delete": "Doctor deleted",
	"logs.action.service_create": "Service created",
	"logs.action.service_update": "Service updated",
	"logs.action.service_delete": "Service deleted",
	"logs.action.product_create": "Product created",
	"logs.action.product_update": "Product updated",
	"logs.action.product_delete": "Product deleted",
	"logs.action.review_status": "Review moderated",
	"reviews.badge.google": "Google Review",
	"reviews.googleSource": "Imported from Google Places",
	"dash.settings.googleSync": "Sync Google Reviews",
	"dash.settings.googleSyncDesc": "Import the latest customer reviews from Google Maps into this dashboard.",
	"dash.settings.googleSyncBtn": "Sync Now",
	"dash.settings.googleSyncSuccess": "Synced {synced} of {total} reviews.",
	"dash.settings.googleSyncFail": "Could not sync Google reviews — check your API key.",
	"homepage.clinicReviews.title": "What our clients say on Google",
	"homepage.clinicReviews.subtitle": "Real reviews from pet parents who trust Paw-M.",
	"homepage.clinicReviews.allReviews": "Read all reviews on Google",
	"payments.hint": "Record and track income — in-clinic payments, consultations and more.",
	"payments.add": "Add payment",
	"payments.edit": "Edit payment",
	"payments.addHint": "Record a new payment for in-clinic income.",
	"payments.editHint": "Update this payment record.",
	"payments.title": "Title",
	"payments.titlePlaceholder": "e.g. Consultation — Dr. Omar",
	"payments.amount": "Amount",
	"payments.date": "Date",
	"payments.method": "Method",
	"payments.status": "Status",
	"payments.orderId": "Order ID (optional)",
	"payments.orderIdHint": "Link to an online order, if any",
	"payments.notes": "Notes",
	"payments.notesPlaceholder": "Optional details…",
	"payments.save": "Save",
	"payments.saving": "Saving…",
	"payments.cancel": "Cancel",
	"payments.invalid": "Please enter a title and a positive amount.",
	"payments.providers": "Payment providers",
	"payments.providersDesc": "Configure how customers pay you at checkout.",
	"payments.instapay": "InstaPay account (phone number)",
	"payments.instapayHint": "Shown at checkout so customers can transfer the order total.",
	"payments.providersSave": "Save",
	"payments.configured": "Configured",
	"payments.notConfigured": "Not configured",
	"payments.fawry": "Fawry",
	"payments.fawryInfo": "References are generated automatically — no setup needed.",
	"payments.cash": "Cash on pickup",
	"payments.cashInfo": "Collected at the clinic — mark orders as paid in the Orders tab.",
	"payments.summary.collected": "Collected (total)",
	"payments.summary.pending": "Pending",
	"payments.summary.month": "Collected this month",
	"payments.summary.records": "Records",
	"archive.requests": "Archived requests",
	"archive.requestsDesc": "Old reservations kept for records.",
	"archive.orders": "Archived orders",
	"archive.ordersDesc": "Completed or cancelled store orders kept for records.",
	"archive.empty": "Nothing archived yet.",
	"archive.restore": "Restore",
	"archive.deletePermanent": "Delete permanently",
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
	"dash.products": "Products",
	"dash.products.hint": "Manage the pet supply store catalog.",
	"dash.addProduct": "Add product",
	"dash.editProduct": "Edit product",
	"dash.form.product.name": "Name",
	"dash.form.product.category": "Category",
	"dash.form.product.price": "Price",
	"dash.form.product.stock": "Stock",
	"dash.form.product.image": "Image URL",
	"dash.form.product.desc": "Description",
	"dash.form.product.featured": "Featured",
	"dash.form.product.requiredName": "Name is required.",
	"dash.form.product.requiredPrice": "Price must be a valid number.",
	"dash.form.product.requiredStock": "Stock must be a whole number.",
	"dash.orders": "Orders",
	"dash.orders.hint": "Customer orders placed from the store.",
	"auth.signIn": "Staff sign-in",
	"auth.signInDesc": "Restricted area. Sign in with your staff credentials to continue.",
	"auth.username": "Username",
	"auth.usernamePlaceholder": "e.g. admin",
	"auth.password": "Password",
	"auth.passwordPlaceholder": "••••••••",
	"auth.unlock": "Sign in",
	"auth.staff": "Staff",
	"auth.setupTitle": "Set up staff credentials",
	"auth.setupDesc": "Choose a username and password to secure the staff dashboard. You'll need them each time you sign in.",
	"auth.setupConfirm": "Confirm password",
	"auth.mismatch": "Passwords do not match.",
	"auth.usernameTooShort": "Username must be at least 3 characters.",
	"auth.passTooShort": "Password must be at least 6 characters.",
	"auth.invalidCreds": "Incorrect username or password. Try again.",
	"auth.locked": "Too many attempts. Try again in {minutes}m.",
	"auth.signOut": "Sign out",
	"auth.changeCredentials": "Change credentials",
	"auth.changeCredentialsDesc": "Update your staff sign-in details. Leave a field empty to keep it unchanged.",
	"auth.currentPassword": "Current password",
	"auth.newUsername": "New username",
	"auth.newPassword": "New password",
	"auth.confirmNewPassword": "Confirm new password",
	"auth.nothingToChange": "Enter a new username or password.",
	"auth.credsChanged": "Credentials changed.",
	"auth.wrongCurrent": "Current password is incorrect.",
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
	"booking.pet.age": "Age",
	"booking.pet.weight": "Weight",
	"booking.pet.otherType": "Other type",
	"booking.ph.otherPetType": "Specify other pet type",
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
	"booking.error.failed": "Something went wrong while submitting. Please try again.",
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
	"footer.about": "About Paw-M",
	"footer.contact": "Contact",
	"page.services.eyebrow": "Services",
	"page.services.title": "Clinical services, end to end",
	"page.services.desc": "Twelve service lines, one medical record. Whatever your pet needs next, the team already has the history.",
	"page.doctors.eyebrow": "Our team",
	"page.doctors.title": "Fourteen clinicians. One shared chart.",
	"page.doctors.desc": "Each veterinarian leads a specialty, and complex cases are reviewed together before a plan is signed off.",
	"page.about.eyebrow": "About",
	"page.about.title": "A medical practice that happens to treat animals",
	"page.about.desc": "Paw-M opened in 2016 with six clinicians and one rule: never send an owner home without an explanation they understood.",
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
	"whyitem.4.detail": "Care plans built around your pet's age and history — not a template.",
	"whyitem.5.title": "Digital medical records",
	"whyitem.5.detail": "Your pet's complete chart, available to you and any clinic you choose.",
	"step.0.title": "Choose a date",
	"step.0.detail": "Live availability across every clinician.",
	"step.1.title": "Pick a time",
	"step.1.detail": "Booked slots disappear as you look.",
	"step.2.title": "Tell us about your pet",
	"step.2.detail": "Species, age, weight, history.",
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
	"doc.dr-mirna.name": "Dr. Mirna",
	"doc.dr-mirna.spec": "Veterinarian",
	"doc.dr-mirna.exp": "10+ years",
	"doc.dr-mirna.bio": "Experienced veterinarian trusted by hundreds of pet owners across the region.",
	"doc.dr-mirna.tag.0": "Veterinary Consultation",
	"doc.dr-mirna.tag.1": "Surgery",
	"doc.dr-mirna.tag.2": "Spaying & Neutering",
	"doc.dr-mirna.tag.3": "Dental Care",
	"doc.dr-mirna.tag.4": "Exotics",
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
	"contact.map": "Paw-M clinic location map",
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
	"header.homeAria": "Paw-M home",
	"header.mainAria": "Main",
	"header.lightMode": "Switch to light mode",
	"header.darkMode": "Switch to dark mode",
	"header.closeMenu": "Close menu",
	"header.openMenu": "Open menu",
	"header.mobileAria": "Mobile",
	"header.cartAria": "Open cart",
	"footer.rights": "Veterinary Clinic. All rights reserved.",
	"footer.readyTitle": "Ready to give your pet the best care?",
	"footer.readyDesc": "Book an appointment with our team today.",
	"footer.bookVisit": "Book a visit",
	"footer.marquee.0": "AAHA accredited",
	"footer.marquee.1": "Fear Free certified",
	"footer.marquee.2": "ISO 9001 quality managed",
	"footer.marquee.3": "24/7 emergency care",
	"footer.marquee.4": "Certified veterinarians",
	"intro.tagline": "Veterinary care, quietly excellent.",
	"intro.skip": "Press any key to skip",
	"intro.loadingAria": "Paw-M is loading",
	"success.calendarTitle": "Paw-M appointment",
	"success.icsSummary": "Paw-M appointment",
	"page.store.eyebrow": "Pet supply store",
	"page.store.title": "Everything your pet needs",
	"page.store.desc": "Food, treats, toys, grooming and health essentials — delivered by Paw-M.",
	"store.search": "Search products…",
	"store.all": "All",
	"store.addToCart": "Add to cart",
	"store.added": "Added to cart.",
	"store.outOfStock": "Out of stock",
	"store.featured": "Featured",
	"store.loading": "Loading products…",
	"store.empty": "No products match your search.",
	"store.inStock": "In stock",
	"store.decreaseQty": "Decrease quantity",
	"store.increaseQty": "Increase quantity",
	"store.quantity": "Quantity",
	"store.related": "Related products",
	"store.collectHint": "Delivery and pickup details will be confirmed after your order.",
	"store.contactUs": "Questions? Contact us",
	"store.back": "Back to store",
	"store.sortLabel": "Sort by",
	"store.sort.featured": "Featured",
	"store.sort.newest": "Newest",
	"store.sort.priceAsc": "Price: Low to High",
	"store.sort.priceDesc": "Price: High to Low",
	"store.sort.name": "Name A–Z",
	"store.pet.all": "All pets",
	"store.pet.dog": "For dogs",
	"store.pet.cat": "For cats",
	"store.pet.both": "Dogs & cats",
	"store.sale": "Sale",
	"store.showing": "Showing {count} of {total} products",
	"wishlist.add": "Add to wishlist",
	"wishlist.remove": "Remove from wishlist",
	"wishlist.added": "Added to wishlist.",
	"wishlist.removed": "Removed from wishlist.",
	"page.wishlist.eyebrow": "Saved for later",
	"page.wishlist.title": "Your wishlist",
	"page.wishlist.desc": "All the products you saved — back in one place.",
	"store.wishlistEmpty": "Your wishlist is empty — tap the heart on any product to save it.",
	"store.wishlistBrowse": "Browse the store",
	"header.wishlistAria": "Wishlist",
	"reviews.title": "Reviews",
	"reviews.count": "reviews",
	"reviews.none": "No reviews yet — be the first!",
	"reviews.writeTitle": "Write a review",
	"reviews.writeDesc": "Share your experience. Reviews appear once approved by our team.",
	"reviews.rating": "Your rating",
	"reviews.stars": "stars",
	"reviews.name": "Your name",
	"reviews.namePlaceholder": "e.g. Alex Moreno",
	"reviews.comment": "Your review",
	"reviews.commentPlaceholder": "How was the product for your pet?",
	"reviews.submit": "Submit review",
	"reviews.required": "Please add your name and a review of at least 4 characters.",
	"reviews.thanks": "Thanks for your review!",
	"reviews.failed": "Could not submit the review.",
	"reviews.sent": "Review submitted — it will appear once our team approves it.",
	"checkout.paymentMethod": "Payment method",
	"checkout.method.cash.title": "Cash at the clinic",
	"checkout.method.cash.desc": "Pay in person when you pick up your order at the clinic.",
	"checkout.method.cash.short": "Cash",
	"checkout.method.fawry.title": "Fawry",
	"checkout.method.fawry.desc": "Pay at any Fawry outlet or machine — Visa/card accepted.",
	"checkout.method.fawry.short": "Fawry",
	"checkout.method.instapay.title": "InstaPay",
	"checkout.method.instapay.desc": "Instant transfer to our InstaPay account, proof required.",
	"checkout.method.instapay.short": "InstaPay",
	"checkout.fawryHowTitle": "How Fawry payment works",
	"checkout.fawryHow": "After placing the order you get a Fawry reference. Pay with it at any Fawry outlet, Fawry machine (Visa/card accepted), or via the Fawry app. Then confirm the payment from your tracking page.",
	"checkout.fawryRefTitle": "Your Fawry payment reference",
	"checkout.fawrySteps": "Use this reference at any Fawry outlet or machine to pay (Visa accepted). Confirm payment from your tracking page.",
	"checkout.instapayMissing": "InstaPay number not set yet — please contact the clinic.",
	"checkout.instapayHint": "Send the exact order total to this InstaPay account, then add the transaction reference and a screenshot of the payment below.",
	"checkout.instapaySteps": "Send the order total to this InstaPay account, then upload the proof from your tracking page. Orders are confirmed once payment is verified.",
	"checkout.refNumber": "Transaction reference number",
	"checkout.refPlaceholder": "e.g. 123456789",
	"checkout.proofImage": "Payment screenshot (optional now)",
	"checkout.uploadProof": "Upload payment screenshot",
	"checkout.imageChosen": "Screenshot added ✓",
	"checkout.imageError": "Could not read the image (max 4 MB).",
	"checkout.proofLater": "You can also upload it later from the tracking page.",
	"checkout.paymentNote": "Orders are confirmed once payment is received or verified. Pickup and delivery are arranged by our team.",
	"checkout.cashNote": "Pay in cash when you collect your order at the clinic.",
	"checkout.trackOrder": "Track order",
	"checkout.instapayNotConfigured": "InstaPay is not configured yet — choose another method.",
	"pay.paid": "Paid",
	"pay.unpaid": "Unpaid",
	"pay.underReview": "Proof under review",
	"track.title": "Track your order",
	"track.desc": "Enter the order ID and the phone number used at checkout.",
	"track.orderId": "Order ID",
	"track.phone": "Phone number",
	"track.lookup": "Look up order",
	"track.required": "Enter both the order ID and your phone number.",
	"track.notFound": "No order matches that ID and phone number.",
	"track.help": "Need help? Contact reception with your order ID.",
	"track.fawryRef": "Fawry reference",
	"track.proofTitle": "Confirm your payment",
	"track.fawryProofDesc": "Paid via Fawry? Enter the receipt number shown on your Fawry receipt.",
	"track.instapayProofDesc": "Paid via InstaPay? Enter the transaction reference and attach a screenshot.",
	"track.refNumber": "Reference / receipt number",
	"track.sendProof": "Send proof",
	"track.proofRequired": "Add the transaction reference or a screenshot.",
	"track.refRequired": "Enter the reference number from your Fawry receipt.",
	"track.proofSent": "Proof sent — our team will verify it shortly.",
	"track.failed": "Could not send the proof.",
	"track.proofImageAlt": "Payment proof screenshot",
	"home.shop.eyebrow": "Paw-M store",
	"home.shop.title": "Shop the store",
	"home.shop.desc": "Food, treats, toys and health essentials — hand-picked by our vets.",
	"home.shop.browse": "Browse all products",
	"dash.lowStock": "Low stock",
	"dash.markPaid": "Mark paid",
	"dash.viewProof": "View proof",
	"dash.paymentProof": "Payment proof",
	"dash.noImage": "Reference only — no image uploaded.",
	"dash.toast.paid": "Order marked as paid.",
	"dash.reviews": "Reviews",
	"dash.reviews.hint": "Approve or remove customer product reviews.",
	"dash.reviews.pending": "Pending approval",
	"dash.reviews.approved": "Approved",
	"dash.reviews.rejected": "Rejected",
	"dash.reviews.approve": "Approve",
	"dash.form.product.compare": "Compare-at price (sale)",
	"dash.form.product.comparePlaceholder": "Leave empty for no discount",
	"dash.form.product.requiredCompare": "Compare-at price must be ≥ the sale price.",
	"dash.form.product.petType": "For which pets",
	"dash.settings.currency": "Currency symbol",
	"dash.settings.currencyEmpty": "Currency symbol cannot be empty.",
	"dash.settings.instapay": "InstaPay account (phone number)",
	"store.cat.food": "Food",
	"store.cat.treats": "Treats",
	"store.cat.toys": "Toys",
	"store.cat.grooming": "Grooming",
	"store.cat.health": "Health",
	"store.cat.accessories": "Accessories",
	"cart.title": "Your cart",
	"cart.empty": "Your cart is empty.",
	"cart.total": "Total",
	"cart.remove": "Remove item",
	"cart.checkout": "Checkout",
	"cart.continue": "Continue shopping",
	"checkout.title": "Checkout",
	"checkout.desc": "Tell us where to send your order.",
	"checkout.name": "Full name",
	"checkout.phone": "Phone",
	"checkout.email": "Email",
	"checkout.address": "Delivery address",
	"checkout.placeOrder": "Place order",
	"checkout.required": "Please fill in all fields.",
	"checkout.failed": "Could not place the order. Try again.",
	"checkout.successTitle": "Order received!",
	"checkout.successDesc": "Thanks for shopping with Paw-M. Our team will contact you shortly to confirm delivery.",
	"checkout.orderId": "Order ID",
	"checkout.continueShopping": "Continue shopping",
	"checkout.goHome": "Back to home",
	"dash.defaultDays": "Mon, Tue, Wed, Thu, Fri, Sat",
	"dash.xAria": "Close",
	"img.hero": "A veterinarian examining a golden retriever in a bright consultation room",
	"img.clinic": "Diagnostic imaging equipment inside the Paw-M clinic",
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
		"nav.store": "المتجر",
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
		"why.eyebrow": "لماذا باو-إم",
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
		"dash.toast.completed": "تم وضع علامة اكتمال على الزيارة.",
		"dash.toast.cancelled": "تم إلغاء الحجز.",
		"dash.toast.deleted": "تم الحذف.",
		"dash.toast.saved": "تم الحفظ.",
		"dash.toast.error": "حدث خطأ ما — حاول مرة أخرى.",
		"dash.toast.archived": "تم النقل إلى الأرشيف.",
		"dash.toast.restored": "تمت الاستعادة من الأرشيف.",
		"dash.payments": "المدفوعات",
		"dash.archive": "الأرشيف",
		"dash.logs": "سجل النشاط",
		"dash.pager.showing": "عرض {from}–{to} من أصل {total}",
		"dash.pager.perPage": "في الصفحة",
		"dash.pager.prev": "السابق",
		"dash.pager.next": "التالي",
		"dash.sort.newest": "الأحدث",
		"dash.sort.oldest": "الأقدم",
		"dash.sort.name": "الاسم",
		"dash.sort.price": "السعر",
		"dash.sort.stock": "المخزون",
		"dash.sort.rating": "التقييم",
		"dash.sort.amount": "المبلغ",
		"dash.sort.total": "الإجمالي",
		"dash.sort.date": "التاريخ",
		"dash.sort.appointment": "الموعد",
		"dash.sort.owner": "العميل",
		"dash.sort.spec": "التخصص",
		"dash.sort.title": "العنوان",
		"dash.sort.recent": "الأحدث",
		"dash.checkIn": "تسجيل الدخول للوردية",
		"dash.checkOut": "إنهاء الوردية والأرشفة",
		"dash.checkedIn": "أنت مسجّل في الوردية",
		"dash.notCheckedIn": "لم تسجّل دخولك بعد",
		"dash.checkedInSince": "مسجّل منذ",
		"dash.shiftHint": "سجّل دخولك في بداية الوردية ثم أنهِها في النهاية — تُؤرشف الطلبات والطلبات المكتملة تلقائيًا.",
		"dash.shiftStarted": "تم تسجيل الدخول. وردية سعيدة!",
		"dash.shiftEnded": "انتهت الوردية — تم أرشفة {requests} طلب و {orders} طلب شراء.",
		"dash.shiftArchivedOnStart": "أُغلقت الوردية السابقة — تم أرشفة {requests} طلب و {orders} طلب شراء.",
		"logs.title": "سجل النشاط",
		"logs.desc": "يُسجَّل كل إجراء في النظام هنا، الأحدث أولًا.",
		"logs.empty": "لا يوجد نشاط مسجّل بعد.",
		"logs.time": "الوقت",
		"logs.action": "الإجراء",
		"logs.detail": "التفاصيل",
		"dash.workdays": "أيام العمل",
		"dash.workdays.hint": "مجلد لكل يوم فيه نشاط — افتحه لترى المواعيد والمبيعات والمدفوعات.",
		"workdays.noDays": "لا توجد مجلدات أيام عمل بعد — ابدأ يومًا بتسجيل الدخول.",
		"workdays.empty": "لا يوجد شيء مسجّل في هذا اليوم.",
		"workdays.folder": "المجلد",
		"workdays.openFolder": "فتح المجلد",
		"workdays.back": "العودة إلى المجلدات",
		"workdays.appointments": "المواعيد",
		"workdays.sales": "المبيعات والطلبات",
		"workdays.payments": "المدفوعات",
		"workdays.activity": "النشاط",
		"workdays.revenue": "المبيعات",
		"workdays.paymentsReceived": "المدفوعات المستلمة",
		"workdays.counts.apptOne": "موعد واحد",
		"workdays.counts.apptMany": "{n} مواعيد",
		"workdays.counts.orderOne": "طلب واحد",
		"workdays.counts.orderMany": "{n} طلبات",
		"workdays.counts.payOne": "دفعة واحدة",
		"workdays.counts.payMany": "{n} مدفوعات",
		"workdays.noSession": "لا يوجد تسجيل وردية",
		"workdays.sessionOpen": "الوردية جارية",
		"workdays.sessionRange": "الوردية {from} ← {to}",
		"workdays.noActivity": "لا يوجد نشاط في هذا المجلد.",
		"workdays.restore": "استعادة",
		"dash.dayFolderSaved": "تم حفظ مجلد اليوم: {name}",
		"dash.dayFolderOpen": "مجلد اليوم مفتوح: {name}",
		"logs.action.check_in": "تسجيل دخول الوردية",
		"logs.action.check_out": "إنهاء الوردية",
		"logs.action.auto_archive": "أرشفة تلقائية نهاية الوردية",
		"logs.action.login": "تسجيل دخول الموظف",
		"logs.action.credentials_update": "تغيير بيانات الدخول",
		"logs.action.settings_update": "تحديث الإعدادات",
		"logs.action.booking_status": "تغيير حالة الطلب",
		"logs.action.booking_archive": "أرشفة طلب",
		"logs.action.booking_restore": "استعادة طلب",
		"logs.action.booking_delete": "حذف طلب",
		"logs.action.order_status": "تغيير حالة طلب شراء",
		"logs.action.order_payment": "تحديد حالة دفع الطلب",
		"logs.action.order_archive": "أرشفة طلب شراء",
		"logs.action.order_restore": "استعادة طلب شراء",
		"logs.action.order_delete": "حذف طلب شراء",
		"logs.action.payment_create": "تسجيل دفعة",
		"logs.action.payment_update": "تعديل دفعة",
		"logs.action.payment_delete": "حذف دفعة",
		"logs.action.doctor_create": "إضافة طبيب",
		"logs.action.doctor_update": "تعديل طبيب",
		"logs.action.doctor_delete": "حذف طبيب",
		"logs.action.service_create": "إضافة خدمة",
		"logs.action.service_update": "تعديل خدمة",
		"logs.action.service_delete": "حذف خدمة",
		"logs.action.product_create": "إضافة منتج",
		"logs.action.product_update": "تعديل منتج",
		"logs.action.product_delete": "حذف منتج",
		"logs.action.review_status": "إدارة التقييمات",
		"reviews.badge.google": "تقييم Google",
		"reviews.googleSource": "مستورد من Google Places",
		"dash.settings.googleSync": "مزامنة تقييمات Google",
		"dash.settings.googleSyncDesc": "استيراد آخر تقييمات العملاء من Google Maps إلى لوحة التحكم.",
		"dash.settings.googleSyncBtn": "مزامنة الآن",
		"dash.settings.googleSyncSuccess": "تم مزامنة {synced} من {total} تقييم.",
		"dash.settings.googleSyncFail": "تعذرت مزامنة تقييمات Google — تحقق من مفتاح API.",
		"homepage.clinicReviews.title": "آراء عملائنا على Google",
		"homepage.clinicReviews.subtitle": "آراء حقيقية من أصحاب الحيوانات الذين يثقون في Paw-M.",
		"homepage.clinicReviews.allReviews": "قراءة جميع التقييمات على Google",
		"payments.hint": "سجّل وتابع الدخل — مدفوعات العيادة والاستشارات وغيرها.",
		"payments.add": "إضافة دفعة",
		"payments.edit": "تعديل دفعة",
		"payments.addHint": "سجّل دفعة جديدة للدخل داخل العيادة.",
		"payments.editHint": "حدّث سجل الدفعة.",
		"payments.title": "العنوان",
		"payments.titlePlaceholder": "مثال: استشارة — د. عمر",
		"payments.amount": "المبلغ",
		"payments.date": "التاريخ",
		"payments.method": "الطريقة",
		"payments.status": "الحالة",
		"payments.orderId": "رقم الطلب (اختياري)",
		"payments.orderIdHint": "اربطه بطلب عبر المتجر إن وُجد",
		"payments.notes": "ملاحظات",
		"payments.notesPlaceholder": "تفاصيل إضافية…",
		"payments.save": "حفظ",
		"payments.saving": "جارٍ الحفظ…",
		"payments.cancel": "إلغاء",
		"payments.invalid": "أدخل عنوانًا ومبلغًا موجبًا.",
		"payments.providers": "مزودو الدفع",
		"payments.providersDesc": "اضبط طرق الدفع التي يراها العملاء عند إتمام الطلب.",
		"payments.instapay": "حساب انستاباي (رقم الهاتف)",
		"payments.instapayHint": "يظهر عند الدفع ليحوّل العميل قيمة الطلب.",
		"payments.providersSave": "حفظ",
		"payments.configured": "مضبوط",
		"payments.notConfigured": "غير مضبوط",
		"payments.fawry": "فوري",
		"payments.fawryInfo": "تُولَّد الأكواد تلقائيًا — لا يحتاج إعدادًا.",
		"payments.cash": "الدفع نقدًا عند الاستلام",
		"payments.cashInfo": "يُحصَّل في العيادة — سجّل الطلب كمدفوع من تبويب الطلبات.",
		"payments.summary.collected": "المحصَّل (الإجمالي)",
		"payments.summary.pending": "قيد الانتظار",
		"payments.summary.month": "المحصَّل هذا الشهر",
		"payments.summary.records": "السجلات",
		"archive.requests": "طلبات مؤرشفة",
		"archive.requestsDesc": "حجوزات قديمة محفوظة للسجلات.",
		"archive.orders": "طلبات مؤرشفة",
		"archive.ordersDesc": "طلبات متجر مكتملة أو ملغاة محفوظة للسجلات.",
		"archive.empty": "لا يوجد شيء في الأرشيف بعد.",
		"archive.restore": "استعادة",
		"archive.deletePermanent": "حذف نهائي",
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
		"dash.products": "المنتجات",
		"dash.products.hint": "إدارة كتالوج متجر مستلزمات الحيوانات.",
		"dash.addProduct": "إضافة منتج",
		"dash.editProduct": "تعديل المنتج",
		"dash.form.product.name": "الاسم",
		"dash.form.product.category": "الفئة",
		"dash.form.product.price": "السعر",
		"dash.form.product.stock": "المخزون",
		"dash.form.product.image": "رابط الصورة",
		"dash.form.product.desc": "الوصف",
		"dash.form.product.featured": "مميز",
		"dash.form.product.requiredName": "الاسم مطلوب.",
		"dash.form.product.requiredPrice": "يجب أن يكون السعر رقمًا صحيحًا.",
		"dash.form.product.requiredStock": "يجب أن يكون المخزون رقمًا صحيحًا.",
		"dash.orders": "الطلبات",
		"dash.orders.hint": "طلبات العملاء من المتجر.",
		"auth.signIn": "دخول الموظفين",
		"auth.signInDesc": "منطقة محظورة. سجّل دخولك ببيانات الموظفين للمتابعة.",
		"auth.username": "اسم المستخدم",
		"auth.usernamePlaceholder": "مثال: admin",
		"auth.password": "كلمة المرور",
		"auth.passwordPlaceholder": "••••••••",
		"auth.unlock": "تسجيل الدخول",
		"auth.staff": "موظف",
		"auth.setupTitle": "إعداد بيانات الموظفين",
		"auth.setupDesc": "اختر اسم مستخدم وكلمة مرور لتأمين لوحة الموظفين. ستحتاجهما في كل مرة تدخل فيها.",
		"auth.setupConfirm": "تأكيد كلمة المرور",
		"auth.mismatch": "كلمتا المرور غير متطابقتين.",
		"auth.usernameTooShort": "يجب ألا يقل اسم المستخدم عن 3 أحرف.",
		"auth.passTooShort": "يجب ألا تقل كلمة المرور عن 6 أحرف.",
		"auth.invalidCreds": "اسم المستخدم أو كلمة المرور غير صحيحة. حاول مجدداً.",
		"auth.locked": "محاولات كثيرة. حاول بعد {minutes} دقيقة.",
		"auth.signOut": "تسجيل الخروج",
		"auth.changeCredentials": "تغيير بيانات الدخول",
		"auth.changeCredentialsDesc": "حدّث بيانات دخول الموظفين. اترك الحقل فارغاً للإبقاء عليه دون تغيير.",
		"auth.currentPassword": "كلمة المرور الحالية",
		"auth.newUsername": "اسم المستخدم الجديد",
		"auth.newPassword": "كلمة المرور الجديدة",
		"auth.confirmNewPassword": "تأكيد كلمة المرور الجديدة",
		"auth.nothingToChange": "أدخل اسم مستخدم أو كلمة مرور جديدة.",
		"auth.credsChanged": "تم تغيير بيانات الدخول.",
		"auth.wrongCurrent": "كلمة المرور الحالية غير صحيحة.",
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
		"booking.pet.age": "العمر",
		"booking.pet.weight": "الوزن",
		"booking.pet.otherType": "نوع آخر",
		"booking.ph.otherPetType": "حدد نوع الحيوان الآخر",
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
		"booking.error.failed": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
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
		"footer.about": "حول باو-إم",
		"footer.contact": "اتصل بنا",
		"footer.accred": "معتمد من AAHA · معتمد من Fear Free · إدارة جودة وفق ISO 9001",
		"page.services.eyebrow": "الخدمات",
		"page.services.title": "خدمات سريرية متكاملة",
		"page.services.desc": "اثنتا عشرة خدمة في ملف طبي واحد. مهما كان ما يحتاجه حيوانك، فإن الفريق يعرف تاريخه الكامل.",
		"page.doctors.eyebrow": "فريقنا",
		"page.doctors.title": "أربعة عشر طبيباً بيطرياً. ملف طبي مشترك.",
		"page.doctors.desc": "يترأس كل طبيب تخصصًا محددًا، وتُراجع الحالات المعقدة معًا قبل اعتماد أي خطة علاج.",
		"page.about.eyebrow": "حول باو-إم",
		"page.about.title": "ممارسة طبية تصادف أنها تعالج الحيوانات",
		"page.about.desc": "افتتحت باو-إم في عام 2016 بستة أطباء وقاعدة واحدة: لا يُرسَل صاحب حيوان إلى منزله دون شرح مفهوم.",
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
		"doc.dr-mirna.name": "د. ميرنا",
		"doc.dr-mirna.spec": "طبيب بيطري",
		"doc.dr-mirna.exp": "أكثر من 10 سنوات",
		"doc.dr-mirna.bio": "طبيب بيطري ذو خبرة موثوق من قبل مئات أصحاب الحيوانات الأليفة في جميع أنحاء المنطقة.",
		"doc.dr-mirna.tag.0": "استشارات بيطرية",
		"doc.dr-mirna.tag.1": "جراحة",
		"doc.dr-mirna.tag.2": "تعقيم",
		"doc.dr-mirna.tag.3": "العناية بالأسنان",
		"doc.dr-mirna.tag.4": "حيوانات غريبة",
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
		"contact.map": "موقع عيادة باو-إم",
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
		"header.homeAria": "باو-إم الرئيسية",
		"header.mainAria": "القائمة الرئيسية",
		"header.lightMode": "التبديل إلى الوضع الفاتح",
		"header.darkMode": "التبديل إلى الوضع الداكن",
		"header.closeMenu": "إغلاق القائمة",
		"header.openMenu": "فتح القائمة",
		"header.mobileAria": "القائمة الجوالة",
		"header.cartAria": "فتح السلة",
		"footer.rights": "العيادة البيطرية. جميع الحقوق محفوظة.",
		"footer.readyTitle": "هل أنت مستعد لأفضل رعاية لحيوانك؟",
		"footer.readyDesc": "احجز موعدًا مع فريقنا اليوم.",
		"footer.bookVisit": "احجز زيارة",
		"footer.marquee.0": "معتمد من AAHA",
		"footer.marquee.1": "معتمد من Fear Free",
		"footer.marquee.2": "جودة وفق ISO 9001",
		"footer.marquee.3": "طوارئ على مدار الساعة",
		"footer.marquee.4": "أطباء بيطريون معتمدون",
		"intro.tagline": "رعاية بيطرية، بامتياز هادئ.",
		"intro.skip": "اضغط أي مفتاح للتخطي",
		"intro.loadingAria": "باو-إم قيد التحميل",
		"success.calendarTitle": "موعد باومي",
		"success.icsSummary": "موعد باومي",
		"page.store.eyebrow": "متجر مستلزمات الحيوانات",
		"page.store.title": "كل ما يحتاجه حيوانك الأليف",
		"page.store.desc": "أطعمة، مكافآت، ألعاب، عناية وصحة — من باومي.",
		"store.search": "ابحث عن منتج…",
		"store.all": "الكل",
		"store.addToCart": "أضف إلى السلة",
		"store.added": "تمت الإضافة إلى السلة.",
		"store.outOfStock": "غير متوفر",
		"store.featured": "مميز",
		"store.loading": "جارٍ تحميل المنتجات…",
		"store.empty": "لا توجد منتجات مطابقة لبحثك.",
		"store.inStock": "متوفر",
		"store.decreaseQty": "تقليل الكمية",
		"store.increaseQty": "زيادة الكمية",
		"store.quantity": "الكمية",
		"store.related": "منتجات مشابهة",
		"store.collectHint": "سيتم تأكيد تفاصيل التوصيل بعد تقديم الطلب.",
		"store.contactUs": "لديك أسئلة؟ تواصل معنا",
		"store.back": "العودة إلى المتجر",
		"store.sortLabel": "ترتيب حسب",
		"store.sort.featured": "المميز",
		"store.sort.newest": "الأحدث",
		"store.sort.priceAsc": "السعر: من الأقل إلى الأعلى",
		"store.sort.priceDesc": "السعر: من الأعلى إلى الأقل",
		"store.sort.name": "الاسم أ–ي",
		"store.pet.all": "جميع الحيوانات",
		"store.pet.dog": "للكلاب",
		"store.pet.cat": "للقطط",
		"store.pet.both": "كلاب وقطط",
		"store.sale": "خصم",
		"store.showing": "عرض {count} من {total} منتج",
		"wishlist.add": "أضف إلى المفضلة",
		"wishlist.remove": "إزالة من المفضلة",
		"wishlist.added": "تمت الإضافة إلى المفضلة.",
		"wishlist.removed": "تمت الإزالة من المفضلة.",
		"page.wishlist.eyebrow": "محفوظة لاحقًا",
		"page.wishlist.title": "قائمة المفضلة",
		"page.wishlist.desc": "كل المنتجات التي حفظتها — في مكان واحد.",
		"store.wishlistEmpty": "قائمة المفضلة فارغة — اضغط على القلب في أي منتج لحفظه.",
		"store.wishlistBrowse": "تصفح المتجر",
		"header.wishlistAria": "المفضلة",
		"reviews.title": "التقييمات",
		"reviews.count": "تقييم",
		"reviews.none": "لا توجد تقييمات بعد — كن أول من يقيّم!",
		"reviews.writeTitle": "اكتب تقييمًا",
		"reviews.writeDesc": "شارك تجربتك. تظهر التقييمات بعد موافقة فريقنا.",
		"reviews.rating": "تقييمك",
		"reviews.stars": "نجوم",
		"reviews.name": "اسمك",
		"reviews.namePlaceholder": "مثال: أحمد منصور",
		"reviews.comment": "تقييمك",
		"reviews.commentPlaceholder": "كيف كان المنتج بالنسبة لحيوانك؟",
		"reviews.submit": "إرسال التقييم",
		"reviews.required": "يرجى إضافة اسمك وتقييم لا يقل عن 4 أحرف.",
		"reviews.thanks": "شكرًا لتقييمك!",
		"reviews.failed": "تعذر إرسال التقييم.",
		"reviews.sent": "تم إرسال التقييم — سيظهر بعد موافقة فريقنا.",
		"checkout.paymentMethod": "طريقة الدفع",
		"checkout.method.cash.title": "نقدًا في العيادة",
		"checkout.method.cash.desc": "ادفع نقدًا عند استلام طلبك من العيادة.",
		"checkout.method.cash.short": "نقدًا",
		"checkout.method.fawry.title": "فوري",
		"checkout.method.fawry.desc": "ادفع في أي منفذ أو ماكينة فوري — بطاقات فيزا مقبولة.",
		"checkout.method.fawry.short": "فوري",
		"checkout.method.instapay.title": "انستاباي",
		"checkout.method.instapay.desc": "تحويل فوري إلى حساب انستاباي الخاص بنا، مع إثبات الدفع.",
		"checkout.method.instapay.short": "انستاباي",
		"checkout.fawryHowTitle": "كيف يعمل الدفع عبر فوري",
		"checkout.fawryHow": "بعد تأكيد الطلب ستحصل على كود مرجعي لفوري. ادفع به في أي منفذ أو ماكينة فوري (فيزا مقبولة) أو عبر تطبيق فوري، ثم أكّد الدفع من صفحة تتبع الطلب.",
		"checkout.fawryRefTitle": "الكود المرجعي للدفع عبر فوري",
		"checkout.fawrySteps": "استخدم هذا الكود في أي منفذ أو ماكينة فوري للدفع (فيزا مقبولة). أكّد الدفع من صفحة تتبع الطلب.",
		"checkout.instapayMissing": "رقم انستاباي غير مضبوط بعد — يرجى التواصل مع العيادة.",
		"checkout.instapayHint": "حوّل إجمالي الطلب إلى حساب انستاباي هذا، ثم أضف رقم العملية ولقطة من الدفع أدناه.",
		"checkout.instapaySteps": "حوّل إجمالي الطلب إلى حساب انستاباي هذا، ثم ارفع الإثبات من صفحة تتبع الطلب. يُؤكد الطلب بعد التحقق من الدفع.",
		"checkout.refNumber": "رقم مرجع العملية",
		"checkout.refPlaceholder": "مثال: 123456789",
		"checkout.proofImage": "لقطة الدفع (اختيارية الآن)",
		"checkout.uploadProof": "ارفع لقطة الدفع",
		"checkout.imageChosen": "تمت إضافة اللقطة ✓",
		"checkout.imageError": "تعذر قراءة الصورة (الحد الأقصى 4 ميجابايت).",
		"checkout.proofLater": "يمكنك أيضًا رفعها لاحقًا من صفحة تتبع الطلب.",
		"checkout.paymentNote": "يُؤكد الطلب بعد استلام الدفع أو التحقق منه. يتم الترتيب للاستلام والتوصيل بواسطة فريقنا.",
		"checkout.cashNote": "ادفع نقدًا عند استلام طلبك من العيادة.",
		"checkout.trackOrder": "تتبع الطلب",
		"checkout.instapayNotConfigured": "انستاباي غير مضبوط بعد — اختر طريقة أخرى.",
		"pay.paid": "مدفوع",
		"pay.unpaid": "غير مدفوع",
		"pay.underReview": "الإثبات قيد المراجعة",
		"track.title": "تتبع طلبك",
		"track.desc": "أدخل رقم الطلب ورقم الهاتف المستخدم عند إتمام الشراء.",
		"track.orderId": "رقم الطلب",
		"track.phone": "رقم الهاتف",
		"track.lookup": "البحث عن الطلب",
		"track.required": "أدخل رقم الطلب ورقم هاتفك.",
		"track.notFound": "لا يوجد طلب مطابق لهذا الرقم والهاتف.",
		"track.help": "تحتاج مساعدة؟ تواصل مع الاستقبال مع ذكر رقم الطلب.",
		"track.fawryRef": "مرجع فوري",
		"track.proofTitle": "أكّد دفعتك",
		"track.fawryProofDesc": "دفعت عبر فوري؟ أدخل رقم الإيصال الظاهر على إيصال فوري.",
		"track.instapayProofDesc": "دفعت عبر انستاباي؟ أدخل رقم العملية وأرفق لقطة شاشة.",
		"track.refNumber": "رقم المرجع / الإيصال",
		"track.sendProof": "إرسال الإثبات",
		"track.proofRequired": "أضف رقم العملية أو لقطة الدفع.",
		"track.refRequired": "أدخل رقم المرجع من إيصال فوري.",
		"track.proofSent": "تم إرسال الإثبات — سيتحقق منه فريقنا قريبًا.",
		"track.failed": "تعذر إرسال الإثبات.",
		"track.proofImageAlt": "لقطة إثبات الدفع",
		"home.shop.eyebrow": "متجر باومي",
		"home.shop.title": "تسوق من المتجر",
		"home.shop.desc": "أطعمة ومكافآت وألعاب ومستلزمات صحية — باختيار أطبائنا.",
		"home.shop.browse": "تصفح جميع المنتجات",
		"dash.lowStock": "مخزون منخفض",
		"dash.markPaid": "تحديد كمدفوع",
		"dash.viewProof": "عرض الإثبات",
		"dash.paymentProof": "إثبات الدفع",
		"dash.noImage": "مرجع فقط — لم تُرفع صورة.",
		"dash.toast.paid": "تم تحديد الطلب كمدفوع.",
		"dash.reviews": "التقييمات",
		"dash.reviews.hint": "وافق أو أزل تقييمات العملاء للمنتجات.",
		"dash.reviews.pending": "بانتظار الموافقة",
		"dash.reviews.approved": "مقبولة",
		"dash.reviews.rejected": "مرفوضة",
		"dash.reviews.approve": "موافقة",
		"dash.form.product.compare": "السعر قبل الخصم",
		"dash.form.product.comparePlaceholder": "اتركه فارغًا بدون خصم",
		"dash.form.product.requiredCompare": "يجب أن يكون السعر قبل الخصم أكبر من أو يساوي سعر البيع.",
		"dash.form.product.petType": "لأي حيوان",
		"dash.settings.currency": "رمز العملة",
		"dash.settings.currencyEmpty": "رمز العملة لا يمكن أن يكون فارغًا.",
		"dash.settings.instapay": "حساب انستاباي (رقم الهاتف)",
		"store.cat.food": "أطعمة",
		"store.cat.treats": "مكافآت",
		"store.cat.toys": "ألعاب",
		"store.cat.grooming": "عناية",
		"store.cat.health": "صحة",
		"store.cat.accessories": "إكسسوارات",
		"cart.title": "سلة التسوق",
		"cart.empty": "سلتك فارغة.",
		"cart.total": "الإجمالي",
		"cart.remove": "إزالة العنصر",
		"cart.checkout": "إتمام الطلب",
		"cart.continue": "مواصلة التسوق",
		"checkout.title": "إتمام الطلب",
		"checkout.desc": "أخبرنا إلى أين نرسل طلبك.",
		"checkout.name": "الاسم الكامل",
		"checkout.phone": "الهاتف",
		"checkout.email": "البريد الإلكتروني",
		"checkout.address": "عنوان التوصيل",
		"checkout.placeOrder": "تأكيد الطلب",
		"checkout.required": "يرجى ملء جميع الحقول.",
		"checkout.failed": "تعذر تقديم الطلب. حاول مرة أخرى.",
		"checkout.successTitle": "تم استلام الطلب!",
		"checkout.successDesc": "شكرًا لتسوقك مع باومي. سيتواصل معك فريقنا قريبًا لتأكيد التوصيل.",
		"checkout.orderId": "رقم الطلب",
		"checkout.continueShopping": "مواصلة التسوق",
		"checkout.goHome": "العودة للرئيسية",
		"dash.defaultDays": "الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت",
		"dash.xAria": "إغلاق",
		"img.hero": "طبيب بيطري يفحص كلبًا من فصيلة غولدن ريتريفر في غرفة استشارات مضيئة",
		"img.clinic": "معدات التصوير التشخيصي داخل عيادة باو-إم",
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
	name: "Paw-M",
	tagline: "Veterinary care, quietly excellent.",
	phone: "+1 (415) 555-0142",
	emergency: "+1 (415) 555-0911",
	whatsapp: "+1 (415) 555-0142",
	email: "hello@paw-m.clinic",
	address: "218 Marlow Street, Suite 4 · San Francisco, CA 94110",
	currency: "EGP",
	instapay: "",
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
		detail: "Care plans built around your pet's age and history — not a template."
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
		detail: "Species, age, weight, history."
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
//#region src/lib/storage.ts
/**
* Safe localStorage / sessionStorage accessors that never throw.
* Storage can be unavailable (private mode, sandboxed iframes, SSR), so every
* read/write is wrapped in try/catch.
*/
var SESSION_KEY = "paw-m:admin-session";
function storage(kind) {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}
function storageGet(kind, key) {
	try {
		return storage(kind)?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function storageSet(kind, key, value) {
	try {
		storage(kind)?.setItem(key, value);
	} catch {}
}
function storageRemove(kind, key) {
	try {
		storage(kind)?.removeItem(key);
	} catch {}
}
//#endregion
//#region src/lib/api.ts
var API_BASE = typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_API_URL"] || "http://localhost:3001/api";
async function apiFetch(path, init) {
	const sessionJson = storageGet("session", SESSION_KEY);
	const session = sessionJson ? JSON.parse(sessionJson) : null;
	const headers = new Headers({
		"Content-Type": "application/json",
		...init?.headers ?? {}
	});
	if (session?.id && session?.role) {
		headers.set("x-user-id", String(session.id));
		headers.set("x-user-role", session.role);
	}
	const res = await fetch(`${API_BASE}${path}`, {
		...init,
		headers
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`API ${res.status}: ${text || res.statusText}`);
	}
	if (res.status === 204) return void 0;
	return res.json();
}
var api = {
	get: (path) => apiFetch(path),
	post: (path, body) => apiFetch(path, {
		method: "POST",
		body: JSON.stringify(body)
	}),
	patch: (path, body) => apiFetch(path, {
		method: "PATCH",
		body: JSON.stringify(body)
	}),
	put: (path, body) => apiFetch(path, {
		method: "PUT",
		body: JSON.stringify(body)
	}),
	delete: (path) => apiFetch(path, { method: "DELETE" })
};
//#endregion
//#region src/lib/clinic-store.ts
function seed() {
	return {
		requests: [],
		doctors: DOCTORS,
		services: SERVICES,
		products: [],
		orders: [],
		reviews: [],
		payments: [],
		settings: { ...CLINIC },
		workSession: null,
		auditLogs: [],
		workDays: [],
		workDay: null
	};
}
var state = seed();
var listeners = /* @__PURE__ */ new Set();
/**
* What the server rendered. `useSyncExternalStore` uses this for SSR output
* and for the client's hydration pass, so the two always agree even if data
* arrives from the backend while hydration is still in progress.
*/
var serverSnapshot = seed();
function emit() {
	for (const l of listeners) l();
}
function set(mutator) {
	state = mutator(state);
	emit();
}
function getSnapshot() {
	return state;
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function useClinicStore() {
	return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
/** Refreshes all clinic data from the backend (no-op while one is in flight). */
function refreshClinicData() {
	return ensureLoaded();
}
async function loadAll() {
	let failed = false;
	const markFailed = () => {
		failed = true;
		return [];
	};
	try {
		const [bookings, doctors, services, products, orders, reviews, payments, settings, workSession, auditLogs] = await Promise.all([
			api.get("/bookings").catch(markFailed),
			api.get("/doctors").catch(markFailed),
			api.get("/services").catch(markFailed),
			api.get("/products").catch(markFailed),
			api.get("/orders").catch(markFailed),
			api.get("/reviews").catch(markFailed),
			api.get("/payments").catch(markFailed),
			api.get("/settings").catch(() => ({})),
			api.get("/work-session").catch(() => null),
			api.get("/audit-logs").catch(() => [])
		]);
		set((prev) => ({
			...prev,
			requests: Array.isArray(bookings) ? bookings : prev.requests,
			doctors: Array.isArray(doctors) && doctors.length ? doctors : prev.doctors,
			services: Array.isArray(services) && services.length ? services : prev.services,
			products: Array.isArray(products) ? products : prev.products,
			orders: Array.isArray(orders) ? orders : prev.orders,
			reviews: Array.isArray(reviews) ? reviews : prev.reviews,
			payments: Array.isArray(payments) ? payments : prev.payments,
			settings: {
				...prev.settings,
				...settings
			},
			workSession: workSession ?? prev.workSession,
			auditLogs: Array.isArray(auditLogs) ? auditLogs : prev.auditLogs
		}));
		lastLoadFailed = failed;
	} catch (err) {
		lastLoadFailed = true;
		console.error("Failed to load clinic data from backend", err);
	}
}
var loadPromise = null;
var hasLoadedOnce = false;
var lastLoadFailed = false;
/**
* Loads clinic data from the backend. A successful load is cached for the
* session; a FAILED load (backend briefly unreachable, e.g. during startup)
* is retried on the next call so the site never gets stuck with empty data.
*/
function ensureLoaded() {
	if (!loadPromise && (!hasLoadedOnce || lastLoadFailed)) {
		hasLoadedOnce = true;
		loadPromise = loadAll().finally(() => {
			loadPromise = null;
		});
	}
	return loadPromise ?? Promise.resolve();
}
async function addBookingRequest(input) {
	await ensureLoaded();
	try {
		const created = await api.post("/bookings", {
			...input,
			status: "pending",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		set((s) => ({
			...s,
			requests: [created, ...s.requests]
		}));
	} catch (err) {
		console.error("Failed to add booking", err);
		throw err;
	}
	return getSnapshot();
}
async function setBookingStatus(id, status) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/bookings/${id}/status`, { status });
		set((s) => ({
			...s,
			requests: s.requests.map((r) => r.id === id ? updated : r)
		}));
	} catch (err) {
		console.error("Failed to update booking status", err);
		throw err;
	}
}
async function deleteRequest(id) {
	await ensureLoaded();
	try {
		await api.delete(`/bookings/${id}`);
		set((s) => ({
			...s,
			requests: s.requests.filter((r) => r.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete booking", err);
		throw err;
	}
}
async function saveDoctor(doctor) {
	await ensureLoaded();
	try {
		const exists = state.doctors.some((d) => d.id === doctor.id);
		const saved = exists ? await api.patch(`/doctors/${doctor.id}`, doctor) : await api.post("/doctors", doctor);
		set((s) => ({
			...s,
			doctors: exists ? s.doctors.map((d) => d.id === doctor.id ? saved : d) : [saved, ...s.doctors]
		}));
	} catch (err) {
		console.error("Failed to save doctor", err);
		throw err;
	}
}
async function deleteDoctor(id) {
	await ensureLoaded();
	try {
		await api.delete(`/doctors/${id}`);
		set((s) => ({
			...s,
			doctors: s.doctors.filter((d) => d.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete doctor", err);
		throw err;
	}
}
async function saveService(service) {
	await ensureLoaded();
	try {
		const exists = state.services.some((sv) => sv.slug === service.slug);
		const saved = exists ? await api.patch(`/services/${service.slug}`, service) : await api.post("/services", service);
		set((s) => ({
			...s,
			services: exists ? s.services.map((sv) => sv.slug === service.slug ? saved : sv) : [saved, ...s.services]
		}));
	} catch (err) {
		console.error("Failed to save service", err);
		throw err;
	}
}
async function deleteService(slug) {
	await ensureLoaded();
	try {
		await api.delete(`/services/${slug}`);
		set((s) => ({
			...s,
			services: s.services.filter((sv) => sv.slug !== slug)
		}));
	} catch (err) {
		console.error("Failed to delete service", err);
		throw err;
	}
}
async function saveProduct(product) {
	await ensureLoaded();
	try {
		const exists = state.products.some((p) => p.id === product.id);
		const saved = exists ? await api.patch(`/products/${product.id}`, product) : await api.post("/products", product);
		set((s) => ({
			...s,
			products: exists ? s.products.map((p) => p.id === product.id ? saved : p) : [saved, ...s.products]
		}));
	} catch (err) {
		console.error("Failed to save product", err);
		throw err;
	}
}
async function deleteProduct(id) {
	await ensureLoaded();
	try {
		await api.delete(`/products/${id}`);
		set((s) => ({
			...s,
			products: s.products.filter((p) => p.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete product", err);
		throw err;
	}
}
async function createOrder(input) {
	await ensureLoaded();
	try {
		const created = await api.post("/orders", input);
		set((s) => ({
			...s,
			orders: [created, ...s.orders]
		}));
		return created;
	} catch (err) {
		console.error("Failed to create order", err);
		throw err;
	}
}
async function trackOrder(orderId, phone) {
	await ensureLoaded();
	return api.get(`/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
}
async function submitPaymentProof(id, proof) {
	await ensureLoaded();
	try {
		const updated = await api.post(`/orders/${id}/payment-proof`, proof);
		set((s) => ({
			...s,
			orders: s.orders.map((o) => o.id === id ? updated : o)
		}));
		return updated;
	} catch (err) {
		console.error("Failed to submit payment proof", err);
		throw err;
	}
}
async function setOrderPaymentStatus(id, paymentStatus) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/orders/${id}/payment`, { paymentStatus });
		set((s) => ({
			...s,
			orders: s.orders.map((o) => o.id === id ? updated : o)
		}));
	} catch (err) {
		console.error("Failed to update order payment status", err);
		throw err;
	}
}
async function createReview(input) {
	await ensureLoaded();
	try {
		const created = await api.post("/reviews", input);
		set((s) => ({
			...s,
			reviews: [created, ...s.reviews]
		}));
		return created;
	} catch (err) {
		console.error("Failed to create review", err);
		throw err;
	}
}
async function setReviewStatus(id, status) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/reviews/${id}`, { status });
		set((s) => ({
			...s,
			reviews: s.reviews.map((r) => r.id === id ? updated : r)
		}));
	} catch (err) {
		console.error("Failed to update review", err);
		throw err;
	}
}
async function deleteReview(id) {
	await ensureLoaded();
	try {
		await api.delete(`/reviews/${id}`);
		set((s) => ({
			...s,
			reviews: s.reviews.filter((r) => r.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete review", err);
		throw err;
	}
}
async function syncGoogleReviews(placeId) {
	await ensureLoaded();
	try {
		const data = await api.post("/google/sync-reviews", placeId ? { placeId } : void 0);
		const reviews = await api.get("/reviews");
		set((s) => ({
			...s,
			reviews: Array.isArray(reviews) ? reviews : s.reviews
		}));
		return data;
	} catch (err) {
		console.error("Failed to sync Google reviews", err);
		throw err;
	}
}
async function setOrderStatus(id, status) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/orders/${id}/status`, { status });
		set((s) => ({
			...s,
			orders: s.orders.map((o) => o.id === id ? updated : o)
		}));
	} catch (err) {
		console.error("Failed to update order status", err);
		throw err;
	}
}
async function deleteOrder(id) {
	await ensureLoaded();
	try {
		await api.delete(`/orders/${id}`);
		set((s) => ({
			...s,
			orders: s.orders.filter((o) => o.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete order", err);
		throw err;
	}
}
async function archiveBooking(id, archived) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/bookings/${id}/archive`, { archived });
		set((s) => ({
			...s,
			requests: s.requests.map((r) => r.id === id ? updated : r)
		}));
	} catch (err) {
		console.error("Failed to archive booking", err);
		throw err;
	}
}
async function archiveOrder(id, archived) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/orders/${id}/archive`, { archived });
		set((s) => ({
			...s,
			orders: s.orders.map((o) => o.id === id ? updated : o)
		}));
	} catch (err) {
		console.error("Failed to archive order", err);
		throw err;
	}
}
async function createPayment(input) {
	await ensureLoaded();
	try {
		const created = await api.post("/payments", input);
		set((s) => ({
			...s,
			payments: [created, ...s.payments]
		}));
		return created;
	} catch (err) {
		console.error("Failed to create payment", err);
		throw err;
	}
}
async function updatePayment(id, patch) {
	await ensureLoaded();
	try {
		const updated = await api.patch(`/payments/${id}`, patch);
		set((s) => ({
			...s,
			payments: s.payments.map((p) => p.id === id ? updated : p)
		}));
		return updated;
	} catch (err) {
		console.error("Failed to update payment", err);
		throw err;
	}
}
async function deletePayment(id) {
	await ensureLoaded();
	try {
		await api.delete(`/payments/${id}`);
		set((s) => ({
			...s,
			payments: s.payments.filter((p) => p.id !== id)
		}));
	} catch (err) {
		console.error("Failed to delete payment", err);
		throw err;
	}
}
async function updateSettings(patch) {
	await ensureLoaded();
	const clean = { ...patch };
	if (patch.phone !== void 0) clean.phone = sanitizePhone(patch.phone);
	if (patch.emergency !== void 0) clean.emergency = sanitizePhone(patch.emergency);
	if (patch.whatsapp !== void 0) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
	if (patch.email !== void 0) clean.email = sanitizeEmail(patch.email) ?? "";
	try {
		const updated = await api.patch("/settings", clean);
		set((s) => ({
			...s,
			settings: {
				...s.settings,
				...updated
			}
		}));
	} catch (err) {
		console.error("Failed to update settings", err);
		throw err;
	}
}
async function checkIn() {
	await ensureLoaded();
	try {
		const result = await api.post("/work-session/check-in", {});
		set((s) => ({
			...s,
			workSession: result.session
		}));
		return result;
	} catch (err) {
		console.error("Failed to check in", err);
		throw err;
	}
}
async function checkOut() {
	await ensureLoaded();
	try {
		const result = await api.post("/work-session/check-out", {});
		set((s) => ({
			...s,
			workSession: s.workSession?.id === result.session.id ? null : s.workSession
		}));
		return result;
	} catch (err) {
		console.error("Failed to check out", err);
		throw err;
	}
}
async function loadAuditLogs() {
	await ensureLoaded();
	try {
		const logs = await api.get("/audit-logs");
		set((s) => ({
			...s,
			auditLogs: Array.isArray(logs) ? logs : s.auditLogs
		}));
		return logs;
	} catch (err) {
		console.error("Failed to load audit logs", err);
		throw err;
	}
}
async function loadWorkDays() {
	await ensureLoaded();
	try {
		const days = await api.get("/work-days");
		set((s) => ({
			...s,
			workDays: Array.isArray(days) ? days : s.workDays
		}));
		return days;
	} catch (err) {
		console.error("Failed to load workday folders", err);
		throw err;
	}
}
async function loadWorkDay(date) {
	await ensureLoaded();
	try {
		const day = await api.get(`/work-days/${date}`);
		set((s) => ({
			...s,
			workDay: day
		}));
		return day;
	} catch (err) {
		console.error("Failed to load workday folder", err);
		throw err;
	}
}
//#endregion
export { LanguageToggle as $, updatePayment as A, waMeHref as B, setBookingStatus as C, submitPaymentProof as D, setReviewStatus as E, storageGet as F, STATS as G, BOOKING_STEPS as H, storageRemove as I, WHY_US as J, TESTIMONIALS as K, storageSet as L, useClinicStore as M, api as N, syncGoogleReviews as O, SESSION_KEY as P, I18nProvider as Q, mailtoHref as R, saveService as S, setOrderStatus as T, CLINIC as U, ANIMAL_TYPES as V, FAQS as W, upcomingAvailability as X, bookedSlotsFor as Y, Button as Z, loadWorkDay as _, checkOut as a, saveDoctor as b, createReview as c, deletePayment as d, useI18n as et, deleteProduct as f, loadAuditLogs as g, deleteService as h, checkIn as i, updateSettings as j, trackOrder as k, deleteDoctor as l, deleteReview as m, archiveBooking as n, cn as nt, createOrder as o, deleteRequest as p, TIME_SLOTS as q, archiveOrder as r, createPayment as s, addBookingRequest as t, readLangCookie as tt, deleteOrder as u, loadWorkDays as v, setOrderPaymentStatus as w, saveProduct as x, refreshClinicData as y, telHref as z };
