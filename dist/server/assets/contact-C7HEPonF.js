import { t as Breadcrumbs } from "./Breadcrumbs-Dq7NOt8M.js";
import { n as Reveal } from "./motion-primitives-Cr0Ewoch.js";
import { t as PageIntro } from "./PageIntro-GJvWqvj1.js";
import { at as mailtoHref, it as useClinicStore, lt as CLINIC, ot as telHref, st as waMeHref } from "./router-BlLx80qp.js";
import { E as useI18n } from "./api-BSVeo-E7.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
// src/routes/contact.tsx?tsr-split=component
function ContactPage() {
	const { t } = useI18n();
	const { settings } = useClinicStore();
	const contact = {
		emergency: settings.emergency,
		phone: settings.phone,
		whatsapp: settings.whatsapp,
		email: settings.email,
		address: settings.address,
		hours: CLINIC.hours
	};
	const cards = [
		{
			icon: Siren,
			label: t("contact.emergency"),
			value: contact.emergency,
			href: telHref(contact.emergency),
			urgent: true
		},
		{
			icon: Phone,
			label: t("contact.reception"),
			value: contact.phone,
			href: telHref(contact.phone)
		},
		{
			icon: MessageCircle,
			label: t("contact.whatsapp"),
			value: contact.whatsapp,
			href: waMeHref(contact.whatsapp)
		},
		{
			icon: Mail,
			label: t("contact.email"),
			value: contact.email,
			href: mailtoHref(contact.email)
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageIntro, {
		eyebrow: t("page.contact.eyebrow"),
		title: t("page.contact.title"),
		description: t("page.contact.desc"),
		crumb: /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
			label: t("crumb.home"),
			to: "/"
		}, {
			label: t("crumb.contact"),
			to: "/contact"
		}] })
	}), /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-6xl px-5 py-16 sm:px-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: cards.map((card, i) => /* @__PURE__ */ jsx(Reveal, {
				delay: i * .06,
				children: /* @__PURE__ */ jsxs("a", {
					href: card.href ?? void 0,
					className: "block h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-raised",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: card.urgent ? "grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive" : "grid size-11 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(card.icon, { className: "size-5" })
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 text-xs uppercase tracking-wider text-muted-foreground",
							children: card.label
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm font-semibold text-foreground",
							children: card.value
						})
					]
				})
			}, card.label))
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-2xl border border-border shadow-card",
				children: /* @__PURE__ */ jsx("iframe", {
					title: t("contact.map"),
					src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.744861831012!2d31.66746777507489!3d30.0728470172253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1457f5c79b7ae3ed%3A0x95e26a47780b144a!2sPaw%20Clinic%20Madinaty!5e0!3m2!1sen!2seg!4v1789144957782!5m2!1sen!2seg",
					className: "h-[420px] w-full border-0",
					loading: "lazy",
					allowFullScreen: true,
					referrerPolicy: "strict-origin-when-cross-origin"
				})
			}) }), /* @__PURE__ */ jsx(Reveal, {
				delay: .06,
				children: /* @__PURE__ */ jsxs("div", {
					className: "h-full rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [
								/* @__PURE__ */ jsx(Clock, { className: "size-4 text-primary" }),
								" ",
								t("contact.hours")
							]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-4 space-y-3",
							children: CLINIC.hours.map((h, i) => /* @__PURE__ */ jsxs("li", {
								className: "flex justify-between gap-4 text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: t(`hour.${i}`)
								}), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-foreground",
									children: h.time
								})]
							}, `${h.day}-${i}`))
						}),
						/* @__PURE__ */ jsxs("h3", {
							className: "mt-8 flex items-center gap-2 text-sm font-semibold",
							children: [
								/* @__PURE__ */ jsx(MapPin, { className: "size-4 text-primary" }),
								" ",
								t("contact.address")
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: contact.address
						})
					]
				})
			})]
		})]
	})] });
}
export { ContactPage as component };
