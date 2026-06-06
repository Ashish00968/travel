import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import MapSection from '../components/MapSection'
import ExpeditionGrid from '../components/ExpeditionGrid'
import Footer from '../components/Footer'

export default function HomePage() {
  const location = useLocation()
  const returnFrom = (location.state as { from?: 'map' | 'grid' } | null)?.from

  /* ── Scroll to correct section when returning from a place page ─── */
  useEffect(() => {
    if (returnFrom === 'map') {
      const savedY = sessionStorage.getItem('mapScrollY')
      if (savedY) {
        window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' })
      } else {
        document.getElementById('map-section')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
      }
    } else if (returnFrom === 'grid') {
      document.getElementById('regions')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    }
    // Re-enable scroll restoration for future navigations
    window.history.scrollRestoration = 'auto'
    
    // Trigger a resize event so Mapbox redraws correctly after display:none
    if (location.pathname === '/') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    }
  }, [returnFrom, location.pathname])

  /* ── Page-level SEO ────────────────────────────────────────────── */
  useEffect(() => {
    document.title = 'Peaks & Paths — My Himalayan Travel Journal'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        "A solo traveller's cinematic atlas of the Indian Himalayas. Real routes, real stories, real mountains.",
      )
    }
    
    import('../lib/cssReveal').then(({ applyCSSReveal }) => {
      const observer = applyCSSReveal()
      return () => observer.disconnect()
    })
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Navbar />
      <Hero />
      <MapSection />
      <ExpeditionGrid />
      <About />
      <Footer />
    </motion.main>
  )
}
