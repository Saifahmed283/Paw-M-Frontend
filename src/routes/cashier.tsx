import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgePercent,
  Banknote,
  Barcode,
  CheckCircle2,
  ChevronDown,
  Grid2X2,
  Keyboard,
  Landmark,
  LogIn,
  LogOut,
  Minus,
  Stethoscope,
  Moon,
  Package,
  PackagePlus,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShoppingCart,
  Smartphone,
  Sun,
  Trash2,
  Undo2,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  createOrder,
  useClinicStore,
  type Payment,
  type PaymentMethod,
  type Product,
  type ServiceItem,
} from "@/lib/clinic-store";
import {
  addPaymentItem,
  checkIn,
  refreshClinicData,
  settlePayment,
  type WorkSession,
} from "@/lib/clinic-store";
import { isAuthed } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/lib/i18n-components";
import { useTheme } from "@/lib/use-theme-hook";
import { cn } from "@/lib/utils";
import { StaffAuthGate } from "@/components/auth/StaffAuthGate";
import { localTodayISO } from "@/components/dashboard/dashboard-format";
import { PaymentKindBadge } from "@/components/dashboard/dashboard-helpers";
import { PaymentSettleDialog } from "@/components/dashboard/PaymentSettleDialog";
import { PhoneScannerMode } from "@/components/cashier/PhoneScannerMode";
import { ScannerStatus } from "@/components/cashier/ScannerStatus";
import { QuickAddGrid } from "@/components/cashier/QuickAddGrid";
import { ClinicServicePanel } from "@/components/cashier/ClinicServicePanel";
import { HoldManager } from "@/components/cashier/HoldManager";
import { DiscountPanel } from "@/components/cashier/DiscountPanel";
import { PerItemDiscount } from "@/components/cashier/PerItemDiscount";
import { CustomerInfoPanel } from "@/components/cashier/CustomerInfo";
import { QuickCashCalculator } from "@/components/cashier/QuickCashCalculator";
import { SplitPayment } from "@/components/cashier/SplitPayment";
import { ReceiptPreview } from "@/components/cashier/ReceiptPreview";
import { RefundDialog } from "@/components/cashier/RefundDialog";
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

/** A sale may only be rung up while the signed-in staff member's shift is open today. */
function isCheckedInToday(session: WorkSession | null): boolean {
  if (!session || session.endedAt || session.date !== localTodayISO()) return false;
  const started = new Date(session.startedAt);
  return !Number.isNaN(started.getTime());
}

function CashierPage() {
  const { t } = useI18n();
  const { dark, toggle } = useTheme();
  const [authed, setAuthed] = useState(false);
  const { workSession } = useClinicStore();

  useEffect(() => {
    if (isAuthed()) setAuthed(true);
  }, []);

  const onUnlocked = () => setAuthed(true);

  // Any signed-in staff account may open the till; it stays behind sign-in.
  if (!authed) {
    return <StaffAuthGate onUnlocked={onUnlocked} showBack={false} />;
  }

  const checkedIn = isCheckedInToday(workSession);

  return (
    <div className="min-h-screen bg-background">
      {/* Compact POS toolbar — the marketing header/footer are hidden for this
          route in __root.tsx so the counter stays focused and uncluttered. */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-base font-semibold">{t("cashier.title")}</h1>
            {/* No site navigation here — once on the till, staff stay on the till. */}
            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:inline-flex",
                checkedIn
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600",
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", checkedIn ? "bg-success" : "bg-amber-500")}
              />
              {checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed")}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <LogOut className="size-4 rtl:rotate-180" />
                <span className="hidden sm:inline">{t("cashier.exit")}</span>
              </Link>
            </Button>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={dark ? t("header.lightMode") : t("header.darkMode")}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
        <CashierApp />
      </div>
    </div>
  );
}

function PaymentRequestsCard({
  cartLines,
  onCombined,
}: {
  cartLines: { label: string; amount: number; kind: "product"; referenceId: string }[];
  onCombined: () => void;
}) {
  const { t } = useI18n();
  const { payments, settings } = useClinicStore();
  const [settling, setSettling] = useState<Payment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pending = payments.filter((p) => p.status === "unpaid");
  const settlingPayment = pending.find((p) => p.id === settling?.id) ?? settling;

  const combineAndSettle = async (p: Payment) => {
    if (busyId) return;
    if (cartLines.length === 0) return;
    setBusyId(p.id);
    try {
      await addPaymentItem(p.id, cartLines);
      toast.success(t("cashier.billCombined"));
      await settlePayment(p.id, { method: "cash", notes: t("cashier.combineLinesHint") });
      toast.success(t("cashier.billSettled"));
      refreshClinicData();
      onCombined();
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "";
      toast.error(message || t("dash.toast.error"));
    } finally {
      setBusyId(null);
    }
  };

  if (pending.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ReceiptText className="size-4 text-muted-foreground" />
          {t("cashier.paymentRequests")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t("cashier.paymentRequestsDesc")}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {pending.map((p) => (
          <div key={p.id} className="rounded-xl border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                {p.client?.fullName && (
                  <p className="text-xs text-muted-foreground">{p.client.fullName}</p>
                )}
                {p.items && p.items.length > 0 && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {p.items.map((it) => it.label).join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-end">
                <p className="text-base font-bold">{formatPrice(p.amount, settings.currency)}</p>
                <PaymentKindBadge kind={p.kind} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 flex-1"
                disabled={busyId === p.id}
                onClick={() => setSettling(p)}
              >
                {t("cashier.settleVisit")}
              </Button>
              <Button
                size="sm"
                className="h-7 flex-1"
                disabled={cartLines.length === 0 || busyId !== null}
                onClick={() => combineAndSettle(p)}
              >
                {busyId === p.id
                  ? t("dash.saving")
                  : t("cashier.combineLine", { count: String(cartLines.length) })}
              </Button>
            </div>
          </div>
        ))}
        {settlingPayment && (
          <PaymentSettleDialog
            payment={settlingPayment}
            onClose={() => {
              setSettling(null);
              refreshClinicData();
            }}
          />
        )}
      </CardContent>
    </Card>
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

function ShiftRequiredGate() {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  const startShift = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await checkIn();
      await refreshClinicData();
      toast.success(t("cashier.shiftStarted"));
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600">
          <LogIn className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-bold">{t("cashier.checkInRequired")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("cashier.checkInRequiredDesc")}</p>
        <Button onClick={startShift} disabled={busy} className="mt-6 w-full shadow-glow">
          {busy ? t("dash.saving") : t("cashier.checkInNow")}
        </Button>
      </div>
    </div>
  );
}

function CashierApp() {
  const { t } = useI18n();
  const { products, services, orders, settings, workSession, workSessionLoading } = useClinicStore();
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
  const [refundOpen, setRefundOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
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
  const checkedIn = isCheckedInToday(workSession);

  const cartLines = cart.map((i) => ({
    label: i.name,
    amount:
      Math.round(itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]) * i.qty * 100) / 100,
    kind: "product" as const,
    referenceId: i.id,
  }));

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

  const addService = useCallback(
    (service: ServiceItem, amount: number, note: string) => {
      const baseName = service.title.trim() || t("cashier.clinicService");
      const price = Math.max(0, amount);
      const id = `service-${service.slug}`;
      // Keep any extra details from the note on the sale line so the clinic
      // team can see them on the receipt and in the saved order.
      const name = note ? `${baseName} — ${note}` : baseName;
      setCart((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1, name } : i));
        }
        return [
          ...prev,
          {
            id,
            productId: id,
            name,
            price,
            originalPrice: price,
            qty: 1,
            stock: Number.MAX_SAFE_INTEGER,
            image: "",
          },
        ];
      });
      setLastScanned(id);
      setTimeout(() => setLastScanned(null), 700);
      toast.success(t("cashier.added", { name: baseName }));
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

  // Everything rung up here lands in today's workday folder, so the till is
  // unavailable until the signed-in staff member has checked in for today.
  if (workSessionLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-muted-foreground">
        {t("dash.loading")}
      </div>
    );
  }
  if (!isCheckedInToday(workSession)) return <ShiftRequiredGate />;

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
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-3 bg-muted/20 p-3 sm:p-4">
      {/* ── TOP COMMAND BAR ─────────────────────────────────────────────── */}
      <section className="animate-in fade-in slide-in-from-top-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-3.5 text-white shadow-lg shadow-slate-900/10 ring-1 ring-white/10 duration-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {/* Big total readout */}
          <div className="min-w-[150px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
              {t("cashier.total")}
            </p>
            <p className="text-3xl font-black leading-tight tabular-nums tracking-tight text-white">
              {formatPrice(totals.total, settings.currency)}
            </p>
            <p className="text-[11px] text-white/50">
              {itemCount} {t("cashier.items").toLowerCase()}
            </p>
          </div>

          <div className="hidden h-12 w-px bg-white/15 sm:block" />

          {/* Payment method selector */}
          <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                aria-pressed={method === m.value}
                title={t(m.short)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all",
                  method === m.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <m.icon className="size-4" />
                <span className="hidden xl:inline">{t(m.short)}</span>
              </button>
            ))}
          </div>

          {/* Compact cash calculator */}
          {method === "cash" && split.length <= 1 && (
            <QuickCashCalculator
              total={totals.total}
              currency={settings.currency}
              onCashReceivedChange={setCashReceived}
            />
          )}

          {/* Primary actions */}
          <div className="ms-auto flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setRefundOpen(true)}
              title={t("cashier.refund")}
              aria-label={t("cashier.refund")}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Undo2 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setReceiptOpen(true)}
              disabled={cart.length === 0}
              title={t("cashier.receiptPreview")}
              aria-label={t("cashier.receiptPreview")}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ReceiptText className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={submit}
              size="lg"
              disabled={busy || cart.length === 0}
              className="h-11 gap-2 rounded-xl px-5 shadow-glow"
            >
              <Wallet className="size-4" />
              {busy ? "…" : t("cashier.completeSale")}
            </Button>
          </div>
        </div>

        {/* Slim status / summary row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-2 text-[11px] text-white/60">
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={cn(
                "size-1.5 rounded-full",
                checkedIn ? "animate-pulse bg-success" : "bg-amber-500",
              )}
            />
            {checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed")}
          </span>
          <span>
            {t("cashier.subtotal")}: {formatPrice(totals.subtotal, settings.currency)}
          </span>
          {discountAmount > 0 && (
            <span className="font-semibold text-rose-300">
              −{formatPrice(discountAmount, settings.currency)}
            </span>
          )}
          {customer.name && <span className="max-w-[160px] truncate text-white">{customer.name}</span>}
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="ms-auto flex items-center gap-1 transition-colors hover:text-white"
          >
            <Keyboard className="size-3.5" />
            {t("cashier.keyboardShortcuts")}
          </button>
        </div>
      </section>

      {method === "fawry" && (
        <p className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-xs text-primary">
          {t("checkout.fawryHowTitle")}
        </p>
      )}
      {method === "instapay" && (
        <p className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-xs">
          <span className="font-semibold text-primary">
            {t("checkout.method.instapay.short")}
          </span>{" "}
          <span className="font-mono font-bold">{settings.instapay}</span>
        </p>
      )}

      {/* ── WORKSPACE ───────────────────────────────────────────────────── */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Product catalog */}
        <Card className="animate-in flex min-h-[540px] flex-col overflow-hidden bg-card duration-500 slide-in-from-left-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
            <CardHeader className="gap-3 border-b bg-background/50 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Grid2X2 className="size-4" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-sm">{t("cashier.addProducts")}</CardTitle>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {t("cashier.scanPlaceholder")}
                  </p>
                </div>
              </div>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scan" className="gap-1.5">
                  <Barcode className="size-4" />
                  {t("cashier.scanBarcode")}
                </TabsTrigger>
                <TabsTrigger value="quick" className="gap-1.5">
                  <Grid2X2 className="size-4" />
                  {t("cashier.quickAdd")}
                </TabsTrigger>
                <TabsTrigger value="service" className="gap-1.5">
                  <Stethoscope className="size-4" />
                  {t("cashier.clinicService")}
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto p-3">
              <TabsContent value="scan" className="mt-0 space-y-3">
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
                    className="h-11 flex-1 text-base"
                    autoComplete="off"
                    autoFocus={activeTab === "scan"}
                  />
                  <Button type="button" size="icon" className="size-11 shrink-0" onClick={() => {
                    const val = barcodeInputRef.current?.value ?? "";
                    if (val) processBarcode(val);
                    setBarcodeInput("");
                  }} aria-label={t("cashier.scanPlaceholder")}>
                    <Search className="size-4" />
                  </Button>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                      <ScanLine className="size-4" />
                      {t("cashier.phoneScanner")}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <PhoneScannerMode onScan={processBarcode} />
                  </CollapsibleContent>
                </Collapsible>
                <ScannerStatus />
              </TabsContent>
              <TabsContent value="quick" className="mt-0">
                <QuickAddGrid
                  products={products}
                  cart={cart}
                  currency={settings.currency}
                  onAdd={(p) => addProduct(p)}
                />
              </TabsContent>
              <TabsContent value="service" className="mt-0">
                <ClinicServicePanel
                  services={services}
                  currency={settings.currency}
                  onAdd={addService}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Live cart */}
        <Card className="animate-in flex min-h-[540px] flex-col overflow-hidden bg-card duration-500 slide-in-from-right-3 lg:sticky lg:top-[4.5rem]">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-background/50 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <ShoppingCart className="size-4" />
              </span>
              <div>
                <CardTitle className="text-sm">
                  {t("cashier.cart", { count: String(itemCount) })}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {cart.length === 0 ? t("cashier.emptyCart") : `${cart.length} ${t("cashier.items").toLowerCase()}`}
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={holdCurrentSale} title={t("cashier.holdSale")} aria-label={t("cashier.holdSale")}>
                  <PackagePlus className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={clearCart} className="text-destructive" title={t("cashier.clearCart")} aria-label={t("cashier.clearCart")}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-y-auto p-2">
            {cart.length === 0 ? (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="grid size-16 place-items-center rounded-2xl bg-muted">
                  <ShoppingCart className="size-7 opacity-50" />
                </div>
                <p className="text-sm font-medium">{t("cashier.emptyCart")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => {
                  const disc = itemDiscounts[item.id];
                  const eff = itemEffectivePrice(item.originalPrice, disc);
                  const hasDisc = disc && disc.type !== "none";
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group rounded-xl border p-2.5 transition-all",
                        lastScanned === item.id
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "bg-background hover:border-primary/40",
                      )}
                    >
                      <div className="flex gap-2.5">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="size-12 shrink-0 rounded-lg border bg-muted object-contain p-0.5" />
                        ) : (
                          <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                            <Package className="size-5 opacity-50" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold">{item.name}</p>
                            <p className="shrink-0 text-sm font-bold tabular-nums">
                              {formatPrice(eff * item.qty, settings.currency)}
                            </p>
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                            {formatPrice(eff, settings.currency)} × {item.qty}
                            {hasDisc && (
                              <>
                                <span className="line-through">{formatPrice(item.originalPrice, settings.currency)}</span>
                                <Badge variant="outline" className="px-1 py-0 text-[9px]">
                                  {disc?.type === "percent" ? `${disc.value}%` : `-${disc?.value}`}
                                </Badge>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <PerItemDiscount
                          price={item.originalPrice}
                          qty={item.qty}
                          stock={item.stock}
                          discount={itemDiscounts[item.id]}
                          onChange={(d) => setItemDiscounts((prev) => ({ ...prev, [item.id]: d }))}
                        />
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="size-7" onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1} aria-label={t("cashier.decrease")}>
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-6 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                          <Button variant="outline" size="icon" className="size-7" onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.stock} aria-label={t("cashier.increase")}>
                            <Plus className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => removeItem(item.id)} aria-label={t("cashier.remove")}>
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t bg-background/40 p-3">
            <div className="w-full space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cashier.subtotal")}</span>
                <span className="tabular-nums">{formatPrice(totals.subtotal, settings.currency)}</span>
              </div>
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>{t("cashier.itemDiscounts")}</span>
                  <span className="tabular-nums">−{formatPrice(totals.itemDiscount, settings.currency)}</span>
                </div>
              )}
              {totals.orderDiscountAmt > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>{t("cashier.discountApplied")}</span>
                  <span className="tabular-nums">−{formatPrice(totals.orderDiscountAmt, settings.currency)}</span>
                </div>
              )}
            </div>

            <div className="w-full space-y-1.5">
              <Collapsible open={customerOpen} onOpenChange={setCustomerOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between font-medium">
                    <span className="flex items-center gap-2">
                      <UserRound className="size-4 text-muted-foreground" />
                      {customer.name || t("cashier.walkInCustomer")}
                    </span>
                    <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", customerOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <CustomerInfoPanel customer={customer} onChange={setCustomer} />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={discountOpen} onOpenChange={setDiscountOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between font-medium">
                    <span className="flex items-center gap-2">
                      <BadgePercent className="size-4 text-muted-foreground" />
                      {t("cashier.discount")}
                      {discountAmount > 0 && <span className="text-primary">−{formatPrice(discountAmount, settings.currency)}</span>}
                    </span>
                    <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", discountOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <DiscountPanel
                    orderDiscount={orderDiscount}
                    subtotal={totals.subtotalAfterItems}
                    currency={settings.currency}
                    onApplyOrderDiscount={setOrderDiscount}
                  />
                </CollapsibleContent>
              </Collapsible>

              <SplitPayment
                total={totals.total}
                currency={settings.currency}
                allocations={split.length > 1 ? split : []}
                onAllocationsChange={(a) => setSplit(a)}
              />
            </div>
          </CardFooter>
        </Card>
      </div>

      {holdSales.length > 0 && (
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{t("cashier.heldSales")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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

      <PaymentRequestsCard cartLines={cartLines} onCombined={clearCart} />

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

      <RefundDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        orders={orders}
        currency={settings.currency}
        onRefunded={refreshClinicData}
      />

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
