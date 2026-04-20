import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'

export default function Footer() {
  const year = new Date().getFullYear()
  const { ref, isInView } = useReveal({ margin: '-20px' })

  const socials = [
    { label: 'YouTube',   href: 'https://youtube.com/@ashish_0968' },
    { label: 'Instagram', href: 'https://instagram.com/ashish_0968' },
  ]
  
  const heading = "Leave no trace.".split(' ')

  const AnimatedScaleWord = ({ word, delay }: { word: string, delay: number }) => (
    <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay }}
      >
        {word}
      </motion.span>
    </span>
  )

  return (
    <footer ref={ref} style={{
      position: 'relative',
      background: '#040508',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 24px 60px',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Cinematic Header */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(40px, 6vw, 64px)',
          color: '#e8c97a',
          margin: '0 0 60px 0',
          fontWeight: 400
        }}>
          {heading.map((w, i) => <AnimatedScaleWord key={i} word={w} delay={0.1*i} />)}
        </h2>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(232,201,122,0.1)',
          paddingTop: '32px'
        }}>
          {/* Logo */}
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: '#e8c97a',
          }}>
            ⛰ Peaks &amp; Paths
          </span>

          {/* Spacer on mobile, invisible on desktop */}
          <div style={{ flex: '1 1 100%', display: 'none' }} className="mobile-break" />

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['About', 'Map', 'Regions'].map((link) => (
              <a
                key={link}
                href={`/#${link.toLowerCase()}`}
                className="footer-link"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: '#7a7570',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
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
                  fontSize: '13px',
                  color: '#7a7570',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'rgba(122,117,112,0.6)',
            margin: 0
          }}>
            © {year} Peaks &amp; Paths.
          </p>
        </div>
      </div>
      <style>{`
        .footer-link:hover { color: #e8c97a !important; }
        @media (max-width: 768px) {
          .mobile-break { display: block !important; }
        }
      `}</style>
    </footer>
  )
}
