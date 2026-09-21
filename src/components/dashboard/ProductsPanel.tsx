import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Plus, ScanLine, Star, Trash2, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import { useClinicStore, saveProduct, deleteProduct, type Product } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Field } from "./dashboard-helpers";

const PRODUCT_CATEGORIES = ["food", "treats", "toys", "grooming", "health", "accessories"] as const;
const PET_TYPES = ["dog", "cat", "both"] as const;
const LOW_STOCK_THRESHOLD = 5;

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  image: "",
  category: "accessories",
  petType: "both",
  featured: false,
  barcode: "",
  barcodeImage: "",
};

function ProductDialog({
  product,
  onClose,
  products,
}: {
  product: Product | null;
  onClose: () => void;
  products: Product[];
}) {
  const { t } = useI18n();
  const scanInputRef = useRef<HTMLInputElement>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scanText, setScanText] = useState("");
  const [scanBuffer, setScanBuffer] = useState("");
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
          stock: String(product.stock),
          image: product.image,
          category: product.category,
          petType: product.petType ?? "both",
          featured: product.featured,
          barcode: product.barcode ?? "",
          barcodeImage: product.barcodeImage ?? "",
        }
      : EMPTY_PRODUCT,
  );

  const submitScan = useCallback(
    (code: string) => {
      const clean = code.trim();
      setScanText("");
      setScanBuffer("");
      if (!clean) return;
      setForm((f) => (clean === f.barcode ? f : { ...f, barcode: clean }));
      toast.success(t("dash.form.product.captured", { code: clean }));
      void QRCode.toDataURL(clean, { margin: 1, width: 400 })
        .then((label) => setForm((f) => ({ ...f, barcodeImage: label })))
        .catch((err) => console.error("Failed to generate barcode label", err));
      const existing = products.find((p) => p.barcode === clean && p.id !== product?.id);
      if (existing) {
        toast.warning(t("dash.form.product.barcodeExists", { name: existing.name }));
      }
      scanInputRef.current?.focus();
    },
    [products, product?.id, t],
  );

  // USB / laser barcode scanners act as a keyboard: they type the code very
  // quickly and send Enter. Capture that input directly on the scan field and,
  // as a fallback, silently on any non-editable spot while the dialog is open.
  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const flush = () => {
      const value = scanBuffer.trim();
      if (value) submitScan(value);
      setScanBuffer("");
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Enter") {
        if (!scanBuffer.trim()) return;
        e.preventDefault();
        flush();
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setScanBuffer((prev) => prev + e.key);
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => setScanBuffer(""), 200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, [scanBuffer, submitScan]);

  const save = async () => {
    const price = Number(form.price);
    const stock = Number(form.stock);
    const compareRaw = form.compareAtPrice.trim();
    const compareAt = compareRaw ? Number(compareRaw) : null;
    if (!form.name.trim()) {
      toast.error(t("dash.form.product.requiredName"));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error(t("dash.form.product.requiredPrice"));
      return;
    }
    if (compareAt !== null && (!Number.isFinite(compareAt) || compareAt < price)) {
      toast.error(t("dash.form.product.requiredCompare"));
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      toast.error(t("dash.form.product.requiredStock"));
      return;
    }
    try {
      await saveProduct({
        id: product?.id ?? `prod-${Date.now().toString(36)}`,
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        compareAtPrice: compareAt,
        stock,
        image: form.image.trim(),
        category: form.category || "accessories",
        petType: form.petType,
        featured: form.featured,
        barcode: form.barcode.trim(),
        barcodeImage: form.barcodeImage,
        createdAt: product?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to save product", err);
      toast.error(t("dash.toast.error"));
      return;
    }
    toast.success(t("dash.toast.saved"));
    onClose();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? t("dash.editProduct") : t("dash.addProduct")}</DialogTitle>
          <DialogDescription>{t("dash.products.hint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.form.product.name")}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("dash.form.product.barcode")}>
            <Input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />
          </Field>
          <Field label={t("dash.form.product.capture")}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <ScanLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={scanInputRef}
                  value={scanText}
                  onChange={(e) => setScanText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitScan(scanText);
                    }
                  }}
                  placeholder={t("dash.form.product.scanPlaceholder")}
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => submitScan(scanText)}
                className="shrink-0"
              >
                {t("dash.form.product.capture")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("dash.form.product.captureHint")}</p>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("dash.form.product.price")}>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label={t("dash.form.product.compare")}>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                placeholder={t("dash.form.product.comparePlaceholder")}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("dash.form.product.stock")}>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </Field>
            <Field label={t("dash.form.product.category")}>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`store.cat.${c}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={t("dash.form.product.petType")}>
            <select
              value={form.petType}
              onChange={(e) => setForm({ ...form, petType: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {PET_TYPES.map((p) => (
                <option key={p} value={p}>
                  {t(`store.pet.${p}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("dash.form.product.image")}>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) {
                  toast.error(t("dash.form.product.imageTooLarge"));
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setForm((f) => ({ ...f, image: String(reader.result ?? "") }));
                reader.readAsDataURL(file);
              }}
            />
            <p className="text-xs text-muted-foreground">{t("dash.form.product.imageHint")}</p>
            {form.image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.image}
                  alt=""
                  className="h-20 w-20 rounded-lg border border-border object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, image: "" }))}
                >
                  {t("dash.remove")}
                </Button>
              </div>
            )}
          </Field>
          <Field label={t("dash.form.product.qrCode")}>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () =>
                  setForm((f) => ({ ...f, barcodeImage: String(reader.result ?? "") }));
                reader.readAsDataURL(file);
              }}
            />
            <p className="text-xs text-muted-foreground">{t("dash.form.product.qrHint")}</p>
            {form.barcodeImage && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.barcodeImage}
                  alt=""
                  className="h-20 w-20 rounded-lg border border-border object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, barcodeImage: "" }))}
                >
                  {t("dash.remove")}
                </Button>
              </div>
            )}
          </Field>
          <Field label={t("dash.form.product.desc")}>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="size-4 rounded border-input accent-primary"
            />
            {t("dash.form.product.featured")}
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("dash.cancel")}
          </Button>
          <Button onClick={save}>{t("dash.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductsPanel() {
  const { t } = useI18n();
  const { products, settings } = useClinicStore();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [petType, setPetType] = useState<string>("all");
  const [importOpen, setImportOpen] = useState(false);
  const { sort, toggle } = useSortState("name");
  const comparators: Record<string, (a: Product, b: Product) => number> = {
    name: (a, b) => a.name.localeCompare(b.name),
    price: (a, b) => a.price - b.price,
    stock: (a, b) => a.stock - b.stock,
  };
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (petType === "all" || (p.petType ?? "both") === petType),
      ),
    [products, category, petType],
  );
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["name", "category", "id"]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.products")}</CardTitle>
          <CardDescription>{t("dash.products.hint")}</CardDescription>
        </div>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> {t("dash.addProduct")}
        </Button>
        <Button size="sm" onClick={() => setImportOpen(true)}>
          <UploadCloud className="size-4" /> {t("dash.importProducts")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("dash.form.product.category")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`store.cat.${c}`)}
              </option>
            ))}
          </select>
          <select
            value={petType}
            onChange={(e) => {
              setPetType(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("dash.form.product.petType")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {PET_TYPES.map((p) => (
              <option key={p} value={p}>
                {t(`store.pet.${p}`)}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.sort.name")}
              active={sort.key === "name"}
              dir={sort.dir}
              onToggle={() => toggle("name")}
            />
            <SortChip
              label={t("dash.sort.price")}
              active={sort.key === "price"}
              dir={sort.dir}
              onToggle={() => toggle("price", true)}
            />
            <SortChip
              label={t("dash.sort.stock")}
              active={sort.key === "stock"}
              dir={sort.dir}
              onToggle={() => toggle("stock", true)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dash.form.product.name")}</TableHead>
                <TableHead>{t("dash.form.product.category")}</TableHead>
                <TableHead>{t("dash.form.product.petType")}</TableHead>
                <TableHead>{t("dash.form.product.barcode")}</TableHead>
                <TableHead>{t("dash.form.product.price")}</TableHead>
                <TableHead>{t("dash.form.product.stock")}</TableHead>
                <TableHead>{t("dash.form.product.featured")}</TableHead>
                <TableHead className="text-end">{t("dash.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.slice.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt=""
                          className="size-10 rounded-lg border border-border object-cover"
                        />
                      )}
                      <span className="whitespace-nowrap font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {t(`store.cat.${p.category}`)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {t(`store.pet.${p.petType ?? "both"}`)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {p.barcode ? <span className="font-mono">{p.barcode}</span> : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm font-semibold">
                    {settings.currency === "$"
                      ? `$${p.price.toFixed(2)}`
                      : `${settings.currency} ${p.price.toFixed(2)}`}
                    {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">
                        {settings.currency === "$"
                          ? `$${p.compareAtPrice.toFixed(2)}`
                          : `${settings.currency} ${p.compareAtPrice.toFixed(2)}`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {p.stock <= 0 ? (
                      <Badge className="bg-destructive/15 text-destructive">
                        {t("store.outOfStock")}
                      </Badge>
                    ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                      <Badge className="bg-amber-500/15 text-amber-600">
                        {t("dash.lowStock")} · {p.stock}
                      </Badge>
                    ) : (
                      p.stock
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      aria-label={t("dash.form.product.featured")}
                      onClick={async () => {
                        try {
                          await saveProduct({ ...p, featured: !p.featured });
                          toast.success(t("dash.toast.saved"));
                        } catch (err) {
                          console.error("Failed to toggle featured", err);
                          toast.error(t("dash.toast.error"));
                        }
                      }}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          p.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setEditing(p)}
                      >
                        {t("dash.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          try {
                            await deleteProduct(p.id);
                            toast.success(t("dash.toast.deleted"));
                          } catch (err) {
                            console.error("Failed to delete product", err);
                            toast.error(t("dash.toast.error"));
                          }
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {grid.slice.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
          <PaginationBar
            total={grid.total}
            page={grid.page}
            pageSize={grid.pageSize}
            pageCount={grid.pageCount}
            onPage={grid.setPage}
            onPageSize={grid.setPageSize}
          />
        </div>
      </CardContent>
      {editing && (
        <ProductDialog
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          products={products}
        />
      )}

      {/* Import Products Dialog */}
      <Dialog
        open={importOpen}
        onOpenChange={(open) => {
          if (!open) setImportOpen(false);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dash.importProducts")}</DialogTitle>
            <DialogDescription>{t("dash.importProductsHint")}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formEl = e.currentTarget;
              const fileInput = formEl.elements.namedItem("file") as HTMLInputElement | null;
              const file = fileInput?.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async (event) => {
                const csvText =
                  typeof event.target?.result === "string" ? event.target.result : null;
                if (!csvText) return;
                // Parse CSV and import products
                const lines = csvText.trim().split("\n");
                const headerLine = lines[0];
                if (!headerLine) return;
                const headers = headerLine.split(",").map((h: string) => h.trim());
                // Find column indices
                const nameIdx = headers.findIndex((h: string) => h === "Name" || h === "Name ");
                const typeIdx = headers.findIndex((h: string) => h === "Type" || h === "Type ");
                const categoryIdx = headers.findIndex(
                  (h: string) => h === "Category" || h === "Category ",
                );
                const kgIdx = headers.findIndex((h: string) => h === "Kg" || h === "Kg ");
                const priceIdx = headers.findIndex((h: string) => h === "Price" || h === "Price ");
                if (nameIdx === -1 || categoryIdx === -1 || kgIdx === -1 || priceIdx === -1) {
                  toast.error(t("dash.importProductsMissingColumns"));
                  return;
                }
                const productsToImport: Product[] = [];
                for (let i = 1; i < lines.length; i++) {
                  const rawLine = lines[i];
                  if (!rawLine) continue;
                  const line = rawLine.trim();
                  if (!line) continue;
                  const values = line.split(",").map((v: string) => v.trim());
                  const name = values[nameIdx] || "";
                  const type = values[typeIdx] !== undefined ? values[typeIdx] : "";
                  const category = values[categoryIdx] || "";
                  const kg = values[kgIdx] || "";
                  const priceStr = values[priceIdx] || "0";
                  if (!name || !category) continue;
                  const price = parseFloat(priceStr);
                  if (isNaN(price)) continue;
                  let petType = "both";
                  if (type) {
                    const lowerType = type.toLowerCase();
                    if (lowerType.includes("dog")) petType = "dog";
                    else if (lowerType.includes("cat")) petType = "cat";
                  }
                  let description = "";
                  if (kg) {
                    description = kg;
                  }
                  if (type && type !== kg) {
                    description = description ? `${description} ${type}`.trim() : type;
                  }
                  if (!description) {
                    description = t("dash.importProductsDefaultDesc");
                  }
                  const now = new Date().toISOString();
                  productsToImport.push({
                    id: `prod-${Date.now().toString(36)}-${i}`,
                    name,
                    description,
                    price,
                    compareAtPrice: null,
                    image: "",
                    category,
                    petType,
                    stock: 0,
                    featured: false,
                    barcode: "",
                    createdAt: now,
                    updatedAt: now,
                  });
                }
                // Import products
                const importPromises = productsToImport.map((product) => saveProduct(product));
                await Promise.all(importPromises);
                toast.success(
                  t("dash.importProductsSuccess", { count: String(productsToImport.length) }),
                );
                setImportOpen(false);
              };
              reader.onerror = () => {
                toast.error(t("dash.importProductsError"));
              };
              reader.readAsText(file);
            }}
          >
            <div className="space-y-4">
              <label className="flex flex-col space-y-1">
                <span className="text-sm font-medium">{t("dash.uploadFile")}</span>
                <input
                  type="file"
                  accept=".csv"
                  id="file"
                  required
                  onChange={(e) => {
                    // Reset form if needed
                  }}
                />
              </label>
              <Button type="submit">{t("dash.import")}</Button>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              {t("dash.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
