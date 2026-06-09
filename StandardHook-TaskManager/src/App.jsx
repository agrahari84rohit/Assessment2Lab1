import React, { useEffect, useId, useState } from 'react'
import './App.css'
import { useTaskContext } from './TaskContext'

function App() {
  // Use a stable id for the task form and keep the search input focused for quick entry.
  const taskInputId = useId()
  const [taskName, setTaskName] = useState('')
  const { tasks, addTask, toggleComplete, searchTerm, setSearchTerm, searchInputRef } =
    useTaskContext()

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [searchInputRef])

  const handleSubmit = (event) => {
    event.preventDefault()

    addTask(taskName)
    setTaskName('')
  }

  return (
    <main className="app-shell">
      <section className="panel panel-hero">
        <p className="eyebrow">React Task Manager</p>
        <h1>Keep your work moving with a simple task board.</h1>
        <p className="lede">
          Add tasks, search the list instantly, and mark items complete from one shared
          state provider.
        </p>
      </section>

      <section className="panel panel-controls">
        <label className="field-label" htmlFor={taskInputId}>
          New task
        </label>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            id={taskInputId}
            type="text"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
            placeholder="Add a task to your board"
            autoComplete="off"
          />
          <button type="submit">Add task</button>
        </form>

        <label className="field-label" htmlFor="task-search">
          Search tasks
        </label>
        <input
          id="task-search"
          ref={searchInputRef}
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by title"
        />
      </section>

      <section className="panel panel-list">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Active tasks</p>
            <h2>Today&apos;s focus</h2>
          </div>
          <span className="task-count">{tasks.length} visible</span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks match the current search.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
                <button
                  type="button"
                  className="task-toggle"
                  aria-label={`Toggle ${task.title}`}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.completed ? '✓' : '○'}
                </button>
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  <span>{task.completed ? 'Completed' : 'In progress'}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
