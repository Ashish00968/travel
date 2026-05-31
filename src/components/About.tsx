import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { useCountUp } from '../hooks/useCountUp'
import { AnimatedWord } from './AnimatedWord'

// ── Count-up ranges ─────────────────────────────────────────────
// "2021" starts from 2015 so the range is short and snappy.
const STATS = [
  { from: 0,    to: 18,   display: '18+', label: 'Peaks explored' },
  { from: 0,    to: 6,    display: '6',   label: 'Himalayan regions' },
  { from: 2015, to: 2021, display: '2021',label: 'Journey began' },
]

const SOCIALS = [
  { icon: '▶',  label: 'YouTube',   href: 'https://youtube.com' },
  { icon: '📷', label: 'Instagram', href: 'https://instagram.com' },
  { icon: '🐦', label: 'Twitter',   href: 'https://twitter.com' },
]

// ── Stagger container + card variants ───────────────────────────
const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

// ── StatCard: Framer Motion entrance + rAF count-up ─────────────
function StatCard({ stat }: { stat: typeof STATS[number] }) {
  const [hovered, setHovered] = useState(false)

  // The ref is attached to the card element — count starts when ≥50% is visible.
  const { count, ref } = useCountUp(stat.from, stat.to, 1500)

  // For "18+" we append the suffix after counting
  const hasSuffix = stat.display.endsWith('+')

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      variants={cardVariants}
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
      {/* Animated number */}
      <div
        style={{
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.3s ease',
          transformOrigin: 'left center',
          fontFamily: "'Space Mono',monospace",
          fontSize: '54px',
          color: '#e8c97a',
          lineHeight: 1,
          // Prevent layout shift while digits change width
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {count}{hasSuffix ? '+' : ''}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: '12px',
          color: '#3d3b38',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginTop: '6px',
        }}
      >
        {stat.label}
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
          transformOrigin: 'left',
          transform: 'scaleX(1)',
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
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
              transition={{ duration: 1.2, ease: 'easeOut' }}
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-40px', left: '-20px',
                fontFamily: "'Playfair Display',serif", fontSize: 'clamp(120px,20vw,260px)',
                color: '#e8c97a', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              &ldquo;
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
          <p
            className="reveal"
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, marginBottom: '16px' }}
          >
            What started as a weekend drive to Manali turned into years of solo expeditions across Spiti, Ladakh, Uttarakhand and beyond. I carry a camera, a tent, and an unhealthy obsession with high-altitude roads.
          </p>

          {/* Paragraph 2 */}
          <p
            className="reveal"
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, marginBottom: '16px' }}
          >
            I build websites by day and disappear into mountains whenever I can. This site is both — a travel journal and a web project. Every marker on the map is a place I have actually stood.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <SocialPill key={label} icon={icon} label={label} href={href} />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: staggered stat cards ──────────────── */}
        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
