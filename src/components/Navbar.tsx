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
        @media(max-width:640px){
          .navbar-links{display:none!important;}
          .nav-cta{padding: 6px 12px !important;}
          .nav-cta span{display: none;}
        }
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
                onClick={(e) => {
                  if (href.startsWith('#')) {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
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
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(232,201,122,0.1)',
            border: '1px solid rgba(232,201,122,0.3)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
            color: '#e8c97a', textDecoration: 'none',
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
            <path d="M13.7 1.5C13.5 0.9 13.1 0.5 12.5 0.3C11.4 0 7 0 7 0C7 0 2.6 0 1.5 0.3C0.9 0.5 0.5 0.9 0.3 1.5C0 2.6 0 5 0 5C0 5 0 7.4 0.3 8.5C0.5 9.1 0.9 9.5 1.5 9.7C2.6 10 7 10 7 10C7 10 11.4 10 12.5 9.7C13.1 9.5 13.5 9.1 13.7 8.5C14 7.4 14 5 14 5C14 5 14 2.6 13.7 1.5ZM5.5 7.1V2.9L9.2 5L5.5 7.1Z" />
          </svg>
          <span>Watch Film</span>
        </motion.a>
      </motion.header>
    </>
  )
}
