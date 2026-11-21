import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ImageUp, Loader2, PackageSearch, Smartphone, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FawryPaymentPanel } from "@/components/store/FawryPaymentPanel";
import { InstapayQrPanel } from "@/components/store/InstapayQrPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientIsAuthed } from "@/lib/client-auth";
import { trackOrder, useClinicStore, type Order } from "@/lib/clinic-store";
import {
  canSubmitTransfer,
  showCashPickupNotice,
  submitTransferSubmission,
} from "@/lib/payment-verification";
import { localizedApiErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/store/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : "",
    phone: typeof search["phone"] === "string" ? search["phone"] : "",
    proof: search["proof"] === "1" ? "1" : "0",
  }),
  head: () => ({
    meta: [
      { title: "Track Order — Paw-M Store" },
      { name: "description", content: "Check the status of your Paw-M store order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackPage,
});

function PaymentStatusBadge({ order }: { order: Order }) {
  const { t } = useI18n();
  if (order.paymentStatus === "paid") {
    return <Badge className="bg-success/15 text-success">{t("pay.paid")}</Badge>;
  }
  if (order.paymentStatus === "proof_submitted" || order.paymentStatus === "under_review") {
    return <Badge className="bg-amber-500/15 text-amber-600">{t("pay.underReview")}</Badge>;
  }
  if (order.paymentStatus === "rejected") {
    return (
      <Badge className="bg-destructive/15 text-destructive">{t("track.statusRejected")}</Badge>
    );
  }
  return <Badge className="bg-muted text-muted-foreground">{t("pay.unpaid")}</Badge>;
}

function readImageFile(file: File | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("no file"));
    if (file.size > 4 * 1024 * 1024) return reject(new Error("too large"));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function toIso(localDateTime: string): string | undefined {
  if (!localDateTime) return undefined;
  const date = new Date(localDateTime);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Pre-fill the datetime-local field with "now" in the browser's timezone. */
function localDateTimeNow(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function TransferSubmissionForm({
  order,
  phone,
  onUpdated,
  autoFocus = false,
}: {
  order: Order;
  phone: string;
  onUpdated: (o: Order) => void;
  autoFocus?: boolean;
}) {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [senderName, setSenderName] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [transferredAt, setTransferredAt] = useState(localDateTimeNow);
  const [note, setNote] = useState("");
  const [evidenceBase64, setEvidenceBase64] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const total = formatPrice(order.total, settings.currency);

  const submit = async () => {
    if (busy) return;
    if (!senderName.trim() || !transferReference.trim() || !transferredAt || !evidenceBase64) {
      toast.error(t("track.allProofFieldsRequired"));
      return;
    }
    if (!toIso(transferredAt)) {
      toast.error(t("track.allProofFieldsRequired"));
      return;
    }
    setBusy(true);
    try {
      // Only guest orders need the phone ownership fallback; signed-in clients
      // are identified by their token. The tracking lookup phone is still used
      // as the fallback value.
      const isGuest = !clientIsAuthed();
      const result = await submitTransferSubmission(order.id, {
        senderName,
        transferReference,
        ...(toIso(transferredAt) ? { transferredAt: toIso(transferredAt) } : {}),
        ...(evidenceBase64 ? { evidenceBase64 } : {}),
        ...(note.trim() ? { note } : {}),
        ...(isGuest ? { phone: phone.trim() } : {}),
      });
      try {
        onUpdated(await trackOrder(order.id, phone.trim()));
      } catch {
        // Fall back to the claim decision if a tracking refresh is unavailable.
        const paymentStatus =
          result.decision === "approved"
            ? "paid"
            : result.decision === "rejected"
              ? "rejected"
              : result.decision === "submitted"
                ? "proof_submitted"
                : "under_review";
        onUpdated({ ...order, paymentStatus });
      }
      setSenderName("");
      setTransferReference("");
      setTransferredAt(localDateTimeNow());
      setNote("");
      setEvidenceBase64("");
      toast.success(t("track.submittedOk"));
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("track.submissionFailed")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-primary/25 bg-muted/30 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-primary">
        <Smartphone className="size-4" />
        {t("track.proofStepTwo")}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        {order.paymentStatus === "rejected" ? t("track.resubmitTitle") : t("track.proofTitle")}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {order.paymentMethod === "fawry"
          ? t("track.fawryProofDesc")
          : t("track.instapayProofDesc", { amount: total })}
      </p>
      {order.paymentMethod === "instapay" && settings.instapay && (
        <p className="mt-2 rounded-lg bg-background px-3 py-2 font-mono text-sm font-bold">
          {t("checkout.method.instapay.short")}: {settings.instapay}
        </p>
      )}

      <div className="mt-4 grid gap-3">
        <div>
          <Label htmlFor="track-sender" className="text-xs font-medium">
            {t("track.senderName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="track-sender"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="mt-1"
            autoComplete="name"
            required
          />
        </div>
        <div>
          <Label htmlFor="track-ref" className="text-xs font-medium">
            {order.paymentMethod === "fawry" ? t("track.fawryRef") : t("track.transferReference")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="track-ref"
            value={transferReference}
            onChange={(e) => setTransferReference(e.target.value)}
            className="mt-1"
            placeholder={t("checkout.refPlaceholder")}
            autoFocus={autoFocus}
            required
          />
        </div>
        <div>
          <Label htmlFor="track-date" className="text-xs font-medium">
            {t("track.transferredAt")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="track-date"
            type="datetime-local"
            value={transferredAt}
            onChange={(e) => setTransferredAt(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="track-note" className="text-xs font-medium text-muted-foreground">
            {t("verif.note")}
          </Label>
          <Textarea
            id="track-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            {t("checkout.proofImage")} <span className="text-destructive">*</span>
          </Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={async (e) => {
              try {
                setEvidenceBase64(await readImageFile(e.target.files?.[0]));
              } catch {
                toast.error(t("checkout.imageError"));
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ImageUp className="size-4" />
            {evidenceBase64 ? t("checkout.imageChosen") : t("track.chooseScreenshot")}
          </button>
          {evidenceBase64 && (
            <div className="mt-2 space-y-2">
              <img
                src={evidenceBase64}
                alt={t("track.proofImageAlt")}
                className="h-32 w-full rounded-xl border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setEvidenceBase64("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="flex items-center gap-1 text-xs font-medium text-destructive"
              >
                <X className="size-3.5" />
                {t("track.removeScreenshot")}
              </button>
            </div>
          )}
        </div>
        <Button size="lg" onClick={submit} disabled={busy} className="w-full">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {order.paymentStatus === "rejected" ? t("track.resubmit") : t("track.sendProof")}
        </Button>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  phone,
  onUpdated,
  autoOpenProof = false,
}: {
  order: Order;
  phone: string;
  onUpdated: (o: Order) => void;
  autoOpenProof?: boolean;
}) {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const total = formatPrice(order.total, settings.currency);
  const canSubmit = canSubmitTransfer(order);
  const showCash = showCashPickupNotice(order);

  return (
    <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
          <p className="mt-1 text-lg font-bold">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">
            {order.phone} · {order.email}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge>{t(`dash.status.${order.status}`)}</Badge>
          <PaymentStatusBadge order={order} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.items.map((item) => (
          <span
            key={`${order.id}-${item.id}`}
            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs"
          >
            {item.name} × {item.qty}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {t(`checkout.method.${order.paymentMethod}.title`)}
        </span>
        <span className="text-xl font-bold">{total}</span>
      </div>

      {showCash && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold">{t("track.payAtPickup", { amount: total })}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {t("track.pickupReference", { orderId: order.id })}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-600">{t("checkout.notPaidNote")}</p>
        </div>
      )}

      {(order.paymentMethod === "instapay" || order.paymentMethod === "fawry") && canSubmit && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold">
            {order.paymentMethod === "fawry"
              ? t("track.fawryProofStepOne")
              : t("track.proofStepOne")}
          </p>
          {order.paymentMethod === "fawry" ? (
            <FawryPaymentPanel amountLabel={total} reference={order.id} compact />
          ) : (
            <InstapayQrPanel account={settings.instapay} amountLabel={total} compact />
          )}
        </div>
      )}

      {canSubmit && (
        <TransferSubmissionForm
          order={order}
          phone={phone}
          onUpdated={onUpdated}
          autoFocus={autoOpenProof}
        />
      )}
    </div>
  );
}

function TrackPage() {
  const { t } = useI18n();
  const { order: searchOrder, phone: searchPhone, proof } = Route.useSearch();
  const [orderId, setOrderId] = useState(searchOrder);
  const [phone, setPhone] = useState(searchPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const autoLookedUp = useRef(false);

  const performLookup = useCallback(
    async (oid: string, ph: string) => {
      const cleanOrder = oid.trim();
      const cleanPhone = ph.trim();
      if (!cleanOrder || !cleanPhone) {
        setError(t("track.required"));
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const found = await trackOrder(cleanOrder, cleanPhone);
        setOrder(found);
      } catch {
        setOrder(null);
        setError(t("track.notFound"));
      } finally {
        setBusy(false);
      }
    },
    [t],
  );

  // Arriving from checkout with prefilled details: look the order up once so
  // the customer lands straight on the payment-proof step.
  useEffect(() => {
    if (autoLookedUp.current || !searchOrder || !searchPhone) return;
    autoLookedUp.current = true;
    void performLookup(searchOrder, searchPhone);
  }, [searchOrder, searchPhone, performLookup]);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    void performLookup(orderId, phone);
  };

  return (
    <section className="hero-gradient min-h-dvh px-5 py-32 sm:py-36">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> {t("store.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{t("track.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("track.desc")}</p>

        <form
          onSubmit={lookup}
          className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card"
        >
          <div className="grid gap-4">
            <div>
              <Label htmlFor="track-order">{t("track.orderId")}</Label>
              <Input
                id="track-order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1.5 font-mono"
                placeholder="…"
              />
            </div>
            <div>
              <Label htmlFor="track-phone">{t("track.phone")}</Label>
              <Input
                id="track-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
                autoComplete="tel"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="shadow-glow">
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <PackageSearch className="size-4" />
              )}
              {t("track.lookup")}
            </Button>
          </div>
        </form>

        {order && (
          <OrderCard
            order={order}
            phone={phone}
            onUpdated={setOrder}
            autoOpenProof={proof === "1"}
          />
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">{t("track.help")}</p>
      </div>
    </section>
  );
}
