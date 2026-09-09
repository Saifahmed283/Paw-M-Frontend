import { A as useClinicStore, mt as cn, o as createOrder, pt as useI18n, st as Button } from "./clinic-store-ClM7VlKI.js";
import { b as PawMMark, v as formatPrice } from "./router-DV27YO-0.js";
import { t as Input } from "./input-BRZDssNB.js";
import { t as Label } from "./label-BG5ltDDz.js";
import { a as CardHeader, n as Card, o as CardTitle, r as CardContent, t as Separator } from "./separator-HwmV8sSn.js";
import { t as Badge } from "./badge-CwBph07w.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DbqrWUW3.js";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Archive, ArrowLeftRight, BadgePercent, Banknote, Barcode, CheckCircle2, ChevronDown, ChevronLeft, Clock, Coins, Grid2X2, ImagePlus, Keyboard, Landmark, Loader2, Minus, PackagePlus, PauseCircle, Percent, PlayCircle, Plus, Printer, ReceiptText, ScanLine, Search, ShoppingCart, SlidersHorizontal, Smartphone, Square, Trash2, TriangleAlert, UserRound, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as PopoverPrimitive from "@radix-ui/react-popover";
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/collapsible.tsx
var Collapsible = CollapsiblePrimitive.Root;
var CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
var CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
//#endregion
//#region src/components/cashier/PhoneScannerMode.tsx
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
var DECODE_DELAY_MS = 200;
var DEDUP_MS = 2500;
var MAX_IMAGE_DIM = 1920;
var MAX_PHOTO_DIM = 3840;
var IMAGE_LOAD_TIMEOUT_MS = 1e4;
var DECODE_TIMEOUT_MS = 2e4;
var CAMERA_LOOP_INTERVAL_MS = 200;
var CAMERA_MAX_RETRIES = 3;
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
	const streamRef = useRef(null);
	const readerRef = useRef(null);
	const lastScanRef = useRef(null);
	const photoInputRef = useRef(null);
	const loopTimerRef = useRef(null);
	const retryCountRef = useRef(0);
	const onScanRef = useRef(onScan);
	onScanRef.current = onScan;
	const [cameraActive, setCameraActive] = useState(false);
	const [cameraError, setCameraError] = useState(null);
	const [photoBusy, setPhotoBusy] = useState(false);
	const [photoResult, setPhotoResult] = useState(null);
	const stopCamera = useCallback(() => {
		if (loopTimerRef.current) {
			clearTimeout(loopTimerRef.current);
			loopTimerRef.current = null;
		}
		try {
			readerRef.current?.reset();
		} catch {}
		readerRef.current = null;
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		setCameraActive(false);
		retryCountRef.current = 0;
	}, []);
	useEffect(() => {
		return stopCamera;
	}, [stopCamera]);
	const scanFrame = useCallback(async () => {
		const reader = readerRef.current;
		const video = videoRef.current;
		if (!reader || !video || !cameraActive) return;
		try {
			const result = await reader.decodeOnceFromConstraints({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			}, video);
			if (result) {
				const code = result.getText();
				const now = Date.now();
				const last = lastScanRef.current;
				if (last && last.code === code && now - last.at < DEDUP_MS) retryCountRef.current = 0;
				else {
					lastScanRef.current = {
						code,
						at: now
					};
					onScanRef.current(code);
					retryCountRef.current = 0;
				}
			}
		} catch (e) {
			if (!(e instanceof Error && (e.name === "NotFoundException" || e.name === "ChecksumException" || e.name === "FormatException"))) {
				console.warn("Camera scan error:", e);
				retryCountRef.current += 1;
				if (retryCountRef.current >= CAMERA_MAX_RETRIES) {
					stopCamera();
					setCameraError("denied");
					return;
				}
			}
		}
		if (cameraActive) loopTimerRef.current = setTimeout(scanFrame, CAMERA_LOOP_INTERVAL_MS);
	}, [cameraActive, stopCamera]);
	const startCamera = useCallback(async () => {
		setCameraError(null);
		setPhotoResult(null);
		setCameraActive(true);
		retryCountRef.current = 0;
		if (!(typeof window === "undefined" || typeof window.isSecureContext !== "boolean" || window.isSecureContext)) {
			setCameraError("insecure");
			setCameraActive(false);
			return;
		}
		if (!navigator.mediaDevices?.getUserMedia) {
			setCameraError("unsupported");
			setCameraActive(false);
			return;
		}
		if (!videoRef.current) {
			setCameraError("denied");
			setCameraActive(false);
			return;
		}
		try {
			const { BrowserMultiFormatReader, hints } = await loadScanner();
			const videoToScan = videoRef.current;
			if (!videoToScan) {
				setCameraError("denied");
				setCameraActive(false);
				return;
			}
			const reader = new BrowserMultiFormatReader(hints, DECODE_DELAY_MS);
			readerRef.current = reader;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			});
			streamRef.current = stream;
			videoToScan.srcObject = stream;
			await videoToScan.play();
			scanFrame();
		} catch {
			stopCamera();
			setCameraError("denied");
		}
	}, [scanFrame, stopCamera]);
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
					reader = new BrowserMultiFormatReader(hints, DECODE_DELAY_MS);
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
//#endregion
//#region src/components/cashier/QuickAddGrid.tsx
var MAX_TILES = 24;
function QuickAddGrid({ products, cart, currency, onAdd }) {
	const { t } = useI18n();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const categories = useMemo(() => {
		const set = /* @__PURE__ */ new Set();
		products.forEach((p) => {
			if (p.category) set.add(p.category);
		});
		return Array.from(set).sort();
	}, [products]);
	const inCart = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		cart.forEach((c) => map.set(c.id, c.qty));
		return map;
	}, [cart]);
	const visible = useMemo(() => {
		const q = query.trim().toLowerCase();
		return products.filter((p) => {
			if (category !== "all" && p.category !== category) return false;
			if (!q) return true;
			return p.name.toLowerCase().includes(q) || (p.barcode ? p.barcode.toLowerCase().includes(q) : false) || p.category.toLowerCase().includes(q);
		}).slice(0, MAX_TILES);
	}, [
		products,
		query,
		category
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: t("cashier.quickAddSearch"),
						className: "pl-9",
						autoComplete: "off"
					})]
				})
			}),
			categories.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "flex gap-1.5 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ jsxs(Badge, {
					variant: category === "all" ? "default" : "outline",
					className: "shrink-0 cursor-pointer",
					onClick: () => setCategory("all"),
					children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "mr-1 size-3" }), t("cashier.allCategories")]
				}), categories.map((c) => /* @__PURE__ */ jsx(Badge, {
					variant: category === c ? "default" : "outline",
					className: "shrink-0 cursor-pointer",
					onClick: () => setCategory(c),
					children: c
				}, c))]
			}),
			visible.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: t("cashier.quickAddEmpty")
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4",
				children: visible.map((p) => {
					const qty = inCart.get(p.id) ?? 0;
					const out = p.stock <= 0;
					const atMax = qty >= p.stock;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: out,
						onClick: () => onAdd(p),
						className: cn("group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all", out ? "border-border opacity-50" : "border-border hover:border-primary hover:shadow-md"),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[4/3] w-full overflow-hidden bg-muted",
							children: [
								p.image ? /* @__PURE__ */ jsx("img", {
									src: p.image,
									alt: p.name,
									className: "size-full object-cover transition-transform duration-300 group-hover:scale-105",
									loading: "lazy"
								}) : /* @__PURE__ */ jsx("div", {
									className: "grid size-full place-items-center text-3xl text-muted-foreground/40",
									children: "🐾"
								}),
								qty > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
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
								className: "line-clamp-2 text-xs font-medium leading-snug",
								children: p.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-auto flex items-center justify-between gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm font-bold text-primary",
									children: formatPrice(p.price, currency)
								}), /* @__PURE__ */ jsx("span", {
									className: cn("grid size-6 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground", atMax && !out && "opacity-40"),
									"aria-hidden": true,
									children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
								})]
							})]
						})]
					}, p.id);
				})
			}),
			products.length > MAX_TILES && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: t("cashier.quickAddShowing", {
					count: String(visible.length),
					total: String(products.length)
				})
			})
		]
	});
}
//#endregion
//#region src/components/cashier/HoldManager.tsx
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
//#endregion
//#region src/components/cashier/DiscountPanel.tsx
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
			active && discountAmount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Separator, {}), /* @__PURE__ */ jsxs("div", {
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
//#endregion
//#region src/components/ui/popover.tsx
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
//#endregion
//#region src/components/cashier/PerItemDiscount.tsx
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
//#endregion
//#region src/components/cashier/CustomerInfo.tsx
function CustomerInfoPanel({ customer, onChange }) {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ jsx(UserRound, { className: "size-4 text-muted-foreground" }), t("cashier.customerLabel")]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-2 sm:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "customer-name",
					className: "text-xs text-muted-foreground",
					children: t("cashier.customerName")
				}), /* @__PURE__ */ jsx(Input, {
					id: "customer-name",
					value: customer.name,
					onChange: (e) => onChange({
						...customer,
						name: e.target.value
					}),
					placeholder: t("cashier.customerNamePlaceholder"),
					autoComplete: "off"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "customer-phone",
					className: "text-xs text-muted-foreground",
					children: t("cashier.customerPhone")
				}), /* @__PURE__ */ jsx(Input, {
					id: "customer-phone",
					value: customer.phone,
					onChange: (e) => onChange({
						...customer,
						phone: e.target.value
					}),
					placeholder: t("cashier.customerPhonePlaceholder"),
					inputMode: "tel",
					autoComplete: "off"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/cashier/QuickCashCalculator.tsx
var BANKNOTES = [
	1e3,
	500,
	200,
	100,
	50,
	20,
	10,
	5
];
var COINS = [
	2,
	1,
	.5,
	.25
];
function QuickCashCalculator({ total, currency, onCashReceivedChange }) {
	const { t } = useI18n();
	const [received, setReceived] = useState(0);
	const change = Math.max(0, received - total);
	const shortfall = Math.max(0, total - received);
	const settled = received >= total;
	const setAmt = (n) => {
		const v = Math.round(n * 100) / 100;
		setReceived(v);
		onCashReceivedChange(v);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ jsx(Wallet, { className: "size-4 text-muted-foreground" }), t("cashier.cashReceived")]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
						children: currency
					}), /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: 0,
						inputMode: "decimal",
						value: received === 0 ? "" : String(received),
						onChange: (e) => {
							const raw = e.target.value;
							if (raw === "") {
								setReceived(0);
								onCashReceivedChange(0);
								return;
							}
							const n = Number(raw);
							if (Number.isFinite(n)) setAmt(n);
						},
						placeholder: "0.00",
						className: "pl-10 text-lg font-semibold",
						autoFocus: false
					})]
				}), /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					size: "lg",
					onClick: () => setAmt(total),
					className: "gap-1.5 whitespace-nowrap",
					children: [/* @__PURE__ */ jsx(Banknote, { className: "size-4" }), t("cashier.exact")]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Banknote, { className: "size-3" }), t("cashier.banknotes")]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-4 gap-1.5",
					children: BANKNOTES.map((b) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setAmt(received + b),
						className: "rounded-lg border border-border py-1.5 text-sm font-semibold transition hover:border-primary hover:bg-primary/5",
						children: b
					}, b))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Coins, { className: "size-3" }), t("cashier.coins")]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-4 gap-1.5",
					children: COINS.map((c) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setAmt(received + c),
						className: "rounded-lg border border-border py-1.5 text-sm font-semibold transition hover:border-primary hover:bg-primary/5",
						children: c
					}, c))
				})]
			}),
			/* @__PURE__ */ jsx(Separator, {}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex items-center justify-between rounded-xl p-3 text-sm", settled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"),
				children: [/* @__PURE__ */ jsx("span", { children: settled ? t("cashier.changeDue") : t("cashier.remaining") }), /* @__PURE__ */ jsxs("span", {
					className: cn("text-lg font-bold", settled && "text-success"),
					children: [
						settled ? change.toFixed(2) : shortfall.toFixed(2),
						" ",
						currency
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/cashier/SplitPayment.tsx
var METHODS = [
	"cash",
	"fawry",
	"instapay"
];
function methodLabel(m, t) {
	return t(`checkout.method.${m}.short`);
}
function SplitPayment({ total, currency, allocations, onAllocationsChange }) {
	const { t } = useI18n();
	const [enabled, setEnabled] = useState(allocations.length > 1);
	const allocated = allocations.reduce((n, a) => n + a.amount, 0);
	const remaining = total - allocated;
	const complete = Math.abs(remaining) < .005;
	const toggle = () => {
		setEnabled((prev) => {
			const next = !prev;
			onAllocationsChange([{
				method: "cash",
				amount: Math.round(total * 100) / 100
			}]);
			return next;
		});
	};
	const addMethod = (method) => {
		if (allocations.some((a) => a.method === method)) return;
		onAllocationsChange([...allocations, {
			method,
			amount: 0
		}]);
	};
	const updateAmount = (index, amount) => {
		const clamped = Math.min(Math.round(amount * 100) / 100, total);
		onAllocationsChange(allocations.map((a, i) => i === index ? {
			...a,
			amount: Math.max(0, clamped)
		} : a));
	};
	const resetToSingle = () => {
		onAllocationsChange([{
			method: "cash",
			amount: Math.round(total * 100) / 100
		}]);
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
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: METHODS.filter((m) => !allocations.some((a) => a.method === m)).map((m) => /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => addMethod(m),
						className: "gap-1",
						children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), methodLabel(m, t)]
					}, m))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: allocations.map((a, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "w-24 shrink-0 text-xs font-semibold",
								children: methodLabel(a.method, t)
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground",
									children: currency
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 0,
									max: total,
									inputMode: "decimal",
									value: a.amount === 0 ? "" : String(a.amount),
									onChange: (e) => {
										const v = e.target.value === "" ? 0 : Number(e.target.value);
										if (Number.isFinite(v)) updateAmount(idx, v);
									},
									className: "pl-8"
								})]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-muted-foreground",
								onClick: () => {
									if (allocations.length <= 1) {
										resetToSingle();
										return;
									}
									onAllocationsChange(allocations.filter((_, i) => i !== idx));
								},
								children: /* @__PURE__ */ jsx(X, { className: "size-4" })
							})
						]
					}, a.method))
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground",
						children: t("cashier.allocated")
					}), /* @__PURE__ */ jsxs("span", { children: [
						allocated.toFixed(2),
						" ",
						currency
					] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: cn("flex justify-between text-sm font-semibold", complete ? "text-success" : "text-amber-600"),
					children: [/* @__PURE__ */ jsx("span", { children: complete ? t("cashier.fullyAllocated") : t("cashier.unallocated") }), /* @__PURE__ */ jsxs("span", { children: [
						Math.abs(remaining).toFixed(2),
						" ",
						currency
					] })]
				}),
				!complete && /* @__PURE__ */ jsx("p", {
					className: "rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive",
					children: t("cashier.splitNotComplete")
				})
			]
		})]
	});
}
//#endregion
//#region src/components/cashier/ReceiptPreview.tsx
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
      <svg viewBox="0 0 64 64" fill="none" style="height:40px;width:40px;margin:0 auto 4px" aria-hidden="true"><path d="M4 42h9l5-11 6 20 5-15 4 6h6" stroke="#333" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><g fill="#333"><ellipse cx="43.5" cy="20" rx="3.1" ry="4.2"/><ellipse cx="52" cy="16.5" rx="3.1" ry="4.4"/><ellipse cx="60" cy="21" rx="2.9" ry="4"/></g><path d="M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z" fill="#333"/></svg>
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
								/* @__PURE__ */ jsx(PawMMark, { className: "h-10 w-10 text-primary" }),
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
//#endregion
//#region src/components/cashier/ShortcutsDialog.tsx
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
//#endregion
//#region src/components/cashier/types.ts
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
//#endregion
//#region src/routes/cashier.tsx?tsr-split=component
var PAYMENT_METHODS = [
	{
		value: "cash",
		icon: Banknote,
		title: "checkout.method.cash.title",
		short: "checkout.method.cash.short"
	},
	{
		value: "fawry",
		icon: Landmark,
		title: "checkout.method.fawry.title",
		short: "checkout.method.fawry.short"
	},
	{
		value: "instapay",
		icon: Smartphone,
		title: "checkout.method.instapay.title",
		short: "checkout.method.instapay.short"
	}
];
function CashierPage() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("div", {
		className: "hero-gradient min-h-screen px-5 py-8 sm:py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/dashboard",
					className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-6",
					children: [
						/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }),
						" ",
						t("cashier.backToDashboard")
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-6 flex flex-wrap items-center justify-between gap-3",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: t("cashier.title")
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: t("cashier.subtitle")
					})] })
				}),
				/* @__PURE__ */ jsx(CashierApp, {})
			]
		})
	});
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
function CashierApp() {
	const { t } = useI18n();
	const { products, settings } = useClinicStore();
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
	const [discountOpen, setDiscountOpen] = useState(false);
	const [cashOpen, setCashOpen] = useState(true);
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
		const isSplit = split.length > 1;
		const total = totals.total;
		if (isSplit) {
			const allocated = split.reduce((n, a) => n + a.amount, 0);
			if (Math.abs(allocated - total) >= .005) {
				toast.error(t("cashier.splitNotComplete"));
				return;
			}
		}
		if (method === "instapay" && !settings.instapay) {
			toast.error(t("checkout.instapayNotConfigured"));
			return;
		}
		setBusy(true);
		try {
			const items = reduceCartForSubmission(cart, itemDiscounts);
			const discountAmount = totals.itemDiscount + totals.orderDiscountAmt;
			let paymentMethod = method;
			let paymentRef = method === "instapay" || method === "fawry" ? "" : void 0;
			if (isSplit) {
				const primary = split.find((a) => a.method !== "cash") ?? split[0];
				paymentMethod = primary.method;
				paymentRef = primary.method === "instapay" || primary.method === "fawry" ? "" : void 0;
			}
			const order = await createOrder({
				customerName: customer.name.trim() || t("cashier.walkInCustomer"),
				phone: customer.phone.trim(),
				email: "",
				address: "",
				items,
				paymentMethod,
				paymentRef,
				source: "pos",
				discountAmount,
				discountLabel: orderDiscount.type !== "none" ? orderDiscount.type === "percent" ? t("cashier.percentOff", { value: String(orderDiscount.value) }) : t("cashier.discountOrder") : ""
			});
			setResult({
				id: order.id,
				paymentMethod: order.paymentMethod,
				paymentRef: order.paymentRef
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
			result.paymentMethod === "fawry" && /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-primary/25 bg-primary/8 p-4 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold text-primary",
					children: t("checkout.fawryRefTitle")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 font-mono text-xl font-bold",
					children: result.paymentRef
				})]
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
		className: "grid gap-6 lg:grid-cols-[1fr_400px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4 min-w-0",
				children: [
					/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
						className: "flex flex-row items-center justify-between",
						children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base",
							children: t("cashier.addProducts")
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-muted-foreground",
							onClick: () => setShortcutsOpen(true),
							children: [/* @__PURE__ */ jsx(Keyboard, { className: "size-4 mr-1.5" }), t("cashier.keyboardShortcuts")]
						})]
					}), /* @__PURE__ */ jsx(CardContent, {
						className: "space-y-4",
						children: /* @__PURE__ */ jsxs(Tabs, {
							value: activeTab,
							onValueChange: setActiveTab,
							children: [
								/* @__PURE__ */ jsxs(TabsList, {
									className: "grid w-full grid-cols-2",
									children: [/* @__PURE__ */ jsxs(TabsTrigger, {
										value: "scan",
										className: "gap-1.5",
										children: [/* @__PURE__ */ jsx(Barcode, { className: "size-4" }), t("cashier.scanBarcode")]
									}), /* @__PURE__ */ jsxs(TabsTrigger, {
										value: "quick",
										className: "gap-1.5",
										children: [/* @__PURE__ */ jsx(Grid2X2, { className: "size-4" }), t("cashier.quickAdd")]
									})]
								}),
								/* @__PURE__ */ jsxs(TabsContent, {
									value: "scan",
									className: "space-y-4 pt-4",
									children: [/* @__PURE__ */ jsxs("div", {
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
											className: "flex-1",
											autoComplete: "off",
											autoFocus: activeTab === "scan"
										}), /* @__PURE__ */ jsx(Button, {
											type: "button",
											size: "icon",
											className: "shrink-0",
											onClick: () => {
												const val = barcodeInputRef.current?.value ?? "";
												if (val) processBarcode(val);
												setBarcodeInput("");
											},
											"aria-label": t("cashier.scanPlaceholder"),
											children: /* @__PURE__ */ jsx(Search, { className: "size-4" })
										})]
									}), /* @__PURE__ */ jsxs(Collapsible, { children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
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
									})] })]
								}),
								/* @__PURE__ */ jsx(TabsContent, {
									value: "quick",
									className: "pt-4",
									children: /* @__PURE__ */ jsx(QuickAddGrid, {
										products,
										cart,
										currency: settings.currency,
										onAdd: (p) => addProduct(p)
									})
								})
							]
						})
					})] }),
					/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
						className: "flex flex-row items-center justify-between",
						children: [/* @__PURE__ */ jsx(CardTitle, {
							className: "text-base",
							children: t("cashier.cart", { count: String(itemCount) })
						}), cart.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: holdCurrentSale,
								disabled: cart.length === 0,
								children: [
									/* @__PURE__ */ jsx(PackagePlus, { className: "size-4 mr-1" }),
									" ",
									t("cashier.holdSale")
								]
							}), /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: clearCart,
								className: "text-destructive",
								children: [
									/* @__PURE__ */ jsx(Trash2, { className: "size-4 mr-1" }),
									" ",
									t("cashier.clearCart")
								]
							})]
						})]
					}), /* @__PURE__ */ jsx(CardContent, { children: cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
						children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "size-12 mb-3 opacity-50" }), /* @__PURE__ */ jsx("p", { children: t("cashier.emptyCart") })]
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2 max-h-[45vh] overflow-y-auto pr-1",
						children: cart.map((item) => {
							const disc = itemDiscounts[item.id];
							const eff = itemEffectivePrice(item.originalPrice, disc);
							const hasDisc = disc && disc.type !== "none";
							return /* @__PURE__ */ jsxs("div", {
								className: cn("flex items-center gap-3 rounded-xl border p-3 transition-all", lastScanned === item.id ? "border-primary bg-primary/5 shadow-glow" : "border-border"),
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.image,
										alt: item.name,
										className: "size-14 shrink-0 rounded-lg border border-border object-cover"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-medium truncate",
											children: item.name
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-muted-foreground",
											children: [
												formatPrice(eff, settings.currency),
												hasDisc && /* @__PURE__ */ jsx("span", {
													className: "ml-1.5 text-destructive line-through",
													children: formatPrice(item.originalPrice, settings.currency)
												}),
												hasDisc && /* @__PURE__ */ jsx(Badge, {
													variant: "outline",
													className: "ml-1.5 text-[10px]",
													children: disc?.type === "percent" ? `${disc.value}%` : `-${disc?.value}`
												}),
												" × ",
												item.qty
											]
										})]
									}),
									/* @__PURE__ */ jsx(PerItemDiscount, {
										price: item.originalPrice,
										qty: item.qty,
										stock: item.stock,
										discount: itemDiscounts[item.id],
										onChange: (d) => setItemDiscounts((prev) => ({
											...prev,
											[item.id]: d
										}))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "icon",
												className: "h-7 w-7",
												onClick: () => updateQty(item.id, -1),
												disabled: item.qty <= 1,
												"aria-label": t("cashier.decrease"),
												children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "w-8 text-center text-sm font-medium",
												children: item.qty
											}),
											/* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "icon",
												className: "h-7 w-7",
												onClick: () => updateQty(item.id, 1),
												disabled: item.qty >= item.stock,
												"aria-label": t("cashier.increase"),
												children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
											}),
											/* @__PURE__ */ jsx(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-7 w-7 text-destructive",
												onClick: () => removeItem(item.id),
												"aria-label": t("cashier.remove"),
												children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
											})
										]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold w-24 text-right",
										children: formatPrice(eff * item.qty, settings.currency)
									})
								]
							}, item.id);
						})
					}) })] }),
					holdSales.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("cashier.heldSales")
					}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(HoldManager, {
						heldSales: holdSales,
						currency: settings.currency,
						onHold: holdCurrentSale,
						onResume: resumeSale,
						onDiscard: discardHeld,
						canHold: cart.length > 0
					}) })] })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto space-y-4 pr-1",
				children: /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: t("cashier.payment")
					})
				}), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsx(CustomerInfoPanel, {
							customer,
							onChange: setCustomer
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-3 gap-2",
							children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setMethod(m.value),
								className: cn("flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors", method === m.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"),
								"aria-pressed": method === m.value,
								children: [/* @__PURE__ */ jsx("span", {
									className: cn("grid size-9 shrink-0 place-items-center rounded-lg", method === m.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
									children: /* @__PURE__ */ jsx(m.icon, { className: "size-4.5" })
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold",
									children: t(m.short)
								})]
							}, m.value))
						}),
						method === "fawry" && /* @__PURE__ */ jsx("p", {
							className: "rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-xs text-primary",
							children: t("checkout.fawryHowTitle")
						}),
						method === "instapay" && /* @__PURE__ */ jsxs("p", {
							className: "rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-primary",
									children: t("checkout.method.instapay.short")
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-mono font-bold",
									children: settings.instapay
								})
							]
						}),
						/* @__PURE__ */ jsx(SplitPayment, {
							total: totals.total,
							currency: settings.currency,
							allocations: split.length > 1 ? split : [],
							onAllocationsChange: (a) => setSplit(a)
						}),
						/* @__PURE__ */ jsxs(Collapsible, {
							open: discountOpen,
							onOpenChange: setDiscountOpen,
							children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: cn("flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-primary/40", discountOpen ? "border-primary/40" : "border-border"),
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(BadgePercent, { className: "size-4 text-muted-foreground" }), t("cashier.discount")]
									}), /* @__PURE__ */ jsx(ChevronDown, { className: cn("size-4 text-muted-foreground transition-transform", discountOpen && "rotate-180") })]
								})
							}), /* @__PURE__ */ jsx(CollapsibleContent, {
								className: "pt-3",
								children: /* @__PURE__ */ jsx(DiscountPanel, {
									orderDiscount,
									subtotal: totals.subtotalAfterItems,
									currency: settings.currency,
									onApplyOrderDiscount: setOrderDiscount
								})
							})]
						}),
						method === "cash" && split.length <= 1 && /* @__PURE__ */ jsxs(Collapsible, {
							open: cashOpen,
							onOpenChange: setCashOpen,
							children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: cn("flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-primary/40", cashOpen ? "border-primary/40" : "border-border"),
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Wallet, { className: "size-4 text-muted-foreground" }), t("cashier.cashReceived")]
									}), /* @__PURE__ */ jsx(ChevronDown, { className: cn("size-4 text-muted-foreground transition-transform", cashOpen && "rotate-180") })]
								})
							}), /* @__PURE__ */ jsx(CollapsibleContent, {
								className: "pt-3",
								children: /* @__PURE__ */ jsx(QuickCashCalculator, {
									total: totals.total,
									currency: settings.currency,
									onCashReceivedChange: setCashReceived
								})
							})]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: t("cashier.subtotal")
									}), /* @__PURE__ */ jsx("span", { children: formatPrice(totals.subtotal, settings.currency) })]
								}),
								totals.itemDiscount > 0 && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: t("cashier.itemDiscounts")
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-destructive",
										children: ["-", formatPrice(totals.itemDiscount, settings.currency)]
									})]
								}),
								totals.orderDiscountAmt > 0 && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: t("cashier.discountApplied")
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-destructive",
										children: ["-", formatPrice(totals.orderDiscountAmt, settings.currency)]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: t("cashier.items")
									}), /* @__PURE__ */ jsx("span", { children: itemCount })]
								})
							]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-lg font-bold",
							children: [/* @__PURE__ */ jsx("span", { children: t("cashier.total") }), /* @__PURE__ */ jsx("span", { children: formatPrice(totals.total, settings.currency) })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsxs(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setReceiptOpen(true),
								disabled: cart.length === 0,
								className: "gap-1.5",
								children: [/* @__PURE__ */ jsx(ReceiptText, { className: "size-4" }), t("cashier.receiptPreview")]
							}), /* @__PURE__ */ jsxs(Button, {
								type: "button",
								onClick: submit,
								size: "lg",
								disabled: busy || cart.length === 0,
								className: "flex-1 gap-1.5 shadow-glow",
								children: [/* @__PURE__ */ jsx(Wallet, { className: "size-4" }), busy ? "…" : t("cashier.completeSale")]
							})]
						}),
						discountAmount > 0 && /* @__PURE__ */ jsx("p", {
							className: "text-center text-xs text-muted-foreground",
							children: t("cashier.totalWithDiscount", { amount: formatPrice(discountAmount, settings.currency) })
						})
					]
				})] })
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
			/* @__PURE__ */ jsx(ShortcutsDialog, {
				open: shortcutsOpen,
				onOpenChange: setShortcutsOpen
			})
		]
	});
}
//#endregion
export { CashierPage as component };
