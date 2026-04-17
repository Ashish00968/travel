import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import MapSection from '../components/MapSection'
import ExpeditionGrid from '../components/ExpeditionGrid'
import Footer from '../components/Footer'
import RegionPanel from '../components/RegionPanel'

export default function HomePage() {
  /* ── Page-level SEO ────────────────────────────────────────────── */
  useEffect(() => {
    document.title = 'Peaks & Paths — My Himalayan Travel Journal'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'A solo traveller\'s cinematic atlas of the Indian Himalayas. Real routes, real stories, real mountains.',
      )
    }
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <MapSection />
      <ExpeditionGrid />
      <Footer />
      <RegionPanel />
    </>
  )
}

