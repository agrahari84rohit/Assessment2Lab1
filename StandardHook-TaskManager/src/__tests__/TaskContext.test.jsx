/** @vitest-environment jsdom */

import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import App from '../App'
import { TaskProvider } from '../TaskContext'

const initialTasks = [
  { id: 1, title: 'Review roadmap', completed: false },
  { id: 2, title: 'Ship feature', completed: true },
]

function createFetchMock() {
  const tasks = initialTasks.map((task) => ({ ...task }))

  return vi.fn(async (url, options) => {
    if (url === 'http://localhost:3001/tasks' && !options) {
      return {
        ok: true,
        json: async () => tasks,
      }
    }

    if (url === 'http://localhost:3001/tasks' && options?.method === 'POST') {
      const body = JSON.parse(options.body)
      tasks.unshift({ id: Date.now(), ...body })
      return {
        ok: true,
        json: async () => ({ ok: true }),
      }
    }

    if (url.startsWith('http://localhost:3001/tasks/') && options?.method === 'PATCH') {
      const taskId = Number(url.split('/').pop())
      const task = tasks.find((item) => item.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
      return {
        ok: true,
        json: async () => ({ ok: true }),
      }
    }

    return {
      ok: true,
      json: async () => [],
    }
  })
}

describe('Task manager flow', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock())
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('loads tasks, adds a new task, and toggles completion', async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>,
    )

    expect(await screen.findByText('Review roadmap')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/new task/i), {
      target: { value: 'Write release notes' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => expect(screen.getByText('Write release notes')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /toggle review roadmap/i }))

    await waitFor(() => {
      expect(screen.getByText('Review roadmap')).toBeInTheDocument()
    })
  })

  it('filters tasks with the search field', async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>,
    )

    expect(await screen.findByText('Ship feature')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/search tasks/i), {
      target: { value: 'review' },
    })

    await waitFor(() => {
      expect(screen.queryByText('Ship feature')).not.toBeInTheDocument()
      expect(screen.getByText('Review roadmap')).toBeInTheDocument()
    })
  })
})
