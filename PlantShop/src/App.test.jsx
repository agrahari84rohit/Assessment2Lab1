import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads plants on mount, filters by search, and adds a plant', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: 'Snake Plant', price: 18, image: 'plant.jpg', soldOut: false },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, name: 'Monstera', price: 24, image: 'new.jpg', soldOut: false }),
      })

    global.fetch = fetchMock

    render(<App />)

    expect(screen.getByText(/loading plants/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Snake Plant')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/search plants/i), {
      target: { value: 'Mon' },
    })

    expect(screen.queryByText('Snake Plant')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/plant name/i), {
      target: { value: 'Monstera' },
    })
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '24' },
    })
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: 'new.jpg' },
    })

    fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3001/plants',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
