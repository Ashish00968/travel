import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMapStore } from '../store/mapStore'
import { HIMALAYA_REGIONS, type HimalayaSubRegion, type HimalayaPlace } from '../data/himalaya'
import { useMediaQuery } from '../hooks/useMediaQuery'

/* ── Type colour dots ───────────────────────────────────────────── */
const TYPE_DOT: Record<string, string> = {
  road:      '#e8c97a',
  trek:      '#4ab8a0',
  spiritual: '#c47ef5',
  scenic:    '#7eb6e8',
  adventure: '#e87a4a',
  lake:      '#4a9de8',
}

/* ═══════════════════════════════════════════════════════════════════
 *  RegionPanel — compact two-level popup (top-right of map)
 *
 *  Level 1: Region selected → shows sub-region list
 *  Level 2: Sub-region selected → shows places list
 *  Close / reset → panel disappears
 * ═══════════════════════════════════════════════════════════════════ */
export default function RegionPanel() {
  const panelOpen        = useMapStore((s) => s.panelOpen)
  const activeRegionId   = useMapStore((s) => s.activeRegionId)
  const closePanel       = useMapStore((s) => s.closePanel)
  const openSubRegion    = useMapStore((s) => s.openSubRegion)
  const isMobile         = useMediaQuery('(max-width: 900px)')

  /* Local drill-down: which sub-region is expanded */
  const [activeSub, setActiveSub] = useState<string | null>(null)

  /* The user explicitly requested to completely disable this panel on mobile,
   * relying purely on the map markers for navigation. */
  if (isMobile) return null

  const region = HIMALAYA_REGIONS.find((r) => r.id === activeRegionId) ?? null

  /* Reset local state when panel closes or region changes */
  if (!panelOpen || !region) {
    // clear local drill state next render
  }

  const currentSub = region?.subregions.find((s) => s.id === activeSub) ?? null

  return (
    <AnimatePresence onExitComplete={() => setActiveSub(null)}>
      {panelOpen && region && (
        <motion.div
          key={`panel-${region.id}`}
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.25, 0.8, 0.25, 1] }}
          style={{
            position: 'absolute',
            top: isMobile ? 'auto' : '16px',
            bottom: isMobile ? '0px' : 'auto',
            right: isMobile ? '0px' : '20px',
            width: isMobile ? '100%' : '290px',
            zIndex: 500,
            background: 'rgba(6,8,12,0.96)',
            backdropFilter: 'blur(20px)',
            border: isMobile ? 'none' : '1px solid rgba(232,201,122,0.15)',
            borderTop: isMobile ? '1px solid rgba(232,201,122,0.15)' : '1px solid rgba(232,201,122,0.15)',
            borderTopLeftRadius: isMobile ? '28px' : '14px',
            borderTopRightRadius: isMobile ? '28px' : '14px',
            borderBottomLeftRadius: isMobile ? '0' : '14px',
            borderBottomRightRadius: isMobile ? '0' : '14px',
            overflow: 'hidden',
            boxShadow: isMobile ? '0 -10px 40px rgba(0,0,0,0.8)' : '0 8px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(232,201,122,0.08)',
            fontFamily: "'DM Sans', sans-serif",
            paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 20px)' : '0',
          }}
        >
          {/* ── Mobile Grab Handle ──────────────────────────────── */}
          {isMobile && (
            <div style={{ width: '100%', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
            </div>
          )}

          {/* ── Header ─────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentSub && (
                <button
                  onClick={() => setActiveSub(null)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#e8c97a', fontSize: '16px', padding: '0 4px 0 0', lineHeight: 1,
                  }}
                >‹</button>
              )}
              <div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: '8px',
                  letterSpacing: '0.18em', color: 'rgba(232,201,122,0.5)',
                  textTransform: 'uppercase', marginBottom: '2px',
                }}>
                  {currentSub ? region.name : (region.state || 'Himalayas')}
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: '16px',
                  fontWeight: 700, color: '#edeae2', lineHeight: 1.1,
                }}>
                  {currentSub ? currentSub.name : region.name}
                </div>
              </div>
            </div>

            <button
              className="close-panel-btn"
              onClick={() => { closePanel(); setActiveSub(null) }}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#7a7570', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >×</button>
          </div>

          {/* ── Body ───────────────────────────────────────────── */}
          <div style={{ maxHeight: isMobile ? '35vh' : '320px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <AnimatePresence mode="wait">

              {/* Level 1 — Sub-regions */}
              {!currentSub && (
                <motion.div
                  key="subregions"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -12 }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  style={{ padding: isMobile ? '0' : '10px 12px' }}
                >
                  {region.subregions.map((sub, i) => (
                    <SubRegionRow
                      key={sub.id}
                      sub={sub}
                      isLast={i === region.subregions.length - 1}
                      onClick={() => {
                        setActiveSub(sub.id)
                        openSubRegion(sub.id)  // triggers map fly-to via store
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Level 2 — Places inside sub-region */}
              {currentSub && (
                <motion.div
                  key={`places-${currentSub.id}`}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 12 }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  style={{ padding: isMobile ? '0' : '10px 12px' }}
                >
                  {currentSub.places.map((place, i) => (
                    <PlaceRow
                      key={place.id}
                      place={place}
                      regionId={region.id}
                      isLast={i === currentSub.places.length - 1}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer: place count ────────────────────────────── */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '8px', letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
          }}>
            {currentSub
              ? `${currentSub.places.length} place${currentSub.places.length !== 1 ? 's' : ''}`
              : `${region.subregions.reduce((n, s) => n + s.places.length, 0)} places · ${region.subregions.length} areas`
            }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Sub-region row (level 1) ───────────────────────────────────── */
function SubRegionRow({ sub, onClick, isLast }: { sub: HimalayaSubRegion; onClick: () => void; isLast?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      {/* Golden left accent line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '2px',
        background: '#e8c97a',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'center',
        transition: 'transform 0.2s ease',
      }} />

      <div>
        <div style={{
          fontSize: '14px', fontWeight: 500, color: '#edeae2', marginBottom: '2px',
        }}>{sub.name}</div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: '9px',
          color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
        }}>
          {sub.places.length} place{sub.places.length !== 1 ? 's' : ''}
        </div>
      </div>
      <span style={{ 
        color: hovered ? '#e8c97a' : 'rgba(255,255,255,0.15)', 
        fontSize: '16px', 
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        paddingLeft: '10px' 
      }}>›</span>
    </motion.div>
  )
}

/* ── Place row (level 2) ────────────────────────────────────────── */
function PlaceRow({ place, regionId, isLast }: { place: HimalayaPlace; regionId: string; isLast?: boolean }) {
  const [hovered, setHovered]  = useState(false)
  const navigate = useNavigate()

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      onClick={() => navigate(`/place/${regionId}/${place.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 20px', cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      {/* Golden left accent line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '2px',
        background: '#e8c97a',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'center',
        transition: 'transform 0.2s ease',
      }} />

      {/* Emoji icon */}
      <div style={{
        width: '30px', height: '30px', borderRadius: '6px', flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.2s ease',
      }}>
        {place.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px', fontWeight: 500, color: '#edeae2',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {place.name}
        </div>
        {place.elevation && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: '9px',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em',
          }}>
            ▲ {place.elevation}
          </div>
        )}
      </div>

      {/* Type dot */}
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
        background: TYPE_DOT[place.type] ?? '#7a7570',
        boxShadow: `0 0 6px ${TYPE_DOT[place.type] ?? '#7a7570'}`,
      }} />

      <span style={{ 
        color: hovered ? '#e8c97a' : 'rgba(255,255,255,0.15)', 
        fontSize: '16px', 
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        paddingLeft: '10px'
      }}>›</span>
    </motion.div>
  )
}
