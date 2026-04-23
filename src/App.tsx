import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useThemeStore } from './store/themeStore'

const LazyHomePage = lazy(() => import('./pages/HomePage'))
const LazyPlacePage = lazy(() => import('./pages/PlacePage'))
const LazyCursor = lazy(() => import('./components/Cursor'))

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
      {!('ontouchstart' in window) && (
        <Suspense fallback={null}>
          <LazyCursor />
        </Suspense>
      )}

      <Suspense fallback={
        <div style={{ backgroundColor: '#06080c' }} className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12L36 36H12L24 12Z" stroke="#e8c97a" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <div style={{ color: 'rgba(232,201,122,0.4)', letterSpacing: '0.2em', marginTop: '24px' }} className="font-mono text-[10px]">
            LOADING_
          </div>
          <div className="w-32 h-[2px] bg-white/10 mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-[#e8c97a] w-0 animate-[loadingBar_2s_ease-out_forwards]" style={{ maxWidth: '80%' }}></div>
          </div>
        </div>
      }>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LazyHomePage />} />
            <Route path="/place/:regionId/:placeId" element={<LazyPlacePage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}
