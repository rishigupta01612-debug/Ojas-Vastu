import { createBooking, getAvailability } from '../services/bookingService.js'

export async function createBookingController(request, response, next) {
  try {
    const booking = await createBooking(request.validatedBody)
    return response.status(201).json({ success: true, data: { booking: { id: booking.id, status: booking.bookingStatus, paymentStatus: booking.paymentStatus } } })
  } catch (error) { return next(error) }
}

export async function availabilityController(request, response, next) {
  try { return response.json({ success: true, data: { booked: await getAvailability(request.validatedQuery?.date) } }) } catch (error) { return next(error) }
}