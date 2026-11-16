import { defineConfig } from "vite";

/**
 * Project Pages site, served from /kc-propel-website/.
 * Every page is a real document (no client-side router), so the QR code can
 * point straight at /profile/ and shared links always resolve.
 */
export default defineConfig({
  base: "/kc-propel-website/",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        landing: "index.html",
        discover: "discover/index.html",
        about: "about/index.html",
        contact: "contact/index.html",
        profile: "profile/index.html",
      },
    },
  },
  server: {
    port: 5177,
  },
});
