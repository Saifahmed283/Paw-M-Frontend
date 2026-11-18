var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { useQueryClient, useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Link, createRootRouteWithContext, useRouter, useLocation, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useContext, createContext, useRef, useState, useEffect, useMemo, useSyncExternalStore, useCallback, Suspense } from "react";
import { useReducedMotion, AnimatePresence, motion, useInView } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ShoppingBag, X, Minus, Plus, Trash2, Sun, Moon, Phone, Heart, User, Menu, PawPrint, CalendarHeart, ArrowRight, MapPin, Sparkles, LayoutDashboard } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { g as getCookie } from "./server-nkD8CjI6.js";
import { Toaster as Toaster$1 } from "sonner";
const appCss = "/assets/styles-B9EnPBdf.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function PawMMark({
  className,
  animated = false
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 64 64",
      fill: "none",
      className: cn("h-8 w-8", className),
      "aria-hidden": "true",
      role: "presentation",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M4 42h9l5-11 6 20 5-15 4 6h6",
            stroke: "currentColor",
            strokeWidth: "3.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            pathLength: 1,
            className: animated ? "pawm-draw" : void 0
          }
        ),
        /* @__PURE__ */ jsxs("g", { fill: "currentColor", className: animated ? "pawm-pads" : void 0, children: [
          /* @__PURE__ */ jsx("ellipse", { cx: "43.5", cy: "20", rx: "3.1", ry: "4.2" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "52", cy: "16.5", rx: "3.1", ry: "4.4" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "21", rx: "2.9", ry: "4" })
        ] }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z",
            fill: "currentColor",
            className: animated ? "pawm-pads" : void 0
          }
        )
      ]
    }
  );
}
function PawMLogo({ className }) {
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-2.5", className), children: [
    /* @__PURE__ */ jsx(PawMMark, { className: "h-7 w-7 text-primary" }),
    /* @__PURE__ */ jsx("span", { className: "text-[20px] font-bold tracking-[-0.03em] text-foreground", children: "Paw-M" })
  ] });
}
const LANG_KEY = "paw-m:lang";
const EN = {
  // General / nav
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.doctors": "Doctors",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.book": "Book appointment",
  "nav.staff": "Staff dashboard",
  "nav.store": "Store",
  "nav.group.main": "Main",
  "nav.group.team": "Team",
  "nav.group.clinic": "Clinic",
  "nav.group.store": "Store",
  "nav.group.data": "Data",
  "nav.group.system": "System",
  "nav.group.recruitment": "Recruitment",
  // Roles
  "role.admin": "Admin",
  "role.payroll": "Payroll",
  "role.staff": "Staff",
  // Hero
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
  // Stats
  "stats.0": "Pets under our care",
  "stats.1": "Licensed veterinarians",
  "stats.2": "Emergency availability",
  "stats.3": "Owner satisfaction",
  // Sections
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
  // Dashboard
  "dash.title": "Staff dashboard",
  "dash.subtitle": "Manage requests, reservations, the team and services.",
  "dash.overview": "Overview",
  "dash.requests": "Requests",
  "dash.reservations": "Reservations",
  "dash.doctors": "Doctors",
  "dash.services": "Services",
  "dash.prescriptions": "Prescriptions",
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
  "dash.saving": "Saving…",
  "dash.delete": "Delete",
  "dash.edit": "Edit",
  "dash.add": "Add",
  "dash.save": "Save changes",
  "dash.remove": "Remove",
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
  "dash.clients": "Clients",
  "dash.archive": "Archive",
  "dash.logs": "Activity log",
  "dash.recruitment": "Recruitment",
  "dash.recruitmentDesc": "Hire new team members and create dashboard accounts.",
  "dash.recruitment.employee": "Create Employee Record",
  "dash.recruitment.account": "Create Dashboard Account",
  "dash.recruitment.employeeDesc": "Add a team member to the clinic roster with role, pay rate, and contact info.",
  "dash.recruitment.accountDesc": "Create a login account for the staff dashboard (admin, payroll, or staff).",
  "dash.recruitment.fullName": "Full name",
  "dash.recruitment.email": "Email",
  "dash.recruitment.phone": "Phone",
  "dash.recruitment.role": "Role",
  "dash.recruitment.payRateType": "Pay rate type",
  "dash.recruitment.hourlyRate": "Hourly rate (EGP)",
  "dash.recruitment.monthlySalary": "Monthly salary (EGP)",
  "dash.recruitment.roleHoursPerDay": "Role hours per day",
  "dash.recruitment.commissionRates": "Commission rates (JSON)",
  "dash.recruitment.isActive": "Active",
  "dash.recruitment.username": "Username",
  "dash.recruitment.password": "Password",
  "dash.recruitment.createEmployee": "Create employee",
  "dash.recruitment.createAccount": "Create account",
  "dash.recruitment.employeeCreated": "Employee created successfully",
  "dash.recruitment.accountCreated": "Account created successfully",
  "dash.recruitment.error": "Failed to create",
  "dash.recruitment.hourly": "Hourly",
  "dash.recruitment.monthly": "Monthly",
  "dash.recruitment.payroll": "Payroll",
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
  "logs.entity": "Entity",
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
  "dash.settings.roles": "Roles & Permissions",
  "dash.settings.rolesDesc": "Choose which dashboard sections each role can access.",
  "dash.settings.rolesNote": "Admin always has full access to every section.",
  "dash.settings.rolesAccess": "Access",
  "dash.settings.rolesReset": "Reset to defaults",
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
  "payments.kind.order": "Store order",
  "payments.kind.visit": "Visit bill",
  "payments.kind.manual": "Manual",
  "payments.settle": "Settle",
  "payments.settleHint": "Mark this bill as paid — choose the method the client paid with.",
  "payments.settleMethod": "Payment method",
  "payments.settleNotes": "Notes (optional)",
  "clients.hint": "Every registered client, with their visit and store history.",
  "clients.empty": "No clients registered yet.",
  "clients.name": "Client",
  "clients.contact": "Contact",
  "clients.type": "Type",
  "clients.pets": "Pets",
  "clients.visits": "Visits",
  "clients.orders": "Orders",
  "clients.paid": "Paid",
  "clients.outstanding": "Outstanding",
  "clients.lastActivity": "Last activity",
  "clients.back": "Back to clients",
  "clients.detailHint": "Full history for this client.",
  "clients.type.new": "New",
  "clients.type.clinic": "Clinic",
  "clients.type.store": "Store",
  "clients.type.both": "Store + Clinic",
  "clients.stats.visits": "Visits",
  "clients.stats.completed": "Completed",
  "clients.stats.paidVisit": "Paid (visits)",
  "clients.stats.outstandingVisit": "Outstanding (visits)",
  "clients.nextAppointment": "Next appointment",
  "clients.followUp": "Follow-up",
  "clients.noNext": "No upcoming appointment",
  "clients.noFollowUp": "No follow-up planned",
  "clients.section.pets": "Pets",
  "clients.section.petsEmpty": "No pets on file.",
  "clients.section.appointments": "Appointment history",
  "clients.section.appointmentsEmpty": "No bookings yet.",
  "clients.section.prescriptions": "Prescriptions",
  "clients.section.prescriptionsEmpty": "No prescriptions.",
  "clients.section.payments": "Payments & bills",
  "clients.section.paymentsEmpty": "No payment records.",
  "clients.bill.items": "Line items",
  "clients.settle": "Settle",
  "clients.status": "Status",
  "clients.suspended": "Suspended",
  "clients.active": "Active",
  "clients.actions": "Client actions",
  "clients.view": "View profile",
  "clients.notify": "Send notification",
  "clients.notifyDesc": "Send a message the client will see in their account and receive by email.",
  "clients.notifyEmpty": "Message cannot be empty.",
  "clients.notifySent": "Notification sent.",
  "clients.notifyTitle": "Title",
  "clients.notifyBody": "Message",
  "clients.suspend": "Suspend",
  "clients.suspendTitle": "Suspend account",
  "clients.suspendConfirm": "Suspend {name}? They will be signed out and cannot log in until re-activated.",
  "clients.suspendDone": "Account suspended.",
  "clients.activate": "Re-activate",
  "clients.activateTitle": "Re-activate account",
  "clients.activateConfirm": "Re-activate {name}? They can log in again.",
  "clients.activateDone": "Account re-activated.",
  "clients.delete": "Delete",
  "clients.deleteTitle": "Delete account",
  "clients.deleteConfirm": "Delete {name} permanently? This removes their pets, prescriptions, sessions and notifications.",
  "clients.deleteDone": "Client deleted.",
  "clients.cancel": "Cancel",
  "clients.confirm": "Confirm",
  "dash.form.service.price": "Price per visit (0 = free)",
  "reservations.requestPayment": "Request payment",
  "reservations.requestPaymentDesc": "Choose the services for this visit — a bill is sent to the cashier.",
  "reservations.serviceCol": "Service",
  "reservations.servicePlaceholder": "Select a service…",
  "reservations.amountCol": "Amount",
  "reservations.total": "Total",
  "reservations.customService": "Other / custom item",
  "reservations.customLabel": "Description",
  "reservations.customAmount": "Amount",
  "reservations.addLine": "Add",
  "reservations.sendToCashier": "Send to cashier",
  "reservations.reqPayment": "Request payment",
  "reservations.requestSent": "Payment request sent to the cashier.",
  "reservations.noItems": "Add at least one service before sending.",
  "cashier.paymentRequests": "Payment requests",
  "cashier.paymentRequestsDesc": "Bills waiting from the clinic — combine products from the cart and settle in one go.",
  "cashier.requestsEmpty": "No pending payment requests.",
  "cashier.settleVisit": "Settle bill",
  "cashier.settleVisitHint": "Mark this visit bill as paid by the client.",
  "cashier.combineLine": "Include {count} cart product(s) in this bill",
  "cashier.combineLinesHint": "Line items are appended to the bill and totals are merged.",
  "cashier.billSettled": "Bill settled.",
  "cashier.billCombined": "Products combined — total updated.",
  "book.feeNote": "Visit fees are paid at the clinic after the appointment — we'll prepare a clear bill.",
  "booking.success.fee": "The visit fee is settled at the clinic after the appointment.",
  "account.visitBills": "Visit bills",
  "account.visitBillsEmpty": "No visit bills yet.",
  "account.billsOutstanding": "Outstanding",
  "account.payAtClinic": "Pay at clinic",
  "account.billPaid": "Paid",
  "archive.requests": "Archived requests",
  "archive.requestsDesc": "Old reservations kept for records.",
  "archive.orders": "Archived orders",
  "archive.ordersDesc": "Completed or cancelled store orders kept for records.",
  "archive.empty": "Nothing archived yet.",
  "archive.restore": "Restore",
  "archive.deletePermanent": "Delete permanently",
  "dash.doctors.hint": "Changes appear on the public Doctors page immediately.",
  "dash.services.hint": "Changes appear on the public Services page immediately.",
  "dash.services.free": "Free",
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
  "dash.form.product.image": "Product image (upload)",
  "dash.form.product.imageHint": "PNG, JPG or WebP up to 4 MB. The existing image is kept unless you upload a new one.",
  "dash.form.product.imageTooLarge": "Image must be 4 MB or smaller.",
  "dash.form.product.desc": "Description",
  "dash.form.product.featured": "Featured",
  "dash.form.product.barcode": "Barcode / QR value",
  "dash.form.product.capture": "Scanner capture",
  "dash.form.product.captureHint": "Connect a USB / laser barcode scanner, then scan the product's barcode. The value is detected automatically and fills the Barcode field above, and a printable label is generated. You can also type or paste the code manually and press Enter.",
  "dash.form.product.scanPlaceholder": "Scan or type barcode…",
  "dash.form.product.captured": "Barcode captured: {code}",
  "dash.form.product.barcodeExists": 'This barcode already belongs to "{name}". Save anyway, or edit that product instead to avoid duplicates.',
  "dash.form.product.qrCode": "QR code image (upload)",
  "dash.form.product.qrHint": "Enter the exact barcode/QR value the scanner outputs into the field above — the cashier matches the scanned value to this. The uploaded QR image is a printable label of that value.",
  "dash.form.product.requiredName": "Name is required.",
  "dash.form.product.requiredPrice": "Price must be a valid number.",
  "dash.form.product.requiredStock": "Stock must be a whole number.",
  "dash.orders": "Orders",
  "dash.orders.hint": "Customer orders placed from the store.",
  // Auth / staff sign-in
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
  "auth.missingFields": "Enter both your username and password.",
  "auth.unreachable": "Cannot reach the server. Check that the API is running.",
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
  "booking.pet.age": "Age",
  "booking.pet.weight": "Weight",
  "booking.pet.otherType": "Other type",
  "booking.owner.summary": "Not signed in",
  "booking.owner.account": "Account holder",
  "booking.owner.hint": "Your booking is automatically linked to your account. Reception verifies these details before the visit.",
  "booking.pet.addNew": "New pet",
  "booking.pet.loading": "Loading your pets…",
  "booking.pet.chooseSaved": "Choose a saved pet",
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
  // Footer
  "footer.tagline": "A boutique veterinary hospital built around clear diagnostics, honest estimates and records you actually own.",
  "footer.address": "Paw Clinic Madinaty, Craft Zoon, Second New Cairo, Cairo Governorate 19519",
  "footer.accred": "AAHA accredited · Fear Free certified · ISO 9001 quality managed",
  "footer.clinic": "Clinic",
  "footer.care": "Care",
  "footer.services": "Services",
  "footer.vets": "Our veterinarians",
  "footer.about": "About Paw-M",
  "footer.contact": "Contact",
  // Public page headers
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
  // Home sections
  "home.services.title": "Everything your pet needs, under one roof",
  "home.services.desc": "From a routine booster to overnight critical care — no referrals across town, no repeated paperwork.",
  "home.team.eyebrow": "Our team",
  "home.team.title": "Clinicians who explain the whole picture",
  "home.team.desc": "Every veterinarian here holds a specialty focus, and every chart is reviewed by two of them.",
  // Why / timeline / testimonials / faq sections
  "why.title": "The standard of care you'd want for yourself",
  "why.desc": "Everything here is built to remove guesswork — for you and for the clinician holding the chart.",
  "timeline.title": "Booked in under a minute",
  "timeline.desc": "Five short steps. Your progress saves as you go, so a refresh never costs you anything.",
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
  // Booking steps
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
  // Testimonials
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
  // FAQ
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
  // Doctors content
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
  "about.principle.0.body": "No presumptive prescriptions. If we can't explain the finding, we run the test that will.",
  "about.principle.1.title": "Price it in writing",
  "about.principle.1.body": "A written estimate reaches you before anything begins, and we call if it needs to change.",
  "about.principle.2.title": "The record belongs to you",
  "about.principle.2.body": "Every note, image and result is exportable the day you ask, for any clinic you choose.",
  // Contact page
  "contact.emergency": "Emergency line",
  "contact.reception": "Reception",
  "contact.whatsapp": "WhatsApp",
  "contact.email": "Email",
  "contact.hours": "Opening hours",
  "contact.address": "Address",
  "contact.map": "Paw-M clinic location map",
  "hour.0": "Friday",
  "hour.1": "Saturday",
  "hour.2": "Sunday",
  "hour.3": "Monday",
  "hour.4": "Tuesday",
  "hour.5": "Wednesday",
  "hour.6": "Thursday",
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
  "header.homeAria": "Paw-M home",
  "header.mainAria": "Main",
  "header.lightMode": "Switch to light mode",
  "header.darkMode": "Switch to dark mode",
  "header.cashier": "Cashier",
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
  // Store
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
  "store.left": "{count} left",
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
  "checkout.descCollect": "Choose a payment method and confirm your order. You'll collect it at the clinic.",
  "checkout.descDelivery": "Enter your delivery address to receive your order at home.",
  "checkout.addressOptional": "Delivery address (optional — collect at clinic)",
  "checkout.addressRequired": "Delivery address (required)",
  "checkout.addressHint": "Required for delivery. Leave empty if you'll collect at the clinic.",
  "checkout.collectInClinic": "Collect at clinic",
  "checkout.addressRequiredError": "Delivery address is required for this payment method.",
  "cashier.scanBarcode": "Scan Barcode",
  "cashier.scanDesc": "Use a barcode scanner or type the barcode manually and press Enter.",
  "cashier.scanPlaceholder": "Scan or type barcode...",
  "cashier.waitingForScan": "Waiting for scan...",
  "cashier.cart": "Cart ({count} items)",
  "cashier.emptyCart": "Cart is empty — scan a product to start",
  "cashier.clearCart": "Clear cart",
  "cashier.payment": "Payment",
  "cashier.paymentDesc": "Select payment method and complete the sale.",
  "cashier.subtotal": "Subtotal",
  "cashier.items": "Items",
  "cashier.total": "Total",
  "cashier.completeSale": "Complete Sale",
  "cashier.newSale": "New Sale",
  "cashier.successTitle": "Sale Complete!",
  "cashier.successDesc": "The order has been created successfully.",
  "cashier.orderId": "Order ID",
  "cashier.added": "Added {name} to cart",
  "cashier.productNotFound": "Product not found: {code}",
  "cashier.outOfStock": "{name} is out of stock",
  "cashier.maxStockReached": "Max stock reached for {name} ({stock} available)",
  "cashier.failed": "Could not complete sale. Try again.",
  "cashier.decrease": "Decrease quantity",
  "cashier.increase": "Increase quantity",
  "cashier.remove": "Remove item",
  "cashier.phoneScanner": "Phone camera scanner",
  "cashier.phoneScannerDesc": "No hardware scanner yet? Point your phone camera at the barcode — items are added to the cart automatically.",
  "cashier.startCamera": "Start camera scan",
  "cashier.stopCamera": "Stop camera",
  "cashier.scanningNow": "Scanning… point the camera at a barcode",
  "cashier.cameraNote": "Tip: keep the barcode flat and well lit inside the frame.",
  "cashier.cameraUnsupported": 'The camera needs a secure (HTTPS) page to open. On this page use "Scan by photo" instead.',
  "cashier.cameraNeedsHttps": 'Live camera needs HTTPS. Open the site over https:// (or localhost) to use it — on this page use "Scan by photo" instead.',
  "cashier.cameraDenied": "Camera permission was blocked or no camera was found.",
  "cashier.photoScan": "Scan by photo",
  "cashier.photoBusy": "Reading barcode…",
  "cashier.photoOk": "Barcode found — added to cart",
  "cashier.photoFail": "No barcode found in that photo. Try again.",
  "cashier.addProducts": "Add products",
  "cashier.scannerNever": "No scanner input yet — connect the USB scanner and scan anything",
  "cashier.scannerActive": "Scanner active — last input {ago} ago",
  "cashier.scannerSeen": "Scanner input seen — last input {ago} ago",
  "cashier.scannerCount": "{count} scans",
  "cashier.scannerTest": "Test scanner",
  "cashier.scannerTestDesc": 'Click the field and scan any barcode. If nothing appears, the scanner is not in USB Keyboard mode — scan the "USB Keyboard" barcode from its setup guide.',
  "cashier.scannerTestPlaceholder": "Scan here to test...",
  "cashier.scannerTestClose": "Close test",
  "cashier.quickAdd": "Quick add",
  "cashier.quickAddSearch": "Search by name, barcode or category...",
  "cashier.allCategories": "All",
  "cashier.quickAddEmpty": "No products match.",
  "cashier.soldOut": "Sold out",
  "cashier.quickAddShowing": "Showing {count} of {total}",
  "cashier.heldSales": "Held sales",
  "cashier.holdSale": "Hold",
  "cashier.saleHeld": "Sale held — start a new one or resume later.",
  "cashier.noHeldSales": "No held sales.",
  "cashier.resumeSale": "Resume sale",
  "cashier.discardHeld": "Discard held sale",
  "cashier.saleResumed": "Sale resumed.",
  "cashier.saleDiscarded": "Held sale discarded.",
  "cashier.customerLabel": "Customer (optional)",
  "cashier.customerName": "Name",
  "cashier.customerPhone": "Phone",
  "cashier.customerNamePlaceholder": "Walk-in",
  "cashier.customerPhonePlaceholder": "+20 1xx xxx xxxx",
  "cashier.cashReceived": "Cash received",
  "cashier.exact": "Exact",
  "cashier.banknotes": "Banknotes",
  "cashier.coins": "Coins",
  "cashier.changeDue": "Change due",
  "cashier.remaining": "Remaining",
  "cashier.discount": "Discount",
  "cashier.discountPercent": "Percent",
  "cashier.discountFixed": "Fixed",
  "cashier.discountApplied": "Discount",
  "cashier.discountOrder": "Order discount",
  "cashier.itemDiscount": "Item discount",
  "cashier.itemDiscounts": "Item discounts",
  "cashier.removeDiscount": "Remove discount",
  "cashier.splitPayment": "Split payment",
  "cashier.on": "On",
  "cashier.off": "Off",
  "cashier.allocated": "Allocated",
  "cashier.unallocated": "Unallocated",
  "cashier.fullyAllocated": "Fully allocated",
  "cashier.splitNotComplete": "Split payments don't add up to the total yet.",
  "cashier.keyboardShortcuts": "Shortcuts",
  "cashier.shortcut.quickAdd": "Quick add tab",
  "cashier.shortcut.scan": "Scan tab",
  "cashier.shortcut.hold": "Hold sale",
  "cashier.shortcut.receipt": "Receipt preview",
  "cashier.shortcut.pay": "Complete sale",
  "cashier.shortcut.clear": "Clear cart",
  "cashier.shortcut.help": "Show shortcuts",
  "cashier.shortcut.close": "Close / cancel",
  "cashier.receiptPreview": "Receipt",
  "cashier.printReceipt": "Print",
  "cashier.close": "Close",
  "cashier.receiptThanks": "Thank you!",
  "cashier.totalWithDiscount": "Total after {amount} discount",
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
  loading: "Loading...",
  "notfound.title": "Page not found",
  "notfound.desc": "The page you're looking for doesn't exist or has been moved. Use the links below or head back to the homepage.",
  "notfound.home": "Go home",
  "notfound.contact": "Contact us",
  "crumb.home": "Home",
  "crumb.services": "Services",
  "crumb.doctors": "Doctors",
  "crumb.about": "About",
  "crumb.contact": "Contact",
  "crumb.store": "Store",
  "crumb.book": "Book appointment",
  "crumb.product": "Product",
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
  "booking.ph.medications": "None",
  "dash.payroll": "Payroll",
  "dash.finance": "Finance",
  "dash.payrollNotificationTitle": "Payroll records are ready",
  "dash.payrollNotificationBody": "Payroll for the period {period} is ready for review.",
  "dash.noPayrollRecords": "No payroll records for this period.",
  "dash.egp": "EGP ",
  "dash.basePay": "Base pay",
  "dash.bonuses": "Bonuses",
  "dash.deductions": "Deductions",
  "dash.netPay": "Net pay",
  "dash.submitForApproval": "Submit for approval",
  "dash.approve": "Approve",
  "dash.reject": "Reject",
  "dash.markAsPaid": "Mark as paid",
  "dash.adjustAmount": "Adjust amount",
  "dash.staffOverview": "Staff overview",
  "dash.noStaff": "No staff members found.",
  "dash.name": "Name",
  "dash.role": "Role",
  "dash.rate": "Rate",
  "dash.sessions": "Sessions",
  "dash.hours": "Hours",
  "dash.bookings": "Bookings",
  "dash.revenue": "Revenue",
  "dash.pay": "Pay",
  "dash.period": "Period",
  "dash.today": "Today",
  "dash.thisWeek": "This week",
  "dash.thisMonth": "This month",
  "dash.allRoles": "All roles",
  "dash.month": "month",
  "dash.hour": "hour",
  "dash.calculate": "Calculate",
  "dash.calculating": "Calculating…",
  "dash.notifyStaff": "Notify staff",
  "dash.commission": "Commission",
  "dash.toast.calculated": "Payroll computed for {count} record(s).",
  "dash.toast.calcFailed": "Could not compute payroll.",
  "dash.toast.adjusted": "Payroll amount updated.",
  "dash.toast.statusUpdated": "Payroll status updated.",
  "dash.toast.notified": "Payroll notification sent to staff.",
  "dash.errorLoad": "Failed to load data. Try again.",
  "dash.retry": "Retry",
  "dash.payrollStatus.calculated": "Calculated",
  "dash.payrollStatus.pending_approval": "Pending approval",
  "dash.payrollStatus.approved": "Approved",
  "dash.payrollStatus.paid": "Paid",
  "dash.payrollStatus.rejected": "Rejected",
  "dash.payrollFilterAll": "All statuses",
  "dash.bonusDeductions": "Bonuses & deductions",
  "dash.requestBonus": "Request bonus",
  "dash.requestDeduction": "Request deduction",
  "dash.requestReason": "Reason",
  "dash.requestReasonPlaceholder": "e.g. Outstanding work",
  "dash.requestAmount": "Amount",
  "dash.requestsEmpty": "No bonus or deduction requests yet.",
  "dash.requestedBy": "Requested by",
  "dash.requestStatus.pending": "Pending",
  "dash.requestStatus.approved": "Approved",
  "dash.requestStatus.rejected": "Rejected",
  "dash.reviewApprove": "Approve request",
  "dash.reviewReject": "Reject request",
  "dash.toast.requestSent": "Request submitted",
  "dash.toast.requestReviewed": "Request updated",
  "dash.adjustAmountTitle": "Adjust base pay",
  "dash.adjustAmountHint": "Set the corrected base pay for this record. Commission follows the employee rate.",
  "dash.submitAmount": "Save amount",
  "dash.skipDuplicates": "Skip duplicates",
  "dash.replaceDuplicates": "Replace duplicates",
  "dash.noNotifications": "No notifications.",
  "dash.markAllRead": "Mark all as read",
  "dash.details": "Details",
  "dash.staff_portal": "Staff portal",
  "dash.staff.kpi": "Your stats",
  "dash.staff.today_sessions": "Today's sessions",
  "dash.staff.earnings_today": "Earnings today",
  "dash.staff.today_appointments": "Today's appointments",
  "dash.loading": "Loading…",
  "dash.settings.tagline": "Tagline",
  "dash.staff-overview": "Staff overview",
  "dash.notifications": "Notifications",
  "auth.role.admin": "Admin",
  "auth.role.payroll": "Payroll",
  "auth.role.staff": "Staff",
  "dash.tasks": "Tasks",
  "dash.allTasks": "All tasks",
  "dash.openTasks": "Open",
  "dash.inProgress": "In progress",
  "dash.completed": "Completed",
  "dash.cancelled": "Cancelled",
  "dash.newTask": "New task",
  "dash.noTasks": "No tasks yet.",
  "dash.taskTitle": "Title",
  "dash.description": "Description",
  "dash.priority": "Priority",
  "dash.dueDate": "Due date",
  "dash.status": "Status",
  "dash.priorityHigh": "High",
  "dash.priorityMedium": "Medium",
  "dash.priorityLow": "Low",
  "dash.taskOpen": "Open",
  "dash.taskInProgress": "In progress",
  "dash.taskCompleted": "Completed",
  "dash.taskCancelled": "Cancelled",
  "dash.markComplete": "Mark complete",
  "dash.markInProgress": "Mark in progress",
  // Staff sign-in
  "auth.signInHelp": "Can't sign in? Contact your administrator.",
  // Cashier page chrome
  "cashier.backToDashboard": "Back to Dashboard",
  "cashier.title": "Cashier",
  "cashier.subtitle": "Fast counter sales, holds & discounts",
  "cashier.saleDefault": "Sale {n}",
  "cashier.walkInCustomer": "Walk-in Customer",
  "cashier.percentOff": "{value}% off",
  "cashier.receiptItem": "Item",
  "cashier.receiptQty": "Qty",
  "cashier.receiptTotal": "Total",
  "cashier.qty": "Qty",
  "cashier.stock": "Stock",
  // Shared time abbreviations
  "time.shortSec": "{n}s",
  "time.shortMin": "{n}m",
  "time.shortHrMin": "{h}h {m}m",
  // Dashboard extras
  "dash.notificationNew": "New order or booking received!",
  "dash.expandSidebar": "Expand sidebar",
  "dash.collapseSidebar": "Collapse sidebar",
  // Homepage reviews section
  "homepage.clinicReviews.eyebrow": "Google Reviews"
};
const AR = {
  "nav.home": "الرئيسية",
  "nav.services": "الخدمات",
  "nav.doctors": "الأطباء",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.book": "احجز موعداً",
  "nav.staff": "لوحة الموظفين",
  "nav.store": "المتجر",
  "nav.group.main": "الرئيسية",
  "nav.group.team": "الفريق",
  "nav.group.clinic": "العيادة",
  "nav.group.store": "المتجر",
  "nav.group.data": "البيانات",
  "nav.group.system": "النظام",
  "nav.group.recruitment": "التوظيف",
  // Roles
  "role.admin": "مدير",
  "role.payroll": "الرواتب",
  "role.staff": "موظف",
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
  "dash.prescriptions": "الوصفات الطبية",
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
  "dash.saving": "جاري الحفظ…",
  "dash.delete": "حذف",
  "dash.edit": "تعديل",
  "dash.add": "إضافة",
  "dash.save": "حفظ التغييرات",
  "dash.remove": "إزالة",
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
  "dash.clients": "العملاء",
  "dash.archive": "الأرشيف",
  "dash.logs": "سجل النشاط",
  "dash.recruitment": "التوظيف",
  "dash.recruitmentDesc": "تعيين أعضاء جدد في الفريق وإنشاء حسابات لوحة التحكم.",
  "dash.recruitment.employee": "إنشاء سجل موظف",
  "dash.recruitment.account": "إنشاء حساب لوحة التحكم",
  "dash.recruitment.employeeDesc": "إضافة عضو فريق إلى قائمة العيادة مع الدور ومعدل الأجر ومعلومات الاتصال.",
  "dash.recruitment.accountDesc": "إنشاء حساب تسجيل دخول للوحة تحكم الموظفين (مدير، رواتب، أو موظف).",
  "dash.recruitment.fullName": "الاسم الكامل",
  "dash.recruitment.email": "البريد الإلكتروني",
  "dash.recruitment.phone": "الهاتف",
  "dash.recruitment.role": "الدور",
  "dash.recruitment.payRateType": "نوع معدل الأجر",
  "dash.recruitment.hourlyRate": "معدل الساعة (ج.م)",
  "dash.recruitment.monthlySalary": "الراتب الشهري (ج.م)",
  "dash.recruitment.roleHoursPerDay": "ساعات العمل اليومية",
  "dash.recruitment.commissionRates": "معدلات العمولة (JSON)",
  "dash.recruitment.isActive": "نشط",
  "dash.recruitment.username": "اسم المستخدم",
  "dash.recruitment.password": "كلمة المرور",
  "dash.recruitment.createEmployee": "إنشاء موظف",
  "dash.recruitment.createAccount": "إنشاء حساب",
  "dash.recruitment.employeeCreated": "تم إنشاء الموظف بنجاح",
  "dash.recruitment.accountCreated": "تم إنشاء الحساب بنجاح",
  "dash.recruitment.error": "فشل الإنشاء",
  "dash.recruitment.hourly": "بالساعة",
  "dash.recruitment.monthly": "شهري",
  "dash.recruitment.payroll": "الرواتب",
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
  "logs.entity": "الكيان",
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
  "dash.settings.roles": "الأدوار والصلاحيات",
  "dash.settings.rolesDesc": "اختر أقسام لوحة التحكم التي يمكن لكل دور الوصول إليها.",
  "dash.settings.rolesNote": "المدير لديه دائمًا وصول كامل إلى جميع الأقسام.",
  "dash.settings.rolesAccess": "الوصول",
  "dash.settings.rolesReset": "إعادة التعيين الافتراضي",
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
  "payments.kind.order": "طلب متجر",
  "payments.kind.visit": "فاتورة زيارة",
  "payments.kind.manual": "يدوية",
  "payments.settle": "تحصيل",
  "payments.settleHint": "سجّل هذه الفاتورة كمدفوعة — اختر الطريقة التي دفع بها العميل.",
  "payments.settleMethod": "طريقة الدفع",
  "payments.settleNotes": "ملاحظات (اختياري)",
  "clients.hint": "كل عميل مسجّل مع تاريخ زياراته ومشترياته.",
  "clients.empty": "لا عملاء مسجّلون بعد.",
  "clients.name": "العميل",
  "clients.contact": "التواصل",
  "clients.type": "النوع",
  "clients.pets": "الحيوانات",
  "clients.visits": "الزيارات",
  "clients.orders": "الطلبات",
  "clients.paid": "المدفوع",
  "clients.outstanding": "المستحق",
  "clients.lastActivity": "آخر نشاط",
  "clients.back": "العودة إلى العملاء",
  "clients.detailHint": "التاريخ الكامل لهذا العميل.",
  "clients.type.new": "جديد",
  "clients.type.clinic": "عيادة",
  "clients.type.store": "متجر",
  "clients.type.both": "متجر + عيادة",
  "clients.stats.visits": "الزيارات",
  "clients.stats.completed": "المكتملة",
  "clients.stats.paidVisit": "مدفوع (زيارات)",
  "clients.stats.outstandingVisit": "مستحق (زيارات)",
  "clients.nextAppointment": "الموعد القادم",
  "clients.followUp": "متابعة",
  "clients.noNext": "لا مواعيد قادمة",
  "clients.noFollowUp": "لا متابعة مقررة",
  "clients.section.pets": "الحيوانات الأليفة",
  "clients.section.petsEmpty": "لا حيوانات مسجّلة.",
  "clients.section.appointments": "تاريخ المواعيد",
  "clients.section.appointmentsEmpty": "لا حجوزات بعد.",
  "clients.section.prescriptions": "الوصفات الطبية",
  "clients.section.prescriptionsEmpty": "لا وصفات طبية.",
  "clients.section.payments": "المدفوعات والفواتير",
  "clients.section.paymentsEmpty": "لا سجلات دفع.",
  "clients.bill.items": "البند",
  "clients.settle": "تحصيل",
  "clients.status": "الحالة",
  "clients.suspended": "موقوف",
  "clients.active": "نشط",
  "clients.actions": "إجراءات العميل",
  "clients.view": "عرض الملف",
  "clients.notify": "إرسال إشعار",
  "clients.notifyDesc": "أرسل رسالة يراها العميل في حسابه ويستلمها عبر البريد.",
  "clients.notifyEmpty": "لا يمكن للرسالة أن تكون فارغة.",
  "clients.notifySent": "تم إرسال الإشعار.",
  "clients.notifyTitle": "العنوان",
  "clients.notifyBody": "الرسالة",
  "clients.suspend": "إيقاف",
  "clients.suspendTitle": "إيقاف الحساب",
  "clients.suspendConfirm": "هل تريد إيقاف {name}؟ سيُخرج من حسابه ولا يستطيع الدخول حتى إعادة تفعيله.",
  "clients.suspendDone": "تم إيقاف الحساب.",
  "clients.activate": "إعادة تفعيل",
  "clients.activateTitle": "إعادة تفعيل الحساب",
  "clients.activateConfirm": "هل تريد إعادة تفعيل {name}؟ يستطيع الدخول من جديد.",
  "clients.activateDone": "تمت إعادة تفعيل الحساب.",
  "clients.delete": "حذف",
  "clients.deleteTitle": "حذف الحساب",
  "clients.deleteConfirm": "هل تريد حذف {name} نهائياً؟ سيُحذف كل من حيواناته ووصفاته وجلساته وإشعاراته.",
  "clients.deleteDone": "تم حذف العميل.",
  "clients.cancel": "إلغاء",
  "clients.confirm": "تأكيد",
  "dash.form.service.price": "سعر الزيارة (0 = مجاني)",
  "reservations.requestPayment": "طلب دفع",
  "reservations.requestPaymentDesc": "اختر الخدمات المقدّمة في هذه الزيارة — يُرسل فاتورة إلى الكاشير.",
  "reservations.serviceCol": "الخدمة",
  "reservations.servicePlaceholder": "اختر خدمة…",
  "reservations.amountCol": "المبلغ",
  "reservations.total": "الإجمالي",
  "reservations.customService": "بند آخر / مخصص",
  "reservations.customLabel": "الوصف",
  "reservations.customAmount": "المبلغ",
  "reservations.addLine": "إضافة",
  "reservations.sendToCashier": "إرسال إلى الكاشير",
  "reservations.reqPayment": "طلب الدفع",
  "reservations.requestSent": "تم إرسال طلب الدفع إلى الكاشير.",
  "reservations.noItems": "أضف خدمة واحدة على الأقل قبل الإرسال.",
  "cashier.paymentRequests": "طلبات الدفع",
  "cashier.paymentRequestsDesc": "فواتير بانتظار الدفع من العيادة — يمكنك دمج منتجات العربة وتسويتها دفعة واحدة.",
  "cashier.requestsEmpty": "لا طلبات دفع معلّقة.",
  "cashier.settleVisit": "تحصيل الفاتورة",
  "cashier.settleVisitHint": "سجّل فاتورة الزيارة هذه كمدفوعة من العميل.",
  "cashier.combineLine": "ضمّ {count} منتج من العربة إلى هذه الفاتورة",
  "cashier.combineLinesHint": "تُضاف البنود إلى الفاتورة ويُدمج الإجمالي.",
  "cashier.billSettled": "تم تحصيل الفاتورة.",
  "cashier.billCombined": "تم دمج المنتجات — تحدّث الإجمالي.",
  "book.feeNote": "تُدفع رسوم الزيارة في العيادة بعد الموعد — سنجهّز لك فاتورة واضحة.",
  "booking.success.fee": "تُسوَّى رسوم الزيارة في العيادة بعد الموعد.",
  "account.visitBills": "فواتير الزيارات",
  "account.visitBillsEmpty": "لا فواتير زيارات بعد.",
  "account.billsOutstanding": "مستحقة",
  "account.payAtClinic": "الدفع في العيادة",
  "account.billPaid": "مدفوعة",
  "archive.requests": "طلبات مؤرشفة",
  "archive.requestsDesc": "حجوزات قديمة محفوظة للسجلات.",
  "archive.orders": "طلبات مؤرشفة",
  "archive.ordersDesc": "طلبات متجر مكتملة أو ملغاة محفوظة للسجلات.",
  "archive.empty": "لا يوجد شيء في الأرشيف بعد.",
  "archive.restore": "استعادة",
  "archive.deletePermanent": "حذف نهائي",
  "dash.doctors.hint": "تظهر التغييرات فوراً في صفحة الأطباء العامة.",
  "dash.services.hint": "تظهر التغييرات فوراً في صفحة الخدمات العامة.",
  "dash.services.free": "مجاني",
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
  "dash.form.product.image": "صورة المنتج (رفع)",
  "dash.form.product.imageHint": "PNG أو JPG أو WebP حتى 4 ميغابايت. تُحفظ الصورة الحالية ما لم ترفع صورة جديدة.",
  "dash.form.product.imageTooLarge": "يجب ألا يتجاوز حجم الصورة 4 ميغابايت.",
  "dash.form.product.desc": "الوصف",
  "dash.form.product.featured": "مميز",
  "dash.form.product.barcode": "قيمة الباركود / QR",
  "dash.form.product.capture": "التقاط بالماسح",
  "dash.form.product.captureHint": "وصّل ماسح باركود USB أو ليزر ثم امسح باركود المنتج. تُكتشف القيمة تلقائيًا وتُملأ في حقل الباركود أعلاه، ويُولَّد ملصق قابل للطباعة. يمكنك أيضًا كتابة الكود أو لصقه يدويًا والضغط على Enter.",
  "dash.form.product.scanPlaceholder": "امسح أو اكتب الباركود…",
  "dash.form.product.captured": "تم التقاط الباركود: {code}",
  "dash.form.product.barcodeExists": 'هذا الباركود مُسجّل بالفعل لمنتج "{name}". احفظه على أي حال، أو عدّل هذا المنتج بدلًا من ذلك لتجنب التكرار.',
  "dash.form.product.qrCode": "صورة رمز QR (رفع)",
  "dash.form.product.qrHint": "أدخل قيمة الباركود/QR التي يخرجها الماسح بالضبط في الحقل أعلاه — يعتمد الكاشير على مطابقة القيمة الممسوحة معه. صورة QR المرفوعة هي ملصق مطبوع لتلك القيمة.",
  "dash.form.product.requiredName": "الاسم مطلوب.",
  "dash.form.product.requiredPrice": "يجب أن يكون السعر رقمًا صحيحًا.",
  "dash.form.product.requiredStock": "يجب أن يكون المخزون رقمًا صحيحًا.",
  "dash.orders": "الطلبات",
  "dash.orders.hint": "طلبات العملاء من المتجر.",
  // Auth / staff sign-in
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
  "auth.missingFields": "أدخل اسم المستخدم وكلمة المرور.",
  "auth.unreachable": "تعذر الوصول إلى الخادم. تأكد من تشغيل واجهة API.",
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
  "booking.owner.summary": "غير مسجل",
  "booking.owner.account": "صاحب الحساب",
  "booking.owner.hint": "يتم ربط الحجز تلقائيًا بحسابك. يتحقق الاستقبال من هذه البيانات قبل الزيارة.",
  "booking.pet.addNew": "حيوان جديد",
  "booking.pet.loading": "جارٍ تحميل حيواناتك…",
  "booking.pet.chooseSaved": "اختر حيوانًا مسجلًا",
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
  "footer.address": "باو كلينك مدينتي، كرافت زون، القاهرة الجديدة، محافظة القاهرة 19519",
  "footer.clinic": "العيادة",
  "footer.care": "الرعاية",
  "footer.services": "الخدمات",
  "footer.vets": "أطباؤنا البيطريون",
  "footer.about": "حول باو-إم",
  "footer.contact": "اتصل بنا",
  "footer.accred": "معتمد من AAHA · معتمد من Fear Free · إدارة جودة وفق ISO 9001",
  // عناوين الصفحات العامة
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
  // الأسئلة الشائعة
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
  "doctors.empty": "لا يوجد طبيب يطابق هذا المزيج. جرّب نوع حيوان آخر.",
  // صفحة حول
  "about.principle.0.title": "شخّص قبل أن تعالج",
  "about.principle.0.body": "لا وصفات تخمينية. إذا لم نستطع شرح النتيجة، نجري التحليل الذي سيجعلها واضحة.",
  "about.principle.1.title": "السعر مكتوب",
  "about.principle.1.body": "يصلك تقدير مكتوب قبل أي إجراء، ونتصل بك إذا تغير السعر.",
  "about.principle.2.title": "السجل ملكك",
  "about.principle.2.body": "كل ملاحظة وصورة ونتيجة قابلة للتصدير في نفس اليوم الذي تطلبها، لأي عيادة تختارها.",
  // صفحة الاتصال
  "contact.emergency": "خط الطوارئ",
  "contact.reception": "الاستقبال",
  "contact.whatsapp": "واتساب",
  "contact.email": "البريد الإلكتروني",
  "contact.hours": "ساعات العمل",
  "contact.address": "العنوان",
  "contact.map": "موقع عيادة باو-إم",
  "hour.0": "الجمعة",
  "hour.1": "السبت",
  "hour.2": "الأحد",
  "hour.3": "الاثنين",
  "hour.4": "الثلاثاء",
  "hour.5": "الأربعاء",
  "hour.6": "الخميس",
  // متفرقات
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
  "header.cashier": "الكاشير",
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
  // Store
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
  "store.left": "متبقي {count}",
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
  "checkout.descCollect": "اختر طريقة الدفع و أكد طلبك. سيتم استلامه من العيادة.",
  "checkout.descDelivery": "أدخل عنوان التوصيل لتستلم طلبك في المنزل.",
  "checkout.addressOptional": "عنوان التوصيل (اختياري — الاستلام من العيادة)",
  "checkout.addressRequired": "عنوان التوصيل (مطلوب)",
  "checkout.addressHint": "مطلوب للتوصيل. اتركه فارغًا إذا كنت ستستلم من العيادة.",
  "checkout.collectInClinic": "الاستلام من العيادة",
  "checkout.addressRequiredError": "عنوان التوصيل مطلوب لهذه طريقة الدفع.",
  "cashier.scanBarcode": "مسح الباركود",
  "cashier.scanDesc": "استخدم قارئ الباركود أو اكتب الباركود يدويًا واضغط Enter.",
  "cashier.scanPlaceholder": "امسح أو اكتب الباركود...",
  "cashier.waitingForScan": "في انتظار المسح...",
  "cashier.cart": "السلة ({count} أصناف)",
  "cashier.emptyCart": "السلة فارغة — امسح منتجًا للبدء",
  "cashier.clearCart": "تفريغ السلة",
  "cashier.payment": "الدفع",
  "cashier.paymentDesc": "اختر طريقة الدفع وأكمل البيع.",
  "cashier.subtotal": "المجموع الفرعي",
  "cashier.items": "الأصناف",
  "cashier.total": "الإجمالي",
  "cashier.completeSale": "إتمام البيع",
  "cashier.newSale": "بيع جديد",
  "cashier.successTitle": "تم البيع!",
  "cashier.successDesc": "تم إنشاء الطلب بنجاح.",
  "cashier.orderId": "رقم الطلب",
  "cashier.added": "تمت إضافة {name} إلى السلة",
  "cashier.productNotFound": "المنتج غير موجود: {code}",
  "cashier.outOfStock": "{name} غير متوفر في المخزون",
  "cashier.maxStockReached": "تم الوصول للحد الأقصى لـ {name} ({stock} متاح)",
  "cashier.failed": "تعذر إتمام البيع. حاول مرة أخرى.",
  "cashier.decrease": "تقليل الكمية",
  "cashier.increase": "زيادة الكمية",
  "cashier.remove": "إزالة العنصر",
  "cashier.phoneScanner": "ماسح كاميرا الهاتف",
  "cashier.phoneScannerDesc": "لا قارئ بعد؟ وجّه كاميرا هاتفك نحو الباركود وستُضاف الأصناف إلى السلة تلقائيًا.",
  "cashier.startCamera": "بدء المسح بالكاميرا",
  "cashier.stopCamera": "إيقاف الكاميرا",
  "cashier.scanningNow": "جارٍ المسح… وجّه الكاميرا نحو الباركود",
  "cashier.cameraNote": "نصيحة: أبقِ الباركود مسطحًا ومضيئًا داخل الإطار.",
  "cashier.cameraUnsupported": "الكاميرا غير متاحة في هذه الصفحة. استخدم المسح بالصورة بدلًا من ذلك.",
  "cashier.cameraNeedsHttps": 'تحتاج الكاميرا إلى اتصال آمن (HTTPS). افتح الموقع عبر https:// (أو localhost) لاستخدامها — وفي هذه الصفحة استخدم "المسح بالصورة" بدلًا من ذلك.',
  "cashier.cameraDenied": "تم رفض إذن الكاميرا أو لم يتم العثور على كاميرا.",
  "cashier.photoScan": "المسح بالصورة",
  "cashier.photoBusy": "جارٍ قراءة الباركود…",
  "cashier.photoOk": "تم العثور على الباركود — أُضيف إلى السلة",
  "cashier.photoFail": "لم يتم العثور على باركود في الصورة. حاول مجددًا.",
  "cashier.addProducts": "إضافة منتجات",
  "cashier.scannerNever": "لم يتم رصد إدخال من الماسح بعد — وصّل ماسح USB وامسح أي باركود",
  "cashier.scannerActive": "الماسح يعمل — آخر إدخال قبل {ago}",
  "cashier.scannerSeen": "تم رصد إدخال من الماسح — آخر إدخال قبل {ago}",
  "cashier.scannerCount": "{count} عمليات مسح",
  "cashier.scannerTest": "اختبار الماسح",
  "cashier.scannerTestDesc": 'انقر على الحقل ثم امسح أي باركود. إذا لم يظهر شيء، فالماسح ليس في وضع USB Keyboard — امسح باركود "USB Keyboard" من دليل الإعداد الخاص به.',
  "cashier.scannerTestPlaceholder": "امسح هنا للاختبار...",
  "cashier.scannerTestClose": "إغلاق الاختبار",
  "cashier.quickAdd": "إضافة سريعة",
  "cashier.quickAddSearch": "ابحث بالاسم أو الباركود أو الفئة...",
  "cashier.allCategories": "الكل",
  "cashier.quickAddEmpty": "لا توجد منتجات مطابقة.",
  "cashier.soldOut": "نفد المخزون",
  "cashier.quickAddShowing": "عرض {count} من {total}",
  "cashier.heldSales": "البيع المعلق",
  "cashier.holdSale": "إيقاف",
  "cashier.saleHeld": "تم إيقاف البيع — ابدأ بيعًا جديدًا أو استكمله لاحقًا.",
  "cashier.noHeldSales": "لا توجد مبيعات معلقة.",
  "cashier.resumeSale": "استئناف البيع",
  "cashier.discardHeld": "حذف البيع المعلق",
  "cashier.saleResumed": "تم استئناف البيع.",
  "cashier.saleDiscarded": "تم حذف البيع المعلق.",
  "cashier.customerLabel": "العميل (اختياري)",
  "cashier.customerName": "الاسم",
  "cashier.customerPhone": "الهاتف",
  "cashier.customerNamePlaceholder": "عميل عابر",
  "cashier.customerPhonePlaceholder": "+20 1xx xxx xxxx",
  "cashier.cashReceived": "المبلغ المستلم نقدًا",
  "cashier.exact": "المبلغ المحدد",
  "cashier.banknotes": "أوراق نقدية",
  "cashier.coins": "عملات",
  "cashier.changeDue": "المبلغ المتبقي للعميل",
  "cashier.remaining": "المتبقي",
  "cashier.discount": "الخصم",
  "cashier.discountPercent": "نسبة مئوية",
  "cashier.discountFixed": "مبلغ ثابت",
  "cashier.discountApplied": "الخصم",
  "cashier.discountOrder": "خصم الطلب",
  "cashier.itemDiscount": "خصم الصنف",
  "cashier.itemDiscounts": "خصومات الأصناف",
  "cashier.removeDiscount": "إزالة الخصم",
  "cashier.splitPayment": "الدفع المقسم",
  "cashier.on": "مفعّل",
  "cashier.off": "متوقف",
  "cashier.allocated": "المخصص",
  "cashier.unallocated": "غير مخصص",
  "cashier.fullyAllocated": "مخصص بالكامل",
  "cashier.splitNotComplete": "الدفعات المقسمة لا تساوي الإجمالي بعد.",
  "cashier.keyboardShortcuts": "الاختصارات",
  "cashier.shortcut.quickAdd": "تبويب الإضافة السريعة",
  "cashier.shortcut.scan": "تبويب المسح",
  "cashier.shortcut.hold": "إيقاف البيع",
  "cashier.shortcut.receipt": "معاينة الإيصال",
  "cashier.shortcut.pay": "إتمام البيع",
  "cashier.shortcut.clear": "تفريغ السلة",
  "cashier.shortcut.help": "عرض الاختصارات",
  "cashier.shortcut.close": "إغلاق / إلغاء",
  "cashier.receiptPreview": "الإيصال",
  "cashier.printReceipt": "طباعة",
  "cashier.close": "إغلاق",
  "cashier.receiptThanks": "شكرًا لك!",
  "cashier.totalWithDiscount": "الإجمالي بعد خصم {amount}",
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
  loading: "جارٍ التحميل...",
  "notfound.title": "الصفحة غير موجودة",
  "notfound.desc": "لا توجد الصفحة التي تبحث عنها أو تم نقلها. استخدم الروابط أدناه أو ارجع إلى الصفحة الرئيسية.",
  "notfound.home": "العودة للرئيسية",
  "notfound.contact": "تواصل معنا",
  "crumb.home": "الرئيسية",
  "crumb.services": "الخدمات",
  "crumb.doctors": "الأطباء",
  "crumb.about": "من نحن",
  "crumb.contact": "اتصل بنا",
  "crumb.store": "المتجر",
  "crumb.book": "احجز موعد",
  "crumb.product": "المنتج",
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
  "booking.ph.medications": "لا شيء",
  "dash.payroll": "الرواتب",
  "dash.finance": "المالية",
  "dash.payrollNotificationTitle": "سجلات الرواتب جاهزة",
  "dash.payrollNotificationBody": "رواتب الفترة {period} جاهزة للمراجعة.",
  "dash.noPayrollRecords": "لا توجد سجلات رواتب لهذه الفترة.",
  "dash.egp": "ج.م ",
  "dash.basePay": "الراتب الأساسي",
  "dash.bonuses": "المكافآت",
  "dash.deductions": "الخصومات",
  "dash.netPay": "الصافي",
  "dash.submitForApproval": "إرسال للموافقة",
  "dash.approve": "موافقة",
  "dash.reject": "رفض",
  "dash.markAsPaid": "تحديد كمدفوع",
  "dash.adjustAmount": "تعديل المبلغ",
  "dash.staffOverview": "نظرة عامة على الفريق",
  "dash.noStaff": "لم يتم العثور على أعضاء فريق.",
  "dash.name": "الاسم",
  "dash.role": "الدور",
  "dash.rate": "الأجر",
  "dash.sessions": "الورديات",
  "dash.hours": "الساعات",
  "dash.bookings": "الحجوزات",
  "dash.revenue": "الإيرادات",
  "dash.pay": "الراتب",
  "dash.period": "الفترة",
  "dash.today": "اليوم",
  "dash.thisWeek": "هذا الأسبوع",
  "dash.thisMonth": "هذا الشهر",
  "dash.allRoles": "جميع الأدوار",
  "dash.month": "شهر",
  "dash.hour": "ساعة",
  "dash.calculate": "حساب",
  "dash.calculating": "جارٍ الحساب…",
  "dash.notifyStaff": "إخطار الفريق",
  "dash.commission": "العمولة",
  "dash.toast.calculated": "تم حساب الرواتب لـ {count} سجل.",
  "dash.toast.calcFailed": "تعذر حساب الرواتب.",
  "dash.toast.adjusted": "تم تحديث مبلغ الراتب.",
  "dash.toast.statusUpdated": "تم تحديث حالة الراتب.",
  "dash.toast.notified": "تم إرسال إشعار الرواتب للفريق.",
  "dash.errorLoad": "تعذر تحميل البيانات. حاول مجددًا.",
  "dash.retry": "إعادة المحاولة",
  "dash.payrollStatus.calculated": "محسوب",
  "dash.payrollStatus.pending_approval": "في انتظار الموافقة",
  "dash.payrollStatus.approved": "تمت الموافقة",
  "dash.payrollStatus.paid": "مدفوع",
  "dash.payrollStatus.rejected": "مرفوض",
  "dash.payrollFilterAll": "كل الحالات",
  "dash.bonusDeductions": "المكافآت والخصومات",
  "dash.requestBonus": "طلب مكافأة",
  "dash.requestDeduction": "طلب خصم",
  "dash.requestReason": "السبب",
  "dash.requestReasonPlaceholder": "مثال: أداء متميز",
  "dash.requestAmount": "المبلغ",
  "dash.requestsEmpty": "لا توجد طلبات مكافآت أو خصومات بعد.",
  "dash.requestedBy": "بواسطة",
  "dash.requestStatus.pending": "قيد الانتظار",
  "dash.requestStatus.approved": "تمت الموافقة",
  "dash.requestStatus.rejected": "مرفوض",
  "dash.reviewApprove": "الموافقة على الطلب",
  "dash.reviewReject": "رفض الطلب",
  "dash.toast.requestSent": "تم إرسال الطلب",
  "dash.toast.requestReviewed": "تم تحديث الطلب",
  "dash.adjustAmountTitle": "تعديل الراتب الأساسي",
  "dash.adjustAmountHint": "عيّن الراتب الأساسي المصحح لهذا السجل. العمولة تتبع معدل الموظف.",
  "dash.submitAmount": "حفظ المبلغ",
  "dash.skipDuplicates": "تخطي التكرارات",
  "dash.replaceDuplicates": "استبدال التكرارات",
  "dash.noNotifications": "لا توجد إشعارات.",
  "dash.markAllRead": "تحديد الكل كمقروء",
  "dash.details": "التفاصيل",
  "dash.staff_portal": "بوابة الموظفين",
  "dash.staff.kpi": "إحصائياتك",
  "dash.staff.today_sessions": "ورديات اليوم",
  "dash.staff.earnings_today": "أرباح اليوم",
  "dash.staff.today_appointments": "مواعيد اليوم",
  "dash.loading": "جاري التحميل…",
  "dash.settings.tagline": "الشعار",
  "dash.staff-overview": "نظرة عامة على الفريق",
  "dash.notifications": "الإشعارات",
  "auth.role.admin": "مدير",
  "auth.role.payroll": "محاسب رواتب",
  "auth.role.staff": "موظف",
  "dash.tasks": "المهام",
  "dash.allTasks": "جميع المهام",
  "dash.openTasks": "مفتوحة",
  "dash.inProgress": "قيد التنفيذ",
  "dash.completed": "مكتملة",
  "dash.cancelled": "ملغاة",
  "dash.newTask": "مهمة جديدة",
  "dash.noTasks": "لا توجد مهام بعد.",
  "dash.taskTitle": "العنوان",
  "dash.description": "الوصف",
  "dash.priority": "الأولوية",
  "dash.dueDate": "تاريخ الاستحقاق",
  "dash.status": "الحالة",
  "dash.priorityHigh": "عالية",
  "dash.priorityMedium": "متوسطة",
  "dash.priorityLow": "منخفضة",
  "dash.taskOpen": "مفتوحة",
  "dash.taskInProgress": "قيد التنفيذ",
  "dash.taskCompleted": "مكتملة",
  "dash.taskCancelled": "ملغاة",
  "dash.markComplete": "تحديد كمكتملة",
  "dash.markInProgress": "بدء التنفيذ",
  // Staff sign-in
  "auth.signInHelp": "لا يمكنك تسجيل الدخول؟ تواصل مع المسؤول.",
  // Cashier page chrome
  "cashier.backToDashboard": "العودة إلى لوحة التحكم",
  "cashier.title": "الكاشير",
  "cashier.subtitle": "مبيعات سريعة، تعليق وخصومات",
  "cashier.saleDefault": "بيعت {n}",
  "cashier.walkInCustomer": "عميل ووك إن",
  "cashier.percentOff": "خصم {value}%",
  "cashier.receiptItem": "الصنف",
  "cashier.receiptQty": "الكمية",
  "cashier.receiptTotal": "الإجمالي",
  "cashier.qty": "الكمية",
  "cashier.stock": "المخزون",
  // Shared time abbreviations
  "time.shortSec": "{n}ث",
  "time.shortMin": "{n}د",
  "time.shortHrMin": "{h}س {m}د",
  // Dashboard extras
  "dash.notificationNew": "تم استلام طلب أو حجز جديد!",
  "dash.expandSidebar": "توسيع الشريط الجانبي",
  "dash.collapseSidebar": "طي الشريط الجانبي",
  // Homepage reviews section
  "homepage.clinicReviews.eyebrow": "آراء غوغل"
};
const DICTS = { en: EN, ar: AR };
const I18nContext = createContext(null);
function applyLang(lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.classList.toggle("lang-ar", lang === "ar");
}
function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
const MAX_DURATION = 900;
const INTRO_SEEN_KEY = "paw-m:intro-seen";
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
  } catch {
  }
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
    var _a;
    if (hasSeenIntro()) return;
    markIntroSeen();
    setVisible(true);
    const start = performance.now();
    const total = reduceRef.current ? 400 : MAX_DURATION;
    let raf = 0;
    let fontsDone = false;
    let fontBudgetTimer = 0;
    Promise.resolve((_a = document.fonts) == null ? void 0 : _a.ready).then(() => {
      fontsDone = true;
      window.clearTimeout(fontBudgetTimer);
    }).catch(() => {
      fontsDone = true;
      window.clearTimeout(fontBudgetTimer);
    });
    fontBudgetTimer = window.setTimeout(() => {
      fontsDone = true;
    }, 6e3);
    const tick = () => {
      const elapsed = performance.now() - start;
      const timed = Math.min(1, elapsed / total);
      const eased = 1 - Math.pow(1 - timed, 3);
      setProgress(fontsDone ? Math.max(eased, Math.min(1, elapsed / (total * 0.75))) : eased);
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
      window.clearTimeout(fontBudgetTimer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);
  const ease = [0.16, 1, 0.3, 1];
  return /* @__PURE__ */ jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-background",
      initial: { opacity: 1 },
      exit: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
      transition: { duration: reduceMotion ? 0.15 : 0.25, ease },
      role: "status",
      "aria-label": t("intro.loadingAria"),
      children: [
        /* @__PURE__ */ jsx("div", { className: "hero-gradient absolute inset-0" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center gap-5 px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.5, ease, delay: 0.05 },
                className: "text-primary",
                children: /* @__PURE__ */ jsx(IntroMark, { reduceMotion: !!reduceMotion })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.span,
              {
                initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, ease, delay: reduceMotion ? 0.05 : 0.5 },
                className: "text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl",
                children: "Paw-M"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, ease, delay: reduceMotion ? 0.1 : 0.62 },
              className: "text-sm text-muted-foreground",
              children: t("intro.tagline")
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-[2px] w-52 overflow-hidden rounded-full bg-border", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-100 ease-linear",
              style: { width: `${Math.round(progress * 100)}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showSkip && /* @__PURE__ */ jsx(
          motion.span,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "absolute bottom-8 text-xs tracking-wide text-muted-foreground",
            children: t("intro.skip")
          }
        ) })
      ]
    },
    "paw-m-intro"
  ) });
}
function IntroMark({ reduceMotion }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 64 64", className: "h-14 w-14 sm:h-16 sm:w-16", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx(
      motion.path,
      {
        d: "M4 42h9l5-11 6 20 5-15 4 6h6",
        stroke: "currentColor",
        strokeWidth: "3.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        initial: reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 1 },
        animate: { pathLength: 1 },
        transition: { duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.g,
      {
        fill: "currentColor",
        initial: reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.7 },
        animate: { opacity: 1, scale: 1 },
        style: { transformOrigin: "52px 28px" },
        transition: { duration: 0.4, delay: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] },
        children: [
          /* @__PURE__ */ jsx("ellipse", { cx: "43.5", cy: "20", rx: "3.1", ry: "4.2" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "52", cy: "16.5", rx: "3.1", ry: "4.4" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "21", rx: "2.9", ry: "4" }),
          /* @__PURE__ */ jsx("path", { d: "M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z" })
        ]
      }
    )
  ] });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
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
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const CLINIC = {
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
    { day: "Thursday", time: "09:00 – 23:30" }
  ]
};
const STATS = [
  { value: 5e3, suffix: "+", label: "Pets under our care" },
  { value: 14, suffix: "", label: "Licensed veterinarians" },
  { value: 24, suffix: "/7", label: "Emergency availability" },
  { value: 98, suffix: "%", label: "Owner satisfaction" }
];
const SERVICES = [
  {
    slug: "general-checkup",
    icon: "Stethoscope",
    title: "General Checkup",
    description: "Full physical exams with a written wellness plan after every visit.",
    price: 300
  },
  {
    slug: "vaccination",
    icon: "Syringe",
    title: "Vaccination",
    description: "Core and lifestyle vaccines, tracked with automatic due-date reminders.",
    price: 400
  },
  {
    slug: "surgery",
    icon: "Scissors",
    title: "Surgery",
    description: "Soft tissue and orthopaedic procedures in a dedicated sterile theatre.",
    price: 2e3
  },
  {
    slug: "emergency",
    icon: "Siren",
    title: "Emergency Care",
    description: "Triage within minutes, any hour, with on-call critical care staff.",
    price: 600
  },
  {
    slug: "laboratory",
    icon: "FlaskConical",
    title: "Laboratory",
    description: "In-house bloodwork and cytology with same-visit results.",
    price: 250
  },
  {
    slug: "dental",
    icon: "Sparkles",
    title: "Dental Care",
    description: "Scaling, polishing and extractions under monitored anaesthesia.",
    price: 900
  },
  {
    slug: "pharmacy",
    icon: "Pill",
    title: "Pharmacy",
    description: "Dispensed on site, dosage verified against your pet's chart.",
    price: 0
  },
  {
    slug: "grooming",
    icon: "Bath",
    title: "Grooming",
    description: "Medicated baths and coat care supervised by clinical staff.",
    price: 350
  },
  {
    slug: "nutrition",
    icon: "Salad",
    title: "Nutrition",
    description: "Weight and diet programmes built around measurable targets.",
    price: 200
  },
  {
    slug: "x-ray",
    icon: "ScanLine",
    title: "Digital X-Ray",
    description: "Low-dose digital radiography read within the same appointment.",
    price: 500
  },
  {
    slug: "ultrasound",
    icon: "Activity",
    title: "Ultrasound",
    description: "Abdominal and cardiac imaging performed by certified sonographers.",
    price: 700
  },
  {
    slug: "records",
    icon: "FolderHeart",
    title: "Digital Records",
    description: "Every visit, result and prescription in one shareable history.",
    price: 150
  }
];
const WHY_US = [
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
const DOCTORS = [
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
    pets: ["Dog", "Cat", "Bird", "Rabbit", "Reptile"]
  }
];
const CLINIC_REVIEWS = [
  {
    author: "Mariem Mahmoud",
    rating: 5,
    comment: "Had such a great experience with Dr. Mirna. She was so kind and patient with my cat, and took her time to check him and explain everything."
  },
  { author: "Rim Ibrahim", rating: 5, comment: "The most amazing service and products." },
  { author: "Ahmed Eng", rating: 5, comment: "Very nice new admin. Nice treat and service." },
  {
    author: "Marina Emad",
    rating: 5,
    comment: "Perfect hospitality for my dog when I was out of my country, and every product I need for my dog is available at their shop."
  },
  {
    author: "Nahla Sherif",
    rating: 5,
    comment: "My cat had a critical case of bladder blockage and Dr. Mirna was really professional in diagnosing the case and following up with me every day."
  },
  {
    author: "Adam Agha",
    rating: 5,
    comment: "Dr. Mirna is very respectful, professional, and experienced. I took my cat for a neutering procedure based on a recommendation from a friend."
  },
  {
    author: "Aziz Ali",
    rating: 5,
    comment: "The clinic is absolutely fantastic, and the doctor is lovely and does a great job."
  },
  {
    author: "Nehal Nasef",
    rating: 5,
    comment: "My favorite vet and pet clinic. They are professional and I highly recommend them to anyone."
  },
  {
    author: "Hatem El Mandarawi",
    rating: 5,
    comment: "Amazing clinic, very professional and extremely caring. After a surgery, the team kept checking in to make sure everything was fine."
  },
  {
    author: "Marian Tadros",
    rating: 5,
    comment: "One of the most comfortable pet clinics I've ever been to. Dr. Mirna is a very skilled doctor."
  }
];
const BOOKING_STEPS = [
  { title: "Choose a date", detail: "Live availability across every clinician." },
  { title: "Pick a time", detail: "Booked slots disappear as you look." },
  { title: "Tell us about your pet", detail: "Species, age, weight, history." },
  { title: "Describe the case", detail: "Symptoms, medications, allergies." },
  { title: "Confirm", detail: "Summary, calendar invite and reminders." }
];
const FAQS = [
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
    a: "Cash, Fawry and InstaPay. Written estimates are provided before any procedure begins, and online store orders can be paid with proof of transfer submitted on the order tracking page."
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
const ANIMAL_TYPES = ["Dog", "Cat", "Other"];
const TIME_SLOTS = [
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
function bookedSlotsFor(dateISO, doctorId, confirmed) {
  let seed2 = 0;
  const key = `${dateISO}|${doctorId}`;
  for (let i = 0; i < key.length; i++) seed2 = (seed2 * 31 + key.charCodeAt(i)) % 1e5;
  const pseudo = TIME_SLOTS.filter((_, i) => (seed2 >> i % 12) % 3 === 0);
  const real = new Set(
    (confirmed ?? []).filter((b) => b.date === dateISO && b.doctorId === doctorId).map((b) => b.time)
  );
  return [.../* @__PURE__ */ new Set([...pseudo, ...real])];
}
const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function upcomingAvailability(doctor, count = 3, from = /* @__PURE__ */ new Date(), confirmed, locale = "en-US") {
  const out = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const realBookings = (confirmed ?? []).filter(
    (c) => c.status !== "cancelled" && c.status !== "completed"
  );
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
      dateLabel: cursor.toLocaleDateString(locale, { month: "short", day: "numeric" }),
      openCount: open.length,
      slots: open.slice(0, 3)
    });
  }
  return out;
}
ANIMAL_TYPES.filter(
  (a) => DOCTORS.some((d) => d.pets.includes(a))
);
function sanitizePhone(raw) {
  return raw.replace(/[^\d+()\-\s]/g, "").trim();
}
function sanitizeWhatsapp(raw) {
  return raw.replace(/\D/g, "");
}
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
function sanitizeEmail(raw) {
  const email = raw.trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
}
function telHref(phone) {
  const digits = sanitizePhone(phone);
  if (!digits) return null;
  return `tel:${digits}`;
}
function mailtoHref(email) {
  const clean = sanitizeEmail(email);
  return clean ? `mailto:${clean}` : null;
}
function waMeHref(whatsapp) {
  const digits = sanitizeWhatsapp(whatsapp);
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
const SESSION_KEY = "paw-m:admin-session";
function storage(kind) {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
function storageGet(kind, key) {
  var _a;
  try {
    return ((_a = storage(kind)) == null ? void 0 : _a.getItem(key)) ?? null;
  } catch {
    return null;
  }
}
function storageSet(kind, key, value) {
  var _a;
  try {
    (_a = storage(kind)) == null ? void 0 : _a.setItem(key, value);
  } catch {
  }
}
function storageRemove(kind, key) {
  var _a;
  try {
    (_a = storage(kind)) == null ? void 0 : _a.removeItem(key);
  } catch {
  }
}
const SESSION_TTL_MS = 8 * 60 * 60 * 1e3;
const MIN_USERNAME = 3;
const MIN_PASSWORD = 6;
function saveSession(username, role, token) {
  const session = {
    username,
    role,
    expiresAt: Date.now() + SESSION_TTL_MS
  };
  if (token) session.token = token;
  storageSet("session", SESSION_KEY, JSON.stringify(session));
}
async function login(username, password) {
  const r = await api.post("/auth/login", {
    username: username.trim(),
    password
  });
  if (!r.ok) {
    return false;
  }
  saveSession(username.trim(), r.role ?? "staff", r.token);
  return true;
}
async function changeCredentials(input) {
  const { currentPassword, newUsername, newPassword } = input;
  if (newUsername !== void 0 && newUsername.trim().length < MIN_USERNAME) {
    throw new Error(`Username must be at least ${MIN_USERNAME} characters.`);
  }
  if (newPassword !== void 0 && newPassword.length < MIN_PASSWORD) {
    throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`);
  }
  const r = await api.put("/auth/credentials", {
    currentPassword,
    newUsername: (newUsername == null ? void 0 : newUsername.trim()) || void 0,
    newPassword
  });
  if (r.token) {
    const session = readSession$1();
    if (session) saveSession((newUsername == null ? void 0 : newUsername.trim()) || session.username, session.role, r.token);
  }
}
function remainingLockMs() {
  return 0;
}
function readSession$1() {
  const raw = storageGet("session", SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.username === "string" && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now()) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
function currentUsername() {
  var _a;
  return ((_a = readSession$1()) == null ? void 0 : _a.username) ?? "";
}
function currentRole() {
  var _a;
  return ((_a = readSession$1()) == null ? void 0 : _a.role) ?? "staff";
}
function isAuthed() {
  return readSession$1() !== null;
}
function getSessionToken() {
  var _a;
  return ((_a = readSession$1()) == null ? void 0 : _a.token) ?? "";
}
async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
  }
  storageRemove("session", SESSION_KEY);
}
const CLIENT_SESSION_KEY = "paw-m:client-session";
function readSession() {
  const raw = storageGet("session", CLIENT_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function currentClient() {
  var _a;
  return ((_a = readSession()) == null ? void 0 : _a.client) ?? null;
}
function clientIsAuthed() {
  var _a;
  return Boolean((_a = readSession()) == null ? void 0 : _a.token);
}
function getClientToken() {
  var _a;
  return ((_a = readSession()) == null ? void 0 : _a.token) ?? null;
}
async function requestClientVerification(input) {
  await api.post("/client-auth/register", input);
}
async function verifyClientEmail(email, code) {
  const session = await api.post("/client-auth/verify", { email, code });
  storageSet("session", CLIENT_SESSION_KEY, JSON.stringify(session));
  return session.client;
}
async function loginClient(email, password) {
  const session = await api.post("/client-auth/login", { email, password });
  storageSet("session", CLIENT_SESSION_KEY, JSON.stringify(session));
  return session.client;
}
async function logoutClient() {
  const token = getClientToken();
  if (token) {
    try {
      await api.post("/client-auth/logout", { token });
    } catch {
    }
  }
  storageRemove("session", CLIENT_SESSION_KEY);
}
const __vite_import_meta_env__$3 = {};
const ENV_API_BASE = typeof import.meta !== "undefined" ? (__vite_import_meta_env__$3 == null ? void 0 : __vite_import_meta_env__$3["VITE_API_URL"]) ?? "" : "";
function resolveApiBase() {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (typeof window !== "undefined" && typeof window.location !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const apiPort = port === "5173" || port === "4173" ? "3001" : port;
    return `${protocol}//${hostname}${apiPort ? `:${apiPort}` : ""}/api`;
  }
  return "http://localhost:3001/api";
}
const API_BASE = resolveApiBase();
class ApiError extends Error {
  constructor(status, message, retryAfterMinutes) {
    super(message);
    __publicField(this, "status");
    /** Minutes until a rate-limited window resets, from the RateLimit-Reset header. */
    __publicField(this, "retryAfterMinutes");
    this.name = "ApiError";
    this.status = status;
    if (retryAfterMinutes !== void 0) this.retryAfterMinutes = retryAfterMinutes;
  }
}
function authHeaders() {
  const staffToken = getSessionToken();
  if (staffToken) return { Authorization: `Bearer ${staffToken}` };
  const clientToken = getClientToken();
  return clientToken ? { Authorization: `Bearer ${clientToken}` } : {};
}
const CSRF_COOKIE = "paw-m-csrf-token";
function csrfHeaders() {
  if (typeof document === "undefined") return {};
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]+)`));
  return match ? { "X-CSRF-Token": decodeURIComponent(match[1] ?? "") } : {};
}
async function apiFetch(path, init, unwrapPagination = true) {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;
  const headers = new Headers({
    "Content-Type": "application/json",
    ...authHeaders(),
    ...csrfHeaders(),
    ...(init == null ? void 0 : init.headers) ?? {}
  });
  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    ...init,
    headers,
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401 && /Unauthorized — no session|Session expired|Invalid session|User not found/.test(text)) {
      storageRemove("session", SESSION_KEY);
    }
    const resetHeader = res.headers.get("RateLimit-Reset");
    const resetSeconds = resetHeader ? Number(resetHeader) : Number.NaN;
    const retryAfterMinutes = Number.isFinite(resetSeconds) ? Math.max(1, Math.ceil(resetSeconds / 60)) : void 0;
    throw new ApiError(
      res.status,
      `API ${res.status}: ${text || res.statusText}`,
      retryAfterMinutes
    );
  }
  if (res.status === 204) return void 0;
  const json = await res.json();
  if (unwrapPagination && json && typeof json === "object" && "data" in json && "pagination" in json && Array.isArray(json.data)) {
    return json.data;
  }
  return json;
}
const api = {
  get: (path, init) => apiFetch(path, init),
  getPage: (path) => apiFetch(path, void 0, false),
  post: (path, body) => apiFetch(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: "DELETE" })
};
const QUERY_KEYS = {
  doctors: ["doctors"],
  services: ["services"],
  products: ["products"],
  bookings: ["bookings"],
  orders: ["orders"],
  reviews: ["reviews"],
  payments: ["payments"],
  clients: ["clients"],
  settings: ["settings"],
  workSession: ["work-session"],
  auditLogs: ["audit-logs"],
  workDays: ["work-days"]
};
const seedDefaults = {
  doctors: DOCTORS,
  services: SERVICES,
  reviews: CLINIC_REVIEWS.map((review, index) => ({
    ...review,
    id: `clinic-review-${index + 1}`,
    productId: "clinic",
    status: "approved",
    createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
  })),
  settings: { ...CLINIC },
  requests: [],
  products: [],
  orders: [],
  payments: [],
  clients: [],
  auditLogs: [],
  workDays: []
};
function seed() {
  return {
    requests: [],
    doctors: DOCTORS,
    services: SERVICES,
    products: [],
    orders: [],
    reviews: CLINIC_REVIEWS.map((review, index) => ({
      ...review,
      id: `clinic-review-${index + 1}`,
      productId: "clinic",
      status: "approved",
      createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
    })),
    payments: [],
    clients: [],
    settings: { ...CLINIC },
    workSession: null,
    auditLogs: [],
    workDays: [],
    workDay: null
  };
}
let queryClientInstance = null;
function getQc() {
  return queryClientInstance;
}
function invalidate(key) {
  var _a;
  (_a = getQc()) == null ? void 0 : _a.invalidateQueries({ queryKey: key, exact: true });
}
async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let pageCount = 1;
  do {
    const result = await api.getPage(`/products?limit=200&page=${page}`);
    products.push(...result.data);
    pageCount = Math.max(1, result.pagination.pages);
    page += 1;
  } while (page <= pageCount);
  return products;
}
function useClinicStore() {
  const qc = useQueryClient();
  queryClientInstance = qc;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: doctors = seedDefaults.doctors } = useQuery({
    queryKey: QUERY_KEYS.doctors,
    queryFn: () => api.get("/doctors"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.doctors,
    enabled: mounted
  });
  const { data: services = seedDefaults.services } = useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: () => api.get("/services"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.services,
    enabled: mounted
  });
  const {
    data: products = seedDefaults.products,
    isError: productsFailed,
    error: productsError
  } = useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: fetchAllProducts,
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.products,
    enabled: mounted
  });
  const { data: requests = seedDefaults.requests } = useQuery({
    queryKey: QUERY_KEYS.bookings,
    queryFn: () => api.get("/bookings"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.requests,
    enabled: mounted && isAuthed()
  });
  const { data: orders = seedDefaults.orders } = useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => api.get("/orders"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.orders,
    enabled: mounted && isAuthed()
  });
  const { data: reviews = seedDefaults.reviews } = useQuery({
    queryKey: QUERY_KEYS.reviews,
    queryFn: () => api.get("/reviews"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.reviews,
    enabled: mounted
  });
  const { data: payments = seedDefaults.payments } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: () => api.get("/payments"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.payments,
    enabled: mounted && isAuthed()
  });
  const { data: clients = seedDefaults.clients } = useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: () => api.get("/clients?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.clients,
    enabled: mounted && isAuthed()
  });
  const { data: settings = seedDefaults.settings } = useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: () => api.get("/settings"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.settings,
    enabled: mounted
  });
  const { data: workSession = null } = useQuery({
    queryKey: QUERY_KEYS.workSession,
    queryFn: () => api.get("/work-session"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? null,
    enabled: mounted && isAuthed()
  });
  const { data: auditLogs = seedDefaults.auditLogs } = useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: () => api.get("/audit-logs"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.auditLogs,
    enabled: mounted && isAuthed()
  });
  const { data: workDays = seedDefaults.workDays } = useQuery({
    queryKey: QUERY_KEYS.workDays,
    queryFn: () => api.get("/work-days"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.workDays,
    enabled: mounted && isAuthed()
  });
  const { data: workDay } = useQuery({
    queryKey: ["work-day"],
    queryFn: () => api.get("/work-days/today"),
    staleTime: Infinity,
    enabled: false
  });
  const store = useMemo(() => {
    const gated = (value, seed2) => mounted ? value : seed2;
    return {
      requests: gated(requests, seedDefaults.requests),
      doctors: gated(doctors, seedDefaults.doctors),
      services: gated(services, seedDefaults.services),
      products: gated(products, seedDefaults.products),
      orders: gated(orders, seedDefaults.orders),
      reviews: gated(reviews, seedDefaults.reviews),
      payments: gated(payments, seedDefaults.payments),
      clients: gated(clients, seedDefaults.clients),
      settings: gated(settings, seedDefaults.settings),
      workSession: gated(workSession, null),
      auditLogs: gated(auditLogs, seedDefaults.auditLogs),
      workDays: gated(workDays, seedDefaults.workDays),
      workDay: gated(workDay ?? null, null)
    };
  }, [
    mounted,
    requests,
    doctors,
    services,
    products,
    orders,
    reviews,
    payments,
    clients,
    settings,
    workSession,
    auditLogs,
    workDays,
    workDay
  ]);
  return { ...store, productsFailed, productsError };
}
function refreshClinicData() {
  invalidate(QUERY_KEYS.bookings);
  invalidate(QUERY_KEYS.doctors);
  invalidate(QUERY_KEYS.services);
  invalidate(QUERY_KEYS.products);
  invalidate(QUERY_KEYS.orders);
  invalidate(QUERY_KEYS.reviews);
  invalidate(QUERY_KEYS.payments);
  invalidate(QUERY_KEYS.clients);
  invalidate(QUERY_KEYS.settings);
  invalidate(QUERY_KEYS.workSession);
  invalidate(QUERY_KEYS.auditLogs);
  invalidate(QUERY_KEYS.workDays);
}
async function refreshPublicData() {
  invalidate(QUERY_KEYS.settings);
  invalidate(QUERY_KEYS.doctors);
  invalidate(QUERY_KEYS.services);
  invalidate(QUERY_KEYS.products);
  invalidate(QUERY_KEYS.reviews);
}
async function addBookingRequest(input) {
  try {
    const created = await api.post("/bookings", {
      ...input,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    invalidate(QUERY_KEYS.bookings);
    return get();
  } catch (err) {
    console.error("Failed to add booking", err);
    throw err;
  }
}
async function setBookingStatus(id, status) {
  try {
    const updated = await api.patch(`/bookings/${id}/status`, { status });
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to update booking status", err);
    throw err;
  }
}
async function deleteRequest(id) {
  try {
    await api.delete(`/bookings/${id}`);
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to delete booking", err);
    throw err;
  }
}
async function archiveBooking(id, archived) {
  try {
    const updated = await api.patch(`/bookings/${id}/archive`, { archived });
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to archive booking", err);
    throw err;
  }
}
async function saveDoctor(doctor) {
  var _a;
  try {
    const current = ((_a = getQc()) == null ? void 0 : _a.getQueryData(QUERY_KEYS.doctors)) ?? DOCTORS;
    const exists = current.some((d) => d.id === doctor.id);
    const saved = exists ? await api.patch(`/doctors/${doctor.id}`, doctor) : await api.post("/doctors", doctor);
    invalidate(QUERY_KEYS.doctors);
  } catch (err) {
    console.error("Failed to save doctor", err);
    throw err;
  }
}
async function deleteDoctor(id) {
  try {
    await api.delete(`/doctors/${id}`);
    invalidate(QUERY_KEYS.doctors);
  } catch (err) {
    console.error("Failed to delete doctor", err);
    throw err;
  }
}
async function saveService(service) {
  var _a;
  try {
    const current = ((_a = getQc()) == null ? void 0 : _a.getQueryData(QUERY_KEYS.services)) ?? SERVICES;
    const exists = current.some((sv) => sv.slug === service.slug);
    const saved = exists ? await api.patch(`/services/${service.slug}`, service) : await api.post("/services", service);
    invalidate(QUERY_KEYS.services);
  } catch (err) {
    console.error("Failed to save service", err);
    throw err;
  }
}
async function deleteService(slug) {
  try {
    await api.delete(`/services/${slug}`);
    invalidate(QUERY_KEYS.services);
  } catch (err) {
    console.error("Failed to delete service", err);
    throw err;
  }
}
const GENERATED_IMAGE_URL = /\/api\/products\/[^/]+\/image(?:[?#]|$)/;
function productPayload(product) {
  var _a;
  const isGeneratedImage = GENERATED_IMAGE_URL.test(product.image);
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    ...isGeneratedImage ? {} : { image: product.image },
    category: product.category,
    petType: product.petType ?? "both",
    stock: product.stock,
    featured: product.featured,
    barcode: ((_a = product.barcode) == null ? void 0 : _a.trim()) || null,
    barcodeImage: product.barcodeImage || null
  };
}
function cacheProduct(product) {
  const queryClient = getQc();
  if (!queryClient) return;
  queryClient.setQueryData(QUERY_KEYS.products, (current = []) => [
    product,
    ...current.filter((item) => item.id !== product.id)
  ]);
}
async function createProduct(product) {
  try {
    const saved = await api.post("/products", productPayload(product));
    cacheProduct(saved);
    invalidate(QUERY_KEYS.products);
    return saved;
  } catch (err) {
    console.error("Failed to create product", err);
    throw err;
  }
}
async function updateProduct(id, product) {
  try {
    const saved = await api.patch(`/products/${id}`, productPayload(product));
    cacheProduct(saved);
    invalidate(QUERY_KEYS.products);
    return saved;
  } catch (err) {
    console.error("Failed to update product", err);
    throw err;
  }
}
async function deleteProduct(id) {
  try {
    await api.delete(`/products/${id}`);
    invalidate(QUERY_KEYS.products);
  } catch (err) {
    console.error("Failed to delete product", err);
    throw err;
  }
}
async function createOrder(input) {
  try {
    const created = await api.post("/orders", input);
    invalidate(QUERY_KEYS.orders);
    return created;
  } catch (err) {
    console.error("Failed to create order", err);
    throw err;
  }
}
async function trackOrder(orderId, phone) {
  return api.get(
    `/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`
  );
}
async function submitPaymentProof(id, proof) {
  try {
    const updated = await api.post(`/orders/${id}/payment-proof`, proof);
    invalidate(QUERY_KEYS.orders);
    return updated;
  } catch (err) {
    console.error("Failed to submit payment proof", err);
    throw err;
  }
}
async function setOrderPaymentStatus(id, paymentStatus) {
  try {
    const updated = await api.patch(`/orders/${id}/payment`, { paymentStatus });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to update order payment status", err);
    throw err;
  }
}
async function setOrderStatus(id, status) {
  try {
    const updated = await api.patch(`/orders/${id}/status`, { status });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to update order status", err);
    throw err;
  }
}
async function deleteOrder(id) {
  try {
    await api.delete(`/orders/${id}`);
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to delete order", err);
    throw err;
  }
}
async function archiveOrder(id, archived) {
  try {
    const updated = await api.patch(`/orders/${id}/archive`, { archived });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to archive order", err);
    throw err;
  }
}
async function createReview(input) {
  try {
    const created = await api.post("/reviews", input);
    invalidate(QUERY_KEYS.reviews);
    return created;
  } catch (err) {
    console.error("Failed to create review", err);
    throw err;
  }
}
async function setReviewStatus(id, status) {
  try {
    const updated = await api.patch(`/reviews/${id}`, { status });
    invalidate(QUERY_KEYS.reviews);
  } catch (err) {
    console.error("Failed to update review", err);
    throw err;
  }
}
async function deleteReview(id) {
  try {
    await api.delete(`/reviews/${id}`);
    invalidate(QUERY_KEYS.reviews);
  } catch (err) {
    console.error("Failed to delete review", err);
    throw err;
  }
}
async function syncGoogleReviews(placeId) {
  try {
    const data = await api.post(
      "/google/sync-reviews",
      placeId ? { placeId } : void 0
    );
    invalidate(QUERY_KEYS.reviews);
    return data;
  } catch (err) {
    console.error("Failed to sync Google reviews", err);
    throw err;
  }
}
async function createPayment(input) {
  try {
    const created = await api.post("/payments", input);
    invalidate(QUERY_KEYS.payments);
    return created;
  } catch (err) {
    console.error("Failed to create payment", err);
    throw err;
  }
}
async function updatePayment(id, patch) {
  try {
    const updated = await api.patch(`/payments/${id}`, patch);
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to update payment", err);
    throw err;
  }
}
async function deletePayment(id) {
  try {
    await api.delete(`/payments/${id}`);
    invalidate(QUERY_KEYS.payments);
  } catch (err) {
    console.error("Failed to delete payment", err);
    throw err;
  }
}
async function createPaymentRequest(input) {
  try {
    const created = await api.post("/payments", input);
    invalidate(QUERY_KEYS.payments);
    return created;
  } catch (err) {
    console.error("Failed to create payment request", err);
    throw err;
  }
}
async function addPaymentItem(id, items) {
  try {
    const updated = await api.post(`/payments/${id}/items`, { items });
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to add payment items", err);
    throw err;
  }
}
async function settlePayment(id, input) {
  try {
    const updated = await api.post(`/payments/${id}/settle`, input);
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to settle payment", err);
    throw err;
  }
}
async function getClient(id) {
  return api.get(`/clients/${id}`);
}
async function setClientSuspended(id, suspended) {
  const updated = await api.patch(`/clients/${id}`, { suspended });
  invalidate(QUERY_KEYS.clients);
  return updated;
}
async function deleteClient(id) {
  await api.delete(`/clients/${id}`);
  invalidate(QUERY_KEYS.clients);
}
async function notifyClient(id, input) {
  const created = await api.post(
    `/clients/${id}/notify`,
    input
  );
  return created.notification;
}
async function updateSettings(patch) {
  const clean = { ...patch };
  if (patch.phone !== void 0) clean.phone = sanitizePhone(patch.phone);
  if (patch.emergency !== void 0) clean.emergency = sanitizePhone(patch.emergency);
  if (patch.whatsapp !== void 0) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
  if (patch.email !== void 0) clean.email = sanitizeEmail(patch.email) ?? "";
  try {
    const updated = await api.patch("/settings", clean);
    invalidate(QUERY_KEYS.settings);
  } catch (err) {
    console.error("Failed to update settings", err);
    throw err;
  }
}
async function checkIn() {
  try {
    const result = await api.post("/work-session/check-in", {});
    invalidate(QUERY_KEYS.workSession);
    return result;
  } catch (err) {
    console.error("Failed to check in", err);
    throw err;
  }
}
async function checkOut() {
  try {
    const result = await api.post("/work-session/check-out", {});
    invalidate(QUERY_KEYS.workSession);
    return result;
  } catch (err) {
    console.error("Failed to check out", err);
    throw err;
  }
}
async function loadAuditLogs() {
  try {
    const logs = await api.get("/audit-logs");
    invalidate(QUERY_KEYS.auditLogs);
    return logs;
  } catch (err) {
    console.error("Failed to load audit logs", err);
    throw err;
  }
}
async function loadWorkDays() {
  try {
    const days = await api.get("/work-days");
    invalidate(QUERY_KEYS.workDays);
    return days;
  } catch (err) {
    console.error("Failed to load workday folders", err);
    throw err;
  }
}
async function loadWorkDay(date) {
  var _a;
  try {
    const day = await api.get(`/work-days/${date}`);
    (_a = getQc()) == null ? void 0 : _a.setQueryData(["work-day"], day);
    return day;
  } catch (err) {
    console.error("Failed to load workday folder", err);
    throw err;
  }
}
function get() {
  const qc = getQc();
  if (!qc) return seed();
  return {
    requests: qc.getQueryData(QUERY_KEYS.bookings) ?? [],
    doctors: qc.getQueryData(QUERY_KEYS.doctors) ?? DOCTORS,
    services: qc.getQueryData(QUERY_KEYS.services) ?? SERVICES,
    products: qc.getQueryData(QUERY_KEYS.products) ?? [],
    orders: qc.getQueryData(QUERY_KEYS.orders) ?? [],
    reviews: qc.getQueryData(QUERY_KEYS.reviews) ?? CLINIC_REVIEWS.map((review, index) => ({
      ...review,
      id: `clinic-review-${index + 1}`,
      productId: "clinic",
      status: "approved",
      createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
    })),
    payments: qc.getQueryData(QUERY_KEYS.payments) ?? [],
    clients: qc.getQueryData(QUERY_KEYS.clients) ?? [],
    settings: qc.getQueryData(QUERY_KEYS.settings) ?? { ...CLINIC },
    workSession: qc.getQueryData(QUERY_KEYS.workSession) ?? null,
    auditLogs: qc.getQueryData(QUERY_KEYS.auditLogs) ?? [],
    workDays: qc.getQueryData(QUERY_KEYS.workDays) ?? [],
    workDay: qc.getQueryData(["work-day"]) ?? null
  };
}
function formatPrice(price, currency = "EGP") {
  const n = Number.isFinite(price) ? price : 0;
  return currency === "$" ? `$${n.toFixed(2)}` : `${currency} ${n.toFixed(2)}`;
}
function formatDate(value, locale) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale || "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
const CART_KEY = "paw-m:cart";
function readCart() {
  const raw = storageGet("local", CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.id === "string") : [];
  } catch {
    return [];
  }
}
let state$1 = readCart();
const listeners$1 = /* @__PURE__ */ new Set();
function emit$1() {
  for (const l of listeners$1) l();
}
function commit$1(next) {
  state$1 = next;
  storageSet("local", CART_KEY, JSON.stringify(next));
  emit$1();
}
function subscribe$1(listener) {
  listeners$1.add(listener);
  return () => listeners$1.delete(listener);
}
function getSnapshot$1() {
  return state$1;
}
const serverSnapshot$1 = [];
function useCart() {
  return useSyncExternalStore(subscribe$1, getSnapshot$1, () => serverSnapshot$1);
}
function useCartCount() {
  return useSyncExternalStore(
    subscribe$1,
    () => state$1.reduce((n, i) => n + i.qty, 0),
    () => 0
  );
}
function addToCart(product, qty = 1) {
  const safeQty = Math.max(1, qty);
  const existing = state$1.find((i) => i.id === product.id);
  if (existing) {
    commit$1(
      state$1.map(
        (i) => i.id === product.id ? { ...i, qty: Math.min(i.qty + safeQty, Math.max(1, i.stock)) } : i
      )
    );
  } else {
    commit$1([
      ...state$1,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: safeQty,
        stock: product.stock
      }
    ]);
  }
}
function setCartQty(id, qty) {
  commit$1(
    state$1.map(
      (i) => i.id === id ? { ...i, qty: Math.min(Math.max(1, qty), Math.max(1, i.stock)) } : i
    )
  );
}
function removeFromCart(id) {
  commit$1(state$1.filter((i) => i.id !== id));
}
function clearCart() {
  commit$1([]);
  storageRemove("local", CART_KEY);
}
function CartDrawer({ open, onClose }) {
  const { t } = useI18n();
  const cart = useCart();
  const { settings } = useClinicStore();
  const total = cart.reduce((n, i) => n + i.qty * i.price, 0);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-[2px]",
        onClick: onClose
      },
      "cart-backdrop"
    ),
    /* @__PURE__ */ jsxs(
      motion.aside,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        className: "fixed inset-y-0 right-0 z-[90] flex w-full max-w-sm flex-col bg-card shadow-raised",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-4", children: [
            /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "size-4" }),
              " ",
              t("cart.title")
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "aria-label": t("header.closeMenu"),
                children: /* @__PURE__ */ jsx(X, { className: "size-5" })
              }
            )
          ] }),
          cart.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "size-10 text-muted-foreground" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("cart.empty") }),
            /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", onClick: onClose, children: /* @__PURE__ */ jsx(Link, { to: "/store", children: t("cart.continue") }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-4 overflow-y-auto px-5 py-4", children: cart.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              item.image ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.image,
                  alt: "",
                  className: "size-16 shrink-0 rounded-xl border border-border bg-muted object-contain p-1"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "size-16 shrink-0 rounded-xl border border-border bg-muted" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm font-medium leading-snug", children: item.name }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: formatPrice(item.price, settings.currency) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setCartQty(item.id, item.qty - 1),
                      className: "grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground",
                      "aria-label": t("store.decreaseQty"),
                      children: /* @__PURE__ */ jsx(Minus, { className: "size-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "w-8 text-center text-xs font-semibold", children: item.qty }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setCartQty(item.id, item.qty + 1),
                      className: "grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground",
                      "aria-label": t("store.increaseQty"),
                      children: /* @__PURE__ */ jsx(Plus, { className: "size-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => removeFromCart(item.id),
                      className: "ml-auto grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                      "aria-label": t("cart.remove"),
                      children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: formatPrice(item.price * item.qty, settings.currency) })
            ] }, item.id)) }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-border px-5 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: t("cart.total") }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: formatPrice(total, settings.currency) })
              ] }),
              /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4 w-full shadow-glow", onClick: onClose, children: /* @__PURE__ */ jsx(Link, { to: "/store/checkout", children: t("cart.checkout") }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", className: "mt-2 w-full", onClick: onClose, children: /* @__PURE__ */ jsx(Link, { to: "/store", children: t("cart.continue") }) })
            ] })
          ] })
        ]
      },
      "cart-panel"
    )
  ] }) });
}
const WISHLIST_KEY = "paw-m:wishlist";
function readWishlist() {
  const raw = storageGet("local", WISHLIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}
let state = readWishlist();
const listeners = /* @__PURE__ */ new Set();
function emit() {
  for (const l of listeners) l();
}
function commit(next) {
  state = next;
  storageSet("local", WISHLIST_KEY, JSON.stringify(next));
  emit();
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() {
  return state;
}
function useWishlist() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
function useIsWished(id) {
  return useSyncExternalStore(
    subscribe,
    () => state.includes(id),
    () => false
  );
}
const serverSnapshot = [];
function isWished(id) {
  return state.includes(id);
}
function toggleWishlist(id) {
  const wished = isWished(id);
  commit(wished ? state.filter((x) => x !== id) : [...state, id]);
  return !wished;
}
const LANG_COOKIE = "paw_m_lang";
function parseLang(value) {
  return value === "ar" ? "ar" : "en";
}
const readLangCookie = () => parseLang(getCookie(LANG_COOKIE));
function writeLangCookie(lang, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
function I18nProvider({
  children,
  initialLang = "en"
}) {
  const [lang, setLangState] = useState(initialLang);
  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(LANG_KEY);
    } catch {
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
    }
  }, [lang]);
  const setLang = useCallback((next) => {
    setLangState(next);
    applyLang(next);
    writeLangCookie(next);
  }, []);
  const t = useCallback(
    (key, params) => {
      let str = DICTS[lang][key] ?? EN[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang]
  );
  const tOr = useCallback(
    (key, fallback, params) => {
      const found = DICTS[lang][key] ?? EN[key];
      let str = found ?? fallback;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang]
  );
  const value = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t,
      tOr,
      setLang,
      toggleLang: () => setLang(lang === "en" ? "ar" : "en")
    }),
    [lang, t, tOr, setLang]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function LanguageToggle({ className = "" }) {
  const { lang, toggleLang } = useI18n();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: toggleLang,
      "aria-label": lang === "en" ? "Switch to العربية" : "Switch to English",
      className: `grid size-9 place-items-center rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`,
      children: lang === "en" ? "ع" : "EN"
    }
  );
}
const ThemeContext = createContext(null);
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
function useNav() {
  const { t } = useI18n();
  return [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/doctors", label: t("nav.doctors") },
    { to: "/store", label: t("nav.store") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") }
  ];
}
function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const NAV = useNav();
  const count = useCartCount();
  const wished = useWishlist();
  const [mounted, setMounted] = useState(false);
  const showAccount = mounted && clientIsAuthed();
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background shadow-card" : "border-b border-transparent bg-transparent"
      ),
      style: scrolled ? { borderBottom: "1px solid var(--border)" } : void 0,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": t("header.homeAria"), children: /* @__PURE__ */ jsx(PawMLogo, {}) }),
          /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-1 md:flex", "aria-label": t("header.mainAria"), children: NAV.map((item) => /* @__PURE__ */ jsx(
            Link,
            {
              to: item.to,
              className: "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              activeOptions: { exact: item.to === "/" },
              activeProps: { className: "text-foreground" },
              children: item.label
            },
            item.to
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(LanguageToggle, {}),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggle,
                "aria-label": dark ? t("header.lightMode") : t("header.darkMode"),
                className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                children: dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: telHref(settings.emergency) ?? void 0,
                className: "hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "size-4" }),
                  settings.emergency
                ]
              }
            ),
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", className: "hidden shadow-glow sm:inline-flex", children: /* @__PURE__ */ jsx(Link, { to: "/book", children: t("nav.book") }) }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/store/wishlist",
                "aria-label": t("header.wishlistAria"),
                className: "relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsx(Heart, { className: "size-4" }),
                  wished.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground", children: wished.length })
                ]
              }
            ),
            showAccount && /* @__PURE__ */ jsx(
              Link,
              {
                to: "/account",
                "aria-label": "My Account",
                title: "My Account",
                className: "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                children: /* @__PURE__ */ jsx(User, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setCartOpen(true),
                "aria-label": t("header.cartAria"),
                className: "relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "size-4" }),
                  count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground", children: count })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "grid size-9 place-items-center rounded-lg text-foreground md:hidden",
                onClick: () => setOpen((o) => !o),
                "aria-label": open ? t("header.closeMenu") : t("header.openMenu"),
                "aria-expanded": open,
                children: open ? /* @__PURE__ */ jsx(X, { className: "size-5" }) : /* @__PURE__ */ jsx(Menu, { className: "size-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            className: "overflow-hidden border-t border-border bg-background md:hidden",
            children: /* @__PURE__ */ jsxs(
              "nav",
              {
                className: "mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4",
                "aria-label": t("header.mobileAria"),
                children: [
                  NAV.map((item, i) => /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: 0.06 * i, duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      children: /* @__PURE__ */ jsx(
                        Link,
                        {
                          to: item.to,
                          onClick: () => setOpen(false),
                          className: "block rounded-lg bg-muted/50 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground",
                          children: item.label
                        }
                      )
                    },
                    item.to
                  )),
                  /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.3, duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      children: /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-2 w-full shadow-glow", children: /* @__PURE__ */ jsx(Link, { to: "/book", onClick: () => setOpen(false), children: t("nav.book") }) })
                    }
                  )
                ]
              }
            )
          },
          "mobile-menu"
        ) }),
        /* @__PURE__ */ jsx(CartDrawer, { open: cartOpen, onClose: () => setCartOpen(false) })
      ]
    }
  );
}
const EASE = [0.16, 1, 0.3, 1];
function Reveal({
  children,
  delay = 0,
  y = 16,
  className
}) {
  const reduce = useReducedMotion();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className,
      initial: reduce ? { opacity: 0 } : { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.55, delay, ease: EASE },
      children
    }
  );
}
function CountUp({
  value,
  suffix = "",
  duration = 1400
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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
  }, [inView, value, duration, reduce]);
  return /* @__PURE__ */ jsxs("span", { ref, children: [
    display.toLocaleString(),
    suffix
  ] });
}
const FLOATING_PAWS = [
  { left: "6%", size: 18, delay: 0, duration: 9 },
  { left: "16%", size: 12, delay: 1.6, duration: 7.5 },
  { left: "38%", size: 22, delay: 0.9, duration: 10.5 },
  { left: "55%", size: 14, delay: 2.4, duration: 8 },
  { left: "72%", size: 20, delay: 0.4, duration: 9.5 },
  { left: "88%", size: 13, delay: 1.2, duration: 7 },
  { left: "95%", size: 17, delay: 2.9, duration: 8.8 }
];
const MARQUEE_ITEMS = 5;
function SiteFooter() {
  const { settings } = useClinicStore();
  const { t } = useI18n();
  const COLUMNS = [
    {
      heading: t("footer.clinic"),
      links: [
        { to: "/services", label: t("nav.services") },
        { to: "/doctors", label: t("footer.vets") },
        { to: "/about", label: t("footer.about") },
        { to: "/contact", label: t("footer.contact") }
      ]
    },
    {
      heading: t("footer.care"),
      links: [
        { to: "/book", label: t("nav.book") },
        { to: "/services", label: t("footer.services") },
        { to: "/store", label: t("nav.store") },
        { to: "/store/wishlist", label: t("header.wishlistAria") }
      ]
    }
  ];
  return /* @__PURE__ */ jsxs("footer", { className: "relative overflow-hidden rounded-t-[2.5rem] border border-b-0 border-border bg-surface", children: [
    /* @__PURE__ */ jsx("div", { className: "hero-gradient pointer-events-none absolute inset-0 opacity-50" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-20 bottom-24 size-80 rounded-full bg-brass/15 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: FLOATING_PAWS.map((paw, i) => /* @__PURE__ */ jsx(
      PawPrint,
      {
        className: "animate-paw-float absolute bottom-8 text-primary/10",
        style: {
          left: paw.left,
          width: paw.size,
          height: paw.size,
          animationDelay: `${paw.delay}s`,
          animationDuration: `${paw.duration}s`
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-between gap-5 border-b border-border/70 py-8 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(CalendarHeart, { className: "size-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: t("footer.readyTitle") }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: t("footer.readyDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          settings.emergency && /* @__PURE__ */ jsx("a", { href: telHref(settings.emergency) ?? void 0, children: /* @__PURE__ */ jsxs(
            motion.span,
            {
              whileHover: { scale: 1.03 },
              className: "inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "relative flex size-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70" }),
                  /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-2 rounded-full bg-destructive" })
                ] }),
                t("hero.emergency")
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              className: "shadow-glow transition-transform hover:scale-[1.03]",
              children: /* @__PURE__ */ jsxs(Link, { to: "/book", children: [
                t("footer.bookVisit"),
                /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 rtl:rotate-180" })
              ] })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-10 py-14 md:grid-cols-[1.35fr_1fr_1fr]", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur", children: [
          /* @__PURE__ */ jsx(PawMLogo, {}),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground", children: t("footer.tagline") }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://maps.app.goo.gl/uGR5EibNi28JSVmP7",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "group mt-4 flex max-w-sm items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
              children: [
                /* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary transition-transform group-hover:scale-110" }),
                /* @__PURE__ */ jsx("span", { children: t("footer.address") })
              ]
            }
          )
        ] }) }) }),
        COLUMNS.map((col, i) => /* @__PURE__ */ jsx(Reveal, { delay: 0.08 + i * 0.08, children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/70 bg-background/55 p-6 backdrop-blur", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5 text-brass" }),
            col.heading
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3", children: col.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: link.to,
              className: "group relative inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              children: [
                link.label,
                /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180 rtl:-translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0" }),
                /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" })
              ]
            }
          ) }, link.label)) })
        ] }) }, col.heading))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative border-t border-border/70 bg-background/40", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "overflow-hidden py-3",
          style: {
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)"
          },
          children: /* @__PURE__ */ jsx("div", { className: "animate-marquee flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground", children: [0, 1].map((half) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-8", children: Array.from({ length: MARQUEE_ITEMS }, (_, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-8", children: [
            /* @__PURE__ */ jsx("span", { children: t(`footer.marquee.${i}`) }),
            /* @__PURE__ */ jsx(PawPrint, { className: "size-3 text-primary/40" })
          ] }, i)) }, half)) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          settings.name,
          " ",
          t("footer.rights")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/dashboard",
              className: "inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-foreground",
              children: [
                /* @__PURE__ */ jsx(LayoutDashboard, { className: "size-3.5" }),
                t("nav.staff")
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "hidden sm:block", children: t("footer.accred") })
        ] })
      ] })
    ] })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const THEME_COOKIE = "paw-m-theme";
function parseTheme(value) {
  return value === "dark" ? "dark" : "light";
}
const readThemeCookie = () => parseTheme(getCookie(THEME_COOKIE));
function writeThemeCookie(theme, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
function ThemeProvider({
  children,
  initialDark = false
}) {
  const [dark, setDark] = useState(initialDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      writeThemeCookie(next ? "dark" : "light");
      try {
        localStorage.setItem("paw-m:theme", next ? "dark" : "light");
      } catch {
      }
      return next;
    });
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { dark, toggle }, children });
}
function reportRuntimeError(error, context = {}) {
  var _a, _b, _c;
  if (typeof window === "undefined") return;
  (_b = (_a = window.__runtimeEvents) == null ? void 0 : _a.captureException) == null ? void 0 : _b.call(
    _a,
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
  const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : void 0;
  (_c = window.__reportRuntimeError) == null ? void 0 : _c.call(window, {
    message,
    ...stack !== void 0 && { stack },
    filename: window.location.pathname
  });
}
const __vite_import_meta_env__$2 = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "TSS_CLIENT_OUTPUT_DIR": "dist/client", "TSS_DEV_SERVER": "false", "TSS_ROUTER_BASEPATH": "", "TSS_SERVER_FN_BASE": "/_serverFn/" };
function NotFoundComponent() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { className: "hero-gradient flex min-h-[70vh] items-center justify-center px-5 pb-24 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "mx-auto grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(PawMMark, { className: "h-8 w-8" }) }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 text-5xl font-bold tracking-tight text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-3 text-xl font-semibold text-foreground", children: t("notfound.title") }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("notfound.desc") }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "shadow-glow", children: /* @__PURE__ */ jsx(Link, { to: "/", children: t("notfound.home") }) }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: t("notfound.contact") }) })
    ] })
  ] }) });
}
function RouteLoadingSkeleton() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("loading") })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const { t } = useI18n();
  const router2 = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("section", { className: "hero-gradient flex min-h-[70vh] items-center justify-center bg-background px-5 pb-24 pt-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "mx-auto grid size-14 place-items-center rounded-3xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(PawMMark, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 text-xl font-semibold tracking-tight text-foreground", children: t("error.title") }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("error.desc") }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: t("error.retry")
        }
      ),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx("a", { href: "/", children: t("error.home") }) })
    ] })
  ] }) });
}
const SITE_URL$1 = __vite_import_meta_env__$2["VITE_SITE_URL"] || "https://pawmclinnic.com";
const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";
function apiOrigin() {
  try {
    const url = __vite_import_meta_env__$2["VITE_API_URL"];
    if (!url) return null;
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}
const API_ORIGIN = apiOrigin();
const Route$l = createRootRouteWithContext()({
  beforeLoad: () => ({ lang: readLangCookie(), dark: readThemeCookie() === "dark" }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paw-M Veterinary Clinic" },
      {
        name: "description",
        content: "Paw-M is a boutique veterinary hospital in New Cairo, Egypt: same-day diagnostics, transparent estimates and 24/7 emergency care for dogs, cats, birds, rabbits and exotic pets."
      },
      { name: "author", content: "Paw-M Veterinary Clinic" },
      { property: "og:site_name", content: "Paw-M Veterinary Clinic" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL$1}/og-image.png` },
      { property: "og:url", content: SITE_URL$1 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL$1}/og-image.png` },
      { name: "theme-color", content: "#7BA882" },
      { name: "robots", content: "index, follow" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      ...API_ORIGIN ? [
        { rel: "preconnect", href: API_ORIGIN },
        { rel: "dns-prefetch", href: API_ORIGIN }
      ] : [],
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "canonical", href: SITE_URL$1 },
      { rel: "alternate", hrefLang: "en", href: SITE_URL$1 },
      { rel: "alternate", hrefLang: "ar", href: `${SITE_URL$1}?lang=ar` },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL$1 }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE_URL$1}/#clinic`,
          name: "Paw-M Veterinary Clinic",
          alternateName: "Paw Clinic Madinaty",
          description: "Boutique veterinary hospital in New Cairo providing same-day diagnostics, transparent estimates and 24/7 emergency care.",
          url: SITE_URL$1,
          telephone: "+201210105624",
          email: "paw.mclinic@gmail.com",
          image: `${SITE_URL$1}/og-image.png`,
          logo: `${SITE_URL$1}/favicon.svg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Craft Zoon, Second New Cairo",
            addressLocality: "Cairo",
            addressRegion: "Cairo Governorate",
            postalCode: "19519",
            addressCountry: "EG"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 30.0444,
            longitude: 31.3594
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              opens: "09:00",
              closes: "23:30"
            }
          ],
          priceRange: "$$",
          areaServed: {
            "@type": "City",
            name: "Cairo"
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Veterinary Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "General Checkup" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vaccination" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Surgery" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Care" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dental Care" } }
            ]
          }
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  const { lang, dark } = Route$l.useRouteContext();
  const classes = [lang === "ar" ? "lang-ar" : void 0, dark ? "dark" : void 0].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs("html", { lang, dir: lang === "ar" ? "rtl" : "ltr", className: classes, children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient, lang, dark } = Route$l.useRouteContext();
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  useEffect(() => {
    let cancelled = false;
    const loadId = window.setTimeout(() => {
      if (cancelled) return;
      refreshPublicData();
      if (isAuthed()) refreshClinicData();
    }, 0);
    let link;
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
      window.clearTimeout(loadId);
      window.clearTimeout(id);
    };
  }, []);
  return /* @__PURE__ */ jsx(I18nProvider, { initialLang: lang, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(ThemeProvider, { initialDark: dark, children: [
    !isDashboard && /* @__PURE__ */ jsx(IntroAnimation, {}),
    !isDashboard && /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx(
      motion.main,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        className: "min-h-screen",
        children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteLoadingSkeleton, {}), children: /* @__PURE__ */ jsx(Outlet, {}) })
      },
      pathname
    ),
    !isDashboard && /* @__PURE__ */ jsx(SiteFooter, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true })
  ] }) }) });
}
const $$splitComponentImporter$j = () => import("./store-B27sVofe.js");
const Route$k = createFileRoute("/store")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./staff-CMAzX693.js");
const Route$j = createFileRoute("/staff")({
  head: () => ({
    meta: [{
      title: "Staff Portal — Paw-M"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const __vite_import_meta_env__$1 = {};
const BASE_URL = __vite_import_meta_env__$1["VITE_SITE_URL"] || "https://pawmclinnic.com";
const Route$i = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/doctors", changefreq: "monthly", priority: "0.8" },
          { path: "/about", changefreq: "yearly", priority: "0.6" },
          { path: "/contact", changefreq: "yearly", priority: "0.7" },
          { path: "/book", changefreq: "monthly", priority: "0.9" },
          { path: "/store", changefreq: "weekly", priority: "0.8" },
          { path: "/store/wishlist", changefreq: "monthly", priority: "0.4" }
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const __vite_import_meta_env__ = {};
const SITE_URL = __vite_import_meta_env__["VITE_SITE_URL"] || "https://pawmclinnic.com";
function withSiteUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path}`;
}
function ogMeta(title2, description2, path) {
  const url = withSiteUrl(path);
  return [
    { title: title2 },
    { name: "description", content: description2 },
    { property: "og:title", content: title2 },
    { property: "og:description", content: description2 },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${SITE_URL}/og-image.png` },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title2 },
    { name: "twitter:description", content: description2 },
    { name: "twitter:image", content: `${SITE_URL}/og-image.png` }
  ];
}
const $$splitComponentImporter$h = () => import("./services-Dhc6yKce.js");
const title$9 = "Veterinary Services — Paw-M";
const description$9 = "Checkups, vaccination, surgery, emergency care, in-house laboratory, dentistry, imaging and more at Paw-M Veterinary Clinic in New Cairo, Egypt.";
const Route$h = createFileRoute("/services")({
  head: () => ({
    meta: ogMeta(title$9, description$9, "/services"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/services")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./doctors-6L0eynh_.js");
const title$8 = "Our Veterinarians — Paw-M";
const description$8 = "Meet the Paw-M veterinary team in New Cairo: internal medicine, surgery, emergency care, dentistry and exotics specialists, with live availability.";
const Route$g = createFileRoute("/doctors")({
  head: () => ({
    meta: ogMeta(title$8, description$8, "/doctors"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/doctors")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./dashboard-DdxDIRkI.js");
const Route$f = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Staff Dashboard — Paw-M"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./contact-E6plq56l.js");
const title$7 = "Contact Paw-M — Hours, Location & Emergency Line";
const description$7 = "Call, message or visit Paw-M Veterinary Clinic in New Cairo, Egypt. Emergency line answered 24/7, seven days a week.";
const Route$e = createFileRoute("/contact")({
  head: () => ({
    meta: ogMeta(title$7, description$7, "/contact"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/contact")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./cashier-J8bT4LBV.js");
const Route$d = createFileRoute("/cashier")({
  head: () => ({
    meta: [{
      title: "Cashier — Paw-M"
    }, {
      name: "description",
      content: "Point of sale for Paw-M Clinic"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./book-BfxoOwtY.js");
const title$6 = "Book an Appointment — Paw-M Veterinary Clinic";
const description$6 = "Book your pet's veterinary appointment at Paw-M in New Cairo in under a minute. Live availability across every clinician, with instant confirmation.";
const Route$c = createFileRoute("/book")({
  validateSearch: (search) => typeof search["doctor"] === "string" ? {
    doctor: search["doctor"]
  } : {},
  head: () => ({
    meta: ogMeta(title$6, description$6, "/book"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/book")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./account-DVW3LWAp.js");
const title$5 = "My Account — Paw-M Veterinary Clinic";
const description$5 = "Manage your pets, appointments, prescriptions and orders at Paw-M Veterinary Clinic in New Cairo.";
const Route$b = createFileRoute("/account")({
  head: () => ({
    meta: ogMeta(title$5, description$5, "/account"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/account")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./about-CRItSrRd.js");
const title$4 = "About Paw-M — A Boutique Veterinary Hospital in Cairo";
const description$4 = "Paw-M was built around clear diagnostics, honest estimates and medical records pet owners actually own. Our licensed veterinarians care for dogs, cats and exotic pets in New Cairo.";
const Route$a = createFileRoute("/about")({
  head: () => ({
    meta: ogMeta(title$4, description$4, "/about"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/about")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./routes-DfSp_-pS.js");
const title$3 = "Paw-M — Veterinary Clinic in Cairo, Egypt";
const description$3 = "Same-day diagnostics, transparent estimates and a 24/7 emergency team in New Cairo. Book your pet's appointment with Paw-M in under a minute.";
const Route$9 = createFileRoute("/")({
  head: () => ({
    meta: ogMeta(title$3, description$3, "/"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/")
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VeterinaryCare",
        "@id": `${SITE_URL}/#veterinary-care`,
        name: "Paw-M Veterinary Clinic",
        description: description$3,
        url: SITE_URL,
        telephone: "+201210105624",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Craft Zoon, Second New Cairo",
          addressLocality: "Cairo",
          addressRegion: "Cairo Governorate",
          postalCode: "19519",
          addressCountry: "EG"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 30.0314,
          longitude: 31.4734
        },
        priceRange: "$$",
        medicalSpecialty: "https://schema.org/VeterinaryCare"
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./store.index-BPrjvVuF.js");
const title$2 = "Pet Supply Store — Paw-M";
const description$2 = "Food, treats, toys, grooming, health and accessories for dogs and cats, available at Paw-M Veterinary Clinic in New Cairo, Egypt.";
const Route$8 = createFileRoute("/store/")({
  head: () => ({
    meta: ogMeta(title$2, description$2, "/store"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/store")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./store.wishlist-Cru6vDtk.js");
const title$1 = "Your Wishlist — Paw-M";
const description$1 = "All the products you saved at Paw-M Veterinary Clinic, back in one place.";
const Route$7 = createFileRoute("/store/wishlist")({
  head: () => ({
    meta: ogMeta(title$1, description$1, "/store/wishlist"),
    links: [{
      rel: "canonical",
      href: withSiteUrl("/store/wishlist")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./store.track-DC8crtgE.js");
const Route$6 = createFileRoute("/store/track")({
  head: () => ({
    meta: [{
      title: "Track Order — Paw-M Store"
    }, {
      name: "description",
      content: "Check the status of your Paw-M store order."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./store.checkout-Dbkk6wUE.js");
const Route$5 = createFileRoute("/store/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — Paw-M Store"
    }, {
      name: "description",
      content: "Place your pet supply order with Paw-M."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./store._productId-CbMTeKvw.js");
const Route$4 = createFileRoute("/store/$productId")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Pet Product — Paw-M Store`
    }, {
      name: "description",
      content: "Browse and buy pet supplies from Paw-M Veterinary Clinic."
    }, {
      name: "robots",
      content: "index,follow"
    }, {
      property: "og:url",
      content: withSiteUrl(`/store/${params.productId}`)
    }],
    links: [{
      rel: "canonical",
      href: withSiteUrl(`/store/${params.productId}`)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./rx.verify-Ba1G4rPN.js");
const Route$3 = createFileRoute("/rx/verify")({
  validateSearch: (search) => typeof search["code"] === "string" ? {
    code: search["code"]
  } : {},
  head: () => ({
    meta: ogMeta("Verify a Prescription — Paw-M", "Check the authenticity of a Paw-M veterinary prescription online.", "/rx/verify")
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./booking.success-CJngYQuT.js");
const title = "Appointment Confirmed — Paw-M";
const description = "Your Paw-M veterinary appointment request has been received.";
const Route$2 = createFileRoute("/booking/success")({
  validateSearch: (search) => ({
    pet: typeof search["pet"] === "string" ? search["pet"] : "",
    date: typeof search["date"] === "string" ? search["date"] : "",
    time: typeof search["time"] === "string" ? search["time"] : "",
    doctor: typeof search["doctor"] === "string" ? search["doctor"] : ""
  }),
  head: () => ({
    meta: [{
      title
    }, {
      name: "description",
      content: description
    }, {
      name: "robots",
      content: "noindex"
    }, {
      property: "og:title",
      content: title
    }, {
      property: "og:description",
      content: description
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./account.rx._rxId-Bi9jNtnf.js");
const Route$1 = createFileRoute("/account/rx/$rxId")({
  head: () => ({
    meta: [{
      title: "Prescription — My Account"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./account.pets._petId-CivFc0Ye.js");
const Route = createFileRoute("/account/pets/$petId")({
  head: ({
    params
  }) => ({
    meta: ogMeta("Pet History — My Account", "Your pet's complete visit and prescription history at Paw-M.", `/account/pets/${params.petId}`)
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StoreRoute = Route$k.update({
  id: "/store",
  path: "/store",
  getParentRoute: () => Route$l
});
const StaffRoute = Route$j.update({
  id: "/staff",
  path: "/staff",
  getParentRoute: () => Route$l
});
const SitemapDotxmlRoute = Route$i.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$l
});
const ServicesRoute = Route$h.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$l
});
const DoctorsRoute = Route$g.update({
  id: "/doctors",
  path: "/doctors",
  getParentRoute: () => Route$l
});
const DashboardRoute = Route$f.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$l
});
const ContactRoute = Route$e.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$l
});
const CashierRoute = Route$d.update({
  id: "/cashier",
  path: "/cashier",
  getParentRoute: () => Route$l
});
const BookRoute = Route$c.update({
  id: "/book",
  path: "/book",
  getParentRoute: () => Route$l
});
const AccountRoute = Route$b.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$l
});
const AboutRoute = Route$a.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$l
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const StoreIndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => StoreRoute
});
const StoreWishlistRoute = Route$7.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => StoreRoute
});
const StoreTrackRoute = Route$6.update({
  id: "/track",
  path: "/track",
  getParentRoute: () => StoreRoute
});
const StoreCheckoutRoute = Route$5.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => StoreRoute
});
const StoreProductIdRoute = Route$4.update({
  id: "/$productId",
  path: "/$productId",
  getParentRoute: () => StoreRoute
});
const RxVerifyRoute = Route$3.update({
  id: "/rx/verify",
  path: "/rx/verify",
  getParentRoute: () => Route$l
});
const BookingSuccessRoute = Route$2.update({
  id: "/booking/success",
  path: "/booking/success",
  getParentRoute: () => Route$l
});
const AccountRxRxIdRoute = Route$1.update({
  id: "/rx/$rxId",
  path: "/rx/$rxId",
  getParentRoute: () => AccountRoute
});
const AccountPetsPetIdRoute = Route.update({
  id: "/pets/$petId",
  path: "/pets/$petId",
  getParentRoute: () => AccountRoute
});
const AccountRouteChildren = {
  AccountPetsPetIdRoute,
  AccountRxRxIdRoute
};
const AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
const StoreRouteChildren = {
  StoreProductIdRoute,
  StoreCheckoutRoute,
  StoreTrackRoute,
  StoreWishlistRoute,
  StoreIndexRoute
};
const StoreRouteWithChildren = StoreRoute._addFileChildren(StoreRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AccountRoute: AccountRouteWithChildren,
  BookRoute,
  CashierRoute,
  ContactRoute,
  DashboardRoute,
  DoctorsRoute,
  ServicesRoute,
  SitemapDotxmlRoute,
  StaffRoute,
  StoreRoute: StoreRouteWithChildren,
  BookingSuccessRoute,
  RxVerifyRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Retrying a 4xx repeats a request that cannot succeed and spends more of
        // the server's shared rate-limit budget, which is how a single failure
        // cascaded into every endpoint answering 429. Only transient server and
        // network faults are retried.
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1e3 * 2 ** attempt, 8e3),
        // The store invalidates queries explicitly after every mutation, so a
        // background refetch on tab focus is unnecessary traffic.
        refetchOnWindowFocus: false
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  checkIn as $,
  ANIMAL_TYPES as A,
  Button as B,
  MIN_PASSWORD as C,
  changeCredentials as D,
  syncGoogleReviews as E,
  refreshClinicData as F,
  updateProduct as G,
  deleteProduct as H,
  createProduct as I,
  setOrderPaymentStatus as J,
  setOrderStatus as K,
  LanguageToggle as L,
  MIN_USERNAME as M,
  setReviewStatus as N,
  deleteReview as O,
  PawMLogo as P,
  loadWorkDay as Q,
  loadWorkDays as R,
  loadAuditLogs as S,
  PawMMark as T,
  useTheme as U,
  remainingLockMs as V,
  setBookingStatus as W,
  login as X,
  ApiError as Y,
  createPaymentRequest as Z,
  checkOut as _,
  useClinicStore as a,
  telHref as a0,
  waMeHref as a1,
  mailtoHref as a2,
  Reveal as a3,
  CLINIC as a4,
  formatPrice as a5,
  createOrder as a6,
  addPaymentItem as a7,
  settlePayment as a8,
  Route$c as a9,
  Route$3 as aA,
  Route$2 as aB,
  Route$1 as aC,
  Route as aD,
  verifyClientEmail as aE,
  requestClientVerification as aF,
  loginClient as aG,
  router as aH,
  currentClient as aa,
  clientIsAuthed as ab,
  bookedSlotsFor as ac,
  TIME_SLOTS as ad,
  addBookingRequest as ae,
  logoutClient as af,
  STATS as ag,
  CountUp as ah,
  WHY_US as ai,
  useWishlist as aj,
  upcomingAvailability as ak,
  BOOKING_STEPS as al,
  FAQS as am,
  trackOrder as an,
  submitPaymentProof as ao,
  useCart as ap,
  setCartQty as aq,
  removeFromCart as ar,
  clearCart as as,
  Route$4 as at,
  withSiteUrl as au,
  SITE_URL as av,
  addToCart as aw,
  createReview as ax,
  useIsWished as ay,
  toggleWishlist as az,
  currentUsername as b,
  currentRole as c,
  cn as d,
  api as e,
  formatDate as f,
  updateSettings as g,
  deletePayment as h,
  isAuthed as i,
  updatePayment as j,
  createPayment as k,
  logout as l,
  buttonVariants as m,
  getClient as n,
  deleteClient as o,
  notifyClient as p,
  deleteDoctor as q,
  saveDoctor as r,
  setClientSuspended as s,
  deleteService as t,
  useI18n as u,
  saveService as v,
  archiveBooking as w,
  deleteRequest as x,
  archiveOrder as y,
  deleteOrder as z
};
