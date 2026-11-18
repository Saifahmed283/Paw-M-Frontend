import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";
import path from "node:path";

// In dev, TanStack Start's generated client manifest hardcodes the dev client in
// two places: as a route preload and as the route script. The router renders
// those as
//   <link rel="modulepreload" href="/@id/virtual:tanstack-start-dev-client-entry">
//   <script type="module" async src="/@id/virtual:tanstack-start-dev-client-entry">
// The preload is redundant (the script already loads that module) and Chrome logs
// it as an unused cross-world preload on every page load, since the dev client is
// evaluated in a different world. There is no config flag for it, so the preload
// entry is stripped from the generated manifest; the script entry stays, which
// keeps HMR working. Dev-only, and production builds never reference this entry.
function dropRedundantDevClientPreload(): Plugin {
  const preloadEntry = new RegExp(
    String.raw`preloads:\s*\[\s*['"]/@id/virtual:tanstack-start-dev-client-entry['"]\s*\]`,
    "g",
  );
  return {
    name: "pawm:drop-redundant-dev-client-preload",
    apply: "serve",
    enforce: "post",
    transform(code, id) {
      if (!preloadEntry.test(code)) return null;
      preloadEntry.lastIndex = 0;
      return { code: code.replace(preloadEntry, "preloads: []"), map: null };
    },
  };
}

// TanStack Start's dev transform strips `.server(...)` bodies from client
// modules, but the remaining top-level imports still pull in
// `@tanstack/start-storage-context`, which instantiates `AsyncLocalStorage`
// from `node:async_hooks` at module load. Production builds tree-shake that
// import away; dev does not, so the browser throws
// "AsyncLocalStorage is not a constructor". Provide a no-op browser shim for
// client modules only — SSR keeps using Node's real implementation.
function asyncHooksBrowserShim(): Plugin {
  const virtualId = "\0virtual:pawm-async-hooks";
  return {
    name: "pawm:async-hooks-browser-shim",
    enforce: "pre",
    resolveId(source, _importer, options) {
      if (options?.ssr) return null;
      if (source === "node:async_hooks" || source === "async_hooks") return virtualId;
    },
    load(id) {
      if (id !== virtualId) return null;
      return [
        "export class AsyncLocalStorage {",
        "  run(_context, fn, ...args) { return fn(...args); }",
        "  getStore() { return undefined; }",
        "  enterWith(_context) {}",
        "  disable() {}",
        "}",
        "export default { AsyncLocalStorage };",
      ].join("\n");
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  // Keep this out of esbuild pre-bundling: its prebundled output inlines
  // `node:async_hooks` as a browser-external stub, which bypasses the shim
  // below. Serving it as raw ESM in dev lets the shim apply.
  optimizeDeps: {
    exclude: ["@tanstack/start-client-core", "@tanstack/start-storage-context"],
  },
  build: {
    sourcemap: false,
  },
  plugins: [
    asyncHooksBrowserShim(),
    tanstackStart({
      prerender: {
        enabled: true,
        failOnError: false,
      },
    }),
    react(),
    tailwindcss(),
    dropRedundantDevClientPreload(),
  ],
  server: {
    // Bind to 0.0.0.0 and accept any Host header so LAN access and
    // port-forwarding tunnels (ngrok, cloudflared, VPN, etc.) work out of
    // the box instead of showing "Blocked request. This host is not allowed."
    host: true,
    allowedHosts: true,
    // Pre-transpile the app's core modules at server start so the first
    // request doesn't pay the full cold-start cost.
    warmup: {
      clientFiles: [
        "./src/router.tsx",
        "./src/routes/*.tsx",
        "./src/components/site/*.tsx",
        "./src/components/IntroAnimation.tsx",
        "./src/lib/i18n.tsx",
        "./src/lib/clinic-store.ts",
      ],
      ssrFiles: ["./src/router.tsx", "./src/routes/__root.tsx", "./src/routes/index.tsx"],
    },
  },
  preview: {
    host: true,
  },
});
