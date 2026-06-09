import React, { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001'

function App() {
  const [plants, setPlants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', price: '', image: '' })

  // Load the current plant inventory from the backend when the app starts.
  const fetchPlants = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/plants`)
      if (!response.ok) {
        throw new Error('Unable to load plants right now.')
      }

      const data = await response.json()
      setPlants(data)
    } catch {
      setError('Unable to connect to the plant shop API. Start the backend with npm run server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  // Keep the display list in sync with the search text entered by the user.
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Save a newly created plant to the backend and update local state.
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to add plant.')
      }

      const newPlant = await response.json()
      setPlants((currentPlants) => [...currentPlants, newPlant])
      setFormData({ name: '', price: '', image: '' })
    } catch {
      setError('Unable to add the plant. Please try again.')
    }
  }

  // Toggle the sold-out flag on an existing plant card.
  const handleToggleSoldOut = async (plant) => {
    try {
      const response = await fetch(`${API_URL}/plants/${plant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soldOut: !plant.soldOut }),
      })

      if (!response.ok) {
        throw new Error('Unable to update plant status.')
      }

      const updatedPlant = await response.json()
      setPlants((currentPlants) =>
        currentPlants.map((item) => (item.id === updatedPlant.id ? updatedPlant : item))
      )
    } catch {
      setError('Unable to update the plant status.')
    }
  }

  return (
    <main className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Plant Shop</p>
          <h1>Browse, add, and manage every plant in your collection.</h1>
          <p className="lead">The page loads plants from the backend, lets you add a new one, and marks plants as sold out.</p>
        </div>
        <form className="plant-form" onSubmit={handleSubmit}>
          <label>
            Plant name
            <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
          </label>
          <label>
            Price
            <input type="number" min="0" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} required />
          </label>
          <label>
            Image URL
            <input value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} />
          </label>
          <button type="submit">Add plant</button>
        </form>
      </header>

      <section className="toolbar-card">
        <label className="search-box">
          Search plants
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name"
          />
        </label>
        <p className="status-text">Showing {filteredPlants.length} of {plants.length} plants</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? <p>Loading plants...</p> : null}

      <section className="plants-grid">
        {filteredPlants.map((plant) => (
          <article className="plant-card" key={plant.id}>
            <img src={plant.image} alt={plant.name} />
            <div className="plant-copy">
              <h2>{plant.name}</h2>
              <p>${plant.price}</p>
              <button
                type="button"
                className={plant.soldOut ? 'sold-out-btn' : 'inventory-btn'}
                onClick={() => handleToggleSoldOut(plant)}
              >
                {plant.soldOut ? 'Sold out' : 'Mark sold out'}
              </button>
            </div>
          </article>
        ))}

        {!loading && filteredPlants.length === 0 ? <p>No plants match your search.</p> : null}
      </section>
    </main>
  )
}

export default App
