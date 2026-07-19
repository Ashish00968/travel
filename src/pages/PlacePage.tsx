import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMemo, useCallback, useEffect } from 'react'
import { HIMALAYA_REGIONS } from '../data/himalaya'

import TrekLayout from './layouts/TrekLayout'
import RoadLayout from './layouts/RoadLayout'
import ScenicLayout from './layouts/ScenicLayout'

export default function PlacePage() {
  const { regionId, placeId } = useParams<{ regionId: string; placeId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const navFrom = (location.state as { from?: 'map' | 'grid' } | null)?.from

  /* ── Data ────────────────────────────────────────────────────────── */
  const region = useMemo(() => HIMALAYA_REGIONS.find((r) => r.id === regionId), [regionId])
  const { place, subRegionName } = useMemo(() => {
    if (!region) return { place: null, subRegionName: '' }
    for (const sub of region.subregions) {
      const p = sub.places.find((sp) => sp.id === placeId)
      if (p) return { place: p, subRegionName: sub.name }
    }
    return { place: null, subRegionName: '' }
  }, [region, placeId])

  /* ── SEO ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (place && region) {
      document.title = `${place.name} — ${region.name} | Pahadi Trails`
      document.querySelector('meta[name="description"]')?.setAttribute('content', place.desc.slice(0, 155))
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${place.name} — Pahadi Trails`)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content',
        place.experience ? place.experience.split('.')[0] + '.' : place.desc.slice(0, 120))
      if (place.image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', place.image)
    }
    return () => {
      document.title = 'Pahadi Trails — Himalayan Travel Atlas'
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Pahadi Trails — Travel Journal')
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Solo documenting the Himalayas since 2021.')
    }

  }, [place, region])

  const handleBack = useCallback(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (navFrom === 'grid') {
      navigate('/', { state: { from: 'grid' } })
    } else {
      navigate('/', { state: { from: 'map', returnedFromPlace: place?.id } })
    }
  }, [navigate, navFrom, place?.id])

  /* ── Guard ───────────────────────────────────────────────────────── */
  if (!region || !place) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#06080c', color:'#7a7570', fontFamily:"'Space Mono',monospace" }}>
        Place not found.
      </div>
    )
  }

  const props = { place, region, subRegionName, onBack: handleBack, navFrom }

  switch (place.type) {
    case 'road':
      return <RoadLayout {...props} />
    case 'scenic':
      return <ScenicLayout {...props} />
    case 'trek':
    case 'adventure':
    case 'lake':
    case 'spiritual':
    default:
      // Fallback to TrekLayout for undefined or unimplemented types for now
      return <TrekLayout {...props} />
  }
}
