import React from 'react'
import useNumerology from '../../hooks/useNumerology'
import './Hero.css'

function Hero() {
  const { dateOfBirth, setDateOfBirth, result, error, calculate } = useNumerology()
  const scrollTo = (event) => {
    event.preventDefault()
    window.location.hash = event.currentTarget.getAttribute('href').slice(1)
  }
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <h1>Align your numbers.<br />Align your space.</h1>
          <p className="hero-sub">Personal numerology readings and Vastu consultations that bring clarity to your decisions, your relationships, and the rooms you live and work in.</p>
          <div className="hero-cta"><a href="#booking" className="btn btn-primary" onClick={scrollTo}>Book a consultation</a><a href="#wisdom" className="btn btn-ghost" onClick={scrollTo}>Explore the numbers</a></div>
          <p className="hero-trust">Rooted in Vedic and Pythagorean numerology, and traditional Vastu Shastra.</p>
          <div className="calc-box">
            <label htmlFor="dobInput">Find your life path number</label>
            <div className="calc-row"><input type="date" id="dobInput" aria-label="Your date of birth" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} /><button className="btn btn-primary" id="calcBtn" type="button" onClick={calculate}>Reveal</button></div>
            {error && <p className="form-error">{error}</p>}
            {result && <div className="calc-result show" id="calcResult"><div className="calc-num" id="calcNum">{result.lifePath}</div><div className="calc-text"><strong id="calcTitle">{result.details[0]}</strong><p id="calcBlurb">{result.details[1]}</p><a href={result.lifePath > 9 ? '#lp-master' : `#lp-${result.lifePath}`} id="calcLink" onClick={scrollTo}>Read the full meaning</a></div></div>}
          </div>
        </div>
        <div className="hero-art" aria-hidden="true"><svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg"><line x1="260" y1="20" x2="260" y2="500" stroke="#C9A227" strokeWidth="1" opacity="0.12" /><line x1="20" y1="260" x2="500" y2="260" stroke="#C9A227" strokeWidth="1" opacity="0.12" /><g className="mandala-rotate"><circle cx="260" cy="260" r="240" stroke="#C9A227" strokeWidth="1" fill="none" opacity="0.22" /><circle cx="260" cy="260" r="190" stroke="#C9A227" strokeWidth="1" fill="none" opacity="0.3" /><rect x="110" y="110" width="300" height="300" transform="rotate(45 260 260)" stroke="#C0713F" strokeWidth="1" fill="none" opacity="0.28" /><g fontFamily="Fraunces, serif" fontSize="20" fill="#E7C765" textAnchor="middle">{[[260, 110, 1], [356, 145, 2], [408, 234, 3], [390, 335, 4], [311, 401, 5], [209, 401, 6], [130, 335, 7], [112, 234, 8], [164, 145, 9]].map(([cx, cy, number]) => <React.Fragment key={number}><circle cx={cx} cy={cy} r="17" fill="#0F1329" stroke="#C9A227" strokeWidth="1" opacity="0.8" /><text x={cx} y={cy + 7}>{number}</text></React.Fragment>)}</g></g><circle cx="260" cy="260" r="90" stroke="#E7C765" strokeWidth="1" fill="none" opacity="0.45" /><circle cx="260" cy="260" r="6" fill="#C9A227" /></svg></div>
      </div>
    </section>
  )
}

export default Hero