import { Router } from 'express'
import { createPaymentOrderController, verifyPaymentController, webhookController } from '../controllers/paymentController.js'
import { validate, paymentOrderSchema, paymentVerifySchema } from '../middleware/validation.js'
import { apiRateLimiter } from '../middleware/rateLimiter.js'

export const paymentRoutes = Router()
paymentRoutes.post('/webhook', webhookController)
paymentRoutes.post('/create-order', apiRateLimiter, validate(paymentOrderSchema), createPaymentOrderController)
paymentRoutes.post('/verify', apiRateLimiter, validate(paymentVerifySchema), verifyPaymentController)