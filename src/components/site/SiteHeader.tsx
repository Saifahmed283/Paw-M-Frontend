import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Menu, Moon, Phone, ShoppingBag, Sun, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { PawMLogo } from "@/components/PawMMark";
import { CartDrawer } from "@/components/site/CartDrawer";
import { useClinicStore } from "@/lib/clinic-store";
import { useCartCount } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/lib/i18n-components";
import { telHref } from "@/lib/sanitize";
import { closeCart, openCart, useCartOpen } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/use-theme-hook";
import { clientIsAuthed } from "@/lib/client-auth";

function useNav() {
  const { t } = useI18n();
  return [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/doctors", label: t("nav.doctors") },
    { to: "/store", label: t("nav.store") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;
}

const iconButton =
  "relative grid size-9 place-items-center rounded-[var(--radius-md)] text-ink-soft transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const NAV = useNav();
  const count = useCartCount();
  const wished = useWishlist();
  const cartOpen = useCartOpen();
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const showAccount = mounted && clientIsAuthed();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--ease-entrance)]",
        scrolled || pathname !== "/"
          ? "border-b border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1 px-3 sm:gap-4 sm:px-8">
        <Link to="/" aria-label={t("header.homeAria")} className="shrink-0">
          <PawMLogo />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label={t("header.mainAria")}>
          {NAV.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-[var(--navy-900)] dark:text-white"
                    : "text-ink-soft hover:bg-[var(--surface-2)] hover:text-foreground",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 inset-x-3 h-px bg-[var(--gold-500)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <LanguageToggle className="hidden sm:grid" />
          <button
            onClick={toggle}
            aria-label={dark ? t("header.lightMode") : t("header.darkMode")}
            className={cn(iconButton, "hidden sm:grid")}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={telHref(settings.emergency) ?? undefined}
            className="hidden items-center gap-2 rounded-[var(--radius-md)] border border-[var(--line)] px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-[var(--urgent)] hover:text-urgent lg:inline-flex"
          >
            <span className="size-1.5 rounded-full bg-urgent" />
            <span className="font-mono text-xs tabular-nums" dir="ltr">
              {settings.emergency}
            </span>
          </a>
          <Button asChild size="sm" className="hidden shadow-[var(--shadow-1)] sm:inline-flex">
            <Link to="/book">{t("nav.book")}</Link>
          </Button>
          <Link
            to="/store/wishlist"
            aria-label={t("header.wishlistAria")}
            className={cn(iconButton, "hidden sm:grid")}
          >
            <Heart className="size-4" />
            {wished.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--gold-500)] px-1 font-mono text-[10px] font-bold leading-4 text-[var(--navy-900)] tabular-nums">
                {wished.length}
              </span>
            )}
          </Link>
          {showAccount && (
            <Link
              to="/account"
              aria-label="My Account"
              title="My Account"
              className={cn(iconButton, "hidden sm:grid")}
            >
              <User className="size-4" />
            </Link>
          )}
          <button onClick={openCart} aria-label={t("header.cartAria")} className={iconButton}>
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--navy-700)] px-1 font-mono text-[10px] font-bold leading-4 text-white tabular-nums">
                {count}
              </span>
            )}
          </button>
          <button
            className="grid size-9 place-items-center rounded-[var(--radius-md)] text-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] md:hidden"
          >
            <nav
              className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4"
              aria-label={t("header.mobileAria")}
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-colors",
                      isActive(item.to)
                        ? "bg-[var(--primary-tint)] text-[var(--navy-900)] dark:text-white"
                        : "text-ink-soft hover:bg-[var(--surface-2)] hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
                <LanguageToggle className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
                <button
                  onClick={toggle}
                  aria-label={dark ? t("header.lightMode") : t("header.darkMode")}
                  className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-ink-soft"
                >
                  {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
                <Link
                  to="/store/wishlist"
                  onClick={() => setOpen(false)}
                  aria-label={t("header.wishlistAria")}
                  className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-ink-soft"
                >
                  <Heart className="size-4" />
                </Link>
                {showAccount && (
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    aria-label="My Account"
                    className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-ink-soft"
                  >
                    <User className="size-4" />
                  </Link>
                )}
              </div>
              <Button asChild className="mt-2 w-full">
                <Link to="/book" onClick={() => setOpen(false)}>
                  {t("nav.book")}
                </Link>
              </Button>
              <a
                href={telHref(settings.emergency) ?? undefined}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold text-urgent"
              >
                <Phone className="size-3.5" />
                <span className="font-mono tabular-nums" dir="ltr">
                  {settings.emergency}
                </span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </header>
  );
}
