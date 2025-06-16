import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

const host = process.env["TAURI_DEV_HOST"];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { chunkSizeWarningLimit: 800 },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
