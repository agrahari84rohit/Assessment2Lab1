import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

function DirectorForm() {
  const { directors, setDirectors } = useOutletContext()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDirector = { id: uuidv4(), name: name.trim(), bio: bio.trim(), movies: [] }

    fetch('http://localhost:4000/directors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDirector),
    })
      .then((r) => {
        if (!r.ok) throw new Error('failed to add director')
        return r.json()
      })
      .then((data) => {
        setDirectors([...directors, data])
        navigate(`/directors/${data.id}`)
      })
      .catch((error) => console.error(error))
  }

  return (
    <div>
      <h2>Add New Director</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Director's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Director's Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
        <button type="submit">Add Director</button>
      </form>
    </div>
  )
}

export default DirectorForm
