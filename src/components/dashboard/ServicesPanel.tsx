import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";
import { useClinicStore, saveService, deleteService, type ServiceItem } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { Field } from "./dashboard-helpers";

function ServiceDialog({ service, onClose }: { service: ServiceItem | null; onClose: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    title: service?.title ?? "",
    description: service?.description ?? "",
  });

  const save = async () => {
    await saveService({
      slug: service?.slug ?? `svc-${Date.now().toString(36)}`,
      icon: service?.icon ?? "Stethoscope",
      title: form.title.trim() || t("dash.untitled"),
      description: form.description.trim(),
    });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? t("dash.editService") : t("dash.addService")}</DialogTitle>
          <DialogDescription>{t("dash.services.hint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.form.service.title")}>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label={t("dash.form.service.desc")}>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("dash.close")}
          </Button>
          <Button onClick={save} disabled={!form.title.trim()}>
            {t("dash.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServicesPanel() {
  const { t, tOr } = useI18n();
  const { services } = useClinicStore();
  const [editing, setEditing] = useState<ServiceItem | "new" | null>(null);
  const [query, setQuery] = useState("");
  const grid = useGrid(services, query, ["title", "description"]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.services")}</CardTitle>
          <CardDescription>{t("dash.services.hint")}</CardDescription>
        </div>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> {t("dash.addService")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dash.form.service.title")}</TableHead>
                <TableHead>{t("dash.form.service.desc")}</TableHead>
                <TableHead className="text-end">{t("dash.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.slice.map((s) => (
                <TableRow key={s.slug}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {tOr(`svc.${s.slug}.title`, s.title)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tOr(`svc.${s.slug}.desc`, s.description)}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setEditing(s)}
                      >
                        {t("dash.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteService(s.slug);
                          toast.success(t("dash.toast.deleted"));
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
        <ServiceDialog
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}
