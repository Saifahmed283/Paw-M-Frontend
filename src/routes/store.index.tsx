import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownWideNarrow, PackageSearch, Search, ShoppingBag } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { useClinicStore, type Product } from "@/lib/clinic-store";
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

const PRODUCT_CATEGORIES = ["food", "treats", "toys", "grooming", "health", "accessories"] as const;
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
  const { t } = useI18n();
  const { products } = useClinicStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [petType, setPetType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const q = query.trim().toLowerCase();
  const filtered = sortProducts(
    products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
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

  const categories = PRODUCT_CATEGORIES.filter((c) => products.some((p) => p.category === c));
  const petTypes = PET_TYPES.filter((p) => products.some((x) => (x.petType ?? "both") === p));

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: t("crumb.home"), to: "/" }, { label: t("crumb.store"), to: "/store" }]} />
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
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t("store.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`store.cat.${c}`)}
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
              {t("store.showing", {
                count: String(filtered.length),
                total: String(products.length),
              })}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
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
