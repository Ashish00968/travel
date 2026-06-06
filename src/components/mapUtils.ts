import {
  type HimalayaRegion,
  type HimalayaSubRegion,
  type HimalayaPlace,
  TYPE_COLOR,
} from '../data/himalaya'

/* ── Haversine distance ─────────────────────────────────────────── */
export function haversineDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371000
  const dLat = (p2.lat - p1.lat) * Math.PI / 180
  const dLon = (p2.lng - p1.lng) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function calcTrekDistance(path: Array<{ lat: number; lng: number }>): number {
  let total = 0
  for (let i = 0; i < path.length - 1; i++) total += haversineDistance(path[i], path[i + 1])
  return total / 1000
}

/* ── Fly-to helper wrapping Mapbox flyTo as a promise ───────────── */
export function flyToCamera(
  map: mapboxgl.Map,
  opts: { lat: number; lng: number; zoom: number; pitch: number; bearing: number; duration?: number }
): Promise<void> {
  return new Promise(resolve => {
    const onEnd = () => { resolve() }
    map.once('moveend', onEnd)
    map.easeTo({
      center: [opts.lng, opts.lat],
      zoom: opts.zoom,
      pitch: opts.pitch,
      bearing: opts.bearing,
      duration: opts.duration ?? 2000,
      essential: true,
      easing: t => t * (2 - t) // simple ease-out
    })
  })
}

/* ── Level 0 — state markers (gold triangle + emoji) ────────────── */
export function buildStateMarkerEl(region: HimalayaRegion, idx: number): HTMLElement {
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

/* ── Level 1 — sub-region hub markers ───────────────────────────── */
export function buildSubRegionMarkerEl(sr: HimalayaSubRegion): HTMLElement {
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

/* ── Level 2 — place markers ────────────────────────────────────── */
export function buildPlaceMarkerEl(place: HimalayaPlace): HTMLElement {
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

/* ── Summit pulsing marker element ──────────────────────────────── */
export function buildSummitMarkerEl(): HTMLElement {
  const el = document.createElement('div')
  el.innerHTML = `
    <style>
      @keyframes summitPulse{0%{transform:scale(1);opacity:0.9}50%{transform:scale(2);opacity:0.2}100%{transform:scale(1);opacity:0.9}}
    </style>
    <div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(232,201,122,0.3);animation:summitPulse 1.5s ease-in-out infinite;"></div>
      <div style="position:absolute;top:8px;left:8px;width:8px;height:8px;border-radius:50%;background:#e8c97a;box-shadow:0 0 12px rgba(232,201,122,0.8);"></div>
    </div>`
  return el
}
