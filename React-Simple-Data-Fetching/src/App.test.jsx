import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads a dog image on mount and shows a button to fetch another one', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg' }),
    })

    render(<App />)

    expect(screen.getByText(/loading dog image/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /dog image/i })).toHaveAttribute(
        'src',
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg'
      )
    })

    expect(screen.getByRole('button', { name: /fetch another dog/i })).toBeInTheDocument()
  })
})
