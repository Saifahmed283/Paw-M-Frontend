import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDownWideNarrow,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
  ShoppingBag,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { useClinicStore, type Product } from "@/lib/clinic-store";
import { categoryKey, countByCategory } from "@/lib/product-categories";
import { cn } from "@/lib/utils";

const title = "Pet Supply Store — Paw-M";
const description =
  "Food, treats, toys, grooming, health and accessories for dogs and cats, available at Paw-M Veterinary Clinic in New Cairo, Egypt.";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: ogMeta(title, description, "/store"),
    links: [{ rel: "canonical", href: withSiteUrl("/store") }],
  }),
  component: StorePage,
});

const PAGE_SIZE = 12;

const PET_TYPES = ["dog", "cat", "both"] as const;

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "store.sort.featured" },
  { key: "newest", label: "store.sort.newest" },
  { key: "price-asc", label: "store.sort.priceAsc" },
  { key: "price-desc", label: "store.sort.priceDesc" },
  { key: "name", label: "store.sort.name" },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return list.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
    case "featured":
    default:
      return list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
      );
  }
}

function StorePage() {
  const { t, tOr } = useI18n();
  const { products } = useClinicStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [petType, setPetType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  // Any change to the filters starts a fresh result set on page one.
  useEffect(() => setPage(1), [query, category, petType, sort]);

  const q = query.trim().toLowerCase();
  const filtered = sortProducts(
    products.filter((p) => {
      if (category !== "all" && categoryKey(p.category) !== category) return false;
      if (
        petType !== "all" &&
        (p.petType ?? "both") !== petType &&
        (p.petType ?? "both") !== "both"
      ) {
        return false;
      }
      if (!q) return true;
      return `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
    }),
    sort,
  );

  const categories = countByCategory(products);
  const petTypes = PET_TYPES.filter((p) => products.some((x) => (x.petType ?? "both") === p));

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const visiblePages = Array.from(
    new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]),
  )
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: t("crumb.store"), to: "/store" },
            ]}
          />
          <SectionHeading
            eyebrow={t("page.store.eyebrow")}
            title={t("page.store.title")}
            description={t("page.store.desc")}
            as="h1"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("store.search")}
              className="pl-9"
              aria-label={t("store.search")}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ArrowDownWideNarrow className="size-4" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                aria-label={t("store.sortLabel")}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {t(s.label)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t("store.all")}
            <span className="tabular-nums opacity-60">{products.length}</span>
          </button>
          {categories.map(({ key, count }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {tOr(`store.cat.${key}`, key)}
              <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>

        {petTypes.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setPetType("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                petType === "all"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t("store.pet.all")}
            </button>
            {petTypes.map((p) => (
              <button
                key={p}
                onClick={() => setPetType(p)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  petType === p
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(`store.pet.${p}`)}
              </button>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <PackageSearch className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("store.loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <PackageSearch className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("store.empty")}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              {t("dash.pager.showing", {
                from: String(filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1),
                to: String(Math.min(currentPage * PAGE_SIZE, filtered.length)),
                total: String(filtered.length),
              })}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {pageCount > 1 && (
              <nav
                className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
                aria-label={t("dash.pager.next")}
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  aria-label={t("dash.pager.prev")}
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                </button>
                {visiblePages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={cn(
                      "grid size-9 place-items-center rounded-lg border text-sm font-medium transition-colors",
                      p === currentPage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage >= pageCount}
                  className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  aria-label={t("dash.pager.next")}
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="size-5" />
            </span>
            <p className="text-sm font-medium">{t("store.collectHint")}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/contact">{t("store.contactUs")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
