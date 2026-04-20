import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'


const stats = [
  { numTarget: 18, suffix: '+', label: 'PEAKS' },
  { numTarget: 6, suffix: '', label: 'REGIONS' },
  { numTarget: 4900, suffix: 'm', label: 'MAX ALT' },
]

function useCounter(target: number, duration: number, delay: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const step = target / (duration / 16)
      const interval = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(interval) }
        else setCount(Math.floor(start))
      }, 16)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, duration, delay])
  return count
}

const AnimatedWord = ({ word, delay }: { word: string, delay: number }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em', verticalAlign: 'top' }}>
    <motion.span
      style={{ display: 'inline-block' }}
      initial={{ y: '110%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay }}
    >
      {word}
    </motion.span>
  </span>
)

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const s1 = useCounter(stats[0].numTarget, 1500, 1200)
  const s2 = useCounter(stats[1].numTarget, 1500, 1200)
  const s3 = useCounter(stats[2].numTarget, 1500, 1200)
  const renderStats = [s1, s2, s3]

  const line1 = "I climb.".split(' ')
  const line2 = "I film.".split(' ')
  const line3 = "I vanish into mountains.".split(' ')

  return (
    <section
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
        padding: '0 clamp(24px,5vw,48px)',
        background: '#06080c',
      }}
    >
      {/* ── Background Layer: Mountain Wallpaper ───────────────── */}
      <motion.img 
        src="/images/hero-wallpaper.jpg" 
        alt="Himalayan Mountains"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.8, 0.25, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.7,
          filter: 'brightness(1.0) contrast(1.1)',
          pointerEvents: 'none',
        }}
      />
      
      {/* ── Background Layer: Dark Gradient Overlay ────────────── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(6,8,12,0.3) 0%, rgba(6,8,12,0.7) 60%, #06080c 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Background Layer: Grid Pattern ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(232,201,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          zIndex: 2,
        }}
      />
      
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {/* 1. Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }} 
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
            style={{ width: '48px', height: '1px', background: '#e8c97a', opacity: 0.4 }} 
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#e8c97a',
              textTransform: 'uppercase',
            }}
          >
            Himalayan Travel Journal · India
          </span>
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }} 
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
            style={{ width: '48px', height: '1px', background: '#e8c97a', opacity: 0.4 }} 
          />
        </motion.div>

        {/* 2. Headline — three staggered lines */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          {/* Line 1: "I climb." */}
          <div style={{ textAlign: 'right', marginRight: '10%' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px,8vw,80px)',
                fontWeight: 700,
                color: '#edeae2',
                lineHeight: 1.05,
                display: 'block',
              }}
            >
              {line1.map((w, i) => <AnimatedWord key={i} word={w} delay={0.3 + i * 0.07} />)}
            </span>
          </div>

          {/* Line 2: "I film." */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(52px,10vw,104px)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#e8c97a',
                lineHeight: 1.05,
                display: 'block',
              }}
            >
              {line2.map((w, i) => <AnimatedWord key={i} word={w} delay={0.45 + i * 0.07} />)}
            </span>
          </div>

          {/* Line 3: "I vanish into mountains." */}
          <div style={{ textAlign: 'left', marginLeft: '8%' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px,6vw,64px)',
                fontWeight: 700,
                color: '#edeae2',
                lineHeight: 1.1,
                display: 'block',
              }}
            >
              {line3.map((w, i) => <AnimatedWord key={i} word={w} delay={0.6 + i * 0.07} />)}
            </span>
          </div>
        </div>

        {/* 3. Gold rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.3, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{
            width: '80px',
            height: '1px',
            background: '#e8c97a',
            margin: '20px auto',
          }}
        />

        {/* 4. Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '17px',
            color: '#7a7570',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: 1.9,
            margin: '0 0 40px 0',
          }}
        >
          Solo documenting the Himalayas since 2021. Cold deserts, sacred peaks,
          high-altitude passes. Every route is a story. This is mine.
        </motion.p>

        {/* 5. Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
        >
          <button
            className="magnetic-btn"
            onClick={() => scrollTo('map-section')}
            style={{
              background: '#e8c97a',
              color: '#06080c',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              padding: '14px 32px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Explore the Map ↓
          </button>

          <button
            className="magnetic-btn"
            onClick={() => scrollTo('about')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(232,201,122,0.5)',
              color: '#e8c97a',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              padding: '14px 32px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(232,201,122,0.08)'
              e.currentTarget.style.borderColor = 'rgba(232,201,122,0.9)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(232,201,122,0.5)'
            }}
          >
            My Story
          </button>
        </motion.div>
      </div>

      {/* Stats — absolute bottom-right */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 1.3 }}
        style={{
          position: 'absolute',
          bottom: '64px',
          right: '48px',
          textAlign: 'right',
        }}
      >
        {stats.map((s, i) => (
          <div key={s.label} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '36px',
                color: '#e8c97a',
                lineHeight: 1,
              }}
            >
              {renderStats[i]}{s.suffix}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                color: '#3d3b38',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginTop: '4px',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator — absolute bottom-center */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <style>{`
          @keyframes drawLine {
            0% { transform: scaleY(0); transform-origin: top; }
            40%, 100% { transform: scaleY(1); transform-origin: top; }
          }
          @keyframes fadeChevron {
            0%, 30% { opacity: 0; transform: translateY(-4px); }
            45% { opacity: 1; transform: translateY(0); }
            80%, 100% { opacity: 0; transform: translateY(0); }
          }
        `}</style>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            color: '#3d3b38',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          Scroll
        </span>
        <div style={{ position: 'relative', width: '12px', height: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '1px',
              height: '16px',
              background: '#e8c97a',
              animation: 'drawLine 2.5s ease-out infinite',
            }}
          />
          <svg 
            width="10" height="6" viewBox="0 0 10 6" fill="none" 
            style={{ 
              marginTop: '2px',
              animation: 'fadeChevron 2.5s ease-out infinite' 
            }}
          >
            <path d="M1 1L5 5L9 1" stroke="#e8c97a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
