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
    port: 4174,
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // After: 무거운 라이브러리들만 별도 청크로 분리 (lazy load)
        // React는 초기 번들에 포함 (필수)
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 무거운 라이브러리들만 vendor-heavy로 분리 (lazy load)
            if (
              id.includes('lodash') ||
              id.includes('moment') ||
              id.includes('date-fns') ||
              id.includes('ramda') ||
              id.includes('axios')
            ) {
              return 'vendor-heavy';
            }
            // React와 기타는 초기 번들에 포함 (별도 청크로 분리하지 않음)
            return undefined;
          }
        },
      },
    },
  },
})

