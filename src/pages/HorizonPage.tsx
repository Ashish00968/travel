import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface WishlistPlace {
  id: string
  name: string
  region: string
  desc: string
  idealSeason: string
  altitude: string
  whyVisit: string
  coordinates: string
  completed: boolean
  bgImage: string
  notes?: string
}

const DEFAULT_PLACES: WishlistPlace[] = [
  {
    id: 'darma-valley',
    name: 'Darma Valley',
    region: 'Uttarakhand (Pithoragarh)',
    desc: 'An ancient, pristine valley bordering Tibet, carved by the Darma River with dramatic views of the Panchachuli peaks.',
    idealSeason: 'May – June & September – October',
    altitude: '3,470m',
    whyVisit: 'A remote borderlands journey through authentic tribal villages, alpine meadows, and birch forests.',
    coordinates: '30.22° N, 80.53° E',
    completed: false,
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley',
    region: 'Himachal Pradesh',
    desc: 'A cold desert mountain valley known for its ancient Buddhist monasteries, wind-sculpted cliffs, and deep silence.',
    idealSeason: 'May – October (Summer) or Jan – Feb (Winter Expedition)',
    altitude: '3,800m',
    whyVisit: 'To capture the stark, moon-like terrains, remote mountain passes, and ancient monasteries of Key and Dhankar.',
    coordinates: '32.25° N, 78.03° E',
    completed: false,
    bgImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
  }
]

export default function HorizonPage() {
  const navigate = useNavigate()
  const [places, setPlaces] = useState<WishlistPlace[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName,     setNewName]     = useState('')
  const [newRegion,   setNewRegion]   = useState('')
  const [newDesc,     setNewDesc]     = useState('')
  const [newSeason,   setNewSeason]   = useState('')
  const [newAltitude, setNewAltitude] = useState('')
  const [newWhy,      setNewWhy]      = useState('')
  const [newCoords,   setNewCoords]   = useState('')

  useEffect(() => {
    document.title = 'The Horizon — Peaks & Paths'
    const saved = localStorage.getItem('explore_wishlist')
    if (saved) {
      try { setPlaces(JSON.parse(saved)) }
      catch { setPlaces(DEFAULT_PLACES) }
    } else {
      setPlaces(DEFAULT_PLACES)
    }
  }, [])

  const savePlaces = (updated: WishlistPlace[]) => {
    setPlaces(updated)
    localStorage.setItem('explore_wishlist', JSON.stringify(updated))
  }

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    savePlaces(places.map(p => p.id === id ? { ...p, completed: !p.completed } : p))
  }

  const handleNoteChange = (id: string, text: string) => {
    savePlaces(places.map(p => p.id === id ? { ...p, notes: text } : p))
  }

  const deletePlace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Remove this place from your checklist?')) {
      savePlaces(places.filter(p => p.id !== id))
      if (expandedId === id) setExpandedId(null)
    }
  }

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newRegion) return
    savePlaces([...places, {
      id: `custom-${Date.now()}`,
      name: newName, region: newRegion,
      desc: newDesc || 'No description provided.',
      idealSeason: newSeason || 'TBD',
      altitude: newAltitude || 'TBD',
      whyVisit: newWhy || 'Planned exploration.',
      coordinates: newCoords || 'N/A',
      completed: false,
      bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
    }])
    setNewName(''); setNewRegion(''); setNewDesc(''); setNewSeason(''); setNewAltitude(''); setNewWhy(''); setNewCoords('')
    setShowAddForm(false)
  }

  const completed = places.filter(p => p.completed).length
  const progress  = places.length > 0 ? (completed / places.length) * 100 : 0

  return (
    <div style={{ background: '#06080c', minHeight: '100vh', color: '#edeae2' }}>

      {/* ── Cinematic Hero Header ───────────────────────────────── */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400"
          alt="Mountain horizon"
          loading="lazy"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 30%',
            filter: 'grayscale(30%) brightness(0.6) contrast(1.1)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(6,8,12,0.4) 0%, rgba(6,8,12,0.98) 100%)',
        }} />
        {/* Header content */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '900px', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.28em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '10px' }}>
            Next Expeditions
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, margin: 0, fontStyle: 'italic', textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
            The Horizon
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="back-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: '#6a6460',
            fontFamily: "'Space Mono', monospace", fontSize: '11px',
            cursor: 'pointer', marginBottom: '32px', padding: '8px 0',
            transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e8c97a' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6a6460' }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}>←</span>
          Back to Journal
        </button>

        {/* Subtitle */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#6a6460', lineHeight: 1.8, maxWidth: '640px', margin: '0 0 40px' }}>
          A checklist of valleys, remote trails, and mountain regions designated for upcoming seasons. Plan routes, log notes, and trace new paths.
        </p>

        {/* ── Progress + Toolbar ──────────────────────────────────── */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#5a5855' }}>
                {completed} of {places.length} expeditions planned
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '8px 18px',
                background: 'transparent',
                border: '1px dashed rgba(232,201,122,0.35)',
                borderRadius: '6px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px', color: '#e8c97a',
                cursor: 'pointer',
                transition: 'background 200ms cubic-bezier(0.23, 1, 0.32, 1), border-style 200ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,201,122,0.05)'; e.currentTarget.style.borderStyle = 'solid' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderStyle = 'dashed' }}
            >
              {showAddForm ? 'Cancel' : '+ Add Route'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="horizon-progress-track">
            <div className="horizon-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              onSubmit={handleAddPlace}
              style={{
                background: '#0b0f16', border: '1px solid rgba(232,201,122,0.15)',
                borderRadius: '14px', padding: '28px', marginBottom: '32px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
              }}
            >
              <div style={{ gridColumn: 'span 2' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '20px', color: '#edeae2', margin: '0 0 4px' }}>
                  Add Target Destination
                </h3>
                <div style={{ width: '32px', height: '1px', background: 'rgba(232,201,122,0.3)', marginTop: '8px' }} />
              </div>
              {([
                ['Name *', newName, setNewName, 'e.g. Darma Valley', false],
                ['Region *', newRegion, setNewRegion, 'e.g. Uttarakhand', false],
              ] as [string, string, (v: string) => void, string, boolean][]).map(([label, val, setter, placeholder]) => (
                <div key={label as string}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#6a6460', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>{label}</label>
                  <input required type="text" value={val} onChange={e => setter(e.target.value)} className="horizon-input" style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '10px 12px', color: '#edeae2', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', boxSizing: 'border-box', transition: 'border-color 200ms, box-shadow 200ms' }} placeholder={placeholder as string} />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#6a6460', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Description</label>
                <textarea rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} className="horizon-input" style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '10px 12px', color: '#edeae2', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 200ms, box-shadow 200ms' }} placeholder="Subtle landscapes, remote cliffs..." />
              </div>
              {([
                ['Ideal Season', newSeason, setNewSeason, 'e.g. May – June'],
                ['Altitude', newAltitude, setNewAltitude, 'e.g. 3,470m'],
                ['Why Visit', newWhy, setNewWhy, 'e.g. Document glaciers'],
                ['Coordinates', newCoords, setNewCoords, 'e.g. 30.22° N, 80.53° E'],
              ] as [string, string, (v: string) => void, string][]).map(([label, val, setter, placeholder]) => (
                <div key={label as string}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#6a6460', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>{label}</label>
                  <input type="text" value={val} onChange={e => setter(e.target.value)} className="horizon-input" style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '10px 12px', color: '#edeae2', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', boxSizing: 'border-box', transition: 'border-color 200ms, box-shadow 200ms' }} placeholder={placeholder as string} />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{
                    background: '#e8c97a', border: 'none', borderRadius: '6px',
                    padding: '11px 28px', fontFamily: "'Space Mono', monospace",
                    fontSize: '11px', fontWeight: 'bold', color: '#06080c',
                    transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,201,122,0.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Save to Checklist
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Checklist Items ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {places.map((place, idx) => {
            const isExpanded = expandedId === place.id
            return (
              <motion.div
                key={place.id}
                layout="position"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setExpandedId(isExpanded ? null : place.id)}
                style={{
                  background: '#0b0f16',
                  border: `1px solid ${place.completed ? 'rgba(74,184,160,0.18)' : 'rgba(232,201,122,0.12)'}`,
                  borderRadius: '12px',
                  padding: '22px 24px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                whileHover={{
                  borderColor: place.completed ? 'rgba(74,184,160,0.4)' : 'rgba(232,201,122,0.4)',
                  y: -2,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                }}
              >
                {/* Background subtle image */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${place.bgImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  mixBlendMode: 'luminosity',
                  opacity: isExpanded ? 0.07 : 0.025,
                  filter: 'grayscale(100%)',
                  pointerEvents: 'none',
                  transition: 'opacity 400ms cubic-bezier(0.23, 1, 0.32, 1)',
                }} />

                {/* Completed overlay teal line (not harsh strikethrough) */}
                {place.completed && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                    background: 'linear-gradient(to bottom, #4ab8a0, transparent)',
                    borderRadius: '12px 0 0 12px',
                  }} />
                )}

                {/* Primary row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                    
                    {/* Checkbox */}
                    <div
                      onClick={(e) => toggleComplete(place.id, e)}
                      style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        border: `1.5px solid ${place.completed ? '#4ab8a0' : 'rgba(232,201,122,0.5)'}`,
                        background: place.completed ? '#4ab8a0' : 'transparent',
                        boxShadow: place.completed ? '0 0 12px rgba(74,184,160,0.5)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 250ms cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                    >
                      {place.completed && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#06080c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: '9px',
                        letterSpacing: '0.12em', color: place.completed ? '#4ab8a0' : '#6a6460',
                        textTransform: 'uppercase', marginBottom: '3px',
                        transition: 'color 250ms',
                      }}>
                        {place.region}
                      </div>
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '19px',
                        color: '#edeae2', margin: 0, fontStyle: 'italic', fontWeight: 600,
                        opacity: place.completed ? 0.45 : 1,
                        transition: 'opacity 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                      }}>
                        {place.name}
                      </h2>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px', color: '#5a5855', fontFamily: "'Space Mono', monospace", fontSize: '9px', textAlign: 'right' }}>
                      <span>▲ {place.altitude}</span>
                    </div>

                    {/* Expand chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      style={{ color: 'rgba(232,201,122,0.35)', fontSize: '12px' }}
                    >
                      ↓
                    </motion.div>

                    {/* Delete (custom only) */}
                    {place.id.startsWith('custom-') && (
                      <button
                        onClick={(e) => deletePlace(place.id, e)}
                        style={{
                          background: 'none', border: 'none', color: '#4a4844',
                          fontSize: '16px', cursor: 'pointer', padding: '4px',
                          transition: 'color 150ms ease-out, transform 150ms',
                          lineHeight: 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#4a4844'; e.currentTarget.style.transform = 'scale(1)' }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Detail Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      style={{ overflow: 'hidden', position: 'relative', zIndex: 2 }}
                    >
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '20px' }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#5a5855', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                          {place.idealSeason}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '20px' }}>
                          <div>
                            <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.12em' }}>Overview</h4>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px', color: '#9a9490', lineHeight: 1.75, margin: '0 0 16px' }}>
                              {place.desc}
                            </p>
                            <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.12em' }}>Why This Expedition?</h4>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px', color: '#9a9490', lineHeight: 1.75, margin: 0 }}>
                              {place.whyVisit}
                            </p>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#060a10', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                              <div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#4a4844', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>Coordinates</div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#edeae2' }}>{place.coordinates}</div>
                              </div>
                              <div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#4a4844', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>Peak Elevation</div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#edeae2' }}>{place.altitude}</div>
                              </div>
                            </div>

                            <div onClick={e => e.stopPropagation()}>
                              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#6a6460', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>
                                Field Planning Notes
                              </label>
                              <textarea
                                rows={3}
                                value={place.notes || ''}
                                onChange={e => handleNoteChange(place.id, e.target.value)}
                                placeholder="Add gear checks, routes, local permits info..."
                                className="horizon-input"
                                style={{
                                  width: '100%', background: '#06080c',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  borderRadius: '6px', padding: '12px',
                                  color: '#edeae2', fontFamily: "'DM Sans', sans-serif",
                                  fontSize: '13px', outline: 'none', resize: 'none',
                                  boxSizing: 'border-box',
                                  transition: 'border-color 200ms, box-shadow 200ms',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {places.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a4844' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.4 }}>🏔</div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              No expeditions planned yet.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .horizon-detail-grid { grid-template-columns: 1fr !important; }
        }
        .back-btn:hover span { transform: translateX(-4px) !important; }
      `}</style>
    </div>
  )
}
