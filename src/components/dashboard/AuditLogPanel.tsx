import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useClinicStore, loadAuditLogs } from "@/lib/clinic-store";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollText } from "lucide-react";

export function AuditLogPanel() {
  const { t, lang } = useI18n();
  const { auditLogs } = useClinicStore();

  useEffect(() => {
    loadAuditLogs().catch(() => undefined);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ScrollText className="size-4" /> {t("dash.audit")}
        </CardTitle>
        <CardDescription>{t("dash.audit.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("audit.noLogs")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("audit.action")}</TableHead>
                  <TableHead>{t("audit.entity")}</TableHead>
                  <TableHead>{t("audit.detail")}</TableHead>
                  <TableHead>{t("audit.date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell className="text-muted-foreground">{log.detail}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(log.createdAt, lang)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
