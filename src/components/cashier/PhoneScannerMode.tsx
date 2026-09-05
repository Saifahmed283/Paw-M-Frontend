import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, ScanLine, Square, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ScanFn = (code: string) => void;

/**
 * Scanner-mode module. Safe to import on the server: the ZXing runtime library
 * is only fetched lazily inside event handlers, so nothing barcode-related is
 * evaluated during SSR or initial page load.
 */
type BrowserMultiFormatReaderType = import("@zxing/library").BrowserMultiFormatReader;

const ONE_D_FORMATS = [
  "EAN_13",
  "EAN_8",
  "UPC_A",
  "UPC_E",
  "CODE_128",
  "CODE_39",
  "CODE_93",
  "ITF",
] as const;

const DECODE_DELAY_MS = 200;
const DEDUP_MS = 2500;

async function loadScanner() {
  const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } =
    await import("@zxing/library");
  const hints = new Map<unknown, unknown>();
  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    ONE_D_FORMATS.map((f) => BarcodeFormat[f]),
  );
  return { BrowserMultiFormatReader, hints };
}

export function PhoneScannerMode({ onScan }: { onScan: ScanFn }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReaderType | null>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<"unsupported" | "denied" | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoResult, setPhotoResult] = useState<"ok" | "fail" | null>(null);

  const stopCamera = useCallback(() => {
    try {
      readerRef.current?.reset();
    } catch {
      /* already stopped */
    }
    readerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setPhotoResult(null);
    setCameraActive(true);
    const video = videoRef.current;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("unsupported");
      setCameraActive(false);
      return;
    }
    if (!video) return;
    try {
      const { BrowserMultiFormatReader, hints } = await loadScanner();
      const reader = new BrowserMultiFormatReader(
        hints as ConstructorParameters<typeof BrowserMultiFormatReader>[0],
        DECODE_DELAY_MS,
      );
      readerRef.current = reader;
      void reader
        .decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          },
          video,
          (result) => {
            if (!result) return;
            const code = result.getText();
            const now = Date.now();
            const last = lastScanRef.current;
            if (last && last.code === code && now - last.at < DEDUP_MS) return;
            lastScanRef.current = { code, at: now };
            onScanRef.current(code);
          },
        )
        .catch(() => {
          stopCamera();
          setCameraError("denied");
        });
    } catch {
      stopCamera();
      setCameraError("denied");
    }
  }, [stopCamera]);

  const decodePhoto = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    try {
      const { BrowserMultiFormatReader, hints } = await loadScanner();
      const reader = new BrowserMultiFormatReader(
        hints as ConstructorParameters<typeof BrowserMultiFormatReader>[0],
        DECODE_DELAY_MS,
      );
      try {
        const result = await reader.decodeFromImageUrl(url);
        if (result) {
          onScanRef.current(result.getText());
          return true;
        }
      } finally {
        try {
          reader.reset();
        } catch {
          /* ignore */
        }
      }
    } finally {
      URL.revokeObjectURL(url);
    }
    return false;
  }, []);

  const handlePickPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    setPhotoResult(null);
    const ok = await decodePhoto(file);
    setPhotoResult(ok ? "ok" : "fail");
    setPhotoBusy(false);
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

      {cameraActive && (
        <div className="space-y-2">
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
                    cameraError === "unsupported"
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
      )}

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
