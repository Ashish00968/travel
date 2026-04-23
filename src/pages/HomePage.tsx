import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import MapSection from '../components/MapSection'
import ExpeditionGrid from '../components/ExpeditionGrid'
import Footer from '../components/Footer'

export default function HomePage() {
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
