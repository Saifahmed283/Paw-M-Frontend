import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";

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
