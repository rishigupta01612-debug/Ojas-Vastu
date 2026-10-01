import http from 'node:http'
import { createApp } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env, validateProductionConfig } from './config/env.js'

validateProductionConfig()
const app = createApp()
const server = http.createServer(app)
try {
  await connectDatabase()
} catch (error) {
  console.error(`Database connection failed: ${error.message}`)
}
server.listen(env.port, () => console.log(`Ojas backend listening on http://localhost:${env.port}`))

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`)
  server.close(async () => { await disconnectDatabase(); process.exit(0) })
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))