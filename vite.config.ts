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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler"))
            return "react-vendor";
          if (id.includes("node_modules/@tanstack")) return "tanstack";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion"))
            return "motion";
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3") ||
            id.includes("node_modules/@zxing")
          )
            return "heavy-vendor";
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/radix-ui") ||
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/vaul") ||
            id.includes("node_modules/embla-carousel") ||
            id.includes("node_modules/recharts")
          )
            return "ui-vendor";
        },
      },
    },
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
