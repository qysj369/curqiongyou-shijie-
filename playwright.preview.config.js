import { defineConfig, devices } from '@playwright/test'

/**
 * 对 `vite build` 产物做 E2E：先保证 `dist/` 已生成（见 `test:e2e:preview` 脚本），
 * 再启动 `vite preview`，与线上静态包一致。
 * CI：在 `npm run build` 之后、上传 artifact 之前跑，验证即将部署的目录。
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
