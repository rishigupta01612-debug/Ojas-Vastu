import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  service: { type: String, required: true, trim: true },
  consultationMode: { type: String, required: true, enum: ['Video call', 'In person', 'Phone'] },
  date: { type: Date, required: true },
  dateKey: { type: String, required: true },
  time: { type: String, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'created', 'paid', 'failed'], default: 'unpaid' },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentOrderId: { type: String, default: null },
  paymentId: { type: String, default: null },
  notes: { type: String, trim: true, maxlength: 1000, default: '' },
}, { timestamps: true, versionKey: false })

bookingSchema.index({ dateKey: 1, time: 1 }, { unique: true })
bookingSchema.index({ email: 1, createdAt: -1 })

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)