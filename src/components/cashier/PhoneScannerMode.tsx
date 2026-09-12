import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, ScanLine, Square, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ScanFn = (code: string) => void;

type BrowserMultiFormatReaderType = import("@zxing/library").BrowserMultiFormatReader;
import type { Result } from "@zxing/library";

const SCAN_FORMATS = [
  "EAN_13",
  "EAN_8",
  "UPC_A",
  "UPC_E",
  "CODE_128",
  "CODE_39",
  "CODE_93",
  "ITF",
  "QR_CODE",
] as const;

const SCAN_INTERVAL_MS = 300;
const DECODE_RETRY_INTERVAL_MS = 150;
const DEDUP_MS = 2500;
const MAX_IMAGE_DIM = 1920;
const MAX_PHOTO_DIM = 3840;
const IMAGE_LOAD_TIMEOUT_MS = 10_000;
const DECODE_TIMEOUT_MS = 20_000;
const WATCHDOG_INTERVAL_MS = 2000;
const HEARTBEAT_TIMEOUT_MS = 5000;

async function loadScanner() {
  const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } =
    await import("@zxing/library");
  const hints = new Map<unknown, unknown>();
  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    SCAN_FORMATS.map((f) => BarcodeFormat[f]),
  );
  return { BrowserMultiFormatReader, hints };
}

async function loadPhotoReader() {
  const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } =
    await import("@zxing/library");
  const hints = new Map<unknown, unknown>();
  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    SCAN_FORMATS.map((f) => BarcodeFormat[f]),
  );
  hints.set(DecodeHintType.TRY_HARDER, true);
  return { BrowserMultiFormatReader, hints };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timed out")), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

async function loadImageWithExif(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("image failed to load"));
    });
    image.src = url;
    await withTimeout(loaded, IMAGE_LOAD_TIMEOUT_MS);
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function createCanvasFromImage(
  image: HTMLImageElement,
  maxDim = MAX_IMAGE_DIM,
): Promise<HTMLCanvasElement> {
  const scale = Math.min(1, maxDim / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas 2d context unavailable");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("canvas toBlob failed"));
    }, "image/png");
  });
}

export function PhoneScannerMode({ onScan }: { onScan: ScanFn }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReaderType | null>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef(false);
  const startingRef = useRef(false);
  const heartbeatRef = useRef(0);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<"unsupported" | "insecure" | "denied" | null>(
    null,
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoResult, setPhotoResult] = useState<"ok" | "fail" | null>(null);

  const stopCamera = useCallback(() => {
    activeRef.current = false;
    try {
      readerRef.current?.reset();
    } catch {
      /* already stopped */
    }
    readerRef.current = null;
    setCameraActive(false);
  }, []);

  const handleDecode = useCallback((result: Result | null) => {
    heartbeatRef.current = Date.now();
    if (!activeRef.current || !result) return;
    const code = result.getText();
    const now = Date.now();
    const last = lastScanRef.current;
    if (last && last.code === code && now - last.at < DEDUP_MS) {
      return;
    }
    lastScanRef.current = { code, at: now };
    onScanRef.current(code);
  }, []);

  const startCamera = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    setCameraError(null);
    setPhotoResult(null);

    const secureContext =
      typeof window === "undefined" ||
      typeof window.isSecureContext !== "boolean" ||
      window.isSecureContext;
    if (!secureContext) {
      setCameraError("insecure");
      setCameraActive(false);
      startingRef.current = false;
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("unsupported");
      setCameraActive(false);
      startingRef.current = false;
      return;
    }

    stopCamera();
    activeRef.current = true;
    setCameraActive(true);

    try {
      const { BrowserMultiFormatReader, hints } = await loadScanner();
      if (!activeRef.current) return;
      const video = videoRef.current;
      if (!video) throw new Error("video element is missing");

      const reader = new BrowserMultiFormatReader(
        hints as ConstructorParameters<typeof BrowserMultiFormatReader>[0],
        SCAN_INTERVAL_MS,
      );
      reader.timeBetweenDecodingAttempts = DECODE_RETRY_INTERVAL_MS;
      readerRef.current = reader;
      heartbeatRef.current = Date.now();

      await reader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        video,
        handleDecode,
      );
    } catch (e) {
      console.warn("Camera scan failed to start:", e);
      stopCamera();
      setCameraError("denied");
    } finally {
      startingRef.current = false;
    }
  }, [handleDecode, stopCamera]);

  useEffect(() => {
    const watchdog = setInterval(() => {
      if (!activeRef.current || startingRef.current) return;
      if (Date.now() - heartbeatRef.current > HEARTBEAT_TIMEOUT_MS) {
        console.warn("Scanner loop stalled — restarting camera");
        void startCamera();
      }
    }, WATCHDOG_INTERVAL_MS);
    return () => {
      clearInterval(watchdog);
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const decodePhoto = useCallback(async (file: File) => {
    const { BrowserMultiFormatReader, hints } = await loadPhotoReader();

    // Load image once to handle EXIF orientation
    const image = await loadImageWithExif(file);

    // Create two versions: original (full res) and downscaled (higher dim for photos)
    const originalCanvas = await createCanvasFromImage(image);
    const downscaledCanvas = await createCanvasFromImage(image, MAX_PHOTO_DIM);
    const originalBlob = await canvasToBlob(originalCanvas);
    const downscaledBlob = await canvasToBlob(downscaledCanvas);

    // Try original first (best for small 1D barcodes), then downscaled (faster for large images)
    const attemptBlobs = [originalBlob, downscaledBlob].filter(Boolean) as Blob[];

    try {
      for (const blob of attemptBlobs) {
        const url = URL.createObjectURL(blob);
        let reader: BrowserMultiFormatReaderType | null = null;
        try {
          reader = new BrowserMultiFormatReader(
            hints as ConstructorParameters<typeof BrowserMultiFormatReader>[0],
            SCAN_INTERVAL_MS,
          );
          const result = await withTimeout(reader.decodeFromImageUrl(url), DECODE_TIMEOUT_MS);
          if (result) {
            onScanRef.current(result.getText());
            return true;
          }
        } catch {
          /* no code in this pass — try the next */
        } finally {
          try {
            reader?.reset();
          } catch {
            /* ignore */
          }
          URL.revokeObjectURL(url);
        }
      }
      return false;
    } finally {
      // Ensure all blob URLs are revoked
      attemptBlobs.forEach((blob) => {
        const url = URL.createObjectURL(blob);
        URL.revokeObjectURL(url);
      });
    }
  }, []);

  const handlePickPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    setPhotoResult(null);
    try {
      const ok = await decodePhoto(file);
      setPhotoResult(ok ? "ok" : "fail");
    } catch {
      setPhotoResult("fail");
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePickPhoto}
      />

      {!cameraActive && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={startCamera}
            className="gap-2 sm:justify-start"
          >
            <ScanLine className="size-4" />
            {t("cashier.startCamera")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCameraError(null);
              setPhotoResult(null);
              photoInputRef.current?.click();
            }}
            className="gap-2 sm:justify-start"
          >
            {photoBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {t("cashier.photoScan")}
          </Button>
        </div>
      )}

      <div className={cn("space-y-2", cameraActive ? "" : "hidden")}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              "aspect-[4/3] w-full object-cover",
              cameraError ? "opacity-30" : "opacity-100",
            )}
          />
          {!cameraError && (
            <div className="pointer-events-none absolute inset-4 rounded-lg border-2 border-dashed border-primary/60" />
          )}
          {cameraError ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-4 text-center text-white">
              <span className="flex items-start gap-2 text-xs sm:text-sm">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {t(
                  cameraError === "insecure"
                    ? "cashier.cameraNeedsHttps"
                    : cameraError === "unsupported"
                      ? "cashier.cameraUnsupported"
                      : "cashier.cameraDenied",
                )}
              </span>
            </div>
          ) : (
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center">
              <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                {t("cashier.scanningNow")}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{t("cashier.cameraNote")}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={stopCamera}
            className="gap-1.5"
          >
            <Square className="size-3.5" />
            {t("cashier.stopCamera")}
          </Button>
        </div>
      </div>

      {photoBusy && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t("cashier.photoBusy")}
        </p>
      )}
      {photoResult && (
        <p
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            photoResult === "ok"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {t(photoResult === "ok" ? "cashier.photoOk" : "cashier.photoFail")}
        </p>
      )}
    </div>
  );
}
