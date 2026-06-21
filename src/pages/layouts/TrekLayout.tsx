import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import 'lite-youtube-embed'
import { type HimalayaVideo, type TrekStop } from '../../data/himalaya'
import { blurPlaceholderFromUrl } from '../../lib/cloudinary'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { PlaceLayoutProps } from './types'

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

function altGradient(alt: number) {
  if (alt < 3000) return 'linear-gradient(145deg,#0a1a0a,#0d2010)'
  if (alt < 3500) return 'linear-gradient(145deg,#0a1015,#0d1520)'
  return 'linear-gradient(145deg,#08080f,#121228)'
}

function StopConnector() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0', zIndex:1, position:'relative' }}>
      <div style={{ width:1, height:72, background:'linear-gradient(to bottom,rgba(232,201,122,0.6),rgba(232,201,122,0.02))' }} />
      <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.2, ease:'easeInOut', repeat:Infinity }}>
        <svg width="18" height="12" viewBox="0 0 16 10" fill="none">
          <path d="M2 2L8 8L14 2" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      <div style={{ width:1, height:48, background:'linear-gradient(to bottom,rgba(232,201,122,0.1),transparent)' }} />
    </div>
  )
}

function StopBlock({ stop, index }: { stop: TrekStop; index: number }) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const isEven = isMobile ? true : (index % 2 === 0)
  const mediaUrl = (stop as Extract<TrekStop, { type: 'photo' }>).mediaUrl

  const photoEl = (
    <motion.div
      style={{ position:'relative', borderRadius:20, overflow:'hidden', aspectRatio: stop.aspectRatio || '4/3', border:'1px solid rgba(255,255,255,0.03)' }}
      initial={{ opacity:0, scale:0.95, y:40 }} whileInView={{ opacity:1, scale:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
      transition={{ duration:1.2, ease:[0.2,0.8,0.2,1] }}
    >
      {mediaUrl ? (
        <img loading="lazy" decoding="async" src={mediaUrl} alt={stop.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1.5s ease',
            backgroundImage: `url("${blurPlaceholderFromUrl(mediaUrl)}")`, backgroundSize: 'cover' }}
          onMouseEnter={e => { 
            (e.target as HTMLImageElement).style.transform = 'scale(1.08)';
            (e.target as HTMLImageElement).style.filter = 'saturate(1.1) brightness(1.05)';
          }}
          onMouseLeave={e => { 
            (e.target as HTMLImageElement).style.transform = 'scale(1)';
            (e.target as HTMLImageElement).style.filter = 'saturate(1) brightness(1)';
          }} />
      ) : (
        <div style={{ width:'100%', height:'100%', background:altGradient(stop.altitude), display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:52, color:'var(--color-accent)', opacity:0.15, fontWeight:700 }}>
            {stop.altitude.toLocaleString()}
          </span>
        </div>
      )}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at center, transparent 40%, rgba(6,8,12,0.4) 100%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:24, ...(isEven ? { left:24 } : { right:24 }), background:'rgba(6,8,12,0.65)', backdropFilter:'blur(12px)',
        border:'1px solid rgba(232,201,122,0.3)', borderRadius:8, padding:'6px 14px', fontFamily:"var(--font-mono)", fontSize:12, color:'var(--color-accent)', letterSpacing:'0.15em' }}>
        ▲ {stop.altitude.toLocaleString()}M
      </div>
      <div style={{ position:'absolute', inset:0, border:'1px solid transparent', borderRadius:20, transition:'border-color 1.5s ease', pointerEvents:'none' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(232,201,122,0.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; }} />
    </motion.div>
  )

  const textEl = (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile ? '32px 0 0' : (isEven ? '0 0 0 64px' : '0 64px 0 0'),
      textAlign: isEven ? 'left' : 'right', alignItems: isEven ? 'flex-start' : 'flex-end' }}>
      <motion.div initial={{ opacity:0, x: isEven ? -20 : 20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:false }} transition={{ duration:0.7, delay:0.2 }}
        style={{ fontFamily:"var(--font-mono)", fontSize:11, color:'rgba(232,201,122,0.5)', letterSpacing:'0.3em', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
        {isEven ? <><span style={{width:24, height:1, background:'rgba(232,201,122,0.5)'}} />{String(index + 1).padStart(2, '0')}</> : <>{String(index + 1).padStart(2, '0')}<span style={{width:24, height:1, background:'rgba(232,201,122,0.5)'}} /></>}
      </motion.div>
      <motion.h3 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.8, delay:0.3 }}
        style={{ fontFamily:"var(--font-display)", fontSize:'clamp(28px,3.5vw,42px)', fontWeight:600, color:'var(--color-text)', lineHeight:1.1, margin:'0 0 24px', letterSpacing:'-0.01em' }}>
        {stop.title}
      </motion.h3>
      {stop.cinematicText && (
        <div style={{ position:'relative', padding: isEven ? '0 0 0 20px' : '0 20px 0 0', margin:'0 0 24px', maxWidth:400 }}>
          <span style={{ position:'absolute', top:-45, [isEven ? 'left' : 'right']:-15, fontSize:120, fontFamily:"var(--font-display)", color:'var(--color-accent)', opacity:0.08, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
            &ldquo;
          </span>
          <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.7, delay:0.5 }}
            style={{ position:'relative', zIndex:1, fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:'clamp(16px,1.5vw,21px)', color:'var(--color-accent)', lineHeight:1.6, margin:0, fontWeight:400 }}>
            {stop.cinematicText}
          </motion.p>
        </div>
      )}
      <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.6, delay:0.7 }}
        style={{ fontFamily:"var(--font-mono)", fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.8, margin:0, maxWidth:420 }}>
        {stop.moment}
      </motion.p>
    </div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 48, alignItems:'center', padding: isMobile ? '40px 0' : '80px 0' }}>
      {isMobile ? <>{photoEl}{textEl}</> : (isEven ? <>{photoEl}{textEl}</> : <>{textEl}{photoEl}</>)}
    </div>
  )
}

function TextOnlyBlock({ stop, index }: { stop: TrekStop; index: number }) {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const isEven = isMobile ? true : (index % 2 === 0)
  
  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 48, alignItems:'center', padding: isMobile ? '40px 0' : '80px 0' }}>
      {isEven ? (
        <>
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:false }} transition={{ duration:1 }}
            style={{ position:'relative', borderRadius:20, overflow:'hidden', height: isMobile ? '240px' : 'clamp(240px,30vw,360px)', background:altGradient(stop.altitude), display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize: isMobile ? 48 : 72, color:'var(--color-accent)', opacity:0.08, fontWeight:700, letterSpacing:'-0.02em' }}>
              {stop.altitude.toLocaleString()}
            </span>
            <div style={{ position:'absolute', top:24, left:24, background:'rgba(6,8,12,0.65)', backdropFilter:'blur(12px)', border:'1px solid rgba(232,201,122,0.3)', borderRadius:8, padding:'6px 14px', fontFamily:"var(--font-mono)", fontSize:12, color:'var(--color-accent)', letterSpacing:'0.15em' }}>
              ▲ {stop.altitude.toLocaleString()}M
            </div>
          </motion.div>
          <div style={{ padding: isMobile ? '24px 0 0' : '0 0 0 64px' }}>
            <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:false }} transition={{ delay:0.2, duration:0.7 }}
              style={{ fontFamily:"var(--font-mono)", fontSize:11, color:'rgba(232,201,122,0.5)', letterSpacing:'0.3em', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{width:24, height:1, background:'rgba(232,201,122,0.5)'}} />{String(index + 1).padStart(2, '0')}
            </motion.div>
            <motion.h3 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.8, delay:0.3 }}
              style={{ fontFamily:"var(--font-display)", fontSize:'clamp(28px,3.5vw,42px)', fontWeight:600, color:'var(--color-text)', margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.01em' }}>
              {stop.title}
            </motion.h3>
            {stop.cinematicText && (
              <div style={{ position:'relative', padding:'0 0 0 20px', margin:'0 0 24px', maxWidth:400 }}>
                <span style={{ position:'absolute', top:-45, left:-15, fontSize:120, fontFamily:"var(--font-display)", color:'var(--color-accent)', opacity:0.08, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                  &ldquo;
                </span>
                <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.7, delay:0.5 }}
                  style={{ position:'relative', zIndex:1, fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:'clamp(16px,1.5vw,21px)', color:'var(--color-accent)', lineHeight:1.6, margin:0 }}>
                  {stop.cinematicText}
                </motion.p>
              </div>
            )}
            <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.6, delay:0.7 }}
              style={{ fontFamily:"var(--font-mono)", fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.8, margin:0, maxWidth:420 }}>
              {stop.moment}
            </motion.p>
          </div>
        </>
      ) : (
        <>
          <div style={{ padding:'0 64px 0 0', textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:false }} transition={{ delay:0.2, duration:0.7 }}
              style={{ fontFamily:"var(--font-mono)", fontSize:11, color:'rgba(232,201,122,0.5)', letterSpacing:'0.3em', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
              {String(index + 1).padStart(2, '0')}<span style={{width:24, height:1, background:'rgba(232,201,122,0.5)'}} />
            </motion.div>
            <motion.h3 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.8, delay:0.3 }}
              style={{ fontFamily:"var(--font-display)", fontSize:'clamp(28px,3.5vw,42px)', fontWeight:600, color:'var(--color-text)', margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.01em' }}>
              {stop.title}
            </motion.h3>
            {stop.cinematicText && (
              <div style={{ position:'relative', padding:'0 20px 0 0', margin:'0 0 24px', maxWidth:400 }}>
                <span style={{ position:'absolute', top:-45, right:-15, fontSize:120, fontFamily:"var(--font-display)", color:'var(--color-accent)', opacity:0.08, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                  &ldquo;
                </span>
                <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.7, delay:0.5 }}
                  style={{ position:'relative', zIndex:1, fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:'clamp(16px,1.5vw,21px)', color:'var(--color-accent)', lineHeight:1.6, margin:0 }}>
                  {stop.cinematicText}
                </motion.p>
              </div>
            )}
            <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.6, delay:0.7 }}
              style={{ fontFamily:"var(--font-mono)", fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.8, margin:0, maxWidth:420 }}>
              {stop.moment}
            </motion.p>
          </div>
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:false }} transition={{ duration:1 }}
            style={{ position:'relative', borderRadius:20, overflow:'hidden', height:'clamp(240px,30vw,360px)', background:altGradient(stop.altitude), display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:72, color:'var(--color-accent)', opacity:0.08, fontWeight:700 }}>
              {stop.altitude.toLocaleString()}
            </span>
            <div style={{ position:'absolute', top:24, right:24, background:'rgba(6,8,12,0.65)', backdropFilter:'blur(12px)', border:'1px solid rgba(232,201,122,0.3)', borderRadius:8, padding:'6px 14px', fontFamily:"var(--font-mono)", fontSize:12, color:'var(--color-accent)', letterSpacing:'0.15em' }}>
              ▲ {stop.altitude.toLocaleString()}M
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

function SummitBlock({ stop }: { stop: TrekStop }) {
  const summitMedia = stop.type === 'summit' ? stop.mediaUrl : undefined
  return (
    <motion.div
      style={{ position:'relative', height:'100vh', borderRadius:24, overflow:'hidden', margin:'48px 0', border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 40px 100px rgba(0,0,0,0.5)' }}
      initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true, margin:'-100px' }} transition={{ duration:1.5, ease:[0.2,0.8,0.2,1] }}
    >
      {summitMedia
        ? <img loading="lazy" decoding="async" src={summitMedia} alt={stop.title}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'saturate(1.05)',
              backgroundImage: `url("${blurPlaceholderFromUrl(summitMedia)}")`, backgroundSize: 'cover' }} />
        : <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,#08080f,#141428)' }} />
      }
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at bottom, rgba(6,8,12,0.1) 0%, rgba(6,8,12,0.85) 100%)' }} />
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        {/* Pulsing ring behind the altitude */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position:'absolute', width: '40vw', height: '40vw', borderRadius:'50%', border:'2px solid var(--color-accent)', top:'5%', filter:'blur(4px)' }}
        />
        {Array.from({ length:12 }).map((_, i) => (
          <div key={i} style={{ position:'absolute', width:1, height:30, background:'linear-gradient(to top,var(--color-accent),transparent)', opacity:0.3,
            transform:`rotate(${i * 30}deg) translateY(-140px)`, animation:`starPulse 4s ease ${i * 0.3}s infinite` }} />
        ))}
      </div>
      <div style={{ position:'absolute', top:'15%', left:0, right:0, textAlign:'center', padding:'0 40px' }}>
        <motion.div initial={{ scale:0.9, opacity:0, y:20 }} whileInView={{ scale:1, opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:1.2, ease:[0.2,0.8,0.2,1] }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:'clamp(64px,10vw,140px)', color:'var(--color-accent)', fontWeight:700, lineHeight:1, letterSpacing:'-0.03em', textShadow:'0 0 100px rgba(232,201,122,0.3)' }}>
            {stop.altitude.toLocaleString()}M
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:14, color:'rgba(232,201,122,0.6)', letterSpacing:'0.4em', textTransform:'uppercase', marginTop:16 }}>
            The Summit
          </div>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ delay:0.5, duration:0.8 }}
            style={{ fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:'clamp(32px,5.5vw,72px)', color:'#fff', marginTop:24, textShadow:'0 4px 60px rgba(0,0,0,0.8)', fontWeight:500 }}>
            {stop.title.split(' — ')[0]}
          </motion.div>
        </motion.div>
      </div>
      <style>{`@keyframes starPulse{0%,100%{opacity:0.1}50%{opacity:0.45}}`}</style>
    </motion.div>
  )
}

function TrekSummaryBar() {
  const isMobile = useMediaQuery('(max-width: 900px)')
  return (
    <motion.div 
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2, duration:0.8 }}
      style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 40, marginTop: 24, 
        padding:'16px 24px', background:'rgba(6,8,12,0.5)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, width:'100%', justifyContent:'space-between' }}
    >
      {[
        { label: 'Difficulty', value: 'Moderate to Strenuous' },
        { label: 'Duration', value: '5-7 Days' },
        { label: 'Terrain', value: 'Alpine & Moraine' }
      ].map((stat, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:'rgba(232,201,122,0.5)', textTransform:'uppercase', letterSpacing:'0.15em' }}>
            {stat.label}
          </span>
          <span style={{ fontFamily:"var(--font-sans)", fontSize:15, color:'var(--color-text)', fontWeight:500 }}>
            {stat.value}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export default function TrekLayout({ place, region, subRegionName, onBack, navFrom }: PlaceLayoutProps) {
  const trekRef = useRef<HTMLElement>(null)
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState<HimalayaVideo | null>(null)
  const closeModal = useCallback(() => setActiveVideo(null), [])

  const trekStops = useMemo(() => (place ? (place.trekStops || generateDefaultStops(place)) : []), [place])
  const minAlt = useMemo(() => Math.min(...trekStops.map(s => s.altitude)), [trekStops])
  const maxAlt = useMemo(() => Math.max(...trekStops.map(s => s.altitude)), [trekStops])

  const stopBands = useMemo<Map<number, number>>(() => {
    const bands = new Map<number, number>()
    trekStops.forEach((stop, idx) => {
      const band = Math.min(Math.floor(stop.scrollDepth / 10), 10)
      bands.set(band, idx)
    })
    return bands
  }, [trekStops])

  const resolveStopIndex = useCallback((depth: number): number => {
    const band = Math.min(Math.floor(depth / 10), 10)
    for (let b = band; b >= 0; b--) {
      const idx = stopBands.get(b)
      if (idx !== undefined) return idx
    }
    return 0
  }, [stopBands])

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 800, 1500], [1, 0.8, 0.2])
  const heroScale   = useTransform(scrollY, [0, 1200], [1, 1.05])
  const bgDimming   = useTransform(scrollY, [0, 600, 1200], ["rgba(6,8,12,0.2)", "rgba(6,8,12,0.7)", "rgba(6,8,12,0.95)"])

  useEffect(() => {
    if (!trekRef.current) return
    const els = trekRef.current.querySelectorAll<HTMLDivElement>('[data-stop-index]')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => {
            const da = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2)
            const db = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2)
            return da - db
          })
        if (visible.length > 0) {
          const rawIdx = Number((visible[0].target as HTMLElement).dataset.stopIndex ?? 0)
          const scrollDepth = trekStops[rawIdx]?.scrollDepth ?? 0
          setActiveStopIndex(resolveStopIndex(scrollDepth))
        }
      },
      { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [trekStops, resolveStopIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  const currentStop = trekStops[activeStopIndex] || trekStops[0]
  const trailProgress = activeStopIndex / Math.max(trekStops.length - 1, 1)
  const isMobile = useMediaQuery('(max-width: 900px)')

  return (
    <div style={{ background:'var(--color-background)', minHeight:'100vh', position:'relative' }}>
      {place.image && (
        <motion.div style={{ position:'fixed', inset:0, zIndex:0, opacity: heroOpacity, scale: heroScale }}>
          <img src={place.image} fetchPriority="high" decoding="async" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          {/* Deep atmospheric multi-stop gradient */}
          <motion.div style={{ position:'absolute', inset:0, background: bgDimming }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(6,8,12,0.1) 0%, rgba(6,8,12,0) 30%, rgba(6,8,12,0.8) 75%, var(--color-background) 100%)' }} />
        </motion.div>
      )}

      <div style={{ position:'relative', zIndex:1 }}>
        <button onClick={onBack} style={{
          position:'fixed', top: isMobile ? 16 : 32, left: isMobile ? 16 : 32, zIndex:50, display:'flex', alignItems:'center', gap:10,
          padding:'12px 20px', borderRadius:30, background:'rgba(6,8,12,0.6)', backdropFilter:'blur(20px)',
          color:'var(--color-text)', fontSize:13, fontFamily:"var(--font-sans)", fontWeight:500, border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'0 10px 30px rgba(0,0,0,0.3)', cursor:'pointer', transition:'all 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,201,122,0.4)'; e.currentTarget.style.background = 'rgba(6,8,12,0.8)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(6,8,12,0.6)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <span style={{ color:'var(--color-accent)', fontSize:16, lineHeight:1 }}>←</span> {navFrom === 'grid' ? "Back to Where I've Been" : `Back to ${subRegionName}`}
        </button>

        <section style={{ height:'100vh', position:'relative', display:'flex', alignItems:'flex-start', justifyContent:'center', padding: isMobile ? '12vh 6% 0' : '8vh 6% 0' }}>
          <div style={{ position:'relative', maxWidth:700, width:'100%' }}>
            {/* Transparent Hero Area */}
            <motion.div 
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:1, ease:[0.2,0.8,0.2,1] }}
              style={{ background: 'transparent', padding: isMobile ? 0 : '16px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:16, width:'100%' }}>
                <span style={{ width:40, height:1, background:'var(--color-accent)' }} />
                <div style={{ fontFamily:"var(--font-mono)", fontSize:12, letterSpacing:'0.25em', color:'var(--color-accent)', textTransform:'uppercase' }}>
                  {region.name} · {subRegionName}
                </div>
                <span style={{ width:40, height:1, background:'var(--color-accent)' }} />
              </div>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:'clamp(48px,7vw,96px)', color:'#fff', margin:'0 0 16px', fontWeight:600, lineHeight:0.95, letterSpacing:'-0.02em', textShadow:'0 4px 60px rgba(0,0,0,0.5)' }}>
                {place.name}
              </h1>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24, fontFamily:"var(--font-mono)", fontSize:13, color:'rgba(255,255,255,0.7)', letterSpacing:'0.05em' }}>
                <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ color:'var(--color-accent)' }}>▲</span> {place.elevation}</span>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'rgba(255,255,255,0.3)' }} />
                <span>{place.season || 'Year-round'}</span>
              </div>

              {/* Trek Summary Bar */}
              <TrekSummaryBar />
            </motion.div>
          </div>
        </section>

        <section ref={trekRef} style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 0%, rgba(6,8,12,0.98) 15vh, var(--color-background) 100%)', pointerEvents:'none' }} />

          <div style={{
            position:'sticky', top:0, height:'100vh', width:240, float:'left', display: isMobile ? 'none' : 'flex', alignItems:'center', justifyContent:'center',
            zIndex:10, pointerEvents:'none',
          }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, width:'100%', padding:'0 24px', position:'relative' }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:10, color:'rgba(232,201,122,0.4)', letterSpacing:'0.2em', textTransform:'uppercase', textAlign:'center' }}>
                {maxAlt.toLocaleString()}M
              </div>
              <div style={{ position:'relative', width:2, height:240 }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:`${(1 - trailProgress) * 100}%`, background:'rgba(255,255,255,0.06)', transition:'height 0.6s cubic-bezier(0.2,0.8,0.2,1)' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${trailProgress * 100}%`, background:'linear-gradient(to top,var(--color-accent),rgba(232,201,122,0.2))', transition:'height 0.6s cubic-bezier(0.2,0.8,0.2,1)', boxShadow:'0 0 20px rgba(232,201,122,0.3)' }} />
                <motion.div style={{ position:'absolute', left:'50%', top:`${(1 - trailProgress) * 100}%`, transform:'translate(-50%,-50%)', width:12, height:12, borderRadius:'50%', background:'var(--color-accent)', boxShadow:'0 0 20px rgba(232,201,122,0.8), 0 0 0 4px rgba(6,8,12,0.8)' }} />
                {trekStops.map((_, i) => (
                  <div key={i} style={{ position:'absolute', left:'50%', top:`${(1 - i / Math.max(trekStops.length - 1, 1)) * 100}%`, transform:'translate(-50%,-50%)',
                    width: i === activeStopIndex ? 8 : 4, height: i === activeStopIndex ? 8 : 4, borderRadius:'50%',
                    background: i <= activeStopIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)', transition:'all 0.4s ease' }} />
                ))}
              </div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:'0.2em', textTransform:'uppercase', textAlign:'center' }}>
                {minAlt.toLocaleString()}M
              </div>
              <div style={{ textAlign:'center', marginTop:12 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={currentStop.altitude} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.4 }}>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:'clamp(32px,3vw,52px)', color:'var(--color-accent)', fontWeight:700, lineHeight:1, letterSpacing:'-0.02em', textShadow:'0 0 30px rgba(232,201,122,0.2)' }}>
                      {currentStop.altitude.toLocaleString()}
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:10, color:'rgba(232,201,122,0.4)', letterSpacing:'0.15em', marginTop:6, textTransform:'uppercase' }}>
                      Metres
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={currentStop.id} style={{ textAlign:'center', marginTop:8 }} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.4 }}>
                  <div style={{ fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:15, color:'rgba(255,255,255,0.8)', lineHeight:1.4, maxWidth:180 }}>
                    {currentStop.title}
                  </div>
                  {currentStop.cinematicText && (
                    <div style={{ fontFamily:"var(--font-display)", fontStyle:'italic', fontSize:11, color:'rgba(232,201,122,0.5)', lineHeight:1.6, maxWidth:180, marginTop:10 }}>
                      "{currentStop.cinematicText}"
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div style={{ marginLeft: isMobile ? 0 : 240, padding: isMobile ? '48px 24px 80px' : '80px 80px 120px', position:'relative', zIndex:1 }}>
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
            {place.videos && place.videos.length > 0 && (
              <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:false }} transition={{ duration:0.8 }} style={{ marginTop:160, paddingTop:80, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:40 }}>
                  <span style={{ width:40, height:1, background:'rgba(232,201,122,0.4)' }} />
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-accent)' }}>
                    Visual Log
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:32 }}>
                  {place.videos.map((video, i) => (
                    <button key={i} onClick={() => setActiveVideo(video)} style={{ background:'rgba(10,12,18,0.6)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden', cursor:'pointer', textAlign:'left', padding:0, transition:'all 0.4s cubic-bezier(0.2,0.8,0.2,1)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,201,122,0.4)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ position:'relative', paddingBottom:'56.25%', background:'#080c10', overflow:'hidden' }}>
                        <img src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.8, transition:'transform 1s ease' }} onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }} 
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }} onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }} />
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', pointerEvents:'none' }}>
                          <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(232,201,122,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 10px 30px rgba(232,201,122,0.4)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-background)" style={{ marginLeft:4 }}><polygon points="5,3 21,12 5,21" /></svg>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding:'20px 24px' }}>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:18, color:'var(--color-text)', fontWeight:500, marginBottom:8, lineHeight:1.3 }}>{video.title}</div>
                        <div style={{ fontFamily:"var(--font-mono)", fontSize:11, color:'rgba(232,201,122,0.5)', letterSpacing:'0.05em' }}>{video.views} Views</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }} style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={closeModal}>
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(24px)' }} />
            <motion.div initial={{ scale:0.95, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0, y:20 }} transition={{ duration:0.5, ease:[0.2,1,0.3,1] }} style={{ position:'relative', width:'85vw', maxWidth:1400, display:'flex', flexDirection:'column', alignItems:'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:'clamp(28px, 4vw, 42px)', color:'var(--color-text)', margin:0, fontWeight:500, letterSpacing:'-0.01em' }}>{activeVideo.title}</h3>
                <button onClick={closeModal} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--color-text)', fontSize:13, fontFamily:"var(--font-mono)", cursor:'pointer', display:'flex', alignItems:'center', gap:10, textTransform:'uppercase', letterSpacing:'0.15em', padding:'10px 20px', borderRadius:30, transition:'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(232,201,122,0.15)'; e.currentTarget.style.borderColor='rgba(232,201,122,0.4)'; e.currentTarget.style.color='var(--color-accent)' }} onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='var(--color-text)' }}>
                  Close <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.1)', fontSize:10 }}>✕</span>
                </button>
              </div>
              <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:24, overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.8)', border:'1px solid rgba(255,255,255,0.1)', background:'#000' }}>
                <iframe src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`} title={activeVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
