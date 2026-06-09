import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

let plants = [
  { id: 1, name: 'Snake Plant', price: 18, image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80', soldOut: false },
  { id: 2, name: 'Monstera', price: 24, image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80', soldOut: false },
]

app.get('/plants', (_req, res) => {
  res.json(plants)
})

app.post('/plants', (req, res) => {
  const { name, price, image } = req.body

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' })
  }

  const newPlant = {
    id: Date.now(),
    name,
    price: Number(price),
    image: image || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80',
    soldOut: false,
  }

  plants = [...plants, newPlant]
  res.status(201).json(newPlant)
})

app.patch('/plants/:id', (req, res) => {
  const { id } = req.params
  const plant = plants.find((item) => item.id === Number(id))

  if (!plant) {
    return res.status(404).json({ message: 'Plant not found.' })
  }

  plant.soldOut = req.body.soldOut ?? plant.soldOut
  res.json(plant)
})

app.listen(PORT, () => {
  console.log(`PlantShop backend listening on http://localhost:${PORT}`)
})
