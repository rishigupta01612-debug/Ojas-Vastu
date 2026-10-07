import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import { SERVICES } from '../utils/helpers.js'
import { createInvoicePdf } from './invoiceService.js'

function isConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.password && env.smtp.from)
}

export function requireEmailConfiguration() {
  if (isConfigured()) return
  const error = new Error('Booking confirmation email is not configured')
  error.statusCode = 503
  error.publicMessage = 'Booking email is not set up yet. Please contact the site owner.'
  throw error
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function createBookingMessage(booking, confirmed) {
  const details = [
    ['Name', booking.name],
    ['Service', booking.service],
    ['Date', booking.dateKey],
    ['Time', booking.time],
    ['Consultation mode', booking.consultationMode],
  ]
  if (confirmed) {
    details.push(
      ['Amount paid', `INR ${(SERVICES[booking.service] / 100).toLocaleString('en-IN')}`],
      ['Payment ID', booking.paymentId],
    )
  }
  const textDetails = details.map(([label, value]) => `${label}: ${value}`).join('\n')
  const htmlDetails = details.map(([label, value]) => (
    `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  )).join('')
  const heading = confirmed ? 'Consultation confirmed' : 'Booking request received'
  const statusText = confirmed
    ? 'Your payment was received and your consultation is confirmed.'
    : "We've received your consultation booking request. Your selected appointment is pending confirmation; we'll follow up by email if anything needs to be adjusted."
  const invoiceText = confirmed ? '\nYour paid invoice is attached as a PDF.' : ''

  return {
    from: env.smtp.from,
    to: booking.email,
    subject: confirmed ? 'Your Ojas consultation is confirmed' : 'Your Ojas consultation booking request was received',
    text: `Hi ${booking.name},\n\n${statusText}${invoiceText}\n\n${textDetails}\n\nThank you,\nOjas Numerology & Vastu`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h2>${heading}</h2><p>Hi ${escapeHtml(booking.name)},</p><p>${statusText}</p><table cellpadding="8" cellspacing="0" style="border-collapse:collapse">${htmlDetails}</table>${confirmed ? '<p>Your paid invoice is attached as a PDF.</p>' : ''}<p>Thank you,<br>Ojas Numerology &amp; Vastu</p></div>`,
  }
}

export async function sendBookingEmails(booking, { confirmed = false } = {}) {
  requireEmailConfiguration()
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.password },
  })
  const message = createBookingMessage(booking, confirmed)
  if (confirmed) {
    const invoice = await createInvoicePdf(booking)
    message.attachments = [{
      filename: `Ojas-Invoice-${booking.id}.pdf`,
      content: invoice,
      contentType: 'application/pdf',
    }]
  }
  await transporter.sendMail(message)

  if (env.smtp.adminEmail) {
    try {
      await transporter.sendMail({
        ...message,
        to: env.smtp.adminEmail,
        subject: 'New Ojas consultation booking',
      })
    } catch (error) {
      console.error(`Admin notification failed for booking ${booking.id}: ${error.message}`)
    }
  }
}