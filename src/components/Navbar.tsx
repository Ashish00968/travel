import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home',           href: '#home' },
  { label: 'Map',            href: '#map-section' },
  { label: "Where I've Been", href: '#regions' },
  { label: 'About',          href: '#about' },
]

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen,      setMenuOpen]      = useState(false)

  /* ── Scroll: scrolled flag + progress bar ───────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 80)
      setScrollPercent(max > 0 ? (y / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section via IntersectionObserver ─────────────────── */
  useEffect(() => {
    const ids = ['home', 'map-section', 'regions', 'about']
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

  /* ── Lock body scroll when menu open ────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = useCallback((href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  return (
    <>
      {/* ── Scroll progress bar ─────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          zIndex: 9999,
          background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
          width: `${scrollPercent}%`,
          transition: 'none',
          borderRadius: 0,
        }}
      />

      {/* ── Mobile backdrop ─────────────────────────────────────── */}
      <div
        className={`mobile-menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile slide-in panel ───────────────────────────────── */}
      <nav
        className={`mobile-menu-panel ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: 'rgba(232,201,122,0.4)',
          textTransform: 'uppercase',
          marginBottom: '32px',
        }}>
          Navigate
        </div>

        {NAV_LINKS.map(({ label, href }, i) => {
          const id = href.replace('#', '')
          const isActive = activeSection === id
          return (
            <motion.a
              key={label}
              href={href}
              onClick={e => { e.preventDefault(); scrollTo(href) }}
              className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={menuOpen
                ? { opacity: 1, x: 0, transition: { delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
                : { opacity: 0, x: 20 }
              }
            >
              {label}
            </motion.a>
          )
        })}

        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#e8c97a',
              textDecoration: 'none',
              textTransform: 'uppercase',
              padding: '14px 20px',
              background: 'rgba(232,201,122,0.06)',
              border: '1px solid rgba(232,201,122,0.2)',
              borderRadius: '6px',
            }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
              <path d="M13.7 1.5C13.5 0.9 13.1 0.5 12.5 0.3C11.4 0 7 0 7 0C7 0 2.6 0 1.5 0.3C0.9 0.5 0.5 0.9 0.3 1.5C0 2.6 0 5 0 5C0 5 0 7.4 0.3 8.5C0.5 9.1 0.9 9.5 1.5 9.7C2.6 10 7 10 7 10C7 10 11.4 10 12.5 9.7C13.1 9.5 13.5 9.1 13.7 8.5C14 7.4 14 5 14 5C14 5 14 2.6 13.7 1.5ZM5.5 7.1V2.9L9.2 5L5.5 7.1Z" />
            </svg>
            Watch Film
          </a>
          <div style={{
            marginTop: '24px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.12)',
            textTransform: 'uppercase',
          }}>
            Himalayan Travel Journal
          </div>
        </div>
      </nav>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
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
          padding: '0 clamp(20px,4vw,48px)',
          background: scrolled ? 'rgba(5,7,11,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(232,201,122,0.06)' : '1px solid transparent',
          transition: 'background 350ms cubic-bezier(0.23, 1, 0.32, 1), backdrop-filter 350ms, border-bottom 350ms',
          boxSizing: 'border-box',
        }}
      >
        {/* Left — Logo */}
        <motion.a
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <motion.svg
            width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true"
            whileHover={{ rotate: -6, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            style={{ display: 'block' }}
          >
            <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16Z" fill="rgba(232,201,122,0.18)" />
            <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16" stroke="#e8c97a" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
          </motion.svg>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-accent)',
            letterSpacing: '-0.01em',
          }}>
            Peaks &amp; Paths
          </span>
        </motion.a>

        {/* Center — Nav links (hidden on mobile) */}
        <nav className="navbar-links" style={{ display: 'flex', gap: '32px' }} aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }, i) => {
            const id       = href.replace('#', '')
            const isActive = activeSection === id
            return (
              <motion.a
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                href={href}
                onClick={(e) => {
                  if (href.startsWith('#')) {
                    e.preventDefault()
                    scrollTo(href)
                  }
                }}
                className="nav-link"
                data-active={isActive ? "true" : "false"}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {label}
              </motion.a>
            )
          })}
        </nav>

        {/* Right — CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.a
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-border-gold)',
              border: '1px solid var(--color-border-gold)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              color: 'var(--color-accent)', textDecoration: 'none',
              transition: 'background 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms, transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
              <path d="M13.7 1.5C13.5 0.9 13.1 0.5 12.5 0.3C11.4 0 7 0 7 0C7 0 2.6 0 1.5 0.3C0.9 0.5 0.5 0.9 0.3 1.5C0 2.6 0 5 0 5C0 5 0 7.4 0.3 8.5C0.5 9.1 0.9 9.5 1.5 9.7C2.6 10 7 10 7 10C7 10 11.4 10 12.5 9.7C13.1 9.5 13.5 9.1 13.7 8.5C14 7.4 14 5 14 5C14 5 14 2.6 13.7 1.5ZM5.5 7.1V2.9L9.2 5L5.5 7.1Z" />
            </svg>
            <span>Watch Film</span>
          </motion.a>

          {/* Hamburger — visible on mobile only */}
          <button
            className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </motion.header>
    </>
  )
}
