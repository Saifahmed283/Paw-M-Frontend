import { Link } from "@tanstack/react-router";
import { CalendarHeart, PhoneCall, ShoppingBag } from "lucide-react";

import { GlassPanel } from "@/design-system/primitives/GlassPanel";
import { useCartCount } from "@/lib/cart-store";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { telHref } from "@/lib/sanitize";
import { openCart } from "@/lib/ui-store";

/** Mobile-only paper dock. Three large tactile targets, always reachable. */
export function ActionDock() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const count = useCartCount();
  const phoneHref = telHref(settings.emergency);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <GlassPanel
        tone="solid"
        elevation={3}
        className="pm-rise pointer-events-auto mx-auto flex max-w-sm items-center justify-around gap-1 px-2 py-2"
      >
        <Link
          to="/book"
          className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-transform active:scale-95"
        >
          <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--primary-tint)] text-primary ring-1 ring-primary/20">
            <CalendarHeart className="size-5" />
          </span>
          <span className="text-[11px] font-semibold text-ink">{t("dock.book")}</span>
        </Link>

        <a
          href={phoneHref ?? undefined}
          className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-transform active:scale-95"
        >
          <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--status-critical-bg)] text-urgent ring-1 ring-urgent/20">
            <PhoneCall className="size-5" />
          </span>
          <span className="text-[11px] font-semibold text-ink">{t("dock.call")}</span>
        </a>

        <button
          type="button"
          onClick={openCart}
          aria-label={t("header.cartAria")}
          className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-transform active:scale-95"
        >
          <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--accent-tint)] text-accent ring-1 ring-accent/20">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold leading-4 text-primary-foreground tabular-nums">
                {count}
              </span>
            )}
          </span>
          <span className="text-[11px] font-semibold text-ink">{t("dock.bag")}</span>
        </button>
      </GlassPanel>
    </div>
  );
}
