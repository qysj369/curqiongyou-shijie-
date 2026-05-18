import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到子路径（如 GitHub Pages: /budget-travel/）时设置 BASE
// 例：BASE=/budget-travel/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE || '/',
  build: {
    chunkSizeWarningLimit: 1200,
  },
  // 预览异常时常见原因：5173 被占用（strictPort 会直接退出）、或 localhost 解析异常（可改用 127.0.0.1）
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
  },
})
