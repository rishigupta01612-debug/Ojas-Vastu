import mongoose from 'mongoose'
import { env } from './env.js'
import { Booking } from '../models/Booking.js'

export const databaseState = { status: 'disconnected' }

export async function connectDatabase() {
  if (!env.mongoUri) {
    databaseState.status = 'not-configured'
    return false
  }
  await mongoose.connect(env.mongoUri, {
    dbName: 'ojas_numerology',
    serverSelectionTimeoutMS: 5000,
  })
  await Booking.init()
  databaseState.status = 'connected'
  return true
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
  databaseState.status = 'disconnected'
}