import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// @ts-ignore
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
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
import {
  flyToCamera,
  buildStateMarkerEl,
  buildSubRegionMarkerEl,
  buildPlaceMarkerEl,
  buildSummitMarkerEl,
  calcTrekDistance
} from './mapUtils'

/* ── Initial map view — looking NORTH at the full Himalayan arc ── */
const INIT = { lat: 31.0, lng: 77.0, zoom: 5.2, pitch: 65, bearing: 0 }

/* ── Per-region cinematic south-offset camera (looks northward at peaks) ─
 *  lat/lng = camera position (placed SOUTH of region for northward look)
 *  bearing ≈ 0 → 10  (facing roughly north so snow peaks fill background)
 *  pitch 65-72       (tilted so terrain drops away, peaks rise dramatically)
 * ─────────────────────────────────────────────────────────────────────── */
const REGION_CAMERAS: Record<string, { lat: number; lng: number; zoom: number; pitch: number; bearing: number }> = {
  'jammu-kashmir':    { lat: 32.30, lng: 74.80, zoom: 8.0, pitch: 75, bearing: 10   },
  'ladakh':           { lat: 32.80, lng: 77.50, zoom: 7.8, pitch: 75, bearing: 355 },
  'himachal-pradesh': { lat: 30.90, lng: 77.10, zoom: 8.2, pitch: 75, bearing: 5   },
  'uttarakhand':      { lat: 29.40, lng: 79.00, zoom: 8.0, pitch: 75, bearing: 5   },
}

/* Per-subregion south-offset cameras */
const SUBREGION_CAMERAS: Record<string, { lat: number; lng: number; zoom: number; pitch: number; bearing: number }> = {
  'rajouri':          { lat: 33.00, lng: 74.43, zoom: 10.0, pitch: 70, bearing: 5   },
  'jammu':            { lat: 32.80, lng: 75.28, zoom: 10.0, pitch: 68, bearing: 5   },
  'kashmir':          { lat: 33.60, lng: 74.90, zoom: 10.0, pitch: 68, bearing: 5   },
  'leh-beyond':       { lat: 33.50, lng: 77.58, zoom: 9.5,  pitch: 68, bearing: 355 },
  'kullu':            { lat: 31.80, lng: 77.15, zoom: 10.2, pitch: 70, bearing: 5   },
  'mandi':            { lat: 31.30, lng: 76.93, zoom: 10.5, pitch: 68, bearing: 5   },
  'kinnaur':          { lat: 31.10, lng: 78.35, zoom: 10.5, pitch: 68, bearing: 15  },
  'spiti':            { lat: 31.40, lng: 78.00, zoom: 9.5,  pitch: 68, bearing: 5   },
  'garhwal':          { lat: 30.20, lng: 79.10, zoom: 10.0, pitch: 68, bearing: 5   },
}

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

      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px',
        color: '#e8c97a',
        letterSpacing: '0.2em',
        marginTop: '8px',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>Flying to&hellip;</div>

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

export default function MapContainer() {
  const navigate = useNavigate()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const stateMarkersRef = useRef<Record<string, mapboxgl.Marker>>({})
  const subRegionMarkersRef = useRef<mapboxgl.Marker[]>([])
  const placeMarkersRef = useRef<mapboxgl.Marker[]>([])
  const trekMarkersRef = useRef<mapboxgl.Marker[]>([])
  const lastAnimatedSubRegionRef = useRef<string | null>(null)

  const doSelectStateRef = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doSelectSubRegionRef = useRef<(id: string, skipAnimation?: boolean) => Promise<void>>(async () => {})
  const doBackToRegionRef = useRef<() => void>(() => {})
  const doResetRef = useRef<() => void>(() => {})
  const doSelectPlaceRef = useRef<(id: string) => void>(() => {})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapActive, setMapActive] = useState(false)
  const [flyingTo, setFlyingTo] = useState<FlyingState | null>(null)
  // 'hidden' → no overlay | 'dimming' → fading in (pre-flight) | 'clearing' → fading out (post-flight)
  const [flightDimOverlay, setFlightDimOverlay] = useState<'hidden' | 'dimming' | 'clearing'>('hidden')
  // Cancels the hidden-transition timer if a new region is clicked before it completes
  const flightDimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Drives which layer of markers is visible: 'regions' = all region pins shown,
  // 'subregions' = region pins hidden, subregion/place pins shown
  const [markerVisibilityState, setMarkerVisibilityState] = useState<'regions' | 'subregions'>('regions')

  const [trekStats, setTrekStats] = useState<{
    name: string
    distanceKm: string
    points: number
  } | null>(null)

  // Live altitude HUD for Patalsu trek animation
  const [liveTrekAlt, setLiveTrekAlt] = useState<number | null>(null)

  const activeRegionId = useMapStore((s) => s.activeRegionId)
  const activeSubRegionId = useMapStore((s) => s.activeSubRegionId)
  const setSubRegion = useMapStore((s) => s.setSubRegion)
  const openRegionPanel = useMapStore((s) => s.openRegionPanel)
  const closePanel = useMapStore((s) => s.closePanel)
  const storePlaceId = useMapStore((s) => s.activePlaceId)
  const panelOpen = useMapStore((s) => s.panelOpen)
  
  const isMobile = useMediaQuery('(max-width: 900px)')
  const prevPanelOpen = useRef(panelOpen)

  useEffect(() => {
    if (prevPanelOpen.current && !panelOpen && doResetRef.current) {
      doResetRef.current()
    }
    prevPanelOpen.current = panelOpen
  }, [panelOpen])

  useEffect(() => {
    if (storePlaceId && doSelectPlaceRef.current) {
      doSelectPlaceRef.current(storePlaceId)
    }
  }, [storePlaceId])

  useEffect(() => {
    if (activeSubRegionId && activeSubRegionId !== lastAnimatedSubRegionRef.current) {
      if (doSelectSubRegionRef.current) {
        doSelectSubRegionRef.current(activeSubRegionId)
      }
    }
  }, [activeSubRegionId])

  useEffect(() => {
    if (!mapContainerRef.current) return
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) {
      setError('Mapbox token is missing in .env')
      setLoading(false)
      return
    }
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [INIT.lng, INIT.lat],
      zoom: INIT.zoom,
      pitch: INIT.pitch,
      bearing: INIT.bearing,
      projection: 'globe',
      interactive: false // Initial state, user must click to interact
    })

    let isCancelled = false
    mapRef.current = map

    map.on('style.load', () => {
      if (isCancelled) return
      // Hide all default Mapbox labels, borders, and streets for a clean cinematic look
      const layers = map.getStyle().layers;
      if (layers) {
        layers.forEach((layer) => {
          if (layer.type === 'symbol' || layer.type === 'line' || layer.id.includes('road') || layer.id.includes('label')) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
          }
        });
      }

      map.setFog({
        'range': [0.5, 10],
        'color': '#07090F',
        'high-color': '#161A22',
        'space-color': '#000000',
        'star-intensity': 0.8
      })

      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      })
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 })
      setLoading(false)

      const clearSubRegionMarkers = () => {
        subRegionMarkersRef.current.forEach(m => m.remove())
        subRegionMarkersRef.current = []
      }

      const clearPlaceMarkers = () => {
        placeMarkersRef.current.forEach(m => m.remove())
        placeMarkersRef.current = []
        clearTrekPath()
      }

      const dimStates = () => {
        Object.values(stateMarkersRef.current).forEach(m => {
          m.remove()
        })
      }

      const restoreStates = () => {
        Object.values(stateMarkersRef.current).forEach(m => {
          m.addTo(map)
        })
      }

      // ── De-overlap: push sub-region markers apart if they're closer than
      //    MIN_PX pixels in screen space. Runs 3 relaxation passes.
      const computeSubRegionOffsets = (
        srs: HimalayaSubRegion[],
        MIN_PX = 80
      ): Map<string, [number, number]> => {
        const valid = srs.filter(sr => sr.lat && sr.lng)
        const offsets = new Map<string, [number, number]>(valid.map(sr => [sr.id, [0, 0]]))

        for (let pass = 0; pass < 4; pass++) {
          for (let i = 0; i < valid.length; i++) {
            for (let j = i + 1; j < valid.length; j++) {
              const a = valid[i], b = valid[j]
              const oa = offsets.get(a.id)!, ob = offsets.get(b.id)!
              const pa = map.project([a.lng!, a.lat!])
              const pb = map.project([b.lng!, b.lat!])
              // current screen positions (geographic projection + accumulated pixel offset)
              const ax = pa.x + oa[0], ay = pa.y + oa[1]
              const bx = pb.x + ob[0], by = pb.y + ob[1]
              const dx = bx - ax, dy = by - ay
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist < MIN_PX) {
                const push = (dist === 0 ? MIN_PX / 2 : (MIN_PX - dist) / 2) + 4
                const nx = dist === 0 ? 0 : dx / dist
                const ny = dist === 0 ? -1 : dy / dist
                offsets.set(a.id, [oa[0] - nx * push, oa[1] - ny * push])
                offsets.set(b.id, [ob[0] + nx * push, ob[1] + ny * push])
              }
            }
          }
        }
        return offsets
      }

      const clearTrekPath = () => {
        // Remove gradient segments
        for (let i = 0; i < 36; i++) {
          if (map.getLayer(`trek-seg-glow-${i}`)) map.removeLayer(`trek-seg-glow-${i}`)
          if (map.getLayer(`trek-seg-${i}`)) map.removeLayer(`trek-seg-${i}`)
          if (map.getSource(`trek-seg-${i}`)) map.removeSource(`trek-seg-${i}`)
        }
        if (map.getSource('trek-path')) {
          if (map.getLayer('trek-glow')) map.removeLayer('trek-glow')
          if (map.getLayer('trek-line')) map.removeLayer('trek-line')
          map.removeSource('trek-path')
        }
        trekMarkersRef.current.forEach(m => m.remove())
        trekMarkersRef.current = []
        setTrekStats(null)
        setLiveTrekAlt(null)
      }

      // Patalsu-specific key waypoints: index → { label, alt }
      const PATALSU_WAYPOINTS: Record<number, { label: string; alt: number }> = {
        0:  { label: 'Solang Valley', alt: 2468 },
        8:  { label: 'Trail Start', alt: 2650 },
        14: { label: 'Forest Zone', alt: 2820 },
        20: { label: 'Treeline', alt: 3500 },
        27: { label: 'Ridge', alt: 3800 },
        33: { label: 'Summit Push', alt: 4100 },
        35: { label: '⛰️ SUMMIT 4261m', alt: 4261 },
      }

      // Interpolate altitude between known waypoints
      const interpolateAlt = (idx: number, total: number): number => {
        const altStart = 2468
        const altEnd   = 4261
        return Math.round(altStart + (altEnd - altStart) * (idx / (total - 1)))
      }

      // Map progress 0→1 to a colour: forest-green → amber → summit-gold
      const trekColor = (t: number): string => {
        if (t < 0.45) {
          // green (#4ab8a0) → red (#e8c97a)
          const r = Math.round(0x4a + (0xd9 - 0x4a) * (t / 0.45))
          const g = Math.round(0xb8 + (0x38 - 0xb8) * (t / 0.45))
          const b = Math.round(0xa0 + (0x1e - 0xa0) * (t / 0.45))
          return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
        } else {
          // red (#e8c97a) → ice (#b4d2e7)
          const t2 = (t - 0.45) / 0.55
          const r = Math.round(0xd9 + (0xb4 - 0xd9) * t2)
          const g = Math.round(0x38 + (0xd2 - 0x38) * t2)
          const b = Math.round(0x1e + (0xe7 - 0x1e) * t2)
          return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
        }
      }

      // Build a small named waypoint label marker
      const buildWaypointMarkerEl = (label: string, _alt: number, color: string): HTMLElement => {
        const el = document.createElement('div')
        const isSummit = label.includes('SUMMIT')
        el.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
            <div style="
              padding:${isSummit ? '5px 12px' : '3px 9px'};
              background:rgba(6,8,12,0.92);
              border:1px solid ${color}80;
              border-radius:4px;
              font-family:'Space Mono',monospace;
              font-size:${isSummit ? '9px' : '7.5px'};
              color:${color};
              white-space:nowrap;
              letter-spacing:0.12em;
              text-transform:uppercase;
              backdrop-filter:blur(10px);
              box-shadow:0 0 ${isSummit ? '16px' : '8px'} ${color}40;
              animation:wayptFade 0.4s ease;
            ">${label}</div>
            <svg width="2" height="${isSummit ? 16 : 10}" viewBox="0 0 2 16" fill="none">
              <line x1="1" y1="0" x2="1" y2="16" stroke="${color}" stroke-width="1.5" opacity="0.6"/>
            </svg>
            <div style="width:${isSummit ? '10px' : '6px'};height:${isSummit ? '10px' : '6px'};border-radius:50%;background:${color};box-shadow:0 0 ${isSummit ? '14px' : '8px'} ${color};"></div>
          </div>
          <style>@keyframes wayptFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}</style>
        `
        return el
      }

      // Build animated particle dot that travels along the trail
      const buildTrekParticleEl = (): HTMLElement => {
        const el = document.createElement('div')
        el.innerHTML = `
          <div style="position:relative;width:18px;height:18px;">
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(232,201,122,0.25);animation:trekPulse 1s ease-in-out infinite;"></div>
            <div style="position:absolute;top:5px;left:5px;width:8px;height:8px;border-radius:50%;background:#e8c97a;box-shadow:0 0 12px rgba(232,201,122,1);"></div>
          </div>
          <style>@keyframes trekPulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(2.2);opacity:0.15}}</style>
        `
        return el
      }

      const drawTrekPath = async (path: Array<{ lat: number; lng: number }>, placeName: string, isCinematic = false) => {
        if (!path || path.length < 2) return
        clearTrekPath()

        const distKm = calcTrekDistance(path)
        let coordinates = path.map(p => [p.lng, p.lat] as [number, number])
        
        try {
          const { lineString } = await import('@turf/helpers')
          const bezierSpline = (await import('@turf/bezier-spline')).default
          const lineChunk = (await import('@turf/line-chunk')).default
          const { length } = await import('@turf/length')

          const line = lineString(coordinates)
          // Smooth the path using bezier spline for a cinematic curved trail
          const smoothed = bezierSpline(line, { resolution: 10000, sharpness: 0.85 })
          const totalLength = length(smoothed, { units: 'kilometers' })
          
          // Chunk into exactly 40 segments so animation time is constant
          const segmentLength = totalLength / 40
          const chunks = lineChunk(smoothed, segmentLength, { units: 'kilometers' })
          
          const newCoords: [number, number][] = []
          chunks.features.forEach(f => {
            if (f.geometry.coordinates.length > 0) {
              newCoords.push(f.geometry.coordinates[0] as [number, number])
            }
          })
          // ensure last point is the exact summit
          newCoords.push(coordinates[coordinates.length - 1])
          coordinates = newCoords
        } catch (e) {
          console.warn('Turf processing failed, falling back to raw coordinates', e)
        }

        const total = coordinates.length

        // ── Cinematic multi-stage fly for Patalsu ──────────────────
        if (isCinematic) {
          await flyToCamera(map, {
            lat: 32.305, lng: 77.155, zoom: 11.5, pitch: 50, bearing: 20, duration: 2000
          })
        } else {
          const midLat = (path[0].lat + path[path.length - 1].lat) / 2
          const midLng = (path[0].lng + path[path.length - 1].lng) / 2
          await flyToCamera(map, { lat: midLat, lng: midLng, zoom: 12, pitch: 55, bearing: 0, duration: 1500 })
        }

        // Pull camera back to see full trail
        const centerLat = (path[0].lat + path[path.length - 1].lat) / 2
        const centerLng = (path[0].lng + path[path.length - 1].lng) / 2
        await flyToCamera(map, {
          lat: isCinematic ? 32.336 : centerLat - 0.01,
          lng: isCinematic ? 77.172 : centerLng,
          zoom: isCinematic ? 12.2 : 12,
          pitch: 62,
          bearing: isCinematic ? 355 : 0,
          duration: 1200
        })

        // ── Add per-segment gradient sources (pre-create all, draw empty) ─
        for (let i = 0; i < total - 1; i++) {
          const segGeo: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature', properties: {},
            geometry: { type: 'LineString', coordinates: [] }
          }
          map.addSource(`trek-seg-${i}`, { type: 'geojson', data: segGeo })
          const color = trekColor(i / (total - 1))
          map.addLayer({
            id: `trek-seg-glow-${i}`,
            type: 'line', source: `trek-seg-${i}`,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': color, 'line-width': 12, 'line-opacity': 0.18 }
          })
          map.addLayer({
            id: `trek-seg-${i}`,
            type: 'line', source: `trek-seg-${i}`,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': color, 'line-width': 2.8, 'line-opacity': 0.95 }
          })
        }

        // Add animated particle marker (starts at trailhead)
        const particleEl = buildTrekParticleEl()
        const particleMarker = new mapboxgl.Marker({ element: particleEl, anchor: 'center' })
          .setLngLat([coordinates[0][0], coordinates[0][1]])
          .addTo(map)
        trekMarkersRef.current.push(particleMarker)

        // ── Animate the trail drawing segment by segment ───────────
        let currentIdx = 0
        const drawnWaypoints = new Set<number>()

        return new Promise<void>(resolve => {
          const interval = setInterval(() => {
            if (currentIdx >= total - 1) {
              clearInterval(interval)
              particleMarker.remove()

              // Summit pulsing marker
              const summit = path[path.length - 1]
              const sm = new mapboxgl.Marker({ element: buildSummitMarkerEl(), anchor: 'center' })
                .setLngLat([summit.lng, summit.lat])
                .addTo(map)
              trekMarkersRef.current.push(sm)

              setTrekStats({ name: placeName, distanceKm: distKm.toFixed(1), points: total })
              setLiveTrekAlt(null)

              // ── Post-summit orbit: slowly circle the peak ─────────
              const summitLng = summit.lng
              const summitLat = summit.lat
              
              map.easeTo({ 
                bearing: map.getBearing() + (isCinematic ? 75 : 45), 
                center: [summitLng, summitLat], 
                zoom: isCinematic ? 13.5 : 13, 
                pitch: 68, 
                duration: isCinematic ? 5000 : 3000, 
                easing: t => t 
              })

              setTimeout(() => {
                resolve()
              }, isCinematic ? 5000 : 3000)
              return
            }

            // Draw current segment
            const segGeo: GeoJSON.Feature<GeoJSON.LineString> = {
              type: 'Feature', properties: {},
              geometry: { type: 'LineString', coordinates: [coordinates[currentIdx], coordinates[currentIdx + 1]] }
            }
            const src = map.getSource(`trek-seg-${currentIdx}`) as mapboxgl.GeoJSONSource
            if (src) src.setData(segGeo)

            // Move particle to current leading edge
            particleMarker.setLngLat([coordinates[currentIdx + 1][0], coordinates[currentIdx + 1][1]])

            // Update live altitude HUD
            const alt = interpolateAlt(currentIdx + 1, total)
            setLiveTrekAlt(alt)

            // Spawn named waypoint markers at key stops
            if (isCinematic && PATALSU_WAYPOINTS[currentIdx] && !drawnWaypoints.has(currentIdx)) {
              drawnWaypoints.add(currentIdx)
              const wp = PATALSU_WAYPOINTS[currentIdx]
              const color = trekColor(currentIdx / (total - 1))
              const wpEl = buildWaypointMarkerEl(wp.label, wp.alt, color)
              const wpMarker = new mapboxgl.Marker({ element: wpEl, anchor: 'bottom' })
                .setLngLat([coordinates[currentIdx][0], coordinates[currentIdx][1]])
                .addTo(map)
              trekMarkersRef.current.push(wpMarker)
            }

            currentIdx++
          }, 80)
        })
      }

      const handlePlaceClick = async (place: HimalayaPlace, region: HimalayaRegion) => {
        const targetHeading = place.heading ?? 5
        const navTarget = `/place/${region.id}/${place.id}`
        const hasTrek = place.trekPath && place.trekPath.length > 1

        // Hide other place markers to avoid clutter
        placeMarkersRef.current.forEach(m => {
          const el = m.getElement()
          if (!el.textContent?.includes(place.name.toUpperCase()) && !el.textContent?.includes(place.name)) {
            el.style.display = 'none'
          }
        })

        setFlyingTo({ name: place.name, emoji: place.emoji, image: place.image })

        if (!hasTrek) {
          await flyToCamera(map, {
            lat: place.lat - 0.03,
            lng: place.lng,
            zoom: 14,
            pitch: 75,
            bearing: targetHeading,
            duration: 1500
          })
          setFlyingTo(null)
        } else {
          setTimeout(() => setFlyingTo(null), 1500)
          const isCinematic = place.id === 'patalsu-peak'
          await drawTrekPath(place.trekPath!, place.name, isCinematic)
        }

        sessionStorage.setItem('mapScrollY', window.scrollY.toString())
        navigate(navTarget, { state: { from: 'map' } })
      }

      const spawnPlaceMarkers = (subRegion: HimalayaSubRegion, region: HimalayaRegion) => {
        subRegion.places.forEach((place, i) => {
          setTimeout(() => {
            const el = buildPlaceMarkerEl(place)
            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat([place.lng, place.lat])
              .addTo(map)
            
            el.addEventListener('click', (e) => {
              e.stopPropagation()
              handlePlaceClick(place, region)
            })
            
            placeMarkersRef.current.push(marker)
          }, 150 + i * 100)
        })
      }

      doSelectStateRef.current = async (regionId: string, skipAnimation = false) => {
        const region = HIMALAYA_REGIONS.find(r => r.id === regionId)
        if (!region) return

        setSubRegion(null)
        clearSubRegionMarkers()
        clearPlaceMarkers()

        // Hide ALL region markers (including the selected one)
        dimStates()
        setMarkerVisibilityState('subregions')

        openRegionPanel(regionId)

        // ── Compute a bounding box from all sub-regions that have lat/lng ──
        const srCoords = region.subregions
          .filter(sr => sr.lat && sr.lng)
          .map(sr => [sr.lng!, sr.lat!] as [number, number])

        // Fall back to the fixed camera if no sub-region coordinates exist
        const cam = REGION_CAMERAS[regionId] ?? {
          lat: region.lat - 0.8, lng: region.lng,
          zoom: region.zoom, pitch: 68, bearing: 5
        }

        // Helper: fit all sub-region pins in view with padding
        const flyToFitSubRegions = async (animate: boolean) => {
          if (srCoords.length >= 2) {
            const lngs = srCoords.map(c => c[0])
            const lats = srCoords.map(c => c[1])
            const bounds: [[number, number], [number, number]] = [
              [Math.min(...lngs) - 0.3, Math.min(...lats) - 0.3],
              [Math.max(...lngs) + 0.3, Math.max(...lats) + 0.3],
            ]
            await new Promise<void>(resolve => {
              map.once('moveend', () => resolve())
              map.fitBounds(bounds, {
                padding: { top: 80, bottom: 80, left: 80, right: 420 },
                pitch: 55,
                bearing: 5,
                duration: animate ? 1600 : 0,
                essential: true,
              })
            })
          } else {
            // Single or no sub-region — use fixed camera
            if (animate) {
              await flyToCamera(map, { lat: cam.lat, lng: cam.lng, zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing, duration: 1400 })
            } else {
              map.jumpTo({ center: [cam.lng, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing })
            }
          }
        }

        if (!skipAnimation) {
          // ── 1. Start dim overlay (fades in over 400ms via CSS transition) ────
          if (flightDimTimerRef.current) clearTimeout(flightDimTimerRef.current)
          setFlightDimOverlay('dimming')

          // ── 2. Show FlyingOverlay text for the region ─────────────────────────
          setFlyingTo({ name: region.name, emoji: region.emoji })

          // ── 3. Fly to fit all sub-regions in view ──────────────────────────────
          await flyToFitSubRegions(true)

          // ── 4. Flight done — clear the FlyingOverlay and start dim fade-out ──
          setFlyingTo(null)
          setFlightDimOverlay('clearing')
          // After CSS transition completes (400ms), fully remove the overlay
          flightDimTimerRef.current = setTimeout(() => setFlightDimOverlay('hidden'), 420)

          // ── 5. Spawn place / subregion markers (staggered, post-flight) ──────
          if (region.showSubRegionsFirst) {
            const offsets = computeSubRegionOffsets(region.subregions)
            region.subregions.forEach((sr, i) => {
              if (!sr.lat || !sr.lng) return
              setTimeout(() => {
                const el = buildSubRegionMarkerEl(sr)
                const [ox, oy] = offsets.get(sr.id) ?? [0, 0]
                const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom', offset: [ox, oy] })
                  .setLngLat([sr.lng!, sr.lat!])
                  .addTo(map)
                el.addEventListener('click', (e) => {
                  e.stopPropagation()
                  doSelectSubRegionRef.current(sr.id)
                })
                subRegionMarkersRef.current.push(marker)
              }, 300 + i * 120)
            })
          } else {
            region.subregions.forEach(sr => spawnPlaceMarkers(sr, region))
          }
        } else {
          // Skip-animation path (on map remount / back-navigation restore)
          await flyToFitSubRegions(false)

          if (region.showSubRegionsFirst) {
            const offsets = computeSubRegionOffsets(region.subregions)
            region.subregions.forEach((sr, i) => {
              if (!sr.lat || !sr.lng) return
              setTimeout(() => {
                const el = buildSubRegionMarkerEl(sr)
                const [ox, oy] = offsets.get(sr.id) ?? [0, 0]
                const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom', offset: [ox, oy] })
                  .setLngLat([sr.lng!, sr.lat!])
                  .addTo(map)
                el.addEventListener('click', (e) => {
                  e.stopPropagation()
                  doSelectSubRegionRef.current(sr.id)
                })
                subRegionMarkersRef.current.push(marker)
              }, 50 + i * 60)
            })
          } else {
            region.subregions.forEach(sr => spawnPlaceMarkers(sr, region))
          }
        }
      }

      doSelectSubRegionRef.current = async (subRegionId: string, skipAnimation = false) => {
        lastAnimatedSubRegionRef.current = subRegionId
        let region: HimalayaRegion | undefined
        let sr: HimalayaSubRegion | undefined
        for (const r of HIMALAYA_REGIONS) {
          if (!r.showSubRegionsFirst) continue
          const found = r.subregions.find(s => s.id === subRegionId)
          if (found) { region = r; sr = found; break }
        }
        if (!region || !sr || !sr.lat || !sr.lng) return

        setSubRegion(subRegionId)
        clearPlaceMarkers()

        subRegionMarkersRef.current.forEach(m => {
          const el = m.getElement()
          el.style.display = 'none'
        })

        // Use south-offset north-facing camera so all places spread across the terrain
        // with the snowy Himalayan backdrop visible
        const srCam = SUBREGION_CAMERAS[subRegionId]
        const camLat  = srCam?.lat     ?? (sr.lat - 0.5)
        const camLng  = srCam?.lng     ?? sr.lng
        const camZoom = srCam?.zoom    ?? (sr.zoom ?? 11)
        const camPitch = srCam?.pitch  ?? 68
        const camBear  = srCam?.bearing ?? 5

        if (!skipAnimation) {
          await flyToCamera(map, {
            lat: camLat, lng: camLng,
            zoom: camZoom, pitch: camPitch, bearing: camBear,
            duration: 1500
          })
        } else {
          map.jumpTo({ center: [camLng, camLat], zoom: camZoom, pitch: camPitch, bearing: camBear })
        }

        spawnPlaceMarkers(sr, region)
      }

      doBackToRegionRef.current = () => {
        setSubRegion(null)
        clearPlaceMarkers()

        const activeId = useMapStore.getState().activeRegionId
        if (!activeId) return
        const region = HIMALAYA_REGIONS.find(r => r.id === activeId)
        if (!region) return

        subRegionMarkersRef.current.forEach(m => {
          const el = m.getElement()
          el.style.display = 'flex'
          el.style.opacity = '1'
          el.style.transform = 'scale(1)'
          el.style.pointerEvents = 'auto'
        })

        // Return to the south-offset north-facing region camera
        const cam = REGION_CAMERAS[activeId] ?? {
          lat: region.lat - 0.8, lng: region.lng,
          zoom: region.zoom, pitch: 68, bearing: 5
        }
        flyToCamera(map, {
          lat: cam.lat, lng: cam.lng,
          zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing,
          duration: 1200
        })
      }

      doResetRef.current = () => {
        setSubRegion(null)
        clearSubRegionMarkers()
        clearPlaceMarkers()
        // Fade ALL region markers back in with CSS transition
        restoreStates()
        setMarkerVisibilityState('regions')
        closePanel()

        // Clear any in-flight dim overlay
        if (flightDimTimerRef.current) clearTimeout(flightDimTimerRef.current)
        setFlightDimOverlay('hidden')
        setFlyingTo(null)

        flyToCamera(map, {
          lat: INIT.lat,
          lng: INIT.lng,
          zoom: INIT.zoom,
          pitch: INIT.pitch,
          bearing: INIT.bearing,
          duration: 1200
        })
      }

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

      // Initialize state markers
      HIMALAYA_REGIONS.forEach((region, idx) => {
        const el = buildStateMarkerEl(region, idx)
        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([region.lng, region.lat])
          .addTo(map)
        
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          doSelectStateRef.current(region.id)
        })
        stateMarkersRef.current[region.id] = marker
      })

      // Sync state on load
      const initRegionId = useMapStore.getState().activeRegionId
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
    })

    return () => {
      isCancelled = true
      map.remove()
    }
  }, [])

  const activateMap = () => {
    setMapActive(true)
    if (mapRef.current) {
      // Enable interactions on click
      mapRef.current.boxZoom.enable()
      mapRef.current.scrollZoom.enable()
      mapRef.current.dragPan.enable()
      mapRef.current.dragRotate.enable()
      mapRef.current.keyboard.enable()
      mapRef.current.doubleClickZoom.enable()
      mapRef.current.touchZoomRotate.enable()
    }
  }

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  const toggleFullscreen = () => {
    const el = mapContainerRef.current?.parentElement as HTMLElement | null
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activeSubRegionId) { doBackToRegionRef.current(); return }
      if (activeRegionId) { doResetRef.current() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSubRegionId, activeRegionId])

  const activeRegion = HIMALAYA_REGIONS.find(r => r.id === activeRegionId) ?? null
  const activeSubRegion = activeRegion?.subregions.find(s => s.id === activeSubRegionId) ?? null

  const handleBack = () => {
    if (liveTrekAlt !== null || trekStats !== null) {
      setLiveTrekAlt(null)
      setTrekStats(null)
      if (activeSubRegionId && doSelectSubRegionRef.current) {
        doSelectSubRegionRef.current(activeSubRegionId, false)
      }
      return
    }
    if (activeSubRegionId) { doBackToRegionRef.current(); return }
    if (activeRegionId) { doResetRef.current() }
  }
  const showBackBtn = !!activeRegionId && !loading

  return (
    <div style={{ position:'relative', width:'100%', height:'80vh', minHeight:'600px', background:'#06080c', overflow:'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');`}</style>
      <style>{`
        .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right { display: none !important; }
      `}</style>

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

      <div ref={mapContainerRef} style={{ width:'100%', height:'100%' }} />

      {/* ── Cinematic flight dim overlay — fades screen during region fly ── */}
      {flightDimOverlay !== 'hidden' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 19,
            pointerEvents: 'none',
            background: 'rgba(0,0,0,0.32)',
            opacity: flightDimOverlay === 'dimming' ? 1 : 0,
            transition: flightDimOverlay === 'dimming'
              ? 'opacity 400ms ease'
              : 'opacity 400ms ease',
          }}
        />
      )}

      <FlyingOverlay flying={flyingTo} />

      {/* ── Expedition Mode Banner — appears only while trek is live ─ */}
      {liveTrekAlt !== null && (
        <div style={{
          position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 22, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(6,8,12,0.88)', border: '1px solid rgba(232,201,122,0.3)',
          borderRadius: '8px', padding: '8px 18px', backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(232,201,122,0.08)',
          animation: 'expBannerIn 0.4s ease',
        }}>
          <style>{`@keyframes expBannerIn { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4ab8a0',
            boxShadow:'0 0 8px #4ab8a0', animation:'expDot 1.2s ease-in-out infinite' }} />
          <style>{`@keyframes expDot { 0%,100%{opacity:1}50%{opacity:0.3} }`}</style>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'9px', letterSpacing:'0.22em',
            color:'rgba(232,201,122,0.85)', textTransform:'uppercase' }}>Expedition Mode · Patalsu Peak</span>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'9px',
            color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em' }}>Solang → 4261m</span>
        </div>
      )}

      <RegionPanel />

      {!loading && !mapActive && (
        <div onClick={activateMap} style={{ position:'absolute', inset:0, zIndex:15, cursor:'pointer', display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:'64px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(6,8,12,.9)', border:'1px solid rgba(232,201,122,.45)', borderRadius:'10px', padding:'11px 22px', backdropFilter:'blur(16px)', animation:'phint 2s ease-in-out infinite' }}>
            <span style={{ fontSize:'15px' }}>🖱️</span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'10px', letterSpacing:'0.18em', color:'#e8c97a', textTransform:'uppercase' }}>Click to explore the atlas</span>
          </div>
          <style>{`@keyframes phint{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.7;transform:translateY(-5px)}}`}</style>
        </div>
      )}

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
          {(liveTrekAlt !== null || trekStats !== null) && activeSubRegion
            ? activeSubRegion.name
            : (activeSubRegionId ? activeRegion?.name : 'All Regions')}
        </button>
      )}

      {activeRegion && (
        <div style={{ position:'absolute', top:'58px', left:'20px', zIndex:18, display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'rgba(255,255,255,.2)', textTransform:'uppercase' }}>India</span>
          <span style={{ color:'rgba(255,255,255,.15)', fontSize:'10px' }}>›</span>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color: activeSubRegion ? 'rgba(232,201,122,.5)' : '#e8c97a', textTransform:'uppercase' }}>{activeRegion.name}</span>
          {activeSubRegion && (
            <>
              <span style={{ color:'rgba(255,255,255,.15)', fontSize:'10px' }}>›</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', color:'#e8c97a', textTransform:'uppercase' }}>{activeSubRegion.name}</span>
            </>
          )}
        </div>
      )}

      {/* ── Live Altitude HUD — appears while trail is being drawn ── */}
      {liveTrekAlt !== null && (
        <div style={{
          position: 'absolute', top: '50%', right: '24px', transform: 'translateY(-50%)',
          zIndex: 22, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          animation: 'altHudIn 0.5s ease',
        }}>
          <style>{`
            @keyframes altHudIn { from { opacity:0; transform:translateY(calc(-50% + 10px)); } to { opacity:1; transform:translateY(-50%); } }
            @keyframes altDigitFlip { from { opacity:0.4; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
          `}</style>

          {/* Vertical gradient bar */}
          <div style={{ position:'relative', width:'3px', height:'140px', borderRadius:'2px',
            background:'linear-gradient(to top, #4ab8a0, #e8a030, #e8c97a)' }}>
            {/* moving needle */}
            <div style={{
              position:'absolute', left:'-5px',
              top: `${100 - ((liveTrekAlt - 2468) / (4261 - 2468)) * 100}%`,
              width:'13px', height:'2px',
              background:'#fff', borderRadius:'1px',
              boxShadow:'0 0 8px rgba(255,255,255,0.8)',
              transition:'top 0.3s ease',
            }} />
          </div>

          {/* Altitude number */}
          <div style={{
            background:'rgba(6,8,12,0.92)', border:'1px solid rgba(232,201,122,0.35)',
            borderRadius:'8px', padding:'10px 14px', backdropFilter:'blur(16px)',
            textAlign:'center', minWidth:'90px',
            boxShadow:'0 0 24px rgba(232,201,122,0.15)',
          }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.2em',
              color:'rgba(232,201,122,0.5)', textTransform:'uppercase', marginBottom:'6px' }}>Altitude</div>
            <div key={liveTrekAlt} style={{ fontFamily:"'Space Mono',monospace", fontSize:'22px',
              fontWeight:700, color:'#e8c97a', lineHeight:1, letterSpacing:'-0.01em',
              animation:'altDigitFlip 0.15s ease' }}>
              {liveTrekAlt.toLocaleString()}
            </div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px',
              color:'rgba(232,201,122,0.4)', letterSpacing:'0.15em', marginTop:'4px' }}>metres</div>
          </div>

          {/* Colour legend */}
          <div style={{ background:'rgba(6,8,12,0.85)', border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:'6px', padding:'8px 10px', backdropFilter:'blur(10px)', width:'90px' }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'7px', letterSpacing:'0.15em',
              color:'rgba(255,255,255,0.2)', textTransform:'uppercase', marginBottom:'6px' }}>Elevation</div>
            {[
              { color:'#4ab8a0', label:'Valley  2,468m' },
              { color:'#e8a030', label:'Treeline 3,500m' },
              { color:'#e8c97a', label:'Summit  4,261m' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                <div style={{ width:'8px', height:'2px', borderRadius:'1px', background:color, flexShrink:0 }} />
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'6.5px',
                  color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trek Stats card — appears after trail fully drawn ─────── */}
      {trekStats && (
        <div style={{
          position: 'absolute', bottom: '118px', left: '20px', zIndex: 18,
          background: 'rgba(6,8,12,0.92)', border: '1px solid rgba(232,201,122,0.25)',
          borderRadius: '12px', padding: '14px 18px', backdropFilter: 'blur(18px)',
          animation: 'trekStatsIn 0.5s ease forwards',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(232,201,122,0.1)',
        }}>
          <style>{`@keyframes trekStatsIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Gradient colour bar at top */}
          <div style={{ height:'2px', borderRadius:'1px', marginBottom:'12px',
            background:'linear-gradient(to right, #4ab8a0, #e8a030, #e8c97a)' }} />

          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'8px', letterSpacing:'0.22em',
            color:'rgba(232,201,122,0.5)', textTransform:'uppercase', marginBottom:'10px' }}>⛰️ Patalsu Peak — Completed</div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'7.5px', letterSpacing:'0.12em',
                color:'rgba(232,201,122,0.4)', textTransform:'uppercase' }}>Distance</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'15px',
                color:'#e8c97a', fontWeight:700 }}>{trekStats.distanceKm} km</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'7.5px', letterSpacing:'0.12em',
                color:'rgba(232,201,122,0.4)', textTransform:'uppercase' }}>Gain</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'15px',
                color:'#4ab8a0', fontWeight:700 }}>+1,793m</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'7.5px', letterSpacing:'0.12em',
                color:'rgba(232,201,122,0.4)', textTransform:'uppercase' }}>Summit</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'15px',
                color:'#e8c97a', fontWeight:700 }}>4,261m</span>
            </div>
          </div>
        </div>
      )}

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

      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,8,12,0.8) 85%, #06080c 100%)', zIndex:3 }} />

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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 1V6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 1V6H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15V10H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 15V10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 5V1H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 1H15V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 11V15H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11V15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {mapActive && !activeRegion && markerVisibilityState === 'regions' && (
        <div style={{ position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)', zIndex:10, fontFamily:"'Space Mono',monospace", fontSize:'9px', letterSpacing:'0.15em', color:'rgba(255,255,255,.2)', textTransform:'uppercase', whiteSpace:'nowrap', pointerEvents:'none' }}>
          Click a region to begin exploring
        </div>
      )}
    </div>
  )
}
