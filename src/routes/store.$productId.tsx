import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Minus, Plus, ShoppingBag, Star, StarHalf } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard, WishlistButton } from "@/components/site/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addToCart } from "@/lib/cart-store";
import { createReview, useClinicStore, type Product } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { SITE_URL, withSiteUrl } from "@/lib/seo";

export const Route = createFileRoute("/store/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: `Pet Product — Paw-M Store` },
      { name: "description", content: "Browse and buy pet supplies from Paw-M Veterinary Clinic." },
      { name: "robots", content: "index,follow" },
      { property: "og:url", content: withSiteUrl(`/store/${params.productId}`) },
    ],
    links: [{ rel: "canonical", href: withSiteUrl(`/store/${params.productId}`) }],
  }),
  component: ProductPage,
});

function AddToCartButton({ product, qty }: { product: Product; qty: number }) {
  const { t } = useI18n();
  const [added, setAdded] = useState(false);
  return (
    <Button
      size="lg"
      variant={added ? "outline" : "default"}
      className="w-full shadow-glow sm:w-auto"
      onClick={() => {
        addToCart(product, qty);
        setAdded(true);
        toast.success(t("store.added"));
        window.setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {added ? t("store.added") : t("store.addToCart")}
    </Button>
  );
}

function Stars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating > i && rating < i + 1;
        return half ? (
          <StarHalf key={i} className={`${className} fill-amber-400 text-amber-400`} />
        ) : (
          <Star
            key={i}
            className={`${className} ${filled ? "fill-amber-400 text-amber-400" : "text-border"}`}
          />
        );
      })}
    </span>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const { t } = useI18n();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!author.trim() || comment.trim().length < 4) {
      toast.error(t("reviews.required"));
      return;
    }
    setBusy(true);
    try {
      await createReview({
        productId,
        author: author.trim(),
        rating,
        comment: comment.trim(),
      });
      setSent(true);
      toast.success(t("reviews.thanks"));
    } catch {
      toast.error(t("reviews.failed"));
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-success/25 bg-success/10 p-5 text-sm">
        {t("reviews.sent")}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <Label className="text-xs font-medium text-muted-foreground">{t("reviews.rating")}</Label>
        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${i + 1} ${t("reviews.stars")}`}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`size-6 ${
                  (hover || rating) > i ? "fill-amber-400 text-amber-400" : "text-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="rv-name" className="text-xs font-medium text-muted-foreground">
            {t("reviews.name")}
          </Label>
          <Input
            id="rv-name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1.5"
            maxLength={80}
            placeholder={t("reviews.namePlaceholder")}
          />
        </div>
        <div className="sm:self-end">
          <Button type="submit" size="sm" disabled={busy} className="w-full sm:w-auto">
            {t("reviews.submit")}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="rv-comment" className="text-xs font-medium text-muted-foreground">
          {t("reviews.comment")}
        </Label>
        <Textarea
          id="rv-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1.5"
          placeholder={t("reviews.commentPlaceholder")}
        />
      </div>
    </form>
  );
}

function ReviewsSection({ productId }: { productId: string }) {
  const { t } = useI18n();
  const { reviews } = useClinicStore();
  const list = useMemo(
    () =>
      reviews
        .filter((r) => r.productId === productId && r.status === "approved")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews, productId],
  );
  const avg = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">{t("reviews.title")}</h2>
            {list.length > 0 && (
              <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold">
                <Stars rating={avg} />
                {avg.toFixed(1)} · {list.length} {t("reviews.count")}
              </span>
            )}
          </div>

          {list.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">{t("reviews.none")}</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {list.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <Stars rating={r.rating} className="size-3.5" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t("reviews.writeTitle")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("reviews.writeDesc")}</p>
          <div className="mt-4">
            <ReviewForm productId={productId} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPage() {
  const { productId } = Route.useParams();
  const { t } = useI18n();
  const { products, settings } = useClinicStore();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    setQty(1);
  }, [productId]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Paw-M Store`;
    }
  }, [product?.name]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 pt-32">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t("store.loading")}</p>
        </div>
      </div>
    );
  }

  const out = product.stock <= 0;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? withSiteUrl(product.image) : `${SITE_URL}/og-image.png`,
    brand: { "@type": "Brand", name: "Paw-M" },
    offers: {
      "@type": "Offer",
      url: withSiteUrl(`/store/${product.id}`),
      priceCurrency: settings.currency,
      price: product.price,
      availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Paw-M Veterinary Clinic" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <section className="hero-gradient border-b border-border pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.store"), to: "/store" },
              { label: product.name, to: `/store/${product.id}` },
            ]}
          />
          <div className="flex items-center justify-between">
            <Link
              to="/store"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> {t("store.back")}
            </Link>
            <WishlistButton productId={product.id} />
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square size-full object-cover"
                />
              ) : (
                <div className="aspect-square size-full bg-muted" />
              )}
              {onSale && product.compareAtPrice != null && (
                <Badge className="absolute left-4 top-4 bg-destructive/90 text-destructive-foreground">
                  {t("store.sale")} −
                  {Math.round(
                    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
                  )}
                  %
                </Badge>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2">
                <Badge>{t(`store.cat.${product.category}`)}</Badge>
                {product.featured && (
                  <Badge className="bg-primary/90 text-primary-foreground">
                    {t("store.featured")}
                  </Badge>
                )}
                <Badge
                  variant={out ? "secondary" : "default"}
                  className={
                    out ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                  }
                >
                  {out
                    ? t("store.outOfStock")
                    : t("store.inStock", { count: String(product.stock) })}
                </Badge>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price, settings.currency)}
                </p>
                {onSale && product.compareAtPrice != null && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice, settings.currency)}
                  </p>
                )}
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

              {!out && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-xl border border-input">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={t("store.decreaseQty")}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={t("store.increaseQty")}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <AddToCartButton product={product} qty={qty} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection productId={product.id} />

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-2 sm:px-8">
          <h2 className="text-lg font-bold">{t("store.related")}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
