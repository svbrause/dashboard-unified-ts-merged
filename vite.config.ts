import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // listen on 0.0.0.0 so you can access via LAN IP (e.g. 10.0.0.240:5173) from iPad
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
