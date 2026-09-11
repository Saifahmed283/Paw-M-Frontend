import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

function resolveApiOrigin(request: Request): string {
  try {
    const env = (import.meta as { env?: Record<string, string | undefined> }).env;
    const url = env?.["VITE_API_URL"];
    if (url) return new URL(url).origin;
  } catch {
    /* ignore */
  }
  // Client-side api.ts calls the page host on the sibling port 3001 when
  // VITE_API_URL is unset, so the CSP must allow that same origin.
  try {
    const url = new URL(request.url);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return `${url.protocol}//${url.hostname}:3001`;
    }
  } catch {
    /* ignore */
  }
  return "http://localhost:3001";
}

function buildSecurityHeaders(apiOrigin: string): Record<string, string> {
  const isDev =
    typeof process !== "undefined"
      ? process.env.NODE_ENV !== "production"
      : false;

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    `connect-src 'self' ${apiOrigin}${isDev ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
    "frame-src https://www.openstreetmap.org https://www.google.com/maps",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return {
    "Content-Security-Policy": cspDirectives.join("; "),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  };
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function applySecurityHeaders(response: Response, apiOrigin: string): Response {
  const securityHeaders = buildSecurityHeaders(apiOrigin);
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }
  return response;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      const apiOrigin = resolveApiOrigin(request);
      return applySecurityHeaders(normalized, apiOrigin);
    } catch (error) {
      console.error(error);
      const response = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(response, resolveApiOrigin(request));
    }
  },
};
