import { C as checkIn, T as createOrder, W as refreshClinicData, Z as settlePayment, _ as Button, b as addPaymentItem, d as LanguageToggle, g as formatPrice, l as StatusOrb, rt as useClinicStore, u as useTheme } from "./router-A82Obkr4.js";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, t as Card } from "./card-CRbUOj_Z.js";
import { t as Input } from "./input-CvI9nHRx.js";
import { t as Label } from "./label-Dz-WHZIq.js";
import { t as Badge } from "./badge-EB48YIY-.js";
import { d as TabsContent, f as TabsList, i as StaffAuthGate, o as PaymentKindBadge, p as TabsTrigger, t as PaymentSettleDialog, u as Tabs } from "./PaymentSettleDialog-CWZySeiU.js";
import { D as cn, b as isAuthed, c as api, l as apiErrorMessage, o as useI18n } from "./i18n-B17xJ44j.js";
import { t as STORE_CHECKOUT_METHODS, y as usesSinglePaymentMethod } from "./payment-verification-uWi2kuS5.js";
import { r as clinicTodayISO, t as Separator } from "./separator-YX-shUFs.js";
import { n as categoryKey } from "./product-categories-CQtQycxr.js";
import { t as Textarea } from "./textarea-1VOsucwi.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CPTnzJtp.js";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Activity, Archive, ArrowLeftRight, ArrowUpDown, BadgePercent, Banknote, Barcode, Bath, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock, FlaskConical, FolderHeart, Grid2X2, ImagePlus, Keyboard, Loader2, LogIn, LogOut, Minus, Moon, Package, PackagePlus, PauseCircle, Percent, Pill, PlayCircle, Plus, Printer, ReceiptText, Salad, ScanLine, Scissors, Search, ShoppingCart, Siren, SlidersHorizontal, Smartphone, Sparkles, Square, Stethoscope, Sun, Syringe, Trash2, TriangleAlert, Undo2, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as PopoverPrimitive from "@radix-ui/react-popover";
// src/components/ui/collapsible.tsx
var Collapsible = CollapsiblePrimitive.Root;
var CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
var CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
// src/components/cashier/PhoneScannerMode.tsx
var SCAN_FORMATS = [
	"EAN_13",
	"EAN_8",
	"UPC_A",
	"UPC_E",
	"CODE_128",
	"CODE_39",
	"CODE_93",
	"ITF",
	"QR_CODE"
];
var SCAN_INTERVAL_MS = 300;
var DECODE_RETRY_INTERVAL_MS = 150;
var DEDUP_MS = 2500;
var MAX_IMAGE_DIM = 1920;
var MAX_PHOTO_DIM = 3840;
var IMAGE_LOAD_TIMEOUT_MS = 1e4;
var DECODE_TIMEOUT_MS = 2e4;
var WATCHDOG_INTERVAL_MS = 2e3;
var HEARTBEAT_TIMEOUT_MS = 5e3;
async function loadScanner() {
	const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } = await import("@zxing/library");
	const hints = /* @__PURE__ */ new Map();
	hints.set(DecodeHintType.POSSIBLE_FORMATS, SCAN_FORMATS.map((f) => BarcodeFormat[f]));
	return {
		BrowserMultiFormatReader,
		hints
	};
}
async function loadPhotoReader() {
	const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } = await import("@zxing/library");
	const hints = /* @__PURE__ */ new Map();
	hints.set(DecodeHintType.POSSIBLE_FORMATS, SCAN_FORMATS.map((f) => BarcodeFormat[f]));
	hints.set(DecodeHintType.TRY_HARDER, true);
	return {
		BrowserMultiFormatReader,
		hints
	};
}
async function withTimeout(promise, ms) {
	let timer;
	const timeoutPromise = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error("timed out")), ms);
	});
	try {
		return await Promise.race([promise, timeoutPromise]);
	} finally {
		clearTimeout(timer);
	}
}
async function loadImageWithExif(file) {
	const url = URL.createObjectURL(file);
	try {
		const image = new Image();
		const loaded = new Promise((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(/* @__PURE__ */ new Error("image failed to load"));
		});
		image.src = url;
		await withTimeout(loaded, IMAGE_LOAD_TIMEOUT_MS);
		return image;
	} finally {
		URL.revokeObjectURL(url);
	}
}
async function createCanvasFromImage(image, maxDim = MAX_IMAGE_DIM) {
	const scale = Math.min(1, maxDim / Math.max(image.naturalWidth, image.naturalHeight));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
	canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("canvas 2d context unavailable");
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvas;
}
async function canvasToBlob(canvas) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) resolve(blob);
			else reject(/* @__PURE__ */ new Error("canvas toBlob failed"));
		}, "image/png");
	});
}
function PhoneScannerMode({ onScan }) {
	const { t } = useI18n();
	const videoRef = useRef(null);
	const readerRef = useRef(null);
	const lastScanRef = useRef(null);
	const photoInputRef = useRef(null);
	const activeRef = useRef(false);
	const startingRef = useRef(false);
	const heartbeatRef = useRef(0);
	const onScanRef = useRef(onScan);
	onScanRef.current = onScan;
	const [cameraActive, setCameraActive] = useState(false);
	const [cameraError, setCameraError] = useState(null);
	const [photoBusy, setPhotoBusy] = useState(false);
	const [photoResult, setPhotoResult] = useState(null);
	const stopCamera = useCallback(() => {
		activeRef.current = false;
		try {
			readerRef.current?.reset();
		} catch {}
		readerRef.current = null;
		setCameraActive(false);
	}, []);
	const handleDecode = useCallback((result) => {
		heartbeatRef.current = Date.now();
		if (!activeRef.current || !result) return;
		const code = result.getText();
		const now = Date.now();
		const last = lastScanRef.current;
		if (last && last.code === code && now - last.at < DEDUP_MS) return;
		lastScanRef.current = {
			code,
			at: now
		};
		onScanRef.current(code);
	}, []);
	const startCamera = useCallback(async () => {
		if (startingRef.current) return;
		startingRef.current = true;
		setCameraError(null);
		setPhotoResult(null);
		if (!(typeof window === "undefined" || typeof window.isSecureContext !== "boolean" || window.isSecureContext)) {
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
			const reader = new BrowserMultiFormatReader(hints, SCAN_INTERVAL_MS);
			reader.timeBetweenDecodingAttempts = DECODE_RETRY_INTERVAL_MS;
			readerRef.current = reader;
			heartbeatRef.current = Date.now();
			await reader.decodeFromConstraints({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			}, video, handleDecode);
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
				startCamera();
			}
		}, WATCHDOG_INTERVAL_MS);
		return () => {
			clearInterval(watchdog);
			stopCamera();
		};
	}, [startCamera, stopCamera]);
	const decodePhoto = useCallback(async (file) => {
		const { BrowserMultiFormatReader, hints } = await loadPhotoReader();
		const image = await loadImageWithExif(file);
		const originalCanvas = await createCanvasFromImage(image);
		const downscaledCanvas = await createCanvasFromImage(image, MAX_PHOTO_DIM);
		const attemptBlobs = [await canvasToBlob(originalCanvas), await canvasToBlob(downscaledCanvas)].filter(Boolean);
		try {
			for (const blob of attemptBlobs) {
				const url = URL.createObjectURL(blob);
				let reader = null;
				try {
					reader = new BrowserMultiFormatReader(hints, SCAN_INTERVAL_MS);
					const result = await withTimeout(reader.decodeFromImageUrl(url), DECODE_TIMEOUT_MS);
					if (result) {
						onScanRef.current(result.getText());
						return true;
					}
				} catch {} finally {
					try {
						reader?.reset();
					} catch {}
					URL.revokeObjectURL(url);
				}
			}
			return false;
		} finally {
			attemptBlobs.forEach((blob) => {
				const url = URL.createObjectURL(blob);
				URL.revokeObjectURL(url);
			});
		}
	}, []);
	const handlePickPhoto = async (event) => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx("input", {
				ref: photoInputRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "hidden",
				onChange: handlePickPhoto
			}),
			!cameraActive && /* @__PURE__ */ jsxs("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					onClick: startCamera,
					className: "gap-2 sm:justify-start",
					children: [/* @__PURE__ */ jsx(ScanLine, { className: "size-4" }), t("cashier.startCamera")]
				}), /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					onClick: () => {
						setCameraError(null);
						setPhotoResult(null);
						photoInputRef.current?.click();
					},
					className: "gap-2 sm:justify-start",
					children: [photoBusy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(ImagePlus, { className: "size-4" }), t("cashier.photoScan")]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("space-y-2", cameraActive ? "" : "hidden"),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative overflow-hidden rounded-xl border border-border bg-black",
					children: [
						/* @__PURE__ */ jsx("video", {
							ref: videoRef,
							playsInline: true,
							muted: true,
							className: cn("aspect-[4/3] w-full object-cover", cameraError ? "opacity-30" : "opacity-100")
						}),
						!cameraError && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-4 rounded-lg border-2 border-dashed border-primary/60" }),
						cameraError ? /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute inset-0 grid place-items-center p-4 text-center text-white",
							children: /* @__PURE__ */ jsxs("span", {
								className: "flex items-start gap-2 text-xs sm:text-sm",
								children: [/* @__PURE__ */ jsx(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), t(cameraError === "insecure" ? "cashier.cameraNeedsHttps" : cameraError === "unsupported" ? "cashier.cameraUnsupported" : "cashier.cameraDenied")]
							})
						}) : /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur",
								children: t("cashier.scanningNow")
							})
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: t("cashier.cameraNote")
					}), /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: stopCamera,
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Square, { className: "size-3.5" }), t("cashier.stopCamera")]
					})]
				})]
			}),
			photoBusy && /* @__PURE__ */ jsxs("p", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }), t("cashier.photoBusy")]
			}),
			photoResult && /* @__PURE__ */ jsx("p", {
				className: cn("rounded-lg px-3 py-2 text-sm", photoResult === "ok" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"),
				children: t(photoResult === "ok" ? "cashier.photoOk" : "cashier.photoFail")
			})
		]
	});
}
function nextScannerInput(buffer, key, at) {
	if (key.length === 1) {
		if (buffer && at - buffer.lastAt <= 60) return {
			buffer: {
				keys: buffer.keys + key,
				lastAt: at
			},
			scan: null
		};
		const idleScan = buffer && buffer.keys.length >= 3 ? buffer.keys : null;
		return {
			buffer: {
				keys: key,
				lastAt: at
			},
			scan: idleScan
		};
	}
	if (key === "Enter") return {
		buffer: null,
		scan: buffer && buffer.keys.length >= 3 && at - buffer.lastAt <= 250 ? buffer.keys : null
	};
	return {
		buffer: null,
		scan: null
	};
}
var EMPTY = {
	detected: false,
	lastCode: null,
	lastAt: null,
	scanCount: 0
};
function useHardwareScanner() {
	const bufferRef = useRef(null);
	const [match, setMatch] = useState(EMPTY);
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			const at = performance.now();
			const { buffer, scan } = nextScannerInput(bufferRef.current, e.key, at);
			bufferRef.current = buffer;
			if (scan) setMatch((prev) => ({
				detected: true,
				lastCode: scan,
				lastAt: Date.now(),
				scanCount: prev.scanCount + 1
			}));
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);
	return match;
}
function timeAgo$1(ts, t) {
	const s = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
	if (s < 60) return t("time.shortSec", { n: String(s) });
	const m = Math.floor(s / 60);
	if (m < 60) return t("time.shortMin", { n: String(m) });
	const h = Math.floor(m / 60);
	return t("time.shortHrMin", {
		h: String(h),
		m: String(m % 60)
	});
}
function ScannerStatus({ className }) {
	const { t } = useI18n();
	const { detected, lastCode, lastAt, scanCount } = useHardwareScanner();
	const [now, setNow] = useState(() => Date.now());
	const [testing, setTesting] = useState(false);
	const [testValue, setTestValue] = useState("");
	const testRef = useRef(null);
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(id);
	}, []);
	useEffect(() => {
		if (testing) testRef.current?.focus();
	}, [testing]);
	const active = detected && lastAt !== null && now - lastAt <= 3e4;
	const orbTone = active ? "ok" : detected ? "idle" : "watch";
	let message;
	if (active && lastAt !== null) message = t("cashier.scannerActive", { ago: timeAgo$1(lastAt, t) });
	else if (detected && lastAt !== null) message = t("cashier.scannerSeen", { ago: timeAgo$1(lastAt, t) });
	else message = t("cashier.scannerNever");
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-[var(--radius-lg)] border border-border bg-surface-2/60 px-3 py-2.5", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-x-3 gap-y-1",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-2 text-sm font-semibold text-foreground",
				children: [/* @__PURE__ */ jsx(StatusOrb, {
					tone: orbTone,
					size: "sm",
					pulse: active
				}), message]
			}), detected && /* @__PURE__ */ jsxs("span", {
				className: "ml-auto inline-flex items-center gap-3 text-xs text-muted-foreground",
				children: [lastCode && /* @__PURE__ */ jsx("span", {
					className: "font-mono",
					children: lastCode
				}), scanCount > 0 && /* @__PURE__ */ jsx("span", { children: t("cashier.scannerCount", { count: String(scanCount) }) })]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-2 border-t pt-2",
			children: !testing ? /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				className: "gap-1.5 text-xs",
				onClick: () => setTesting(true),
				children: [/* @__PURE__ */ jsx(ScanLine, { className: "size-3.5" }), t("cashier.scannerTest")]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ jsx(Input, {
						ref: testRef,
						type: "text",
						value: testValue,
						onChange: (e) => setTestValue(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								setTestValue("");
							}
						},
						placeholder: t("cashier.scannerTestPlaceholder"),
						autoComplete: "off",
						className: "h-9 font-mono text-xs"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "flex items-start gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx(CircleAlert, { className: "mt-0.5 size-3.5 shrink-0" }), t("cashier.scannerTestDesc")]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-7 px-2 text-xs",
						onClick: () => setTesting(false),
						children: t("cashier.scannerTestClose")
					})
				]
			})
		})]
	});
}
// src/components/cashier/QuickAddGrid.tsx
var PAGE_SIZE = 5;
function QuickAddGrid({ products, cart, currency, onAdd }) {
	const { t, tOr } = useI18n();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [sort, setSort] = useState("name");
	const [page, setPage] = useState(1);
	const categoryCounts = useMemo(() => {
		const counts = /* @__PURE__ */ new Map();
		products.forEach((p) => {
			if (!p.category) return;
			const key = categoryKey(p.category);
			counts.set(key, (counts.get(key) ?? 0) + 1);
		});
		return counts;
	}, [products]);
	const categories = useMemo(() => Array.from(categoryCounts.keys()).sort(), [categoryCounts]);
	const inCart = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		cart.forEach((c) => map.set(c.id, c.qty));
		return map;
	}, [cart]);
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return [...products.filter((p) => {
			if (category !== "all" && categoryKey(p.category) !== category) return false;
			if (!q) return true;
			return p.name.toLowerCase().includes(q) || (p.barcode ? p.barcode.toLowerCase().includes(q) : false) || p.category.toLowerCase().includes(q);
		})].sort((a, b) => sort === "price" ? Number(a.price) - Number(b.price) : a.name.localeCompare(b.name));
	}, [
		products,
		query,
		category,
		sort
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const visible = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
	useEffect(() => setPage(1), [
		query,
		category,
		sort
	]);
	useEffect(() => {
		if (page > pageCount) setPage(pageCount);
	}, [page, pageCount]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: t("cashier.quickAddSearch"),
						className: "h-9 pl-9",
						autoComplete: "off"
					})]
				}), /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					size: "icon",
					className: "size-9 shrink-0",
					onClick: () => setSort((s) => s === "name" ? "price" : "name"),
					title: sort === "name" ? t("dash.sort.title") : t("dash.sort.amount"),
					"aria-label": sort === "name" ? t("dash.sort.title") : t("dash.sort.amount"),
					children: /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-4" })
				})]
			}),
			categories.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "flex gap-1.5 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ jsxs(Badge, {
					variant: category === "all" ? "default" : "outline",
					className: "shrink-0 cursor-pointer px-2.5 py-1",
					onClick: () => setCategory("all"),
					children: [
						/* @__PURE__ */ jsx(SlidersHorizontal, { className: "me-1 size-3" }),
						t("cashier.allCategories"),
						/* @__PURE__ */ jsx("span", {
							className: "ms-1.5 opacity-70",
							children: products.length
						})
					]
				}), categories.map((c) => /* @__PURE__ */ jsxs(Badge, {
					variant: category === c ? "default" : "outline",
					className: "shrink-0 cursor-pointer px-2.5 py-1",
					onClick: () => setCategory(c),
					children: [tOr(`store.cat.${c}`, c), /* @__PURE__ */ jsx("span", {
						className: "ms-1.5 opacity-70",
						children: categoryCounts.get(c) ?? 0
					})]
				}, c))]
			}),
			visible.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: t("cashier.quickAddEmpty")
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5",
				children: visible.map((p) => {
					const qty = inCart.get(p.id) ?? 0;
					const out = p.stock <= 0;
					const atMax = qty >= p.stock;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: out,
						onClick: () => onAdd(p),
						className: cn("group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--panel-border)] bg-[var(--panel-bg)] text-start shadow-[var(--shadow-1)] transition-all duration-200 ease-[var(--ease-entrance)]", out ? "opacity-50" : "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[var(--shadow-2)]"),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-square w-full overflow-hidden bg-muted",
							children: [
								p.image ? /* @__PURE__ */ jsx("img", {
									src: p.image,
									alt: p.name,
									className: "size-full bg-muted object-contain p-2 transition-transform duration-300 group-hover:scale-105",
									loading: "lazy"
								}) : /* @__PURE__ */ jsx("div", {
									className: "grid size-full place-items-center text-3xl text-muted-foreground/40",
									children: "🐾"
								}),
								qty > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute end-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow",
									children: qty
								}),
								out && /* @__PURE__ */ jsx("span", {
									className: "absolute inset-0 grid place-items-center bg-black/40 text-xs font-semibold text-white",
									children: t("cashier.soldOut")
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col gap-1 p-2",
							children: [/* @__PURE__ */ jsx("p", {
								className: "line-clamp-2 min-h-[2rem] text-xs font-medium leading-snug",
								children: p.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-auto flex items-center justify-between gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "truncate font-data text-sm font-bold text-primary-strong tabular-nums",
									children: formatPrice(p.price, currency)
								}), /* @__PURE__ */ jsx("span", {
									className: cn("grid size-6 shrink-0 place-items-center rounded-full bg-primary-tint text-primary transition group-hover:bg-primary group-hover:text-primary-foreground", atMax && !out && "opacity-40"),
									"aria-hidden": true,
									children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
								})]
							})]
						})]
					}, p.id);
				})
			}),
			filtered.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-t pt-2",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: t("cashier.quickAddRange", {
						start: String((page - 1) * PAGE_SIZE + 1),
						end: String(Math.min(page * PAGE_SIZE, filtered.length)),
						total: String(filtered.length)
					})
				}), pageCount > 1 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							className: "size-7",
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page === 1,
							"aria-label": t("cashier.prevPage"),
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4 rtl:rotate-180" })
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-medium",
							children: t("cashier.pageOf", {
								page: String(page),
								total: String(pageCount)
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							className: "size-7",
							onClick: () => setPage((p) => Math.min(pageCount, p + 1)),
							disabled: page === pageCount,
							"aria-label": t("cashier.nextPage"),
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 rtl:rotate-180" })
						})
					]
				})]
			})
		]
	});
}
// src/components/cashier/ClinicServicePanel.tsx
/** Maps the icon names stored with clinic services to lucide components. */
var SERVICE_ICONS = {
	Activity,
	Bath,
	FolderHeart,
	FlaskConical,
	Pill,
	Salad,
	ScanLine,
	Scissors,
	Siren,
	Sparkles,
	Stethoscope,
	Syringe
};
function ClinicServicePanel({ services, currency, onAdd }) {
	const { t } = useI18n();
	const [query, setQuery] = useState("");
	const [selectedSlug, setSelectedSlug] = useState(null);
	const [price, setPrice] = useState("");
	const [note, setNote] = useState("");
	const visibleServices = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return services;
		return services.filter((s) => s.title.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q));
	}, [services, query]);
	const selected = useMemo(() => services.find((s) => s.slug === selectedSlug) ?? null, [services, selectedSlug]);
	const parsedPrice = Number(price);
	const validPrice = price.trim() !== "" && Number.isFinite(parsedPrice) && parsedPrice >= 0;
	const select = (service) => {
		setSelectedSlug(service.slug);
		setPrice(String(service.price ?? 0));
	};
	const add = () => {
		if (!selected || !validPrice) return;
		onAdd(selected, Math.round(parsedPrice * 100) / 100, note.trim());
		setNote("");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: t("cashier.clinicServiceDesc")
			}),
			services.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: t("dash.search"),
					className: "h-10 pl-9",
					autoComplete: "off"
				})]
			}),
			services.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground",
				children: t("cashier.noServices")
			}) : visibleServices.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-6 text-center text-sm text-muted-foreground",
				children: t("dash.empty")
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: visibleServices.map((service) => {
					const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
					const active = selectedSlug === service.slug;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => select(service),
						"aria-pressed": active,
						className: cn("flex items-start gap-2.5 rounded-xl border p-2.5 text-start transition-all duration-200", active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"),
						children: [/* @__PURE__ */ jsxs("span", {
							className: cn("relative grid size-9 shrink-0 place-items-center rounded-lg", active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"),
							children: [/* @__PURE__ */ jsx(Icon, { className: "size-4" }), active && /* @__PURE__ */ jsx("span", {
								className: "absolute -end-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground",
								children: /* @__PURE__ */ jsx(Check, { className: "size-2.5" })
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "truncate text-sm font-semibold",
									children: service.title
								}), /* @__PURE__ */ jsx("span", {
									className: "shrink-0 text-sm font-bold text-primary",
									children: formatPrice(service.price ?? 0, currency)
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-0.5 line-clamp-2 block text-xs text-muted-foreground",
								children: service.description
							})]
						})]
					}, service.slug);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2 rounded-xl border bg-muted/30 p-3",
				children: [
					selected && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-2 border-b pb-2",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex min-w-0 items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(Check, { className: "size-3.5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: selected.title
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: formatPrice(selected.price ?? 0, currency)
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "cashier-service-price",
								className: "text-xs text-muted-foreground",
								children: t("cashier.servicePrice")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
									children: currency
								}), /* @__PURE__ */ jsx(Input, {
									id: "cashier-service-price",
									type: "number",
									min: 0,
									step: "0.01",
									inputMode: "decimal",
									value: price,
									onChange: (e) => setPrice(e.target.value),
									placeholder: "0.00",
									className: "h-9 pl-10"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground",
								children: t("cashier.servicePriceHint")
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ jsxs(Label, {
							htmlFor: "cashier-service-note",
							className: "text-xs text-muted-foreground",
							children: [
								t("cashier.serviceNote"),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-destructive",
									children: "*"
								})
							]
						}), /* @__PURE__ */ jsx(Textarea, {
							id: "cashier-service-note",
							rows: 2,
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: t("cashier.serviceNotePlaceholder"),
							className: "resize-none"
						})]
					}),
					/* @__PURE__ */ jsxs(Button, {
						onClick: add,
						disabled: !selected || !validPrice,
						className: "w-full",
						children: [/* @__PURE__ */ jsx(Plus, { className: "size-4 me-1.5" }), t("cashier.addService")]
					})
				]
			})
		]
	});
}
// src/components/cashier/HoldManager.tsx
function timeAgo(ts, t) {
	const s = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
	if (s < 60) return t("time.shortSec", { n: String(s) });
	const m = Math.floor(s / 60);
	if (m < 60) return t("time.shortMin", { n: String(m) });
	const h = Math.floor(m / 60);
	return t("time.shortHrMin", {
		h: String(h),
		m: String(m % 60)
	});
}
function HoldManager({ heldSales, currency, onHold, onResume, onDiscard, canHold }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [
					/* @__PURE__ */ jsx(PauseCircle, { className: "size-4 text-muted-foreground" }),
					t("cashier.heldSales"),
					heldSales.length > 0 && /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						children: heldSales.length
					})
				]
			}), /* @__PURE__ */ jsxs(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: onHold,
				disabled: !canHold,
				className: "gap-1.5",
				children: [/* @__PURE__ */ jsx(Archive, { className: "size-3.5" }), t("cashier.holdSale")]
			})]
		}), heldSales.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground",
			children: t("cashier.noHeldSales")
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: heldSales.map((held) => {
				const items = held.cart.reduce((n, i) => n + i.qty, 0);
				const subtotal = held.cart.reduce((n, i) => n + i.price * i.qty, 0);
				return /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 rounded-xl border border-border p-2.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "truncate text-sm font-semibold",
									children: held.label || held.id
								}), /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsx(Clock, { className: "size-3" }), timeAgo(held.heldAt, t)]
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									items,
									" ",
									t("cashier.items"),
									" · ",
									formatPrice(subtotal, currency)
								]
							})]
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							className: "h-8 w-8",
							onClick: () => onResume(held.id),
							title: t("cashier.resumeSale"),
							"aria-label": t("cashier.resumeSale"),
							children: /* @__PURE__ */ jsx(PlayCircle, { className: "size-4" })
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 text-destructive",
							onClick: () => onDiscard(held.id),
							title: t("cashier.discardHeld"),
							"aria-label": t("cashier.discardHeld"),
							children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
						})
					]
				}, held.id);
			})
		})]
	});
}
// src/components/cashier/DiscountPanel.tsx
var PRESETS = [
	5,
	10,
	15,
	20,
	25,
	50
];
function fmt(n) {
	return n.toFixed(2);
}
function discountLabel(d, subtotal, t) {
	if (d.type === "percent") return `${d.value}%`;
	if (d.type === "fixed") return fmt(d.value);
	return "-";
}
function DiscountPanel({ orderDiscount, subtotal, currency, onApplyOrderDiscount }) {
	const { t } = useI18n();
	const [method, setMethod] = useState(orderDiscount.type === "none" ? "percent" : orderDiscount.type);
	const [value, setValue] = useState(orderDiscount.type !== "none" ? String(orderDiscount.value) : "");
	const clamp = (n) => method === "percent" ? Math.min(100, Math.max(0, n)) : Math.min(subtotal, Math.max(0, n));
	const apply = (raw) => {
		const clamped = clamp(method === "percent" ? raw : Math.round(raw * 100) / 100);
		if (clamped <= 0) {
			onApplyOrderDiscount({
				type: "none",
				value: 0
			});
			setValue("");
			return;
		}
		const d = {
			type: method,
			value: clamped
		};
		if (method === "fixed") d.label = t("cashier.discountOrder");
		onApplyOrderDiscount(d);
		setValue(String(clamped));
	};
	const active = orderDiscount.type !== "none";
	const discountAmount = orderDiscount.type === "percent" ? subtotal * (orderDiscount.value / 100) : orderDiscount.type === "fixed" ? orderDiscount.value : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [
					/* @__PURE__ */ jsx(BadgePercent, { className: "size-4 text-muted-foreground" }),
					t("cashier.discount"),
					active && /* @__PURE__ */ jsxs("span", {
						className: "text-destructive",
						children: ["−", discountLabel(orderDiscount, subtotal, t)]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex gap-2",
				children: [["percent", t("cashier.discountPercent")], ["fixed", t("cashier.discountFixed")]].map(([m, label]) => /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: method === m ? "default" : "outline",
					size: "sm",
					className: "flex-1",
					onClick: () => {
						setMethod(m);
						setValue("");
					},
					children: [m === "percent" ? /* @__PURE__ */ jsx(Percent, { className: "mr-1 size-3.5" }) : null, label]
				}, m))
			}),
			active && /* @__PURE__ */ jsxs(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "w-full text-destructive",
				onClick: () => {
					onApplyOrderDiscount({
						type: "none",
						value: 0
					});
					setValue("");
				},
				children: [/* @__PURE__ */ jsx(X, { className: "mr-1 size-3.5" }), t("cashier.removeDiscount")]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx(Label, {
					className: "sr-only",
					htmlFor: "discount-input",
					children: t("cashier.discount")
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [method === "percent" ? /* @__PURE__ */ jsx(Percent, { className: "absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }) : /* @__PURE__ */ jsx("span", {
						className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground",
						children: currency
					}), /* @__PURE__ */ jsx(Input, {
						id: "discount-input",
						type: "number",
						min: 0,
						max: method === "percent" ? 100 : void 0,
						inputMode: "decimal",
						value,
						onChange: (e) => {
							const raw = e.target.value;
							setValue(raw);
							if (raw !== "") {
								const n = Number(raw);
								if (Number.isFinite(n)) apply(n);
							} else onApplyOrderDiscount({
								type: "none",
								value: 0
							});
						},
						placeholder: method === "percent" ? "10" : "0.00",
						className: "pr-9"
					})]
				})]
			}),
			method === "percent" && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1.5",
				children: PRESETS.map((preset) => /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: orderDiscount.value === preset && orderDiscount.type === "percent" ? "secondary" : "outline",
					size: "sm",
					className: cn("h-7 px-2 text-xs"),
					onClick: () => apply(preset),
					children: [preset, "%"]
				}, preset))
			}),
			active && discountAmount > 0 && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Separator, {}), /* @__PURE__ */ jsxs("div", {
				className: "flex justify-between text-sm",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: t("cashier.discountApplied")
				}), /* @__PURE__ */ jsxs("span", {
					className: "font-semibold text-destructive",
					children: ["−", fmt(discountAmount)]
				})]
			})] })
		]
	});
}
// src/components/ui/popover.tsx
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(PopoverPrimitive.Content, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
// src/components/cashier/PerItemDiscount.tsx
function PerItemDiscount({ price, qty, stock, discount, onChange }) {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState(discount && discount.type === "fixed" ? "fixed" : "percent");
	const [value, setValue] = useState(discount && discount.type !== "none" ? String(discount.value) : "");
	const active = discount && discount.type !== "none";
	const apply = (raw) => {
		const val = methodClamp(raw);
		if (val <= 0) {
			onChange({
				type: "none",
				value: 0
			});
			setValue("");
			return;
		}
		onChange({
			type: mode,
			value: val
		});
		setValue(String(val));
	};
	const methodClamp = (n) => mode === "percent" ? Math.min(100, Math.max(0, n)) : Math.min(price, Math.max(0, n));
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				className: cn("h-7 w-7", active && "text-primary"),
				title: t("cashier.itemDiscount"),
				"aria-label": t("cashier.itemDiscount"),
				children: /* @__PURE__ */ jsx(BadgePercent, { className: "size-4" })
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			className: "w-60 p-3",
			align: "end",
			children: /* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold",
						children: t("cashier.itemDiscount")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex gap-1.5",
						children: ["percent", "fixed"].map((m) => /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: mode === m ? "default" : "outline",
							size: "sm",
							className: "flex-1",
							onClick: () => {
								setMode(m);
								setValue("");
								onChange({
									type: "none",
									value: 0
								});
							},
							children: m === "percent" ? "%" : t("cashier.discountFixed")
						}, m))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ jsx(Input, {
							type: "number",
							min: 0,
							max: mode === "percent" ? 100 : price,
							inputMode: "decimal",
							value,
							onChange: (e) => {
								const raw = e.target.value;
								setValue(raw);
								if (raw !== "") {
									const n = Number(raw);
									if (Number.isFinite(n)) apply(n);
								} else onChange({
									type: "none",
									value: 0
								});
							},
							placeholder: mode === "percent" ? "10" : "0.00",
							className: "h-8 text-sm"
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "h-8 px-2",
							onClick: () => {
								onChange({
									type: "none",
									value: 0
								});
								setValue("");
							},
							disabled: !active,
							"aria-label": t("cashier.removeDiscount"),
							children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							t("cashier.qty"),
							": ",
							qty,
							" · ",
							t("cashier.stock"),
							": ",
							stock
						]
					})
				]
			})
		})]
	});
}
// src/components/cashier/QuickCashCalculator.tsx
function QuickCashCalculator({ total, currency, onCashReceivedChange, received: controlledReceived, onReceivedChange }) {
	const { t } = useI18n();
	const [internalReceived, setInternalReceived] = useState(0);
	const received = controlledReceived ?? internalReceived;
	const [extra, setExtra] = useState("");
	const change = Math.max(0, received - total);
	const shortfall = Math.max(0, total - received);
	const settled = total > 0 && received >= total;
	const setAmt = (n) => {
		const v = Math.round(n * 100) / 100;
		setInternalReceived(v);
		onReceivedChange?.(v);
		onCashReceivedChange(v);
	};
	const addExtra = () => {
		const n = Number(extra);
		if (extra.trim() === "" || !Number.isFinite(n) || n <= 0) return;
		setAmt(received + n);
		setExtra("");
	};
	const clearAmt = () => {
		setInternalReceived(0);
		onReceivedChange?.(0);
		onCashReceivedChange(0);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-1.5 rounded-xl border bg-muted/40 p-1.5",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "hidden ps-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground lg:inline",
				children: t("cashier.cashReceived")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Input, {
					type: "number",
					min: 0,
					inputMode: "decimal",
					value: received === 0 ? "" : String(received),
					onChange: (e) => {
						const raw = e.target.value;
						if (raw === "") {
							setInternalReceived(0);
							onReceivedChange?.(0);
							onCashReceivedChange(0);
							return;
						}
						const n = Number(raw);
						if (Number.isFinite(n)) setAmt(n);
					},
					placeholder: "0.00",
					"aria-label": t("cashier.cashReceived"),
					className: "h-8 w-20 border-0 bg-transparent p-0 pe-8 text-center text-sm font-bold tabular-nums text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 sm:w-24"
				}), /* @__PURE__ */ jsx("span", {
					className: "pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground",
					children: currency
				})]
			}),
			/* @__PURE__ */ jsx("span", { className: "h-5 w-px bg-border" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: clearAmt,
					disabled: received === 0,
					className: "h-8 size-8 gap-0 p-0 text-xs text-muted-foreground",
					"aria-label": t("cashier.clear"),
					children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
				}), /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					onClick: addExtra,
					"aria-label": t("cashier.addAmount"),
					title: t("cashier.addAmount"),
					className: "size-8 text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
				})]
			}),
			/* @__PURE__ */ jsx(Input, {
				type: "number",
				min: 0,
				step: "0.01",
				inputMode: "decimal",
				value: extra,
				onChange: (e) => setExtra(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						addExtra();
					}
				},
				placeholder: "+ 0.00",
				"aria-label": t("cashier.extraAmount"),
				className: "h-8 w-16 border-0 bg-transparent p-0 text-center text-xs font-semibold tabular-nums text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
			}),
			/* @__PURE__ */ jsx("span", {
				className: cn("flex min-w-[92px] items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold tabular-nums", settled ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600"),
				children: settled ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(Check, { className: "size-3" }),
					t("cashier.change"),
					": ",
					change.toFixed(2),
					" ",
					currency
				] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(Minus, { className: "size-3" }),
					t("cashier.due"),
					": ",
					shortfall.toFixed(2),
					" ",
					currency
				] })
			})
		]
	});
}
// src/components/cashier/SplitPayment.tsx
var METHODS = STORE_CHECKOUT_METHODS;
function methodLabel(m, t) {
	return t(`checkout.method.${m}.short`);
}
/**
* Payment-method picker for the till. Mixed-method splits are intentionally not
* offered: an InstaPay portion would need bank-statement verification while a
* cash portion is settled at the counter, which cannot be represented by one
* order payment status. Each order uses exactly one trusted settlement path.
*/
function SplitPayment({ total, currency, method, allocations, onAllocationsChange, onMethodChange }) {
	const { t } = useI18n();
	const [enabled, setEnabled] = useState(allocations.length > 0);
	const selectedMethod = allocations[0]?.method ?? method;
	const amount = Math.round(total * 100) / 100;
	useEffect(() => {
		if (allocations.length === 0) setEnabled(false);
	}, [allocations.length]);
	const toggle = () => {
		setEnabled((prev) => {
			const next = !prev;
			onAllocationsChange(next ? [{
				method: selectedMethod,
				amount
			}] : []);
			if (next) onMethodChange?.(selectedMethod);
			return next;
		});
	};
	const selectMethod = (method) => {
		onAllocationsChange([{
			method,
			amount
		}]);
		onMethodChange?.(method);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: toggle,
			className: "flex w-full items-center justify-between rounded-xl border border-border p-3 text-sm font-semibold transition hover:border-primary/40",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(ArrowLeftRight, { className: "size-4 text-muted-foreground" }), t("cashier.splitPayment")]
			}), /* @__PURE__ */ jsx("span", {
				className: cn("rounded-full px-2.5 py-0.5 text-xs font-bold", enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
				children: enabled ? t("cashier.on") : t("cashier.off")
			})]
		}), enabled && /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground",
					children: t("cashier.singleMethodOnly")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: METHODS.map((method) => /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: method === selectedMethod ? "default" : "outline",
						size: "sm",
						disabled: method === selectedMethod,
						onClick: () => selectMethod(method),
						className: "gap-1",
						children: [/* @__PURE__ */ jsx(Check, { className: "size-3.5" }), methodLabel(method, t)]
					}, method))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between rounded-xl border border-border px-3 py-2 text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground",
						children: methodLabel(selectedMethod, t)
					}), /* @__PURE__ */ jsxs("span", {
						className: "font-semibold",
						children: [
							amount.toFixed(2),
							" ",
							currency
						]
					})]
				})
			]
		})]
	});
}
// src/components/cashier/ReceiptPreview.tsx
function ReceiptPreview({ open, onOpenChange, settings, customer, cart, itemDiscounts, orderDiscount, currency }) {
	const { t } = useI18n();
	const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
	const itemDiscountTotal = cart.reduce((n, i) => {
		const d = itemDiscounts[i.id];
		if (!d || d.type === "none") return n;
		return n + (d.type === "percent" ? i.price * (d.value / 100) : Math.min(d.value, i.price)) * i.qty;
	}, 0);
	const subtotalAfterItems = subtotal - itemDiscountTotal;
	const orderDiscAmt = orderDiscount.type === "percent" ? subtotalAfterItems * (orderDiscount.value / 100) : orderDiscount.type === "fixed" ? orderDiscount.value : 0;
	const total = Math.max(0, subtotalAfterItems - orderDiscAmt);
	const now = /* @__PURE__ */ new Date();
	const print = () => {
		const win = window.open("", "_blank", "width=420,height=600");
		if (!win) return;
		win.document.write(buildHtml());
		win.document.close();
		win.focus();
		setTimeout(() => win.print(), 250);
	};
	const buildHtml = () => {
		const rows = cart.map((i) => {
			const d = itemDiscounts[i.id];
			const eff = d && d.type === "percent" ? i.price * (1 - d.value / 100) : d && d.type === "fixed" ? Math.max(0, i.price - d.value) : i.price;
			return `
          <tr>
            <td>${esc(i.name)}</td>
            <td>${i.qty}</td>
            <td class="num">${eff.toFixed(2)}</td>
            <td class="num">${(eff * i.qty).toFixed(2)}</td>
          </tr>`;
		}).join("");
		const discRow = itemDiscountTotal > 0 || orderDiscAmt > 0 ? `<tr><td colspan="3" class="lbl">${esc(t("cashier.discountApplied"))}</td><td class="num">-${(itemDiscountTotal + orderDiscAmt).toFixed(2)}</td></tr>` : "";
		return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(t("cashier.receiptPreview"))}</title>
      <style>
        body{font-family:'Courier New',monospace;margin:0;padding:16px;color:#111;font-size:13px}
        h1{font-size:16px;margin:0 0 2px}
        .center{text-align:center}
        .muted{color:#666;font-weight:400}
        .divider{border-top:1px dashed #333;margin:8px 0}
        table{width:100%;border-collapse:collapse}
        td{padding:2px 0;vertical-align:top}
        td.num{text-align:right}
        td.lbl{color:#666}
        .total{font-size:15px;font-weight:bold}
        .foot{margin-top:8px;text-align:center;color:#333}
      </style></head><body>
      <div class="center">
      <img src="/assets/logos/logo-monochrome.png" alt="Paw-M Clinic" style="height:40px;width:40px;margin:0 auto 4px;display:block;margin-left:auto;margin-right:auto" aria-hidden="true" />
      <h1>${esc(settings.name)}</h1>
      ${settings.phone ? `<div class="muted">${esc(settings.phone)}</div>` : ""}
      ${settings.address ? `<div class="muted">${esc(settings.address)}</div>` : ""}</div>
      <div class="divider"></div>
      <div>${t("cashier.orderId")}: ${(/* @__PURE__ */ new Date()).getTime().toString(36).toUpperCase()}</div>
      ${customer.name ? `<div>${esc(customer.name)}</div>` : ""}
      ${customer.phone ? `<div>${esc(customer.phone)}</div>` : ""}
      <div class="muted">${now.toLocaleString()}</div>
      <div class="divider"></div>
      <table><thead><tr><th>${esc(t("cashier.receiptItem"))}</th><th>${esc(t("cashier.receiptQty"))}</th><th>@</th><th class="num">${esc(t("cashier.receiptTotal"))}</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="divider"></div>
      <table>
        ${discRow}
        <tr class="total"><td colspan="3">${esc(t("cashier.total"))}</td><td class="num">${total.toFixed(2)} ${esc(currency)}</td></tr>
      </table>
      <div class="divider"></div>
      <div class="foot">${esc(t("cashier.receiptThanks"))}</div>
      </body></html>`;
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(ReceiptText, { className: "size-5" }), t("cashier.receiptPreview")]
				}) }),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3 rounded-xl bg-muted/40 p-4 font-mono text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: "/assets/logos/logo-monochrome.png",
									alt: "Paw-M Clinic",
									className: "h-10 w-10 shrink-0",
									decoding: "async"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-base font-bold",
									children: settings.name
								}),
								settings.phone && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: settings.phone
								}),
								settings.address && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: settings.address
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-t border-dashed border-foreground/25 pt-2",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: now.toLocaleString()
								}),
								customer.name && /* @__PURE__ */ jsx("p", { children: customer.name }),
								customer.phone && /* @__PURE__ */ jsx("p", { children: customer.phone })
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "border-t border-dashed border-foreground/25 pt-1",
							children: cart.map((i) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex-1 truncate",
									children: [i.name, /* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground",
										children: [" × ", i.qty]
									})]
								}), /* @__PURE__ */ jsx("span", { children: (() => {
									const d = itemDiscounts[i.id];
									return ((d && d.type === "percent" ? i.price * (1 - d.value / 100) : d && d.type === "fixed" ? Math.max(0, i.price - d.value) : i.price) * i.qty).toFixed(2);
								})() })]
							}, i.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-t border-dashed border-foreground/25 pt-2",
							children: [(itemDiscountTotal > 0 || orderDiscAmt > 0) && /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-destructive",
								children: [/* @__PURE__ */ jsx("span", { children: t("cashier.discountApplied") }), /* @__PURE__ */ jsxs("span", { children: ["-", (itemDiscountTotal + orderDiscAmt).toFixed(2)] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-base font-bold",
								children: [/* @__PURE__ */ jsx("span", { children: t("cashier.total") }), /* @__PURE__ */ jsxs("span", { children: [
									total.toFixed(2),
									" ",
									currency
								] })]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: t("cashier.close")
				}), /* @__PURE__ */ jsxs(Button, {
					onClick: print,
					className: "gap-2",
					children: [/* @__PURE__ */ jsx(Printer, { className: "size-4" }), t("cashier.printReceipt")]
				})] })
			]
		})
	});
}
function esc(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// src/components/cashier/RefundDialog.tsx
function RefundDialog({ open, onOpenChange, orders, currency, onRefunded }) {
	const { t } = useI18n();
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState("");
	const [qtyByLine, setQtyByLine] = useState({});
	const [reason, setReason] = useState("");
	const [busy, setBusy] = useState(false);
	const reset = () => {
		setQuery("");
		setSelectedId("");
		setQtyByLine({});
		setReason("");
	};
	useEffect(() => {
		if (!open) reset();
	}, [open]);
	const matches = useMemo(() => {
		const q = query.trim().toLowerCase();
		return orders.filter((o) => !q ? true : `${o.id} ${o.customerName} ${o.phone}`.toLowerCase().includes(q)).slice(0, 12);
	}, [orders, query]);
	const selected = orders.find((o) => o.id === selectedId) ?? null;
	const chosen = useMemo(() => {
		if (!selected) return [];
		return selected.items.map((line, index) => ({
			...line,
			index,
			qty: qtyByLine[index] ?? 0
		})).filter((line) => line.qty > 0);
	}, [selected, qtyByLine]);
	const orderSubtotal = selected ? selected.items.reduce((n, i) => n + (Number(i.price) || 0) * i.qty, 0) : 0;
	const chosenSubtotal = chosen.reduce((n, i) => n + (Number(i.price) || 0) * i.qty, 0);
	const discountShare = orderSubtotal > 0 ? (Number(selected?.discountAmount) || 0) * chosenSubtotal / orderSubtotal : 0;
	const refundAmount = Math.max(0, Math.round((chosenSubtotal - discountShare) * 100) / 100);
	const setQty = (index, qty, max) => {
		setQtyByLine((prev) => ({
			...prev,
			[index]: Math.min(max, Math.max(0, qty))
		}));
	};
	const fullRefund = () => {
		if (!selected) return;
		setQtyByLine(Object.fromEntries(selected.items.map((line, i) => [i, line.qty])));
	};
	const submit = async () => {
		if (!selected || chosen.length === 0 || busy) return;
		setBusy(true);
		try {
			const isFull = selected.items.every((line, i) => (qtyByLine[i] ?? 0) === line.qty);
			const result = await api.post(`/orders/${selected.id}/refund`, {
				reason: reason.trim(),
				items: isFull ? [] : chosen.map((line) => ({
					id: line.id,
					qty: line.qty
				}))
			});
			toast.success(t("cashier.refundDone", { amount: formatPrice(result.refundedAmount, currency) }));
			onRefunded();
			onOpenChange(false);
		} catch (err) {
			const message = err instanceof Error && err.message ? err.message : t("dash.toast.error");
			toast.error(message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Undo2, { className: "size-5 text-primary" }), t("cashier.refundTitle")]
				}), /* @__PURE__ */ jsx(DialogDescription, { children: t("cashier.refundDesc") })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: t("cashier.refundSearch"),
								className: "pl-9"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "max-h-44 space-y-1.5 overflow-y-auto pr-1",
							children: matches.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "py-6 text-center text-sm text-muted-foreground",
								children: t("cashier.refundNoOrders")
							}) : matches.map((order) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									setSelectedId(order.id);
									setQtyByLine({});
								},
								className: cn("flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-start transition-all", selectedId === order.id ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"),
								children: [/* @__PURE__ */ jsxs("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1.5 text-sm font-semibold",
										children: [/* @__PURE__ */ jsx(ReceiptText, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ jsx("span", {
											className: "truncate font-mono",
											children: order.id
										})]
									}), /* @__PURE__ */ jsxs("span", {
										className: "mt-0.5 block truncate text-xs text-muted-foreground",
										children: [order.customerName, order.phone ? ` · ${order.phone}` : ""]
									})]
								}), /* @__PURE__ */ jsx("span", {
									className: "shrink-0 text-sm font-bold",
									children: formatPrice(order.total, currency)
								})]
							}, order.id))
						}),
						selected && /* @__PURE__ */ jsxs("div", {
							className: "animate-in fade-in slide-in-from-top-2 space-y-3 duration-300",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
										children: t("cashier.refundLines")
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2 text-xs",
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: fullRefund,
											className: "font-semibold text-primary hover:underline",
											children: t("cashier.refundFull")
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setQtyByLine({}),
											className: "text-muted-foreground hover:underline",
											children: t("cashier.refundClear")
										})]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "max-h-48 space-y-1.5 overflow-y-auto pr-1",
									children: selected.items.map((line, index) => {
										const qty = qtyByLine[index] ?? 0;
										return /* @__PURE__ */ jsxs("div", {
											className: cn("flex items-center gap-2 rounded-xl border p-2.5 transition-colors", qty > 0 ? "border-primary/40 bg-primary/5" : "border-border"),
											children: [/* @__PURE__ */ jsxs("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block truncate text-sm font-medium",
													children: line.name
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-xs text-muted-foreground",
													children: [
														formatPrice(line.price, currency),
														" × ",
														line.qty
													]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(Button, {
														type: "button",
														variant: "outline",
														size: "icon",
														className: "size-7",
														onClick: () => setQty(index, qty - 1, line.qty),
														disabled: qty === 0,
														"aria-label": t("cashier.decrease"),
														children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
													}),
													/* @__PURE__ */ jsx("span", {
														className: "w-6 text-center text-sm font-semibold",
														children: qty
													}),
													/* @__PURE__ */ jsx(Button, {
														type: "button",
														variant: "outline",
														size: "icon",
														className: "size-7",
														onClick: () => setQty(index, qty + 1, line.qty),
														disabled: qty >= line.qty,
														"aria-label": t("cashier.increase"),
														children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
													})
												]
											})]
										}, `${line.id}-${index}`);
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "refund-reason",
										className: "text-xs text-muted-foreground",
										children: t("cashier.refundReason")
									}), /* @__PURE__ */ jsx(Textarea, {
										id: "refund-reason",
										rows: 2,
										value: reason,
										onChange: (e) => setReason(e.target.value),
										placeholder: t("cashier.refundReasonPlaceholder"),
										className: "resize-none"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between rounded-xl bg-muted/60 p-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold",
										children: t("cashier.refundAmount")
									}), /* @__PURE__ */ jsx("span", {
										className: "text-lg font-bold text-primary",
										children: formatPrice(refundAmount, currency)
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: t("cashier.close")
				}), /* @__PURE__ */ jsxs(Button, {
					onClick: submit,
					disabled: !selected || chosen.length === 0 || busy,
					className: "gap-1.5",
					children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(Undo2, { className: "size-4" }), busy ? t("dash.saving") : t("cashier.refundConfirm")]
				})] })
			]
		})
	});
}
// src/components/cashier/ShortcutsDialog.tsx
function ShortcutsDialog({ open, onOpenChange }) {
	const { t } = useI18n();
	const items = [
		{
			combos: "F1",
			label: t("cashier.shortcut.quickAdd")
		},
		{
			combos: "F2",
			label: t("cashier.shortcut.scan")
		},
		{
			combos: "F3",
			label: t("cashier.shortcut.hold")
		},
		{
			combos: "F4",
			label: t("cashier.shortcut.receipt")
		},
		{
			combos: "F5",
			label: t("cashier.shortcut.pay")
		},
		{
			combos: "F8",
			label: t("cashier.shortcut.clear")
		},
		{
			combos: "F9",
			label: t("cashier.shortcut.help")
		},
		{
			combos: "Esc",
			label: t("cashier.shortcut.close")
		}
	];
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-sm",
			children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Keyboard, { className: "size-5" }), t("cashier.keyboardShortcuts")]
			}) }), /* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: items.map((item) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm text-muted-foreground",
						children: item.label
					}), /* @__PURE__ */ jsx("kbd", {
						className: "rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-semibold",
						children: item.combos
					})]
				}, item.label))
			})]
		})
	});
}
// src/components/cashier/types.ts
function itemEffectivePrice(originalPrice, discount) {
	const base = originalPrice;
	const d = discount && discount.type !== "none" ? discount : {
		type: "none",
		value: 0
	};
	if (d.type === "percent") {
		const pct = Math.min(100, Math.max(0, d.value));
		return Math.max(0, base * (1 - pct / 100));
	}
	if (d.type === "fixed") {
		const fixed = Math.min(Math.max(0, d.value), base);
		return Math.max(0, base - fixed);
	}
	return base;
}
function orderDiscountAmount(subtotalAfterItemDiscounts, orderDiscount) {
	const d = orderDiscount && orderDiscount.type !== "none" ? orderDiscount : null;
	if (!d) return 0;
	if (d.type === "percent") return subtotalAfterItemDiscounts * (Math.min(100, Math.max(0, d.value)) / 100);
	if (d.type === "fixed") return Math.min(Math.max(0, d.value), subtotalAfterItemDiscounts);
	return 0;
}
/** Stable, readable id for a held or transient sale. */
function saleId() {
	return `SALE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
// src/routes/cashier.tsx?tsr-split=component
var PAYMENT_METHODS = [{
	value: "cash",
	icon: Banknote,
	title: "checkout.method.cash.title",
	short: "checkout.method.cash.short"
}, {
	value: "instapay",
	icon: Smartphone,
	title: "checkout.method.instapay.title",
	short: "checkout.method.instapay.short"
}];
/** A sale may only be rung up while the signed-in staff member's shift is open today. */
function isCheckedInToday(session) {
	if (!session || session.endedAt || session.date !== clinicTodayISO()) return false;
	const started = new Date(session.startedAt);
	return !Number.isNaN(started.getTime());
}
function CashierPage() {
	const { t } = useI18n();
	const { dark, toggle } = useTheme();
	const [authed, setAuthed] = useState(false);
	const { workSession } = useClinicStore();
	useEffect(() => {
		if (isAuthed()) setAuthed(true);
	}, []);
	const onUnlocked = () => setAuthed(true);
	if (!authed) return /* @__PURE__ */ jsx(StaffAuthGate, {
		onUnlocked,
		showBack: false
	});
	const checkedIn = isCheckedInToday(workSession);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex h-dvh min-h-0 flex-col overflow-hidden bg-[var(--canvas)]",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "relative z-30 shrink-0 border-b border-[var(--navy-700)] bg-[var(--navy-900)] text-white",
			children: [/* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--gold-500)]/55" }), /* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto flex h-12 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "grid size-7 place-items-center rounded-[var(--radius-md)] border border-[var(--gold-500)]/50 text-[var(--gold-400)]",
							children: /* @__PURE__ */ jsx(ScanLine, { className: "size-4" })
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "truncate font-display text-base font-semibold tracking-tight text-white",
							children: t("cashier.title")
						}),
						/* @__PURE__ */ jsx(StatusOrb, {
							tone: checkedIn ? "ok" : "watch",
							size: "sm",
							label: checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed"),
							className: "hidden rounded-[var(--radius-sm)] border border-white/15 bg-white/5 px-2.5 py-1 [&>span:last-child]:text-white/80 sm:inline-flex"
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							asChild: true,
							className: "border-white/20 bg-transparent text-white/85 hover:bg-white/10 hover:text-white",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/dashboard",
								children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4 rtl:rotate-180" }), /* @__PURE__ */ jsx("span", {
									className: "hidden sm:inline",
									children: t("cashier.exit")
								})]
							})
						}),
						/* @__PURE__ */ jsx(LanguageToggle, { className: "text-white/80 hover:bg-white/10 hover:text-white" }),
						/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: toggle,
							"aria-label": dark ? t("header.lightMode") : t("header.darkMode"),
							className: "text-white/70 hover:bg-white/10 hover:text-white",
							children: dark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
						})
					]
				})]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden px-2 pb-2 sm:px-4 sm:pb-3",
			children: /* @__PURE__ */ jsx(CashierApp, {})
		})]
	});
}
function PaymentRequestsCard({ cartLines, onCombined }) {
	const { t } = useI18n();
	const { payments, settings } = useClinicStore();
	const [settling, setSettling] = useState(null);
	const [busyId, setBusyId] = useState(null);
	const pending = payments.filter((p) => p.status === "unpaid");
	const settlingPayment = pending.find((p) => p.id === settling?.id) ?? settling;
	const combineAndSettle = async (p) => {
		if (busyId) return;
		if (cartLines.length === 0) return;
		setBusyId(p.id);
		try {
			await addPaymentItem(p.id, cartLines);
			toast.success(t("cashier.billCombined"));
			await settlePayment(p.id, {
				method: "cash",
				notes: t("cashier.combineLinesHint")
			});
			toast.success(t("cashier.billSettled"));
			refreshClinicData();
			onCombined();
		} catch (err) {
			const message = err instanceof Error && err.message ? err.message : "";
			toast.error(message || t("dash.toast.error"));
		} finally {
			setBusyId(null);
		}
	};
	if (pending.length === 0) return null;
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
		className: "pb-3",
		children: [/* @__PURE__ */ jsxs(CardTitle, {
			className: "flex items-center gap-2 text-base",
			children: [/* @__PURE__ */ jsx(ReceiptText, { className: "size-4 text-muted-foreground" }), t("cashier.paymentRequests")]
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: t("cashier.paymentRequestsDesc")
		})]
	}), /* @__PURE__ */ jsxs(CardContent, {
		className: "space-y-3",
		children: [pending.map((p) => /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-border p-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "truncate text-sm font-semibold",
							children: p.title
						}),
						p.client?.fullName && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: p.client.fullName
						}),
						p.items && p.items.length > 0 && /* @__PURE__ */ jsx("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
							children: p.items.map((it) => it.label).join(" · ")
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-end",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-base font-bold",
						children: formatPrice(p.amount, settings.currency)
					}), /* @__PURE__ */ jsx(PaymentKindBadge, { kind: p.kind })]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "sm",
					variant: "outline",
					className: "h-7 flex-1",
					disabled: busyId === p.id,
					onClick: () => setSettling(p),
					children: t("cashier.settleVisit")
				}), /* @__PURE__ */ jsx(Button, {
					size: "sm",
					className: "h-7 flex-1",
					disabled: cartLines.length === 0 || busyId !== null,
					onClick: () => combineAndSettle(p),
					children: busyId === p.id ? t("dash.saving") : t("cashier.combineLine", { count: String(cartLines.length) })
				})]
			})]
		}, p.id)), settlingPayment && /* @__PURE__ */ jsx(PaymentSettleDialog, {
			payment: settlingPayment,
			onClose: () => {
				setSettling(null);
				refreshClinicData();
			}
		})]
	})] });
}
function computeTotals(cart, itemDiscounts, orderDiscount) {
	const subtotal = cart.reduce((n, i) => n + i.originalPrice * i.qty, 0);
	const itemDiscount = cart.reduce((n, i) => {
		const eff = itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]);
		return n + (i.originalPrice - eff) * i.qty;
	}, 0);
	const subtotalAfterItems = subtotal - itemDiscount;
	const orderDiscountAmt = orderDiscountAmount(subtotalAfterItems, orderDiscount);
	return {
		subtotal,
		itemDiscount,
		subtotalAfterItems,
		orderDiscountAmt,
		total: Math.max(0, subtotalAfterItems - orderDiscountAmt)
	};
}
function reduceCartForSubmission(cart, itemDiscounts) {
	return cart.map((i) => ({
		id: i.id,
		name: i.name,
		price: Math.round(itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]) * 100) / 100,
		qty: i.qty
	}));
}
function ShiftRequiredGate() {
	const { t } = useI18n();
	const [busy, setBusy] = useState(false);
	const startShift = async () => {
		if (busy) return;
		setBusy(true);
		try {
			await checkIn();
			await refreshClinicData();
			toast.success(t("cashier.shiftStarted"));
		} catch (err) {
			toast.error(apiErrorMessage(err, t("dash.toast.error")));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[70vh] items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-[var(--radius-2xl)] border border-status-watch/25 bg-[var(--status-watch-bg)] p-8 text-center shadow-[var(--shadow-2)]",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--panel-bg-solid)] text-status-watch-ink ring-1 ring-status-watch/20",
					children: /* @__PURE__ */ jsx(LogIn, { className: "size-6" })
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-lg font-bold",
					children: t("cashier.checkInRequired")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("cashier.checkInRequiredDesc")
				}),
				/* @__PURE__ */ jsx(Button, {
					onClick: startShift,
					disabled: busy,
					className: "mt-6 w-full shadow-glow",
					children: busy ? t("dash.saving") : t("cashier.checkInNow")
				})
			]
		})
	});
}
function CashierApp() {
	const { t } = useI18n();
	const { products, services, orders, settings, workSession, workSessionLoading } = useClinicStore();
	const [cart, setCart] = useState([]);
	const [itemDiscounts, setItemDiscounts] = useState({});
	const [orderDiscount, setOrderDiscount] = useState({
		type: "none",
		value: 0
	});
	const [customer, setCustomer] = useState({
		name: "",
		phone: ""
	});
	const [method, setMethod] = useState("cash");
	const [holdSales, setHoldSales] = useState([]);
	const [split, setSplit] = useState([]);
	const [cashReceived, setCashReceived] = useState(0);
	const [busy, setBusy] = useState(false);
	const [shortcutsOpen, setShortcutsOpen] = useState(false);
	const [receiptOpen, setReceiptOpen] = useState(false);
	const [refundOpen, setRefundOpen] = useState(false);
	const [discountOpen, setDiscountOpen] = useState(false);
	const [lastScanned, setLastScanned] = useState(null);
	const [result, setResult] = useState(null);
	const [activeTab, setActiveTab] = useState("scan");
	const barcodeInputRef = useRef(null);
	const [barcodeInput, setBarcodeInput] = useState("");
	const [barcodeBuffer, setBarcodeBuffer] = useState("");
	const [barcodeTimeout, setBarcodeTimeout] = useState(null);
	const totals = useMemo(() => computeTotals(cart, itemDiscounts, orderDiscount), [
		cart,
		itemDiscounts,
		orderDiscount
	]);
	const itemCount = cart.reduce((n, i) => n + i.qty, 0);
	const checkedIn = isCheckedInToday(workSession);
	const cartLines = cart.map((i) => ({
		label: i.name,
		amount: Math.round(itemEffectivePrice(i.originalPrice, itemDiscounts[i.id]) * i.qty * 100) / 100,
		kind: "product",
		referenceId: i.id
	}));
	const addProduct = useCallback((product, qty = 1) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.id === product.id);
			if (existing) {
				if (existing.qty + qty > product.stock) {
					toast.error(t("cashier.maxStockReached", {
						name: product.name,
						stock: String(product.stock)
					}));
					return prev;
				}
				return prev.map((i) => i.id === product.id ? {
					...i,
					qty: i.qty + qty
				} : i);
			}
			if (product.stock <= 0) {
				toast.error(t("cashier.outOfStock", { name: product.name }));
				return prev;
			}
			return [...prev, {
				id: product.id,
				productId: product.id,
				name: product.name,
				price: product.price,
				originalPrice: product.price,
				qty,
				stock: product.stock,
				image: product.image
			}];
		});
		setLastScanned(product.id);
		setTimeout(() => setLastScanned(null), 700);
	}, [t]);
	const addService = useCallback((service, amount, note) => {
		const baseName = service.title.trim() || t("cashier.clinicService");
		const price = Math.max(0, amount);
		const id = `service-${service.slug}`;
		const name = note ? `${baseName} — ${note}` : baseName;
		setCart((prev) => {
			if (prev.find((i) => i.id === id)) return prev.map((i) => i.id === id ? {
				...i,
				qty: i.qty + 1,
				name
			} : i);
			return [...prev, {
				id,
				productId: id,
				name,
				price,
				originalPrice: price,
				qty: 1,
				stock: Number.MAX_SAFE_INTEGER,
				image: ""
			}];
		});
		setLastScanned(id);
		setTimeout(() => setLastScanned(null), 700);
		toast.success(t("cashier.added", { name: baseName }));
	}, [t]);
	const processBarcode = useCallback((code) => {
		const clean = code.trim();
		if (!clean) return;
		const product = products.find((p) => p.barcode === clean);
		if (!product) {
			toast.error(t("cashier.productNotFound", { code: clean }));
			return;
		}
		if (product.stock <= 0) {
			toast.error(t("cashier.outOfStock", { name: product.name }));
			return;
		}
		addProduct(product);
		toast.success(t("cashier.added", { name: product.name }));
	}, [
		products,
		t,
		addProduct
	]);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "Enter") {
				e.preventDefault();
				processBarcode(barcodeBuffer);
				setBarcodeBuffer("");
				if (barcodeTimeout) clearTimeout(barcodeTimeout);
				return;
			}
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
				setBarcodeBuffer((prev) => prev + e.key);
				if (barcodeTimeout) clearTimeout(barcodeTimeout);
				setBarcodeTimeout(setTimeout(() => setBarcodeBuffer(""), 200));
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (barcodeTimeout) clearTimeout(barcodeTimeout);
		};
	}, [
		barcodeBuffer,
		barcodeTimeout,
		processBarcode
	]);
	useEffect(() => {
		const onKey = (e) => {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			switch (e.key) {
				case "F1":
					e.preventDefault();
					setActiveTab("quick");
					break;
				case "F2":
					e.preventDefault();
					setActiveTab("scan");
					barcodeInputRef.current?.focus();
					break;
				case "F3":
					e.preventDefault();
					holdCurrentSale();
					break;
				case "F4":
					e.preventDefault();
					if (cart.length > 0) setReceiptOpen(true);
					break;
				case "F8":
					e.preventDefault();
					clearCart();
					break;
				case "F9":
					e.preventDefault();
					setShortcutsOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		cart,
		itemDiscounts,
		orderDiscount,
		customer,
		method,
		holdSales
	]);
	const clearCart = () => {
		setCart([]);
		setItemDiscounts({});
		setOrderDiscount({
			type: "none",
			value: 0
		});
		setCustomer({
			name: "",
			phone: ""
		});
	};
	const holdCurrentSale = () => {
		if (cart.length === 0) return;
		const held = {
			id: saleId(),
			label: customer.name ? customer.name : t("cashier.saleDefault", { n: String(holdSales.length + 1) }),
			heldAt: Date.now(),
			cart,
			itemDiscounts,
			orderDiscount,
			customer,
			paymentMethod: method
		};
		setHoldSales((prev) => [held, ...prev]);
		clearCart();
		toast.success(t("cashier.saleHeld"));
	};
	const resumeSale = (id) => {
		const held = holdSales.find((h) => h.id === id);
		if (!held) return;
		setCart(held.cart);
		setItemDiscounts(held.itemDiscounts);
		setOrderDiscount(held.orderDiscount);
		setCustomer(held.customer);
		setMethod(held.paymentMethod);
		setSplit([]);
		setCashReceived(0);
		setHoldSales((prev) => prev.filter((h) => h.id !== id));
		toast.success(t("cashier.saleResumed"));
	};
	const discardHeld = (id) => {
		setHoldSales((prev) => prev.filter((h) => h.id !== id));
		toast.info(t("cashier.saleDiscarded"));
	};
	const updateQty = (productId, delta) => {
		setCart((prev) => prev.map((i) => {
			if (i.id !== productId) return i;
			const newQty = i.qty + delta;
			if (newQty <= 0) return null;
			if (newQty > i.stock) {
				toast.error(t("cashier.maxStockReached", {
					name: i.name,
					stock: String(i.stock)
				}));
				return i;
			}
			return {
				...i,
				qty: newQty
			};
		}).filter(Boolean));
	};
	const removeItem = (productId) => {
		setCart((prev) => prev.filter((i) => i.id !== productId));
		setItemDiscounts((prev) => {
			const next = { ...prev };
			delete next[productId];
			return next;
		});
	};
	const submit = async () => {
		if (busy) return;
		if (cart.length === 0) {
			toast.error(t("cashier.emptyCart"));
			return;
		}
		const total = totals.total;
		const selectedMethod = split[0]?.method ?? method;
		if (split.length > 0) {
			const allocated = split.reduce((n, a) => n + a.amount, 0);
			if (Math.abs(allocated - total) >= .005) {
				toast.error(t("cashier.splitNotComplete"));
				return;
			}
			if (!usesSinglePaymentMethod(split)) {
				toast.error(t("cashier.singleMethodOnly"));
				return;
			}
		}
		if (selectedMethod === "instapay" && !settings.instapay) {
			toast.error(t("checkout.instapayNotConfigured"));
			return;
		}
		setBusy(true);
		try {
			const items = reduceCartForSubmission(cart, itemDiscounts);
			const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;
			const paymentMethod = selectedMethod;
			const cashReceivedAtCounter = paymentMethod === "cash";
			const order = await createOrder({
				customerName: customer.name.trim() || t("cashier.walkInCustomer"),
				phone: customer.phone.trim(),
				email: "",
				address: "",
				items,
				paymentMethod,
				source: "pos",
				cashReceived: cashReceivedAtCounter,
				...cashReceivedAtCounter ? { cashReceivedAmount: total } : {},
				discountAmount,
				discountLabel: orderDiscount.type !== "none" ? orderDiscount.type === "percent" ? t("cashier.percentOff", { value: String(orderDiscount.value) }) : t("cashier.discountOrder") : ""
			});
			setResult({
				id: order.id,
				paymentMethod: order.paymentMethod
			});
			clearCart();
			setSplit([]);
			setCashReceived(0);
			toast.success(t("cashier.orderCreated", { id: order.id }));
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			if (message) toast.error(message);
			else toast.error(t("cashier.failed"));
		} finally {
			setBusy(false);
		}
	};
	if (workSessionLoading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-[50vh] place-items-center text-sm text-muted-foreground",
		children: t("dash.loading")
	});
	if (!isCheckedInToday(workSession)) return /* @__PURE__ */ jsx(ShiftRequiredGate, {});
	if (result) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center min-h-[50vh] space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "size-16 grid place-items-center rounded-2xl bg-success/15 text-success animate-in zoom-in-95",
				children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8" })
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold",
				children: t("cashier.successTitle")
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground",
				children: t("cashier.successDesc")
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "font-mono text-lg",
				children: [
					t("cashier.orderId"),
					": ",
					result.id
				]
			}),
			result.paymentMethod === "cash" ? /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-success/25 bg-success/10 p-4 text-center text-sm text-success",
				children: t("cashier.cashReceivedNotice")
			}) : /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-status-watch/25 bg-[var(--status-watch-bg)] p-4 text-center text-sm font-medium text-status-watch-ink",
				children: t("cashier.paymentPendingNotice")
			}),
			/* @__PURE__ */ jsx(Button, {
				size: "lg",
				onClick: () => setResult(null),
				className: "w-full max-w-xs",
				children: t("cashier.newSale")
			})
		]
	});
	const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex h-full min-h-0 flex-col gap-2 overflow-hidden p-2 sm:p-3",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "relative shrink-0 animate-in fade-in slide-in-from-top-3 rounded-[var(--radius-lg)] border border-[var(--line)] border-t-2 border-t-[var(--gold-500)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)] duration-500 sm:p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex flex-wrap items-center gap-x-3 gap-y-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-[110px]",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint",
									children: t("cashier.total")
								}),
								/* @__PURE__ */ jsx("p", {
									className: "font-data text-2xl font-black leading-tight tabular-nums tracking-tight text-foreground sm:text-3xl",
									children: formatPrice(totals.total, settings.currency)
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "font-mono text-[11px] text-ink-soft",
									children: [
										itemCount,
										" ",
										t("cashier.items").toLowerCase()
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", { className: "hidden h-12 w-px bg-[var(--line)] sm:block" }),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-1",
							children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									setMethod(m.value);
									setSplit([]);
								},
								"aria-pressed": method === m.value,
								title: t(m.short),
								className: cn("flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs font-semibold transition-colors sm:px-2.5 sm:py-2", method === m.value ? "bg-[var(--navy-900)] text-[var(--gold-400)] shadow-[var(--shadow-1)]" : "text-ink-soft hover:bg-[var(--surface)] hover:text-foreground"),
								children: [/* @__PURE__ */ jsx(m.icon, { className: "size-4" }), /* @__PURE__ */ jsx("span", {
									className: "hidden xl:inline",
									children: t(m.short)
								})]
							}, m.value))
						}),
						method === "cash" && split.length <= 1 && /* @__PURE__ */ jsx("div", {
							className: "hidden md:block",
							children: /* @__PURE__ */ jsx(QuickCashCalculator, {
								total: totals.total,
								currency: settings.currency,
								received: cashReceived,
								onReceivedChange: setCashReceived,
								onCashReceivedChange: setCashReceived
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ms-auto flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									onClick: () => setRefundOpen(true),
									title: t("cashier.refund"),
									"aria-label": t("cashier.refund"),
									className: "hidden text-ink-soft hover:bg-primary-tint hover:text-primary-strong sm:inline-flex",
									children: /* @__PURE__ */ jsx(Undo2, { className: "size-4" })
								}),
								/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									onClick: () => setReceiptOpen(true),
									disabled: cart.length === 0,
									title: t("cashier.receiptPreview"),
									"aria-label": t("cashier.receiptPreview"),
									className: "hidden text-ink-soft hover:bg-primary-tint hover:text-primary-strong sm:inline-flex",
									children: /* @__PURE__ */ jsx(ReceiptText, { className: "size-4" })
								}),
								/* @__PURE__ */ jsxs(Button, {
									type: "button",
									onClick: submit,
									size: "lg",
									disabled: busy || cart.length === 0,
									className: "h-10 gap-2 rounded-[var(--radius-md)] px-3 sm:h-11 sm:px-5",
									children: [/* @__PURE__ */ jsx(Wallet, { className: "size-4" }), busy ? "…" : t("cashier.completeSale")]
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-2 flex flex-wrap items-end gap-x-3 gap-y-2 border-t pt-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 items-end gap-2 sm:flex-none",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "cashier-customer-name",
								className: "font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint",
								children: t("cashier.customerName")
							}), /* @__PURE__ */ jsx(Input, {
								id: "cashier-customer-name",
								value: customer.name,
								onChange: (e) => setCustomer((prev) => ({
									...prev,
									name: e.target.value
								})),
								placeholder: t("cashier.customerNamePlaceholder"),
								className: "h-8 w-full min-w-0 flex-1 text-xs sm:w-36 sm:flex-none",
								autoComplete: "off"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "cashier-customer-phone",
								className: "font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint",
								children: t("cashier.customerPhone")
							}), /* @__PURE__ */ jsx(Input, {
								id: "cashier-customer-phone",
								value: customer.phone,
								onChange: (e) => setCustomer((prev) => ({
									...prev,
									phone: e.target.value
								})),
								placeholder: t("cashier.customerPhonePlaceholder"),
								className: "h-8 w-full min-w-0 flex-1 text-xs sm:w-40 sm:flex-none",
								inputMode: "tel",
								autoComplete: "off"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mb-1 flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-soft sm:w-auto sm:flex-1",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5 font-semibold",
								children: [/* @__PURE__ */ jsx(StatusOrb, {
									tone: checkedIn ? "ok" : "watch",
									size: "sm"
								}), checkedIn ? t("cashier.shiftOpen") : t("cashier.shiftClosed")]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "hidden sm:inline",
								children: [
									t("cashier.subtotal"),
									": ",
									formatPrice(totals.subtotal, settings.currency)
								]
							}),
							discountAmount > 0 && /* @__PURE__ */ jsxs("span", {
								className: "hidden font-semibold text-destructive sm:inline",
								children: ["−", formatPrice(discountAmount, settings.currency)]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setShortcutsOpen(true),
								className: "ms-auto hidden items-center gap-1 transition-colors hover:text-foreground sm:flex",
								children: [/* @__PURE__ */ jsx(Keyboard, { className: "size-3.5" }), t("cashier.keyboardShortcuts")]
							})
						]
					})]
				})]
			}),
			method === "instapay" && /* @__PURE__ */ jsxs("p", {
				className: "shrink-0 rounded-xl border border-primary/25 bg-primary-tint px-3 py-1.5 text-xs",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-primary-strong",
						children: t("checkout.method.instapay.short")
					}),
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-mono font-bold",
						children: settings.instapay
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ms-2 text-status-watch-ink",
						children: t("cashier.paymentPendingNotice")
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2 md:grid-cols-[minmax(0,1fr)_340px] md:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]",
				children: [/* @__PURE__ */ jsx(Card, {
					className: "animate-in flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] duration-500 slide-in-from-left-3",
					children: /* @__PURE__ */ jsxs(Tabs, {
						value: activeTab,
						onValueChange: setActiveTab,
						className: "flex min-h-0 flex-1 flex-col",
						children: [/* @__PURE__ */ jsxs(CardHeader, {
							className: "shrink-0 gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] p-3 sm:p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid size-9 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)]",
									children: /* @__PURE__ */ jsx(Grid2X2, { className: "size-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-sm",
										children: t("cashier.addProducts")
									}), /* @__PURE__ */ jsx("p", {
										className: "truncate text-[11px] text-ink-soft",
										children: t("cashier.scanPlaceholder")
									})]
								})]
							}), /* @__PURE__ */ jsxs(TabsList, {
								className: "grid w-full grid-cols-3",
								children: [
									/* @__PURE__ */ jsxs(TabsTrigger, {
										value: "scan",
										className: "gap-1.5",
										children: [/* @__PURE__ */ jsx(Barcode, { className: "size-4" }), t("cashier.scanBarcode")]
									}),
									/* @__PURE__ */ jsxs(TabsTrigger, {
										value: "quick",
										className: "gap-1.5",
										children: [/* @__PURE__ */ jsx(Grid2X2, { className: "size-4" }), t("cashier.quickAdd")]
									}),
									/* @__PURE__ */ jsxs(TabsTrigger, {
										value: "service",
										className: "gap-1.5",
										children: [/* @__PURE__ */ jsx(Stethoscope, { className: "size-4" }), t("cashier.clinicService")]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs(CardContent, {
							className: "min-h-0 flex-1 overflow-y-auto p-3",
							children: [
								/* @__PURE__ */ jsxs(TabsContent, {
									value: "scan",
									className: "mt-0 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx(Input, {
												ref: barcodeInputRef,
												type: "text",
												value: barcodeInput,
												onChange: (e) => setBarcodeInput(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														const val = barcodeInputRef.current?.value ?? "";
														if (val) processBarcode(val);
														setBarcodeInput("");
													}
												},
												placeholder: t("cashier.scanPlaceholder"),
												className: "h-11 flex-1 text-base",
												autoComplete: "off",
												autoFocus: activeTab === "scan"
											}), /* @__PURE__ */ jsx(Button, {
												type: "button",
												size: "icon",
												className: "size-11 shrink-0",
												onClick: () => {
													const val = barcodeInputRef.current?.value ?? "";
													if (val) processBarcode(val);
													setBarcodeInput("");
												},
												"aria-label": t("cashier.scanPlaceholder"),
												children: /* @__PURE__ */ jsx(Search, { className: "size-4" })
											})]
										}),
										/* @__PURE__ */ jsxs(Collapsible, { children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
											asChild: true,
											children: /* @__PURE__ */ jsxs(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ jsx(ScanLine, { className: "size-4" }), t("cashier.phoneScanner")]
											})
										}), /* @__PURE__ */ jsx(CollapsibleContent, {
											className: "pt-3",
											children: /* @__PURE__ */ jsx(PhoneScannerMode, { onScan: processBarcode })
										})] }),
										/* @__PURE__ */ jsx(ScannerStatus, {})
									]
								}),
								/* @__PURE__ */ jsx(TabsContent, {
									value: "quick",
									className: "mt-0",
									children: /* @__PURE__ */ jsx(QuickAddGrid, {
										products,
										cart,
										currency: settings.currency,
										onAdd: (p) => addProduct(p)
									})
								}),
								/* @__PURE__ */ jsx(TabsContent, {
									value: "service",
									className: "mt-0",
									children: /* @__PURE__ */ jsx(ClinicServicePanel, {
										services,
										currency: settings.currency,
										onAdd: addService
									})
								})
							]
						})]
					})
				}), /* @__PURE__ */ jsxs(Card, {
					className: "animate-in flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border-t-2 border-t-[var(--gold-500)] border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-1)] duration-500 slide-in-from-right-3",
					children: [
						/* @__PURE__ */ jsxs(CardHeader, {
							className: "flex shrink-0 flex-row items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] p-3 sm:p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid size-9 place-items-center rounded-[var(--radius-md)] bg-[var(--navy-900)] text-[var(--gold-400)]",
									children: /* @__PURE__ */ jsx(ShoppingCart, { className: "size-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
									className: "text-sm",
									children: t("cashier.cart", { count: String(itemCount) })
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground",
									children: cart.length === 0 ? t("cashier.emptyCart") : `${cart.length} ${t("cashier.items").toLowerCase()}`
								})] })]
							}), cart.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									onClick: holdCurrentSale,
									title: t("cashier.holdSale"),
									"aria-label": t("cashier.holdSale"),
									children: /* @__PURE__ */ jsx(PackagePlus, { className: "size-4" })
								}), /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									onClick: clearCart,
									className: "text-destructive",
									title: t("cashier.clearCart"),
									"aria-label": t("cashier.clearCart"),
									children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
								})]
							})]
						}),
						/* @__PURE__ */ jsxs(CardContent, {
							className: "min-h-0 flex-1 space-y-2 overflow-y-auto p-2",
							children: [
								holdSales.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
									className: "p-2.5",
									children: /* @__PURE__ */ jsx(CardTitle, {
										className: "text-sm",
										children: t("cashier.heldSales")
									})
								}), /* @__PURE__ */ jsx(CardContent, {
									className: "pt-0",
									children: /* @__PURE__ */ jsx(HoldManager, {
										heldSales: holdSales,
										currency: settings.currency,
										onHold: holdCurrentSale,
										onResume: resumeSale,
										onDiscard: discardHeld,
										canHold: cart.length > 0
									})
								})] }),
								/* @__PURE__ */ jsx(PaymentRequestsCard, {
									cartLines,
									onCombined: clearCart
								}),
								cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-muted-foreground",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid size-16 place-items-center rounded-2xl bg-muted",
										children: /* @__PURE__ */ jsx(ShoppingCart, { className: "size-7 opacity-50" })
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: t("cashier.emptyCart")
									})]
								}) : /* @__PURE__ */ jsx("div", {
									className: "space-y-2",
									children: cart.map((item) => {
										const disc = itemDiscounts[item.id];
										const eff = itemEffectivePrice(item.originalPrice, disc);
										const hasDisc = disc && disc.type !== "none";
										return /* @__PURE__ */ jsxs("div", {
											className: cn("group rounded-xl border p-2.5 transition-all", lastScanned === item.id ? "border-[var(--gold-500)] bg-[var(--gold-tint)]" : "bg-[var(--surface-2)] hover:border-[var(--gold-500)]/50"),
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex gap-2.5",
												children: [item.image ? /* @__PURE__ */ jsx("img", {
													src: item.image,
													alt: item.name,
													className: "size-12 shrink-0 rounded-lg border bg-muted object-contain p-0.5"
												}) : /* @__PURE__ */ jsx("div", {
													className: "grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground",
													children: /* @__PURE__ */ jsx(Package, { className: "size-5 opacity-50" })
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-start justify-between gap-2",
														children: [/* @__PURE__ */ jsx("p", {
															className: "truncate text-sm font-semibold",
															children: item.name
														}), /* @__PURE__ */ jsx("p", {
															className: "shrink-0 text-sm font-bold tabular-nums",
															children: formatPrice(eff * item.qty, settings.currency)
														})]
													}), /* @__PURE__ */ jsxs("p", {
														className: "mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground",
														children: [
															formatPrice(eff, settings.currency),
															" × ",
															item.qty,
															hasDisc && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
																className: "line-through",
																children: formatPrice(item.originalPrice, settings.currency)
															}), /* @__PURE__ */ jsx(Badge, {
																variant: "outline",
																className: "px-1 py-0 text-[9px]",
																children: disc?.type === "percent" ? `${disc.value}%` : `-${disc?.value}`
															})] })
														]
													})]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "mt-2 flex items-center justify-between gap-1",
												children: [/* @__PURE__ */ jsx(PerItemDiscount, {
													price: item.originalPrice,
													qty: item.qty,
													stock: item.stock,
													discount: itemDiscounts[item.id],
													onChange: (d) => setItemDiscounts((prev) => ({
														...prev,
														[item.id]: d
													}))
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ jsx(Button, {
															variant: "outline",
															size: "icon",
															className: "size-7",
															onClick: () => updateQty(item.id, -1),
															disabled: item.qty <= 1,
															"aria-label": t("cashier.decrease"),
															children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
														}),
														/* @__PURE__ */ jsx("span", {
															className: "w-6 text-center text-sm font-bold tabular-nums",
															children: item.qty
														}),
														/* @__PURE__ */ jsx(Button, {
															variant: "outline",
															size: "icon",
															className: "size-7",
															onClick: () => updateQty(item.id, 1),
															disabled: item.qty >= item.stock,
															"aria-label": t("cashier.increase"),
															children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
														}),
														/* @__PURE__ */ jsx(Button, {
															variant: "ghost",
															size: "icon",
															className: "size-7 text-destructive",
															onClick: () => removeItem(item.id),
															"aria-label": t("cashier.remove"),
															children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
														})
													]
												})]
											})]
										}, item.id);
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs(CardFooter, {
							className: "flex shrink-0 flex-col gap-2 border-t bg-background/40 p-2.5 sm:p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "w-full space-y-1 text-xs",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: t("cashier.subtotal")
										}), /* @__PURE__ */ jsx("span", {
											className: "tabular-nums",
											children: formatPrice(totals.subtotal, settings.currency)
										})]
									}),
									totals.itemDiscount > 0 && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between text-destructive",
										children: [/* @__PURE__ */ jsx("span", { children: t("cashier.itemDiscounts") }), /* @__PURE__ */ jsxs("span", {
											className: "tabular-nums",
											children: ["−", formatPrice(totals.itemDiscount, settings.currency)]
										})]
									}),
									totals.orderDiscountAmt > 0 && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between text-destructive",
										children: [/* @__PURE__ */ jsx("span", { children: t("cashier.discountApplied") }), /* @__PURE__ */ jsxs("span", {
											className: "tabular-nums",
											children: ["−", formatPrice(totals.orderDiscountAmt, settings.currency)]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "w-full space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs(Collapsible, {
										open: discountOpen,
										onOpenChange: setDiscountOpen,
										children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
											asChild: true,
											children: /* @__PURE__ */ jsxs(Button, {
												variant: "outline",
												size: "sm",
												className: "w-full justify-between font-medium",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx(BadgePercent, { className: "size-4 text-muted-foreground" }),
														t("cashier.discount"),
														discountAmount > 0 && /* @__PURE__ */ jsxs("span", {
															className: "text-primary",
															children: ["−", formatPrice(discountAmount, settings.currency)]
														})
													]
												}), /* @__PURE__ */ jsx(ChevronDown, { className: cn("size-4 text-muted-foreground transition-transform", discountOpen && "rotate-180") })]
											})
										}), /* @__PURE__ */ jsx(CollapsibleContent, {
											className: "pt-2",
											children: /* @__PURE__ */ jsx(DiscountPanel, {
												orderDiscount,
												subtotal: totals.subtotalAfterItems,
												currency: settings.currency,
												onApplyOrderDiscount: setOrderDiscount
											})
										})]
									}),
									/* @__PURE__ */ jsx(SplitPayment, {
										total: totals.total,
										currency: settings.currency,
										method,
										allocations: split,
										onAllocationsChange: (a) => setSplit(a),
										onMethodChange: setMethod
									}),
									method === "cash" && split.length <= 1 && /* @__PURE__ */ jsx("div", {
										className: "md:hidden",
										children: /* @__PURE__ */ jsx(QuickCashCalculator, {
											total: totals.total,
											currency: settings.currency,
											received: cashReceived,
											onReceivedChange: setCashReceived,
											onCashReceivedChange: setCashReceived
										})
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(ReceiptPreview, {
				open: receiptOpen,
				onOpenChange: setReceiptOpen,
				settings: {
					name: settings.name,
					phone: settings.phone,
					address: settings.address
				},
				customer,
				cart,
				itemDiscounts,
				orderDiscount,
				currency: settings.currency
			}),
			/* @__PURE__ */ jsx(RefundDialog, {
				open: refundOpen,
				onOpenChange: setRefundOpen,
				orders,
				currency: settings.currency,
				onRefunded: refreshClinicData
			}),
			/* @__PURE__ */ jsx(ShortcutsDialog, {
				open: shortcutsOpen,
				onOpenChange: setShortcutsOpen
			})
		]
	});
}
export { CashierPage as component };
