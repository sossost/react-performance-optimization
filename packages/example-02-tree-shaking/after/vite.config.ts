import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  preview: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // After: Vite의 기본 Tree Shaking을 활용하여 필요한 모듈만 번들에 포함
        // manualChunks를 별도로 설정하지 않아도 Vite가 ESM 기반 Tree Shaking을 수행
      },
    },
  },
});
