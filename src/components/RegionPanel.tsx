import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMapStore } from '../store/mapStore'
import { HIMALAYA_REGIONS, type HimalayaRegion, type HimalayaPlace } from '../data/himalaya'

/* ── Region-specific hero gradients ────────────────────────────── */
const HERO_GRADIENTS: Record<string, string> = {
  'jammu-kashmir': 'linear-gradient(145deg,#041a18 0%,#073028 50%,#04100f 100%)',
  'himachal-pradesh': 'linear-gradient(145deg,#1a1504 0%,#2a2008 50%,#0f0c04 100%)',
  'ladakh':       'linear-gradient(145deg, #080d14, #04080f)',
  'uttarakhand':  'linear-gradient(145deg, #080f08, #04090f)',
}
const DEFAULT_GRADIENT = 'linear-gradient(145deg, #0d1117, #06080c)'

/* ── Sub-place card ─────────────────────────────────────────────── */
function SubPlaceCard({
  place,
  regionId,
}: {
  place: HimalayaPlace
  regionId: string
}) {
  const [hovered, setHovered] = useState(false)
  const openPlace             = useMapStore((s) => s.openPlace)

  return (
    <div
      onClick={() => openPlace(regionId, place.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered
          ? '1px solid rgba(232,201,122,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '12px 16px',
        cursor: 'pointer',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
        {place.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#edeae2', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {place.name}
        </div>
        {place.meta && (
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#3d3b38', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {place.meta}
          </div>
        )}
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: hovered ? '#e8c97a' : '#3d3b38', transition: 'color 0.2s' }}>→</span>
    </div>
  )
}

/* ── Main panel ─────────────────────────────────────────────────── */
export default function RegionPanel() {
  const panelOpen      = useMapStore((s) => s.panelOpen)
  const activeRegionId = useMapStore((s) => s.activeRegionId)
  const closePanel     = useMapStore((s) => s.closePanel)

  const region = HIMALAYA_REGIONS.find((r) => r.id === activeRegionId) ?? null

  const heroGrad = region
    ? (HERO_GRADIENTS[region.id] ?? DEFAULT_GRADIENT)
    : DEFAULT_GRADIENT

  return (
    <AnimatePresence>
      {panelOpen && region && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            style={{ position: 'fixed', inset: 0, zIndex: 499, pointerEvents: 'none' }}
          />

          <motion.div
            key="panel-desktop"
            className="region-panel-desktop"
            initial={{ x: 440 }}
            animate={{ x: 0 }}
            exit={{ x: 440 }}
            transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100vh', width: '440px', zIndex: 1100,
              background: 'rgba(8,12,16,0.97)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(232,201,122,0.12)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <PanelContent region={region} heroGrad={heroGrad} closePanel={closePanel} />
          </motion.div>

          <motion.div
            key="panel-mobile"
            className="region-panel-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, height: '70vh', zIndex: 1100,
              background: 'rgba(8,12,16,0.97)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(232,201,122,0.12)',
              borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <PanelContent region={region} heroGrad={heroGrad} closePanel={closePanel} />
          </motion.div>
        </>
      )}

      <style>{`
        .region-panel-desktop { display: flex !important; }
        .region-panel-mobile  { display: none  !important; }
        @media (max-width: 767px) {
          .region-panel-desktop { display: none  !important; }
          .region-panel-mobile  { display: flex !important; }
        }
      `}</style>
    </AnimatePresence>
  )
}

function PanelContent({
  region,
  heroGrad,
  closePanel,
}: {
  region: HimalayaRegion
  heroGrad: string
  closePanel: () => void
}) {
  const [closeHovered, setCloseHovered] = useState(false)

  return (
    <>
      <button
        onClick={closePanel}
        onMouseEnter={() => setCloseHovered(true)}
        onMouseLeave={() => setCloseHovered(false)}
        style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 10, width: '36px', height: '36px', borderRadius: '50%',
          background: closeHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)', color: closeHovered ? '#edeae2' : '#7a7570',
          fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        ×
      </button>

      <div style={{ height: '200px', flexShrink: 0, background: heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: '72px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}>{region.emoji}</span>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, rgba(8,12,16,0.97), transparent)' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(232,201,122,0.1) transparent' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '6px' }}>
          {region.state?.toUpperCase() || 'HIMALAYAS'}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#edeae2', lineHeight: 1.1, marginBottom: '14px', fontWeight: 700 }}>
          {region.name}
        </h2>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '4px', marginBottom: '24px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#7a7570' }}>
            ▲ {region.elevation || region.maxAlt}
          </span>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#7a7570', lineHeight: 1.7, marginBottom: '32px' }}>
          {region.cardDesc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {region.subregions.map((sub) => (
            <div key={sub.id}>
              <div style={{ 
                fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', 
                color: '#3d3b38', textTransform: 'uppercase', marginBottom: '12px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span>{sub.name}</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sub.places.map((place) => (
                  <SubPlaceCard key={place.id} place={place} regionId={region.id} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: '40px' }} />
      </div>
    </>
  )
}
