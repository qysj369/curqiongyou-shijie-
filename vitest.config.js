import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE || '/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
    pool: 'forks',
    testTimeout: 20_000,
    hookTimeout: 20_000,
    /** Playwright 用例在 `e2e/`，勿交给 Vitest */
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
})
