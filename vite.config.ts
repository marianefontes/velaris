import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fail loudly if 5173 is taken (e.g. php -S) instead of silently switching ports.
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3333",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("node_modules/react-dom") !== -1 || id.indexOf("node_modules/react/") !== -1) {
            return "react-vendor";
          }
          if (id.indexOf("node_modules/react-router") !== -1) {
            return "router";
          }
          if (id.indexOf("node_modules/recharts") !== -1) {
            return "recharts";
          }
          if (id.indexOf("node_modules/framer-motion") !== -1) {
            return "framer-motion";
          }
          if (id.indexOf("node_modules/lucide-react") !== -1) {
            return "lucide";
          }
          if (id.indexOf("/data/component-metadata.json") !== -1) {
            return "component-metadata";
          }
          if (id.indexOf("/src/i18n/locales/") !== -1) {
            return "i18n-locales";
          }
        },
      },
    },
  },
});
