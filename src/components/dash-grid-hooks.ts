import { useEffect, useMemo, useState } from "react";

export type SortState = { key: string; dir: "asc" | "desc" };

export function useSortState(defaultKey: string, defaultDir: "asc" | "desc" = "asc") {
  const [sort, setSort] = useState<SortState>({ key: defaultKey, dir: defaultDir });
  const toggle = (key: string, descFirst = false) =>
    setSort((s) =>
      s.key !== key
        ? { key, dir: descFirst ? "desc" : "asc" }
        : { key, dir: s.dir === "asc" ? "desc" : "asc" },
    );
  return { sort, toggle };
}

export function sortedSlice<T>(
  items: T[],
  sort: SortState,
  comparators: Record<string, (a: T, b: T) => number>,
) {
  const cmp = comparators[sort.key];
  // Always copy: reversing the caller's array in place would corrupt the
  // source data when no comparator is registered for the current sort key.
  const sorted = cmp ? [...items].sort(cmp) : [...items];
  return sort.dir === "desc" ? sorted.reverse() : sorted;
}

/**
 * Client-side grid state: filters by text across the given fields and pages
 * the result. Reset the page whenever the dataset or filters change.
 */
export function useGrid<T>(
  items: T[],
  searchText: string,
  searchFields: (keyof T)[] = [],
  initialPageSize = 10,
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const q = searchText.trim().toLowerCase();
  // Callers pass an inline array literal, so its identity changes every render.
  // Key the memo on its contents instead to keep filtering cached.
  const fieldsKey = searchFields.join("\u0000");
  const filtered = useMemo(() => {
    if (!q || searchFields.length === 0) return items;
    return items.filter((item) =>
      searchFields.some((f) =>
        String(item[f] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q, fieldsKey]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const slice = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  return { page, setPage, pageSize, setPageSize, pageCount, total, slice };
}
