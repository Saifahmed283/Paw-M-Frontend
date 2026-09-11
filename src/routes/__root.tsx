import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, Suspense, type ReactNode } from "react";
import { motion } from "motion/react";

import appCss from "../styles.css?url";
import { IntroAnimation } from "@/components/IntroAnimation";
import { PawMMark } from "@/components/PawMMark";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { I18nProvider } from "@/lib/i18n-components";
import { type Lang, useI18n } from "@/lib/i18n";
import { refreshClinicData, refreshPublicData } from "@/lib/clinic-store";
import { isAuthed } from "@/lib/auth";
import { readLangCookie } from "@/lib/lang-cookie";
import { readThemeCookie } from "@/lib/theme-cookie";
import { ThemeProvider } from "@/lib/use-theme";
import { reportRuntimeError } from "@/lib/runtime-error-reporting";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <section className="hero-gradient flex min-h-[70vh] items-center justify-center px-5 pb-24 pt-32 sm:pt-40">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary">
          <PawMMark className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">{t("notfound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notfound.desc")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="shadow-glow">
            <Link to="/">{t("notfound.home")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">{t("notfound.contact")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function RouteLoadingSkeleton() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const { t } = useI18n();
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="hero-gradient flex min-h-[70vh] items-center justify-center bg-background px-5 pb-24 pt-32">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-primary/10 text-primary">
          <PawMMark className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.desc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.retry")}
          </button>
          <Button asChild variant="outline">
            <a href="/">{t("error.home")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

const SITE_URL = import.meta.env["VITE_SITE_URL"] || "https://pawmclinnic.com";
const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";

function apiOrigin(): string | null {
  try {
    const url = import.meta.env["VITE_API_URL"];
    if (!url) return null;
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}

const API_ORIGIN = apiOrigin();

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: () => ({ lang: readLangCookie(), dark: readThemeCookie() === "dark" }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paw-M Veterinary Clinic" },
      {
        name: "description",
        content:
          "Paw-M is a boutique veterinary hospital in New Cairo, Egypt: same-day diagnostics, transparent estimates and 24/7 emergency care for dogs, cats, birds, rabbits and exotic pets.",
      },
      { name: "author", content: "Paw-M Veterinary Clinic" },
      { property: "og:site_name", content: "Paw-M Veterinary Clinic" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
      { name: "theme-color", content: "#7BA882" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      ...(API_ORIGIN
        ? [{ rel: "preconnect", href: API_ORIGIN }, { rel: "dns-prefetch", href: API_ORIGIN }]
        : []),
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "en", href: SITE_URL },
      { rel: "alternate", hrefLang: "ar", href: `${SITE_URL}?lang=ar` },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#clinic`,
          name: "Paw-M Veterinary Clinic",
          alternateName: "Paw Clinic Madinaty",
          description:
            "Boutique veterinary hospital in New Cairo providing same-day diagnostics, transparent estimates and 24/7 emergency care.",
          url: SITE_URL,
          telephone: "+201210105624",
          email: "paw.mclinic@gmail.com",
          image: `${SITE_URL}/og-image.png`,
          logo: `${SITE_URL}/favicon.svg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Craft Zoon, Second New Cairo",
            addressLocality: "Cairo",
            addressRegion: "Cairo Governorate",
            postalCode: "19519",
            addressCountry: "EG",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 30.0444,
            longitude: 31.3594,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "09:00",
              closes: "23:30",
            },
          ],
          priceRange: "$$",
          areaServed: {
            "@type": "City",
            name: "Cairo",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Veterinary Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "General Checkup" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vaccination" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Surgery" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Care" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dental Care" } },
            ],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { lang, dark } = Route.useRouteContext();
  const classes =
    [lang === "ar" ? "lang-ar" : undefined, dark ? "dark" : undefined].filter(Boolean).join(" ") ||
    undefined;
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={classes}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient, lang, dark } = Route.useRouteContext();
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    // Kick off the clinic-data fetch only after the hydration pass has fully
    // committed. If it started from this effect directly, the (very fast,
    // localhost) response could land while React was still hydrating the
    // nested routes, re-rendering them with fetched data and throwing a
    // hydration mismatch that left the router unable to render navigations.
    let cancelled = false;
    const loadId = window.setTimeout(() => {
      if (cancelled) return;
      refreshPublicData();
      if (isAuthed()) refreshClinicData();
    }, 0);
    // Font stylesheet is loaded after first paint so a slow or unreachable
    // Google Fonts endpoint can never delay the initial render.
    let link: HTMLLinkElement | undefined;
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

  return (
    <I18nProvider initialLang={lang}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider initialDark={dark}>
          {!isDashboard && <IntroAnimation />}
          {!isDashboard && <SiteHeader />}
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen"
          >
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Suspense fallback={<RouteLoadingSkeleton />}>
              <Outlet />
            </Suspense>
          </motion.main>
          {!isDashboard && <SiteFooter />}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
