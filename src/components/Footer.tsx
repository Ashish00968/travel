import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { AnimatedWord } from './AnimatedWord'

export default function Footer() {
  const year = new Date().getFullYear()
  const { ref, isInView } = useReveal({ margin: '-20px' })

  // Parallax heading
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -50])

  const socials = [
    { label: 'YouTube',   href: 'https://youtube.com/@ashish_0968' },
    { label: 'Instagram', href: 'https://instagram.com/ashish_0968' },
  ]
  
  const heading = "Leave no trace.".split(' ')

  return (
    <footer
      ref={sectionRef}
      className="reveal"
      style={{
        position: 'relative',
        background: '#030507',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '80px 24px 60px',
        overflow: 'hidden'
      }}
    >
      {/* ── Himalayan horizon silhouette ─────────────────────────── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 900 120"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          width: '100%', height: 'auto',
          pointerEvents: 'none', opacity: 0.04,
        }}
      >
        <motion.path
          d="M0,120 L60,60 L110,90 L160,40 L220,80 L270,20 L340,70 L400,10 L460,55 L520,28 L590,72 L650,18 L720,65 L780,30 L840,75 L900,48 L900,120 Z"
          fill="#e8c97a"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        />
        {/* Draw-on silhouette line */}
        <motion.path
          d="M0,120 L60,60 L110,90 L160,40 L220,80 L270,20 L340,70 L400,10 L460,55 L520,28 L590,72 L650,18 L720,65 L780,30 L840,75 L900,48"
          fill="none"
          stroke="#e8c97a"
          strokeWidth="1"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>

      <div
        ref={ref}
        style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Cinematic parallax heading */}
        <motion.div style={{ y: parallaxY }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 6vw, 64px)',
            color: '#e8c97a', margin: '0 0 60px 0', fontWeight: 400,
          }}>
            {heading.map((w, i) => <AnimatedWord key={i} word={w} delay={0.1*i} isInView={isInView} />)}
          </h2>
        </motion.div>

        {/* Bottom bar */}
        <div style={{
          width: '100%',
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-between',
          gap: '24px', flexWrap: 'wrap',
          borderTop: '1px solid rgba(232,201,122,0.08)',
          paddingTop: '32px',
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.svg
              width="18" height="13" viewBox="0 0 22 16" fill="none" aria-hidden="true"
              whileHover={{ rotate: -6, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            >
              <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16Z" fill="rgba(232,201,122,0.16)" />
              <path d="M0 16 L5 6 L9 12 L13 4 L17 10 L22 16" stroke="#e8c97a" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            </motion.svg>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic', fontSize: '15px', fontWeight: 600,
              color: '#e8c97a', letterSpacing: '-0.01em',
            }}>
              Peaks &amp; Paths
            </span>
          </a>

          <div style={{ flex: '1 1 100%', display: 'none' }} className="mobile-break" />

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['About', 'Map', 'Regions'].map((link) => (
              <a
                key={link}
                href={`/#${link.toLowerCase()}`}
                className="footer-link"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', color: '#6a6460', textDecoration: 'none',
                }}
              >
                {link}
              </a>
            ))}
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', color: '#6a6460', textDecoration: 'none',
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright + coords */}
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
              color: 'rgba(106,100,96,0.5)', margin: '0 0 4px',
            }}>
              © {year} Peaks &amp; Paths.
            </p>
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: '8px',
              letterSpacing: '0.14em', color: 'rgba(232,201,122,0.2)',
              margin: 0, textTransform: 'uppercase',
            }}>
              32°N · 77°E · Himalayas
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
