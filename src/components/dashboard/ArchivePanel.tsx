import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import {
  useClinicStore,
  archiveBooking,
  archiveOrder,
  deleteRequest,
  deleteOrder,
  type BookingRequest,
  type Order,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { StatusBadge, PaymentMethodBadge, PaymentStatusBadge } from "./dashboard-helpers";
import { formatDate, formatMoney } from "./dashboard-format";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

type PendingDelete = { id: string; kind: "request" | "order" };

export function ArchivePanel() {
  const { t, lang } = useI18n();
  const { requests, orders, settings } = useClinicStore();
  const [reqQuery, setReqQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { sort: reqSort, toggle: toggleReqSort } = useSortState("newest", "desc");
  const { sort: ordSort, toggle: toggleOrdSort } = useSortState("newest", "desc");

  const archivedRequests = useMemo(() => requests.filter((r) => r.archived), [requests]);
  const archivedOrders = useMemo(() => orders.filter((o) => o.archived), [orders]);

  const reqComparators: Record<string, (a: BookingRequest, b: BookingRequest) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    appointment: (a, b) => (a.date + a.time).localeCompare(b.date + b.time),
    owner: (a, b) => a.ownerName.localeCompare(b.ownerName),
  };
  const ordComparators: Record<string, (a: Order, b: Order) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    owner: (a, b) => a.customerName.localeCompare(b.customerName),
    total: (a, b) => a.total - b.total,
  };
  const sortedReqs = sortedSlice(archivedRequests, reqSort, reqComparators);
  const sortedOrds = sortedSlice(archivedOrders, ordSort, ordComparators);
  const reqGrid = useGrid(sortedReqs, reqQuery, ["ownerName", "petName", "doctorName", "phone"]);
  const ordGrid = useGrid(sortedOrds, orderQuery, ["customerName", "phone", "email", "id"]);

  const runAction = async (id: string, action: () => Promise<void>, successKey: string) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await action();
      toast.success(t(successKey));
    } catch (err) {
      console.error("Archive action failed", err);
      toast.error(t("dash.toast.error"));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      if (pendingDelete.kind === "request") await deleteRequest(pendingDelete.id);
      else await deleteOrder(pendingDelete.id);
      toast.success(t("dash.toast.deleted"));
      setPendingDelete(null);
    } catch (err) {
      console.error("Failed to delete archived record", err);
      toast.error(t("dash.toast.error"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("archive.requests")}</CardTitle>
              <CardDescription>{t("archive.requestsDesc")}</CardDescription>
            </div>
            {archivedRequests.length > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                {archivedRequests.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={reqQuery} onChange={setReqQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.recent")}
                active={reqSort.key === "newest"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("newest", true)}
              />
              <SortChip
                label={t("dash.sort.appointment")}
                active={reqSort.key === "appointment"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("appointment")}
              />
              <SortChip
                label={t("dash.sort.owner")}
                active={reqSort.key === "owner"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("owner")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reqGrid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("archive.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("dash.owner")}</TableHead>
                      <TableHead>{t("dash.pet")}</TableHead>
                      <TableHead>{t("dash.date")}</TableHead>
                      <TableHead>{t("dash.time")}</TableHead>
                      <TableHead>{t("dash.statusCol")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reqGrid.slice.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="whitespace-nowrap font-medium">{r.ownerName}</div>
                          <div className="whitespace-nowrap text-xs text-muted-foreground">
                            {r.phone}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{r.petName}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(r.date, lang)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{r.time}</TableCell>
                        <TableCell>
                          <StatusBadge status={r.status} />
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7"
                              disabled={busyId === r.id}
                              onClick={() =>
                                runAction(r.id, () => archiveBooking(r.id, false), "dash.toast.restored")
                              }
                            >
                              <ArchiveRestore className="size-3.5" /> {t("archive.restore")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                              aria-label={t("dash.delete")}
                              title={t("archive.deletePermanent")}
                              disabled={busyId === r.id}
                              onClick={() => setPendingDelete({ id: r.id, kind: "request" })}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationBar
                total={reqGrid.total}
                page={reqGrid.page}
                pageSize={reqGrid.pageSize}
                pageCount={reqGrid.pageCount}
                onPage={reqGrid.setPage}
                onPageSize={reqGrid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("archive.orders")}</CardTitle>
              <CardDescription>{t("archive.ordersDesc")}</CardDescription>
            </div>
            {archivedOrders.length > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                {archivedOrders.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={orderQuery} onChange={setOrderQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.recent")}
                active={ordSort.key === "newest"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("newest", true)}
              />
              <SortChip
                label={t("dash.sort.owner")}
                active={ordSort.key === "owner"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("owner")}
              />
              <SortChip
                label={t("dash.sort.total")}
                active={ordSort.key === "total"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("total", true)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ordGrid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("archive.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("dash.owner")}</TableHead>
                      <TableHead>{t("payments.amount")}</TableHead>
                      <TableHead>{t("payments.method")}</TableHead>
                      <TableHead>{t("payments.status")}</TableHead>
                      <TableHead>{t("dash.statusCol")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordGrid.slice.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div className="whitespace-nowrap font-medium">{o.customerName}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{o.id}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-bold">
                          {formatMoney(o.total, settings.currency)}
                        </TableCell>
                        <TableCell>
                          <PaymentMethodBadge method={o.paymentMethod} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={o.paymentStatus} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7"
                              disabled={busyId === o.id}
                              onClick={() =>
                                runAction(o.id, () => archiveOrder(o.id, false), "dash.toast.restored")
                              }
                            >
                              <ArchiveRestore className="size-3.5" /> {t("archive.restore")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                              aria-label={t("dash.delete")}
                              title={t("archive.deletePermanent")}
                              disabled={busyId === o.id}
                              onClick={() => setPendingDelete({ id: o.id, kind: "order" })}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationBar
                total={ordGrid.total}
                page={ordGrid.page}
                pageSize={ordGrid.pageSize}
                pageCount={ordGrid.pageCount}
                onPage={ordGrid.setPage}
                onPageSize={ordGrid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmActionDialog
        open={pendingDelete !== null}
        title={t("archive.deletePermanent")}
        description={t("dash.cannotUndo")}
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => !deleting && setPendingDelete(null)}
      />
    </div>
  );
}
