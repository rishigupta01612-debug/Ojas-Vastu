import { Router } from 'express'
import { chatController } from '../controllers/chatController.js'
import { validate, chatSchema } from '../middleware/validation.js'
import { chatRateLimiter } from '../middleware/rateLimiter.js'

export const chatRoutes = Router()
chatRoutes.post('/', chatRateLimiter, validate(chatSchema), chatController)