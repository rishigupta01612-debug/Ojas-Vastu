import { createPaymentOrder, processPaymentWebhook, verifyPayment, verifyWebhook } from '../services/paymentService.js'

export async function createPaymentOrderController(request, response, next) {
  try { return response.status(201).json({ success: true, data: await createPaymentOrder(request.validatedBody.bookingId) }) } catch (error) { return next(error) }
}

export async function verifyPaymentController(request, response, next) {
  try {
    const booking = await verifyPayment(request.validatedBody)
    return response.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          confirmationEmailSent: booking.confirmationEmailSent ?? Boolean(booking.confirmationEmailSentAt),
        },
      },
    })
  } catch (error) { return next(error) }
}

export async function webhookController(request, response, next) {
  try {
    verifyWebhook(request.body, request.get('x-razorpay-signature'))
    let event
    try {
      event = JSON.parse(request.body.toString('utf8'))
    } catch {
      const error = new Error('Invalid webhook payload')
      error.statusCode = 400
      throw error
    }
    const processed = await processPaymentWebhook(event)
    console.log(`Razorpay webhook received: ${event.event || 'unknown event'} (${processed ? 'processed' : 'ignored'})`)
    return response.json({ success: true, data: { received: true } })
  } catch (error) { return next(error) }
}