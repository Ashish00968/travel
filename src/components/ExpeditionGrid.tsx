import { useMemo, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HIMALAYA_REGIONS, type HimalayaRegion, type HimalayaSubRegion, type HimalayaPlace, TYPE_COLOR, TYPE_LABEL } from '../data/himalaya'
import { useNavigate } from 'react-router-dom'
import { useGridStore } from '../store/gridStore'
import { useReveal } from '../hooks/useReveal'
import OptimizedImage from './OptimizedImage'
import { AnimatedWord } from './AnimatedWord'

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } }
}

const CARD_BG: Record<string, string> = {
  'jammu-kashmir':    '#04100f',
  'himachal-pradesh': '#0f0c04',
  'ladakh':           '#04080f',
  'uttarakhand':      '#040f04',
}

const IMG_GRADIENTS: Record<string, string> = {
  'jammu-kashmir':    'linear-gradient(145deg,#041a18 0%,#073028 50%,#04100f 100%)',
  'himachal-pradesh': 'linear-gradient(145deg,#1a1504 0%,#2a2008 50%,#0f0c04 100%)',
  'ladakh':           'linear-gradient(145deg,#050c1a 0%,#0a1530 50%,#04080f 100%)',
  'uttarakhand':      'linear-gradient(145deg,#051a07 0%,#0a2f0d 50%,#040f04 100%)',
}
const DEFAULT_BG = '#0d1117'

const REGION_THUMBNAILS: Record<string, string> = {
  'jammu-kashmir':    'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/jkMain.png',
  'himachal-pradesh': 'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/HimachalMain.png',
  'ladakh':           'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/LadakhMain.png',
  'uttarakhand':      'https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/UttrakhandMain.png',
}

export default function ExpeditionGrid() {
  const { viewLevel, activeRegId, activeSubRegId, setGridState } = useGridStore()
  const { ref: headerRef, isInView: headerInView } = useReveal({ margin: '-60px' })

  const activeRegion = useMemo(() => HIMALAYA_REGIONS.find(r => r.id === activeRegId), [activeRegId])
  const activeSubReg = useMemo(() => activeRegion?.subregions.find(s => s.id === activeSubRegId), [activeRegion, activeSubRegId])

  const handleRegionClick = (region: HimalayaRegion) => {
    if (region.showSubRegionsFirst) {
      setGridState('subregions', region.id, null)
    } else {
      setGridState('places', region.id, region.subregions[0].id)
    }
    document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubRegionClick = (sub: HimalayaSubRegion) => {
    setGridState('places', activeRegId, sub.id)
    document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBack = () => {
    if (viewLevel === 'places') {
      if (activeRegion?.showSubRegionsFirst) {
        setGridState('subregions', activeRegId, null)
      } else {
        setGridState('states', null, null)
      }
    } else if (viewLevel === 'subregions') {
      setGridState('states', null, null)
    }
  }

  const headingWords = "Where I've been.".split(' ')

  return (
    <section id="regions" style={{ padding: 'clamp(48px,8vw,80px) clamp(24px,5vw,48px)', background: '#06080c', minHeight: '600px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Area */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <motion.div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#e8c97a', marginBottom: '14px' }}>
              {viewLevel === 'states' ? 'Stories from the Mountains' : `Exploring ${activeRegion?.name}`}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,52px)', color: '#edeae2', margin: 0, fontWeight: 700 }}>
              {viewLevel === 'states' && headingWords.map((w,i) => <AnimatedWord key={i} word={w} delay={0.08*i} isInView={headerInView} />)}
              {viewLevel === 'subregions' && activeRegion?.name}
              {viewLevel === 'places' && activeSubReg?.name}
            </h2>
            
            {/* Breadcrumb / Back Button */}
            {viewLevel !== 'states' && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                style={{
                  background: 'none', border: 'none', color: '#6a6460',
                  fontFamily: "'Space Mono',monospace",
                  fontSize: '11px', cursor: 'pointer', padding: '12px 0',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#e8c97a';
                  const arrow = e.currentTarget.querySelector('.back-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = 'translateX(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#6a6460';
                  const arrow = e.currentTarget.querySelector('.back-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                <span className="back-arrow" style={{ display: 'inline-block', transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}>←</span>
                Back to {viewLevel === 'places' && activeRegion?.showSubRegionsFirst ? activeRegion.name : 'All Regions'}
              </motion.button>
            )}
          </motion.div>

          {viewLevel !== 'states' && (
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3d3b38', paddingBottom: '12px' }}>
              {activeRegion?.name} {activeSubReg && `› ${activeSubReg.name}`}
            </div>
          )}
        </div>

        {/* Grid Area with Transition */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {viewLevel === 'states' && (
              <motion.div
                key="states"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                className="exp-grid"
              >
                {HIMALAYA_REGIONS.map((region) => (
                  <StateCard key={region.id} region={region} onClick={() => handleRegionClick(region)} />
                ))}
              </motion.div>
            )}

            {viewLevel === 'subregions' && activeRegion && (
              <motion.div
                key="subregions"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                className="exp-grid"
              >
                {activeRegion.subregions.map((sub) => (
                  <SubRegionCard key={sub.id} sub={sub} regionId={activeRegion.id} onClick={() => handleSubRegionClick(sub)} />
                ))}
              </motion.div>
            )}

            {viewLevel === 'places' && activeSubReg && (
              <motion.div
                key="places"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                className="exp-grid"
              >
                {activeSubReg.places.map((place) => (
                  <PlaceCard key={place.id} place={place} regionId={activeRegId!} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ── LEVEL 0: State Card ────────────────────────────────────────── */
const StateCard = memo(function StateCard({ region, onClick }: { region: HimalayaRegion, onClick: () => void }) {
  const bg = CARD_BG[region.id] || DEFAULT_BG
  const count = useMemo(() => region.subregions.reduce((acc, s) => acc + s.places.length, 0), [region])
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect   = cardRef.current.getBoundingClientRect()
    const x      = e.clientX - rect.left
    const y      = e.clientY - rect.top
    const rotX   = ((y - rect.height / 2) / rect.height) * -7
    const rotY   = ((x - rect.width / 2) / rect.width) * 7
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`
  }
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`
  }

  return (
    <motion.div
      variants={cardVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="cinematic-card shimmer-card"
      style={{
        background: bg, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        height: '100%', display: 'flex', flexDirection: 'column',
        transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      <div style={{ height: '220px', background: IMG_GRADIENTS[region.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative', overflow: 'hidden' }}>
        <OptimizedImage 
          src={REGION_THUMBNAILS[region.id] || `${import.meta.env.BASE_URL}images/${region.id}/thumbnail.jpg`} 
          alt={region.name} 
          className="cinematic-card-img"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82, zIndex: 1 }}
        />
        {region.badge && (
          <div className="badge-inner" style={{
            position: 'absolute', top: '14px', right: '14px', fontSize: '9px',
            padding: '4px 10px', background: 'rgba(0,0,0,0.65)', color: '#e8c97a',
            borderRadius: '4px', border: '1px solid rgba(232,201,122,0.25)',
            fontFamily: "'Space Mono',monospace", zIndex: 3,
            transition: 'border-color 250ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 250ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}>
            {region.badge}
          </div>
        )}
      </div>
      <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '9px', color: '#e8c97a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px', fontFamily: "'Space Mono',monospace" }}>
          {region.state || 'Region'}
        </div>
        <h3 style={{ fontSize: '22px', color: '#edeae2', margin: '0 0 10px', fontFamily: "'Playfair Display',serif" }}>
          {region.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#7a7570', lineHeight: 1.65, margin: '0 0 20px' }}>
          {region.cardDesc}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#3d3b38', fontFamily: "'Space Mono',monospace" }}>
            {region.elevation || region.maxAlt} · {count} Places
          </span>
          <span className="explore-text" style={{ fontSize: '11px', fontFamily: "'Space Mono',monospace" }}>
            Explore <span className="explore-arrow">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
})

/* ── LEVEL 1: SubRegion Card ───────────────── */
const SubRegionCard = memo(function SubRegionCard({ sub, regionId, onClick }: { sub: HimalayaSubRegion, regionId: string, onClick: () => void }) {
  const bg = CARD_BG[regionId] || DEFAULT_BG
  const gradient = IMG_GRADIENTS[regionId] || 'linear-gradient(145deg, #0d1117, #1a2030)'

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="cinematic-card shimmer-card"
      style={{
        background: bg, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Mini thumbnail */}
      <div style={{ height: '80px', background: gradient, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))' }} />
      </div>
      {/* Content */}
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '18px', color: '#edeae2', margin: '0 0 4px', fontFamily: "'Playfair Display',serif" }}>
            {sub.name}
          </h4>
          <div style={{ fontSize: '11px', color: '#6a6460', fontFamily: "'Space Mono',monospace" }}>
            {sub.places.length} places to explore
          </div>
        </div>
        <div className="explore-text explore-arrow" style={{ fontSize: '18px', flexShrink: 0 }}>→</div>
      </div>
    </motion.div>
  )
})

/* ── LEVEL 2: Place Card ────────────────────────────────────────── */
const PlaceCard = memo(function PlaceCard({ place, regionId }: { place: HimalayaPlace, regionId: string }) {
  const navigate = useNavigate()
  const bg = CARD_BG[regionId] || DEFAULT_BG
  const imgRef = useRef<HTMLDivElement>(null)

  // Parallax: image moves opposite to cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width  - 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5
    // image moves at 0.5x inverse — smooth with CSS transition
    imgRef.current.style.transform = `scale(1.08) translate(${-x * 12}px, ${-y * 8}px)`
  }

  const handleMouseLeave = () => {
    if (!imgRef.current) return
    imgRef.current.style.transform = 'scale(1.05) translate(0px, 0px)'
  }

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => navigate(`/place/${regionId}/${place.id}`, { state: { from: 'grid' } })}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cinematic-card shimmer-card"
      style={{
        background: bg, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        height: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          ref={imgRef}
          style={{
            position: 'absolute', inset: '-5%',
            transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)',
            willChange: 'transform',
          }}
        >
          {place.image ? (
            <OptimizedImage 
              src={place.image} 
              alt={place.name} 
              className="cinematic-card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
            />
          ) : (
            <div className="cinematic-card-img" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', background: 'rgba(255,255,255,0.02)' }}>
              {place.emoji}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)' }} />
      </div>

      <div style={{ position: 'relative', padding: '22px', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '23px', color: '#ffffff', margin: 0, fontWeight: 600, fontFamily: "'Playfair Display',serif", textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            {place.name}
          </h4>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[place.type], boxShadow: `0 0 8px ${TYPE_COLOR[place.type]}`, marginTop: '8px', flexShrink: 0 }} title={TYPE_LABEL[place.type]} />
        </div>
        <p style={{ fontSize: '13px', color: '#ccc9c2', lineHeight: 1.55, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          {place.desc}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px' }}>
          <span style={{ fontSize: '10px', color: '#a8a49c', fontFamily: "'Space Mono',monospace" }}>{place.elevation}</span>
          <span className="explore-text" style={{ fontSize: '10px', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            View Story <span className="explore-arrow">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
})
