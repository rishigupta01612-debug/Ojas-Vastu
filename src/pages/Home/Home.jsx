import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import Services from '../../components/Services/Services'
import About from '../../components/About/About'
import Wisdom from '../../components/Wisdom/Wisdom'
import Vastu from '../../components/Vastu/Vastu'
import Quotes from '../../components/Quotes/Quotes'
import Testimonials from '../../components/Testimonials/Testimonials'
import Booking from '../../components/Booking/Booking'
import Payment from '../../components/Payment/Payment'
import ChatWidget from '../../components/ChatWidget/ChatWidget'
import Footer from '../../components/Footer/Footer'
import './Home.css'

function Home() {
  return <><Navbar /><main id="top"><Hero /><Services /><About /><Wisdom /><Vastu /><Quotes /><Testimonials /><Booking /><Payment /></main><Footer /><ChatWidget /></>
}

export default Home