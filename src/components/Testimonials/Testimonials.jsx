import './Testimonials.css'

function Testimonials() {
  const testimonials = [['My Vastu consultation changed how our living room felt — same furniture, better flow, calmer evenings.', 'Priya M.'], ['The numerology session gave me language for patterns I\'d noticed in my own career for years.', 'Devansh K.'], ['We used the name-correction service for our daughter. A small change, and it felt right immediately.', 'Ritu S.']]
  return <section className="section" id="reviews"><div className="wrap"><div className="section-head"><h2>What clients say</h2></div><div className="testi-grid">{testimonials.map(([quote, name]) => <div className="testi-card" key={name}><p>{quote}</p><span>{name}</span></div>)}</div></div></section>
}

export default Testimonials