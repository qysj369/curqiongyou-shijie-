import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from '../App.jsx'
import { MinimalUiProvider } from '../contexts/MinimalUiContext.jsx'

const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true }

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

describe('trip-ai page /trip-ai', () => {
  it('renders form and quick-start empty state', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/trip-ai']} future={ROUTER_FUTURE}>
        <MinimalUiProvider>
          <AppLayout />
        </MinimalUiProvider>
      </MemoryRouter>,
    )
    try {
      const main = await screen.findByRole('main')
      const h1 = await within(main).findByRole('heading', { level: 1 })
      expect(h1.textContent?.trim().length).toBeGreaterThan(0)
      await within(main).findByRole('button', { name: /成都/ })
      expect(within(main).getByRole('heading', { level: 2, name: /行程表单/ })).toBeTruthy()
    } finally {
      unmount()
    }
  })
})
