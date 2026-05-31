import { useState } from 'react'

// Approximate screen-percentage positions derived from the Himalayan arc
// lat/lng → mapped to [left%, top%] within the preview frame
// (viewer is south-tilted, looking north — J&K west, Ladakh centre-right, HP south-centre, UK south-east)
const REGION_PINS = [
  {
    id: 'jammu-kashmir',
    label: 'J & K',
    emoji: '🏔️',
    left: '18%',
    top:  '28%',
    delay: '0s',
  },
  {
    id: 'ladakh',
    label: 'Ladakh',
    emoji: '☸️',
    left: '42%',
    top:  '18%',
    delay: '0.4s',
  },
  {
    id: 'himachal-pradesh',
    label: 'Himachal',
    emoji: '🎿',
    left: '30%',
    top:  '52%',
    delay: '0.8s',
  },
  {
    id: 'uttarakhand',
    label: 'Uttarakhand',
    emoji: '⛩️',
    left: '62%',
    top:  '55%',
    delay: '1.2s',
  },
]

// The hero satellite background — shared Cloudinary asset, loaded via <img>
const BG_URL =
  'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/wallpaper.jpg'

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
      {/* ── Keyframe definitions ─────────────────────────────────── */}
      <style>{`
        @keyframes mapPinRing {
          0%   { transform: scale(1);   opacity: 0.9; }
          100% { transform: scale(2.5); opacity: 0;   }
        }
        @keyframes mapPinRing2 {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2);   opacity: 0;   }
        }
        @keyframes pinFadeIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1);   }
        }
        @keyframes ctaFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        @keyframes teaserScan {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .map-pin-ring-a {
          animation: mapPinRing 2s ease-out infinite;
        }
        .map-pin-ring-b {
          animation: mapPinRing2 2s ease-out 0.6s infinite;
        }
        .map-teaser { height: 500px; }
        .pulse-label { display: block; }
        @media (max-width: 768px) {
          .map-teaser { height: 300px !important; }
        }
        @media (max-width: 480px) {
          .pulse-label { display: none !important; }
        }
      `}</style>

      {/* ── Satellite background image ──────────────────────────── */}
      <img
        src={BG_URL}
        alt="Himalayan satellite terrain preview"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      />

      {/* ── Radial gradient overlay ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.62) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Bottom vignette for readability ────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to top, rgba(6,8,12,0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Scan-line shimmer (subtle) ──────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* ── Region pulse pins ───────────────────────────────────── */}
      {REGION_PINS.map((pin) => (
        <div
          key={pin.id}
          style={{
            position: 'absolute',
            left: pin.left,
            top: pin.top,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            animation: `pinFadeIn 0.5s ease-out ${pin.delay} both`,
          }}
        >
          {/* Outer pulse ring A */}
          <div
            className="map-pin-ring-a"
            style={{
              position: 'absolute',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid rgba(229,193,88,0.8)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              animationDelay: pin.delay,
            }}
          />
          {/* Outer pulse ring B (offset) */}
          <div
            className="map-pin-ring-b"
            style={{
              position: 'absolute',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1.5px solid rgba(229,193,88,0.5)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              animationDelay: `calc(${pin.delay} + 0.3s)`,
            }}
          />

          {/* Gold dot core */}
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#e5c158',
              boxShadow: '0 0 0 3px rgba(229,193,88,0.25), 0 0 14px rgba(229,193,88,0.7)',
              flexShrink: 0,
              zIndex: 2,
            }}
          />

          {/* Label */}
          <span
            className="pulse-label"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#e5c158',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(229,193,88,0.4)',
              zIndex: 2,
              marginTop: '4px',
            }}
          >
            {pin.label}
          </span>
        </div>
      ))}

      {/* ── Corner watermark ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#e5c158',
            boxShadow: '0 0 8px rgba(229,193,88,0.8)',
            animation: 'mapPinRing 2s ease-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '8.5px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(229,193,88,0.7)',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}
        >
          Himalayan Atlas · Live Preview
        </span>
      </div>

      {/* ── Coordinate readout (bottom-right) ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          textAlign: 'right',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '8px',
            letterSpacing: '0.12em',
            color: 'rgba(229,193,88,0.35)',
            lineHeight: 1.7,
          }}
        >
          <div>30°N – 36°N</div>
          <div>74°E – 80°E</div>
        </div>
      </div>

      {/* ── Hover CTA overlay ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: hovered ? 1 : 0,
          animation: hovered ? 'ctaFadeIn 0.3s ease-out forwards' : 'none',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '18px 48px',
            background:
              'linear-gradient(135deg, rgba(232,201,122,0.18) 0%, rgba(232,201,122,0.06) 100%)',
            border: '1px solid rgba(232,201,122,0.55)',
            borderRadius: '6px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow:
              '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,201,122,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Play triangle */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#e5c158"
            style={{ opacity: 0.9, flexShrink: 0 }}
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#e5c158',
              fontWeight: 700,
            }}
          >
            Explore Live Map
          </span>
        </div>
      </div>
    </div>
  )
}
