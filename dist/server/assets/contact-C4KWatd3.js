import { A as useClinicStore, X as telHref, Y as mailtoHref, Z as waMeHref, et as CLINIC, pt as useI18n } from "./clinic-store-Dqp8rjo-.js";
import { o as Reveal } from "./router-CEOgoo37.js";
import { a as SectionHeading } from "./sections-OCwr0IA1.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
//#region src/routes/contact.tsx?tsr-split=component
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
		className: "hero-gradient border-b border-border pb-16 pt-32 sm:pt-40",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-6xl px-5 sm:px-8",
			children: /* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: t("page.contact.eyebrow"),
				title: t("page.contact.title"),
				description: t("page.contact.desc"),
				as: "h1"
			})
		})
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
					src: "https://www.openstreetmap.org/export/embed.html?bbox=-122.4300%2C37.7450%2C-122.4000%2C37.7650&layer=mapnik",
					className: "h-[420px] w-full border-0",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade"
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
//#endregion
export { ContactPage as component };
