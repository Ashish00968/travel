import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import 'lite-youtube-embed'
import { HIMALAYA_REGIONS, type HimalayaVideo } from '../data/himalaya'
import { useMapStore } from '../store/mapStore'

// Types defined in custom-elements.d.ts

/* ═══════════════════════════════════════════════════════════════════
 * PlacePage — cinematic full-screen detail view for a sub-place
 * ═══════════════════════════════════════════════════════════════════ */

export default function PlacePage() {
  const { regionId, placeId } = useParams<{
    regionId: string
    placeId: string
  }>()
  const navigate = useNavigate()
  const openRegionPanel = useMapStore((s) => s.openRegionPanel)

  /* ── Resolve data ────────────────────────────────────────────── */
  const region = useMemo(
    () => HIMALAYA_REGIONS.find((r) => r.id === regionId),
    [regionId],
  )
  const place = useMemo(() => {
    if (!region) return null
    for (const sub of region.subregions) {
      const p = sub.places.find(sp => sp.id === placeId)
      if (p) return p
    }
    return null
  }, [region, placeId])

  /* ── Video modal state ───────────────────────────────────────── */
  const [activeVideo, setActiveVideo] = useState<HimalayaVideo | null>(null)

  const closeModal = useCallback(() => setActiveVideo(null), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  /* ── Back handler ────────────────────────────────────────────── */
  const handleBack = useCallback(() => {
    // Check where they came from
    const from = (window.history.state?.usr as any)?.from as 'map' | 'grid' | undefined
    
    if (from === 'grid') {
      navigate('/#regions')
    } else if (from === 'map') {
      navigate('/')
      if (regionId) openRegionPanel(regionId)
    } else {
      // Fallback
      navigate(-1)
    }
  }, [navigate, regionId, openRegionPanel])

  /* ── Page-level SEO ──────────────────────────────────────────── */
  useEffect(() => {
    if (place && region) {
      document.title = `${place.name} — ${region.name} | Peaks & Paths`
      const meta = document.querySelector('meta[name="description"]')
      if (meta) {
        meta.setAttribute('content', place.desc.slice(0, 155))
      }
    }
    return () => {
      document.title = 'Peaks & Paths — Himalayan Mountain Travel Atlas'
    }
  }, [place, region])

  /* ── 404 guard ───────────────────────────────────────────────── */
  if (!region || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-muted font-sans">
        <p className="text-lg">Place not found.</p>
      </div>
    )
  }

  /* ── Experience paragraphs ───────────────────────────────────── */
  const experienceParagraphs = (place.experience || '')
    .split(/\n\n|\. (?=[A-Z])/)
    .filter(Boolean)
    .reduce<string[]>((acc, sentence, i) => {
      // Group into ~2-3 sentence paragraphs
      const idx = Math.floor(i / 3)
      acc[idx] = (acc[idx] ?? '') + (acc[idx] ? '. ' : '') + sentence.trim()
      return acc
    }, [])
    .map((p) => (p.endsWith('.') ? p : p + '.'))

  /* ═══════════════════════════════════════════════════════════════
   * Render
   * ═══════════════════════════════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-background"
    >
      {/* ── Fixed back button ──────────────────────────────────── */}
      <button
        onClick={handleBack}
        className="fixed top-6 left-6 z-50
                   flex items-center gap-2
                   px-4 py-2.5 rounded-xl
                   bg-surface/70 backdrop-blur-md
                   text-text text-sm font-sans font-medium
                   border border-white/10
                   shadow-lg shadow-black/30
                   cursor-pointer
                   transition-all duration-200 ease-out
                   hover:bg-surface hover:border-accent/40
                   hover:shadow-accent/10
                   active:scale-95"
      >
        <span className="text-accent">←</span>
        Back to map
      </button>

      {/* ── Hero section ───────────────────────────────────────── */}
      <section className="relative w-full" style={{ height: '60vh' }}>
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-background/60 to-background" />

        {/* Centred giant emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="select-none opacity-20"
            style={{ fontSize: 'clamp(120px, 22vw, 260px)' }}
          >
            {place.emoji}
          </span>
        </div>

        {/* Subtle radial glow behind emoji */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,201,122,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Bottom-left place info */}
        <div className="absolute bottom-10 left-8 md:left-14 z-10 max-w-xl">
          <span
            className="inline-block font-mono text-xs tracking-[0.25em] uppercase text-accent mb-3"
          >
            {region.emoji} {region.name}, {region.state}
          </span>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-[1.05] mb-4">
            {place.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-text-muted text-sm font-sans">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <path d="M12 2 L2 22 h20 Z" />
              </svg>
              {place.elevation}
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {place.season}
            </span>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* ── Left column (main) ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {region.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full
                             bg-white/[0.04] border border-white/[0.08]
                             text-text-muted text-xs font-sans tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Videos section ───────────────────────────────── */}
            {place.videos && place.videos.length > 0 && (
              <section className="mb-14">
                <h2 className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-6">
                  Videos from here
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {place.videos.map((video, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVideo(video)}
                      className="group text-left rounded-xl overflow-hidden
                                 bg-surface/60 border border-white/[0.06]
                                 transition-all duration-300 ease-out
                                 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5
                                 hover:-translate-y-0.5 cursor-pointer"
                    >
                      {/* Thumbnail area */}
                      <div className="relative aspect-video bg-surface overflow-hidden">
                        {video.thumbUrl ? (
                          <img
                            src={video.thumbUrl}
                            alt={video.title}
                            className="w-full h-full object-cover
                                       transition-transform duration-500
                                       group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface">
                            <span className="text-4xl opacity-40">
                              {place.emoji}
                            </span>
                          </div>
                        )}

                        {/* Play overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center
                                     bg-black/30 opacity-0 group-hover:opacity-100
                                     transition-opacity duration-300"
                        >
                          <div
                            className="w-14 h-14 rounded-full bg-accent/90 backdrop-blur
                                       flex items-center justify-center
                                       shadow-lg shadow-accent/30
                                       transition-transform duration-300
                                       group-hover:scale-110"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="#080c10"
                            >
                              <polygon points="6,3 20,12 6,21" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Text */}
                      <div className="p-4">
                        <p className="text-sm font-sans font-medium text-text leading-snug mb-1.5 line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-xs text-text-muted font-sans">
                          {video.views} views
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Experience section ──────────────────────────── */}
            {experienceParagraphs.length > 0 && (
              <section>
                <h2 className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-6">
                  My experience
                </h2>

                <div className="space-y-6">
                  {experienceParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-text/90 font-sans text-base leading-[1.85] tracking-wide"
                    >
                      {i === 0 ? (
                        <>
                          {/* Drop cap for first paragraph */}
                          <span
                            className="float-left font-serif text-5xl font-bold text-accent
                                       leading-[0.8] mr-3 mt-1.5"
                          >
                            {p.charAt(0)}
                          </span>
                          {p.slice(1)}
                        </>
                      ) : (
                        p
                      )}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right column (sidebar) ─────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* Best season badge */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-accent/10 border border-accent/20"
            >
              <span className="text-lg">☀️</span>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent/70 mb-0.5">
                  Best Season
                </p>
                <p className="text-sm font-sans font-medium text-accent">
                  {place.season}
                </p>
              </div>
            </div>

            {/* Stats card */}
            {place.stats && place.stats.length > 0 && (
              <div className="rounded-xl bg-surface/60 border border-white/[0.06] p-5">
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
                  Quick Stats
                </h3>
                <dl className="space-y-3">
                  {place.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-xs text-text-muted font-sans">
                        {stat.label}
                      </dt>
                      <dd className="text-sm font-sans font-medium text-text">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Tips card */}
            {place.tips && place.tips.length > 0 && (
              <div
                className="rounded-xl bg-surface/60 border border-white/[0.06] p-5
                           border-l-2 border-l-[#4ab8a0]"
              >
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
                  Travel Tips
                </h3>
                <ul className="space-y-3">
                  {place.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="text-[#4ab8a0] shrink-0 mt-0.5">→</span>
                      <span className="text-text/80 font-sans">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description card */}
            <div className="rounded-xl bg-surface/40 border border-white/[0.04] p-5">
              <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                About this place
              </h3>
              <p className="text-sm text-text/70 font-sans leading-relaxed">
                {place.desc}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Video modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 z-10
                           flex items-center gap-2
                           text-text-muted text-sm font-sans
                           cursor-pointer transition-colors duration-200
                           hover:text-text"
              >
                Close
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-xs">
                  ESC
                </span>
              </button>

              {/* 16:9 iframe wrapper */}
              <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                   style={{ paddingBottom: '56.25%' }}>
                <lite-youtube
                  videoid={activeVideo.youtubeId}
                  playlabel={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Video title below */}
              <p className="mt-4 text-sm text-text-muted font-sans text-center">
                {activeVideo.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
