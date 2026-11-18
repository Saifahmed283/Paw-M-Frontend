import { xt as PawMMark } from "./router-CKo2Bwyu.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import QRCode from "qrcode";
// src/components/PrescriptionDocument.tsx
function formatDate(input) {
	if (!input) return "—";
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function verifyUrl(code) {
	if (typeof window === "undefined") return `/rx/verify?code=${encodeURIComponent(code)}`;
	return `${window.location.origin}/rx/verify?code=${encodeURIComponent(code)}`;
}
function useQrDataUrl(value) {
	const [dataUrl, setDataUrl] = useState(null);
	useEffect(() => {
		let cancelled = false;
		if (!value) {
			setDataUrl(null);
			return;
		}
		QRCode.toDataURL(value, {
			width: 160,
			margin: 1,
			errorCorrectionLevel: "M"
		}).then((url) => {
			if (!cancelled) setDataUrl(url);
		});
		return () => {
			cancelled = true;
		};
	}, [value]);
	return dataUrl;
}
function PrescriptionDocument({ rx }) {
	const qr = useQrDataUrl(rx.status === "void" ? null : verifyUrl(rx.verifyCode));
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white text-zinc-900",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b-4 border-zinc-900 px-8 py-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(PawMMark, { className: "h-12 w-12" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xl font-extrabold tracking-tight text-zinc-900",
							children: "Paw Clinic Madinaty"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-zinc-600",
							children: "Veterinary Medical Prescription"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-end",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "font-mono text-lg font-bold tracking-wider",
								children: rx.rxNumber
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-sm text-zinc-600",
								children: ["Issued: ", formatDate(rx.issuedAt ?? rx.createdAt)]
							}),
							/* @__PURE__ */ jsx("p", {
								className: `mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${rx.status === "void" ? "bg-red-100 text-red-700" : rx.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`,
								children: rx.status === "void" ? "VOID" : rx.status === "draft" ? "DRAFT" : "ISSUED"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "px-8 py-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 rounded-lg border border-zinc-200 p-4 text-sm",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
								children: "Owner"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: rx.client?.fullName ?? "—"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-zinc-600",
								children: rx.client?.phone
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-zinc-600",
								children: rx.client?.email
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
								children: "Patient"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: rx.petName || rx.pet?.name || "—"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-zinc-600",
								children: [rx.petSpecies || rx.pet?.species, rx.petBreed || rx.pet?.breed].filter(Boolean).join(" · ") || "Species unknown"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-zinc-600",
								children: [rx.pet?.dob ? `Born ${formatDate(rx.pet.dob)}` : "", rx.pet?.weightKg ? ` · ${rx.pet.weightKg} kg` : ""]
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
							children: "Diagnosis"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 whitespace-pre-wrap text-sm text-zinc-800",
							children: rx.diagnosis || "—"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
							children: "Medications"
						}), /* @__PURE__ */ jsxs("table", {
							className: "mt-2 w-full border-collapse text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: [
								"Medication",
								"Dose",
								"Frequency",
								"Route",
								"Duration",
								"Note"
							].map((h) => /* @__PURE__ */ jsx("th", {
								className: "border border-zinc-300 bg-zinc-100 px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600",
								children: h
							}, h)) }) }), /* @__PURE__ */ jsx("tbody", { children: rx.items.map((item, i) => /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5 font-medium",
									children: item.medication
								}),
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5",
									children: item.dose
								}),
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5",
									children: item.frequency
								}),
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5",
									children: item.route
								}),
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5",
									children: item.duration
								}),
								/* @__PURE__ */ jsx("td", {
									className: "border border-zinc-200 px-2 py-1.5",
									children: item.note
								})
							] }, i)) })]
						})]
					}),
					(rx.instructions || rx.followUpDate) && /* @__PURE__ */ jsxs("div", {
						className: "mt-5",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
								children: "Instructions"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 whitespace-pre-wrap text-sm text-zinc-800",
								children: rx.instructions || "—"
							}),
							rx.followUpDate && /* @__PURE__ */ jsxs("p", {
								className: "mt-2 text-sm text-zinc-700",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: "Follow-up:"
									}),
									" ",
									formatDate(rx.followUpDate)
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex items-end justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
								children: "Prescribing Clinician"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex items-end gap-4",
								children: [(rx.signatureSnapshot?.signatureImage || rx.doctor?.signatureImage) && /* @__PURE__ */ jsx("img", {
									src: rx.signatureSnapshot?.signatureImage || rx.doctor?.signatureImage || "",
									alt: "Signature",
									className: "h-16 max-w-40 object-contain"
								}), /* @__PURE__ */ jsxs("div", {
									className: "pb-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "font-semibold",
											children: rx.signatureSnapshot?.name || rx.doctor?.name || "—"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-zinc-600",
											children: rx.signatureSnapshot?.title || rx.doctor?.title || rx.doctor?.specialization || "Veterinarian"
										}),
										rx.signatureSnapshot?.licenseNumber && /* @__PURE__ */ jsxs("p", {
											className: "text-sm text-zinc-600",
											children: ["License: ", rx.signatureSnapshot.licenseNumber]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "shrink-0 text-center",
							children: [qr ? /* @__PURE__ */ jsx("img", {
								src: qr,
								alt: "Verification QR code",
								className: "h-24 w-24 border border-zinc-300"
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid h-24 w-24 place-items-center border border-zinc-300 text-[10px] text-zinc-400",
								children: rx.status === "void" ? "VOIDED" : ""
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 max-w-28 text-[10px] text-zinc-500",
								children: "Scan to verify this prescription"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-t border-zinc-300 px-8 py-4",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-center text-[10px] leading-relaxed text-zinc-500",
					children: "© 2026 Paw Clinic Madinaty — Property of Paw-M Clinic. Reproduction prohibited. Verify via QR code or the official Paw-M verification page."
				})
			})
		]
	});
}
function PrintCss() {
	return /* @__PURE__ */ jsx("style", { children: `
      @media print {
        @page { size: A4; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        header, footer { display: none !important; }
        .no-print { display: none !important; }
        .print-sheet { box-shadow: none !important; border: none !important; }
      }
    ` });
}
export { PrintCss as n, PrescriptionDocument as t };
