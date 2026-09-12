import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Prescription } from "@/lib/client-medical";
import { PawMMark } from "@/components/PawMMark";

function formatDate(input?: string | Date | null): string {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function verifyUrl(code: string): string {
  if (typeof window === "undefined") return `/rx/verify?code=${encodeURIComponent(code)}`;
  return `${window.location.origin}/rx/verify?code=${encodeURIComponent(code)}`;
}

function useQrDataUrl(value: string | null): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setDataUrl(null);
      return;
    }
    QRCode.toDataURL(value, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "M",
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);
  return dataUrl;
}

export function PrescriptionDocument({ rx }: { rx: Prescription }) {
  const qr = useQrDataUrl(rx.status === "void" ? null : verifyUrl(rx.verifyCode));

  return (
    <div className="bg-white text-zinc-900">
      <div className="border-b-4 border-zinc-900 px-8 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <PawMMark className="h-12 w-12" />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-zinc-900">
                Paw Clinic Madinaty
              </p>
              <p className="text-sm text-zinc-600">Veterinary Medical Prescription</p>
            </div>
          </div>
          <div className="text-end">
            <p className="font-mono text-lg font-bold tracking-wider">{rx.rxNumber}</p>
            <p className="text-sm text-zinc-600">
              Issued: {formatDate(rx.issuedAt ?? rx.createdAt)}
            </p>
            <p
              className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                rx.status === "void"
                  ? "bg-red-100 text-red-700"
                  : rx.status === "draft"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {rx.status === "void" ? "VOID" : rx.status === "draft" ? "DRAFT" : "ISSUED"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-zinc-200 p-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Owner</p>
            <p className="font-semibold">{rx.client?.fullName ?? "—"}</p>
            <p className="text-zinc-600">{rx.client?.phone}</p>
            <p className="text-zinc-600">{rx.client?.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Patient</p>
            <p className="font-semibold">{rx.petName || rx.pet?.name || "—"}</p>
            <p className="text-zinc-600">
              {[rx.petSpecies || rx.pet?.species, rx.petBreed || rx.pet?.breed]
                .filter(Boolean)
                .join(" · ") || "Species unknown"}
            </p>
            <p className="text-zinc-600">
              {rx.pet?.dob ? `Born ${formatDate(rx.pet.dob)}` : ""}
              {rx.pet?.weightKg ? ` · ${rx.pet.weightKg} kg` : ""}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Diagnosis</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">{rx.diagnosis || "—"}</p>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Medications
          </p>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Medication", "Dose", "Frequency", "Route", "Duration", "Note"].map((h) => (
                  <th
                    key={h}
                    className="border border-zinc-300 bg-zinc-100 px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rx.items.map((item, i) => (
                <tr key={i}>
                  <td className="border border-zinc-200 px-2 py-1.5 font-medium">
                    {item.medication}
                  </td>
                  <td className="border border-zinc-200 px-2 py-1.5">{item.dose}</td>
                  <td className="border border-zinc-200 px-2 py-1.5">{item.frequency}</td>
                  <td className="border border-zinc-200 px-2 py-1.5">{item.route}</td>
                  <td className="border border-zinc-200 px-2 py-1.5">{item.duration}</td>
                  <td className="border border-zinc-200 px-2 py-1.5">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(rx.instructions || rx.followUpDate) && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Instructions
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
              {rx.instructions || "—"}
            </p>
            {rx.followUpDate && (
              <p className="mt-2 text-sm text-zinc-700">
                <span className="font-semibold">Follow-up:</span> {formatDate(rx.followUpDate)}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex items-end justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Prescribing Clinician
            </p>
            <div className="mt-2 flex items-end gap-4">
              {(rx.signatureSnapshot?.signatureImage || rx.doctor?.signatureImage) && (
                <img
                  src={rx.signatureSnapshot?.signatureImage || rx.doctor?.signatureImage || ""}
                  alt="Signature"
                  className="h-16 max-w-40 object-contain"
                />
              )}
              <div className="pb-1">
                <p className="font-semibold">
                  {rx.signatureSnapshot?.name || rx.doctor?.name || "—"}
                </p>
                <p className="text-sm text-zinc-600">
                  {rx.signatureSnapshot?.title ||
                    rx.doctor?.title ||
                    rx.doctor?.specialization ||
                    "Veterinarian"}
                </p>
                {rx.signatureSnapshot?.licenseNumber && (
                  <p className="text-sm text-zinc-600">
                    License: {rx.signatureSnapshot.licenseNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-center">
            {qr ? (
              <img
                src={qr}
                alt="Verification QR code"
                className="h-24 w-24 border border-zinc-300"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center border border-zinc-300 text-[10px] text-zinc-400">
                {rx.status === "void" ? "VOIDED" : ""}
              </div>
            )}
            <p className="mt-1 max-w-28 text-[10px] text-zinc-500">
              Scan to verify this prescription
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-300 px-8 py-4">
        <p className="text-center text-[10px] leading-relaxed text-zinc-500">
          © 2026 Paw Clinic Madinaty — Property of Paw-M Clinic. Reproduction prohibited. Verify via
          QR code or the official Paw-M verification page.
        </p>
      </div>
    </div>
  );
}

export function PrintCss() {
  return (
    <style>{`
      @media print {
        @page { size: A4; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        header, footer { display: none !important; }
        .no-print { display: none !important; }
        .print-sheet { box-shadow: none !important; border: none !important; }
      }
    `}</style>
  );
}
