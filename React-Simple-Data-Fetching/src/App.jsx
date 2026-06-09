import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [dogImage, setDogImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDogImage = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random')

      if (!response.ok) {
        throw new Error('Unable to fetch a dog image right now.')
      }

      const data = await response.json()

      if (!data.message) {
        throw new Error('The dog image response was empty.')
      }

      setDogImage(data.message)
    } catch {
      setError('Sorry, we could not load a dog image. Please try again.')
      setDogImage('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDogImage()
  }, [])

  return (
    <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '2rem' }}>
      <h1>Dog Image Generator</h1>
      <p>{loading ? 'Loading dog image...' : error || 'Here is your dog image!'}</p>
      <button type="button" onClick={fetchDogImage} disabled={loading}>
        Fetch another dog
      </button>
      {dogImage ? <img src={dogImage} alt="Dog image" style={{ marginTop: '1rem', maxWidth: '100%', borderRadius: '12px' }} /> : null}
    </main>
  )
}

export default App
