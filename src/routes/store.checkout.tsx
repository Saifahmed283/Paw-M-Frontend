import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, CheckCircle2, ChevronLeft, QrCode, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clearCart, removeFromCart, setCartQty, useCart } from "@/lib/cart-store";
import { currentClient } from "@/lib/client-auth";
import { createOrder, useClinicStore, type PaymentMethod } from "@/lib/clinic-store";
import { STORE_CHECKOUT_METHODS } from "@/lib/payment-verification";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Paw-M Store" },
      { name: "description", content: "Place your pet supply order with Paw-M." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const METHOD_CONTENT: Record<
  (typeof STORE_CHECKOUT_METHODS)[number],
  { icon: typeof Banknote; title: string; desc: string }
> = {
  cash: {
    icon: Banknote,
    title: "checkout.method.cash.title",
    desc: "checkout.method.cash.desc",
  },
  instapay: {
    icon: Smartphone,
    title: "checkout.method.instapay.title",
    desc: "checkout.method.instapay.desc",
  },
};
const PAYMENT_METHODS = STORE_CHECKOUT_METHODS.map((value) => ({
  value,
  ...METHOD_CONTENT[value],
}));

function SuccessScreen({
  orderId,
  paymentMethod,
  total,
  instapay,
}: {
  orderId: string;
  paymentMethod: PaymentMethod;
  total: string;
  instapay: string;
}) {
  const { t } = useI18n();
  return (
    <section className="hero-gradient flex min-h-dvh items-center justify-center px-5 py-32">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 text-center shadow-card sm:p-8">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">{t("checkout.successTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("checkout.notPaidYet")}
        </p>
        <p className="mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3 font-mono text-sm break-all">
          {t("checkout.orderId")}: {orderId}
        </p>

        {paymentMethod === "instapay" && (
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4 text-left">
            <p className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Smartphone className="size-4" /> {t("checkout.method.instapay.short")}
            </p>
            <p className="mt-1 font-mono text-lg font-bold break-all">{instapay}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t("checkout.instapayTransfer", { amount: total, account: instapay })}
            </p>
          </div>
        )}
        {paymentMethod === "cash" && (
          <p className="mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            {t("checkout.payAtPickup", { amount: total, orderId })}
          </p>
        )}
        <p className="mt-3 text-xs font-medium text-amber-600">{t("checkout.notPaidNote")}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1 shadow-glow">
            <Link to="/store/track">{t("checkout.trackOrder")}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/store">{t("checkout.continueShopping")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CheckoutPage() {
  return (
    <ClientAuthGate>
      <CheckoutForm />
    </ClientAuthGate>
  );
}

function CheckoutForm() {
  const { t } = useI18n();
  const cart = useCart();
  const { settings } = useClinicStore();
  const client = currentClient();
  const [form, setForm] = useState({
    name: client?.fullName ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    address: "",
  });
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    paymentMethod: PaymentMethod;
    total: string;
  } | null>(null);

  const total = cart.reduce((n, i) => n + i.qty * i.price, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const isDeliveryRequired = method !== "cash";
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error(t("checkout.required"));
      return;
    }
    if (isDeliveryRequired && !form.address.trim()) {
      toast.error(t("checkout.addressRequiredError"));
      return;
    }
    if (method === "instapay" && !settings.instapay) {
      toast.error(t("checkout.instapayNotConfigured"));
      return;
    }
    setBusy(true);
    try {
      const order = await createOrder({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        paymentMethod: method,
      });
      clearCart();
      setResult({
        id: order.id,
        paymentMethod: order.paymentMethod,
        total: formatPrice(total, settings.currency),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("only")) {
        toast.error(message);
      } else {
        toast.error(t("checkout.failed"));
      }
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <SuccessScreen
        orderId={result.id}
        paymentMethod={result.paymentMethod}
        total={result.total}
        instapay={settings.instapay}
      />
    );
  }

  return (
    <section className="hero-gradient min-h-dvh px-5 py-32 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> {t("store.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{t("checkout.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {method === "cash" ? t("checkout.descCollect") : t("checkout.descDelivery")}
        </p>

        {cart.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
            <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/store">{t("cart.continue")}</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <form
              onSubmit={submit}
              className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="co-name">{t("checkout.name")}</Label>
                  <Input
                    id="co-name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="co-phone">{t("checkout.phone")}</Label>
                    <Input
                      id="co-phone"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="co-email">{t("checkout.email")}</Label>
                    <Input
                      id="co-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="co-address">
                    {method === "cash"
                      ? t("checkout.addressOptional")
                      : t("checkout.addressRequired")}
                  </Label>
                  <Textarea
                    id="co-address"
                    rows={2}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-1.5"
                    placeholder={t("checkout.addressHint")}
                  />
                  {method === "cash" && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("checkout.collectInClinic")}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">{t("checkout.paymentMethod")}</Label>
                <div className="mt-2 grid gap-2.5">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMethod(m.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                        method === m.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40",
                      )}
                      aria-pressed={method === m.value}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-lg",
                          method === m.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <m.icon className="size-4.5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{t(m.title)}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {t(m.desc)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                {method === "instapay" && (
                  <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <Smartphone className="size-4" /> {t("checkout.method.instapay.short")}
                    </p>
                    <p className="mt-1.5 font-mono text-sm font-bold">
                      {settings.instapay || t("checkout.instapayMissing")}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {t("checkout.instapaySteps")}
                    </p>
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      {t("checkout.notPaidNote")}
                    </p>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" disabled={busy} className="w-full shadow-glow">
                {busy ? "…" : t("checkout.placeOrder")}
              </Button>
            </form>

            <div className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t("cart.title")}
              </h2>
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="size-14 shrink-0 rounded-xl border border-border bg-muted object-contain p-1"
                      />
                    ) : (
                      <div className="size-14 shrink-0 rounded-xl border border-border bg-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.qty} × {formatPrice(item.price, settings.currency)}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <select
                          value={item.qty}
                          onChange={(e) => setCartQty(item.id, Number(e.target.value))}
                          className="h-7 rounded-lg border border-input bg-background px-1.5 text-xs"
                          aria-label={t("store.quantity")}
                        >
                          {Array.from({ length: Math.min(item.stock, 10) }, (_, i) => i + 1).map(
                            (n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ),
                          )}
                        </select>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-1 grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-muted-foreground">{t("cart.total")}</span>
                <span className="text-lg font-bold">{formatPrice(total, settings.currency)}</span>
              </div>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
                <QrCode className="mt-0.5 size-3.5 shrink-0" />
                {t("checkout.paymentNote")}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
