import { useMemo, memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HIMALAYA_REGIONS, type HimalayaRegion, type HimalayaSubRegion, type HimalayaPlace, TYPE_COLOR, TYPE_LABEL } from '../data/himalaya'
import { useNavigate } from 'react-router-dom'
import { useGridStore } from '../store/gridStore'

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

export default function ExpeditionGrid() {
  const { viewLevel, activeRegId, activeSubRegId, setGridState } = useGridStore()

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

  return (
    <section id="regions" style={{ padding: 'clamp(48px,8vw,80px) clamp(24px,5vw,48px)', background: '#06080c', minHeight: '600px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8c97a', marginBottom: '14px' }}>
              {viewLevel === 'states' ? 'Stories from the Mountains' : `Exploring ${activeRegion?.name}`}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,52px)', color: '#edeae2', margin: 0, fontWeight: 700 }}>
              {viewLevel === 'states' && "Where I've been."}
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

        {/* Grid Area with Transition */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {viewLevel === 'states' && (
              <motion.div
                key="states"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}
                className="exp-grid"
              >
                {HIMALAYA_REGIONS.map((region, idx) => (
                  <StateCard key={region.id} region={region} idx={idx} onClick={() => handleRegionClick(region)} />
                ))}
              </motion.div>
            )}

            {viewLevel === 'subregions' && activeRegion && (
              <motion.div
                key="subregions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}
                className="exp-grid"
              >
                {activeRegion.subregions.map((sub, idx) => (
                  <SubRegionCard key={sub.id} sub={sub} regionId={activeRegion.id} idx={idx} onClick={() => handleSubRegionClick(sub)} />
                ))}
              </motion.div>
            )}

            {viewLevel === 'places' && activeSubReg && (
              <motion.div
                key="places"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}
                className="exp-grid"
              >
                {activeSubReg.places.map((place, idx) => (
                  <PlaceCard key={place.id} place={place} regionId={activeRegId!} subId={activeSubRegId!} idx={idx} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .exp-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .exp-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ── LEVEL 0: State Card ────────────────────────────────────────── */
const StateCard = memo(function StateCard({ region, idx, onClick }: { region: HimalayaRegion, idx: number, onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const bg = CARD_BG[region.id] || DEFAULT_BG
  const count = useMemo(() => region.subregions.reduce((acc, s) => acc + s.places.length, 0), [region])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        border: hovered ? '1px solid #e8c97a' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-6px)' : 'none',
        height: '100%', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: '220px', background: IMG_GRADIENTS[region.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={`/images/${region.id}/thumbnail.jpg`} 
          alt={region.name} 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.3s', zIndex: 1 }}
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {region.badge && <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', padding: '4px 10px', background: 'rgba(0,0,0,0.6)', color: '#e8c97a', borderRadius: '4px', border: '1px solid rgba(232,201,122,0.3)', fontFamily: "'Space Mono',monospace", zIndex: 3 }}>{region.badge}</div>}
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', color: '#e8c97a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'Space Mono',monospace" }}>{region.state || 'Region'}</div>
        <h3 style={{ fontSize: '24px', color: '#edeae2', margin: '0 0 12px', fontFamily: "'Playfair Display',serif" }}>{region.name}</h3>
        <p style={{ fontSize: '13px', color: '#7a7570', lineHeight: 1.6, margin: '0 0 20px' }}>{region.cardDesc}</p>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <span style={{ fontSize: '11px', color: '#3d3b38' }}>{region.elevation || region.maxAlt} · {count} Places</span>
          <span style={{ fontSize: '11px', color: '#e8c97a', fontFamily: "'Space Mono',monospace" }}>Explore →</span>
        </div>
      </div>
    </motion.div>
  )
})

/* ── LEVEL 1: SubRegion Card (e.g. Kullu, Lahaul) ───────────────── */
const SubRegionCard = memo(function SubRegionCard({ sub, regionId, idx, onClick }: { sub: HimalayaSubRegion, regionId: string, idx: number, onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const bg = CARD_BG[regionId] || DEFAULT_BG

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg, borderRadius: '12px', padding: '24px', cursor: 'pointer',
        border: hovered ? '1px solid #e8c97a' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}
    >
      <div>
        <h4 style={{ fontSize: '18px', color: '#edeae2', margin: '0 0 4px', fontFamily: "'Playfair Display',serif" }}>{sub.name}</h4>
        <div style={{ fontSize: '11px', color: '#7a7570' }}>{sub.places.length} places to explore</div>
      </div>
      <div style={{ color: '#e8c97a', fontSize: '18px', transform: hovered ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }}>→</div>
    </motion.div>
  )
})

/* ── LEVEL 2: Place Card ────────────────────────────────────────── */
const PlaceCard = memo(function PlaceCard({ place, regionId, subId: _subId, idx }: { place: HimalayaPlace, regionId: string, subId: string, idx: number }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const bg = CARD_BG[regionId] || DEFAULT_BG

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={() => navigate(`/place/${regionId}/${place.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        border: hovered ? '1px solid #e8c97a' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <div style={{ height: '140px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>
        {place.emoji}
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
          <span style={{ fontSize: '10px', color: '#e8c97a', fontFamily: "'Space Mono',monospace" }}>View Story →</span>
        </div>
      </div>
    </motion.div>
  )
})
