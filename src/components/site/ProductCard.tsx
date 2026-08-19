import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Heart, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart-store";
import { useClinicStore, type Product } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useIsWished, toggleWishlist } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;
  if (out) {
    return (
      <Button size="sm" disabled className={cn("w-full", compact && "h-8")}>
        {t("store.outOfStock")}
      </Button>
    );
  }
  return (
    <Button
      size="sm"
      variant={added ? "outline" : "default"}
      className={cn("w-full", compact && "h-8")}
      onClick={(e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        toast.success(t("store.added"));
        window.setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      {added ? t("store.added") : t("store.addToCart")}
    </Button>
  );
}

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { t } = useI18n();
  const wished = useIsWished(productId);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const nowWished = toggleWishlist(productId);
        toast.success(nowWished ? t("wishlist.added") : t("wishlist.removed"), {
          id: `wl-${productId}`,
        });
      }}
      aria-label={wished ? t("wishlist.remove") : t("wishlist.add")}
      aria-pressed={wished}
      className={cn(
        "grid size-8 place-items-center rounded-full bg-background/80 shadow-card backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      <Heart
        className={cn("size-4", wished ? "fill-rose-500 text-rose-500" : "text-muted-foreground")}
      />
    </button>
  );
}

export function ProductPrice({ product }: { product: Product }) {
  const { settings } = useClinicStore();
  const sale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-lg font-bold">{formatPrice(product.price, settings.currency)}</span>
      {sale && (
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(product.compareAtPrice ?? 0, settings.currency)}
        </span>
      )}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const out = product.stock <= 0;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  return (
    <Link
      to="/store/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-raised"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-background/80 backdrop-blur">
            {t(`store.cat.${product.category}`)}
          </Badge>
          {onSale && product.compareAtPrice != null && (
            <Badge className="bg-destructive/90 text-destructive-foreground">
              -
              {Math.round(
                ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
              )}
              %
            </Badge>
          )}
        </div>
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
        {out && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              {t("store.outOfStock")}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <ProductPrice product={product} />
          <div className="w-32">
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}
