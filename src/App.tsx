import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import Cursor from './components/Cursor'
import { useThemeStore } from './store/themeStore'

/* ── Lazy-load PlacePage (visited less often, heavy YouTube embeds) */
const PlacePage = lazy(() => import('./pages/PlacePage'))

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  const location = useLocation()

  /* ── Sync the theme class on <html> ──────────────────────────── */
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  return (
    <>
      {/* Global custom cursor overlaid on everything */}
      <Cursor />

      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted/50">Loading…</span>
          </div>
        </div>
      }>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/place/:regionId/:placeId" element={<PlacePage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}
