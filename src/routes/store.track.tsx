import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ChevronLeft, ImageUp, Loader2, PackageSearch, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function TransferSubmissionForm({
  order,
  phone,
  onUpdated,
}: {
  order: Order;
  phone: string;
  onUpdated: (o: Order) => void;
}) {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [senderName, setSenderName] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [transferredAt, setTransferredAt] = useState("");
  const [note, setNote] = useState("");
  const [evidenceBase64, setEvidenceBase64] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const total = formatPrice(order.total, settings.currency);

  const submit = async () => {
    if (busy) return;
    if (!senderName.trim() || !transferReference.trim()) {
      toast.error(t("track.senderAndRefRequired"));
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
      setTransferredAt("");
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
    <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Smartphone className="size-4 text-primary" />
        {order.paymentStatus === "rejected" ? t("track.resubmitTitle") : t("track.proofTitle")}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {t("track.instapayProofDesc", { amount: total })}
      </p>
      {settings.instapay && (
        <p className="mt-2 rounded-lg bg-background px-3 py-2 font-mono text-sm font-bold">
          {t("checkout.method.instapay.short")}: {settings.instapay}
        </p>
      )}

      <div className="mt-3 grid gap-3">
        <div>
          <Label htmlFor="track-sender" className="text-xs font-medium text-muted-foreground">
            {t("track.senderName")}
          </Label>
          <Input
            id="track-sender"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="mt-1"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="track-ref" className="text-xs font-medium text-muted-foreground">
            {t("track.transferReference")}
          </Label>
          <Input
            id="track-ref"
            value={transferReference}
            onChange={(e) => setTransferReference(e.target.value)}
            className="mt-1"
            placeholder={t("checkout.refPlaceholder")}
          />
        </div>
        <div>
          <Label htmlFor="track-date" className="text-xs font-medium text-muted-foreground">
            {t("track.transferredAt")}
          </Label>
          <Input
            id="track-date"
            type="datetime-local"
            value={transferredAt}
            onChange={(e) => setTransferredAt(e.target.value)}
            className="mt-1"
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
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ImageUp className="size-4" />
            {evidenceBase64 ? t("checkout.imageChosen") : t("checkout.uploadProof")}
          </button>
          {evidenceBase64 && (
            <img
              src={evidenceBase64}
              alt=""
              className="mt-2 h-32 w-full rounded-xl border border-border object-cover"
            />
          )}
        </div>
        <Button size="sm" onClick={submit} disabled={busy} className="w-full sm:w-auto">
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
}: {
  order: Order;
  phone: string;
  onUpdated: (o: Order) => void;
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

      {canSubmit && <TransferSubmissionForm order={order} phone={phone} onUpdated={onUpdated} />}
    </div>
  );
}

function TrackPage() {
  const { t } = useI18n();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!orderId.trim() || !phone.trim()) {
      setError(t("track.required"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const found = await trackOrder(orderId.trim(), phone.trim());
      setOrder(found);
    } catch {
      setOrder(null);
      setError(t("track.notFound"));
    } finally {
      setBusy(false);
    }
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

        {order && <OrderCard order={order} phone={phone} onUpdated={setOrder} />}

        <p className="mt-6 text-center text-xs text-muted-foreground">{t("track.help")}</p>
      </div>
    </section>
  );
}
