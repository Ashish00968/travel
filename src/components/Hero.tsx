import { motion } from 'framer-motion'

const stats = [
  { num: '18+', label: 'PEAKS' },
  { num: '6',   label: 'REGIONS' },
  { num: '4900m', label: 'MAX ALT' },
]

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

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
      {/* Grid background with mask — separate layer so absolute children aren't clipped */}
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
        }}
      />
      {/* Content */}
      <div
        style={{
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
          <div style={{ width: '48px', height: '1px', background: '#e8c97a', opacity: 0.4 }} />
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
          <div style={{ width: '48px', height: '1px', background: '#e8c97a', opacity: 0.4 }} />
        </motion.div>

        {/* 2. Headline — three staggered lines */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          {/* Line 1: "I climb." */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1], delay: 0.4 }}
            style={{ textAlign: 'right', marginRight: '10%' }}
          >
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
              I climb.
            </span>
          </motion.div>

          {/* Line 2: "I film." */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1], delay: 0.55 }}
            style={{ textAlign: 'center' }}
          >
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
              I film.
            </span>
          </motion.div>

          {/* Line 3: "I vanish into mountains." */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1], delay: 0.7 }}
            style={{ textAlign: 'left', marginLeft: '8%' }}
          >
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
              I vanish into mountains.
            </span>
          </motion.div>
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
        {stats.map((s) => (
          <div key={s.label} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '36px',
                color: '#e8c97a',
                lineHeight: 1,
              }}
            >
              {s.num}
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
          @keyframes bounceY {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(8px); }
          }
        `}</style>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            color: '#3d3b38',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#e8c97a',
            animation: 'bounceY 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}
