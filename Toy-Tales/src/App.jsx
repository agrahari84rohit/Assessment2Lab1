import React, { useEffect, useState } from 'react'
import './App.css'
import ToyCard from './ToyCard'

const API_URL = 'http://localhost:3001'

function App() {
  const [toys, setToys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', image: '', likes: '0' })

  // Load every toy from the backend when the app starts.
  const fetchToys = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/toys`)
      if (!response.ok) throw new Error('Unable to fetch toys.')

      const data = await response.json()
      setToys(data)
    } catch {
      setError('Unable to connect to the Toy Tales API. Start the server first.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchToys()
  }, [])

  // Add a toy through the backend and update the list immediately.
  const handleAddToy = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${API_URL}/toys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          likes: Number(formData.likes) || 0,
        }),
      })

      if (!response.ok) throw new Error('Unable to add toy.')

      const newToy = await response.json()
      setToys((currentToys) => [newToy, ...currentToys])
      setFormData({ name: '', image: '', likes: '0' })
    } catch {
      setError('Unable to add the toy. Please try again.')
    }
  }

  // Increase the likes for a selected toy and preserve the list order.
  const handleLike = async (toy) => {
    try {
      const response = await fetch(`${API_URL}/toys/${toy.id}`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Unable to update likes.')

      const updatedToy = await response.json()
      setToys((currentToys) =>
        currentToys.map((item) => (item.id === updatedToy.id ? updatedToy : item))
      )
    } catch {
      setError('Unable to update likes right now.')
    }
  }

  // Remove a toy from the backend and the page.
  const handleDonate = async (toy) => {
    try {
      const response = await fetch(`${API_URL}/toys/${toy.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Unable to donate toy.')

      setToys((currentToys) => currentToys.filter((item) => item.id !== toy.id))
    } catch {
      setError('Unable to donate the toy. Please try again.')
    }
  }

  return (
    <main className="app-shell">
      <header className="hero-card">
        <section>
          <p className="eyebrow">Toy Tales</p>
          <h1>Bring your toy collection to life.</h1>
          <p className="lead">Load toys from the backend, add a new favorite, and keep your collection up to date.</p>
        </section>

        <form className="toy-form" onSubmit={handleAddToy}>
          <label htmlFor="toy-name">Toy name</label>
          <input id="toy-name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />

          <label htmlFor="toy-image">Image URL</label>
          <input id="toy-image" value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} />

          <label htmlFor="toy-likes">Likes</label>
          <input id="toy-likes" type="number" min="0" value={formData.likes} onChange={(event) => setFormData({ ...formData, likes: event.target.value })} />

          <button type="submit">Add toy</button>
        </form>
      </header>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading toys...</p> : null}

      <section className="toy-grid">
        {toys.map((toy) => (
          <ToyCard key={toy.id} toy={toy} onLike={handleLike} onDonate={handleDonate} />
        ))}
      </section>
    </main>
  )
}

export default App
