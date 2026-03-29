import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到子路径（如 GitHub Pages: /budget-travel/）时设置 BASE
// 例：BASE=/budget-travel/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE || '/',
})
