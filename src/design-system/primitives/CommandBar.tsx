import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { GlassPanel } from "@/design-system/primitives/GlassPanel";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  label: string;
  group?: string | undefined;
  hint?: string | undefined;
  icon?: ReactNode;
  onSelect: () => void;
};

/**
 * A ⌘K navigation palette, shared by the dashboard and the store.
 * Pure local state — no new dependency and no route/data coupling.
 */
export function CommandBar({
  items,
  placeholder,
  className,
  shortcut = "⌘K",
}: {
  items: CommandItem[];
  placeholder?: string;
  className?: string;
  shortcut?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || (item.hint ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const select = (item: CommandItem | undefined) => {
    if (!item) return;
    item.onSelect();
    setOpen(false);
  };

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const key = item.group ?? "";
      const bucket = map.get(key);
      if (bucket) bucket.push(item);
      else map.set(key, [item]);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-10 w-full max-w-sm items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-4 text-start text-sm text-ink-faint transition-colors hover:border-[var(--gold-500)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Search className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{placeholder ?? t("command.placeholder")}</span>
        <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft sm:inline-block">
          {shortcut}
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
          <div
            className="absolute inset-0 bg-[var(--navy-950)]/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <GlassPanel
            elevation={3}
            tone="solid"
            role="dialog"
            aria-modal="true"
            aria-label={placeholder ?? t("command.placeholder")}
            className="pm-rise relative w-full max-w-lg overflow-hidden p-0"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActive((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    select(filtered[active]);
                  }
                }}
                placeholder={placeholder ?? t("command.placeholder")}
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-ink-faint"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("header.closeMenu")}
                className="grid size-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-ink-faint">{t("command.empty")}</p>
              )}
              {grouped.map(([group, groupItems]) => (
                <div key={group} className="mb-2">
                  {group && (
                    <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                      {group}
                    </p>
                  )}
                  {groupItems.map((item) => {
                    const index = filtered.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActive(index)}
                        onClick={() => select(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                          index === active
                            ? "bg-[var(--primary-tint)] text-foreground"
                            : "text-ink-soft",
                        )}
                      >
                        {item.icon && <span className="shrink-0 text-primary">{item.icon}</span>}
                        <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                        {item.hint && (
                          <span className="shrink-0 font-mono text-[10px] text-ink-faint">
                            {item.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </>
  );
}
