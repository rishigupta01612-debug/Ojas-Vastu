import { SERVICES } from '../../utils/constants'
import './Services.css'

function Services() {
  return <section className="section bg-alt" id="services"><div className="wrap"><div className="section-head"><h2>Consultations</h2><p>Every session is tailored to what you&apos;re navigating right now — a decision, a space, a relationship, or a fresh start.</p></div><div className="svc-grid">{SERVICES.map(([title, description, meta, price], index) => <div className="svc-card" key={title}><svg className="svc-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.3" /><path d={index === 0 ? 'M20 12v16M12 20h16' : index === 1 ? 'M8 34V16l12-9 12 9v18M16 34V22h8v12' : 'M8 30L16 18L23 24L32 10'} stroke="currentColor" strokeWidth="1.3" /></svg><h3>{title}</h3><p>{description}</p><div className="svc-meta"><span>{meta}</span><strong>{price}</strong></div></div>)}</div></div></section>
}

export default Services