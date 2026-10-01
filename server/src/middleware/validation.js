import { z } from 'zod'
import { BOOKING_TIMES, CONSULTATION_MODES, SERVICES } from '../utils/helpers.js'

export const chatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000) })).min(1).max(30),
  system: z.string().trim().max(5000).optional(),
})

export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  service: z.string().refine((value) => Object.hasOwn(SERVICES, value), 'Invalid service'),
  mode: z.enum(CONSULTATION_MODES),
  date: z.coerce.date().refine((value) => value >= new Date(new Date().setHours(0, 0, 0, 0)), 'Date cannot be in the past'),
  slot: z.string().refine((value) => BOOKING_TIMES.includes(value), 'Invalid time slot'),
  notes: z.string().trim().max(1000).optional(),
})

export const availabilitySchema = z.object({ date: z.coerce.date().optional() })

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid booking id')
export const paymentOrderSchema = z.object({ bookingId: objectId })
export const paymentVerifySchema = z.object({ bookingId: objectId, razorpayOrderId: z.string().min(1), razorpayPaymentId: z.string().min(1), razorpaySignature: z.string().min(1) })

export function validate(schema) {
  return (request, _response, next) => {
    const parsed = schema.safeParse(request.body)
    if (!parsed.success) {
      const error = new Error(parsed.error.issues.map((issue) => issue.message).join(', '))
      error.statusCode = 400
      return next(error)
    }
    request.validatedBody = parsed.data
    return next()
  }
}