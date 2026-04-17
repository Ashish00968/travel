import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

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

function StatCard({ stat }: { stat: typeof STATS[number] }) {
  const ref                    = useRef<HTMLDivElement>(null)
  const { count, setStarted }  = useCountUp(stat.value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [setStarted])

  const display = stat.display.endsWith('+') ? `${count}+` : `${count}`

  return (
    <div
      ref={ref}
      style={{
        background: '#0d1117',
        border: '1px solid rgba(232,201,122,0.15)',
        borderRadius: '14px',
        padding: '24px 28px',
      }}
    >
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '54px', color: '#e8c97a', lineHeight: 1 }}>
        {display}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#3d3b38', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '6px' }}>
        {stat.label}
      </div>
    </div>
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
        border: `1px solid ${hovered ? 'rgba(232,201,122,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '5px',
        fontFamily: "'DM Sans',sans-serif", fontSize: '13px',
        color: hovered ? '#e8c97a' : '#7a7570',
        textDecoration: 'none',
        transition: 'border-color 0.2s, color 0.2s',
      }}
    >
      <span>{icon}</span>{label}
    </a>
  )
}

export default function About() {
  const ref     = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      style={{ padding: 'clamp(64px,10vw,120px) clamp(24px,5vw,48px)', background: '#06080c' }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
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
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-40px', left: '-20px',
                fontFamily: "'Playfair Display',serif", fontSize: 'clamp(120px,20vw,260px)',
                color: 'rgba(232,201,122,0.04)', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              "
            </span>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
              fontSize: 'clamp(18px,2.5vw,26px)', lineHeight: 1.55,
              color: '#edeae2', maxWidth: '560px', margin: 0, position: 'relative',
            }}>
              I am not a mountaineer. I am someone who looked at a map,
              pointed at a blank space between Tibet and India, and drove there.
            </p>
          </div>

          {[
            `What started as a weekend drive to Manali turned into years of solo expeditions across Spiti, Ladakh, Uttarakhand and beyond. I carry a camera, a tent, and an unhealthy obsession with high-altitude roads.`,
            `I build websites by day and disappear into mountains whenever I can. This site is both — a travel journal and a web project. Every marker on the map is a place I have actually stood.`,
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, marginBottom: '16px' }}>
              {para}
            </p>
          ))}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <SocialPill key={label} icon={icon} label={label} href={href} />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          #about > section > div,
          #about .motion-div-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
