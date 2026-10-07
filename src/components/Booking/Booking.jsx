import { useEffect, useMemo, useState } from 'react'
import { BOOKING_SLOTS, DAY_NAMES, MONTH_NAMES } from '../../utils/constants'
import { createBooking, getBookingAvailability } from '../../services/apiService'
import { validateBooking } from '../../utils/validation'
import { PaymentCheckout } from '../Payment/Payment'
import './Booking.css'

function dateKeyFromDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Booking() {
  const dates = useMemo(() => {
    const result = []
    const cursor = new Date()
    cursor.setDate(cursor.getDate() + 1)
    while (result.length < 12) {
      if (cursor.getDay() !== 0) result.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return result
  }, [])
  const [values, setValues] = useState({ name: '', email: '', phone: '', service: 'Numerology reading — ₹2,500', mode: 'Video call' })
  const [dateIndex, setDateIndex] = useState(0)
  const [slot, setSlot] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false)
  const selectedDate = dates[dateIndex]
  const selectedDateKey = dateKeyFromDate(selectedDate)
  const [availability, setAvailability] = useState({ dateKey: '', booked: [], loading: false, error: '' })
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))

  useEffect(() => {
    let active = true
    getBookingAvailability(selectedDateKey)
      .then((response) => {
        if (active) setAvailability({ dateKey: selectedDateKey, booked: response.data.booked, loading: false, error: '' })
      })
      .catch((error) => {
        if (active) setAvailability({ dateKey: selectedDateKey, booked: [], loading: false, error: error.message })
      })
    return () => { active = false }
  }, [selectedDateKey])

  const availabilityLoading = availability.dateKey !== selectedDateKey || availability.loading

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateBooking({ ...values, date: selectedDate, slot })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStatus('loading')
    setSubmitError('')
    setConfirmationEmailSent(false)
    try {
      const response = await createBooking({ ...values, date: selectedDateKey, slot })
      setBookingId(response.data.booking.id)
      setConfirmationEmailSent(response.data.confirmationEmailSent)
      setStatus('success')
    } catch (error) {
      setSubmitError(error.message)
      setStatus('error')
    }
  }

  const dateLabel = `${DAY_NAMES[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`
  return (
    <section className="section bg-alt" id="booking">
      <div className="wrap">
        <div className="section-head"><h2>Book a consultation</h2><p>Choose a service and time, then pay securely with Razorpay. Your appointment is confirmed and a PDF invoice is emailed after successful payment.</p></div>
        <div className="booking-grid">
          <div>
            <form onSubmit={submit}>
              <div className="field"><label htmlFor="bName">Full name</label><input name="name" type="text" id="bName" value={values.name} onChange={update} required />{errors.name && <span className="form-error">{errors.name}</span>}</div>
              <div className="field"><label htmlFor="bEmail">Email</label><input name="email" type="email" id="bEmail" value={values.email} onChange={update} required />{errors.email && <span className="form-error">{errors.email}</span>}</div>
              <div className="field"><label htmlFor="bPhone">Phone</label><input name="phone" type="tel" id="bPhone" value={values.phone} onChange={update} />{errors.phone && <span className="form-error">{errors.phone}</span>}</div>
              <div className="field"><label htmlFor="bService">Service</label><select name="service" id="bService" value={values.service} onChange={update}>{['Numerology reading — ₹2,500', 'Vastu consultation (home) — ₹5,000', 'Vastu consultation (office) — ₹6,000', 'Name & birth-date correction — ₹1,800', 'Compatibility reading — ₹2,000', 'Annual forecast — ₹1,500'].map((service) => <option key={service}>{service}</option>)}</select></div>
              <div className="field"><label>Mode</label><div className="radio-row" id="modeRow">{['Video call', 'In person', 'Phone'].map((mode) => <label className={`radio-chip${values.mode === mode ? ' active' : ''}`} key={mode}><input type="radio" name="mode" value={mode} checked={values.mode === mode} onChange={update} />{mode}</label>)}</div></div>
              <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>{status === 'loading' ? 'Preparing booking…' : 'Continue to payment'}</button>
              {status === 'error' && <p className="form-error">{submitError || 'We couldn’t complete your booking or send its confirmation email. Please try again or contact us directly.'}</p>}
            </form>
          </div>
          <div>
            <label className="field-label">Choose a date</label>
            <div className="date-scroll">{dates.map((date, index) => <button className={`date-chip${index === dateIndex ? ' active' : ''}`} type="button" key={date.toISOString()} onClick={() => { setDateIndex(index); setSlot(null) }}><span className="dow">{DAY_NAMES[date.getDay()]}</span><span className="dnum">{date.getDate()}</span></button>)}</div>
            <label className="field-label">Choose a time</label>
            {availabilityLoading && <p role="status">Checking available times…</p>}
            {availability.error && availability.dateKey === selectedDateKey && <p className="form-error">Could not load live availability: {availability.error} You can still submit a request; we&apos;ll check the slot before confirming.</p>}
            <div className="slot-grid">{BOOKING_SLOTS.map((time) => { const taken = availability.dateKey === selectedDateKey && availability.booked.some((booking) => booking.time === time); return <button className={`slot${taken ? ' taken' : ''}${slot === time ? ' active' : ''}`} type="button" disabled={taken || availabilityLoading} key={time} onClick={() => setSlot(time)}>{taken ? `${time} · booked` : time}</button> })}</div>
            {errors.date && <p className="form-error">{errors.date}</p>}{errors.slot && <p className="form-error">{errors.slot}</p>}
            {status === 'success' && <div className="confirm-box show"><h4>Booking request received</h4><p>{values.name.trim()} · {values.service} · {dateLabel} at {slot} · {values.mode}</p><p>{confirmationEmailSent ? `A booking acknowledgement has been sent to ${values.email}.` : 'Your booking was saved, but we could not send an acknowledgement email. Please contact us if you need confirmation.'} Complete payment below to confirm your appointment; we&apos;ll email your paid confirmation with a PDF invoice once payment succeeds.</p><PaymentCheckout bookingId={bookingId} customer={values} /></div>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Booking
