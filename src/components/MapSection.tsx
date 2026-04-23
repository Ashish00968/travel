import { lazy, Suspense, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import RegionPanel from './RegionPanel'
import MapErrorBoundary from './MapErrorBoundary'

const MapContainer = lazy(() => import('./MapContainer'))

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }  // start loading 200px before visible
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="map-section"
      ref={sectionRef}
      style={{ paddingTop: '80px', background: '#06080c' }}
    >
      {/* Header */}
      <div className="reveal" style={{ padding: '0 48px 48px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Gold label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase' }}>
            My Journey
          </span>
          <div style={{ width: '60px', height: '1px', background: 'rgba(232,201,122,0.3)' }} />
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '50px', color: '#edeae2', margin: '0 0 12px 0', fontWeight: 700 }}>
          Every place I've been, mapped.
        </h2>

        {/* Subtext */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.7, maxWidth: '520px', margin: 0 }}>
          Click any mountain marker to fly into that region in 3D.
          Then explore the places I've documented there.
        </p>
      </div>

      {/* Map (relative wrapper so RegionPanel positions correctly inside it) */}
      <div style={{ width: '100%', height: '80vh', minHeight: '600px', overflow: 'hidden', position: 'relative' }}>
        {shouldLoadMap ? (
          <>
            <MapErrorBoundary>
              <Suspense fallback={<MapPlaceholder />}>
                <MapContainer />
              </Suspense>
            </MapErrorBoundary>
            <RegionPanel />
          </>
        ) : (
          <MapPlaceholder />
        )}
      </div>

      {/* Below-map strip */}
      <div 
        className="reveal"
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
      </div>
      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .pulse-dot.d1 { animation: dotPulse 2s ease-in-out infinite; }
        .pulse-dot.d2 { animation: dotPulse 2s ease-in-out infinite 1s; }
      `}</style>
    </section>
  )
}

function MapPlaceholder() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d1117 0%, #06080c 100%)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style={{ opacity: 0.25 }}>
          <path d="M28 6L6 48H50L28 6Z" fill="none" stroke="#e8c97a" strokeWidth="2" />
        </svg>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(232,201,122,0.6)', textTransform: 'uppercase' }}>Loading Atlas...</span>
      </div>
    </div>
  )
}
