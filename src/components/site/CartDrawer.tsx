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
            className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-sm flex-col bg-card shadow-raised"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <ShoppingBag className="size-4" /> {t("cart.title")}
              </h2>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("header.closeMenu")}
              >
                <X className="size-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="size-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
                <Button asChild variant="outline" size="sm" onClick={onClose}>
                  <Link to="/store">{t("cart.continue")}</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="size-16 shrink-0 rounded-xl border border-border object-cover"
                        />
                      ) : (
                        <div className="size-16 shrink-0 rounded-xl border border-border bg-muted" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatPrice(item.price, settings.currency)}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1">
                          <button
                            onClick={() => setCartQty(item.id, item.qty - 1)}
                            className="grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={t("store.decreaseQty")}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                          <button
                            onClick={() => setCartQty(item.id, item.qty + 1)}
                            className="grid size-6 place-items-center rounded-md border border-input text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={t("store.increaseQty")}
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label={t("cart.remove")}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(item.price * item.qty, settings.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("cart.total")}
                    </span>
                    <span className="text-lg font-bold">
                      {formatPrice(total, settings.currency)}
                    </span>
                  </div>
                  <Button asChild className="mt-4 w-full shadow-glow" onClick={onClose}>
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
