import { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════
 *  EarthTransition — fullscreen Google Earth Studio video transition
 *  Plays an MP4 flyover before navigating to the place page.
 *
 *  Props:
 *   videoUrl  — URL to an Earth Studio exported MP4
 *   placeName — displayed in Playfair Display italic, bottom-left
 *   onComplete — called after video ends + 500ms hold
 * ═══════════════════════════════════════════════════════════════════ */

interface EarthTransitionProps {
  videoUrl: string
  placeName: string
  onComplete: () => void
}

export default function EarthTransition({ videoUrl, placeName, onComplete }: EarthTransitionProps) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const rafRef    = useRef<number | null>(null)

  /* visibility of the component itself (opacity 0→1 on mount) */
  const [visible, setVisible]           = useState(false)
  /* progress 0..100 tracked via rAF */
  const [progress, setProgress]         = useState(0)
  /* name fades in after 500ms */
  const [nameVisible, setNameVisible]   = useState(false)
  /* white-flash exit */
  const [flashing, setFlashing]         = useState(false)

  /* ── Mount: fade in & fail-safe ──────────────────────────────── */
  useEffect(() => {
    /* tiny delay so browser can paint before animating */
    const t = setTimeout(() => setVisible(true), 30)
    const n = setTimeout(() => setNameVisible(true), 500)
    /* fail-safe: if video hangs or fails to autoplay on mobile, exit after 8s */
    const failsafe = setTimeout(handleEnded, 8000)
    return () => { clearTimeout(t); clearTimeout(n); clearTimeout(failsafe) }
  }, [])

  /* ── Progress bar via rAF ────────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      const v = videoRef.current
      if (v && v.duration > 0) {
        setProgress((v.currentTime / v.duration) * 100)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ── Video ended: white-flash then complete ──────────────────── */
  const handleEnded = () => {
    setFlashing(true)
    /* let the flash animation complete (600ms) then call onComplete */
    setTimeout(onComplete, 600)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        background: '#000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Video ──────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onError={handleEnded}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* ── Top progress bar ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(232,201,122,0.12)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(232,201,122,0.5), #e8c97a)',
            borderRadius: '0 1px 1px 0',
            transition: 'width 80ms linear',
          }}
        />
      </div>

      {/* ── Subtle vignette ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ── Bottom-left: Place name ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '48px',
          zIndex: 3,
          opacity: nameVisible ? 1 : 0,
          transform: nameVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.05,
            textShadow: '0 2px 40px rgba(0,0,0,0.8)',
            margin: 0,
          }}
        >
          {placeName}
        </p>
      </div>

      {/* ── Bottom-right: "ARRIVING AT ALTITUDE" label ─────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '52px',
          right: '40px',
          zIndex: 3,
          opacity: nameVisible ? 1 : 0,
          transition: 'opacity 600ms ease 200ms',
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: '#e8c97a',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Arriving at altitude
        </p>
      </div>

      {/* ── White flash exit overlay ───────────────────────────── */}
      {flashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            zIndex: 10,
            animation: 'earthFlash 600ms ease forwards',
          }}
        />
      )}

      <style>{`
        @keyframes earthFlash {
          0%   { opacity: 0; }
          35%  { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
