import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const TaskContext = createContext(null)

const fallbackTasks = [
  { id: 1, title: 'Review roadmap', completed: false },
  { id: 2, title: 'Ship feature', completed: true },
]

export function TaskProvider({ children }) {
  // Share task data, mutations, and filtering across the app.
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)

  const loadTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks')
      if (!response.ok) {
        throw new Error('Unable to load tasks')
      }

      const data = await response.json()
      setTasks(Array.isArray(data) ? data : fallbackTasks)
    } catch (error) {
      setTasks(fallbackTasks)
      console.error('Unable to load tasks from the server.', error)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const addTask = async (taskTitle) => {
    const title = taskTitle.trim()

    if (!title) {
      return
    }

    const task = { title, completed: false }

    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error('Unable to save task')
      }

      await loadTasks()
    } catch (error) {
      const optimisticTask = { id: Date.now(), ...task }
      setTasks((currentTasks) => [optimisticTask, ...currentTasks])
      console.error('Unable to save the task to the backend.', error)
    }
  }

  const toggleComplete = async (taskId) => {
    const currentTask = tasks.find((task) => task.id === taskId)

    if (!currentTask) {
      return
    }

    const nextCompleted = !currentTask.completed

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: nextCompleted } : task,
      ),
    )

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextCompleted }),
      })

      if (!response.ok) {
        throw new Error('Unable to update task')
      }

      await loadTasks()
    } catch (error) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, completed: currentTask.completed } : task,
        ),
      )
      console.error('Unable to update the task in the backend.', error)
    }
  }

  const filteredTasks = useMemo(() => {
    // Keep the list responsive by filtering the shared task state in one place.
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return tasks
    }

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query),
    )
  }, [searchTerm, tasks])

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        addTask,
        toggleComplete,
        searchTerm,
        setSearchTerm,
        searchInputRef,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }

  return context
}

export { TaskContext }
