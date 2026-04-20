import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { useMapStore } from '../store/mapStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
import EarthTransition from './EarthTransition'
import RegionPanel from './RegionPanel'
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
 *  animateCamera — smooth rAF-based camera interpolation
 * ═══════════════════════════════════════════════════════════════════ */
function animateCamera(
  map: google.maps.Map,
  to: { lat: number; lng: number; zoom: number; tilt: number; heading: number },
  durationMs: number
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    const from = {
      lat:     map.getCenter()?.lat() ?? to.lat,
      lng:     map.getCenter()?.lng() ?? to.lng,
      zoom:    map.getZoom()    ?? 7,
      tilt:    map.getTilt()    ?? 0,
      heading: map.getHeading() ?? 0,
    }

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    function frame(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / durationMs, 1)
      const e = easeInOut(t)

      map.moveCamera({
        center: {
          lat: from.lat + (to.lat - from.lat) * e,
          lng: from.lng + (to.lng - from.lng) * e,
        },
        zoom:    from.zoom    + (to.zoom    - from.zoom)    * e,
        tilt:    from.tilt    + (to.tilt    - from.tilt)    * e,
        heading: from.heading + (to.heading - from.heading) * e,
      })

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(frame)
  })
}

/* ═══════════════════════════════════════════════════════════════════
 *  haversineDistance — great-circle distance between two lat/lng points
 * ═══════════════════════════════════════════════════════════════════ */
function haversineDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371000
  const dLat = (p2.lat - p1.lat) * Math.PI / 180
  const dLon = (p2.lng - p1.lng) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calcTrekDistance(path: Array<{ lat: number; lng: number }>): number {
  let total = 0
  for (let i = 0; i < path.length - 1; i++) total += haversineDistance(path[i], path[i + 1])
  return total / 1000  // km
}



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
 *  FlyingOverlay — fullscreen cinematic overlay during fly-to
 * ═══════════════════════════════════════════════════════════════════ */
interface FlyingState { name: string; emoji: string; image?: string }

function FlyingOverlay({ flying }: { flying: FlyingState | null }) {
  if (!flying) return null
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'flyOverlayFade 3s ease forwards',
    }}>
      <style>{`
        @keyframes flyOverlayFade {
          0%   { opacity: 0; background: rgba(6,8,12,0); }
          20%  { opacity: 1; background: rgba(6,8,12,0.72); }
          75%  { opacity: 1; background: rgba(6,8,12,0.72); }
          100% { opacity: 0; background: rgba(6,8,12,0); }
        }
        @keyframes flyEmojiScale {
          0%   { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes flyProgress {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* Icon: custom image (circular) or emoji */}
      {flying.image ? (
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(232,201,122,0.6)',
          boxShadow: '0 0 40px rgba(232,201,122,0.35), 0 0 80px rgba(232,201,122,0.15)',
          animation: 'flyEmojiScale 3s ease forwards',
          flexShrink: 0,
        }}>
          <img src={flying.image} alt={flying.name}
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <span style={{
          fontSize: '80px', lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(232,201,122,0.5))',
          animation: 'flyEmojiScale 3s ease forwards',
          display: 'block',
        }}>{flying.emoji}</span>
      )}

      {/* Place name */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: '48px',
        color: '#edeae2',
        marginTop: '16px',
        textAlign: 'center',
        textShadow: '0 2px 32px rgba(6,8,12,0.8)',
        letterSpacing: '0.02em',
      }}>{flying.name}</div>

      {/* "Flying to" label */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px',
        color: '#e8c97a',
        letterSpacing: '0.2em',
        marginTop: '8px',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>Flying to&hellip;</div>

      {/* Gold progress bar */}
      <div style={{
        marginTop: '20px',
        width: '240px',
        height: '1px',
        background: 'rgba(232,201,122,0.15)',
        borderRadius: '1px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          background: 'linear-gradient(90deg, transparent, #e8c97a, transparent)',
          animation: 'flyProgress 2.8s ease forwards',
        }} />
      </div>
    </div>
  )
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

  /* Trek polyline refs — cleaned up on nav/reset */
  const trekPolylineRef  = useRef<any>(null)
  const trekGlowRef      = useRef<any>(null)
  const summitCircleRef  = useRef<any>(null)
  const summitPulseTimer = useRef<any>(null)

  /* Stable function refs (assigned inside init useEffect) */
  const doSelectStateRef     = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doSelectSubRegionRef = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doBackToRegionRef    = useRef<() => void>(() => {})
  const doResetRef           = useRef<() => void>(() => {})

  /* React state for UI rendering */
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [mapActive,  setMapActive]  = useState(false)
  const [flyingTo,   setFlyingTo]   = useState<FlyingState | null>(null)

  /* Earth Studio video transition state */
  const [earthTransition, setEarthTransition] = useState<{
    videoUrl: string
    placeName: string
    navigateTo: string
  } | null>(null)

  /* Trail stats overlay state */
  const [trekStats, setTrekStats] = useState<{
    name: string
    distanceKm: string
    points: number
  } | null>(null)

  const activeRegionId      = useMapStore((s) => s.activeRegionId)
  const activeSubRegionId   = useMapStore((s) => s.activeSubRegionId)
  const setSubRegion        = useMapStore((s) => s.setSubRegion)
  const openRegionPanel     = useMapStore((s) => s.openRegionPanel)
  const closePanel          = useMapStore((s) => s.closePanel)
  const storePlaceId        = useMapStore((s) => s.activePlaceId)
  const panelOpen           = useMapStore((s) => s.panelOpen)
  
  const isMobile            = useMediaQuery('(max-width: 900px)')

  const doSelectPlaceRef = useRef<(id: string) => void>(() => {})

  const prevPanelOpen = useRef(panelOpen)

  /* Track if a cinematic animation is running — pauses auto-rotation */
  const isAnimatingRef = useRef(false)

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

  /* Dynamically adjust map padding to ensure markers aren't covered by bottom sheet */
  useEffect(() => {
    if (mapObj.current) {
      // The user requested to hide the RegionPanel entirely on mobile,
      // so we no longer need the 45% bottom padding offset.
      if (!isMobile && panelOpen) {
        mapObj.current.setOptions({ padding: { top: 0, bottom: 0, left: 0, right: 0 } })
      } else {
        mapObj.current.setOptions({ padding: { top: 0, bottom: 0, left: 0, right: 0 } })
      }
    }
  }, [isMobile, panelOpen])

  /* ── Init (runs once) ────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current) return
    if (!_configured) {
      setOptions({ key: import.meta.env.VITE_MAPS_API_KEY, v: 'weekly', libraries: ['marker'] })
      _configured = true
    }

    ;(async () => {
      try {
        const { Map }                   = await importLibrary('maps')   as any
        const { AdvancedMarkerElement } = await importLibrary('marker') as any
        AMERef.current = AdvancedMarkerElement

        // NOTE: No mapId is set here intentionally.
        // mapId enables vector rendering which CANNOT display satellite tiles —
        // it only renders cloud-styled road maps. Raster mode (no mapId) gives us
        // real satellite imagery. AdvancedMarkerElement still works on raster maps,
        // it just logs a non-fatal console warning (which we suppress below).
        const map = new Map(mapRef.current!, {
          center: { lat: INIT.lat, lng: INIT.lng },
          zoom:    INIT.zoom,
          tilt:    INIT.tilt,
          heading: INIT.heading,
          mapTypeId: 'satellite',
          // AdvancedMarkerElement strictly requires a mapId.
          mapId: import.meta.env.VITE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          gestureHandling: 'none',
          zoomControl:       false,
          mapTypeControl:    false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl:     false,
          keyboardShortcuts: false,
        })

        // Re-assert after first idle to catch any async override
        const idleListener = map.addListener('idle', () => {
          idleListener.remove()
          map.setMapTypeId('satellite')
          map.setTilt(INIT.tilt)
          map.setHeading(INIT.heading)
        })

        mapObj.current = map
        setLoading(false)
        suppressWarnings(mapRef.current!)

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

        /* ── Auto-rotation ───────────────────────────────────── */
        let autoRotate: number | null = null
        let isUserInteracting = false

        const startRotation = () => {
          if (autoRotate) return
          autoRotate = window.setInterval(() => {
            if (!isUserInteracting && !isAnimatingRef.current) {
              map.setHeading(((map.getHeading() ?? 0) + 0.4) % 360)
            }
          }, 60)
        }

        const stopRotation = () => {
          if (autoRotate) { clearInterval(autoRotate); autoRotate = null }
        }

        map.addListener('mousedown',   () => { isUserInteracting = true;  stopRotation() })
        map.addListener('touchstart',  () => { isUserInteracting = true;  stopRotation() })
        map.addListener('mouseup',     () => {
          isUserInteracting = false
          setTimeout(() => { if (!isUserInteracting) startRotation() }, 3000)
        })
        map.addListener('touchend',    () => {
          isUserInteracting = false
          setTimeout(() => { if (!isUserInteracting) startRotation() }, 3000)
        })

        setTimeout(startRotation, 2000)

        /* ── Helpers ──────────────────────────────────────────── */
        const clearSubRegionMarkers = () => {
          subRegionGmRef.current.forEach(m => { m.map = null })
          subRegionGmRef.current = []
        }
        const clearPlaceMarkers = () => {
          placeGmRef.current.forEach(m => { m.map = null })
          placeGmRef.current = []
          // Also remove any active trek path
          clearTrekPath()
        }
        const dimStates = (exceptId: string | null) => {
          Object.entries(stateElsRef.current).forEach(([_id, el]) => {
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

        /* ── Clear trek path polyline + summit circle ──────────── */
        const clearTrekPath = () => {
          if (trekPolylineRef.current)  { trekPolylineRef.current.setMap(null);  trekPolylineRef.current = null }
          if (trekGlowRef.current)      { trekGlowRef.current.setMap(null);      trekGlowRef.current = null }
          if (summitCircleRef.current)  { summitCircleRef.current.setMap(null);  summitCircleRef.current = null }
          if (summitPulseTimer.current) { clearInterval(summitPulseTimer.current); summitPulseTimer.current = null }
          setTrekStats(null)
        }

        /* ── Draw animated trek route polyline ─────────────────── */
        const drawTrekPath = (
          path: Array<{ lat: number; lng: number }>,
          placeName: string,
        ): Promise<void> => new Promise((resolve) => {
          if (!path || path.length < 2) { resolve(); return }
          clearTrekPath()

          const distKm = calcTrekDistance(path)

          // Fit camera to show the FULL route before drawing starts
          const midLat = (path[0].lat + path[path.length - 1].lat) / 2
          const midLng = (path[0].lng + path[path.length - 1].lng) / 2
          map.panTo({ lat: midLat, lng: midLng })
          map.setZoom(12)
          map.setTilt(55)

          // Create both polyline layers with just the first point initially
          const startPath = [path[0]]

          // Layer 1: glow
          const glowLine = new (window as any).google.maps.Polyline({
            path: startPath,
            geodesic: true,
            strokeColor: '#e8c97a',
            strokeOpacity: 0.22,
            strokeWeight: 10,
            map,
            zIndex: 5,
          })
          trekGlowRef.current = glowLine

          // Layer 2: dashed gold line
          const dashedLine = new (window as any).google.maps.Polyline({
            path: startPath,
            geodesic: true,
            strokeColor: '#e8c97a',
            strokeOpacity: 1,
            strokeWeight: 2.5,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
              },
              offset: '0',
              repeat: '12px',
            }],
            map,
            zIndex: 6,
          })
          trekPolylineRef.current = dashedLine

          // Animate: reveal one point every 300ms
          let currentIdx = 1
          const interval = setInterval(() => {
            if (currentIdx >= path.length) {
              clearInterval(interval)

              // All points drawn — add pulsing summit circle
              const summit = path[path.length - 1]
              const circle = new (window as any).google.maps.Circle({
                center: summit,
                radius: 200,
                fillColor: '#e8c97a',
                fillOpacity: 0.18,
                strokeColor: '#e8c97a',
                strokeWeight: 1.5,
                strokeOpacity: 0.9,
                map,
                zIndex: 7,
              })
              summitCircleRef.current = circle

              // Pulse radius 200 → 400 → 200
              let expanding = true
              summitPulseTimer.current = setInterval(() => {
                const cur = circle.getRadius()
                if (expanding) {
                  circle.setRadius(Math.min(cur + 12, 400))
                  if (cur >= 395) expanding = false
                } else {
                  circle.setRadius(Math.max(cur - 12, 200))
                  if (cur <= 205) expanding = true
                }
              }, 40)

              // Show trail stats overlay
              setTrekStats({
                name: placeName,
                distanceKm: distKm.toFixed(1),
                points: path.length,
              })

              // Hold so user can admire the drawn path, then resolve
              setTimeout(resolve, 700)
              return
            }

            const newPath = path.slice(0, currentIdx + 1)
            glowLine.setPath(newPath)
            dashedLine.setPath(newPath)
            currentIdx++
          }, 100)
        })

        /* ── Core Place Click Logic ────────────────────────────── */
        const handlePlaceClick = async (place: HimalayaPlace, region: HimalayaRegion) => {
          isAnimatingRef.current = true
          stopRotation()

          const targetHeading   = place.heading ?? 300
          const videoUrl        = (place as any).videoTransitionUrl as string | undefined
          const navTarget       = `/place/${region.id}/${place.id}`

          if (videoUrl) {
            /* ── Video transition path ──────────────────────────── */
            setFlyingTo({ name: place.name, emoji: place.emoji, image: place.image })

            // Phase 1: pull back
            await animateCamera(map, {
              lat:     (region.lat + place.lat) / 2,
              lng:     (region.lng + place.lng) / 2,
              zoom:    Math.max((map.getZoom() ?? 10) - 1, 6),
              tilt:    30,
              heading: map.getHeading() ?? 0,
            }, 600)

            // Phase 2: fly to place
            await animateCamera(map, {
              lat:     place.lat,
              lng:     place.lng,
              zoom:    11,
              tilt:    50,
              heading: targetHeading,
            }, 900)

            setFlyingTo(null)
            isAnimatingRef.current = false

            // Phase 3: draw trek path (AWAITED — user sees the full route)
            if (place.id === 'patalsu-peak' && place.trekPath && place.trekPath.length > 1) {
              await drawTrekPath(place.trekPath, place.name)
            }

            // Phase 4: hand off to Earth Studio video transition
            setEarthTransition({
              videoUrl,
              placeName: place.name,
              navigateTo: navTarget,
            })
          } else {
            /* ── Standard animateCamera flow ────────────────────── */
            setFlyingTo({ name: place.name, emoji: place.emoji, image: place.image })

            // Phase 1: pull back
            await animateCamera(map, {
              lat:     (region.lat + place.lat) / 2,
              lng:     (region.lng + place.lng) / 2,
              zoom:    Math.max((map.getZoom() ?? 10) - 1, 6),
              tilt:    30,
              heading: map.getHeading() ?? 0,
            }, 600)

            // Phase 2: fly toward place from above
            await animateCamera(map, {
              lat:     place.lat,
              lng:     place.lng,
              zoom:    11,
              tilt:    50,
              heading: targetHeading,
            }, 900)
            
            setFlyingTo(null)
            isAnimatingRef.current = false

            // Phase 3: draw trek path
            if (place.id === 'patalsu-peak' && place.trekPath && place.trekPath.length > 1) {
              await drawTrekPath(place.trekPath, place.name)
            }

            // Phase 4: navigate to place page
            navigate(navTarget)
          }
        }

        /* ── Spawn place markers for a given sub-region ────────── */
        const spawnPlaceMarkers = (
          subRegion: HimalayaSubRegion,
          region: HimalayaRegion,
        ) => {
          subRegion.places.forEach((place, i) => {
            setTimeout(() => {
              const se = buildPlaceMarkerEl(place)
              const sm = new AdvancedMarkerElement({
                position: { lat: place.lat, lng: place.lng },
                map, content: se, title: place.name, zIndex: 8,
              })

              sm.addListener('click', () => handlePlaceClick(place, region))
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

          if (!skipAnimation) {
            isAnimatingRef.current = true
            stopRotation()
            await animateCamera(map, {
              lat:     region.lat,
              lng:     region.lng,
              zoom:    region.zoom,
              tilt:    60,
              heading: 320,
            }, 1800)
            isAnimatingRef.current = false
            startRotation()
          } else {
            map.setCenter({ lat: region.lat, lng: region.lng })
            map.setZoom(region.zoom)
            map.setTilt(region.tilt)
            map.setHeading(region.heading)
            await sleep(100)
          }

          openRegionPanel(regionId)

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
            region.subregions.forEach(sr => spawnPlaceMarkers(sr, region))
          }
        }

        /* ── Level 1 → 2: Select a sub-region ────────────────── */
        doSelectSubRegionRef.current = async (subRegionId: string, skipAnimation = false) => {
          // Search ALL regions with showSubRegionsFirst for this sub-region ID
          // (previously only searched the first match, which was J&K not HP!)
          let region: HimalayaRegion | undefined
          let sr: HimalayaSubRegion | undefined
          for (const r of HIMALAYA_REGIONS) {
            if (!r.showSubRegionsFirst) continue
            const found = r.subregions.find(s => s.id === subRegionId)
            if (found) { region = r; sr = found; break }
          }
          if (!region || !sr) return
          if (!sr.lat || !sr.lng) return

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

          if (!skipAnimation) {
            isAnimatingRef.current = true
            stopRotation()
            await animateCamera(map, {
              lat:     sr.lat,
              lng:     sr.lng,
              zoom:    sr.zoom ?? 11,
              tilt:    60,
              heading: sr.heading ?? 320,
            }, 1400)
            isAnimatingRef.current = false
            startRotation()
          } else {
            map.setCenter({ lat: sr.lat, lng: sr.lng })
            map.setZoom(sr.zoom ?? 11)
            map.setTilt(sr.tilt ?? 55)
            map.setHeading(sr.heading ?? 0)
            await sleep(100)
          }

          spawnPlaceMarkers(sr, region)
        }

        /* ── Back to sub-region level (level 2 → 1) ───────────── */
        doBackToRegionRef.current = () => {
          setSubRegion(null)
          clearPlaceMarkers()

          // Use the currently active region (not hardcoded to HP)
          const activeId = useMapStore.getState().activeRegionId
          const region = HIMALAYA_REGIONS.find(r => r.id === activeId)
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
          let foundPlace: HimalayaPlace | null = null
          let foundRegion: HimalayaRegion | null = null
          for (const r of HIMALAYA_REGIONS) {
            for (const sr of r.subregions) {
              const p = sr.places.find(pl => pl.id === placeId)
              if (p) { foundPlace = p; foundRegion = r; break }
            }
          }
          if (!foundPlace || !foundRegion) return

          await handlePlaceClick(foundPlace, foundRegion)
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
        const initRegionId    = useMapStore.getState().activeRegionId
        const initSubRegionId = useMapStore.getState().activeSubRegionId

        if (initRegionId) {
          setTimeout(() => {
            doSelectStateRef.current(initRegionId, true).then(() => {
              if (initSubRegionId) {
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
    const m = mapObj.current
    if (m) {
      m.setOptions({ gestureHandling: 'greedy' })
      // Re-assert satellite + tilt in case gestureHandling change triggers
      // an internal re-render that resets the map type
      m.setMapTypeId('satellite')
      m.setTilt(INIT.tilt)
    }
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

      {/* Keyframe import for Playfair Display */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');`}</style>

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

      {/* Cinematic Fly-to Overlay */}
      <FlyingOverlay flying={flyingTo} />

      {/* Earth Studio Video Transition */}
      {earthTransition && (
        <EarthTransition
          videoUrl={earthTransition.videoUrl}
          placeName={earthTransition.placeName}
          onComplete={() => {
            setEarthTransition(null)
            navigate(earthTransition.navigateTo, { state: { from: 'map' } })
          }}
        />
      )}

      {/* Compact region popup — lives inside relative map wrapper */}
      <RegionPanel />

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

      {/* Trail stats overlay — bottom left, above region stats */}
      {trekStats && (
        <div style={{
          position: 'absolute',
          bottom: '118px',
          left: '20px',
          zIndex: 18,
          background: 'rgba(6,8,12,0.88)',
          border: '1px solid rgba(232,201,122,0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          backdropFilter: 'blur(14px)',
          animation: 'trekStatsIn 0.4s ease forwards',
        }}>
          <style>{`
            @keyframes trekStatsIn {
              0%   { opacity: 0; transform: translateY(8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '8px' }}>
            Trail
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(232,201,122,0.4)', textTransform: 'uppercase' }}>Distance</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', color: '#e8c97a', fontWeight: 700 }}>{trekStats.distanceKm} km</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(232,201,122,0.4)', textTransform: 'uppercase' }}>Waypoints</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', color: '#e8c97a', fontWeight: 700 }}>{trekStats.points}</span>
            </div>
          </div>
        </div>
      )}

      {/* Region stats bar */}
      {activeRegion && !isMobile && (
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
