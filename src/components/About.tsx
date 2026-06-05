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

// ── CardIcon Component (outline SVGs) ───────────────────────────
function CardIcon({ type, hovered, size }: { type: string; hovered: boolean; size: number }) {
  const strokeColor = hovered ? "#e8c97a" : "rgba(232, 201, 122, 0.35)"
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: strokeColor,
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { transition: 'stroke 0.4s ease' }
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
  // horizon
  return (
    <svg {...props}>
      <path d="M3 20h18L12 4z" />
      <path d="M12 4l-4 8 4 3 4-3z" />
    </svg>
  )
}

// ── ThematicCard Component ─────────────────────────────────────
function ThematicCard({ theme, isProminent }: { theme: typeof THEMES[number]; isProminent: boolean }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (theme.href.startsWith('#')) {
      e.preventDefault()
      const targetId = theme.href.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (theme.href.startsWith('/')) {
      e.preventDefault()
      navigate(theme.href)
    }
  }

  const minHeight = isProminent ? '320px' : '185px'
  const padding = isProminent ? '40px 44px' : '24px 28px'
  const titleSize = isProminent ? '34px' : '22px'
  const descSize = isProminent ? '16px' : '13px'
  const iconSize = isProminent ? 28 : 20

  return (
    <motion.a
      href={theme.href}
      target={theme.target}
      rel={theme.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        background: '#0d1117',
        border: `1px solid ${hovered ? 'rgba(232,201,122,0.45)' : 'rgba(232,201,122,0.25)'}`,
        borderRadius: '14px',
        padding: padding,
        minHeight: minHeight,
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow: hovered 
          ? '0 12px 30px rgba(0,0,0,0.25), 0 0 12px rgba(232,201,122,0.4)'
          : '0 6px 12px rgba(0,0,0,0.15)',
        transition: 'border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* Background Image / Subtle reveal texture */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${theme.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'luminosity',
          filter: hovered ? 'grayscale(100%) contrast(1.15) brightness(0.95)' : 'grayscale(100%) contrast(1.05) brightness(0.85)',
          opacity: hovered ? 0.22 : 0.08,
          transform: hovered ? 'scale(1.08)' : 'scale(1.02)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Ambient background dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(13, 17, 23, 0.82), rgba(13, 17, 23, 0.96))',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />



      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Top bar with Tag and Elegant Outline Icon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          {/* Tag */}
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: hovered ? '#e8c97a' : '#5a5855',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              transition: 'color 0.3s ease',
            }}
          >
            {theme.tag}
          </div>
          
          {/* Icon */}
          <CardIcon type={theme.iconType} hovered={hovered} size={iconSize} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: titleSize,
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#edeae2',
            lineHeight: 1.2,
            margin: '0 0 12px 0',
          }}
        >
          {theme.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: descSize,
            color: hovered ? '#edeae2' : '#8c8780',
            lineHeight: 1.65,
            margin: '0 0 20px 0',
            transition: 'color 0.3s ease',
          }}
        >
          {theme.desc}
        </p>
      </div>

      {/* CTA at the bottom */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: isProminent ? '11.5px' : '10.5px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#e8c97a',
          marginTop: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {theme.cta}
          <motion.span
            animate={{ x: hovered ? 6 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ display: 'inline-block' }}
          >
            →
          </motion.span>
        </span>
      </div>

      {/* Bottom accent glow bar */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(to right, #e8c97a, #c9a84c)',
          transformOrigin: 'left',
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2,
        }}
      />
    </motion.a>
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

  const quote = "The mountains do not care for our speed. They simply stand—inviting us to look up, follow the road, and listen.".split(' ')

  return (
    <section
      id="about"
      style={{ padding: 'clamp(80px,12vw,160px) clamp(24px,5vw,48px)', background: '#06080c' }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '64px',
        }}
      >
        {/* ── CENTERED EDITORIAL NARRATIVE ─────────────────────────── */}
        <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', letterSpacing: '0.25em', color: '#e8c97a', textTransform: 'uppercase', marginBottom: '24px' }}>
            The Journal
          </div>

          <div style={{ position: 'relative', marginBottom: '36px', display: 'inline-block', width: '100%' }}>
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 0.04 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
                fontFamily: "'Playfair Display',serif", fontSize: 'clamp(140px,22vw,280px)',
                color: '#e8c97a', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              &ldquo;
            </motion.span>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
              fontSize: 'clamp(20px,3vw,30px)', lineHeight: 1.6,
              color: '#edeae2', margin: '0 auto', position: 'relative',
              maxWidth: '720px',
            }}>
              {quote.map((w, i) => <AnimatedWord key={i} word={w} delay={0.03 * i} isInView={isInView} />)}
            </p>
          </div>

          {/* Symmetrical description columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            textAlign: 'left',
            marginTop: '32px',
            marginBottom: '40px'
          }}>
            <p
              className="reveal"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, margin: 0 }}
            >
              This is a ledger of the roads that cut through the silence of the Himalayas. You will find no checklists or conquered summits here.
            </p>
            <p
              className="reveal"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: '#7a7570', lineHeight: 1.9, margin: 0 }}
            >
              Instead, these pages are an alpine journal: field notes, changing light, and quiet moments along the gravel trails of Spiti, Ladakh, and Garhwal.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <SocialPill key={label} icon={icon} label={label} href={href} />
            ))}
          </div>
        </div>

        {/* ── SYMMETRICAL NAVIGATION CARDS GRID ───────────────────── */}
        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '24px',
            width: '100%',
          }}
        >
          {THEMES.map((theme) => (
            <ThematicCard key={theme.title} theme={theme} isProminent={false} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          #about > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
