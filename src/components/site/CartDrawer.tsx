import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { removeFromCart, setCartQty, useCart } from "@/lib/cart-store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const cart = useCart();
  const { settings } = useClinicStore();
  const total = cart.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[var(--navy-950)]/50"
            onClick={onClose}
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-sm flex-col border-s-2 border-s-[var(--gold-500)] bg-[var(--surface)] shadow-[var(--shadow-3)]"
          >
            <div className="flex items-center justify-between border-b-2 border-b-[var(--gold-500)] bg-[var(--navy-900)] px-5 py-4 text-white">
              <h2 className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]">
                <ShoppingBag className="size-4" /> {t("cart.title")}
              </h2>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-[var(--radius-md)] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={t("header.closeMenu")}
              >
                <X className="size-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="size-10 text-ink-faint" />
                <p className="text-sm text-ink-soft">{t("cart.empty")}</p>
                <Button asChild variant="outline" size="sm" onClick={onClose}>
                  <Link to="/store">{t("cart.continue")}</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 border-b border-[var(--line)] pb-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="size-16 shrink-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] object-contain p-1"
                        />
                      ) : (
                        <div className="size-16 shrink-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
                        <p className="mt-1 font-mono text-xs text-ink-faint tabular-nums">
                          {formatPrice(item.price, settings.currency)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => setCartQty(item.id, item.qty - 1)}
                            className="grid size-6 place-items-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] text-ink-soft transition-colors hover:border-[var(--navy-700)] hover:text-foreground"
                            aria-label={t("store.decreaseQty")}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setCartQty(item.id, item.qty + 1)}
                            className="grid size-6 place-items-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] text-ink-soft transition-colors hover:border-[var(--navy-700)] hover:text-foreground"
                            aria-label={t("store.increaseQty")}
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ms-auto grid size-6 place-items-center rounded-[var(--radius-sm)] text-ink-faint transition-colors hover:bg-[var(--status-critical-bg)] hover:text-urgent"
                            aria-label={t("cart.remove")}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="font-data text-sm font-semibold tabular-nums">
                        {formatPrice(item.price * item.qty, settings.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--line)] bg-[var(--surface-2)] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                      {t("cart.total")}
                    </span>
                    <span className="font-data text-xl font-bold tabular-nums">
                      {formatPrice(total, settings.currency)}
                    </span>
                  </div>
                  <div className="mt-4 h-px bg-[var(--gold-500)]" />
                  <Button asChild className="mt-4 w-full" onClick={onClose}>
                    <Link to="/store/checkout">{t("cart.checkout")}</Link>
                  </Button>
                  <Button asChild variant="ghost" className="mt-2 w-full" onClick={onClose}>
                    <Link to="/store">{t("cart.continue")}</Link>
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
