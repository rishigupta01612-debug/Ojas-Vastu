import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { env } from './env.js'
import { Booking } from '../models/Booking.js'

export const databaseState = { status: 'disconnected' }

let memoryServer = null

async function startMemoryMongo() {
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  process.env.MONGODB_URI = uri
  env.mongoUri = uri
  return uri
}

export async function connectDatabase() {
  if (!env.mongoUri) {
    if (env.nodeEnv === 'production') {
      databaseState.status = 'not-configured'
      return false
    }

    console.warn('MONGODB_URI is not configured. Starting an in-memory MongoDB server for local development.')
    await startMemoryMongo()
  }

  try {
    await mongoose.connect(env.mongoUri, {
      dbName: 'ojas_numerology',
      serverSelectionTimeoutMS: 5000,
    })
  } catch (error) {
    if (env.nodeEnv === 'production') {
      databaseState.status = 'not-configured'
      throw error
    }

    console.warn(`Primary MongoDB connection failed (${error.message}). Starting an in-memory MongoDB server as local fallback.`)
    await startMemoryMongo()
    await mongoose.connect(env.mongoUri, {
      dbName: 'ojas_numerology',
      serverSelectionTimeoutMS: 5000,
    })
  }

  await Booking.init()
  databaseState.status = 'connected'
  return true
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
  if (memoryServer) {
    await memoryServer.stop()
    memoryServer = null
  }
  databaseState.status = 'disconnected'
}