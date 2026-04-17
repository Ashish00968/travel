import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { useMapStore } from '../store/mapStore'
import {
  HIMALAYA_REGIONS,
  type HimalayaRegion,
  type HimalayaSubRegion,
  type HimalayaPlace,
  TYPE_COLOR,
  TYPE_LABEL,
  countPlaces,
} from '../data/himalaya'

/* ─── Initial map view ──────────────────────────────────────────── */
const INIT = { lat: 33.5, lng: 77.0, zoom: 6, tilt: 55, heading: 345 }

let _configured = false

/* ─── Watermark / dialog suppression ───────────────────────────── */
function suppressWarnings(root: HTMLElement) {
  if (!document.getElementById('_gm_s')) {
    const s = document.createElement('style')
    s.id = '_gm_s'
    s.textContent = `
      .gm-style-moc,.gm-style-moc+div{display:none!important;}
      .gm-err-container,.gm-err-content{display:none!important;}
      .gm-style-cc{opacity:0!important;pointer-events:none!important;}
      .gm-style a[href*="maps.google"]{opacity:0!important;pointer-events:none!important;}
    `
    document.head.appendChild(s)
  }
  const obs = new MutationObserver(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent?.trim() === 'OK') b.click()
    })
    ;[document.body, root].forEach(r => {
      r.querySelectorAll('div,span').forEach(el => {
        if ((el as HTMLElement).children.length === 0 &&
            el.textContent?.trim() === 'For development purposes only')
          (el as HTMLElement).style.setProperty('display', 'none', 'important')
      })
    })
  })
  obs.observe(document.body, { childList: true, subtree: true, characterData: true })
}

/* ═══════════════════════════════════════════════════════════════════
 *  Marker builders
 *  Rule: emoji ONLY on the 4 main state markers (level 0).
 *        Sub-region and place markers = clean geo pins, no emoji.
 * ═══════════════════════════════════════════════════════════════════ */

/** Level 0 — large gold triangle + emoji (state markers only) */
function buildStateMarkerEl(region: HimalayaRegion, idx: number): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText =
    'cursor:pointer;display:flex;flex-direction:column;align-items:center;user-select:none;transition:opacity .4s ease,transform .4s ease;'
  el.innerHTML = `
    <style>@keyframes sf${idx}{0%,100%{transform:translateY(0);filter:drop-shadow(0 8px 24px rgba(232,201,122,.7));}50%{transform:translateY(-8px);filter:drop-shadow(0 18px 36px rgba(232,201,122,1));}}</style>
    <div style="animation:sf${idx} ${2.2 + idx * 0.4}s ease-in-out infinite;display:flex;flex-direction:column;align-items:center;">
      <span style="font-size:26px;line-height:1;margin-bottom:-4px;filter:drop-shadow(0 2px 8px rgba(0,0,0,1));">${region.emoji}</span>
      <svg width="42" height="54" viewBox="0 0 42 54" fill="none">
        <path d="M21 3L2 44H40L21 3Z" fill="#e8c97a" stroke="#06080c" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 44L21 24L30 44Z" fill="#c9a84c"/>
        <path d="M15 18L9 34H23L15 18Z" fill="#f5e4a8" opacity="0.5"/>
        <circle cx="21" cy="50" r="3.5" fill="#e8c97a" stroke="#06080c" stroke-width="1.2"/>
        <line x1="21" y1="44" x2="21" y2="46.5" stroke="#06080c" stroke-width="1.2"/>
      </svg>
      <div style="margin-top:6px;padding:4px 10px;background:rgba(6,8,12,.94);border:1px solid rgba(232,201,122,.5);border-radius:4px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#e8c97a;white-space:nowrap;backdrop-filter:blur(12px);">${region.name}</div>
    </div>`
  return el
}

/** Level 1 — medium clean pin, NO emoji (sub-region hub markers for HP) */
function buildSubRegionMarkerEl(sr: HimalayaSubRegion): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText =
    'cursor:pointer;display:flex;flex-direction:column;align-items:center;user-select:none;transition:opacity .35s ease,transform .35s ease;'
  el.innerHTML = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
      <path d="M16 2C9.37 2 4 7.37 4 14C4 24.5 16 40 16 40C16 40 28 24.5 28 14C28 7.37 22.63 2 16 2Z"
            fill="rgba(232,201,122,0.12)" stroke="#e8c97a" stroke-width="1.6"/>
      <circle cx="16" cy="14" r="5" fill="rgba(232,201,122,0.35)" stroke="#e8c97a" stroke-width="1"/>
    </svg>
    <div style="margin-top:4px;padding:3px 9px;background:rgba(6,8,12,.94);border:1px solid rgba(232,201,122,.4);border-radius:3px;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#e8c97a;white-space:nowrap;backdrop-filter:blur(10px);">${sr.name}</div>`
  return el
}

/** Level 2 — small dot pin, NO emoji (place markers) */
function buildPlaceMarkerEl(place: HimalayaPlace): HTMLElement {
  const color = TYPE_COLOR[place.type] ?? '#e8c97a'
  const el = document.createElement('div')
  el.style.cssText =
    'cursor:pointer;display:flex;flex-direction:column;align-items:center;user-select:none;gap:2px;'
  el.innerHTML = `
    <div style="padding:2px 7px;background:rgba(6,8,12,.9);border:1px solid ${color}50;border-radius:2px;font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:${color};white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;">${place.name}</div>
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <line x1="7" y1="0" x2="7" y2="8" stroke="${color}" stroke-width="1.2" opacity=".6"/>
      <circle cx="7" cy="13" r="4.5" fill="${color}" stroke="#06080c" stroke-width="1"/>
    </svg>`
  return el
}


/* ═══════════════════════════════════════════════════════════════════
 *  MapContainer — 3-level hierarchy
 *  Level 0 : 4 state markers
 *  Level 1 : sub-region markers (HP) OR place markers (others)
 *  Level 2 : place markers (HP only, after sub-region selected)
 * ═══════════════════════════════════════════════════════════════════ */
export default function MapContainer() {
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapObj = useRef<any>(null)
  const AMERef = useRef<any>(null)

  /* Marker element / GM object refs */
  const stateElsRef     = useRef<Record<string, HTMLElement>>({})
  const stateGmRef      = useRef<Record<string, any>>({})
  const subRegionGmRef  = useRef<any[]>([])   // Level-1 HP hub markers
  const placeGmRef      = useRef<any[]>([])   // Level-2 place markers

  /* Stable function refs (assigned inside init useEffect) */
  const doSelectStateRef     = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doSelectSubRegionRef = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doBackToRegionRef    = useRef<() => void>(() => {})
  const doResetRef           = useRef<() => void>(() => {})

  /* React state for UI rendering */
  const [loading,           setLoading]           = useState(true)
  const [error,             setError]             = useState<string | null>(null)
  const [mapActive,         setMapActive]          = useState(false)
  
  const activeRegionId      = useMapStore((s) => s.activeRegionId)
  const activeSubRegionId   = useMapStore((s) => s.activeSubRegionId)
  const setSubRegion        = useMapStore((s) => s.setSubRegion)
  const openRegionPanel     = useMapStore((s) => s.openRegionPanel)
  const closePanel          = useMapStore((s) => s.closePanel)
  const storePlaceId        = useMapStore((s) => s.activePlaceId)
  const panelOpen           = useMapStore((s) => s.panelOpen)

  const doSelectPlaceRef = useRef<(id: string) => void>(() => {})

  const prevPanelOpen = useRef(panelOpen)

  /* Listen to panel closing to reset the map */
  useEffect(() => {
    if (prevPanelOpen.current && !panelOpen && doResetRef.current) {
      doResetRef.current()
    }
    prevPanelOpen.current = panelOpen
  }, [panelOpen])

  /* Listen to activePlaceId from the sidebar clicks */
  useEffect(() => {
    if (storePlaceId && doSelectPlaceRef.current) {
      doSelectPlaceRef.current(storePlaceId)
    }
  }, [storePlaceId])

  /* ── Init (runs once) ────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current) return
    if (!_configured) {
      setOptions({ apiKey: import.meta.env.VITE_MAPS_API_KEY, version: 'weekly', libraries: ['marker'] })
      _configured = true
    }

    ;(async () => {
      try {
        const { Map }                   = await importLibrary('maps')   as any
        const { AdvancedMarkerElement } = await importLibrary('marker') as any
        AMERef.current = AdvancedMarkerElement

        const map = new Map(mapRef.current!, {
          center: { lat: INIT.lat, lng: INIT.lng },
          zoom: INIT.zoom, tilt: INIT.tilt, heading: INIT.heading,
          mapId: 'DEMO_MAP_ID', mapTypeId: 'satellite',
          gestureHandling: 'none',
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          mapTypeControl: false, streetViewControl: false,
          fullscreenControl: false, rotateControl: true,
        })
        mapObj.current = map
        setLoading(false)
        suppressWarnings(mapRef.current!)

        map.setOptions({ styles: [
          { elementType:'labels.text.fill',              stylers:[{color:'#e8c97a'}] },
          { elementType:'labels.text.stroke',            stylers:[{color:'#030508'},{weight:4}] },
          { featureType:'administrative.country', elementType:'geometry.stroke', stylers:[{color:'#e8c97a'},{weight:1.8}] },
          { featureType:'administrative.province', elementType:'geometry.stroke', stylers:[{color:'rgba(232,201,122,.4)'},{weight:1}] },
          { featureType:'poi',     stylers:[{visibility:'off'}] },
          { featureType:'transit', stylers:[{visibility:'off'}] },
        ]})

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

        const cinematicFlyTo = async (
          targetMap: google.maps.Map,
          target: { lat: number; lng: number },
          targetZoom: number,
          onComplete: () => void,
          skipAnimation = false
        ) => {
          if (skipAnimation) {
            targetMap.setZoom(targetZoom)
            targetMap.panTo(target)
            targetMap.setTilt(67.5)
            await sleep(100) // brief beat for map tiles
            onComplete()
            return
          }

          const startZoom = targetMap.getZoom() ?? 7
          // Phase 1: Quick zoom out + pan (200ms)
          targetMap.setZoom(Math.max(startZoom - 1, 5))
          await sleep(200)
          
          // Phase 2: Pan to target location (600ms)
          targetMap.panTo({ lat: target.lat, lng: target.lng })
          await sleep(600)
          
          // Phase 3: Increase tilt to max 3D (400ms)
          targetMap.setTilt(67.5)
          await sleep(400)
          
          // Phase 4: Zoom into the place progressively
          const zoomSteps = Math.max(1, targetZoom - (startZoom - 1))
          for (let i = 0; i < zoomSteps; i++) {
            targetMap.setZoom((targetMap.getZoom() ?? 7) + 1)
            targetMap.setHeading((targetMap.getHeading() ?? 0) + (25 / zoomSteps))
            await sleep(180)
          }
          
          // Phase 5: Final dramatic heading rotation (400ms)
          targetMap.setHeading((targetMap.getHeading() ?? 0) + 15)
          await sleep(400)
          
          // Phase 6: Hold on the beautiful 3D view (1000ms)
          await sleep(1000)
          
          onComplete()
        }

        let autoRotate: number | null = null
        let isUserInteracting = false

        map.addListener('mousedown', () => { 
          isUserInteracting = true
          if (autoRotate) clearInterval(autoRotate)
        })
        map.addListener('mouseup', () => {
          isUserInteracting = false
          setTimeout(() => {
            if (!isUserInteracting) {
              autoRotate = window.setInterval(() => {
                if (!isUserInteracting) {
                  map.setHeading((map.getHeading() ?? 0) + 0.3)
                }
              }, 50)
            }
          }, 3000)
        })

        setTimeout(() => {
          autoRotate = window.setInterval(() => {
            if (!isUserInteracting) {
              map.setHeading((map.getHeading() ?? 0) + 0.3)
            }
          }, 50)
        }, 2000)

        /* ── Helpers ──────────────────────────────────────────── */
        const clearSubRegionMarkers = () => {
          subRegionGmRef.current.forEach(m => { m.map = null })
          subRegionGmRef.current = []
        }
        const clearPlaceMarkers = () => {
          placeGmRef.current.forEach(m => { m.map = null })
          placeGmRef.current = []
        }
        const dimStates = (exceptId: string | null) => {
          Object.entries(stateElsRef.current).forEach(([id, el]) => {
            el.style.opacity       = exceptId ? '0' : '1'
            el.style.transform     = exceptId ? 'scale(0.75)' : 'scale(1)'
            el.style.pointerEvents = exceptId ? 'none' : 'auto'
          })
          Object.values(stateGmRef.current).forEach(gm => {
            gm.map = exceptId ? null : map
          })
        }
        const restoreStates = () => {
          Object.values(stateElsRef.current).forEach(el => {
            el.style.opacity = '1'; el.style.transform = 'scale(1)'; el.style.pointerEvents = 'auto'
          })
          Object.values(stateGmRef.current).forEach(gm => {
            gm.map = map
          })
        }

        /* ── Spawn place markers for a given sub-region ────────── */
        const spawnPlaceMarkers = (
          subRegion: HimalayaSubRegion,
          regionId: string,
        ) => {
          subRegion.places.forEach((place, i) => {
            setTimeout(() => {
              const se = buildPlaceMarkerEl(place)
              const sm = new AdvancedMarkerElement({
                position: { lat: place.lat, lng: place.lng },
                map, content: se, title: place.name, zIndex: 8,
              })
              sm.addListener('click', async () => {
                await cinematicFlyTo(
                  map,
                  { lat: place.lat, lng: place.lng },
                  14,
                  () => {
                    navigate(`/place/${regionId}/${place.id}`)
                  }
                )
              })
              placeGmRef.current.push(sm)
            }, 150 + i * 100)
          })
        }

        /* ── Level 0 → 1: Select a state ──────────────────────── */
        doSelectStateRef.current = async (regionId: string, skipAnimation = false) => {
          const region = HIMALAYA_REGIONS.find(r => r.id === regionId)
          if (!region) return

          setSubRegion(null)
          clearSubRegionMarkers()
          clearPlaceMarkers()
          dimStates(regionId)
          openRegionPanel(regionId)

          // Fly to state
          await cinematicFlyTo(
            map, 
            { lat: region.lat, lng: region.lng }, 
            region.zoom,
            () => {},
            skipAnimation
          )

          if (region.showSubRegionsFirst) {
            // HP: show sub-region hub markers
            region.subregions.forEach((sr, i) => {
              if (!sr.lat || !sr.lng) return
              setTimeout(() => {
                const se = buildSubRegionMarkerEl(sr)
                const sm = new AdvancedMarkerElement({
                  position: { lat: sr.lat!, lng: sr.lng! },
                  map, content: se, title: sr.name, zIndex: 9,
                })
                sm.addListener('click', () => doSelectSubRegionRef.current(sr.id))
                subRegionGmRef.current.push(sm)
              }, skipAnimation ? 50 : 200 + i * 150)
            })
          } else {
            // Others: go straight to places
            region.subregions.forEach(sr => spawnPlaceMarkers(sr, region.id))
          }
        }

        /* ── Level 1 → 2: Select a sub-region (HP only) ───────── */
        doSelectSubRegionRef.current = async (subRegionId: string, skipAnimation = false) => {
          const region = HIMALAYA_REGIONS.find(r => r.showSubRegionsFirst)
          if (!region) return
          const sr = region.subregions.find(s => s.id === subRegionId)
          if (!sr || !sr.lat || !sr.lng) return

          setSubRegion(subRegionId)
          clearPlaceMarkers()

          // Dim sub-region markers except selected
          subRegionGmRef.current.forEach(m => {
            const isActive = m.title === sr.name
            const el = m.content as HTMLElement
            if (isActive) {
              m.map = null // Hide the selected sub-region hub completely so places are visible
            } else {
              m.map = map
              el.style.opacity       = '0.15'
              el.style.transform     = 'scale(0.75)'
              el.style.pointerEvents = 'auto'
            }
          })

          // Fly to sub-region
          await cinematicFlyTo(
            map,
            { lat: sr.lat, lng: sr.lng },
            sr.zoom ?? 11,
            () => {},
            skipAnimation
          )

          spawnPlaceMarkers(sr, region.id)
        }

        /* ── Back to region (HP level 2 → 1) ──────────────────── */
        doBackToRegionRef.current = () => {
          setSubRegion(null)
          clearPlaceMarkers()

          const region = HIMALAYA_REGIONS.find(r => r.id === 'himachal-pradesh')
          if (!region) return

          // Restore sub-region markers
          subRegionGmRef.current.forEach(m => {
            m.map = map
            const el = m.content as HTMLElement
            el.style.opacity = '1'; el.style.transform = 'scale(1)'; el.style.pointerEvents = 'auto'
          })

          map.panTo({ lat: region.lat, lng: region.lng })
          setTimeout(() => {
            map.setZoom(region.zoom)
            map.setTilt(region.tilt)
            map.setHeading(region.heading)
          }, 400)
        }

        /* ── Full reset ────────────────────────────────────────── */
        doResetRef.current = () => {
          setSubRegion(null)
          clearSubRegionMarkers()
          clearPlaceMarkers()
          restoreStates()
          closePanel()
          map.panTo({ lat: INIT.lat, lng: INIT.lng })
          setTimeout(() => {
            map.setZoom(INIT.zoom)
            map.setTilt(INIT.tilt)
            map.setHeading(INIT.heading)
          }, 400)
        }

        /* ── Select from Sidebar ───────────────────────────────── */
        doSelectPlaceRef.current = async (placeId: string) => {
          let foundPlace: any = null
          let foundRegionId: string | null = null
          for (const r of HIMALAYA_REGIONS) {
            for (const sr of r.subregions) {
              const p = sr.places.find(pl => pl.id === placeId)
              if (p) { foundPlace = p; foundRegionId = r.id; break; }
            }
          }
          if (!foundPlace) return
          await cinematicFlyTo(
            map,
            { lat: foundPlace.lat, lng: foundPlace.lng },
            14,
            () => navigate(`/place/${foundRegionId}/${placeId}`)
          )
        }

        /* ── Create the 4 state markers ────────────────────────── */
        HIMALAYA_REGIONS.forEach((region, idx) => {
          const el = buildStateMarkerEl(region, idx)
          stateElsRef.current[region.id] = el
          const gm = new AdvancedMarkerElement({
            position: { lat: region.lat, lng: region.lng },
            map, content: el, title: region.name, zIndex: 10,
          })
          stateGmRef.current[region.id] = gm
          gm.addListener('click', () => doSelectStateRef.current(region.id))
        })

        /* ── Sync from Store to Map on Load ────────────────────── */
        const initRegionId = useMapStore.getState().activeRegionId
        const initSubRegionId = useMapStore.getState().activeSubRegionId
        
        if (initRegionId) {
          setTimeout(() => {
            doSelectStateRef.current(initRegionId, true).then(() => {
              if (initSubRegionId) {
                // Instantly select the sub-region too so they're exactly where they left
                setTimeout(() => doSelectSubRegionRef.current(initSubRegionId, true), 100)
              }
            })
          }, 200)
        }

      } catch (err) {
        console.error('Map load error:', err)
        setError('Map failed to load.')
        setLoading(false)
      }
    })()
  }, [])

  const activateMap = () => {
    setMapActive(true)
    mapObj.current?.setOptions({ gestureHandling: 'greedy' })
  }

  /* Fullscreen state */
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  const toggleFullscreen = () => {
    const el = mapRef.current?.parentElement as HTMLElement | null
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  /* ESC key: step back through levels */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activeSubRegionId)  { doBackToRegionRef.current(); return }
      if (activeRegionId)     { doResetRef.current() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSubRegionId, activeRegionId])

  /* Derived UI data */
  const activeRegion    = HIMALAYA_REGIONS.find(r => r.id === activeRegionId) ?? null
  const activeSubRegion = activeRegion?.subregions.find(s => s.id === activeSubRegionId) ?? null

  /* Back action: what one ESC/back-button press does */
  const handleBack = () => {
    if (activeSubRegionId) { doBackToRegionRef.current(); return }
    if (activeRegionId)    { doResetRef.current() }
  }
  const showBackBtn = !!activeRegionId && !loading

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div style={{ position:'relative', width:'100%', height:'80vh', minHeight:'600px', background:'#06080c', overflow:'hidden' }}>

      {/* Loading */}
      {loading && (
        <div style={{ position:'absolute', inset:0, zIndex:30, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', background:'#06080c' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ animation:'spin 1.5s linear infinite' }}>
            <path d="M28 6L6 48H50L28 6Z" fill="none" stroke="#e8c97a" strokeWidth="2"/>
            <path d="M18 48L28 28L38 48" fill="rgba(232,201,122,.15)"/>
          </svg>
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'10px', letterSpacing:'0.2em', color:'rgba(232,201,122,.45)', textTransform:'uppercase' }}>Loading atlas_</span>
        </div>
      )}

      {error && (
        <div style={{ position:'absolute', inset:0, zIndex:30, display:'flex', alignItems:'center', justifyContent:'center', background:'#06080c' }}>
          <p style={{ color:'#e86a4a', fontFamily:"'Space Mono',monospace", fontSize:'12px' }}>{error}</p>
        </div>
      )}

      {/* Map canvas */}
      <div ref={mapRef} style={{ width:'100%', height:'100%' }} />

      {/* Click-to-activate */}
      {!loading && !mapActive && (
        <div onClick={activateMap} style={{ position:'absolute', inset:0, zIndex:15, cursor:'pointer', display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:'64px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(6,8,12,.9)', border:'1px solid rgba(232,201,122,.45)', borderRadius:'10px', padding:'11px 22px', backdropFilter:'blur(16px)', animation:'phint 2s ease-in-out infinite' }}>
            <span style={{ fontSize:'15px' }}>🖱️</span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'10px', letterSpacing:'0.18em', color:'#e8c97a', textTransform:'uppercase' }}>Click to explore the atlas</span>
          </div>
          <style>{`@keyframes phint{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.7;transform:translateY(-5px)}}`}</style>
        </div>
      )}

      {/* ── Back button (top-left) ─────────────────────────── */}
      {showBackBtn && (
        <button
          onClick={handleBack}
          style={{
            position:'absolute', top:'20px', left:'20px', zIndex:20,
            display:'flex', alignItems:'center', gap:'7px',
            background:'rgba(6,8,12,.88)', border:'1px solid rgba(232,201,122,.3)',
            borderRadius:'8px', padding:'8px 14px',
            fontFamily:"'Space Mono',monospace", fontSize:'9px',
            letterSpacing:'0.15em', color:'#e8c97a', textTransform:'uppercase',
            cursor:'pointer', backdropFilter:'blur(12px)',
            transition:'border-color .2s, background .2s',
          }}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M11 5H1M1 5L5 1M1 5L5 9" stroke="#e8c97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {activeSubRegionId ? activeRegion?.name : 'All Regions'}
        </button>
      )}

      {/* Breadcrumb — shows current location path */}
      {activeRegion && (
        <div style={{ position:'absolute', top:'58px', left:'20px', zIndex:18, display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'rgba(255,255,255,.2)', textTransform:'uppercase' }}>
            India
          </span>
          <span style={{ color:'rgba(255,255,255,.15)', fontSize:'10px' }}>›</span>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color: activeSubRegion ? 'rgba(232,201,122,.5)' : '#e8c97a', textTransform:'uppercase' }}>
            {activeRegion.name}
          </span>
          {activeSubRegion && (
            <>
              <span style={{ color:'rgba(255,255,255,.15)', fontSize:'10px' }}>›</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'#e8c97a', textTransform:'uppercase' }}>
                {activeSubRegion.name}
              </span>
            </>
          )}
        </div>
      )}

      {/* Region stats bar */}
      {activeRegion && (
        <div style={{ position:'absolute', bottom:'60px', left:'20px', zIndex:18 }}>
          <div style={{ background:'rgba(6,8,12,.9)', border:'1px solid rgba(255,255,255,.08)', borderRadius:'8px', padding:'8px 14px', display:'flex', gap:'20px', backdropFilter:'blur(12px)' }}>
            {[
              { label:'Places',  value: countPlaces(activeRegion).toString() },
              { label:'Max Alt', value: activeRegion.maxAlt },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'#3d3b38', textTransform:'uppercase' }}>{label}</span>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'11px', color:'#e8c97a' }}>{value}</span>
              </div>
            ))}
            <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'#3d3b38', textTransform:'uppercase' }}>Type</span>
              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                {activeRegion.travelTypes.map(t => (
                  <span key={t} style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', padding:'2px 6px', background:`${TYPE_COLOR[t]}15`, border:`1px solid ${TYPE_COLOR[t]}44`, borderRadius:'3px', color:TYPE_COLOR[t], textTransform:'uppercase' }}>
                    {TYPE_LABEL[t]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Place info card removed */}

      {/* Vignette */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', boxShadow:'inset 0 0 140px rgba(3,5,8,.85)', zIndex:3 }} />

      {/* ── Fullscreen button (bottom-right corner) ─────────── */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        style={{
          position:'absolute', bottom:'20px', right:'20px', zIndex:10,
          width:'38px', height:'38px',
          background:'rgba(6,8,12,.9)', border:'1px solid rgba(255,255,255,.14)',
          borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', backdropFilter:'blur(12px)', color:'#edeae2',
          transition:'border-color .2s, background .2s',
        }}
      >
        {isFullscreen ? (
          /* Compress icon */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 1V6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 1V6H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15V10H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 15V10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          /* Expand icon — 4 corner brackets */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 5V1H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 1H15V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 11V15H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11V15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Idle hint */}
      {mapActive && !activeRegion && (
        <div style={{ position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)', zIndex:10, fontFamily:"'Space Mono',monospace", fontSize:'9px', letterSpacing:'0.15em', color:'rgba(255,255,255,.2)', textTransform:'uppercase', whiteSpace:'nowrap', pointerEvents:'none' }}>
          Click a region to begin exploring
        </div>
      )}
    </div>
  )
}
