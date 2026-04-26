import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  // Track scroll within the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // STEP 1: Travel (0 to 0.15)
  const travelOpacity = useTransform(scrollYProgress, [0.02, 0.15], [0, 1])
  const travelY = useTransform(scrollYProgress, [0.02, 0.15], [30, 0])

  // STEP 2: Hike (0.15 to 0.3)
  const hikeOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])
  const hikeY = useTransform(scrollYProgress, [0.15, 0.3], [30, 0])

  // STEP 3: Film (0.3 to 0.5)
  const filmOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const filmY = useTransform(scrollYProgress, [0.3, 0.5], [40, 0])
  const filmScale = useTransform(scrollYProgress, [0.3, 0.5], [0.85, 1])
  const filmGlowRaw = useTransform(scrollYProgress, [0.3, 0.5], [0, 60])
  const filmShadow = useMotionTemplate`drop-shadow(0 0 ${filmGlowRaw}px rgba(232, 201, 122, 0.5))`

  // STEP 4: Staggered Build-up
  const disappearOpacity = useTransform(scrollYProgress, [0.35, 0.38], [0, 1])
  const disappearY = useTransform(scrollYProgress, [0.35, 0.38], [10, 0])

  const intoOpacity = useTransform(scrollYProgress, [0.38, 0.41], [0, 1])
  const intoY = useTransform(scrollYProgress, [0.38, 0.41], [10, 0])

  const theOpacity = useTransform(scrollYProgress, [0.41, 0.44], [0, 1])
  const theY = useTransform(scrollYProgress, [0.41, 0.44], [10, 0])

  // STEP 5: Himalayas

  // Extras: Buttons, Eyebrow (0.75 to 0.85)
  const extrasOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1])

  // OUTRO: Fade text out, zoom background in
  const contentOpacityOutro = useTransform(scrollYProgress, [0.9, 1.0], [1, 0])
  const contentYOutro = useTransform(scrollYProgress, [0.9, 1.0], [0, -60])

  // Background and Fog Outro
  const bgScale = useTransform(scrollYProgress, [0.85, 1.0], [1, 1.15])
  const fogOpacitySlow = useTransform(scrollYProgress, [0.8, 1.0], [0.1, 0.4])
  const fogOpacityFast = useTransform(scrollYProgress, [0.8, 1.0], [0.5, 1.0])

  // Initial scroll hint fades out once interaction starts (0 to 0.05)

  // Click handler
  const scrollToMap = () => {
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: 'clamp(300vh, 400vh, 400vh)',
        background: '#040609',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          overflow: 'hidden',
          padding: '0 clamp(24px,5vw,64px)',
        }}
      >
        <style>{`
          @keyframes fogFloat {
            0% { transform: translateX(-10%) scale(1); opacity: 0.2; }
            50% { transform: translateX(5%) scale(1.1); opacity: 0.4; }
            100% { transform: translateX(-10%) scale(1); opacity: 0.2; }
          }
          @keyframes filmGrain {
            0%, 100% { transform: translate(0,0) }
            10% { transform: translate(-1%,-1%) }
            20% { transform: translate(1%,1%) }
            30% { transform: translate(-2%,-2%) }
            40% { transform: translate(1%,-1%) }
            50% { transform: translate(-1%,1%) }
            60% { transform: translate(2%,-2%) }
            70% { transform: translate(-1%,2%) }
            80% { transform: translate(-2%,-1%) }
            90% { transform: translate(1%,-2%) }
          }
          .fog-layer {
            position: absolute;
            inset: -20%;
            background: radial-gradient(ellipse at 50% 80%, rgba(200,220,255,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 20% 60%, rgba(200,220,255,0.05) 0%, transparent 50%);
            animation: fogFloat 25s ease-in-out infinite;
            pointer-events: none;
            zIndex: 2;
          }
          .grain-overlay {
            position: absolute;
            inset: -50%;
            opacity: 0.025;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            animation: filmGrain 8s steps(6) infinite;
            pointer-events: none;
            zIndex: 5;
            will-change: transform;
          }
        `}</style>

        {/* ── Background Layer ───────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            scale: bgScale,
            transformOrigin: 'center 40%',
            pointerEvents: 'none',
          }}
        >
          <img
            src="https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/wallpaper.jpg"
            alt="Himalayan Mountains"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9,
              filter: 'brightness(1.0) contrast(1.1) saturate(0.85)',
            }}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(4,6,9,0.7) 0%, rgba(4,6,9,0.2) 50%, rgba(4,6,9,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Fog & Grain Layers */}
        <motion.div className="fog-layer" style={{ opacity: fogOpacitySlow }} />
        <motion.div className="fog-layer" style={{ animationDelay: '-12s', animationDirection: 'reverse', filter: 'blur(10px)', opacity: fogOpacityFast }} />
        <div className="grain-overlay" />

        {/* Bottom Center Himalayas & Tagline */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 'clamp(50px, 10vh, 100px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 15,
            textAlign: 'center',
          }}
        >
          {/* Disappear */}
          <motion.div
            style={{
              opacity: disappearOpacity,
              y: disappearY,
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(20px, 3.5vw, 28px)',
                fontWeight: 500,
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              Disappear
            </span>
          </motion.div>

          {/* INTO */}
          <motion.div
            style={{
              opacity: intoOpacity,
              y: intoY,
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(14px, 2.5vw, 18px)',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.8)',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              INTO
            </span>
          </motion.div>

          {/* The */}
          <motion.div
            style={{
              opacity: theOpacity,
              y: theY,
              marginBottom: '2px', // Reduce pause to connect 'The' and 'Himalayas'
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 500,
                color: '#e8c97a', // Golden
                textShadow: '0 4px 20px rgba(232, 201, 122, 0.4)',
              }}
            >
              The
            </span>
          </motion.div>

          {/* Himalayas */}
          <motion.div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(50px, 10vw, 84px)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#e8c97a',
                lineHeight: 1.1,
              }}
            >
              Himalayas
            </span>
          </motion.div>
        </motion.div>

        {/* ── Dynamic Content ──────────────────────────────────── */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
        >
          {/* 1. Eyebrow */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '4vh',
              opacity: extrasOpacity,
            }}
          >
            <div style={{ width: '32px', height: '1px', background: '#e8c97a', opacity: 0.7 }} />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.4em',
                color: '#e8c97a',
                textTransform: 'uppercase',
              }}
            >
              Himalayan Travel Journal
            </span>
          </motion.div>

          {/* 2. Headline */}
          <div style={{ width: '100%', marginBottom: '0px' }}>
            {/* Travel */}
            <motion.div
              style={{
                textAlign: 'left',
                marginBottom: 'clamp(-10px, -2vw, -20px)',
                opacity: travelOpacity,
                y: travelY,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(64px, 13vw, 160px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'block',
                  letterSpacing: '-0.02em',
                }}
              >
                Travel
              </span>
            </motion.div>

            {/* Hike */}
            <motion.div
              style={{
                textAlign: 'left',
                marginBottom: 'clamp(-10px, -2vw, -20px)',
                opacity: hikeOpacity,
                y: hikeY,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(64px, 13vw, 160px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'block',
                  letterSpacing: '-0.02em',
                }}
              >
                Hike
              </span>
            </motion.div>

            {/* Film */}
            <motion.div
              style={{
                textAlign: 'left',
                position: 'relative',
                opacity: filmOpacity,
                y: filmY,
                scale: filmScale,
                rotate: -15,
                transformOrigin: 'left center',
                marginRight: '20px',
                filter: filmShadow,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(72px, 15vw, 180px)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#e8c97a',
                  lineHeight: 1.1,
                  display: 'inline-block',
                }}
              >
                Film
              </span>
            </motion.div>

          </div>

          {/* 5. Buttons */}
          <motion.div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: 'clamp(40px, 6vh, 60px)',
              alignItems: 'center',
              opacity: extrasOpacity,
            }}
          >
            <button
              className="magnetic-btn"
              onClick={scrollToMap}
              style={{
                background: '#e8c97a',
                color: '#06080c',
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                letterSpacing: '0.12em',
                padding: '16px 36px',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(232, 201, 122, 0.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(232, 201, 122, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(232, 201, 122, 0.15)';
              }}
            >
              Explore Map
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
