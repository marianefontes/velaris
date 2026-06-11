import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3333",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("node_modules/recharts") !== -1) {
            return "recharts";
          }
          if (id.indexOf("node_modules/framer-motion") !== -1) {
            return "framer-motion";
          }
        },
      },
    },
  },
});
