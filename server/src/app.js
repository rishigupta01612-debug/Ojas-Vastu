import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { databaseState } from './config/database.js'
import { apiRateLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { chatRoutes } from './routes/chatRoutes.js'
import { bookingRoutes } from './routes/bookingRoutes.js'
import { paymentRoutes } from './routes/paymentRoutes.js'

export function createApp() {
  const app = express()
  app.use(helmet())
  const allowedOrigins = new Set([env.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'])
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)), credentials: false }))
  app.use('/api/payment/webhook', express.raw({ type: 'application/json', limit: '100kb' }))
  app.use(express.json({ limit: '100kb' }))
  app.use('/api', apiRateLimiter)
  app.get('/api/health', (_request, response) => response.json({ success: true, message: 'Backend is running', database: databaseState.status }))
  app.use('/api/chat', chatRoutes)
  app.use('/api/bookings', bookingRoutes)
  app.use('/api/payment', paymentRoutes)
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}