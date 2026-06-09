import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

let toys = [
  { id: 1, name: 'Buzz', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', likes: 0, donated: false },
  { id: 2, name: 'Woody', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', likes: 0, donated: false },
]

app.get('/toys', (_req, res) => {
  res.json(toys)
})

app.post('/toys', (req, res) => {
  const { name, image, likes = 0 } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Toy name is required.' })
  }

  const newToy = {
    id: Date.now(),
    name,
    image: image || 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?auto=format&fit=crop&w=800&q=80',
    likes: Number(likes) || 0,
    donated: false,
  }

  toys = [newToy, ...toys]
  res.status(201).json(newToy)
})

app.patch('/toys/:id', (req, res) => {
  const { id } = req.params
  const toy = toys.find((item) => item.id === Number(id))

  if (!toy) {
    return res.status(404).json({ message: 'Toy not found.' })
  }

  toy.likes = (toy.likes || 0) + 1
  res.json(toy)
})

app.delete('/toys/:id', (req, res) => {
  const { id } = req.params
  const existing = toys.find((item) => item.id === Number(id))

  if (!existing) {
    return res.status(404).json({ message: 'Toy not found.' })
  }

  toys = toys.filter((item) => item.id !== Number(id))
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Toy Tales backend listening on http://localhost:${PORT}`)
})
