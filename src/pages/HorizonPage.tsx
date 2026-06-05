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
    id: 'valley-of-flowers',
    name: 'Valley of Flowers',
    region: 'Uttarakhand',
    desc: 'A legendary high-altitude Himalayan valley carpeted with over 600 species of rare alpine flowers, bordered by snow-capped peaks.',
    idealSeason: 'July – September (Monsoon)',
    altitude: '3,658m',
    whyVisit: 'To document the brief, vibrant monsoon bloom that transforms the glacial valley into a natural canvas.',
    coordinates: '30.73° N, 79.61° E',
    completed: false,
    bgImage: 'https://images.unsplash.com/photo-1469521669194-bafa95b57580?auto=format&fit=crop&q=80&w=800'
  },
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
  
  // Add new place modal/form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRegion, setNewRegion] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSeason, setNewSeason] = useState('')
  const [newAltitude, setNewAltitude] = useState('')
  const [newWhy, setNewWhy] = useState('')
  const [newCoords, setNewCoords] = useState('')

  // Load from local storage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem('explore_wishlist')
    if (saved) {
      try {
        setPlaces(JSON.parse(saved))
      } catch (e) {
        setPlaces(DEFAULT_PLACES)
      }
    } else {
      setPlaces(DEFAULT_PLACES)
    }
  }, [])

  // Save to local storage helper
  const savePlaces = (updated: WishlistPlace[]) => {
    setPlaces(updated)
    localStorage.setItem('explore_wishlist', JSON.stringify(updated))
  }

  // Toggle checklist completed state
  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = places.map(p => p.id === id ? { ...p, completed: !p.completed } : p)
    savePlaces(updated)
  }

  // Handle note updates
  const handleNoteChange = (id: string, text: string) => {
    const updated = places.map(p => p.id === id ? { ...p, notes: text } : p)
    savePlaces(updated)
  }

  // Delete place
  const deletePlace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to remove this place from your checklist?')) {
      const updated = places.filter(p => p.id !== id)
      savePlaces(updated)
      if (expandedId === id) setExpandedId(null)
    }
  }

  // Add new custom place
  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newRegion) return

    const newPlace: WishlistPlace = {
      id: `custom-${Date.now()}`,
      name: newName,
      region: newRegion,
      desc: newDesc || 'No description provided.',
      idealSeason: newSeason || 'TBD',
      altitude: newAltitude || 'TBD',
      whyVisit: newWhy || 'Planned exploration.',
      coordinates: newCoords || 'N/A',
      completed: false,
      bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
    }

    savePlaces([...places, newPlace])
    
    // Reset form states
    setNewName('')
    setNewRegion('')
    setNewDesc('')
    setNewSeason('')
    setNewAltitude('')
    setNewWhy('')
    setNewCoords('')
    setShowAddForm(false)
  }

  return (
    <div style={{ background: '#06080c', minHeight: '100vh', color: '#edeae2', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Navigation / Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: '#7a7570',
            fontFamily: "'Space Mono', monospace", fontSize: '11px',
            cursor: 'pointer', marginBottom: '40px', padding: '8px 0',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#e8c97a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#7a7570'}
        >
          ← Back to Journal
        </button>

        {/* Header Block */}
        <header style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '16px' }}>
            Next Expeditions
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 700, margin: '0 0 16px', fontStyle: 'italic' }}>
            The Horizon
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.8, maxWidth: '640px', margin: 0 }}>
            A checklist of valleys, remote trails, and mountain regions designated for upcoming seasons. Plan routes, log notes, and trace new paths.
          </p>
        </header>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#5a5855' }}>
            {places.filter(p => p.completed).length} of {places.length} completed
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px dashed rgba(232, 201, 122, 0.4)',
              borderRadius: '6px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: '#e8c97a',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(232, 201, 122, 0.05)'
              e.currentTarget.style.borderStyle = 'solid'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderStyle = 'dashed'
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Custom Route'}
          </button>
        </div>

        {/* Add Place Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAddPlace}
              style={{
                background: '#0d1117',
                border: '1px solid rgba(232, 201, 122, 0.2)',
                borderRadius: '12px',
                padding: '28px',
                marginBottom: '40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <div style={{ gridColumn: 'span 2' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#edeae2', margin: '0 0 16px' }}>Add Target Destination</h3>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Name *</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. Darma Valley" />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Region *</label>
                <input required type="text" value={newRegion} onChange={e => setNewRegion(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. Uttarakhand" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
                <textarea rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }} placeholder="Subtle landscapes, remote cliffs..." />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Ideal Season</label>
                <input type="text" value={newSeason} onChange={e => setNewSeason(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. May – June" />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Altitude</label>
                <input type="text" value={newAltitude} onChange={e => setNewAltitude(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. 3,470m" />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Why Visit</label>
                <input type="text" value={newWhy} onChange={e => setNewWhy(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. Document glaciers" />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>Coordinates</label>
                <input type="text" value={newCoords} onChange={e => setNewCoords(e.target.value)} style={{ width: '100%', background: '#06080c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '10px', color: '#edeae2', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} placeholder="e.g. 30.22° N, 80.53° E" />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{
                    background: '#e8c97a',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#06080c',
                    cursor: 'pointer'
                  }}
                >
                  Save to Checklist
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Checklist Grid/Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {places.map((place) => {
            const isExpanded = expandedId === place.id
            return (
              <motion.div
                key={place.id}
                layout="position"
                onClick={() => setExpandedId(isExpanded ? null : place.id)}
                style={{
                  background: '#0d1117',
                  border: `1px solid ${place.completed ? 'rgba(74, 184, 160, 0.2)' : 'rgba(232, 201, 122, 0.15)'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                }}
                whileHover={{ borderColor: place.completed ? 'rgba(74, 184, 160, 0.4)' : 'rgba(232, 201, 122, 0.45)', y: -2 }}
              >
                {/* Background overlay effect */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${place.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'luminosity',
                    opacity: isExpanded ? 0.08 : 0.03,
                    filter: 'grayscale(100%)',
                    pointerEvents: 'none',
                    transition: 'opacity 0.4s ease'
                  }}
                />

                {/* Primary Card View */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    
                    {/* Glowing Circular Custom Checkbox */}
                    <div
                      onClick={(e) => toggleComplete(place.id, e)}
                      style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        border: `1px solid ${place.completed ? '#4ab8a0' : '#e8c97a'}`,
                        background: place.completed ? '#4ab8a0' : 'transparent',
                        boxShadow: place.completed ? '0 0 10px rgba(74, 184, 160, 0.6)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {place.completed && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#06080c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: '9px',
                        letterSpacing: '0.12em', color: place.completed ? '#4ab8a0' : '#7a7570',
                        textTransform: 'uppercase', marginBottom: '4px'
                      }}>
                        {place.region}
                      </div>
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '20px',
                        color: '#edeae2', margin: 0, fontStyle: 'italic', fontWeight: 600,
                        textDecoration: place.completed ? 'line-through' : 'none',
                        opacity: place.completed ? 0.5 : 1,
                        transition: 'opacity 0.3s ease'
                      }}>
                        {place.name}
                      </h2>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', color: '#7a7570', fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                      <span>▲ {place.altitude}</span>
                      <span>·</span>
                      <span>{place.idealSeason}</span>
                    </div>

                    {/* Delete Icon */}
                    {place.id.startsWith('custom-') && (
                      <button
                        onClick={(e) => deletePlace(place.id, e)}
                        style={{
                          background: 'none', border: 'none', color: '#5a5855',
                          fontSize: '14px', cursor: 'pointer', padding: '4px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5a5855'}
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
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden', position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '20px' }}>
                        
                        {/* Left Info Details */}
                        <div>
                          <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '6px' }}>Overview</h4>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px', color: '#a8a49c', lineHeight: 1.7, margin: '0 0 16px' }}>
                            {place.desc}
                          </p>

                          <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '6px' }}>Why This Expedition?</h4>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13.5px', color: '#a8a49c', lineHeight: 1.7, margin: 0 }}>
                            {place.whyVisit}
                          </p>
                        </div>

                        {/* Right Detail Parameters + Notes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#06080c', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#5a5855', textTransform: 'uppercase' }}>Coordinates</div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#edeae2', marginTop: '2px' }}>{place.coordinates}</div>
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#5a5855', textTransform: 'uppercase' }}>Peak Elevation</div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#edeae2', marginTop: '2px' }}>{place.altitude}</div>
                            </div>
                          </div>

                          {/* Field Notes (Interactive Persisted Text Area) */}
                          <div onClick={e => e.stopPropagation()}>
                            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#7a7570', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Field Planning Notes
                            </label>
                            <textarea
                              rows={3}
                              value={place.notes || ''}
                              onChange={e => handleNoteChange(place.id, e.target.value)}
                              placeholder="Add gear checks, routes, or local permits info..."
                              style={{
                                width: '100%',
                                background: '#06080c',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '6px',
                                padding: '12px',
                                color: '#edeae2',
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '13px',
                                outline: 'none',
                                resize: 'none'
                              }}
                            />
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

      </div>
    </div>
  )
}
