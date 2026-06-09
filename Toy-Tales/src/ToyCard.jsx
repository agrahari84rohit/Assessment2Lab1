import React from 'react'

function ToyCard({ toy, onLike, onDonate }) {
  return (
    <article className="toy-card">
      <img src={toy.image} alt={toy.name} />
      <div className="toy-copy">
        <h2>{toy.name}</h2>
        <p>{toy.likes} likes</p>
        <div className="toy-actions">
          <button type="button" onClick={() => onLike(toy)}>
            Like
          </button>
          <button type="button" className="donate-btn" onClick={() => onDonate(toy)}>
            Donate
          </button>
        </div>
      </div>
    </article>
  )
}

export default ToyCard
