import { Link, useOutletContext } from 'react-router-dom'

const DirectorList = () => {
  const { directors } = useOutletContext()

  if (!directors.length) {
    return <p>No directors available yet.</p>
  }

  return (
    <ul>
      {directors.map((director) => (
        <li key={director.id}>
          <Link to={`/directors/${director.id}`}>{director.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default DirectorList
