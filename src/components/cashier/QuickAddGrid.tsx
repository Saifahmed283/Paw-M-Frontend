import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { categoryKey } from "@/lib/product-categories";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/clinic-store";
import type { CartItem } from "./types";

type Props = {
  products: Product[];
  cart: CartItem[];
  currency: string;
  onAdd: (product: Product) => void;
};

const PAGE_SIZE = 10;

export function QuickAddGrid({ products, cart, currency, onAdd }: Props) {
  const { t, tOr } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(categoryKey(p.category));
    });
    return Array.from(set).sort();
  }, [products]);

  const inCart = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((c) => map.set(c.id, c.qty));
    return map;
  }, [cart]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && categoryKey(p.category) !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode ? p.barcode.toLowerCase().includes(q) : false) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  useEffect(() => setPage(1), [query, category]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("cashier.quickAddSearch")}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <Badge
            variant={category === "all" ? "default" : "outline"}
            className="shrink-0 cursor-pointer"
            onClick={() => setCategory("all")}
          >
            <SlidersHorizontal className="mr-1 size-3" />
            {t("cashier.allCategories")}
          </Badge>
          {categories.map((c) => (
            <Badge
              key={c}
              variant={category === c ? "default" : "outline"}
              className="shrink-0 cursor-pointer"
              onClick={() => setCategory(c)}
            >
              {tOr(`store.cat.${c}`, c)}
            </Badge>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("cashier.quickAddEmpty")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => {
            const qty = inCart.get(p.id) ?? 0;
            const out = p.stock <= 0;
            const atMax = qty >= p.stock;
            return (
              <button
                key={p.id}
                type="button"
                disabled={out}
                onClick={() => onAdd(p)}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all",
                  out
                    ? "border-border opacity-50"
                    : "border-border hover:border-primary hover:shadow-md",
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-full bg-muted object-contain p-2"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-3xl text-muted-foreground/40">
                      🐾
                    </div>
                  )}
                  {qty > 0 && (
                    <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {qty}
                    </span>
                  )}
                  {out && (
                    <span className="absolute inset-0 grid place-items-center bg-black/40 text-xs font-semibold text-white">
                      {t("cashier.soldOut")}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-2">
                  <p className="line-clamp-2 text-xs font-medium leading-snug">{p.name}</p>
                  <div className="mt-auto flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(p.price, currency)}
                    </span>
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground",
                        atMax && !out && "opacity-40",
                      )}
                      aria-hidden
                    >
                      <Plus className="size-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-xs text-muted-foreground">
            {t("cashier.quickAddRange", {
              start: String((page - 1) * PAGE_SIZE + 1),
              end: String(Math.min(page * PAGE_SIZE, filtered.length)),
              total: String(filtered.length),
            })}
          </p>
          {pageCount > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label={t("cashier.prevPage")}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </Button>
              <span className="text-xs font-medium">
                {t("cashier.pageOf", { page: String(page), total: String(pageCount) })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                aria-label={t("cashier.nextPage")}
              >
                <ChevronRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
