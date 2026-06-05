import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// Static assets that live at the repo root and are referenced by absolute/relative
// URLs (not imported by the JS graph). Copied verbatim into dist/ so the existing
// S3/CloudFront deploy keeps working unchanged.
const staticAssets = [
  "images",
  "draw.io",
  "data",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "blog",
  "site.webmanifest",
  "assets/css/noscript.css",
];

export default defineConfig({
  // index.html at repo root is the single entry; Vite bundles its module graph.
  root: ".",
  base: "/",
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: staticAssets.map((src) => ({
        src,
        dest: src.includes("/") ? src.split("/").slice(0, -1).join("/") : ".",
      })),
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets/build",
  },
});
