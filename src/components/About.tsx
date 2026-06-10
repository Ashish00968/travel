import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { AnimatedWord } from './AnimatedWord'

const THEMES = [
  {
    tag: 'FILMS',
    title: 'The Films',
    desc: 'Travel videos, road journeys, and cinematic moments from the mountains.',
    cta: 'Watch on YouTube',
    href: 'https://youtube.com',
    target: '_blank',
    bgImage: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&q=80&w=800',
    iconType: 'films'
  },
  {
    tag: 'EXPLORE',
    title: "Where I've Been",
    desc: 'A collection of destinations, routes, and experiences gathered along the way.',
    cta: 'Explore Journeys',
    href: '#regions',
    target: '_self',
    bgImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    iconType: 'explore'
  },
  {
    tag: 'HORIZON',
    title: 'To Explore',
    desc: 'My checklist of upcoming destinations, remote valleys, and trails mapped out for future expeditions.',
    cta: 'View Checklist',
    href: '/horizon',
    target: '_self',
    bgImage: 'https://images.unsplash.com/photo-1469521669194-bafa95b57580?auto=format&fit=crop&q=80&w=800',
    iconType: 'horizon'
  }
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
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
}

// ── CardIcon Component ─────────────────────────────────────────
function CardIcon({ type, hovered, size }: { type: string; hovered: boolean; size: number }) {
  const strokeColor = hovered ? "#e8c97a" : "rgba(232, 201, 122, 0.3)"
  const props = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: strokeColor, strokeWidth: "1.5",
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    style: { transition: 'stroke 350ms cubic-bezier(0.23, 1, 0.32, 1)', flexShrink: 0 as const }
  }

  if (type === 'films') {
    return (
      <svg {...props}>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    )
  }
  if (type === 'explore') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path d="M3 20h18L12 4z" />
      <path d="M12 4l-4 8 4 3 4-3z" />
    </svg>
  )
}

// ── ThematicCard Component ─────────────────────────────────────
function ThematicCard({ theme }: { theme: typeof THEMES[number] }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (theme.href.startsWith('#')) {
      e.preventDefault()
      const el = document.getElementById(theme.href.replace('#', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (theme.href.startsWith('/')) {
      e.preventDefault()
      navigate(theme.href)
    }
  }

  return (
    <motion.a
      href={theme.href}
      target={theme.target}
      rel={theme.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="thematic-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        background: '#0d1117',
        border: `1px solid ${hovered ? 'rgba(232,201,122,0.5)' : 'rgba(232,201,122,0.18)'}`,
        borderRadius: '14px',
        padding: '32px 36px',
        minHeight: '200px',
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow: hovered 
          ? '0 16px 40px rgba(0,0,0,0.3), 0 0 20px rgba(232,201,122,0.08)'
          : '0 4px 12px rgba(0,0,0,0.12)',
        transition: 'border-color 350ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 350ms cubic-bezier(0.23, 1, 0.32, 1), transform 350ms cubic-bezier(0.23, 1, 0.32, 1)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* Background Image — clip-path reveal on hover */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${theme.bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          mixBlendMode: 'luminosity',
          filter: 'grayscale(100%) contrast(1.1)',
          opacity: hovered ? 0.18 : 0.06,
          clipPath: hovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 500ms cubic-bezier(0.23, 1, 0.32, 1), opacity 400ms cubic-bezier(0.23, 1, 0.32, 1)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,17,23,0.8), rgba(13,17,23,0.95))', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Tag + Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: '10px',
            color: hovered ? '#e8c97a' : '#4a4844',
            textTransform: 'uppercase', letterSpacing: '0.22em',
            transition: 'color 300ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}>
            {theme.tag}
          </div>
          <CardIcon type={theme.iconType} hovered={hovered} size={20} />
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '26px', fontWeight: 600, fontStyle: 'italic',
          color: '#edeae2', lineHeight: 1.2, margin: '0 0 12px 0',
        }}>
          {theme.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
          color: hovered ? '#d6d3ce' : '#7a7570', lineHeight: 1.7, margin: 0,
          transition: 'color 300ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}>
          {theme.desc}
        </p>
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: "'Space Mono', monospace", fontSize: '10.5px',
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: '#e8c97a', marginTop: '28px', position: 'relative', zIndex: 2,
      }}>
        {theme.cta}
        <motion.span
          animate={{ x: hovered ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ display: 'inline-block' }}
        >
          →
        </motion.span>
      </div>

      {/* Bottom accent bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
        transformOrigin: 'left',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)',
        zIndex: 3,
      }} />
    </motion.a>
  )
}

function SocialPill({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-pill"
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '9px 20px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        fontFamily: "'DM Sans',sans-serif", fontSize: '13px',
        color: '#7a7570', textDecoration: 'none',
        transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 200ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      <span style={{ display: 'inline-block' }}>{icon}</span>
      {label}
    </a>
  )
}

export default function About() {
  const { ref, isInView } = useReveal({ margin: '-100px' })

  const quote = "The mountains do not care for our speed. They simply stand—inviting us to look up, follow the road, and listen.".split(' ')

  return (
    <section id="about" style={{ padding: 'clamp(80px,12vw,160px) clamp(24px,5vw,48px)', background: '#06080c' }}>
      <style>{`
        .social-pill:hover {
          color: #e8c97a !important;
          border-color: rgba(232,201,122,0.4) !important;
          background: rgba(232,201,122,0.04) !important;
          transform: translateY(-2px) !important;
        }
        .social-pill:active {
          transform: scale(0.97) !important;
        }
        @media (max-width: 968px) {
          .thematic-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div
        ref={ref}
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '64px' }}
      >
        {/* ── EDITORIAL NARRATIVE ─────────────────────────────── */}
        <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', letterSpacing: '0.26em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '24px' }}>
            The Journal
          </div>

          <div style={{ position: 'relative', marginBottom: '36px', display: 'inline-block', width: '100%' }}>
            <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(232,201,122,0.4), transparent)', margin: '0 auto 28px' }} />
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
              fontSize: 'clamp(20px,3vw,30px)', lineHeight: 1.6,
              color: '#edeae2', margin: '0 auto', position: 'relative', maxWidth: '720px',
            }}>
              {quote.map((w, i) => <AnimatedWord key={i} word={w} delay={0.025 * i} isInView={isInView} blur={true} />)}
            </p>
            <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(232,201,122,0.4), transparent)', margin: '28px auto 0' }} />
          </div>

          {/* Description columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', textAlign: 'left', marginTop: '32px', marginBottom: '40px' }}>
            <p className="reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, margin: 0 }}>
              This is a ledger of the roads that cut through the silence of the Himalayas. You will find no checklists or conquered summits here.
            </p>
            <p className="reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, margin: 0 }}>
              Instead, these pages are an alpine journal: field notes, changing light, and quiet moments along the gravel trails of Spiti, Ladakh, and Garhwal.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <SocialPill key={label} icon={icon} label={label} href={href} />
            ))}
          </div>
        </div>

        {/* ── NAVIGATION CARDS ─────────────────────────────────── */}
        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="thematic-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px', width: '100%' }}
        >
          {THEMES.map((theme) => (
            <ThematicCard key={theme.title} theme={theme} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
