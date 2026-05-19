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
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('home route /', () => {
  it('renders search form in minimal mode', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/?minimal=1']} future={ROUTER_FUTURE}>
        <MinimalUiProvider>
          <AppLayout />
        </MinimalUiProvider>
      </MemoryRouter>,
    )
    try {
      const main = await screen.findByRole('main')
      await within(main).findByRole('search', {}, { timeout: 8000 })
    } finally {
      unmount()
    }
  })

  it('renders search form without error boundary', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']} future={ROUTER_FUTURE}>
        <MinimalUiProvider>
          <AppLayout />
        </MinimalUiProvider>
      </MemoryRouter>,
    )
    try {
      expect(screen.queryByText(/Something went wrong|出了点小问题/i)).toBeNull()
      const main = await screen.findByRole('main')
      await within(main).findByRole('search', {}, { timeout: 8000 })
    } finally {
      unmount()
    }
  })
})
