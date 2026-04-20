import { useMemo, memo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { HIMALAYA_REGIONS, type HimalayaRegion, type HimalayaSubRegion, type HimalayaPlace, TYPE_COLOR, TYPE_LABEL } from '../data/himalaya'
import { useNavigate } from 'react-router-dom'
import { useGridStore } from '../store/gridStore'
import { useReveal } from '../hooks/useReveal'
import { scaleIn } from '../lib/variants'

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

const AnimatedHeadingWord = ({ word, delay, isInView }: { word: string, delay: number, isInView: boolean }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em', verticalAlign: 'top' }}>
    <motion.span
      style={{ display: 'inline-block' }}
      initial={{ y: '110%' }}
      animate={isInView ? { y: '0%' } : { y: '110%' }}
      transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1], delay }}
    >
      {word}
    </motion.span>
  </span>
)

export default function ExpeditionGrid() {
  const { viewLevel, activeRegId, activeSubRegId, setGridState } = useGridStore()
  const { ref: headerRef, isInView: headerInView } = useReveal({ margin: '-60px' })

  const activeRegion = useMemo(() => HIMALAYA_REGIONS.find(r => r.id === activeRegId), [activeRegId])
  const activeSubReg = useMemo(() => activeRegion?.subregions.find(s => s.id === activeSubRegId), [activeRegion, activeSubRegId])

  const handleRegionClick = (region: HimalayaRegion) => {
    if (region.showSubRegionsFirst && region.subregions.length > 1) {
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
      if (activeRegion?.showSubRegionsFirst && activeRegion.subregions.length > 1) {
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
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8c97a', marginBottom: '14px' }}>
              {viewLevel === 'states' ? 'Stories from the Mountains' : `Exploring ${activeRegion?.name}`}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,52px)', color: '#edeae2', margin: 0, fontWeight: 700 }}>
              {viewLevel === 'states' && headingWords.map((w,i) => <AnimatedHeadingWord key={i} word={w} delay={0.09*i} isInView={headerInView} />)}
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
                  background: 'none', border: 'none', color: '#7a7570', fontFamily: "'Space Mono',monospace", 
                  fontSize: '11px', cursor: 'pointer', padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                ← Back to {viewLevel === 'places' && activeRegion?.showSubRegionsFirst ? activeRegion.name : 'All Regions'}
              </motion.button>
            )}
          </motion.div>

          {viewLevel !== 'states' && (
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3d3b38', paddingBottom: '12px' }}>
              {activeRegion?.name} {activeSubReg && `› ${activeSubReg.name}`}
            </div>
          )}
        </div>

        {/* Global Styles for the new Cinematic Hover Interactions */}
        <style>{`
          .cinematic-card {
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.35s ease, box-shadow 0.35s ease;
          }
          .cinematic-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 2px;
            background: linear-gradient(to right, transparent, #e8c97a, transparent);
            transform: scaleX(0);
            transition: transform 0.4s ease;
            z-index: 10;
          }
          .cinematic-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
          }
          .cinematic-card:hover::before {
            transform: scaleX(1);
          }
          .cinematic-card:hover .badge-inner {
            transform: scale(1.08);
            border-color: rgba(232,201,122,0.6);
          }
          .cinematic-card-img {
            transition: transform 0.5s ease;
          }
          .cinematic-card:hover .cinematic-card-img {
            transform: scale(1.06) !important;
          }
          .explore-text {
            color: rgba(232,201,122,0.7);
            transition: color 0.3s ease;
          }
          .explore-arrow {
            display: inline-block;
            transition: transform 0.3s ease;
          }
          .cinematic-card:hover .explore-text {
            color: #e8c97a;
          }
          .cinematic-card:hover .explore-arrow {
            transform: translateX(6px);
          }
        `}</style>

        {/* Grid Area with Transition */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {viewLevel === 'states' && (
              <motion.div
                key="states"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
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
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
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
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
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

      <style>{`
        @media (max-width: 680px) { .exp-grid { grid-template-columns: 1fr !important; } }
      `}</style>
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
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cardWidth = rect.width
    const cardHeight = rect.height
    const rotateX = ((y - cardHeight / 2) / cardHeight) * -8
    const rotateY = ((x - cardWidth / 2) / cardWidth) * 8
    
    // Applying CSS directly via ref to bypass react render loop for smoothness
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
  }
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`
  }

  // Parallax setup
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <motion.div
      variants={scaleIn}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="cinematic-card"
      style={{
        background: bg, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.04)',
        height: '100%', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: '220px', background: IMG_GRADIENTS[region.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative', overflow: 'hidden' }}>
        <motion.img 
          src={`/images/${region.id}/thumbnail.jpg`} 
          alt={region.name} 
          className="cinematic-card-img"
          style={{ y: imageY, position: 'absolute', inset: 0, width: '100%', height: '120%', objectFit: 'cover', opacity: 0.6, zIndex: 1 }}
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {region.badge && <div className="badge-inner" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', padding: '4px 10px', background: 'rgba(0,0,0,0.6)', color: '#e8c97a', borderRadius: '4px', border: '1px solid rgba(232,201,122,0.3)', fontFamily: "'Space Mono',monospace", zIndex: 3, transition: 'all 0.3s ease' }}>{region.badge}</div>}
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', color: '#e8c97a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'Space Mono',monospace" }}>{region.state || 'Region'}</div>
        <h3 style={{ fontSize: '24px', color: '#edeae2', margin: '0 0 12px', fontFamily: "'Playfair Display',serif" }}>{region.name}</h3>
        <p style={{ fontSize: '13px', color: '#7a7570', lineHeight: 1.6, margin: '0 0 20px' }}>{region.cardDesc}</p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <span style={{ fontSize: '11px', color: '#3d3b38' }}>{region.elevation || region.maxAlt} · {count} Places</span>
          <span className="explore-text" style={{ fontSize: '11px', fontFamily: "'Space Mono',monospace" }}>Explore <span className="explore-arrow">→</span></span>
        </div>
      </div>
    </motion.div>
  )
})

/* ── LEVEL 1: SubRegion Card ───────────────── */
const SubRegionCard = memo(function SubRegionCard({ sub, regionId, onClick }: { sub: HimalayaSubRegion, regionId: string, onClick: () => void }) {
  const bg = CARD_BG[regionId] || DEFAULT_BG

  return (
    <motion.div
      variants={scaleIn}
      onClick={onClick}
      className="cinematic-card"
      style={{
        background: bg, borderRadius: '12px', padding: '24px', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}
    >
      <div>
        <h4 style={{ fontSize: '18px', color: '#edeae2', margin: '0 0 4px', fontFamily: "'Playfair Display',serif" }}>{sub.name}</h4>
        <div style={{ fontSize: '11px', color: '#7a7570' }}>{sub.places.length} places to explore</div>
      </div>
      <div className="explore-text explore-arrow" style={{ fontSize: '18px' }}>→</div>
    </motion.div>
  )
})

/* ── LEVEL 2: Place Card ────────────────────────────────────────── */
const PlaceCard = memo(function PlaceCard({ place, regionId }: { place: HimalayaPlace, regionId: string }) {
  const navigate = useNavigate()
  const bg = CARD_BG[regionId] || DEFAULT_BG

  return (
    <motion.div
      variants={scaleIn}
      onClick={() => navigate(`/place/${regionId}/${place.id}`)}
      className="cinematic-card"
      style={{
        background: bg, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ height: '140px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', position: 'relative', overflow: 'hidden' }}>
        {place.image ? (
          <img 
            src={place.image} 
            alt={place.name} 
            className="cinematic-card-img"
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9
            }}
          />
        ) : (
          <span className="cinematic-card-img">
            {place.emoji}
          </span>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
           <h4 style={{ fontSize: '17px', color: '#edeae2', margin: 0, fontWeight: 600 }}>{place.name}</h4>
           <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[place.type] }} title={TYPE_LABEL[place.type]} />
        </div>
        <p style={{ fontSize: '12px', color: '#7a7570', lineHeight: 1.5, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {place.desc}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
          <span style={{ fontSize: '11px', color: '#3d3b38' }}>{place.elevation}</span>
          <span className="explore-text" style={{ fontSize: '10px', fontFamily: "'Space Mono',monospace" }}>View Story <span className="explore-arrow">→</span></span>
        </div>
      </div>
    </motion.div>
  )
})
