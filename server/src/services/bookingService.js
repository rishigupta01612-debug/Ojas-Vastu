import { Booking } from '../models/Booking.js'
import { databaseState } from '../config/database.js'
import { dateKeyFromInput } from '../utils/helpers.js'
import { sendBookingEmails } from './emailService.js'

export function requireDatabase() {
  if (databaseState.status !== 'connected') {
    const error = new Error('Database is not configured or connected')
    error.statusCode = 503
    throw error
  }
}

export async function createBooking(data) {
  requireDatabase()
  const dateKey = dateKeyFromInput(data.date)
  const booking = await Booking.create({ name: data.name, email: data.email, phone: data.phone, service: data.service, consultationMode: data.mode, date: data.date, dateKey, time: data.slot, notes: data.notes || '' })
  console.log(`Booking created for ${booking.email} on ${booking.dateKey} at ${booking.time}`)
  let confirmationEmailSent = false
  try {
    await sendBookingEmails(booking)
    confirmationEmailSent = true
  } catch (error) {
    console.error(`Booking ${booking.id} was saved, but its confirmation email failed: ${error.message}`)
  }
  if (confirmationEmailSent) {
    try {
      await Booking.updateOne({ _id: booking._id }, { $set: { confirmationEmailSentAt: new Date() } })
    } catch (error) {
      console.error(`Booking ${booking.id} confirmation email was sent, but its sent timestamp could not be saved: ${error.message}`)
    }
  }
  return { booking, confirmationEmailSent }
}

export async function getAvailability(date) {
  requireDatabase()
  const dateKey = date ? dateKeyFromInput(date) : null
  const query = dateKey ? { dateKey } : {}
  const bookings = await Booking.find(query).select('dateKey time -_id').lean()
  return bookings
}