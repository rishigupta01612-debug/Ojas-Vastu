import { getRazorpayClient } from '../config/payment.js'
import { env } from '../config/env.js'
import { Booking } from '../models/Booking.js'
import { SERVICES, razorpaySignature, timingSafeSignature, webhookSignature } from '../utils/helpers.js'
import { requireDatabase } from './bookingService.js'
import { sendBookingEmails } from './emailService.js'

function httpError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function sendConfirmationEmail(booking, retryOnFailure) {
  if (booking.confirmationEmailSentAt) return true

  const claimedAt = new Date()
  const claim = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      paymentStatus: 'paid',
      confirmationEmailSentAt: null,
      $or: [
        { confirmationEmailClaimedAt: null },
        { confirmationEmailClaimedAt: { $lt: new Date(claimedAt.getTime() - 10 * 60 * 1000) } },
      ],
    },
    { $set: { confirmationEmailClaimedAt: claimedAt } },
    { new: true },
  )

  if (!claim) {
    const currentBooking = await Booking.findById(booking._id)
    const emailSent = Boolean(currentBooking?.confirmationEmailSentAt)
    if (retryOnFailure && !emailSent) throw httpError('Payment confirmation email delivery is already in progress', 503)
    return emailSent
  }

  try {
    await sendBookingEmails(claim, { confirmed: true })
    claim.confirmationEmailSentAt = new Date()
    claim.confirmationEmailClaimedAt = null
    await claim.save()
    return true
  } catch (error) {
    console.error(`Payment confirmation email failed for booking ${booking.id}: ${error.message}`)
    await Booking.updateOne({ _id: claim._id, confirmationEmailClaimedAt: claimedAt }, { $unset: { confirmationEmailClaimedAt: 1 } })
    if (retryOnFailure) throw error
    return false
  }
}

async function markBookingPaid(booking, orderId, paymentId, { retryOnEmailFailure = false } = {}) {
  const updatedBooking = await Booking.findOneAndUpdate(
    { _id: booking._id, paymentOrderId: orderId, paymentStatus: { $ne: 'paid' } },
    { $set: { paymentStatus: 'paid', paymentId, paidAt: new Date(), bookingStatus: 'confirmed' } },
    { new: true },
  )

  if (updatedBooking) {
    console.log(`Payment verified for booking ${updatedBooking.id}`)
    updatedBooking.confirmationEmailSent = await sendConfirmationEmail(updatedBooking, retryOnEmailFailure)
    return updatedBooking
  }

  const currentBooking = await Booking.findById(booking._id)
  if (currentBooking?.paymentStatus === 'paid' && currentBooking.paymentOrderId === orderId) {
    currentBooking.confirmationEmailSent = await sendConfirmationEmail(currentBooking, retryOnEmailFailure)
    return currentBooking
  }
  throw httpError('Booking payment state changed before it could be confirmed', 409)
}

export async function createPaymentOrder(bookingId) {
  requireDatabase()
  const client = getRazorpayClient()
  if (!client) throw httpError('Payment gateway is not configured', 503)
  const booking = await Booking.findById(bookingId)
  if (!booking) throw httpError('Booking not found', 404)
  if (booking.paymentStatus === 'paid') throw httpError('Booking is already paid', 409)
  const amount = SERVICES[booking.service]
  const order = await client.orders.create({ amount, currency: 'INR', receipt: `booking_${booking.id}`, notes: { bookingId: booking.id } })
  booking.paymentStatus = 'created'
  booking.paymentOrderId = order.id
  await booking.save()
  return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.razorpayKeyId, bookingId: booking.id }
}

export async function verifyPayment(data) {
  requireDatabase()
  if (!env.razorpayKeySecret) throw httpError('Payment gateway is not configured', 503)
  const booking = await Booking.findById(data.bookingId)
  if (!booking) throw httpError('Booking not found', 404)
  if (booking.paymentOrderId !== data.razorpayOrderId) throw httpError('Payment order does not match booking', 400)
  const expected = razorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, env.razorpayKeySecret)
  if (!timingSafeSignature(expected, data.razorpaySignature)) throw httpError('Payment signature verification failed', 400)
  return markBookingPaid(booking, data.razorpayOrderId, data.razorpayPaymentId)
}

export async function processPaymentWebhook(event) {
  if (!['payment.captured', 'order.paid'].includes(event?.event)) return false
  const payment = event.payload?.payment?.entity
  const orderId = payment?.order_id || event.payload?.order?.entity?.id
  const paymentId = payment?.id
  if (!orderId || !paymentId) {
    console.error(`Razorpay ${event.event} webhook is missing payment details`)
    return false
  }

  const booking = await Booking.findOne({ paymentOrderId: orderId })
  if (!booking) {
    console.error(`Razorpay payment ${paymentId} has no matching booking for order ${orderId}`)
    return false
  }
  if (payment.amount !== SERVICES[booking.service] || payment.currency !== 'INR') {
    console.error(`Razorpay payment ${paymentId} has an unexpected amount or currency for booking ${booking.id}`)
    return false
  }

  await markBookingPaid(booking, orderId, paymentId, { retryOnEmailFailure: true })
  return true
}

export function verifyWebhook(rawBody, signature) {
  if (!env.razorpayWebhookSecret || !timingSafeSignature(webhookSignature(rawBody, env.razorpayWebhookSecret), signature)) {
    const error = new Error('Webhook signature verification failed')
    error.statusCode = 400
    throw error
  }
}