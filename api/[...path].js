import { createApp } from '../server/src/app.js'
import { connectDatabase, databaseState } from '../server/src/config/database.js'

const app = createApp()
let databaseConnection

async function ensureDatabaseConnection() {
  if (databaseState.status === 'connected') return

  if (!databaseConnection) {
    databaseConnection = connectDatabase().catch((error) => {
      databaseConnection = null
      throw error
    })
  }

  await databaseConnection
}

export default async function handler(request, response) {
  try {
    await ensureDatabaseConnection()
  } catch (error) {
    console.error(`Vercel API database connection failed: ${error.message}`)
    return response.status(503).json({ success: false, message: 'Database is unavailable.' })
  }

  return app(request, response)
}
