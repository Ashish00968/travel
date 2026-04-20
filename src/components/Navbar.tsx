import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'


const NAV_LINKS = [
  { label: 'About',          href: '#about' },
  { label: 'Map',            href: '#map-section' },
  { label: "Where I've Been", href: '#regions' },
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
      <style>{`
        .nav-link { 
          position: relative; 
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0; height: 1px;
          background: #e8c97a;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after, .nav-link[data-active="true"]::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        @media(max-width:640px){.navbar-links{display:none!important;}}
      `}</style>
      
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
          transition: 'none',
          borderRadius: 0,
        }}
      />

      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
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
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Left — Logo */}
        <motion.a
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
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
        </motion.a>

        {/* Center — Nav links (hidden on mobile) */}
        <nav className="navbar-links" style={{ display: 'flex', gap: '32px' }}>
          {NAV_LINKS.map(({ label, href }, i) => {
            const id       = href.replace('#', '')
            const isActive = activeSection === id
            return (
              <motion.a
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }}
                href={href}
                className="nav-link"
                data-active={isActive ? "true" : "false"}
                style={{ color: isActive ? '#e8c97a' : '#7a7570' }}
              >
                {label}
              </motion.a>
            )
          })}
        </nav>

        {/* Right — YouTube CTA */}
        <motion.a
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          href="https://youtube.com/@ashish_0968"
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
        </motion.a>
      </motion.header>
    </>
  )
}
