import './Payment.css'

function Payment() {
  return <section className="section"><div className="wrap"><div className="section-head"><h2>Payment options</h2><p>Once your appointment is confirmed, you can complete payment using any of the following.</p></div><div className="pay-grid">{['Credit / debit card', 'UPI — GPay, PhonePe, Paytm', 'Net banking', 'Bank transfer — NEFT / IMPS', 'Cash — in person only'].map((option) => <div className="pay-chip" key={option}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.4" /></svg><span>{option}</span></div>)}</div><p className="pay-note">Payments are collected securely after your appointment is confirmed. This page is a design template — connect a gateway such as Razorpay, Stripe, or PayU to accept real payments.</p></div></section>
}

export default Payment