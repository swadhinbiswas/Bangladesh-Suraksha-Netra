import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), tailwindcss(), EnvironmentPlugin({ prefix: "VITE_" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), //ensure node env is defined.
  },
});
