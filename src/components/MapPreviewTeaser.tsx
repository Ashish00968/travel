import { useState } from 'react'

const REGION_PINS = [
  { id: 'jammu-kashmir',    label: 'J & K',       left: '38%', top: '20%', delay: '0s'   },
  { id: 'ladakh',           label: 'Ladakh',       left: '50%', top: '16%', delay: '0.35s' },
  { id: 'himachal-pradesh', label: 'Himachal',     left: '48%', top: '32%', delay: '0.7s' },
  { id: 'uttarakhand',      label: 'Uttarakhand',  left: '58%', top: '42%', delay: '1.05s' },
]

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const BG_URL = MAPBOX_TOKEN 
  ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/76.8,29.5,5.4,0,48/1200x800@2x?access_token=${MAPBOX_TOKEN}`
  : 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/wallpaper.jpg'

interface MapPreviewTeaserProps {
  onExplore: () => void
}

export default function MapPreviewTeaser({ onExplore }: MapPreviewTeaserProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onExplore}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onExplore() }}
      className="map-teaser"
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
        borderRadius: '0',
      }}
    >
      {/* ── Satellite background image ──────────────────────────── */}
      <img
        src={BG_URL}
        alt="Himalayan satellite terrain preview"
        loading="lazy"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 40%',
          // Fixed: ease-out, 0.03 scale difference — subtle, not jerky
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 1000ms cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform',
        }}
      />

      {/* Radial gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

      {/* Bottom vignette */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to top, rgba(6,8,12,0.9) 0%, transparent 100%)', pointerEvents: 'none' }} />

      {/* Scan-line texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
        pointerEvents: 'none', opacity: 0.5,
      }} />

      {/* ── Region pulse pins ───────────────────────────────────── */}
      {REGION_PINS.map((pin) => (
        <div
          key={pin.id}
          style={{
            position: 'absolute',
            left: pin.left, top: pin.top,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            animation: `pinFadeIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) ${pin.delay} both`,
          }}
        >
          {/* Outer pulse ring A */}
          <div
            className="map-pin-ring-a"
            style={{
              position: 'absolute', width: '34px', height: '34px', borderRadius: '50%',
              border: '1.5px solid rgba(229,193,88,0.75)',
              top: '50%', left: '50%',
              animationDelay: pin.delay,
            }}
          />
          {/* Outer pulse ring B */}
          <div
            className="map-pin-ring-b"
            style={{
              position: 'absolute', width: '34px', height: '34px', borderRadius: '50%',
              border: '1px solid rgba(229,193,88,0.45)',
              top: '50%', left: '50%',
              animationDelay: `calc(${pin.delay} + 0.3s)`,
            }}
          />

          {/* Gold dot core */}
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#e5c158',
            boxShadow: '0 0 0 3px rgba(229,193,88,0.2), 0 0 14px rgba(229,193,88,0.65)',
            flexShrink: 0, zIndex: 2,
          }} />

          {/* Label */}
          <span
            className="pulse-label"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '8.5px', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(229,193,88,0.85)',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 8px rgba(0,0,0,0.9), 0 0 12px rgba(229,193,88,0.3)',
              zIndex: 2, marginTop: '4px',
            }}
          >
            {pin.label}
          </span>
        </div>
      ))}

      {/* ── Corner watermark ────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: '20px', left: '24px', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#e5c158',
          boxShadow: '0 0 8px rgba(229,193,88,0.7)',
          animation: 'mapPinRing 2.2s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        }} />
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px', letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(229,193,88,0.6)',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Himalayan Atlas · Live Preview
        </span>
      </div>

      {/* ── Coordinate readout ───────────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: '20px', right: '24px', textAlign: 'right', pointerEvents: 'none' }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px', letterSpacing: '0.12em',
          color: 'rgba(229,193,88,0.3)', lineHeight: 1.7,
        }}>
          <div>30°N – 36°N</div>
          <div>74°E – 80°E</div>
        </div>
      </div>

      {/* ── Hover CTA overlay ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: hovered ? 1 : 0,
        // Scale from 0.94 → 1 (Emil: never from 0)
        scale: hovered ? '1' : '0.94',
        transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), scale 250ms cubic-bezier(0.23, 1, 0.32, 1)',
        pointerEvents: 'none', zIndex: 10,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '18px 48px',
          background: 'linear-gradient(135deg, rgba(232,201,122,0.16) 0%, rgba(232,201,122,0.04) 100%)',
          border: '1px solid rgba(232,201,122,0.5)',
          borderRadius: '6px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,201,122,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
          whiteSpace: 'nowrap',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#e5c158" style={{ opacity: 0.9, flexShrink: 0 }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px', letterSpacing: '0.24em',
            textTransform: 'uppercase', color: '#e5c158', fontWeight: 700,
          }}>
            Explore Live Map
          </span>
        </div>
      </div>
    </div>
  )
}
