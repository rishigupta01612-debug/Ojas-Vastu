import { getRazorpayClient } from '../config/payment.js'
import { env } from '../config/env.js'
import { Booking } from '../models/Booking.js'
import { SERVICES, razorpaySignature, timingSafeSignature, webhookSignature } from '../utils/helpers.js'
import { requireDatabase } from './bookingService.js'
import { sendBookingEmails } from './emailService.js'

export async function createPaymentOrder(bookingId) {
  requireDatabase()
  const client = getRazorpayClient()
  if (!client) { const error = new Error('Payment gateway is not configured'); error.statusCode = 503; throw error }
  const booking = await Booking.findById(bookingId)
  if (!booking) { const error = new Error('Booking not found'); error.statusCode = 404; throw error }
  if (booking.paymentStatus === 'paid') { const error = new Error('Booking is already paid'); error.statusCode = 409; throw error }
  const amount = SERVICES[booking.service]
  const order = await client.orders.create({ amount, currency: 'INR', receipt: `booking_${booking.id}`, notes: { bookingId: booking.id } })
  booking.paymentStatus = 'created'
  booking.paymentOrderId = order.id
  await booking.save()
  return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.razorpayKeyId, bookingId: booking.id }
}

export async function verifyPayment(data) {
  requireDatabase()
  if (!env.razorpayKeySecret) { const error = new Error('Payment gateway is not configured'); error.statusCode = 503; throw error }
  const booking = await Booking.findById(data.bookingId)
  if (!booking) { const error = new Error('Booking not found'); error.statusCode = 404; throw error }
  if (booking.paymentStatus === 'paid') return booking
  if (booking.paymentOrderId !== data.razorpayOrderId) { const error = new Error('Payment order does not match booking'); error.statusCode = 400; throw error }
  const expected = razorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, env.razorpayKeySecret)
  if (!timingSafeSignature(expected, data.razorpaySignature)) { const error = new Error('Payment signature verification failed'); error.statusCode = 400; throw error }
  booking.paymentStatus = 'paid'
  booking.paymentId = data.razorpayPaymentId
  booking.bookingStatus = 'confirmed'
  await booking.save()
  console.log(`Payment verified for booking ${booking.id}`)
  await sendBookingEmails(booking)
  return booking
}

export function verifyWebhook(rawBody, signature) {
  if (!env.razorpayWebhookSecret || !timingSafeSignature(webhookSignature(rawBody, env.razorpayWebhookSecret), signature)) {
    const error = new Error('Webhook signature verification failed')
    error.statusCode = 400
    throw error
  }
}