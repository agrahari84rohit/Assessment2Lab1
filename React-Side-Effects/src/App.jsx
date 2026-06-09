import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [joke, setJoke] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJoke = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'https://v2.jokeapi.dev/joke/Programming?type=single'
      )

      if (!response.ok) {
        throw new Error('Unable to load a programming joke right now.')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.message || 'Unable to load a programming joke right now.')
      }

      setJoke(data.joke || `${data.setup} ${data.delivery}`)
    } catch {
      setError('Sorry, we could not load a joke. Please try again.')
      setJoke('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJoke()
  }, [])

  return (
    <main style={{ maxWidth: '32rem', margin: '0 auto', padding: '2rem' }}>
      <h1>Programming Joke</h1>
      <p>{loading ? 'Loading joke...' : error || joke}</p>
      <button type="button" onClick={fetchJoke} disabled={loading}>
        Get another joke
      </button>
    </main>
  )
}

export default App
