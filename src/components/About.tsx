import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'

const STATS = [
  { value: 18,   display: '18+',  label: 'Peaks explored' },
  { value: 6,    display: '6',    label: 'Himalayan regions' },
  { value: 2021, display: '2021', label: 'Journey began' },
]

const SOCIALS = [
  { icon: '▶',  label: 'YouTube',   href: 'https://youtube.com' },
  { icon: '📷', label: 'Instagram', href: 'https://instagram.com' },
  { icon: '🐦', label: 'Twitter',   href: 'https://twitter.com' },
]

/* ── Animated counter hook ──────────────────────────────────────── */
function useCountUp(target: number, duration = 1500) {
  const [count, setCount]     = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    const tick  = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])

  return { count, setStarted }
}

const AnimatedWord = ({ word, delay, isInView }: { word: string, delay: number, isInView: boolean }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em', verticalAlign: 'top' }}>
    <motion.span
      style={{ display: 'inline-block' }}
      initial={{ y: '110%' }}
      animate={isInView ? { y: '0%' } : { y: '110%' }}
      transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay }}
    >
      {word}
    </motion.span>
  </span>
)

function StatCard({ stat, index, isInView }: { stat: typeof STATS[number], index: number, isInView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const { count, setStarted }  = useCountUp(stat.value)
  
  // Spring scale for the number
  const scale = useSpring(1, { stiffness: 400, damping: 15 })
  useEffect(() => { scale.set(hovered ? 1.04 : 1) }, [hovered, scale])

  useEffect(() => {
    if (isInView) setStarted(true)
  }, [isInView, setStarted])

  const display = stat.display.endsWith('+') ? `${count}+` : `${count}`

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay: 0.1 + index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#0d1117',
        border: `1px solid ${hovered ? 'rgba(232,201,122,0.4)' : 'rgba(232,201,122,0.15)'}`,
        borderRadius: '14px',
        padding: '24px 28px',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease',
      }}
    >
      <motion.div style={{ scale, transformOrigin: 'left center', fontFamily: "'Space Mono',monospace", fontSize: '54px', color: '#e8c97a', lineHeight: 1 }}>
        {display}
      </motion.div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '6px' }}>
        {stat.label}
      </div>
      
      {/* Animated Bottom Border linked to Counter logic equivalent (sliding on hover or load) */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: count / stat.value } : {}}
        transition={{ duration: 0.1, ease: "linear" }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
          transformOrigin: 'left'
        }}
      />
    </motion.div>
  )
}

function SocialPill({ icon, label, href }: { icon: string; label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '9px 18px',
        background: hovered ? 'rgba(232,201,122,0.08)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(232,201,122,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '5px',
        fontFamily: "'DM Sans',sans-serif", fontSize: '13px',
        color: hovered ? '#e8c97a' : '#7a7570',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <motion.span
        animate={{ rotate: hovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ display: 'inline-block' }}
      >
        {icon}
      </motion.span>
      {label}
    </a>
  )
}

export default function About() {
  const { ref, isInView } = useReveal({ margin: '-100px' })

  const quote = "I am not a mountaineer. I am someone who looked at a map, pointed at a blank space between Tibet and India, and drove there.".split(' ')

  return (
    <section
      id="about"
      style={{ padding: 'clamp(64px,10vw,120px) clamp(24px,5vw,48px)', background: '#06080c' }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
          gap: 'clamp(40px,6vw,80px)',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', letterSpacing: '0.2em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '20px' }}>
            My Story
          </div>

          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 0.04 } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-40px', left: '-20px',
                fontFamily: "'Playfair Display',serif", fontSize: 'clamp(120px,20vw,260px)',
                color: '#e8c97a', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              "
            </motion.span>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
              fontSize: 'clamp(18px,2.5vw,26px)', lineHeight: 1.55,
              color: '#edeae2', maxWidth: '560px', margin: 0, position: 'relative',
            }}>
              {quote.map((w, i) => <AnimatedWord key={i} word={w} delay={0.06 * i} isInView={isInView} />)}
            </p>
          </div>

          {/* Paragraph 1 */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, marginBottom: '16px' }}
          >
            What started as a weekend drive to Manali turned into years of solo expeditions across Spiti, Ladakh, Uttarakhand and beyond. I carry a camera, a tent, and an unhealthy obsession with high-altitude roads.
          </motion.p>
          
          {/* Paragraph 2 */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, marginBottom: '16px' }}
          >
            I build websites by day and disappear into mountains whenever I can. This site is both — a travel journal and a web project. Every marker on the map is a place I have actually stood.
          </motion.p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <SocialPill key={label} icon={icon} label={label} href={href} />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
