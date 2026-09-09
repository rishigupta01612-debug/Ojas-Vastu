import { createPaymentOrder, verifyPayment, verifyWebhook } from '../services/paymentService.js'

export async function createPaymentOrderController(request, response, next) {
  try { return response.status(201).json({ success: true, data: await createPaymentOrder(request.validatedBody.bookingId) }) } catch (error) { return next(error) }
}

export async function verifyPaymentController(request, response, next) {
  try { const booking = await verifyPayment(request.validatedBody); return response.json({ success: true, data: { booking: { id: booking.id, status: booking.bookingStatus, paymentStatus: booking.paymentStatus } } }) } catch (error) { return next(error) }
}

export async function webhookController(request, response, next) {
  try {
    verifyWebhook(request.body, request.get('x-razorpay-signature'))
    const event = JSON.parse(request.body.toString('utf8'))
    console.log(`Razorpay webhook received: ${event.event || 'unknown event'}`)
    return response.json({ success: true, data: { received: true } })
  } catch (error) { return next(error) }
}