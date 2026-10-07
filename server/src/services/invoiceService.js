import PDFDocument from 'pdfkit'
import { SERVICES } from '../utils/helpers.js'

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' }).format(value)
}

export function createInvoicePdf(booking) {
  const amount = SERVICES[booking.service]
  if (!amount) throw new Error('Cannot create an invoice for an unknown service')

  const invoiceNumber = `OJAS-${booking.id}`
  const paidAt = booking.paidAt || new Date()
  const serviceName = booking.service.replace(/ — ₹.*$/u, '')
  const doc = new PDFDocument({ size: 'A4', margin: 52, info: { Title: `Ojas payment receipt ${invoiceNumber}`, Author: 'Ojas Numerology & Vastu' } })
  const chunks = []

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('error', reject)
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    doc.font('Helvetica-Bold').fontSize(20).text('Ojas Numerology & Vastu')
    doc.moveDown(0.5)
    doc.font('Helvetica').fontSize(11).fillColor('#555555').text('Consultation payment receipt')
    doc.moveDown(1.5)
    doc.fillColor('#111111').font('Helvetica-Bold').fontSize(16).text('PAID INVOICE')
    doc.moveDown(0.8)

    const details = [
      [`Invoice number`, invoiceNumber],
      [`Invoice date`, formatDate(paidAt)],
      [`Payment status`, 'Paid'],
      [`Payment ID`, booking.paymentId || 'Not available'],
      [`Order ID`, booking.paymentOrderId || 'Not available'],
    ]
    doc.font('Helvetica').fontSize(10)
    for (const [label, value] of details) {
      doc.fillColor('#666666').text(`${label}: `, { continued: true })
      doc.fillColor('#111111').text(String(value))
    }

    doc.moveDown(1.5)
    doc.font('Helvetica-Bold').fontSize(11).text('Billed to')
    doc.font('Helvetica').fontSize(10).text(booking.name)
    doc.text(booking.email)
    doc.moveDown(1.5)
    doc.font('Helvetica-Bold').text('Consultation')
    doc.moveDown(0.5)
    doc.font('Helvetica').text(serviceName)
    doc.text(`Appointment: ${booking.dateKey} at ${booking.time}`)
    doc.text(`Mode: ${booking.consultationMode}`)
    doc.moveDown(1)
    doc.font('Helvetica-Bold').fontSize(12).text(`Total paid: INR ${(amount / 100).toLocaleString('en-IN')}`)
    doc.moveDown(2)
    doc.font('Helvetica').fontSize(9).fillColor('#555555')
      .text('This receipt confirms payment for the consultation listed above. It is not a GST tax invoice.')
    doc.text('Thank you for booking with Ojas Numerology & Vastu.')
    doc.end()
  })
}
