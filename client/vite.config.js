import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // required for Vercel output directory
  },
  server: {
    // Enable client-side routing (SPA fallback)
    historyApiFallback: true,
  },
});
