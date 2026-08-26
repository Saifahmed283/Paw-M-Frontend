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
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, type Lang, useI18n } from "@/lib/i18n";
import { refreshClinicData, refreshPublicData } from "@/lib/clinic-store";
import { isAuthed } from "@/lib/auth";
import { readLangCookie } from "@/lib/lang-cookie";
import { readThemeCookie } from "@/lib/theme-cookie";
import { reportRuntimeError } from "@/lib/runtime-error-reporting";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notfound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notfound.desc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("notfound.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function RouteLoadingSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";

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
          "Paw-M is a boutique veterinary hospital: same-day diagnostics, transparent estimates and 24/7 emergency care.",
      },
      { name: "author", content: "Paw-M Veterinary Clinic" },
      { property: "og:site_name", content: "Paw-M" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#7BA882" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { lang, dark } = Route.useRouteContext();
  const classes = [
    lang === "ar" ? "lang-ar" : undefined,
    dark ? "dark" : undefined,
  ].filter(Boolean).join(" ") || undefined;
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={classes}
    >
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
  const { queryClient, lang } = Route.useRouteContext();
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
      </QueryClientProvider>
    </I18nProvider>
  );
}
