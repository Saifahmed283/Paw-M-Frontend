import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";
import { useClinicStore, setReviewStatus, deleteReview, type Review } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ReviewsPanel() {
  const { t } = useI18n();
  const { products, reviews } = useClinicStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = useMemo(
    () => reviews.filter((r) => statusFilter === "all" || r.status === statusFilter),
    [reviews, statusFilter],
  );
  const grid = useGrid(filtered, query, ["author", "comment", "productId"]);
  const pending = grid.slice.filter((r) => r.status === "pending");
  const approved = grid.slice.filter((r) => r.status === "approved");
  const productName = (productId: string) =>
    products.find((product) => product.id === productId)?.name ?? productId;

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
            {[
              { value: "all", key: "dash.filterAll" },
              { value: "pending", key: "dash.reviews.pending" },
              { value: "approved", key: "dash.reviews.approved" },
              { value: "rejected", key: "dash.reviews.rejected" },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatusFilter(s.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(s.key)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                {t("dash.reviews.pending")}
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {pending.length}
                </span>
              </h3>
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{r.author}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {r.productId === "clinic"
                              ? t("reviews.googleSource")
                              : productName(r.productId)}
                          </p>
                          {r.productId === "clinic" && (
                            <Badge
                              variant="secondary"
                              className="ms-1 text-[10px] px-1.5 py-0 align-middle"
                            >
                              {t("reviews.badge.google")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-border",
                            )}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {r.comment}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="h-7"
                        onClick={async () => {
                          await setReviewStatus(r.id, "approved");
                          toast.success(t("dash.toast.saved"));
                        }}
                      >
                        {t("dash.reviews.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteReview(r.id);
                          toast.success(t("dash.toast.deleted"));
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                {t("dash.reviews.approved")}
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-600">
                  {approved.length}
                </span>
              </h3>
              <div className="space-y-3">
                {approved.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {r.author}
                        {r.productId !== "clinic" && (
                          <span className="font-normal text-muted-foreground">
                            — {productName(r.productId)}
                          </span>
                        )}
                      </p>
                      {r.productId === "clinic" && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t("reviews.googleSource")}
                        </p>
                      )}
                      {r.productId !== "clinic" && (
                        <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-border",
                            )}
                          />
                        ))}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteReview(r.id);
                          toast.success(t("dash.toast.deleted"));
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {approved.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
        </div>

        <PaginationBar
          total={grid.total}
          page={grid.page}
          pageSize={grid.pageSize}
          pageCount={grid.pageCount}
          onPage={grid.setPage}
          onPageSize={grid.setPageSize}
        />
      </CardContent>
    </Card>
  );
}
