import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 환경 변수 설정
  envPrefix: 'VITE_',
  
  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  
  // 개발 서버 설정
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  
  // 미리보기 서버 설정
  preview: {
    port: 4173,
    host: true,
  },
})
