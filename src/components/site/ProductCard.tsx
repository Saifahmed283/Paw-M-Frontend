import { Link } from "@tanstack/react-router";
import { Dog, Heart, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart, removeFromCart, setCartQty, useCart } from "@/lib/cart-store";
import { useClinicStore, type Product } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { categoryKey } from "@/lib/product-categories";
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
  const cart = useCart();
  const out = product.stock <= 0;
  const inCart = cart.find((i) => i.id === product.id);
  if (out) {
    return (
      <Button size="sm" disabled className={cn("w-full", compact && "h-8")}>
        {t("store.outOfStock")}
      </Button>
    );
  }
  if (inCart) {
    return (
      <div
        className={cn(
          "flex w-full items-stretch overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface)]",
          compact ? "h-8" : "h-9",
        )}
      >
        <button
          type="button"
          aria-label={t("store.decreaseQty")}
          title={t("store.decreaseQty")}
          onClick={(e) => {
            e.preventDefault();
            if (inCart.qty <= 1) {
              removeFromCart(product.id);
            } else {
              setCartQty(product.id, inCart.qty - 1);
            }
          }}
          className="grid w-8 shrink-0 place-items-center bg-[var(--surface-2)] text-ink-soft transition-colors hover:bg-[var(--status-critical-bg)] hover:text-urgent active:scale-95"
        >
          <Minus className="size-4" />
        </button>
        <span className="flex min-w-8 flex-1 items-center justify-center border-x border-[var(--line)] text-sm font-semibold text-foreground tabular-nums">
          {inCart.qty}
        </span>
        <button
          type="button"
          aria-label={t("store.increaseQty")}
          title={t("store.increaseQty")}
          disabled={inCart.qty >= Math.max(1, inCart.stock)}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="grid w-8 shrink-0 place-items-center bg-[var(--surface-2)] text-ink-soft transition-colors hover:bg-[var(--primary-tint)] hover:text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <Button
      size="sm"
      className={cn("w-full", compact && "h-8")}
      onClick={(e) => {
        e.preventDefault();
        addToCart(product);
      }}
    >
      <Plus className="size-4" />
      {t("store.addToCart")}
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
        "grid size-8 place-items-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition-transform hover:scale-105",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          wished ? "fill-urgent text-urgent" : "text-ink-faint",
        )}
      />
    </button>
  );
}

export function ProductPrice({ product }: { product: Product }) {
  const { settings } = useClinicStore();
  const sale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  return (
    <span className="flex flex-col self-start">
      <span className="font-data text-lg font-bold tracking-tight text-foreground tabular-nums">
        {formatPrice(product.price, settings.currency)}
      </span>
      {sale && (
        <span className="font-mono text-xs font-medium text-ink-faint line-through">
          {formatPrice(product.compareAtPrice ?? 0, settings.currency)}
        </span>
      )}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { t, tOr } = useI18n();
  const out = product.stock <= 0;
  const lowStock = !out && product.stock < 5;
  const PetIcon = PET_ICON[product.petType ?? "both"] ?? Dog;

  return (
    <Link
      to="/store/$productId"
      params={{ productId: product.id }}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition-all duration-200 ease-[var(--ease-entrance)] hover:border-[var(--gold-500)] hover:shadow-[var(--shadow-2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--line)] bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full bg-white object-contain p-2 sm:p-3"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {product.featured && (
          <Badge className="absolute start-3 top-3 border-transparent bg-[var(--navy-900)] text-[var(--gold-400)] shadow-[var(--shadow-1)]">
            <Sparkles className="mr-1 size-3" />
            {t("store.featured")}
          </Badge>
        )}

        <WishlistButton productId={product.id} className="absolute end-3 top-3" />

        {out ? (
          <div className="absolute inset-0 grid place-items-center bg-[var(--canvas)]/85">
            <span className="rounded-[var(--radius-sm)] bg-[var(--navy-900)] px-3 py-1 text-xs font-semibold text-white">
              {t("store.outOfStock")}
            </span>
          </div>
        ) : (
          <span
            className={cn(
              "pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em]",
              lowStock
                ? "border-[var(--status-watch)]/40 bg-[var(--status-watch-bg)] text-[var(--status-watch-ink)]"
                : "border-[var(--line)] bg-[var(--surface)] text-ink-soft",
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", lowStock ? "bg-status-watch" : "bg-status-ok")}
            />
            {lowStock ? t("store.left", { count: String(product.stock) }) : t("store.inStock")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <PetIcon className="size-3.5" />
            {t(`store.pet.${product.petType ?? "both"}`)}
          </span>
          <span className="text-line-strong">/</span>
          <span>{tOr(`store.cat.${categoryKey(product.category)}`, product.category)}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[15px] font-bold leading-snug transition-colors group-hover:text-[var(--blue-700)] dark:group-hover:text-[var(--blue-400)]">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <ProductPrice product={product} />
          <div className="w-28 shrink-0">
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}
