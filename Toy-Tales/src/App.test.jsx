import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Toy Tales app', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads toys, adds a toy, likes it, and donates it', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: 'Buzz', image: 'buzz.jpg', likes: 0, donated: false },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, name: 'Woody', image: 'woody.jpg', likes: 0, donated: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, name: 'Woody', image: 'woody.jpg', likes: 1, donated: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'Buzz', image: 'buzz.jpg', likes: 1, donated: true }),
      })

    global.fetch = fetchMock

    render(<App />)

    await waitFor(() => expect(screen.getByText('Buzz')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/toy name/i), { target: { value: 'Woody' } })
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: 'woody.jpg' } })
    fireEvent.change(screen.getByLabelText(/likes/i), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /add toy/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/toys', expect.objectContaining({ method: 'POST' })))

    fireEvent.click(screen.getAllByRole('button', { name: /like/i })[0])
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/toys/2', expect.objectContaining({ method: 'PATCH' })))

    fireEvent.click(screen.getAllByRole('button', { name: /donate/i })[0])
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/toys/2', expect.objectContaining({ method: 'DELETE' })))
  })
})
