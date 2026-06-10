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
  const travelY       = useTransform(scrollYProgress, [0.02, 0.15], [24, 0])
  const travelBlur    = useTransform(scrollYProgress, [0.02, 0.12], [8, 0])

  // STEP 2: Hike (0.15 to 0.3)
  const hikeOpacity   = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])
  const hikeY         = useTransform(scrollYProgress, [0.15, 0.3], [24, 0])
  const hikeBlur      = useTransform(scrollYProgress, [0.15, 0.27], [8, 0])

  // STEP 3: Film (0.3 to 0.5)
  const filmOpacity   = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const filmY         = useTransform(scrollYProgress, [0.3, 0.5], [30, 0])
  const filmScale     = useTransform(scrollYProgress, [0.3, 0.5], [0.88, 1])
  const filmGlowRaw   = useTransform(scrollYProgress, [0.3, 0.5], [0, 50])
  const filmShadow    = useMotionTemplate`drop-shadow(0 0 ${filmGlowRaw}px rgba(232, 201, 122, 0.45))`

  // STEP 4: Staggered Build-up of "Disappear Into The Himalayas"
  const disappearOpacity = useTransform(scrollYProgress, [0.35, 0.38], [0, 1])
  const disappearY       = useTransform(scrollYProgress, [0.35, 0.38], [10, 0])

  const intoOpacity = useTransform(scrollYProgress, [0.38, 0.41], [0, 1])
  const intoY       = useTransform(scrollYProgress, [0.38, 0.41], [10, 0])

  const theOpacity  = useTransform(scrollYProgress, [0.41, 0.44], [0, 1])
  const theY        = useTransform(scrollYProgress, [0.41, 0.44], [10, 0])

  // Eyebrow + buttons (0.75 to 0.85)
  const extrasOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1])

  // Scroll indicator — visible at 0, fades at 0.05
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 0.6, 0])

  // OUTRO: Fade text out, zoom background in
  const contentOpacityOutro = useTransform(scrollYProgress, [0.9, 1.0], [1, 0])
  const contentYOutro       = useTransform(scrollYProgress, [0.9, 1.0], [0, -50])

  // Background scale outro
  const bgScale          = useTransform(scrollYProgress, [0.85, 1.0], [1, 1.12])
  const fogOpacitySlow   = useTransform(scrollYProgress, [0.8, 1.0], [0.1, 0.38])
  const fogOpacityFast   = useTransform(scrollYProgress, [0.8, 1.0], [0.5, 1.0])

  const scrollToMap = () => {
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
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
            50% { transform: translateX(5%) scale(1.08); opacity: 0.4; }
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
            background: radial-gradient(ellipse at 50% 80%, rgba(200,220,255,0.07) 0%, transparent 60%),
                        radial-gradient(ellipse at 20% 60%, rgba(200,220,255,0.04) 0%, transparent 50%);
            animation: fogFloat 28s ease-in-out infinite;
            pointer-events: none;
          }
          .grain-overlay {
            position: absolute;
            inset: -50%;
            opacity: 0.022;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            animation: filmGrain 8s steps(6) infinite;
            pointer-events: none;
            will-change: transform;
          }
          @keyframes heroTitleReveal {
            from { clip-path: inset(0 100% 0 0); }
            to   { clip-path: inset(0 0% 0 0); }
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
              opacity: 0.88,
              filter: 'brightness(0.95) contrast(1.1) saturate(0.82)',
            }}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(4,6,9,0.72) 0%, rgba(4,6,9,0.18) 50%, rgba(4,6,9,0.88) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Fog & Grain Layers */}
        <motion.div className="fog-layer" style={{ opacity: fogOpacitySlow, zIndex: 2 }} />
        <motion.div className="fog-layer" style={{ animationDelay: '-12s', animationDirection: 'reverse', filter: 'blur(10px)', opacity: fogOpacityFast, zIndex: 2 }} />
        <div className="grain-overlay" style={{ zIndex: 5 }} />

        {/* ── Bottom Center "Disappear into the Himalayas" tagline ── */}
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
          <motion.div style={{ opacity: disappearOpacity, y: disappearY, marginBottom: '4px' }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 500,
              color: '#ffffff',
              textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            }}>
              Disappear
            </span>
          </motion.div>

          {/* INTO */}
          <motion.div style={{ opacity: intoOpacity, y: intoY, marginBottom: '4px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(11px, 2vw, 14px)',
              fontWeight: 400,
              letterSpacing: '0.38em',
              color: 'rgba(255,255,255,0.5)',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              textTransform: 'uppercase',
            }}>
              INTO
            </span>
          </motion.div>

          {/* The */}
          <motion.div style={{ opacity: theOpacity, y: theY, marginBottom: '2px' }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 500,
              color: '#e8c97a',
              textShadow: '0 4px 24px rgba(232, 201, 122, 0.4)',
            }}>
              The
            </span>
          </motion.div>

          {/* Himalayas */}
          <motion.div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(50px, 10vw, 84px)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#e8c97a',
              lineHeight: 1.05,
              textShadow: '0 8px 40px rgba(232,201,122,0.25)',
            }}>
              Himalayas
            </span>
          </motion.div>
        </motion.div>

        {/* ── Dynamic Content: Travel / Hike / Film ───────────────── */}
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
          {/* Eyebrow */}
          <motion.div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '4vh',
            opacity: extrasOpacity,
          }}>
            <div style={{ width: '32px', height: '1px', background: '#e8c97a', opacity: 0.6 }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.42em',
              color: '#e8c97a',
              textTransform: 'uppercase',
            }}>
              Himalayan Travel Journal
            </span>
          </motion.div>

          {/* Headline words */}
          <div style={{ width: '100%', marginBottom: '0px' }}>
            {/* Travel */}
            <motion.div style={{ textAlign: 'left', marginBottom: '0px', opacity: travelOpacity, y: travelY }}>
              <motion.span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(3rem, 12vw, 8rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'block',
                  letterSpacing: '-0.02em',
                  filter: useMotionTemplate`blur(${travelBlur}px)`,
                }}
              >
                Travel
              </motion.span>
            </motion.div>

            {/* Hike */}
            <motion.div style={{ textAlign: 'left', marginBottom: '0px', opacity: hikeOpacity, y: hikeY }}>
              <motion.span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(3rem, 12vw, 8rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'block',
                  letterSpacing: '-0.02em',
                  filter: useMotionTemplate`blur(${hikeBlur}px)`,
                }}
              >
                Hike
              </motion.span>
            </motion.div>

            {/* Film */}
            <motion.div style={{
              textAlign: 'left',
              position: 'relative',
              opacity: filmOpacity,
              y: filmY,
              scale: filmScale,
              rotate: -14,
              transformOrigin: 'left center',
              marginRight: '20px',
              filter: filmShadow,
            }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(3.5rem, 14vw, 10rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#e8c97a',
                lineHeight: 1.1,
                display: 'inline-block',
              }}>
                Film
              </span>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div style={{
            display: 'flex',
            gap: '16px',
            marginTop: 'clamp(36px, 6vh, 56px)',
            alignItems: 'center',
            opacity: extrasOpacity,
            flexWrap: 'wrap',
          }}>
            <button
              onClick={scrollToMap}
              className="hero-btn-primary"
            >
              Explore Map
            </button>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                padding: '16px 0',
                transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e8c97a')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" style={{ opacity: 0.7 }}>
                <path d="M13.7 1.5C13.5 0.9 13.1 0.5 12.5 0.3C11.4 0 7 0 7 0C7 0 2.6 0 1.5 0.3C0.9 0.5 0.5 0.9 0.3 1.5C0 2.6 0 5 0 5C0 5 0 7.4 0.3 8.5C0.5 9.1 0.9 9.5 1.5 9.7C2.6 10 7 10 7 10C7 10 11.4 10 12.5 9.7C13.1 9.5 13.5 9.1 13.7 8.5C14 7.4 14 5 14 5C14 5 14 2.6 13.7 1.5ZM5.5 7.1V2.9L9.2 5L5.5 7.1Z" />
              </svg>
              Watch Film
            </a>
          </motion.div>
        </motion.div>

        {/* ── Scroll Indicator ────────────────────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: 'clamp(24px, 4vw, 48px)',
            zIndex: 20,
            opacity: scrollHintOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '8px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(232,201,122,0.5)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}>
            Scroll
          </span>
          <div style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, rgba(232,201,122,0.6), transparent)',
            animation: 'scrollBounce 2s ease-in-out infinite',
          }} />
        </motion.div>
      </div>
    </section>
  )
}
