import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Dog, Heart, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart-store";
import { useClinicStore, type Product } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useIsWished, toggleWishlist } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

const PET_ICON: Record<string, React.ElementType> = { dog: Dog, cat: Dog, both: Dog };

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
        toast.success(nowWished ? t("wishlist.removed") : t("wishlist.added"), {
          id: `wl-${productId}`,
        });
      }}
      aria-label={wished ? t("wishlist.remove") : t("wishlist.add")}
      aria-pressed={wished}
      className={cn(
        "grid size-8 place-items-center rounded-full bg-background/80 shadow-card backdrop-blur transition-all hover:scale-110",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-colors", wished ? "fill-rose-500 text-rose-500" : "text-muted-foreground")}
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
  const lowStock = !out && product.stock <= 5;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const PetIcon = PET_ICON[product.petType ?? "both"] ?? Dog;

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="border border-border/60 bg-background/60 text-foreground backdrop-blur-md dark:bg-background/80 dark:text-foreground">{t(`store.cat.${product.category}`)}</Badge>
          {onSale && product.compareAtPrice != null && (
            <Badge className="border-amber-300/60 bg-amber-400 text-amber-900 backdrop-blur-md dark:border-amber-400/40 dark:bg-amber-500/90 dark:text-amber-50">
              -
              {Math.round(
                ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
              )}
              %
            </Badge>
          )}
          {product.featured && (
            <Badge className="border border-amber-300/60 bg-amber-500 text-amber-900 backdrop-blur-md dark:border-amber-400/50 dark:bg-amber-400/90 dark:text-amber-950">
              <Sparkles className="mr-1 size-3" />
              {t("store.featured")}
            </Badge>
          )}
        </div>

        <WishlistButton productId={product.id} className="absolute right-3 top-3" />

        {out ? (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              {t("store.outOfStock")}
            </span>
          </div>
        ) : (
<motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="absolute bottom-3 right-3"
          >
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md border",
                lowStock
                  ? "border-amber-400/60 bg-amber-400/90 text-amber-900 dark:text-amber-950"
                  : "border-success/60 bg-success/90 text-success-foreground dark:text-success-foreground",
              )}
            >
              <span className={cn("size-1.5 rounded-full", lowStock ? "bg-amber-700" : "bg-success-foreground")} />
              {lowStock ? `${product.stock} left` : "In stock"}
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <PetIcon className="size-3" />
            {t(`store.pet.${product.petType ?? "both"}`)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
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