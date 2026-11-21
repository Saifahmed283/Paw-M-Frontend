import { useEffect, useRef, useState } from "react";

export const INTER_KEY_MAX_MS = 60;
export const ENTER_MAX_MS = 250;
export const MIN_SCAN_CHARS = 3;

export type ScannerBuffer = { keys: string; lastAt: number } | null;

export function nextScannerInput(
  buffer: ScannerBuffer,
  key: string,
  at: number,
): { buffer: ScannerBuffer; scan: string | null } {
  if (key.length === 1) {
    if (buffer && at - buffer.lastAt <= INTER_KEY_MAX_MS) {
      return { buffer: { keys: buffer.keys + key, lastAt: at }, scan: null };
    }
    const idleScan = buffer && buffer.keys.length >= MIN_SCAN_CHARS ? buffer.keys : null;
    return { buffer: { keys: key, lastAt: at }, scan: idleScan };
  }
  if (key === "Enter") {
    const scan =
      buffer && buffer.keys.length >= MIN_SCAN_CHARS && at - buffer.lastAt <= ENTER_MAX_MS
        ? buffer.keys
        : null;
    return { buffer: null, scan };
  }
  return { buffer: null, scan: null };
}

export type ScannerMatch = {
  detected: boolean;
  lastCode: string | null;
  lastAt: number | null;
  scanCount: number;
};

const EMPTY: ScannerMatch = { detected: false, lastCode: null, lastAt: null, scanCount: 0 };

function setFieldValue(field: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    field instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Detects a USB/laser scanner acting as a keyboard (fast key bursts ending in
 * Enter) and optionally forwards the scanned code to `onScan`.
 *
 * A scanner is global by nature: it types into whatever is focused. When a scan
 * lands in another field (customer name, search, …) we suppress the keystrokes
 * and restore that field's original value, so the scan never pollutes the form.
 * The dedicated barcode input opts out with `data-barcode-input` and keeps its
 * own Enter handler for manual typing.
 */
export function useHardwareScanner(onScan?: (code: string) => void): ScannerMatch {
  const bufferRef = useRef<ScannerBuffer>(null);
  const fieldRef = useRef<{ field: HTMLInputElement | HTMLTextAreaElement; value: string } | null>(
    null,
  );
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [match, setMatch] = useState<ScannerMatch>(EMPTY);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const at = performance.now();
      const target = e.target;
      const isField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
      const isBarcodeInput =
        target instanceof HTMLElement && target.hasAttribute("data-barcode-input");

      const { buffer, scan } = nextScannerInput(bufferRef.current, e.key, at);
      bufferRef.current = buffer;

      // A fresh one-character buffer is the first key of a scan. Remember the
      // field's pristine value before the scanner types into it; subsequent
      // keys are blocked below. Slow typing re-captures the current value so a
      // later scan never restores a stale snapshot.
      if (buffer?.keys.length === 1) {
        fieldRef.current =
          isField && !isBarcodeInput
            ? {
                field: target as HTMLInputElement | HTMLTextAreaElement,
                value: (target as HTMLInputElement | HTMLTextAreaElement).value,
              }
            : null;
      }
      if (buffer && buffer.keys.length >= 2 && isField && !isBarcodeInput) {
        e.preventDefault();
      }

      if (scan) {
        setMatch((prev) => ({
          detected: true,
          lastCode: scan,
          lastAt: Date.now(),
          scanCount: prev.scanCount + 1,
        }));

        if (!isBarcodeInput) {
          e.preventDefault();
          const saved = fieldRef.current;
          if (saved) setFieldValue(saved.field, saved.value);
          onScanRef.current?.(scan);
        }
        fieldRef.current = null;
        bufferRef.current = null;
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return match;
}
