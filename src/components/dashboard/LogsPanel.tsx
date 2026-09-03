import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationBar, SearchBox, useGrid } from "@/components/dash-grid";
import { useClinicStore, loadAuditLogs } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { formatTime } from "./dashboard-format";

export function LogsPanel() {
  const { t, tOr, lang } = useI18n();
  const { auditLogs } = useClinicStore();
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    loadAuditLogs().catch(() => undefined);
  }, []);

  const filtered = useMemo(
    () => auditLogs.filter((l) => actionFilter === "all" || l.action === actionFilter),
    [auditLogs, actionFilter],
  );
  const grid = useGrid(filtered, query, ["detail", "target", "action"]);

  const actionOptions = useMemo(
    () => Array.from(new Set(auditLogs.map((l) => l.action))).sort(),
    [auditLogs],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4" /> {t("logs.title")}
        </CardTitle>
        <CardDescription>{t("logs.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("logs.action")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {actionOptions.map((a) => (
              <option key={a} value={a}>
                {tOr(`logs.action.${a}`, a)}
              </option>
            ))}
          </select>
        </div>
        {grid.slice.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("logs.empty")}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">{t("logs.time")}</TableHead>
                    <TableHead className="w-52">{t("logs.action")}</TableHead>
                    <TableHead className="w-40">{t("logs.entity")}</TableHead>
                    <TableHead>{t("logs.detail")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grid.slice.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(log.createdAt, lang)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-transparent bg-muted text-foreground"
                        >
                          {tOr(`logs.action.${log.action}`, log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.target}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.detail}</TableCell>
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
  );
}
