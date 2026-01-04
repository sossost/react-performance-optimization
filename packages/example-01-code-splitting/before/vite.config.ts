import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  preview: {
    port: 4173,
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Before: 모든 vendor를 하나의 큰 청크로 묶어서 초기 번들에 포함
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React와 모든 무거운 라이브러리를 하나의 vendor 청크로 묶음
            return 'vendor-all';
          }
        },
      },
    },
  },
})

