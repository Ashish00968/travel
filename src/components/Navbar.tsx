import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Map',      href: '#map-section' },
  { label: 'Regions',  href: '#regions' },
]

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false)
  const [scrollPercent,  setScrollPercent]  = useState(0)
  const [activeSection,  setActiveSection]  = useState('')

  /* ── Scroll: scrolled flag + progress bar ───────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y    = window.scrollY
      const max  = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 80)
      setScrollPercent(max > 0 ? (y / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section via IntersectionObserver ─────────────────── */
  useEffect(() => {
    const ids = ['about', 'map-section', 'regions']
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          zIndex: 9999,
          background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
          width: `${scrollPercent}%`,
          transition: 'width 0.1s linear',
          borderRadius: 0,
        }}
      />

      {/* Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '64px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(24px,4vw,48px)',
          background: scrolled ? 'rgba(6,8,12,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Left — Logo */}
        <a
          href="/"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            color: '#e8c97a',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          ⛰ Peaks &amp; Paths
        </a>

        {/* Center — Nav links (hidden on mobile) */}
        <nav className="navbar-links" style={{ display: 'flex', gap: '32px' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const id       = href.replace('#', '')
            const isActive = activeSection === id
            return (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: isActive ? '#e8c97a' : '#7a7570',
                  textDecoration: 'none',
                  borderBottom: isActive ? '1px solid #e8c97a' : '1px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {label}
              </a>
            )
          })}
        </nav>
        <style>{`@media(max-width:640px){.navbar-links{display:none!important;}}`}</style>

        {/* Right — YouTube CTA */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: '#06080c',
            background: '#e8c97a',
            padding: '8px 18px',
            borderRadius: '4px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          ▶ YouTube
        </a>
      </header>
    </>
  )
}
