import assert from 'node:assert/strict'
import { test } from 'node:test'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { bookingSchema } from '../src/middleware/validation.js'
import { Booking } from '../src/models/Booking.js'
import { createInvoicePdf } from '../src/services/invoiceService.js'
import { dateKeyFromInput, razorpaySignature, timingSafeSignature } from '../src/utils/helpers.js'

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

test('date-only booking input preserves its selected calendar day', () => {
  assert.equal(dateKeyFromInput('2026-10-07'), '2026-10-07')
  assert.equal(dateKeyFromInput('2026-02-30'), null)
})

test('booking validation accepts a calendar date without converting its timezone', () => {
  const parsed = bookingSchema.safeParse({
    name: 'Test Customer',
    email: 'test@example.com',
    service: 'Numerology reading — ₹2,500',
    mode: 'Video call',
    date: '2099-10-07',
    slot: '10:00 AM',
  })
  assert.equal(parsed.success, true)
  assert.equal(parsed.data.date, '2099-10-07')
  assert.equal(bookingSchema.safeParse({ ...parsed.data, date: '2099-02-30' }).success, false)
})

test('Razorpay payment signatures verify with the server secret', () => {
  const signature = razorpaySignature('order_123', 'pay_123', 'test-secret')
  assert.equal(timingSafeSignature(signature, signature), true)
  assert.equal(timingSafeSignature(signature, `${signature}x`), false)
})

test('paid booking invoice is generated as a PDF', async () => {
  const invoice = await createInvoicePdf({
    id: 'booking_123',
    name: 'Test Customer',
    email: 'test@example.com',
    service: 'Numerology reading — ₹2,500',
    dateKey: '2099-10-07',
    time: '10:00 AM',
    consultationMode: 'Video call',
    paymentId: 'pay_test123',
    paymentOrderId: 'order_test123',
    paidAt: new Date('2026-10-07T00:00:00.000Z'),
  })
  assert.ok(invoice.subarray(0, 8).toString('ascii').startsWith('%PDF-'))
  assert.ok(invoice.toString('latin1').includes('%%EOF'))
})