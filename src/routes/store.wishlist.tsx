import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, PackageSearch } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { useWishlist } from "@/lib/wishlist-store";

const title = "Your Wishlist — Paw-M";
const description = "All the products you saved at Paw-M Veterinary Clinic, back in one place.";

export const Route = createFileRoute("/store/wishlist")({
  head: () => ({
    meta: ogMeta(title, description, "/store/wishlist"),
    links: [{ rel: "canonical", href: withSiteUrl("/store/wishlist") }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { t } = useI18n();
  const { products } = useClinicStore();
  const wished = useWishlist();

  const items = products.filter((p) => wished.includes(p.id));

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: t("crumb.home"), to: "/" }, { label: t("crumb.store"), to: "/store" }, { label: t("page.wishlist.title"), to: "/store/wishlist" }]} />
          <SectionHeading
            eyebrow={t("page.wishlist.eyebrow")}
            title={t("page.wishlist.title")}
            description={t("page.wishlist.desc")}
            as="h1"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary">
              <Heart className="size-8" />
            </span>
            <p className="max-w-md text-sm text-muted-foreground">{t("store.wishlistEmpty")}</p>
            <Button asChild className="mt-2 shadow-glow">
              <Link to="/store">{t("store.wishlistBrowse")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              {t("store.showing", { count: String(items.length), total: String(items.length) })}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
