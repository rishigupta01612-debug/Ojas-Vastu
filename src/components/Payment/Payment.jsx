import { useState } from 'react'
import { createPaymentOrder, loadRazorpay, verifyPayment } from '../../services/paymentService'
import './Payment.css'

export function PaymentCheckout({ bookingId, customer, onComplete }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false)

  async function startPayment() {
    setStatus('loading')
    setError('')
    try {
      const order = await createPaymentOrder({ bookingId })
      await loadRazorpay()
      let checkoutCompleted = false
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Ojas Numerology & Vastu',
        description: 'Consultation booking',
        order_id: order.orderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: '#C9A227' },
        handler: async (response) => {
          checkoutCompleted = true
          setStatus('verifying')
          try {
            const result = await verifyPayment({ bookingId, razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature })
            setConfirmationEmailSent(result.booking.confirmationEmailSent)
            setStatus('paid')
            onComplete?.()
          } catch (verificationError) {
            setStatus('verification-error')
            setError(verificationError.message || 'Payment was completed but could not be confirmed right away.')
          }
        },
        modal: { ondismiss: () => { if (!checkoutCompleted) setStatus('idle') } },
      })
      checkout.open()
    } catch (paymentError) {
      setStatus('error')
      setError(paymentError.message)
    }
  }

  return <div className="payment-action"><button className="btn btn-primary" type="button" onClick={startPayment} disabled={['loading', 'verifying', 'paid', 'verification-error'].includes(status)}>{status === 'loading' ? 'Opening secure checkout…' : status === 'verifying' ? 'Verifying payment…' : status === 'paid' ? 'Payment confirmed' : status === 'verification-error' ? 'Payment verification pending' : 'Pay securely with Razorpay'}</button>{status === 'paid' && <p role="status">{confirmationEmailSent ? `Payment successful. Your confirmation and PDF invoice have been sent to ${customer.email}.` : `Payment successful. Your booking is confirmed; invoice email delivery is pending and will be retried. Please do not pay again.`}</p>}{status === 'verification-error' && <p className="form-error" role="alert">Razorpay completed checkout, but we could not verify it immediately. Please do not pay again. We will reconcile the payment; contact us if you do not receive your invoice email. {error}</p>}{status === 'error' && <p className="form-error">{error || 'Payment could not be started. Please try again.'}</p>}</div>
}

function Payment() {
  return <section className="section"><div className="wrap"><div className="section-head"><h2>Payment options</h2><p>Once your appointment is confirmed, you can complete payment securely through Razorpay.</p></div><div className="pay-grid">{['Credit / debit card', 'UPI — GPay, PhonePe, Paytm', 'Net banking', 'Bank transfer — NEFT / IMPS', 'Cash — in person only'].map((option) => <div className="pay-chip" key={option}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.4" /></svg><span>{option}</span></div>)}</div><p className="pay-note">Online payments are collected only after your appointment request is stored. Razorpay confirms the payment on the server before your booking is marked paid.</p></div></section>
}

export default Payment