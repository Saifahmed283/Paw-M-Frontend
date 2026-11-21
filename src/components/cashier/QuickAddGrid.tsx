import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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

const PAGE_SIZE = 5;

export function QuickAddGrid({ products, cart, currency, onAdd }: Props) {
  const { t, tOr } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (!p.category) return;
      const key = categoryKey(p.category);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [products]);

  const categories = useMemo(() => Array.from(categoryCounts.keys()).sort(), [categoryCounts]);

  const inCart = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((c) => map.set(c.id, c.qty));
    return map;
  }, [cart]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && categoryKey(p.category) !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode ? p.barcode.toLowerCase().includes(q) : false) ||
        p.category.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) =>
      sort === "price" ? Number(a.price) - Number(b.price) : a.name.localeCompare(b.name),
    );
  }, [products, query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  useEffect(() => setPage(1), [query, category, sort]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("cashier.quickAddSearch")}
            className="h-9 pl-9"
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          onClick={() => setSort((s) => (s === "name" ? "price" : "name"))}
          title={sort === "name" ? t("dash.sort.title") : t("dash.sort.amount")}
          aria-label={sort === "name" ? t("dash.sort.title") : t("dash.sort.amount")}
        >
          <ArrowUpDown className="size-4" />
        </Button>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <Badge
            variant={category === "all" ? "default" : "outline"}
            className="shrink-0 cursor-pointer px-2.5 py-1"
            onClick={() => setCategory("all")}
          >
            <SlidersHorizontal className="me-1 size-3" />
            {t("cashier.allCategories")}
            <span className="ms-1.5 opacity-70">{products.length}</span>
          </Badge>
          {categories.map((c) => (
            <Badge
              key={c}
              variant={category === c ? "default" : "outline"}
              className="shrink-0 cursor-pointer px-2.5 py-1"
              onClick={() => setCategory(c)}
            >
              {tOr(`store.cat.${c}`, c)}
              <span className="ms-1.5 opacity-70">{categoryCounts.get(c) ?? 0}</span>
            </Badge>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("cashier.quickAddEmpty")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
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
                  "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--panel-border)] bg-[var(--panel-bg)] text-start shadow-[var(--shadow-1)] transition-all duration-200 ease-[var(--ease-entrance)]",
                  out
                    ? "opacity-50"
                    : "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[var(--shadow-2)]",
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-full bg-muted object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-3xl text-muted-foreground/40">
                      🐾
                    </div>
                  )}
                  {qty > 0 && (
                    <span className="absolute end-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
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
                  <p className="line-clamp-2 min-h-[2rem] text-xs font-medium leading-snug">
                    {p.name}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-1">
                    <span className="truncate font-data text-sm font-bold text-primary-strong tabular-nums">
                      {formatPrice(p.price, currency)}
                    </span>
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full bg-primary-tint text-primary transition group-hover:bg-primary group-hover:text-primary-foreground",
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2">
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
