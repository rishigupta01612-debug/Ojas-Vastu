import { useState } from 'react'
import './Navbar.css'

function Brand({ footer = false }) {
  return (
    <a className="brand" href="#top" style={footer ? { pointerEvents: 'none' } : undefined}>
      <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="#C9A227" strokeWidth="1.2" opacity="0.6" />
        <rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" stroke="#C0713F" strokeWidth="1.2" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill="#C9A227" />
      </svg>
      <span className="brand-text"><strong>Ojas</strong><span>Numerology &amp; Vastu</span></span>
    </a>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['services', 'Services'], ['about', 'About'], ['wisdom', 'Numerology & Vastu'], ['reviews', 'Reviews'], ['booking', 'Book']]
  const goTo = (event) => {
    event.preventDefault()
    setOpen(false)
    window.location.hash = event.currentTarget.getAttribute('href').slice(1)
  }

  return (
    <header>
      <nav className="wrap">
        <Brand />
        <button className="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /></button>
        <div className={`nav-links${open ? ' open' : ''}`}>
          {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={goTo}>{label}</a>)}
        </div>
        <div className="nav-cta"><a href="#booking" className="btn btn-primary" onClick={goTo}>Book a consultation</a></div>
      </nav>
    </header>
  )
}

export { Brand }
export default Navbar