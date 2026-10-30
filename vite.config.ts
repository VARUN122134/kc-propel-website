import { defineConfig } from "vite";

export default defineConfig({
  // relative asset URLs so the build works from a GitHub Pages project path
  base: "./",
  build: {
    target: "es2022",
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
  },
  server: {
    port: 5177,
  },
});
