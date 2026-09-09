import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

function configured() { return Boolean(env.smtp.host && env.smtp.user && env.smtp.password && env.smtp.from) }

export async function sendBookingEmails(booking) {
  if (!configured()) { console.log('Email notifications disabled: SMTP is not configured'); return }
  const transporter = nodemailer.createTransport({ host: env.smtp.host, port: env.smtp.port, secure: env.smtp.port === 465, auth: { user: env.smtp.user, pass: env.smtp.password } })
  const message = { from: env.smtp.from, to: booking.email, subject: 'Ojas consultation booking received', text: `Your consultation request for ${booking.service} on ${booking.dateKey} at ${booking.time} is ${booking.bookingStatus}.` }
  await transporter.sendMail(message)
  if (env.smtp.adminEmail) await transporter.sendMail({ ...message, to: env.smtp.adminEmail, subject: 'New Ojas consultation booking' })
}