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

export function useHardwareScanner(): ScannerMatch {
  const bufferRef = useRef<ScannerBuffer>(null);
  const [match, setMatch] = useState<ScannerMatch>(EMPTY);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const at = performance.now();
      const { buffer, scan } = nextScannerInput(bufferRef.current, e.key, at);
      bufferRef.current = buffer;
      if (scan) {
        setMatch((prev) => ({
          detected: true,
          lastCode: scan,
          lastAt: Date.now(),
          scanCount: prev.scanCount + 1,
        }));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return match;
}