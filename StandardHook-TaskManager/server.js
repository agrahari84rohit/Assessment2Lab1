import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dbPath = resolve(process.cwd(), 'db.json')
const port = 3001

function withCors(response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function readTasks() {
  const content = await readFile(dbPath, 'utf8')
  return JSON.parse(content)
}

async function writeTasks(tasks) {
  await writeFile(dbPath, JSON.stringify(tasks, null, 2), 'utf8')
}

const server = createServer(async (request, response) => {
  withCors(response)

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  if (request.url === '/tasks' && request.method === 'GET') {
    const tasks = await readTasks()
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(tasks))
    return
  }

  if (request.url === '/tasks' && request.method === 'POST') {
    const body = await getBody(request)
    const tasks = await readTasks()
    const task = {
      id: Date.now(),
      title: body.title,
      completed: Boolean(body.completed),
    }

    tasks.unshift(task)
    await writeTasks(tasks)

    response.writeHead(201, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(task))
    return
  }

  const taskMatch = request.url?.match(/^\/tasks\/([0-9]+)$/)

  if (taskMatch && request.method === 'PATCH') {
    const taskId = Number(taskMatch[1])
    const body = await getBody(request)
    const tasks = await readTasks()

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: Boolean(body.completed) } : task,
    )

    await writeTasks(updatedTasks)

    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ ok: true }))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ error: 'Not found' }))
})

async function getBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? chunk : chunk.toString())
  }

  const raw = chunks.join('')

  return raw ? JSON.parse(raw) : {}
}

server.listen(port, () => {
  console.log(`Task API running at http://localhost:${port}`)
})
