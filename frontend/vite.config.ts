import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const viteAppUrl = new URL(env.VITE_APP_URL);

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    clearScreen: false,

    server: {
      port: Number(viteAppUrl.port),
      strictPort: true,
      host: viteAppUrl.hostname,

      hmr: {
        protocol: "ws",
        host: viteAppUrl.hostname,
        port: 1421,
      },

      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});