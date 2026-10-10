import { Brand } from '../Navbar/Navbar'
import './Footer.css'

function Footer() {
  return <footer><div className="wrap"><div className="foot-grid"><div className="foot-brand"><Brand footer /><p>Consultations that bring clarity to your decisions and calm to your home.</p><div className="social-row"><a href="https://www.instagram.com/hemnumerovastu/" aria-label="Instagram" target="_blank" rel="noreferrer">◎</a><a href="#top" aria-label="Facebook">f</a><a href="https://wa.me/917208510833" aria-label="WhatsApp" target="_blank" rel="noreferrer">◌</a></div></div><div><h5>Contact</h5><ul><li><a href="mailto:rishigupta0770@gmail.com">rishigupta0770@gmail.com</a></li><li><a href="tel:+917208510833">+91 72085 10833</a></li><li><a href="#top">Mumbai, India</a></li></ul></div><div><h5>Explore</h5><ul><li><a href="#services">Services</a></li><li><a href="#wisdom">Numerology &amp; Vastu</a></li><li><a href="#reviews">Reviews</a></li><li><a href="#booking">Book a consultation</a></li></ul></div></div><div className="foot-bottom">© 2026 Ojas Numerology &amp; Vastu. ALL RIGHTS RESERVED BY RISHI GUPTA</div></div></footer>
}

export default Footer