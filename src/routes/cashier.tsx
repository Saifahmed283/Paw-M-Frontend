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
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  createOrder,
  useClinicStore,
  type PaymentMethod,
  type Product,
  type ServiceItem,
} from "@/lib/clinic-store";
import {
  checkIn,
  refreshClinicData,
  saveCashCustody,
  type WorkSession,
} from "@/lib/clinic-store";
import { apiErrorMessage } from "@/lib/api";
import { isAuthed } from "@/lib/auth";
import { usesSinglePaymentMethod } from "@/lib/payment-verification";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/lib/i18n-components";
import { useTheme } from "@/lib/use-theme-hook";
import { cn } from "@/lib/utils";
import { StaffAuthGate } from "@/components/auth/StaffAuthGate";
import { StatusOrb } from "@/design-system/primitives/StatusOrb";
import { clinicTodayISO } from "@/components/dashboard/dashboard-format";
import { PhoneScannerMode } from "@/components/cashier/PhoneScannerMode";
import { ScannerStatusIcon } from "@/components/cashier/ScannerStatus";
import { useHardwareScanner } from "@/components/cashier/useHardwareScanner";
import { QuickAddGrid } from "@/components/cashier/QuickAddGrid";
import { ClinicServicePanel } from "@/components/cashier/ClinicServicePanel";
import { HoldManager } from "@/components/cashier/HoldManager";
import { DiscountPanel } from "@/components/cashier/DiscountPanel";
import { PerItemDiscount } from "@/components/cashier/PerItemDiscount";
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
    icon: ReceiptText,
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
  if (!session || session.endedAt || session.date !== clinicTodayISO()) return false;
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
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-[var(--canvas)]">
      {/* Compact POS toolbar — the marketing header/footer are hidden for this
          route in __root.tsx so the counter stays focused and uncluttered. */}
      <header className="relative z-30 shrink-0 border-b border-[var(--navy-700)] bg-[var(--navy-900)] text-white">
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--gold-500)]/55" />
        <div className="relative mx-auto flex h-12 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-7 place-items-center rounded-[var(--radius-md)] border border-[var(--gold-500)]/50 text-[var(--gold-400)]">
              <ScanLine className="size-4" />
            </span>
            <h1 className="truncate font-display text-base font-semibold tracking-tight text-white">
              {t("cashier.title")}
            </h1>
            {/* No site navigation here — once on the till, staff stay on the till. */}
            <StatusOrb
              tone={checkedIn ? "ok" : "watch"}
              size="sm"
              label={checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed")}
              className="hidden rounded-[var(--radius-sm)] border border-white/15 bg-white/5 px-2.5 py-1 [&>span:last-child]:text-white/80 sm:inline-flex"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/20 bg-transparent text-white/85 hover:bg-white/10 hover:text-white"
            >
              <Link to="/dashboard">
                <LogOut className="size-4 rtl:rotate-180" />
                <span className="hidden sm:inline">{t("cashier.exit")}</span>
              </Link>
            </Button>
            <LanguageToggle className="text-white/80 hover:bg-white/10 hover:text-white" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={dark ? t("header.lightMode") : t("header.darkMode")}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden px-2 pb-2 sm:px-4 sm:pb-3">
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
    } catch (err) {
      toast.error(apiErrorMessage(err, t("dash.toast.error")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-[var(--radius-2xl)] border border-status-watch/25 bg-[var(--status-watch-bg)] p-8 text-center shadow-[var(--shadow-2)]">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--panel-bg-solid)] text-status-watch-ink ring-1 ring-status-watch/20">
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

function CashCustodyGate() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [hasDrawer, setHasDrawer] = useState<boolean | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (hasDrawer === null) {
      setError(t("cashier.custodyQuestion"));
      return;
    }
    let openingAmount = 0;
    if (hasDrawer) {
      const parsed = Number(amount);
      if (
        amount.trim() === "" ||
        !Number.isFinite(parsed) ||
        parsed < 0 ||
        Math.round(parsed * 100) !== parsed * 100
      ) {
        setError(t("cashier.custodyAmountInvalid"));
        return;
      }
      openingAmount = parsed;
    }
    setError(null);
    setBusy(true);
    try {
      await saveCashCustody({
        hasDrawer,
        openingAmount,
        ...(note.trim() ? { note } : {}),
      });
      await refreshClinicData();
      toast.success(t("cashier.custodySaved"));
    } catch (err) {
      toast.error(apiErrorMessage(err, t("cashier.custodyFailed")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-[var(--radius-2xl)] border border-[var(--line)] border-t-2 border-t-[var(--gold-500)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-2)] sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--navy-900)] text-[var(--gold-400)] ring-1 ring-[var(--gold-500)]/30">
          <Banknote className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-bold">{t("cashier.custodyTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("cashier.custodyDesc")}</p>

        <div className="mt-6 space-y-4 text-start">
          <div className="space-y-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
              {t("cashier.custodyQuestion")} <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={hasDrawer === true ? "default" : "outline"}
                className={cn(hasDrawer === true && "ring-2 ring-[var(--gold-500)]/50")}
                onClick={() => {
                  setHasDrawer(true);
                  setError(null);
                }}
              >
                {t("cashier.custodyYes")}
              </Button>
              <Button
                type="button"
                variant={hasDrawer === false ? "default" : "outline"}
                className={cn(hasDrawer === false && "ring-2 ring-[var(--gold-500)]/50")}
                onClick={() => {
                  setHasDrawer(false);
                  setAmount("");
                  setError(null);
                }}
              >
                {t("cashier.custodyNo")}
              </Button>
            </div>
          </div>

          {hasDrawer === true && (
            <>
              <div className="space-y-1.5">
                <Label
                  htmlFor="cashier-custody-amount"
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint"
                >
                  {t("cashier.custodyAmountLabel")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cashier-custody-amount"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder={t("cashier.custodyAmountPlaceholder")}
                  className={cn("h-11 text-base", error && "border-destructive")}
                  autoFocus
                />
                <p className="font-mono text-[11px] text-ink-soft">{settings.currency}</p>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="cashier-custody-note"
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint"
                >
                  {t("cashier.custodyNoteLabel")}
                </Label>
                <Input
                  id="cashier-custody-note"
                  value={note}
                  maxLength={200}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("cashier.custodyNotePlaceholder")}
                  className="h-10 text-sm"
                />
              </div>
            </>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button
          onClick={submit}
          disabled={busy || hasDrawer === null}
          className="mt-6 w-full shadow-glow"
        >
          {busy ? t("cashier.custodySaving") : t("cashier.custodySubmit")}
        </Button>
      </div>
    </div>
  );
}

function CashierApp() {
  const { t } = useI18n();
  const {
    products,
    services,
    orders,
    settings,
    workSession,
    workSessionLoading,
    cashCustody,
    cashCustodyLoading,
  } = useClinicStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemDiscounts, setItemDiscounts] = useState<Record<string, ItemDiscount>>({});
  const [orderDiscount, setOrderDiscount] = useState<OrderDiscount>({ type: "none", value: 0 });
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", phone: "" });
  const [customerErrors, setCustomerErrors] = useState<{ name?: string; phone?: string }>({});
  const customerNameRef = useRef<HTMLInputElement>(null);
  const customerPhoneRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [holdSales, setHoldSales] = useState<HeldSale[]>([]);
  const [split, setSplit] = useState<SplitPaymentAllocation[]>([]);
  const [cashReceived, setCashReceived] = useState(0);
  const [busy, setBusy] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scan");
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [barcodeInput, setBarcodeInput] = useState("");

  const totals = useMemo(
    () => computeTotals(cart, itemDiscounts, orderDiscount),
    [cart, itemDiscounts, orderDiscount],
  );
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);
  const checkedIn = isCheckedInToday(workSession);

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
      // Notes travel with the sale line so the clinic sees visit-specific
      // changes. Restrict to 200 chars — the backend order line name limit.
      const detail = note.replace(/\s+/g, " ").trim();
      const name = detail ? `${baseName} — ${detail}`.slice(0, 200) : baseName;
      const price = Math.max(0, amount);
      // Each add is its own line: the same service can be sold twice at
      // different prices or with different notes in one sale.
      const id = `service-${service.slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setCart((prev) => [
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
      ]);
      setLastScanned(id);
      setTimeout(() => setLastScanned(null), 700);
      toast.success(t("cashier.added", { name }));
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

  // A USB scanner is just a very fast keyboard. This single global listener
  // adds scanned products from anywhere in the till, even while another field
  // is focused, without typing the code into that field.
  useHardwareScanner(processBarcode);

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
    setCustomerErrors({});
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

    const name = customer.name.trim();
    const phone = customer.phone.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const nextErrors: { name?: string; phone?: string } = {};
    if (name.length < 2) nextErrors.name = t("cashier.customerNameRequired");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = t("cashier.customerPhoneInvalid");
    }
    setCustomerErrors(nextErrors);
    if (nextErrors.name) {
      customerNameRef.current?.focus();
      toast.error(nextErrors.name);
      return;
    }
    if (nextErrors.phone) {
      customerPhoneRef.current?.focus();
      toast.error(nextErrors.phone);
      return;
    }

    const total = totals.total;
    const selectedMethod = split[0]?.method ?? method;

    if (split.length > 0) {
      const allocated = split.reduce((n, a) => n + a.amount, 0);
      if (Math.abs(allocated - total) >= 0.005) {
        toast.error(t("cashier.splitNotComplete"));
        return;
      }
      if (!usesSinglePaymentMethod(split)) {
        toast.error(t("cashier.singleMethodOnly"));
        return;
      }
    }

    if (selectedMethod === "instapay" && !settings.instapay) {
      toast.error(t("checkout.instapayNotConfigured"));
      return;
    }

    setBusy(true);
    try {
      const items = reduceCartForSubmission(cart, itemDiscounts);
      const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;

      // One order uses one trusted settlement path: cash at the till or an
      // InstaPay transfer that stays unpaid until admin bank verification.
      const paymentMethod = selectedMethod;

      // Cash is physically received at the counter; InstaPay starts unpaid
      // until the transfer is independently verified by the clinic.
      const cashReceivedAtCounter = paymentMethod === "cash";

      const order = await createOrder({
        customerName: name,
        phone,
        email: "",
        address: "",
        items,
        paymentMethod,
        source: "pos",
        cashReceived: cashReceivedAtCounter,
        ...(cashReceivedAtCounter ? { cashReceivedAmount: total } : {}),
        discountAmount,
        discountLabel:
          orderDiscount.type !== "none"
            ? orderDiscount.type === "percent"
              ? t("cashier.percentOff", { value: String(orderDiscount.value) })
              : t("cashier.discountOrder")
            : "",
      });
      // No success interstitial: clear the till immediately so the next
      // customer can be rung up without another click.
      clearCart();
      setSplit([]);
      setCashReceived(0);
      toast.success(
        cashReceivedAtCounter
          ? t("cashier.saleCompleteCashToast")
          : t("cashier.saleCompleteVerificationToast"),
      );
      customerNameRef.current?.focus();
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
  if (workSessionLoading || cashCustodyLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-muted-foreground">
        {t("dash.loading")}
      </div>
    );
  }
  if (!isCheckedInToday(workSession)) return <ShiftRequiredGate />;
  // Every role must declare cash custody & handover once per shift before the
  // till becomes usable. No drawer is still a declaration (amount 0). The
  // workSessionId check also guards against a stale cached declaration from a
  // previous shift being mistaken for this one's answer.
  if (!cashCustody || cashCustody.workSessionId !== workSession?.id) {
    return <CashCustodyGate />;
  }

  const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-2 overflow-hidden p-2 sm:p-3">
      {/* ── TOP COMMAND BAR ─────────────────────────────────────────────── */}
      <section className="relative shrink-0 animate-in fade-in slide-in-from-top-3 rounded-[var(--radius-lg)] border border-[var(--line)] border-t-2 border-t-[var(--gold-500)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)] duration-500 sm:p-4">
        <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Big total readout */}
          <div className="min-w-[110px]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              {t("cashier.total")}
            </p>
            <p className="font-data text-2xl font-black leading-tight tabular-nums tracking-tight text-foreground sm:text-3xl">
              {formatPrice(totals.total, settings.currency)}
            </p>
            <p className="font-mono text-[11px] text-ink-soft">
              {itemCount} {t("cashier.items").toLowerCase()}
            </p>
          </div>

          <div className="hidden h-12 w-px bg-[var(--line)] sm:block" />

          {/* Payment method selector */}
          <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-1">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  setMethod(m.value);
                  setSplit([]);
                }}
                aria-pressed={method === m.value}
                title={t(m.short)}
                className={cn(
                  "flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs font-semibold transition-colors sm:px-2.5 sm:py-2",
                  method === m.value
                    ? "bg-[var(--navy-900)] text-[var(--gold-400)] shadow-[var(--shadow-1)]"
                    : "text-ink-soft hover:bg-[var(--surface)] hover:text-foreground",
                )}
              >
                <m.icon className="size-4" />
                <span className="hidden xl:inline">{t(m.short)}</span>
              </button>
            ))}
          </div>

          {/* Compact cash calculator — kept on wider screens; on phones the
              cart footer carries the cash-received field instead. */}
          {method === "cash" && split.length <= 1 && (
            <div className="hidden md:block">
              <QuickCashCalculator
                total={totals.total}
                currency={settings.currency}
                received={cashReceived}
                onReceivedChange={setCashReceived}
                onCashReceivedChange={setCashReceived}
              />
            </div>
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
              className="hidden text-ink-soft hover:bg-primary-tint hover:text-primary-strong sm:inline-flex"
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
              className="hidden text-ink-soft hover:bg-primary-tint hover:text-primary-strong sm:inline-flex"
            >
              <ReceiptText className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={submit}
              size="lg"
              disabled={busy || cart.length === 0}
              className="h-10 gap-2 rounded-[var(--radius-md)] px-3 sm:h-11 sm:px-5"
            >
              <Wallet className="size-4" />
              {busy ? "…" : t("cashier.completeSale")}
            </Button>
          </div>
        </div>

        {/* Customer details stay visible for every receipt, plus a slim status line. */}
        <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2 border-t pt-2">
          <div className="flex flex-1 items-end gap-2 sm:flex-none">
            <div className="space-y-1">
              <Label
                htmlFor="cashier-customer-name"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint"
              >
                {t("cashier.customerName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={customerNameRef}
                id="cashier-customer-name"
                value={customer.name}
                onChange={(e) => {
                  setCustomer((prev) => ({ ...prev, name: e.target.value }));
                  setCustomerErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    return next;
                  });
                }}
                placeholder={t("cashier.customerNamePlaceholder")}
                className={cn(
                  "h-8 w-full min-w-0 flex-1 text-xs sm:w-36 sm:flex-none",
                  customerErrors.name && "border-destructive",
                )}
                autoComplete="off"
                aria-invalid={Boolean(customerErrors.name)}
              />
              {customerErrors.name && (
                <p className="text-[10px] text-destructive">{customerErrors.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="cashier-customer-phone"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint"
              >
                {t("cashier.customerPhone")} <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={customerPhoneRef}
                id="cashier-customer-phone"
                value={customer.phone}
                onChange={(e) => {
                  setCustomer((prev) => ({ ...prev, phone: e.target.value }));
                  setCustomerErrors((prev) => {
                    const next = { ...prev };
                    delete next.phone;
                    return next;
                  });
                }}
                placeholder={t("cashier.customerPhonePlaceholder")}
                className={cn(
                  "h-8 w-full min-w-0 flex-1 text-xs sm:w-40 sm:flex-none",
                  customerErrors.phone && "border-destructive",
                )}
                inputMode="tel"
                autoComplete="off"
                aria-invalid={Boolean(customerErrors.phone)}
              />
              {customerErrors.phone && (
                <p className="text-[10px] text-destructive">{customerErrors.phone}</p>
              )}
            </div>
          </div>
          <div className="mb-1 flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-soft sm:w-auto sm:flex-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <StatusOrb tone={checkedIn ? "ok" : "watch"} size="sm" />
              {checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed")}
            </span>
            <span className="hidden sm:inline">
              {t("cashier.subtotal")}: {formatPrice(totals.subtotal, settings.currency)}
            </span>
            {discountAmount > 0 && (
              <span className="hidden font-semibold text-destructive sm:inline">
                −{formatPrice(discountAmount, settings.currency)}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              className="ms-auto hidden items-center gap-1 transition-colors hover:text-foreground sm:flex"
            >
              <Keyboard className="size-3.5" />
              {t("cashier.keyboardShortcuts")}
            </button>
          </div>
        </div>
      </section>

      {method !== "cash" && (
        <p className="shrink-0 rounded-xl border border-primary/25 bg-primary-tint px-3 py-1.5 text-xs">
          <span className="font-semibold text-primary-strong">
            {t(`checkout.method.${method}.short`)}
          </span>{" "}
          {method === "instapay" && (
            <span className="font-mono font-bold">{settings.instapay}</span>
          )}
          {method === "fawry" && (
            <span className="text-muted-foreground">{t("checkout.fawrySteps")}</span>
          )}
          <span className="ms-2 text-status-watch-ink">{t("cashier.paymentPendingNotice")}</span>
        </p>
      )}

      {/* ── WORKSPACE ───────────────────────────────────────────────────── */}
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2 md:grid-cols-[minmax(0,1fr)_340px] md:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Product catalog */}
        <Card className="animate-in flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] duration-500 slide-in-from-left-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <CardHeader className="shrink-0 gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)]">
                  <Grid2X2 className="size-4" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-sm">{t("cashier.addProducts")}</CardTitle>
                  <p className="truncate text-[11px] text-ink-soft">
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
                    data-barcode-input
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
                  <Button
                    type="button"
                    size="icon"
                    className="size-11 shrink-0"
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
                <div className="flex items-center justify-between gap-2">
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
                  <ScannerStatusIcon />
                </div>
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
        <Card className="animate-in flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] duration-500 slide-in-from-right-3">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)]">
                <ShoppingCart className="size-4" />
              </span>
              <div>
                <CardTitle className="text-sm">
                  {t("cashier.cart", { count: String(itemCount) })}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {cart.length === 0
                    ? t("cashier.emptyCart")
                    : `${cart.length} ${t("cashier.items").toLowerCase()}`}
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={holdCurrentSale}
                  title={t("cashier.holdSale")}
                  aria-label={t("cashier.holdSale")}
                >
                  <PackagePlus className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearCart}
                  className="text-destructive"
                  title={t("cashier.clearCart")}
                  aria-label={t("cashier.clearCart")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
            {/* Secondary, occasional panels live inside this scroll area so the
                till itself never needs a page-level scrollbar. */}
            {holdSales.length > 0 && (
              <Card>
                <CardHeader className="p-2.5">
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
                          ? "border-[var(--gold-500)] bg-[var(--gold-tint)]"
                          : "bg-[var(--surface-2)] hover:border-[var(--gold-500)]/50",
                      )}
                    >
                      <div className="flex gap-2.5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-12 shrink-0 rounded-lg border bg-muted object-contain p-0.5"
                          />
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
                                <span className="line-through">
                                  {formatPrice(item.originalPrice, settings.currency)}
                                </span>
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
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQty(item.id, -1)}
                            disabled={item.qty <= 1}
                            aria-label={t("cashier.decrease")}
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-6 text-center text-sm font-bold tabular-nums">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.qty >= item.stock}
                            aria-label={t("cashier.increase")}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive"
                            onClick={() => removeItem(item.id)}
                            aria-label={t("cashier.remove")}
                          >
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

          <CardFooter className="flex shrink-0 flex-col gap-2 border-t bg-background/40 p-2.5 sm:p-3">
            <div className="w-full space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cashier.subtotal")}</span>
                <span className="tabular-nums">
                  {formatPrice(totals.subtotal, settings.currency)}
                </span>
              </div>
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>{t("cashier.itemDiscounts")}</span>
                  <span className="tabular-nums">
                    −{formatPrice(totals.itemDiscount, settings.currency)}
                  </span>
                </div>
              )}
              {totals.orderDiscountAmt > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>{t("cashier.discountApplied")}</span>
                  <span className="tabular-nums">
                    −{formatPrice(totals.orderDiscountAmt, settings.currency)}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full space-y-1.5">
              <Collapsible open={discountOpen} onOpenChange={setDiscountOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <BadgePercent className="size-4 text-muted-foreground" />
                      {t("cashier.discount")}
                      {discountAmount > 0 && (
                        <span className="text-primary">
                          −{formatPrice(discountAmount, settings.currency)}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        discountOpen && "rotate-180",
                      )}
                    />
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
                method={method}
                allocations={split}
                onAllocationsChange={(a) => setSplit(a)}
                onMethodChange={setMethod}
              />

              {method === "cash" && split.length <= 1 && (
                <div className="md:hidden">
                  <QuickCashCalculator
                    total={totals.total}
                    currency={settings.currency}
                    received={cashReceived}
                    onReceivedChange={setCashReceived}
                    onCashReceivedChange={setCashReceived}
                  />
                </div>
              )}
            </div>
          </CardFooter>
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
