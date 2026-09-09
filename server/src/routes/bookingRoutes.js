import { Router } from 'express'
import { availabilityController, createBookingController } from '../controllers/bookingController.js'
import { validate, availabilitySchema, bookingSchema } from '../middleware/validation.js'
import { apiRateLimiter } from '../middleware/rateLimiter.js'

export const bookingRoutes = Router()
bookingRoutes.post('/', apiRateLimiter, validate(bookingSchema), createBookingController)
bookingRoutes.get('/availability', apiRateLimiter, (request, _response, next) => { const result = availabilitySchema.safeParse(request.query); if (!result.success) { const error = new Error('Invalid availability date'); error.statusCode = 400; return next(error) } request.validatedQuery = result.data; return next() }, availabilityController)