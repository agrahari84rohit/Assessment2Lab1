import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches a programming joke on load and shows a single button and joke paragraph', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ joke: 'Why do programmers prefer dark mode? Because light attracts bugs.' }),
    })

    render(<App />)

    expect(screen.getByText(/loading joke/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Why do programmers prefer dark mode? Because light attracts bugs.')).toBeInTheDocument()
    })

    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /get another joke/i })).toHaveLength(1)
    expect(screen.getAllByText('Why do programmers prefer dark mode? Because light attracts bugs.')).toHaveLength(1)
  })
})
