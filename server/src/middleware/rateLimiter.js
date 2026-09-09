import rateLimit from 'express-rate-limit'

export const apiRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many requests. Please try again later.' } })
export const chatRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many chat requests. Please try again later.' } })