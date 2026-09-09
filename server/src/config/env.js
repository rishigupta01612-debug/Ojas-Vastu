import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const projectDirectory = path.resolve(serverDirectory, '..')

// Load the project environment first. Blank values in server/.env do not override it.
dotenv.config({ path: path.join(projectDirectory, '.env') })
dotenv.config({ path: path.join(serverDirectory, '.env') })

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name] || fallback)
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`)
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberFromEnv('PORT', 5000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: numberFromEnv('SMTP_PORT', 587),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
  },
}

export function validateProductionConfig() {
  if (env.nodeEnv !== 'production') return
  const required = [['MONGODB_URI', env.mongoUri]]
  const missing = required.filter(([, value]) => !value).map(([name]) => name)
  if (missing.length) throw new Error(`Missing production configuration: ${missing.join(', ')}`)
}