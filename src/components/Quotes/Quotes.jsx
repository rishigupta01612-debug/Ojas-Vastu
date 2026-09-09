import { useEffect, useState } from 'react'
import { QUOTES } from '../../utils/constants'
import './Quotes.css'

function Quotes() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % QUOTES.length), 7000)
    return () => window.clearInterval(timer)
  }, [])
  return <section className="section-tight bg-alt"><div className="wrap"><div className="quote-block"><span className="quote-glyph" aria-hidden="true">&quot;</span><div className="quote-content"><p>{QUOTES[index][0]}</p><span>{QUOTES[index][1]}</span></div><div className="quote-nav"><button type="button" aria-label="Previous quote" onClick={() => setIndex((value) => (value - 1 + QUOTES.length) % QUOTES.length)}>‹</button><button type="button" aria-label="Next quote" onClick={() => setIndex((value) => (value + 1) % QUOTES.length)}>›</button></div></div></div></section>
}

export default Quotes