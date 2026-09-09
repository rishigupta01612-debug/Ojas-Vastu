import { useMemo, useState } from 'react'
import { BOOKING_SLOTS, DAY_NAMES, MONTH_NAMES } from '../../utils/constants'
import { createBooking } from '../../services/apiService'
import { validateBooking } from '../../utils/validation'
import './Booking.css'

function Booking() {
  const dates = useMemo(() => { const result = []; const cursor = new Date(); cursor.setDate(cursor.getDate() + 1); while (result.length < 12) { if (cursor.getDay() !== 0) result.push(new Date(cursor)); cursor.setDate(cursor.getDate() + 1) } return result }, [])
  const [values, setValues] = useState({ name: '', email: '', phone: '', service: 'Numerology reading — ₹2,500', mode: 'Video call' })
  const [dateIndex, setDateIndex] = useState(0)
  const [slot, setSlot] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const selectedDate = dates[dateIndex]
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateBooking({ ...values, date: selectedDate, slot })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStatus('loading')
    try { await createBooking({ ...values, date: selectedDate.toISOString(), slot }); setStatus('success') } catch { setStatus('error') }
  }
  const dateLabel = `${DAY_NAMES[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`
  return <section className="section bg-alt" id="booking"><div className="wrap"><div className="section-head"><h2>Book a consultation</h2><p>Pick a service, a time that works, and send your details. We&apos;ll confirm by email within one business day.</p></div><div className="booking-grid"><div><form onSubmit={submit}><div className="field"><label htmlFor="bName">Full name</label><input name="name" type="text" id="bName" value={values.name} onChange={update} required />{errors.name && <span className="form-error">{errors.name}</span>}</div><div className="field"><label htmlFor="bEmail">Email</label><input name="email" type="email" id="bEmail" value={values.email} onChange={update} required />{errors.email && <span className="form-error">{errors.email}</span>}</div><div className="field"><label htmlFor="bPhone">Phone</label><input name="phone" type="tel" id="bPhone" value={values.phone} onChange={update} />{errors.phone && <span className="form-error">{errors.phone}</span>}</div><div className="field"><label htmlFor="bService">Service</label><select name="service" id="bService" value={values.service} onChange={update}>{['Numerology reading — ₹2,500', 'Vastu consultation (home) — ₹5,000', 'Vastu consultation (office) — ₹6,000', 'Name & birth-date correction — ₹1,800', 'Compatibility reading — ₹2,000', 'Annual forecast — ₹1,500'].map((service) => <option key={service}>{service}</option>)}</select></div><div className="field"><label>Mode</label><div className="radio-row" id="modeRow">{['Video call', 'In person', 'Phone'].map((mode) => <label className={`radio-chip${values.mode === mode ? ' active' : ''}`} key={mode}><input type="radio" name="mode" value={mode} checked={values.mode === mode} onChange={update} />{mode}</label>)}</div></div><button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Request appointment'}</button>{status === 'error' && <p className="form-error">We could not send your request. Please try again or contact us directly.</p>}</form></div><div><label className="field-label">Choose a date</label><div className="date-scroll">{dates.map((date, index) => <button className={`date-chip${index === dateIndex ? ' active' : ''}`} type="button" key={date.toISOString()} onClick={() => { setDateIndex(index); setSlot(null) }}><span className="dow">{DAY_NAMES[date.getDay()]}</span><span className="dnum">{date.getDate()}</span></button>)}</div><label className="field-label">Choose a time</label><div className="slot-grid">{BOOKING_SLOTS.map((time, index) => { const taken = (dateIndex + index) % 5 === 0; return <button className={`slot${taken ? ' taken' : ''}${slot === time ? ' active' : ''}`} type="button" disabled={taken} key={time} onClick={() => setSlot(time)}>{taken ? `${time} · booked` : time}</button> })}</div>{errors.date && <p className="form-error">{errors.date}</p>}{errors.slot && <p className="form-error">{errors.slot}</p>}{status === 'success' && <div className="confirm-box show"><h4>Request received</h4><p>{values.name.trim()} · {values.service} · {dateLabel} at {slot} · {values.mode}</p><p>We&apos;ll confirm your appointment by email and share a secure payment link shortly.</p></div>}</div></div></div></section>
}

export default Booking