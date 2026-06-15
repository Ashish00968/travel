import { motion } from 'framer-motion'
import type { PlaceLayoutProps } from './types'
import { blurPlaceholderFromUrl } from '../../lib/cloudinary'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function ScenicLayout({ place, region, subRegionName, onBack, navFrom }: PlaceLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const stops = place.trekStops || []

  return (
    <div style={{ background: '#020406', minHeight: '100vh', color: '#edeae2', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ── Fixed back button ─────────────────────────────────── */}
      <button onClick={onBack} style={{
        position:'fixed', top: isMobile ? 16 : 24, left: isMobile ? 16 : 24, zIndex:50,
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 18px', borderRadius:12,
        background:'rgba(2,4,6,0.72)', backdropFilter:'blur(16px)',
        color:'#edeae2', fontSize:13, fontWeight:500,
        border:'1px solid rgba(255,255,255,0.08)',
        cursor:'pointer', transition:'all 0.2s ease',
      }}>
        <span style={{ color:'#e8c97a' }}>←</span> {navFrom === 'grid' ? "Back to Where I've Been" : `Back to ${subRegionName}`}
      </button>

      {/* ── Hero Fullscreen ─────────────────────────────────── */}
      <div style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {place.image && (
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,4,6,0.2) 0%, rgba(2,4,6,0.8) 100%)' }} />
          </motion.div>
        )}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 24, maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#e8c97a', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
              Scenic View · {region.name} · {subRegionName}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(56px, 8vw, 120px)', margin: '0 0 24px', lineHeight: 0.9, letterSpacing: '-0.02em', textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
              {place.name}
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '0 auto', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {place.desc}
            </p>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span>Discover</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
        </motion.div>
      </div>

      {/* ── Editorial Content ─────────────────────────────────── */}
      {place.experience && (
        <section style={{ padding: isMobile ? '80px 24px' : '160px 80px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 40px)', color: '#e8c97a', lineHeight: 1.5, margin: 0 }}>
            "{place.experience}"
          </motion.p>
        </section>
      )}

      {/* ── Masonry Gallery ─────────────────────────────────── */}
      <section style={{ padding: isMobile ? '0 24px 80px' : '0 80px 160px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))', gap: isMobile ? 16 : 32 }}>
          {stops.map((stop, i) => (
            <motion.div key={stop.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: i % 3 === 0 ? '4/5' : '4/3', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              {stop.mediaUrl ? (
                <img src={stop.mediaUrl} alt={stop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundImage: `url("${blurPlaceholderFromUrl(stop.mediaUrl)}")`, backgroundSize: 'cover', transition: 'transform 0.7s ease' }} 
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }} onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, color: 'rgba(255,255,255,0.1)' }}>{stop.title}</span>
                </div>
              )}
              
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,4,6,0.9) 0%, rgba(2,4,6,0) 50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: '0 0 8px', color: '#edeae2' }}>{stop.title}</h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{stop.moment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}
