import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ChevronLeft, ImageUp, Landmark, Loader2, PackageSearch, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPaymentProof, trackOrder, useClinicStore, type Order } from "@/lib/clinic-store";
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
  if (order.paymentStatus === "proof_submitted") {
    return <Badge className="bg-amber-500/15 text-amber-600">{t("pay.underReview")}</Badge>;
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

function OrderCard({ order, onUpdated }: { order: Order; onUpdated: (o: Order) => void }) {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [ref, setRef] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submitProof = async () => {
    if (busy) return;
    const hasRef = ref.trim().length > 0;
    const hasImage = proofImage.length > 0;
    if (order.paymentMethod === "fawry" && !hasRef) {
      toast.error(t("track.refRequired"));
      return;
    }
    if (order.paymentMethod === "instapay" && !hasRef && !hasImage) {
      toast.error(t("track.proofRequired"));
      return;
    }
    setBusy(true);
    try {
      const updated = await submitPaymentProof(order.id, {
        paymentRef: ref.trim() || undefined,
        proofImage: hasImage ? proofImage : undefined,
      });
      onUpdated(updated);
      setRef("");
      setProofImage("");
      toast.success(t("track.proofSent"));
    } catch {
      toast.error(t("track.failed"));
    } finally {
      setBusy(false);
    }
  };

  const canSubmitProof = order.paymentStatus !== "paid" && order.paymentMethod !== "cash";

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
        <span className="text-xl font-bold">{formatPrice(order.total, settings.currency)}</span>
      </div>

      {order.paymentRef && order.paymentMethod === "fawry" && (
        <p className="mt-3 rounded-xl bg-muted/50 px-4 py-2.5 font-mono text-sm">
          {t("track.fawryRef")}:{" "}
          <span className="font-bold tracking-widest">{order.paymentRef}</span>
        </p>
      )}

      {order.proofImage && (
        <a href={order.proofImage} target="_blank" rel="noreferrer" className="mt-3 block">
          <img
            src={order.proofImage}
            alt={t("track.proofImageAlt")}
            className="h-40 w-full rounded-xl border border-border object-cover"
          />
        </a>
      )}

      {canSubmitProof && (
        <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {order.paymentMethod === "fawry" ? (
              <Landmark className="size-4 text-primary" />
            ) : (
              <Smartphone className="size-4 text-primary" />
            )}
            {t("track.proofTitle")}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {order.paymentMethod === "fawry"
              ? t("track.fawryProofDesc")
              : t("track.instapayProofDesc")}
          </p>
          {order.paymentMethod === "instapay" && settings.instapay && (
            <p className="mt-2 rounded-lg bg-background px-3 py-2 font-mono text-sm font-bold">
              {t("checkout.method.instapay.short")}: {settings.instapay}
            </p>
          )}

          <div className="mt-3 grid gap-3">
            <div>
              <Label htmlFor="track-ref" className="text-xs font-medium text-muted-foreground">
                {t("track.refNumber")}
              </Label>
              <Input
                id="track-ref"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className="mt-1"
                placeholder={t("checkout.refPlaceholder")}
              />
            </div>
            {order.paymentMethod === "instapay" && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    try {
                      setProofImage(await readImageFile(e.target.files?.[0]));
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
                  {proofImage ? t("checkout.imageChosen") : t("checkout.uploadProof")}
                </button>
                {proofImage && (
                  <img
                    src={proofImage}
                    alt=""
                    className="mt-2 h-32 w-full rounded-xl border border-border object-cover"
                  />
                )}
              </div>
            )}
            <Button size="sm" onClick={submitProof} disabled={busy} className="w-full sm:w-auto">
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {t("track.sendProof")}
            </Button>
          </div>
        </div>
      )}

      {order.paymentMethod === "cash" && order.paymentStatus !== "paid" && (
        <p className="mt-4 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
          {t("checkout.cashNote")}
        </p>
      )}
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

        {order && <OrderCard order={order} onUpdated={setOrder} />}

        <p className="mt-6 text-center text-xs text-muted-foreground">{t("track.help")}</p>
      </div>
    </section>
  );
}
