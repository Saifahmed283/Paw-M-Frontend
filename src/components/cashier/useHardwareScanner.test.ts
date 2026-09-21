import { describe, expect, it } from "vitest";
import {
  ENTER_MAX_MS,
  INTER_KEY_MAX_MS,
  MIN_SCAN_CHARS,
  nextScannerInput,
  type ScannerBuffer,
} from "./useHardwareScanner";

describe("nextScannerInput", () => {
  it("detects a fast key burst terminated by Enter", () => {
    let buffer: null | { keys: string; lastAt: number } = null;
    const scans: Array<string | null> = [];
    "PH2625".split("").forEach((c, i) => {
      const r = nextScannerInput(buffer, c, i * 10);
      buffer = r.buffer;
      scans.push(r.scan);
    });
    const final = nextScannerInput(buffer, "Enter", 5 * 10 + ENTER_MAX_MS - 10);
    expect(final.scan).toBe("PH2625");
    expect(scans.every((s) => s === null)).toBe(true);
  });

  it("does not flag normal human typing followed by Enter", () => {
    let buffer: null | { keys: string; lastAt: number } = null;
    let scan: string | null = null;
    "ABC".split("").forEach((c, i) => {
      const r = nextScannerInput(buffer, c, i * 200);
      buffer = r.buffer;
      scan = r.scan;
    });
    const final = nextScannerInput(buffer, "Enter", 200 * 3 + 10);
    expect(scan).toBeNull();
    expect(final.scan).toBeNull();
  });

  it("detects a burst completed by an idle gap when there is no Enter suffix", () => {
    let buffer: null | { keys: string; lastAt: number } = null;
    let detected: string | null = null;
    "1234567890".split("").forEach((c, i) => {
      const r = nextScannerInput(buffer, c, i * 5);
      buffer = r.buffer;
      detected = r.scan;
    });
    expect(detected).toBeNull();
    const r = nextScannerInput(buffer, "x", 50 + 1000);
    expect(r.scan).toBe("1234567890");
  });

  it("ignores bursts shorter than the minimum length", () => {
    let buffer: ScannerBuffer = null;
    for (let i = 0; i < "AB".length; i++) {
      const r = nextScannerInput(buffer, "AB".charAt(i), i * 5);
      buffer = r.buffer;
    }
    expect(buffer?.keys.length ?? 0).toBeLessThan(MIN_SCAN_CHARS);
    const final = nextScannerInput(buffer, "Enter", 10 + ENTER_MAX_MS - 1);
    expect(final.scan).toBeNull();
  });

  it("does not register a scan when Enter arrives after the window", () => {
    let buffer: null | { keys: string; lastAt: number } = null;
    "CODE12".split("").forEach((c, i) => {
      const r = nextScannerInput(buffer, c, i * 5);
      buffer = r.buffer;
    });
    const final = nextScannerInput(buffer, "Enter", 5 * 6 + ENTER_MAX_MS + 100);
    expect(final.scan).toBeNull();
  });

  it("resets the buffer on non-character keys", () => {
    let buffer: null | { keys: string; lastAt: number } = null;
    buffer = nextScannerInput(buffer, "1", 0).buffer;
    buffer = nextScannerInput(buffer, "2", 5).buffer;
    const r = nextScannerInput(buffer, "F5", 10);
    expect(r.buffer).toBeNull();
    buffer = r.buffer;
    buffer = nextScannerInput(buffer, "9", 15).buffer;
    const final = nextScannerInput(buffer, "Enter", 20);
    expect(final.scan).toBeNull();
  });
});
