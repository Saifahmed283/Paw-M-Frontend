import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { localizedApiErrorMessage } from "@/lib/api";
import {
  getVerificationSubmissions,
  type VerificationFilter,
  type VerificationSubmission,
} from "@/lib/payment-verification";
import type { I18nValue } from "@/lib/i18n";

type Options = {
  t: I18nValue["t"];
  /** When set by a cashier deep link, only this order is loaded. */
  focusOrderId: string | undefined;
};

/** Owns the queue's remote list so the cards can stay presentational. */
export function useVerificationQueue({ t, focusOrderId }: Options) {
  const [status, setStatus] = useState<VerificationFilter>(focusOrderId ? "all" : "submitted");
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVerificationSubmissions(status, { orderId: focusOrderId });
      setSubmissions(result.submissions ?? []);
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("verif.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [focusOrderId, status, t]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { status, setStatus, submissions, loading, reload };
}
