import React from 'react'
import { motion } from 'framer-motion'
import { blurPlaceholderFromUrl } from '../../../lib/cloudinary'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import type { TrekStop } from '../../../data/himalaya'

export function altGradient(alt: number) {
  if (alt < 3000) return 'linear-gradient(145deg,#0a1a0a,#0d2010)'
  if (alt < 3500) return 'linear-gradient(145deg,#0a1015,#0d1520)'
  return 'linear-gradient(145deg,#08080f,#121228)'
}

export function StopConnector() {
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

export const StopBlock = React.memo(({ stop, index }: { stop: TrekStop; index: number }) => {
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
})

export const TextOnlyBlock = React.memo(({ stop, index }: { stop: TrekStop; index: number }) => {
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
})

export const SummitBlock = React.memo(({ stop }: { stop: TrekStop }) => {
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
})

export const TrekSummaryBar = React.memo(() => {
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
})
