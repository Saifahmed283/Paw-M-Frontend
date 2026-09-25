import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";

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

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: false,
  },
  plugins: [
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
