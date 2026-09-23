import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Banknote,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Delete,
  Eye,
  Mail,
  MoreHorizontal,
  PawPrint,
  Phone,
  ReceiptText,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  deleteClient,
  getClient,
  notifyClient,
  setClientSuspended,
  useClinicStore,
  type ClientDetail,
  type ClientSummary,
  type ClientType,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  PaymentKindBadge,
  PaymentMethodBadge,
  PaymentStatusBadge,
  StatusBadge,
} from "./dashboard-helpers";
import { formatDate, formatMoney, formatTime } from "./dashboard-format";
import { PaymentSettleDialog } from "./PaymentSettleDialog";

function ClientTypeBadge({ type }: { type: ClientType }) {
  const { t } = useI18n();
  const styles: Record<ClientType, string> = {
    both: "bg-violet-500/15 text-violet-600",
    clinic: "bg-primary/15 text-primary",
    store: "bg-amber-500/15 text-amber-600",
    new: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[type ?? "new"])}>
      {t(`clients.type.${type ?? "new"}`)}
    </Badge>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
        <Icon className={cn("size-5", tone)} />
      </CardContent>
    </Card>
  );
}

function ClientDetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const { t, lang, tOr } = useI18n();
  const { settings } = useClinicStore();
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getClient(id)
      .then(setDetail)
      .catch(() => toast.error(t("dash.toast.error")))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !detail) {
    return (
      <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">…</div>
    );
  }
  if (!detail) {
    return (
      <div className="rounded-xl border border-border p-10 text-center text-sm text-muted-foreground">
        {t("dash.empty")}
      </div>
    );
  }

  const c = detail.client;
  const next = detail.stats.nextAppointment;
  const settlingPayment = detail.payments.find((p) => p.id === settling) ?? null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ms-2 text-muted-foreground">
        <ArrowLeft className="size-4 me-1" /> {t("clients.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
            {c.fullName}
            <ClientTypeBadge type={typeOf(detail)} />
          </CardTitle>
          <CardDescription>{t("clients.detailHint")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {c.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" /> {c.phone}
            </span>
          )}
          {c.email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> {c.email}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" /> {t("clients.visits")}: {detail.stats.bookingsCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PawPrint className="size-3.5" /> {t("clients.pets")}: {detail.pets.length}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={t("clients.stats.visits")}
          value={String(detail.stats.bookingsCount)}
          icon={CalendarDays}
          tone="text-primary"
        />
        <SummaryCard
          label={t("clients.stats.completed")}
          value={String(detail.stats.completedCount)}
          icon={CheckCircle2}
          tone="text-success"
        />
        <SummaryCard
          label={t("clients.stats.paidVisit")}
          value={formatMoney(detail.stats.paidVisit, settings.currency)}
          icon={Banknote}
          tone="text-success"
        />
        <SummaryCard
          label={t("clients.stats.outstandingVisit")}
          value={formatMoney(detail.stats.outstandingVisit, settings.currency)}
          icon={ReceiptText}
          tone={detail.stats.outstandingVisit > 0 ? "text-amber-500" : "text-muted-foreground"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("clients.nextAppointment")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {next ? (
              <p>
                {formatDate(next.date, lang)} · {next.time} — {next.petName} (
                {tOr(
                  `animal.${next.pet?.species ?? next.petName}`,
                  next.pet?.species ?? next.petName,
                )}
                ){" · "}
                {next.doctorName}
              </p>
            ) : (
              <p className="text-muted-foreground">{t("clients.noNext")}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("clients.followUp")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {detail.stats.followUpDate ? (
              <p>{formatDate(detail.stats.followUpDate, lang)}</p>
            ) : (
              <p className="text-muted-foreground">{t("clients.noFollowUp")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("clients.section.payments")}</CardTitle>
        </CardHeader>
        <CardContent>
          {detail.payments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t("clients.section.paymentsEmpty")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("payments.date")}</TableHead>
                    <TableHead>{t("payments.title")}</TableHead>
                    <TableHead>{t("clients.type")}</TableHead>
                    <TableHead>{t("payments.method")}</TableHead>
                    <TableHead className="text-end">{t("payments.amount")}</TableHead>
                    <TableHead>{t("payments.status")}</TableHead>
                    <TableHead>{t("clients.bill.items")}</TableHead>
                    <TableHead className="text-end">{t("dash.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(p.date, lang)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{p.title}</div>
                        {p.requestedBy && (
                          <div className="text-[11px] text-muted-foreground">{p.requestedBy}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <PaymentKindBadge kind={p.kind} />
                      </TableCell>
                      <TableCell>
                        <PaymentMethodBadge method={p.method} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-end font-bold">
                        {formatMoney(p.amount, settings.currency)}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={p.status} />
                      </TableCell>
                      <TableCell>{(p.items?.length ?? 0) > 0 ? p.items!.length : "—"}</TableCell>
                      <TableCell className="text-end">
                        {p.status === "unpaid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => setSettling(p.id)}
                          >
                            {t("payments.settle")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("clients.section.appointments")}</CardTitle>
          </CardHeader>
          <CardContent>
            {detail.bookings.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t("clients.section.appointmentsEmpty")}
              </p>
            ) : (
              <div className="space-y-3">
                {detail.bookings.map((b) => (
                  <div key={b.id} className="rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {formatDate(b.date, lang)} · {b.time} — {b.petName}
                      </p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{b.doctorName}</p>
                    {b.diagnosis && (
                      <p className="mt-2 rounded bg-muted/60 p-2 text-xs">
                        <span className="font-semibold">Diagnosis:</span> {b.diagnosis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("clients.section.pets")}</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.pets.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t("clients.section.petsEmpty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {detail.pets.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tOr(`animal.${p.species}`, p.species)}
                          {p.breed ? ` · ${p.breed}` : ""}
                          {p.photo && (
                            <img
                              src={p.photo}
                              alt={p.name}
                              className="mt-1 inline-block size-10 rounded-lg border object-cover"
                            />
                          )}
                        </p>
                      </div>
                      {p.weightKg ? <Badge variant="outline">{p.weightKg} kg</Badge> : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("clients.section.prescriptions")}</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.prescriptions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t("clients.section.prescriptionsEmpty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {detail.prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          <ClipboardList className="me-1 inline size-3.5 text-muted-foreground" />
                          {rx.rxNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rx.issuedAt ? formatTime(rx.issuedAt, lang) : rx.followUpDate}
                        </p>
                      </div>
                      <Badge variant="outline">{rx.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {settlingPayment && (
        <PaymentSettleDialog
          payment={settlingPayment}
          onClose={() => {
            setSettling(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function typeOf(detail: ClientDetail): ClientType {
  const bookingsCount = detail.stats.bookingsCount;
  const ordersCount = detail.orders.length;
  if (bookingsCount > 0 && ordersCount > 0) return "both";
  if (bookingsCount > 0) return "clinic";
  if (ordersCount > 0) return "store";
  return "new";
}

function NotifyClientDialog({
  client,
  onClose,
  onDone,
}: {
  client: ClientSummary;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error(t("clients.notifyEmpty"));
      return;
    }
    setBusy(true);
    try {
      await notifyClient(client.id, { title: title.trim(), body: body.trim() });
      toast.success(t("clients.notifySent"));
      onDone();
      onClose();
    } catch {
      toast.error(t("dash.toast.error"));
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <BellRing className="me-2 inline size-4 text-primary" />
            {t("clients.notify")} — {client.fullName}
          </DialogTitle>
          <DialogDescription>{t("clients.notifyDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>{t("clients.notifyTitle")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("clients.notifyTitle")}
              maxLength={200}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("clients.notifyBody")}</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={2000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("clients.cancel")}
          </Button>
          <Button onClick={send} disabled={busy}>
            {busy ? "…" : t("clients.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClientActions({ client, onView }: { client: ClientSummary; onView: () => void }) {
  const { t } = useI18n();
  const [confirming, setConfirming] = useState<"suspend" | "activate" | "delete" | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [busy, setBusy] = useState(false);

  const suspended = client.suspended === true;

  const doToggle = async () => {
    setBusy(true);
    try {
      await setClientSuspended(client.id, !suspended);
      toast.success(t(suspended ? "clients.activateDone" : "clients.suspendDone"));
      setConfirming(null);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      await deleteClient(client.id);
      toast.success(t("clients.deleteDone"));
      setConfirming(null);
    } catch {
      toast.error(t("dash.toast.error"));
      setBusy(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            aria-label={t("clients.actions")}
            title={t("clients.actions")}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="truncate">{client.fullName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onView}>
            <Eye className="size-4" /> {t("clients.view")}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={suspended} onClick={() => setNotifying(true)}>
            <BellRing className="size-4" /> {t("clients.notify")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirming(suspended ? "activate" : "suspend")}>
            {suspended ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
            {t(suspended ? "clients.activate" : "clients.suspend")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setConfirming("delete")}
          >
            <Delete className="size-4" /> {t("clients.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {confirming && (
        <AlertDialog open onOpenChange={(o) => !o && setConfirming(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t(
                  confirming === "delete"
                    ? "clients.deleteTitle"
                    : confirming === "suspend"
                      ? "clients.suspendTitle"
                      : "clients.activateTitle",
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  confirming === "delete"
                    ? "clients.deleteConfirm"
                    : confirming === "suspend"
                      ? "clients.suspendConfirm"
                      : "clients.activateConfirm",
                  { name: client.fullName },
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirming(null)}>
                {t("clients.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={busy}
                onClick={confirming === "delete" ? doDelete : doToggle}
                className={
                  confirming === "delete"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : undefined
                }
              >
                {busy ? "…" : t("clients.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {notifying && (
        <NotifyClientDialog client={client} onClose={() => setNotifying(false)} onDone={onView} />
      )}
    </>
  );
}

function SuspendedBadge({ suspended }: { suspended?: boolean | undefined }) {
  const { t } = useI18n();
  if (!suspended) return null;
  return (
    <Badge variant="outline" className="ms-2 border-transparent bg-destructive/10 text-destructive">
      {t("clients.suspended")}
    </Badge>
  );
}

export function ClientsPanel() {
  const { t, lang } = useI18n();
  const { clients, settings } = useClinicStore();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const grid = useGrid(
    clients.filter((c) => typeFilter === "all" || c.type === typeFilter),
    query,
    ["fullName", "email", "phone"],
  );

  if (selectedId) {
    return <ClientDetailView id={selectedId} onBack={() => setSelectedId(null)} key={selectedId} />;
  }

  const totalOutstanding = clients.reduce((s, c) => s + c.outstanding, 0);
  const totalPaid = clients.reduce((s, c) => s + c.totalPaid, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={t("clients.name")}
          value={String(clients.length)}
          icon={Users}
          tone="text-primary"
        />
        <SummaryCard
          label={t("payments.summary.collected")}
          value={formatMoney(totalPaid, settings.currency)}
          icon={Banknote}
          tone="text-success"
        />
        <SummaryCard
          label={t("payments.summary.pending")}
          value={formatMoney(totalOutstanding, settings.currency)}
          icon={ReceiptText}
          tone={totalOutstanding > 0 ? "text-amber-500" : "text-muted-foreground"}
        />
        <SummaryCard
          label={t("clients.type.both")}
          value={String(clients.filter((c) => c.type === "both").length)}
          icon={PawPrint}
          tone="text-violet-500"
        />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-base">{t("dash.clients")}</CardTitle>
            <CardDescription>{t("clients.hint")}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap gap-2">
              {["all", "new", "clinic", "store", "both"].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setTypeFilter(v);
                    grid.setPage(1);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    typeFilter === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "all" ? t("dash.filterAll") : t(`clients.type.${v}`)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("dash.showing", { count: String(grid.total), rows: t("dash.rows") })}
          </p>
          {grid.slice.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("clients.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("clients.name")}</TableHead>
                      <TableHead>{t("clients.type")}</TableHead>
                      <TableHead>{t("clients.pets")}</TableHead>
                      <TableHead>{t("clients.visits")}</TableHead>
                      <TableHead>{t("clients.orders")}</TableHead>
                      <TableHead className="text-end">{t("clients.paid")}</TableHead>
                      <TableHead className="text-end">{t("clients.outstanding")}</TableHead>
                      <TableHead>{t("clients.lastActivity")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grid.slice.map((c: ClientSummary) => (
                      <TableRow
                        key={c.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedId(c.id)}
                      >
                        <TableCell>
                          <div className="whitespace-nowrap font-medium">
                            {c.fullName}
                            <SuspendedBadge suspended={c.suspended} />
                          </div>
                          <div className="whitespace-nowrap text-xs text-muted-foreground">
                            {c.phone || c.email || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ClientTypeBadge type={c.type} />
                        </TableCell>
                        <TableCell>{c.petsCount}</TableCell>
                        <TableCell>{c.bookingsCount}</TableCell>
                        <TableCell>{c.ordersCount}</TableCell>
                        <TableCell className="whitespace-nowrap text-end text-success">
                          {formatMoney(c.totalPaid, settings.currency)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "whitespace-nowrap text-end",
                            c.outstanding > 0
                              ? "font-semibold text-amber-500"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatMoney(c.outstanding, settings.currency)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatTime(c.lastActivity, lang)}
                        </TableCell>
                        <TableCell className="text-end">
                          <ClientActions client={c} onView={() => setSelectedId(c.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationBar
                total={grid.total}
                page={grid.page}
                pageSize={grid.pageSize}
                pageCount={grid.pageCount}
                onPage={grid.setPage}
                onPageSize={grid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
