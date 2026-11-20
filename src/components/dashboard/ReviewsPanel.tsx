import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";
import {
  useClinicStore,
  setReviewStatus,
  deleteReview,
  type Review,
  type Product,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-border")}
        />
      ))}
    </span>
  );
}

function ReviewCard({
  review,
  productName,
  busy,
  onApprove,
  onReject,
  onDelete,
}: {
  review: Review;
  productName: (id: string) => string;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const isGoogle = review.productId === "clinic";
  const source = isGoogle ? t("reviews.googleSource") : productName(review.productId);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{review.author}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">{source}</p>
            {isGoogle && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {t("reviews.badge.google")}
              </Badge>
            )}
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {review.status !== "approved" && (
          <Button size="sm" className="h-7" onClick={onApprove} disabled={busy}>
            {t("dash.reviews.approve")}
          </Button>
        )}
        {review.status !== "rejected" && (
          <Button size="sm" variant="outline" className="h-7" onClick={onReject} disabled={busy}>
            {t("dash.reject")}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-muted-foreground hover:text-destructive"
          aria-label={t("dash.delete")}
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ReviewsPanel() {
  const { t } = useI18n();
  const { products, reviews } = useClinicStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(
    () => reviews.filter((r) => statusFilter === "all" || r.status === statusFilter),
    [reviews, statusFilter],
  );
  const grid = useGrid(filtered, query, ["author", "comment", "productId"]);

  // Counts describe the whole filtered result, not the current page.
  const counts = useMemo(
    () => ({
      pending: filtered.filter((r) => r.status === "pending").length,
      approved: filtered.filter((r) => r.status === "approved").length,
      rejected: filtered.filter((r) => r.status === "rejected").length,
    }),
    [filtered],
  );

  const productName = (productId: string) =>
    products.find((product: Product) => product.id === productId)?.name ?? productId;

  const changeStatus = async (id: string, status: "approved" | "rejected") => {
    if (busyId) return;
    setBusyId(id);
    try {
      await setReviewStatus(id, status);
      toast.success(t("dash.toast.saved"));
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteReview(pendingDelete);
      toast.success(t("dash.toast.deleted"));
      setPendingDelete(null);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setDeleting(false);
    }
  };

  const sections: { status: Review["status"]; label: string; count: number; color: string }[] = [
    {
      status: "pending",
      label: t("dash.reviews.pending"),
      count: counts.pending,
      color: "bg-amber-500/15 text-amber-600",
    },
    {
      status: "approved",
      label: t("dash.reviews.approved"),
      count: counts.approved,
      color: "bg-green-500/15 text-green-600",
    },
    {
      status: "rejected",
      label: t("dash.reviews.rejected"),
      count: counts.rejected,
      color: "bg-rose-500/15 text-rose-600",
    },
  ];

  const filters = [
    { value: "all", key: "dash.filterAll" },
    { value: "pending", key: "dash.reviews.pending" },
    { value: "approved", key: "dash.reviews.approved" },
    { value: "rejected", key: "dash.reviews.rejected" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dash.reviews")}</CardTitle>
        <CardDescription>{t("dash.reviews.hint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                type="button"
                key={f.value}
                onClick={() => {
                  setStatusFilter(f.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(f.key)}
              </button>
            ))}
          </div>
        </div>

        {grid.slice.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => {
              const pageReviews = grid.slice.filter((r) => r.status === section.status);
              if (pageReviews.length === 0) return null;
              return (
                <div key={section.status}>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    {section.label}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                        section.color,
                      )}
                    >
                      {section.count}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {pageReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        productName={productName}
                        busy={busyId === review.id}
                        onApprove={() => changeStatus(review.id, "approved")}
                        onReject={() => changeStatus(review.id, "rejected")}
                        onDelete={() => setPendingDelete(review.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PaginationBar
          total={grid.total}
          page={grid.page}
          pageSize={grid.pageSize}
          pageCount={grid.pageCount}
          onPage={grid.setPage}
          onPageSize={grid.setPageSize}
        />

        <ConfirmActionDialog
          open={pendingDelete !== null}
          title={t("dash.delete")}
          description={t("dash.cannotUndo")}
          busy={deleting}
          onConfirm={confirmDelete}
          onClose={() => !deleting && setPendingDelete(null)}
        />
      </CardContent>
    </Card>
  );
}
