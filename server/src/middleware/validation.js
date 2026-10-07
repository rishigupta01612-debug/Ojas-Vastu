import { z } from 'zod'
import { BOOKING_TIMES, CONSULTATION_MODES, SERVICES } from '../utils/helpers.js'

export const chatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000) })).min(1).max(30),
  system: z.string().trim().max(5000).optional(),
})

const dateOnly = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  }, 'Invalid date')

function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  service: z.string().refine((value) => Object.hasOwn(SERVICES, value), 'Invalid service'),
  mode: z.enum(CONSULTATION_MODES),
  date: dateOnly.refine((value) => value >= localDateKey(new Date()), 'Date cannot be in the past'),
  slot: z.string().refine((value) => BOOKING_TIMES.includes(value), 'Invalid time slot'),
  notes: z.string().trim().max(1000).optional(),
})

export const availabilitySchema = z.object({ date: dateOnly.optional() })

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