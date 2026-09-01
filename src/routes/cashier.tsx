import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Barcode,
  CheckCircle2,
  ChevronLeft,
  Minus,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createOrder, useClinicStore, type OrderItem, type PaymentMethod } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cashier")({
  head: () => ({
    meta: [
      { title: "Cashier — Paw-M" },
      { name: "description", content: "Point of sale for Paw-M Clinic" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CashierPage,
});

type CartItem = OrderItem & {
  productId: string;
  stock: number;
  image: string;
};

const PAYMENT_METHODS: {
  value: PaymentMethod;
  icon: typeof ReceiptText;
  title: string;
  desc: string;
  short: string;
}[] = [
  {
    value: "cash",
    icon: ReceiptText,
    title: "checkout.method.cash.title",
    desc: "checkout.method.cash.desc",
    short: "checkout.method.cash.short",
  },
  {
    value: "fawry",
    icon: ReceiptText,
    title: "checkout.method.fawry.title",
    desc: "checkout.method.fawry.desc",
    short: "checkout.method.fawry.short",
  },
  {
    value: "instapay",
    icon: ReceiptText,
    title: "checkout.method.instapay.title",
    desc: "checkout.method.instapay.desc",
    short: "checkout.method.instapay.short",
  },
];

function CashierPage() {
  return (
    <div className="hero-gradient min-h-screen px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-6"
        >
          <ChevronLeft className="size-4" /> Back to Dashboard
        </Link>
        <CashierApp />
      </div>
    </div>
  );
}

function CashierApp() {
  const { t } = useI18n();
  const { products, settings } = useClinicStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [barcodeTimeout, setBarcodeTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    paymentMethod: PaymentMethod;
    paymentRef: string;
  } | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const total = cart.reduce((n, i) => n + i.qty * i.price, 0);
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        processBarcode(barcodeBuffer);
        setBarcodeBuffer("");
        if (barcodeTimeout) clearTimeout(barcodeTimeout);
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setBarcodeBuffer((prev) => prev + e.key);
        if (barcodeTimeout) clearTimeout(barcodeTimeout);
        setBarcodeTimeout(setTimeout(() => setBarcodeBuffer(""), 200));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (barcodeTimeout) clearTimeout(barcodeTimeout);
    };
  }, [barcodeBuffer, barcodeTimeout]);

  const processBarcode = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    const product = products.find((p) => p.barcode === cleanCode);
    if (!product) {
      toast.error(t("cashier.productNotFound", { code: cleanCode }));
      return;
    }

    if (product.stock <= 0) {
      toast.error(t("cashier.outOfStock", { name: product.name }));
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          toast.error(t("cashier.maxStockReached", { name: product.name, stock: product.stock }));
          return prev;
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
          image: product.image,
        },
      ];
    });
    toast.success(t("cashier.added", { name: product.name }));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id !== productId) return i;
          const newQty = i.qty + delta;
          if (newQty <= 0) return null;
          if (newQty > i.stock) {
            toast.error(t("cashier.maxStockReached", { name: i.name, stock: i.stock }));
            return i;
          }
          return { ...i, qty: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (cart.length === 0) {
      toast.error(t("cashier.emptyCart"));
      return;
    }
    if (method === "instapay" && !settings.instapay) {
      toast.error(t("checkout.instapayNotConfigured"));
      return;
    }
    setBusy(true);
    try {
      const order = await createOrder({
        customerName: "Walk-in Customer",
        phone: "",
        email: "",
        address: "",
        items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        paymentMethod: method,
        paymentRef: method === "instapay" || method === "fawry" ? "" : undefined,
      });
      setResult({ id: order.id, paymentMethod: order.paymentMethod, paymentRef: order.paymentRef });
      setCart([]);
      toast.success(t("cashier.orderCreated", { id: order.id }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("only")) {
        toast.error(message);
      } else {
        toast.error(t("cashier.failed"));
      }
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
        <div className="size-16 grid place-items-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-2xl font-bold">{t("cashier.successTitle")}</h2>
        <p className="text-muted-foreground">{t("cashier.successDesc")}</p>
        <p className="font-mono text-lg">{t("cashier.orderId")}: {result.id}</p>
        {result.paymentMethod === "fawry" && (
          <div className="rounded-xl border border-primary/25 bg-primary/8 p-4 text-center">
            <p className="text-xs font-semibold text-primary">{t("checkout.fawryRefTitle")}</p>
            <p className="mt-1 font-mono text-xl font-bold">{result.paymentRef}</p>
          </div>
        )}
        <Button size="lg" onClick={() => setResult(null)} className="w-full max-w-xs">
          {t("cashier.newSale")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("cashier.scanBarcode")}</CardTitle>
              <div className="flex items-center gap-2">
                <Search className="size-4 text-muted-foreground" />
                <Input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      processBarcode(barcodeInput);
                      setBarcodeInput("");
                    }
                  }}
                  placeholder={t("cashier.scanPlaceholder")}
                  className="w-64"
                  autoComplete="off"
                />
              </div>
            </div>
            <CardDescription>{t("cashier.scanDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <input
                type="text"
                className="absolute inset-0 opacity-0 pointer-events-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    processBarcode(barcodeBuffer);
                    setBarcodeBuffer("");
                    if (barcodeTimeout) clearTimeout(barcodeTimeout);
                  }
                }}
              />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Barcode className="size-5" />
                <span>{barcodeBuffer || t("cashier.waitingForScan")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {t("cashier.cart", { count: itemCount })}
            </CardTitle>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                <Trash2 className="size-4 mr-1" /> {t("cashier.clearCart")}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingCart className="size-12 mb-3 opacity-50" />
                <p>{t("cashier.emptyCart")}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-14 shrink-0 rounded-lg border border-border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price, settings.currency)} × {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQty(item.id, -1)}
                        disabled={item.qty <= 1}
                        aria-label={t("cashier.decrease")}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQty(item.id, 1)}
                        disabled={item.qty >= item.stock}
                        aria-label={t("cashier.increase")}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.id)}
                        aria-label={t("cashier.remove")}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold w-24 text-right">
                      {formatPrice(item.price * item.qty, settings.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="sticky top-24 h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("cashier.payment")}</CardTitle>
            <CardDescription>{t("cashier.paymentDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors w-full",
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

            {method === "fawry" && (
              <div className="rounded-xl border border-primary/25 bg-primary/8 p-4">
                <p className="text-xs font-semibold text-primary">{t("checkout.fawryHowTitle")}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {t("checkout.fawryHow")}
                </p>
              </div>
            )}

            {method === "instapay" && (
              <div className="rounded-xl border border-primary/25 bg-primary/8 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                  InstaPay
                </p>
                <p className="mt-1.5 font-mono text-sm font-bold">
                  {settings.instapay || t("checkout.instapayMissing")}
                </p>
              </div>
            )}

            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cashier.subtotal")}</span>
                <span>{formatPrice(total, settings.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cashier.items")}</span>
                <span>{itemCount}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("cashier.total")}</span>
              <span>{formatPrice(total, settings.currency)}</span>
            </div>
            <Button
              type="button"
              onClick={() => document.getElementById("cashier-form")?.requestSubmit()}
              size="lg"
              disabled={busy || cart.length === 0}
              className="w-full shadow-glow"
            >
              {busy ? "…" : t("cashier.completeSale")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <form id="cashier-form" onSubmit={submit} className="hidden">
        <button type="submit" hidden />
      </form>
    </div>
  );
}