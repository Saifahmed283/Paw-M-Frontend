import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgePercent,
  Banknote,
  Barcode,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Grid2X2,
  Keyboard,
  Landmark,
  Minus,
  PackagePlus,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShoppingCart,
  Smartphone,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { createOrder, useClinicStore, type PaymentMethod, type Product } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PhoneScannerMode } from "@/components/cashier/PhoneScannerMode";
import { QuickAddGrid } from "@/components/cashier/QuickAddGrid";
import { HoldManager } from "@/components/cashier/HoldManager";
import { DiscountPanel } from "@/components/cashier/DiscountPanel";
import { PerItemDiscount } from "@/components/cashier/PerItemDiscount";
import { CustomerInfoPanel } from "@/components/cashier/CustomerInfo";
import { QuickCashCalculator } from "@/components/cashier/QuickCashCalculator";
import { SplitPayment } from "@/components/cashier/SplitPayment";
import { ReceiptPreview } from "@/components/cashier/ReceiptPreview";
import { ShortcutsDialog } from "@/components/cashier/ShortcutsDialog";
import {
  type CartItem,
  type CustomerInfo,
  type HeldSale,
  type ItemDiscount,
  type OrderDiscount,
  type SplitPaymentAllocation,
  itemEffectivePrice,
  orderDiscountAmount,
  saleId,
} from "@/components/cashier/types";

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

const PAYMENT_METHODS: {
  value: PaymentMethod;
  icon: LucideIcon;
  title: string;
  short: string;
}[] = [
  {
    value: "cash",
    icon: Banknote,
    title: "checkout.method.cash.title",
    short: "checkout.method.cash.short",
  },
  {
    value: "fawry",
    icon: Landmark,
    title: "checkout.method.fawry.title",
    short: "checkout.method.fawry.short",
  },
  {
    value: "instapay",
    icon: Smartphone,
    title: "checkout.method.instapay.title",
    short: "checkout.method.instapay.short",
  },
];

function CashierPage() {
  const { t } = useI18n();
  return (
    <div className="hero-gradient min-h-screen px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-6"
        >
          <ChevronLeft className="size-4" /> {t("cashier.backToDashboard")}
        </Link>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("cashier.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("cashier.subtitle")}</p>
          </div>
        </div>
        <CashierApp />
      </div>
    </div>
  );
}

type Totals = {
  subtotal: number;
  itemDiscount: number;
  subtotalAfterItems: number;
  orderDiscountAmt: number;
  total: number;
};

function computeTotals(
  cart: CartItem[],
  itemDiscounts: Record<string, ItemDiscount>,
  orderDiscount: OrderDiscount,
): Totals {
  const subtotal = cart.reduce((n, i) => n + i.originalPrice * i.qty, 0);
  const itemDiscount = cart.reduce((n, i) => {
    const eff = itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]);
    return n + (i.originalPrice - eff) * i.qty;
  }, 0);
  const subtotalAfterItems = subtotal - itemDiscount;
  const orderDiscountAmt = orderDiscountAmount(subtotalAfterItems, orderDiscount);
  const total = Math.max(0, subtotalAfterItems - orderDiscountAmt);
  return { subtotal, itemDiscount, subtotalAfterItems, orderDiscountAmt, total };
}

function reduceCartForSubmission(
  cart: CartItem[],
  itemDiscounts: Record<string, ItemDiscount>,
): { id: string; name: string; price: number; qty: number }[] {
  return cart.map((i) => ({
    id: i.id,
    name: i.name,
    price: Math.round(itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]) * 100) / 100,
    qty: i.qty,
  }));
}

function CashierApp() {
  const { t } = useI18n();
  const { products, settings } = useClinicStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemDiscounts, setItemDiscounts] = useState<Record<string, ItemDiscount>>({});
  const [orderDiscount, setOrderDiscount] = useState<OrderDiscount>({ type: "none", value: 0 });
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", phone: "" });
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [holdSales, setHoldSales] = useState<HeldSale[]>([]);
  const [split, setSplit] = useState<SplitPaymentAllocation[]>([]);
  const [cashReceived, setCashReceived] = useState(0);
  const [busy, setBusy] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(true);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [result, setResult] = useState<{
    id: string;
    paymentMethod: PaymentMethod;
    paymentRef: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("scan");
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [barcodeTimeout, setBarcodeTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const totals = useMemo(
    () => computeTotals(cart, itemDiscounts, orderDiscount),
    [cart, itemDiscounts, orderDiscount],
  );
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);

  const addProduct = useCallback(
    (product: Product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          if (existing.qty + qty > product.stock) {
            toast.error(
              t("cashier.maxStockReached", { name: product.name, stock: String(product.stock) }),
            );
            return prev;
          }
          return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
        }
        if (product.stock <= 0) {
          toast.error(t("cashier.outOfStock", { name: product.name }));
          return prev;
        }
        return [
          ...prev,
          {
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.price,
            qty,
            stock: product.stock,
            image: product.image,
          },
        ];
      });
      setLastScanned(product.id);
      setTimeout(() => setLastScanned(null), 700);
    },
    [t],
  );

  const processBarcode = useCallback(
    (code: string) => {
      const clean = code.trim();
      if (!clean) return;
      const product = products.find((p) => p.barcode === clean);
      if (!product) {
        toast.error(t("cashier.productNotFound", { code: clean }));
        return;
      }
      if (product.stock <= 0) {
        toast.error(t("cashier.outOfStock", { name: product.name }));
        return;
      }
      addProduct(product);
      toast.success(t("cashier.added", { name: product.name }));
    },
    [products, t, addProduct],
  );

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
  }, [barcodeBuffer, barcodeTimeout, processBarcode]);

  // F-key shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      switch (e.key) {
        case "F1":
          e.preventDefault();
          setActiveTab("quick");
          break;
        case "F2":
          e.preventDefault();
          setActiveTab("scan");
          barcodeInputRef.current?.focus();
          break;
        case "F3":
          e.preventDefault();
          holdCurrentSale();
          break;
        case "F4":
          e.preventDefault();
          if (cart.length > 0) setReceiptOpen(true);
          break;
        case "F8":
          e.preventDefault();
          clearCart();
          break;
        case "F9":
          e.preventDefault();
          setShortcutsOpen(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, itemDiscounts, orderDiscount, customer, method, holdSales]);

  const clearCart = () => {
    setCart([]);
    setItemDiscounts({});
    setOrderDiscount({ type: "none", value: 0 });
    setCustomer({ name: "", phone: "" });
  };

  const holdCurrentSale = () => {
    if (cart.length === 0) return;
    const held: HeldSale = {
      id: saleId(),
      label: customer.name
        ? customer.name
        : t("cashier.saleDefault", { n: String(holdSales.length + 1) }),
      heldAt: Date.now(),
      cart,
      itemDiscounts,
      orderDiscount,
      customer,
      paymentMethod: method,
    };
    setHoldSales((prev) => [held, ...prev]);
    clearCart();
    toast.success(t("cashier.saleHeld"));
  };

  const resumeSale = (id: string) => {
    const held = holdSales.find((h) => h.id === id);
    if (!held) return;
    setCart(held.cart);
    setItemDiscounts(held.itemDiscounts);
    setOrderDiscount(held.orderDiscount);
    setCustomer(held.customer);
    setMethod(held.paymentMethod);
    setSplit([]);
    setCashReceived(0);
    setHoldSales((prev) => prev.filter((h) => h.id !== id));
    toast.success(t("cashier.saleResumed"));
  };

  const discardHeld = (id: string) => {
    setHoldSales((prev) => prev.filter((h) => h.id !== id));
    toast.info(t("cashier.saleDiscarded"));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((i) => {
            if (i.id !== productId) return i;
            const newQty = i.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > i.stock) {
              toast.error(t("cashier.maxStockReached", { name: i.name, stock: String(i.stock) }));
              return i;
            }
            return { ...i, qty: newQty };
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
    setItemDiscounts((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const submit = async () => {
    if (busy) return;
    if (cart.length === 0) {
      toast.error(t("cashier.emptyCart"));
      return;
    }

    const isSplit = split.length > 1;
    const total = totals.total;

    if (isSplit) {
      const allocated = split.reduce((n, a) => n + a.amount, 0);
      if (Math.abs(allocated - total) >= 0.005) {
        toast.error(t("cashier.splitNotComplete"));
        return;
      }
    }

    if (method === "instapay" && !settings.instapay) {
      toast.error(t("checkout.instapayNotConfigured"));
      return;
    }

    setBusy(true);
    try {
      const items = reduceCartForSubmission(cart, itemDiscounts);
      const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;

      // For a conventional (non-split) POS sale, record a single payment method.
      let paymentMethod = method;
      let paymentRef = method === "instapay" || method === "fawry" ? "" : undefined;

      // Split payment support: choose the first non-cash allocation as the recorded
      // method so fawry/instapay references can be captured; keep it simple.
      if (isSplit) {
        const primary = (split.find((a) => a.method !== "cash") ?? split[0])!;
        paymentMethod = primary.method;
        paymentRef = primary.method === "instapay" || primary.method === "fawry" ? "" : undefined;
      }

      const order = await createOrder({
        customerName: customer.name.trim() || t("cashier.walkInCustomer"),
        phone: customer.phone.trim(),
        email: "",
        address: "",
        items,
        paymentMethod,
        paymentRef,
        source: "pos",
        discountAmount,
        discountLabel:
          orderDiscount.type !== "none"
            ? orderDiscount.type === "percent"
              ? t("cashier.percentOff", { value: String(orderDiscount.value) })
              : t("cashier.discountOrder")
            : "",
      });
      setResult({ id: order.id, paymentMethod: order.paymentMethod, paymentRef: order.paymentRef });
      clearCart();
      setSplit([]);
      setCashReceived(0);
      toast.success(t("cashier.orderCreated", { id: order.id }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message) {
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
        <div className="size-16 grid place-items-center rounded-2xl bg-success/15 text-success animate-in zoom-in-95">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-2xl font-bold">{t("cashier.successTitle")}</h2>
        <p className="text-muted-foreground">{t("cashier.successDesc")}</p>
        <p className="font-mono text-lg">
          {t("cashier.orderId")}: {result.id}
        </p>
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

  const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4 min-w-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{t("cashier.addProducts")}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setShortcutsOpen(true)}
            >
              <Keyboard className="size-4 mr-1.5" />
              {t("cashier.keyboardShortcuts")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan" className="gap-1.5">
                  <Barcode className="size-4" />
                  {t("cashier.scanBarcode")}
                </TabsTrigger>
                <TabsTrigger value="quick" className="gap-1.5">
                  <Grid2X2 className="size-4" />
                  {t("cashier.quickAdd")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="scan" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Input
                    ref={barcodeInputRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = barcodeInputRef.current?.value ?? "";
                        if (val) processBarcode(val);
                        setBarcodeInput("");
                      }
                    }}
                    placeholder={t("cashier.scanPlaceholder")}
                    className="flex-1"
                    autoComplete="off"
                    autoFocus={activeTab === "scan"}
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      const val = barcodeInputRef.current?.value ?? "";
                      if (val) processBarcode(val);
                      setBarcodeInput("");
                    }}
                    aria-label={t("cashier.scanPlaceholder")}
                  >
                    <Search className="size-4" />
                  </Button>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-muted-foreground"
                    >
                      <ScanLine className="size-4" />
                      {t("cashier.phoneScanner")}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <PhoneScannerMode onScan={processBarcode} />
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>
              <TabsContent value="quick" className="pt-4">
                <QuickAddGrid
                  products={products}
                  cart={cart}
                  currency={settings.currency}
                  onAdd={(p) => addProduct(p)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {t("cashier.cart", { count: String(itemCount) })}
            </CardTitle>
            {cart.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={holdCurrentSale}
                  disabled={cart.length === 0}
                >
                  <PackagePlus className="size-4 mr-1" /> {t("cashier.holdSale")}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                  <Trash2 className="size-4 mr-1" /> {t("cashier.clearCart")}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingCart className="size-12 mb-3 opacity-50" />
                <p>{t("cashier.emptyCart")}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const disc = itemDiscounts[item.id];
                  const eff = itemEffectivePrice(item.originalPrice, disc);
                  const hasDisc = disc && disc.type !== "none";
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 transition-all",
                        lastScanned === item.id
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border",
                      )}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-14 shrink-0 rounded-lg border border-border object-cover"
                        />
                      ) : (
                        <div className="size-14 shrink-0 rounded-lg border border-border bg-muted" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(eff, settings.currency)}
                          {hasDisc && (
                            <span className="ml-1.5 text-destructive line-through">
                              {formatPrice(item.originalPrice, settings.currency)}
                            </span>
                          )}
                          {hasDisc && (
                            <Badge variant="outline" className="ml-1.5 text-[10px]">
                              {disc?.type === "percent" ? `${disc.value}%` : `-${disc?.value}`}
                            </Badge>
                          )}
                          {" × "}
                          {item.qty}
                        </p>
                      </div>
                      <PerItemDiscount
                        price={item.originalPrice}
                        qty={item.qty}
                        stock={item.stock}
                        discount={itemDiscounts[item.id]}
                        onChange={(d) => setItemDiscounts((prev) => ({ ...prev, [item.id]: d }))}
                      />
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
                        {formatPrice(eff * item.qty, settings.currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {holdSales.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("cashier.heldSales")}</CardTitle>
            </CardHeader>
            <CardContent>
              <HoldManager
                heldSales={holdSales}
                currency={settings.currency}
                onHold={holdCurrentSale}
                onResume={resumeSale}
                onDiscard={discardHeld}
                canHold={cart.length > 0}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto space-y-4 pr-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("cashier.payment")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CustomerInfoPanel customer={customer} onChange={setCustomer} />

            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
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
                  <span className="text-xs font-semibold">{t(m.short)}</span>
                </button>
              ))}
            </div>

            {method === "fawry" && (
              <p className="rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-xs text-primary">
                {t("checkout.fawryHowTitle")}
              </p>
            )}
            {method === "instapay" && (
              <p className="rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-xs">
                <span className="font-semibold text-primary">
                  {t("checkout.method.instapay.short")}
                </span>{" "}
                <span className="font-mono font-bold">{settings.instapay}</span>
              </p>
            )}

            <SplitPayment
              total={totals.total}
              currency={settings.currency}
              allocations={split.length > 1 ? split : []}
              onAllocationsChange={(a) => setSplit(a)}
            />

            <Collapsible open={discountOpen} onOpenChange={setDiscountOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-primary/40",
                    discountOpen ? "border-primary/40" : "border-border",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <BadgePercent className="size-4 text-muted-foreground" />
                    {t("cashier.discount")}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      discountOpen && "rotate-180",
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <DiscountPanel
                  orderDiscount={orderDiscount}
                  subtotal={totals.subtotalAfterItems}
                  currency={settings.currency}
                  onApplyOrderDiscount={setOrderDiscount}
                />
              </CollapsibleContent>
            </Collapsible>

            {method === "cash" && split.length <= 1 && (
              <Collapsible open={cashOpen} onOpenChange={setCashOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-primary/40",
                      cashOpen ? "border-primary/40" : "border-border",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="size-4 text-muted-foreground" />
                      {t("cashier.cashReceived")}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        cashOpen && "rotate-180",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <QuickCashCalculator
                    total={totals.total}
                    currency={settings.currency}
                    onCashReceivedChange={setCashReceived}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}

            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cashier.subtotal")}</span>
                <span>{formatPrice(totals.subtotal, settings.currency)}</span>
              </div>
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cashier.itemDiscounts")}</span>
                  <span className="text-destructive">
                    -{formatPrice(totals.itemDiscount, settings.currency)}
                  </span>
                </div>
              )}
              {totals.orderDiscountAmt > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("cashier.discountApplied")}</span>
                  <span className="text-destructive">
                    -{formatPrice(totals.orderDiscountAmt, settings.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cashier.items")}</span>
                <span>{itemCount}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("cashier.total")}</span>
              <span>{formatPrice(totals.total, settings.currency)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReceiptOpen(true)}
                disabled={cart.length === 0}
                className="gap-1.5"
              >
                <ReceiptText className="size-4" />
                {t("cashier.receiptPreview")}
              </Button>
              <Button
                type="button"
                onClick={submit}
                size="lg"
                disabled={busy || cart.length === 0}
                className="flex-1 gap-1.5 shadow-glow"
              >
                <Wallet className="size-4" />
                {busy ? "…" : t("cashier.completeSale")}
              </Button>
            </div>
            {discountAmount > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                {t("cashier.totalWithDiscount", {
                  amount: formatPrice(discountAmount, settings.currency),
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ReceiptPreview
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        settings={{
          name: settings.name,
          phone: settings.phone,
          address: settings.address,
        }}
        customer={customer}
        cart={cart}
        itemDiscounts={itemDiscounts}
        orderDiscount={orderDiscount}
        currency={settings.currency}
      />

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
