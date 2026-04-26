import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import 'lite-youtube-embed'
import { HIMALAYA_REGIONS, type HimalayaVideo, type TrekStop } from '../data/himalaya'
import { useMapStore } from '../store/mapStore'
import { useMediaQuery } from '../hooks/useMediaQuery'

const LiteYouTube = 'lite-youtube' as any

/* ─────────────────────────────────────────────────────────────────────
 * DEFAULT STOPS
 * ───────────────────────────────────────────────────────────────────── */
function generateDefaultStops(place: { name: string; elevation?: string; emoji: string }): TrekStop[] {
  const altNum = parseInt((place.elevation || '2000').replace(/[^0-9]/g, ''))
  const baseAlt = Math.max(altNum - 800, 500)
  return [
    { id: 'start',   scrollDepth: 0,  altitude: baseAlt, title: 'Setting out',   moment: `The journey to ${place.name} begins.`, cinematicText: 'Every journey starts with a single step away from the familiar.', type: 'text' },
    { id: 'midway',  scrollDepth: 40, altitude: Math.round(baseAlt + (altNum - baseAlt) * 0.5), title: 'On the way', moment: 'The landscape shifts. Each step brings something new.', cinematicText: 'The road is the destination too.', type: 'photo', mediaUrl: '' },
    { id: 'summit',  scrollDepth: 75, altitude: altNum,   title: place.name,      moment: `You arrive. ${place.name} reveals itself.`, cinematicText: 'You are exactly where you are supposed to be.', type: 'summit' },
    { id: 'descent', scrollDepth: 95, altitude: Math.round(baseAlt + (altNum - baseAlt) * 0.3), title: 'Heading back', moment: 'The memory stays.', cinematicText: 'You carry more weight on the way down — all of it invisible.', type: 'text' },
  ]
}

/* ─────────────────────────────────────────────────────────────────────
 * ALTITUDE GRADIENT PLACEHOLDER
 * ───────────────────────────────────────────────────────────────────── */
function altGradient(alt: number) {
  if (alt < 3000) return 'linear-gradient(145deg,#0a1a0a,#0d2010)'
  if (alt < 3500) return 'linear-gradient(145deg,#0a1015,#0d1520)'
  return 'linear-gradient(145deg,#08080f,#121228)'
}

/* ─────────────────────────────────────────────────────────────────────
 * CONNECTOR BETWEEN STOPS
 * ───────────────────────────────────────────────────────────────────── */
function StopConnector() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0', zIndex:1, position:'relative' }}>
      <div style={{ width:1, height:56, background:'linear-gradient(to bottom,rgba(232,201,122,0.4),rgba(232,201,122,0.06))' }} />
      <motion.div animate={{ y:[0,6,0] }} transition={{ duration:1.8, ease:'easeInOut', repeat:Infinity }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M2 2L8 8L14 2" stroke="#e8c97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      <div style={{ width:1, height:36, background:'linear-gradient(to bottom,rgba(232,201,122,0.08),transparent)' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 * STOP BLOCK — photo first, then staggered text reveal
 * ───────────────────────────────────────────────────────────────────── */
function StopBlock({ stop, index }: { stop: TrekStop; index: number }) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const isEven = isMobile ? true : (index % 2 === 0) // On mobile, everything behaves like 'even' (photo then left-aligned text)

  const photoEl = (
    <motion.div
      style={{ position:'relative', borderRadius:14, overflow:'hidden',
        height: stop.type === 'summit' ? 520 : 'clamp(320px,40vw,440px)' }}
      initial={{ opacity:0, scale:1.04 }}
      whileInView={{ opacity:1, scale:1 }}
      viewport={{ once:false, margin:'-80px' }}
      transition={{ duration:1.0, ease:[0.25,0.8,0.25,1] }}
    >
      {stop.mediaUrl ? (
        <img loading="lazy" decoding="async" src={stop.mediaUrl} alt={stop.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
            transition:'transform 0.7s ease' }}
          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }} />
      ) : (
        <div style={{ width:'100%', height:'100%', background:altGradient(stop.altitude),
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:52,
            color:'#e8c97a', opacity:0.15, fontWeight:700 }}>
            {stop.altitude.toLocaleString()}
          </span>
        </div>
      )}
      {/* Altitude badge */}
      <div style={{
        position:'absolute', top:18, ...(isEven ? { left:18 } : { right:18 }),
        background:'rgba(6,8,12,0.82)', backdropFilter:'blur(8px)',
        border:'1px solid rgba(232,201,122,0.3)', borderRadius:6,
        padding:'5px 12px', fontFamily:"'Space Mono',monospace",
        fontSize:11, color:'#e8c97a', letterSpacing:'0.1em',
      }}>
        ▲ {stop.altitude.toLocaleString()}m
      </div>
    </motion.div>
  )

  const textEl = (
    <div style={{
      display:'flex', flexDirection:'column', justifyContent:'center',
      padding: isMobile ? '24px 0 0' : (isEven ? '0 0 0 48px' : '0 48px 0 0'),
      textAlign: isEven ? 'left' : 'right',
      alignItems: isEven ? 'flex-start' : 'flex-end',
    }}>
      {/* Stop number */}
      <motion.div
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }}
        transition={{ duration:0.5, delay:0.3 }}
        style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
          color:'rgba(232,201,122,0.28)', letterSpacing:'0.25em', marginBottom:14 }}>
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
        transition={{ duration:0.6, delay:0.5 }}
        style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,2.5vw,30px)',
          fontWeight:700, color:'#edeae2', lineHeight:1.1, margin:'0 0 18px' }}>
        {stop.title}
      </motion.h3>

      {/* Cinematic text — gold italic, the emotional voice */}
      {stop.cinematicText && (
        <motion.p
          initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
          transition={{ duration:0.6, delay:0.7 }}
          style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
            fontSize:'clamp(15px,1.4vw,19px)', color:'#e8c97a', lineHeight:1.7,
            margin:'0 0 18px', fontWeight:400 }}>
          "{stop.cinematicText}"
        </motion.p>
      )}

      {/* Moment — Space Mono field notes */}
      <motion.p
        initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
        transition={{ duration:0.5, delay:0.9 }}
        style={{ fontFamily:"'Space Mono',monospace", fontSize:12,
          color:'rgba(255,255,255,0.38)', lineHeight:1.85, margin:0 }}>
        {stop.moment}
      </motion.p>
    </div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 48,
      alignItems:'center', padding: isMobile ? '32px 0' : '56px 0' }}>
      {isMobile ? <>{photoEl}{textEl}</> : (isEven ? <>{photoEl}{textEl}</> : <>{textEl}{photoEl}</>)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 * TEXT-ONLY STOP — centered, with altitude placeholder
 * ───────────────────────────────────────────────────────────────────── */
function TextOnlyBlock({ stop, index }: { stop: TrekStop; index: number }) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const isEven = isMobile ? true : (index % 2 === 0)
  
  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 48,
      alignItems:'center', padding: isMobile ? '32px 0' : '56px 0' }}>
      {isEven ? (
        <>
          {/* dark altitude placeholder */}
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }}
            transition={{ duration:0.8 }}
            style={{ position:'relative', borderRadius:14, overflow:'hidden',
              height: isMobile ? '200px' : 'clamp(200px,25vw,300px)', background:altGradient(stop.altitude),
              display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize: isMobile ? 36 : 56,
              color:'#e8c97a', opacity:0.1, fontWeight:700, letterSpacing:'-0.02em' }}>
              {stop.altitude.toLocaleString()}
            </span>
            <div style={{ position:'absolute', top:18, left:18, background:'rgba(6,8,12,0.82)',
              border:'1px solid rgba(232,201,122,0.25)', borderRadius:6, padding:'5px 12px',
              fontFamily:"'Space Mono',monospace", fontSize:11, color:'#e8c97a' }}>
              ▲ {stop.altitude.toLocaleString()}m
            </div>
          </motion.div>
          <div style={{ padding: isMobile ? '16px 0 0' : '0 0 0 48px' }}>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }}
              transition={{ delay:0.3 }}
              style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
                color:'rgba(232,201,122,0.28)', letterSpacing:'0.25em', marginBottom:14 }}>
              {String(index + 1).padStart(2, '0')}
            </motion.div>
            <motion.h3 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
              transition={{ duration:0.6, delay:0.5 }}
              style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,2.5vw,30px)',
                fontWeight:700, color:'#edeae2', margin:'0 0 18px', lineHeight:1.1 }}>
              {stop.title}
            </motion.h3>
            {stop.cinematicText && (
              <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
                transition={{ duration:0.6, delay:0.7 }}
                style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                  fontSize:'clamp(15px,1.4vw,19px)', color:'#e8c97a', lineHeight:1.7, margin:'0 0 18px' }}>
                "{stop.cinematicText}"
              </motion.p>
            )}
            <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
              transition={{ duration:0.5, delay:0.9 }}
              style={{ fontFamily:"'Space Mono',monospace", fontSize:12,
                color:'rgba(255,255,255,0.38)', lineHeight:1.85, margin:0 }}>
              {stop.moment}
            </motion.p>
          </div>
        </>
      ) : (
        <>
          <div style={{ padding:'0 48px 0 0', textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }}
              transition={{ delay:0.3 }}
              style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
                color:'rgba(232,201,122,0.28)', letterSpacing:'0.25em', marginBottom:14 }}>
              {String(index + 1).padStart(2, '0')}
            </motion.div>
            <motion.h3 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
              transition={{ duration:0.6, delay:0.5 }}
              style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,2.5vw,30px)',
                fontWeight:700, color:'#edeae2', margin:'0 0 18px', lineHeight:1.1 }}>
              {stop.title}
            </motion.h3>
            {stop.cinematicText && (
              <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
                transition={{ duration:0.6, delay:0.7 }}
                style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                  fontSize:'clamp(15px,1.4vw,19px)', color:'#e8c97a', lineHeight:1.7, margin:'0 0 18px' }}>
                "{stop.cinematicText}"
              </motion.p>
            )}
            <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
              transition={{ duration:0.5, delay:0.9 }}
              style={{ fontFamily:"'Space Mono',monospace", fontSize:12,
                color:'rgba(255,255,255,0.38)', lineHeight:1.85, margin:0 }}>
              {stop.moment}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }}
            transition={{ duration:0.8 }}
            style={{ position:'relative', borderRadius:14, overflow:'hidden',
              height:'clamp(200px,25vw,300px)', background:altGradient(stop.altitude),
              display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:56,
              color:'#e8c97a', opacity:0.1, fontWeight:700 }}>
              {stop.altitude.toLocaleString()}
            </span>
            <div style={{ position:'absolute', top:18, right:18, background:'rgba(6,8,12,0.82)',
              border:'1px solid rgba(232,201,122,0.25)', borderRadius:6, padding:'5px 12px',
              fontFamily:"'Space Mono',monospace", fontSize:11, color:'#e8c97a' }}>
              ▲ {stop.altitude.toLocaleString()}m
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 * SUMMIT — full-bleed 100vh reveal
 * ───────────────────────────────────────────────────────────────────── */
function SummitBlock({ stop }: { stop: TrekStop }) {
  return (
    <motion.div
      style={{ position:'relative', height:'100vh', borderRadius:20,
        overflow:'hidden', margin:'32px 0' }}
      initial={{ opacity:0 }}
      whileInView={{ opacity:1 }}
      viewport={{ once:true, margin:'-100px' }}
      transition={{ duration:1.2 }}
    >
      {stop.mediaUrl
        ? <img loading="lazy" decoding="async" src={stop.mediaUrl} alt={stop.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        : <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,#08080f,#141428)' }} />
      }
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to bottom, rgba(6,8,12,0.65) 0%, rgba(6,8,12,0.15) 35%, rgba(6,8,12,0.3) 70%, rgba(6,8,12,0.9) 100%)' }} />

      {/* Star burst */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        {Array.from({ length:12 }).map((_, i) => (
          <div key={i} style={{ position:'absolute', width:1, height:22,
            background:'linear-gradient(to top,#e8c97a,transparent)', opacity:0.25,
            transform:`rotate(${i * 30}deg) translateY(-90px)`,
            animation:`starPulse 3s ease ${i * 0.22}s infinite` }} />
        ))}
      </div>

      <div style={{ position:'absolute', top:'12%', left:0, right:0, textAlign:'center', padding:'0 40px' }}>
        <motion.div
          initial={{ scale:0.85, opacity:0 }} whileInView={{ scale:1, opacity:1 }} viewport={{ once:false }}
          transition={{ duration:1.1, ease:[0.25,0.8,0.25,1] }}
        >
          <div style={{ fontFamily:"'Space Mono',monospace",
            fontSize:'clamp(52px,9vw,112px)', color:'#e8c97a',
            fontWeight:700, lineHeight:1, letterSpacing:'-0.02em',
            textShadow:'0 0 80px rgba(232,201,122,0.25)' }}>
            {stop.altitude.toLocaleString()}m
          </div>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
            transition={{ delay:0.4 }}
            style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
              fontSize:'clamp(28px,5vw,64px)', color:'rgba(255,255,255,0.9)',
              marginTop:14, textShadow:'0 2px 40px rgba(0,0,0,0.5)' }}>
            {stop.title.split(' — ')[0]}
          </motion.div>
        </motion.div>
      </div>
      <style>{`@keyframes starPulse{0%,100%{opacity:0.08}50%{opacity:0.35}}`}</style>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
 *  MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */
export default function PlacePage() {
  const { regionId, placeId } = useParams<{ regionId: string; placeId: string }>()
  const navigate = useNavigate()
  const openRegionPanel = useMapStore((s) => s.openRegionPanel)

  const trekRef = useRef<HTMLElement>(null)

  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState<HimalayaVideo | null>(null)
  const closeModal = useCallback(() => setActiveVideo(null), [])

  /* ── Data ────────────────────────────────────────────────────────── */
  const region = useMemo(() => HIMALAYA_REGIONS.find((r) => r.id === regionId), [regionId])
  const { place, subRegionName } = useMemo(() => {
    if (!region) return { place: null, subRegionName: '' }
    for (const sub of region.subregions) {
      const p = sub.places.find((sp) => sp.id === placeId)
      if (p) return { place: p, subRegionName: sub.name }
    }
    return { place: null, subRegionName: '' }
  }, [region, placeId])

  const trekStops = useMemo(() => (place ? (place.trekStops || generateDefaultStops(place)) : []), [place])
  const minAlt = useMemo(() => Math.min(...trekStops.map(s => s.altitude)), [trekStops])
  const maxAlt = useMemo(() => Math.max(...trekStops.map(s => s.altitude)), [trekStops])

  /* ── Scroll ──────────────────────────────────────────────────────── */
  const { scrollY } = useScroll()
  
  // Image itself stays mostly visible, just dims slightly at the very end
  const heroOpacity = useTransform(scrollY, [0, 800, 1500], [1, 1, 0.4])
  // Hero scales very subtly for depth
  const heroScale   = useTransform(scrollY, [0, 1200], [1, 1.1])
  // This overlay starts TRANSPARENT and gets DARK as we scroll into the trek
  const bgDimming   = useTransform(scrollY, [0, 600, 1200], ["rgba(6,8,12,0)", "rgba(6,8,12,0.6)", "rgba(6,8,12,0.92)"])

  /* ── IntersectionObserver — fires when each stop enters viewport ── */
  /* This is the CORRECT way: the left-panel altitude always matches   */
  /* whichever stop block is currently crossing the top 50% of screen */
  useEffect(() => {
    if (!trekRef.current) return
    const els = trekRef.current.querySelectorAll<HTMLDivElement>('[data-stop-index]')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the vertical center of the screen
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => {
            const da = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2)
            const db = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2)
            return da - db
          })
        if (visible.length > 0) {
          const idx = Number((visible[0].target as HTMLElement).dataset.stopIndex ?? 0)
          setActiveStopIndex(idx)
        }
      },
      { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [trekStops])

  /* ── Keyboard + scroll reset ─────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  /* ── SEO ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (place && region) {
      document.title = `${place.name} — ${region.name} | Peaks & Paths`
      document.querySelector('meta[name="description"]')?.setAttribute('content', place.desc.slice(0, 155))
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${place.name} — Peaks & Paths`)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content',
        place.experience ? place.experience.split('.')[0] + '.' : place.desc.slice(0, 120))
      if (place.image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', place.image)
    }
    return () => {
      document.title = 'Peaks & Paths — Himalayan Mountain Travel Atlas'
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Peaks & Paths — Himalayan Travel Journal')
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Solo documenting the Himalayas since 2021.')
    }
  }, [place, region])

  /* ── Back ────────────────────────────────────────────────────────── */
  const handleBack = useCallback(() => {
    const from = (window.history.state?.usr as any)?.from as 'map' | 'grid' | undefined
    if (from === 'grid') navigate('/#regions')
    else if (from === 'map') { navigate('/'); if (regionId) openRegionPanel(regionId) }
    else navigate(-1)
  }, [navigate, regionId, openRegionPanel])

  /* ── Guard ───────────────────────────────────────────────────────── */
  if (!region || !place) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#06080c', color:'#7a7570', fontFamily:"'Space Mono',monospace" }}>
        Place not found.
      </div>
    )
  }

  // Current stop — snapped (matches photo badge exactly)
  const currentStop = trekStops[activeStopIndex] || trekStops[0]
  const trailProgress = activeStopIndex / Math.max(trekStops.length - 1, 1)

  const isMobile = useMediaQuery('(max-width: 900px)')



  /* ═══════════════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background:'#06080c', minHeight:'100vh', position:'relative' }}>

      {/* ══════════════════════════════════════════════════════════════
       * FIXED BACKGROUND IMAGE — stays dim behind entire page
       * ══════════════════════════════════════════════════════════════ */}
      {place.image && (
        <motion.div
          style={{
            position:'fixed', inset:0, zIndex:0,
            opacity: heroOpacity,
            scale: heroScale,
          }}
        >
          <img src={place.image} fetchPriority="high" decoding="async" alt=""
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          {/* DYNAMIC dimming: starts clear (0), gets dark as you scroll down */}
          <motion.div style={{ position:'absolute', inset:0, background: bgDimming }} />
        </motion.div>
      )}

      {/* Everything above the fixed bg */}
      <div style={{ position:'relative', zIndex:1 }}>

        {/* ── Fixed back button ─────────────────────────────────── */}
        <button onClick={handleBack} style={{
          position:'fixed', top: isMobile ? 16 : 24, left: isMobile ? 16 : 24, zIndex:50,
          display:'flex', alignItems:'center', gap:8,
          padding:'10px 18px', borderRadius:12,
          background:'rgba(6,8,12,0.72)', backdropFilter:'blur(16px)',
          color:'#edeae2', fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500,
          border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'0 4px 24px rgba(0,0,0,0.4)', cursor:'pointer',
          transition:'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,201,122,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        >
          <span style={{ color:'#e8c97a' }}>←</span> Back to map
        </button>

        {/* ════════════════════════════════════════════════════════════
         * HERO — 100vh, transparent so fixed bg shows through
         * ════════════════════════════════════════════════════════════ */}
        <section style={{ height:'100vh', position:'relative', display:'flex',
          alignItems:'flex-end', padding: isMobile ? '0 6% 12%' : '0 clamp(24px,6vw,80px) 10%' }}>

          {/* Bottom gradient: darkens just enough to read text */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            background:'linear-gradient(to bottom, rgba(6,8,12,0.05) 0%, rgba(6,8,12,0.1) 40%, rgba(6,8,12,0.75) 80%, rgba(6,8,12,0.95) 100%)' }} />

          <div style={{ position:'relative', maxWidth:640 }}>
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:'0.18em',
                color:'rgba(232,201,122,0.7)', textTransform:'uppercase', marginBottom:18 }}>
                {region.name.toUpperCase()} · {subRegionName.toUpperCase()}
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(52px,8vw,96px)',
                color:'#edeae2', margin:'0 0 22px', fontWeight:700, lineHeight:0.95,
                textShadow:'0 2px 50px rgba(0,0,0,0.6)' }}>
                {place.name}
              </h1>
              <div style={{ display:'flex', alignItems:'center', gap:20,
                fontFamily:"'Space Mono',monospace", fontSize:12, color:'rgba(255,255,255,0.4)' }}>
                <span>{place.elevation}</span>
                <span style={{ width:1, height:12, background:'rgba(255,255,255,0.18)' }} />
                <span>{place.season || 'Year-round'}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
              style={{ display:'flex', alignItems:'center', gap:10, marginTop:44,
                fontFamily:"'Space Mono',monospace", fontSize:10,
                color:'rgba(232,201,122,0.35)', letterSpacing:'0.2em', textTransform:'uppercase' }}>
              <motion.span animate={{ y:[0,5,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}>↓</motion.span>
              Begin the journey
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
         * TREK TIMELINE
         * ════════════════════════════════════════════════════════════ */}
        <section ref={trekRef} style={{ position:'relative' }}>

          {/* Gradient overlay so content stays readable while blending perfectly with Hero gradient (0.95) */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(6,8,12,0.95) 0%, rgba(6,8,12,0.78) 15vh, rgba(6,8,12,0.78) 100%)',
            pointerEvents:'none' }} />

          {/* ── Sticky Left Panel ─────────────────────────────────── */}
          <div style={{
            position:'sticky', top:0, height:'100vh', width:200,
            float:'left', display: isMobile ? 'none' : 'flex', alignItems:'center', justifyContent:'center',
            zIndex:10, pointerEvents:'none',
          }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
              gap:12, width:'100%', padding:'0 24px', position:'relative' }}>

              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
                color:'rgba(232,201,122,0.28)', letterSpacing:'0.15em',
                textTransform:'uppercase', textAlign:'center' }}>
                {maxAlt.toLocaleString()}m
              </div>

              {/* Trail bar */}
              <div style={{ position:'relative', width:2, height:180 }}>
                {/* Remaining */}
                <div style={{ position:'absolute', top:0, left:0, right:0,
                  height:`${(1 - trailProgress) * 100}%`,
                  background:'rgba(255,255,255,0.07)', transition:'height 0.5s ease' }} />
                {/* Completed — fills from bottom */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0,
                  height:`${trailProgress * 100}%`,
                  background:'linear-gradient(to top,#e8c97a,rgba(232,201,122,0.4))',
                  transition:'height 0.5s ease' }} />
                {/* Glowing dot */}
                <motion.div style={{
                  position:'absolute', left:'50%',
                  top:`${(1 - trailProgress) * 100}%`,
                  transform:'translate(-50%,-50%)',
                  width:10, height:10, borderRadius:'50%',
                  background:'#e8c97a',
                  boxShadow:'0 0 14px rgba(232,201,122,0.7)',
                }} />
                {/* Stop tick marks */}
                {trekStops.map((_, i) => (
                  <div key={i} style={{
                    position:'absolute', left:'50%',
                    top:`${(1 - i / Math.max(trekStops.length - 1, 1)) * 100}%`,
                    transform:'translate(-50%,-50%)',
                    width: i === activeStopIndex ? 7 : 3,
                    height: i === activeStopIndex ? 7 : 3,
                    borderRadius:'50%',
                    background: i <= activeStopIndex ? '#e8c97a' : 'rgba(255,255,255,0.12)',
                    transition:'all 0.35s ease',
                  }} />
                ))}
              </div>

              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
                color:'rgba(255,255,255,0.18)', letterSpacing:'0.15em',
                textTransform:'uppercase', textAlign:'center' }}>
                {minAlt.toLocaleString()}m
              </div>

              {/* Altitude display — MATCHES current stop's altitude exactly */}
              <div style={{ textAlign:'center', marginTop:6 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={currentStop.altitude}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-8 }} transition={{ duration:0.4 }}>
                    <div style={{ fontFamily:"'Space Mono',monospace",
                      fontSize:'clamp(28px,3vw,44px)', color:'#e8c97a',
                      fontWeight:700, lineHeight:1, letterSpacing:'-0.01em' }}>
                      {currentStop.altitude.toLocaleString()}
                    </div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
                      color:'rgba(232,201,122,0.35)', letterSpacing:'0.12em',
                      marginTop:4, textTransform:'uppercase' }}>
                      metres
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Current stop title + cinematic text */}
              <AnimatePresence mode="wait">
                <motion.div key={currentStop.id} style={{ textAlign:'center' }}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }} transition={{ duration:0.35 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                    fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.45,
                    maxWidth:155 }}>
                    {currentStop.title}
                  </div>
                  {currentStop.cinematicText && (
                    <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                      fontSize:10, color:'rgba(232,201,122,0.4)', lineHeight:1.55,
                      maxWidth:155, marginTop:8 }}>
                      "{currentStop.cinematicText}"
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Editorial Stops ─────────────────────────────────────── */}
          <div style={{ marginLeft: isMobile ? 0 : 200, padding: isMobile ? '32px 24px 80px' : '60px 56px 80px', position:'relative', zIndex:1 }}>
            {trekStops.map((stop, index) => (
              <div key={stop.id} data-stop-index={index}>
                {index > 0 && <StopConnector />}
                {stop.type === 'summit'
                  ? <SummitBlock stop={stop} />
                  : (stop.type === 'text' || !stop.mediaUrl)
                    ? <TextOnlyBlock stop={stop} index={index} />
                    : <StopBlock stop={stop} index={index} />
                }
              </div>
            ))}

            {/* Videos */}
            {place.videos && place.videos.length > 0 && (
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }}
                transition={{ duration:0.6 }} style={{ marginTop:140, paddingTop:60, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:'0.2em',
                  textTransform:'uppercase', color:'rgba(232,201,122,0.35)', marginBottom:24 }}>
                  Watch the journey
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                  {place.videos.map((video, i) => (
                    <button key={i} onClick={() => setActiveVideo(video)}
                      style={{ background:'rgba(10,12,18,0.9)', border:'1px solid rgba(255,255,255,0.05)',
                        borderRadius:12, overflow:'hidden', cursor:'pointer', textAlign:'left', padding:0,
                        transition:'all 0.3s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,201,122,0.28)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <div style={{ position:'relative', paddingBottom:'56.25%', background:'#080c10' }}>
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                          alt={video.title}
                          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.8 }}
                          onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }}
                        />
                        <div style={{ position:'absolute', inset:0, display:'flex',
                          alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.25)' }}>
                          <div style={{ width:46, height:46, borderRadius:'50%',
                            background:'rgba(232,201,122,0.9)',
                            display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#06080c"><polygon points="6,3 20,12 6,21" /></svg>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding:'14px 16px' }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13,
                          color:'#edeae2', fontWeight:500, marginBottom:4, lineHeight:1.4 }}>{video.title}</div>
                        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
                          color:'rgba(232,201,122,0.38)' }}>{video.views}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </section>
      </div>{/* /z-index wrapper */}

      {/* ── Video Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.25 }}
            style={{ position:'fixed', inset:0, zIndex:200, display:'flex',
              alignItems:'center', justifyContent:'center', padding:24 }}
            onClick={closeModal}>
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.92)' }} />
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.92, opacity:0 }}
              transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
              style={{ position:'relative', width:'100%', maxWidth:900 }}
              onClick={e => e.stopPropagation()}>
              <button onClick={closeModal} style={{ position:'absolute', top:-44, right:0,
                background:'none', border:'none', color:'#5a5550',
                fontSize:13, fontFamily:"'DM Sans',sans-serif", cursor:'pointer',
                display:'flex', alignItems:'center', gap:8 }}>
                Close <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.08)', fontSize:11 }}>ESC</span>
              </button>
              <div style={{ position:'relative', width:'100%', borderRadius:16, overflow:'hidden',
                boxShadow:'0 24px 80px rgba(0,0,0,0.7)', paddingBottom:'56.25%' }}>
                <LiteYouTube videoid={activeVideo.youtubeId} playlabel={activeVideo.title} params="autoplay=1"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
              </div>
              <p style={{ marginTop:14, textAlign:'center', fontFamily:"'Space Mono',monospace",
                fontSize:11, color:'rgba(255,255,255,0.25)' }}>{activeVideo.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
