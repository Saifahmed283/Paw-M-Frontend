import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
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

export function SiteHeader() {
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background shadow-card" : "border-b border-transparent bg-transparent",
      )}
      style={scrolled ? { borderBottom: "1px solid var(--border)" } : undefined}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" aria-label={t("header.homeAria")}>
          <PawMLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t("header.mainAria")}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={toggle}
            aria-label={dark ? t("header.lightMode") : t("header.darkMode")}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={telHref(settings.emergency) ?? undefined}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
          >
            <Phone className="size-4" />
            {settings.emergency}
          </a>
          <Button asChild size="sm" className="hidden shadow-glow sm:inline-flex">
            <Link to="/book">{t("nav.book")}</Link>
          </Button>
          <Link
            to="/store/wishlist"
            aria-label={t("header.wishlistAria")}
            className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Heart className="size-4" />
            {wished.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground">
                {wished.length}
              </span>
            )}
          </Link>
          {showAccount && (
            <Link
              to="/account"
              aria-label="My Account"
              title="My Account"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <User className="size-4" />
            </Link>
          )}
          <button
            onClick={() => setCartOpen(true)}
            aria-label={t("header.cartAria")}
            className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            className="grid size-9 place-items-center rounded-lg text-foreground md:hidden"
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav
              className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4"
              aria-label={t("header.mobileAria")}
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg bg-muted/50 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button asChild className="mt-2 w-full shadow-glow">
                  <Link to="/book" onClick={() => setOpen(false)}>
                    {t("nav.book")}
                  </Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
