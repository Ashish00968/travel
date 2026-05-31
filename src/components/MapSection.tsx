import { lazy, Suspense, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import RegionPanel from './RegionPanel'
import MapErrorBoundary from './MapErrorBoundary'
import MapPreviewTeaser from './MapPreviewTeaser'

const MapContainer = lazy(() => import('./MapContainer'))

// Minimal loading state shown while Mapbox GL JS bundle is fetching
function MapLoadingFallback() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#06080c',
      color: '#e8c97a',
      fontFamily: "'Space Mono', monospace",
      fontSize: '11px',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
    }}>
      Initializing Map…
    </div>
  )
}

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')

  const handleExplore = () => setShouldLoadMap(true)

  return (
    <section
      id="map-section"
      ref={sectionRef}
      style={{ paddingTop: '80px', background: '#06080c' }}
    >
      {/* ── Section header ──────────────────────────────────────── */}
      <div className="reveal" style={{ padding: '0 48px 48px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Gold label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase' }}>
            My Journey
          </span>
          <div style={{ width: '60px', height: '1px', background: 'rgba(232,201,122,0.3)' }} />
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '50px', color: '#edeae2', margin: '0 0 12px 0', fontWeight: 700 }}>
          Every place I've been, mapped.
        </h2>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.7, maxWidth: '520px', margin: 0 }}>
          Click any mountain marker to fly into that region in 3D.
          Then explore the places I've documented there.
        </p>
      </div>

      {/* ── Map wrapper ─────────────────────────────────────────── */}
      <div style={{ width: '100%', height: '80vh', minHeight: '600px', overflow: 'hidden', position: 'relative' }}>
        {shouldLoadMap ? (
          /* Full Mapbox GL JS instance — lazy-loaded on demand */
          <>
            <MapErrorBoundary>
              <Suspense fallback={<MapLoadingFallback />}>
                <MapContainer />
              </Suspense>
            </MapErrorBoundary>
            <RegionPanel />
          </>
        ) : (
          /* ── Pre-load state: satellite teaser + launch button ── */
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#06080c' }}>

            {/* Satellite preview — 500px tall, click anywhere to launch */}
            <div style={{ flex: '0 0 auto' }}>
              <MapPreviewTeaser onExplore={handleExplore} />
            </div>

            {/* "Explore the Atlas" button strip */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '28px 24px',
              background: 'linear-gradient(to bottom, #06080c 0%, #090d14 100%)',
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.2)',
                margin: 0,
                letterSpacing: '0.04em',
                textAlign: 'center',
              }}>
                Interactive 3D Terrain · Cinematic Exploration
              </p>

              <button
                id="explore-atlas-btn"
                className="explore-btn"
                onClick={handleExplore}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 42px',
                  background: 'linear-gradient(135deg, rgba(232,201,122,0.1) 0%, rgba(232,201,122,0.02) 100%)',
                  border: '1px solid rgba(232,201,122,0.4)',
                  borderRadius: '6px',
                  color: '#e8c97a',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(232,201,122,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232,201,122,0.15) 0%, rgba(232,201,122,0.05) 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232,201,122,0.1) 0%, rgba(232,201,122,0.02) 100%)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.8 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Explore the Atlas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Below-map legend strip ───────────────────────────────── */}
      <div
        className="reveal"
        style={{
          padding: isMobile ? '16px 24px' : '16px 48px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? '16px' : '0',
        }}
      >
        <span
          className="hint-strip"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', opacity: 0.4 }}
        >
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
        @keyframes explorePulse { 0%,100%{box-shadow:0 0 0 0 rgba(232,201,122,0.25)} 50%{box-shadow:0 0 0 14px rgba(232,201,122,0)} }
        .explore-btn { animation: explorePulse 2.5s ease-in-out infinite; }
        .explore-btn:hover { background: rgba(232,201,122,0.15) !important; border-color: rgba(232,201,122,0.8) !important; }
      `}</style>
    </section>
  )
}
