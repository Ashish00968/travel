import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { PlaceLayoutProps } from './types'
import { blurPlaceholderFromUrl } from '../../lib/cloudinary'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function RoadLayout({ place, region, subRegionName, onBack, navFrom }: PlaceLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth line drawing
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  const stops = place.trekStops || []

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>
      
      {/* ── Fixed back button ─────────────────────────────────── */}
      <button onClick={onBack} style={{
        position:'fixed', top: isMobile ? 16 : 24, left: isMobile ? 16 : 24, zIndex:50,
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 18px', borderRadius:12,
        background:'rgba(7,9,15,0.72)', backdropFilter:'blur(16px)',
        color:'var(--color-text)', fontSize:13, fontWeight:500,
        border:'1px solid var(--color-border)',
        cursor:'pointer', transition:'all 0.2s ease',
      }}>
        <span style={{ color:'var(--color-accent)' }}>←</span> {navFrom === 'grid' ? "Back to Where I've Been" : 'Back to map'}
      </button>

      {/* ── Hero ─────────────────────────────────── */}
      <div style={{ position: 'relative', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: isMobile ? '0 24px 40px' : '0 80px 60px' }}>
        {place.image && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,11,13,0) 0%, rgba(10,11,13,0.8) 60%, rgba(10,11,13,1) 100%)' }} />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
            Road Trip · {region.name} · {subRegionName}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', margin: '0 0 16px', lineHeight: 1.1, fontWeight: 700 }}>
            {place.name}
          </h1>
          <p style={{ maxWidth: 600, fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
            {place.desc}
          </p>
        </div>
      </div>

      {/* ── Stats Strip ─────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, padding: '24px 40px', borderRight: '1px solid var(--color-border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Elevation</div>
          <div style={{ fontSize: 24, fontWeight: 500 }}>{place.elevation || 'N/A'}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200, padding: '24px 40px', borderRight: '1px solid var(--color-border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Season</div>
          <div style={{ fontSize: 24, fontWeight: 500 }}>{place.season || 'Year-round'}</div>
        </div>
        {place.stats?.map(stat => (
          <div key={stat.label} style={{ flex: 1, minWidth: 200, padding: '24px 40px', borderRight: '1px solid var(--color-border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 500 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Journey ─────────────────────────────────── */}
      <section ref={containerRef} style={{ position: 'relative', padding: isMobile ? '60px 24px' : '100px 80px', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* The continuous road line */}
        {!isMobile && stops.length > 0 && (
          <div style={{ position: 'absolute', top: 120, bottom: 120, left: '50%', width: 2, background: 'var(--color-border)', transform: 'translateX(-50%)' }}>
            <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--color-accent)', transformOrigin: 'top', scaleY: pathLength }} />
          </div>
        )}

        {stops.map((stop, i) => {
          const isLeft = i % 2 === 0
          return (
            <motion.div key={stop.id} 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexDirection: isMobile ? 'column' : (isLeft ? 'row' : 'row-reverse'), alignItems: 'center', gap: isMobile ? 32 : 80, marginBottom: isMobile ? 60 : 120, position: 'relative' }}>
              
              {/* Point on the line */}
              {!isMobile && (
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: '50%', background: 'var(--color-background)', border: '2px solid var(--color-accent)', transform: 'translate(-50%, -50%)', zIndex: 2 }} />
              )}

              {/* Media */}
              <div style={{ flex: 1, width: '100%' }}>
                {stop.mediaUrl ? (
                  <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={stop.mediaUrl} alt={stop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundImage: `url("${blurPlaceholderFromUrl(stop.mediaUrl)}")`, backgroundSize: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ borderRadius: 16, aspectRatio: '4/3', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: 'rgba(255,255,255,0.1)' }}>{stop.altitude}m</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, textAlign: isMobile ? 'left' : (isLeft ? 'right' : 'left'), padding: isMobile ? 0 : (isLeft ? '0 40px 0 0' : '0 0 0 40px') }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: 'var(--color-accent)', marginBottom: 12 }}>{stop.altitude}m</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(24px, 3vw, 36px)', margin: '0 0 16px' }}>{stop.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{stop.moment}</p>
                {stop.cinematicText && (
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: 'italic', fontSize: 18, color: 'rgba(232,201,122,0.8)', marginTop: 24 }}>"{stop.cinematicText}"</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* ── Tips ─────────────────────────────────── */}
      {place.tips && place.tips.length > 0 && (
        <section style={{ padding: isMobile ? '0 24px 80px' : '0 80px 120px', maxWidth: 800, margin: '0 auto' }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: 32, letterSpacing: '0.1em' }}>Driver Notes</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {place.tips.map((tip, i) => (
              <li key={i} style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
