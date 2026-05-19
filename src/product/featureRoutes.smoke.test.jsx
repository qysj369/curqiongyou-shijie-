import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from '../App.jsx'
import { MinimalUiProvider } from '../contexts/MinimalUiContext.jsx'
import { FEATURE_MODULE_PATH, FEATURE_MODULE_ROLLOUT_ORDER } from './featureModules.js'

vi.mock('../lib/loadAmapApi.js', () => ({
  hasAmapKey: () => false,
  loadAmapApi: vi.fn(() => Promise.reject(new Error('mock: no amap key in tests'))),
}))

const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true }

/** 避免部分页在测试环境误发真实网络请求 */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: async () => ({}),
        text: async () => '',
      }),
    ),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function expectModuleRouteRenders(path) {
  const { unmount } = render(
    <MemoryRouter initialEntries={[path]} future={ROUTER_FUTURE}>
      <MinimalUiProvider>
        <AppLayout />
      </MinimalUiProvider>
    </MemoryRouter>,
  )
  try {
    const main = await screen.findByRole('main')
    await waitFor(
      () => {
        expect(within(main).queryByRole('status', { busy: true })).not.toBeInTheDocument()
      },
      { timeout: 12_000 },
    ).catch(() => {})
    const h1 = await within(main).findByRole('heading', { level: 1 }, { timeout: 12_000 })
    expect(h1.textContent?.trim().length).toBeGreaterThan(0)
  } finally {
    unmount()
  }
}

describe('six feature modules — route smoke', () => {
  it.each(FEATURE_MODULE_ROLLOUT_ORDER)('renders primary surface for %s', async (moduleId) => {
    const path = FEATURE_MODULE_PATH[moduleId]
    await expectModuleRouteRenders(path)
  })
})

describe('China readiness page /china-readiness', () => {
  it('renders with a main heading', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/china-readiness']} future={ROUTER_FUTURE}>
        <MinimalUiProvider>
          <AppLayout />
        </MinimalUiProvider>
      </MemoryRouter>,
    )
    try {
      const main = await screen.findByRole('main')
      const h1 = await within(main).findByRole('heading', { level: 1 })
      expect(h1.textContent?.trim().length).toBeGreaterThan(0)
    } finally {
      unmount()
    }
  })
})

describe('planner launch /plan', () => {
  it('renders with a main heading', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/plan']} future={ROUTER_FUTURE}>
        <MinimalUiProvider>
          <AppLayout />
        </MinimalUiProvider>
      </MemoryRouter>,
    )
    try {
      const main = await screen.findByRole('main')
      const h1 = await within(main).findByRole('heading', { level: 1 })
      expect(h1.textContent?.trim().length).toBeGreaterThan(0)
    } finally {
      unmount()
    }
  })
})
