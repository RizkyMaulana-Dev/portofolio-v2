// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// GitHub Pages project site: https://rizkymaulana-dev.github.io/portofolio-v2/
const isGitHubPages = process.env.GITHUB_PAGES === "true";

// https://astro.build/config
export default defineConfig({
  site: "https://rizkymaulana-dev.github.io",
  base: isGitHubPages ? "/portofolio-v2" : "/",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api": "http://127.0.0.1:8787",
        "/uploads": "http://127.0.0.1:8787",
      },
    },
    preview: {
      proxy: {
        "/api": "http://127.0.0.1:8787",
        "/uploads": "http://127.0.0.1:8787",
      },
    },
    optimizeDeps: {
      include: ["motion/react", "lucide-react"],
    },
  },
});