import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";

// The TanStack Start dev plugin emits both
//   <script type="module" async src="/@id/virtual:tanstack-start-dev-client-entry">
//   <link rel="modulepreload" href="/@id/virtual:tanstack-start-dev-client-entry">
// The preload is redundant (the script already loads the module) and Chrome
// reports it as an unused cross-world preload on every page load, because the
// dev client is evaluated in a different world. Dropping just the preload link
// leaves the script tag, so HMR still works.
function dropRedundantDevClientPreload(): Plugin {
  const DEV_CLIENT_ENTRY = "/@id/virtual:tanstack-start-dev-client-entry";
  return {
    name: "pawm:drop-redundant-dev-client-preload",
    apply: "serve",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return html.replace(
          new RegExp(`<link[^>]*rel="modulepreload"[^>]*href="${DEV_CLIENT_ENTRY}"[^>]*>`, "g"),
          "",
        );
      },
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
