import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // Use relative base path for desktop file:// protocol loading in Electron
  server: {
    proxy: {
      "/nvidia-api": {
        target: "https://integrate.api.nvidia.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/nvidia-api/, ""),
      },
      "/deepseek-api": {
        target: "https://api.deepseek.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/deepseek-api/, ""),
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
} as any);
