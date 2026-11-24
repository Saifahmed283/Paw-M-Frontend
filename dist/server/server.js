// src/lib/error-capture.ts
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
// src/lib/error-page.ts
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Something went wrong — Paw-M Veterinary Clinic</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #f7f8f6; color: #111827; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      .mark { width: 3rem; height: 3rem; margin: 0 auto 1rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #5f8b6c; color: #fff; }
      .secondary { background: #fff; color: #111827; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <svg class="mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M4 42h9l5-11 6 20 5-15 4 6h6" stroke="#5f8b6c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <g fill="#5f8b6c"><ellipse cx="43.5" cy="20" rx="3.1" ry="4.2"/><ellipse cx="52" cy="16.5" rx="3.1" ry="4.4"/><ellipse cx="60" cy="21" rx="2.9" ry="4"/><path d="M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z"/></g>
      </svg>
      <h1>Something went wrong at Paw-M</h1>
      <p>We hit an unexpected issue on our end. Try refreshing, or head back to the homepage.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
        <a class="secondary" href="tel:+201210105624">Call the clinic</a>
      </div>
    </div>
  </body>
</html>`;
}
// src/server.ts
function resolveApiOrigin(request) {
	try {
		const url = {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_API_URL"];
		if (url) return new URL(url).origin;
	} catch {}
	try {
		const url = new URL(request.url);
		if (url.protocol === "http:" || url.protocol === "https:") return `${url.protocol}//${url.hostname}:3001`;
	} catch {}
	return "http://localhost:3001";
}
function buildSecurityHeaders(apiOrigin) {
	const isDev = typeof process !== "undefined" ? false : false;
	return {
		"Content-Security-Policy": [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com data:",
			`img-src 'self' data: https: ${apiOrigin}`,
			"worker-src 'self' blob:",
			`connect-src 'self' ${apiOrigin}${isDev ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
			"frame-src https://www.openstreetmap.org https://www.google.com/maps",
			"frame-ancestors 'none'",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'"
		].join("; "),
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
	};
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./assets/server-CUDD1aOP.js").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
function applySecurityHeaders(response, apiOrigin) {
	const securityHeaders = buildSecurityHeaders(apiOrigin);
	for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
	return response;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return applySecurityHeaders(await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)), resolveApiOrigin(request));
	} catch (error) {
		console.error(error);
		return applySecurityHeaders(new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		}), resolveApiOrigin(request));
	}
} };
export { server_default as default, renderErrorPage as t };
