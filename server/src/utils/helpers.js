import crypto from 'node:crypto'

export const SERVICES = {
  'Numerology reading — ₹2,500': 250000,
  'Vastu consultation (home) — ₹5,000': 500000,
  'Vastu consultation (office) — ₹6,000': 600000,
  'Name & birth-date correction — ₹1,800': 180000,
  'Compatibility reading — ₹2,000': 200000,
  'Annual forecast — ₹1,500': 150000,
}

export const BOOKING_TIMES = ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '4:30 PM', '6:00 PM']
export const CONSULTATION_MODES = ['Video call', 'In person', 'Phone']

export function dateKeyFromInput(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

export function timingSafeSignature(expected, received) {
  if (!expected || !received || expected.length !== received.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))
}

export function razorpaySignature(orderId, paymentId, secret) {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
}

export function webhookSignature(rawBody, secret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
}