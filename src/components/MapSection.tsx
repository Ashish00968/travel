import { lazy, Suspense, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import RegionPanel from './RegionPanel'
import MapErrorBoundary from './MapErrorBoundary'
import MapPreviewTeaser from './MapPreviewTeaser'

const MapContainer = lazy(() => import('./MapContainer'))

function MapLoadingFallback() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#06080c', gap: '16px',
    }}>
      {/* Animated mountain logo */}
      <svg width="36" height="26" viewBox="0 0 22 16" fill="none" style={{ opacity: 0.6 }}>
        <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16Z" fill="rgba(232,201,122,0.12)" />
        <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16" stroke="#e8c97a" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      </svg>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '10px', letterSpacing: '0.3em',
        color: 'rgba(232,201,122,0.5)',
        textTransform: 'uppercase',
      }}>
        Loading Atlas…
      </span>
      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'rgba(232,201,122,0.4)',
            animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')

  const handleExplore = () => setShouldLoadMap(true)

  return (
    <section id="map-section" ref={sectionRef} style={{ paddingTop: '80px', background: '#06080c' }}>
      
      {/* ── Section header ──────────────────────────────────────── */}
      <div className="reveal" style={{ padding: isMobile ? '0 24px 40px' : '0 48px 48px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#e8c97a',
            boxShadow: '0 0 8px rgba(232,201,122,0.6)',
          }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.22em', color: '#e8c97a', textTransform: 'uppercase' }}>
            My Journey
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(232,201,122,0.25), transparent)', maxWidth: '120px' }} />
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(30px, 4vw, 52px)',
          color: '#edeae2', margin: '0 0 12px 0', fontWeight: 700,
        }}>
          Every place I've been, mapped.
        </h2>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6a6460', lineHeight: 1.75, maxWidth: '520px', margin: 0 }}>
          Click any mountain marker to fly into that region in 3D.
          Then explore the places I've documented there.
        </p>
      </div>

      {/* ── Map wrapper ─────────────────────────────────────────── */}
      <div style={{ width: '100%', height: '80vh', minHeight: '600px', overflow: 'hidden', position: 'relative' }}>
        {shouldLoadMap ? (
          <>
            <MapErrorBoundary>
              <Suspense fallback={<MapLoadingFallback />}>
                <MapContainer />
              </Suspense>
            </MapErrorBoundary>
            <RegionPanel />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#06080c' }}>
            <div style={{ flex: '0 0 auto' }}>
              <MapPreviewTeaser onExplore={handleExplore} />
            </div>

            {/* Launch button strip */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '16px', padding: '24px',
              background: 'linear-gradient(to bottom, #06080c 0%, #090d14 100%)',
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                color: 'rgba(255,255,255,0.18)', margin: 0,
                letterSpacing: '0.04em', textAlign: 'center',
              }}>
                Interactive 3D Terrain · Cinematic Exploration
              </p>

              <button
                id="explore-atlas-btn"
                className="explore-btn"
                onClick={handleExplore}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 44px',
                  background: 'linear-gradient(135deg, rgba(232,201,122,0.09) 0%, rgba(232,201,122,0.02) 100%)',
                  border: '1px solid rgba(232,201,122,0.35)',
                  borderRadius: '6px',
                  color: '#e8c97a',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px', letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.8 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Explore the Atlas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Below-map legend strip ───────────────────────────────── */}
      <div className="reveal" style={{
        padding: isMobile ? '14px 24px' : '14px 48px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: isMobile ? '14px' : '0',
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', opacity: 0.4 }}>
          Drag to rotate
          <span className="pulse-dot d1">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          Scroll to zoom
          <span className="pulse-dot d2">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          Click markers
        </span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[{ color: '#e8c97a', label: 'Regions' }, { color: '#4ab8a0', label: 'Places' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}66` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
