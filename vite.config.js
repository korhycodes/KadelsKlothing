import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "copy-store-assets",
      writeBundle() {
        cpSync(resolve(rootDir, "assets"), resolve(rootDir, "dist", "assets"), { recursive: true });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        storefront: "index.html",
        founder: "founder.html"
      }
    }
  }
});
