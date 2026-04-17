import { lazy, Suspense } from 'react'

const MapContainer = lazy(() => import('./MapContainer'))

export default function MapSection() {
  return (
    <section
      id="map-section"
      style={{
        paddingTop: '80px',
        background: '#06080c',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 48px 48px',
          maxWidth: '1200px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Gold label row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#e8c97a',
              textTransform: 'uppercase',
            }}
          >
            My Journey
          </span>
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(232,201,122,0.3)',
            }}
          />
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '50px',
            color: '#edeae2',
            margin: '0 0 12px 0',
            fontWeight: 700,
          }}
        >
          Every place I've been, mapped.
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: '#7a7570',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: 0,
          }}
        >
          Click any mountain marker to fly into that region in 3D.
          Then explore the places I've documented there.
        </p>
      </div>

      {/* Map — full bleed, no border, no radius */}
      <div
        style={{
          width: '100%',
          height: '80vh',
          minHeight: '600px',
          overflow: 'hidden',
        }}
      >
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
      </div>

      {/* Below-map strip */}
      <div
        style={{
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Hint */}
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            color: '#3d3b38',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Drag to rotate&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom&nbsp;&nbsp;·&nbsp;&nbsp;Click markers to explore
        </span>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[
            { color: '#e8c97a', label: 'Regions' },
            { color: '#4ab8a0', label: 'Places'  },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  color: '#3d3b38',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
