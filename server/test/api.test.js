import assert from 'node:assert/strict'
import { test } from 'node:test'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { Booking } from '../src/models/Booking.js'
import { razorpaySignature, timingSafeSignature } from '../src/utils/helpers.js'

const app = createApp()

test('GET /api/health reports the backend status', async () => {
  const response = await request(app).get('/api/health')
  assert.equal(response.status, 200)
  assert.equal(response.body.success, true)
  assert.equal(response.body.message, 'Backend is running')
})

test('POST /api/chat rejects an invalid conversation', async () => {
  const response = await request(app).post('/api/chat').send({ messages: [] })
  assert.equal(response.status, 400)
  assert.equal(response.body.success, false)
})

test('POST /api/bookings validates all required fields', async () => {
  const response = await request(app).post('/api/bookings').send({ name: 'A' })
  assert.equal(response.status, 400)
  assert.equal(response.body.success, false)
})

test('POST /api/payment/create-order requires a booking id', async () => {
  const response = await request(app).post('/api/payment/create-order').send({})
  assert.equal(response.status, 400)
  assert.equal(response.body.success, false)
})

test('booking model has a database-level unique date/time index', () => {
  const indexes = Booking.schema.indexes()
  assert.ok(indexes.some(([fields, options]) => fields.dateKey === 1 && fields.time === 1 && options.unique === true))
})

test('Razorpay payment signatures verify with the server secret', () => {
  const signature = razorpaySignature('order_123', 'pay_123', 'test-secret')
  assert.equal(timingSafeSignature(signature, signature), true)
  assert.equal(timingSafeSignature(signature, `${signature}x`), false)
})