import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReveal } from '../hooks/useReveal'

const MapContainer = lazy(() => import('./MapContainer'))

const AnimatedHeadingWord = ({ word, delay, isInView }: { word: string, delay: number, isInView: boolean }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
    <motion.span
      style={{ display: 'inline-block' }}
      initial={{ y: '110%' }}
      animate={isInView ? { y: '0%' } : { y: '110%' }}
      transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1], delay }}
    >
      {word}
    </motion.span>
  </span>
)

export default function MapSection() {
  const { ref: sectionRef, isInView } = useReveal({ margin: '-100px' })
  const { ref: mapContainerRef, isInView: mapInView } = useReveal({ margin: '-50px' })
  const isMobile = useMediaQuery('(max-width: 900px)')

  const heading = "Every place I've been, mapped.".split(' ')

  return (
    <section
      id="map-section"
      ref={sectionRef}
      style={{ paddingTop: '80px', background: '#06080c' }}
    >
      {/* Header */}
      <div style={{ padding: '0 48px 48px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Gold label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase' }}
          >
            My Journey
          </motion.span>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
            style={{ width: '60px', height: '1px', background: 'rgba(232,201,122,0.3)', transformOrigin: 'left' }} 
          />
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '50px', color: '#edeae2', margin: '0 0 12px 0', fontWeight: 700 }}>
          {heading.map((w, i) => <AnimatedHeadingWord key={i} word={w} delay={0.4 + i*0.06} isInView={isInView} />)}
        </h2>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.7, maxWidth: '520px', margin: 0 }}
        >
          Click any mountain marker to fly into that region in 3D.
          Then explore the places I've documented there.
        </motion.p>
      </div>

      {/* Map */}
      <motion.div 
        ref={mapContainerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={mapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: [0.25, 0.8, 0.25, 1] }}
        style={{ width: '100%', height: '80vh', minHeight: '600px', overflow: 'hidden' }}
      >
        {mapInView ? (
          <Suspense
            fallback={
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030508' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(232,201,122,0.3)', borderTopColor: '#e8c97a', borderRadius: '50%', animation: 'spin 1.5s linear infinite' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(232,201,122,0.45)', textTransform: 'uppercase' }}>Initializing Map Engine...</span>
                  <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                </div>
              </div>
            }
          >
            <MapContainer />
          </Suspense>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030508' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style={{ opacity: 0.25 }}>
                <path d="M28 6L6 48H50L28 6Z" fill="none" stroke="#e8c97a" strokeWidth="2" />
              </svg>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(232,201,122,0.2)', textTransform: 'uppercase' }}>Loading altitude data</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Below-map strip */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={mapInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ padding: isMobile ? '16px 24px' : '16px 48px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? '16px' : '0' }}
      >
        <span className="hint-strip" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', opacity: 0.4 }}>
          Drag to rotate
          <span className="pulse-dot d1">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          Scroll to zoom
          <span className="pulse-dot d2">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          Click markers
        </span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[{ color: '#e8c97a', label: 'Regions' }, { color: '#4ab8a0', label: 'Places' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .pulse-dot.d1 { animation: dotPulse 2s ease-in-out infinite; }
        .pulse-dot.d2 { animation: dotPulse 2s ease-in-out infinite 1s; }
      `}</style>
    </section>
  )
}
