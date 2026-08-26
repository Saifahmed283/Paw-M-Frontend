import { useMemo } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* eslint-disable react-refresh/only-export-components */
export { useSortState, sortedSlice, useGrid } from "./dash-grid-hooks";
export type { SortState } from "./dash-grid-hooks";

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ps-9"
        aria-label={placeholder}
      />
    </div>
  );
}

export function SortChip({
  label,
  active,
  dir,
  onToggle,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
      aria-pressed={active}
    >
      {label}
      {active &&
        (dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
    </button>
  );
}

export function PaginationBar({
  total,
  page,
  pageSize,
  pageCount,
  onPage,
  onPageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
}) {
  const { t } = useI18n();
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const set = new Set<number>([1, pageCount, page - 1, page, page + 1]);
    return Array.from(set)
      .filter((p) => p >= 1 && p <= pageCount)
      .sort((a, b) => a - b);
  }, [page, pageCount]);

  const pageBtn =
    "grid size-8 place-items-center rounded-lg border text-xs font-medium transition-colors disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-xs text-muted-foreground">
        {t("dash.pager.showing", { from: String(from), to: String(to), total: String(total) })}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className={cn(
            pageBtn,
            "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
          aria-label={t("dash.pager.prev")}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={cn(
              pageBtn,
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          className={cn(
            pageBtn,
            "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
          aria-label={t("dash.pager.next")}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSize(Number(e.target.value));
            onPage(1);
          }}
          className="ms-1 h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
          aria-label={t("dash.pager.perPage")}
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n} {t("dash.pager.perPage")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
