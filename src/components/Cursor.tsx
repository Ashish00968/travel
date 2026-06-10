import { useEffect, useRef } from 'react'

/**
 * Premium dual-ring cursor
 * - Inner dot: 8px, follows cursor instantly via rAF
 * - Outer ring: 36px, smoothly lerps toward cursor (spring-like)
 * - On hover over interactive: inner hides, outer expands to 52px
 * - On click: ring pulses inward then springs out
 * - All DOM writes via rAF — zero React re-renders on mousemove
 */
export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let rafId = 0
    let ringX = -80, ringY = -80
    let targetX = -80, targetY = -80
    let isPointer = false
    let isClicking = false

    // ── Lerp ring toward target (0.15 factor = spring-like lag) ───
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animateRing = () => {
      ringX = lerp(ringX, targetX, 0.14)
      ringY = lerp(ringY, targetY, 0.14)
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`
      rafId = requestAnimationFrame(animateRing)
    }

    rafId = requestAnimationFrame(animateRing)

    // ── Mouse move: dot follows instantly ─────────────────────────
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      dot.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`
    }

    // ── Detect interactive elements ───────────────────────────────
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      const pointer =
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.tagName === 'SELECT' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        t.classList.contains('magnetic-btn') ||
        t.getAttribute('role') === 'button'

      if (pointer === isPointer) return
      isPointer = pointer

      if (pointer) {
        dot.style.opacity = '0'
        dot.style.transform += ' scale(0)'
        ring.style.width = '52px'
        ring.style.height = '52px'
        ring.style.borderColor = 'rgba(232,201,122,0.9)'
        ring.style.mixBlendMode = 'difference'
        ring.style.background = 'rgba(232,201,122,0.06)'
        // Adjust ring offset for bigger size
      } else {
        dot.style.opacity = '1'
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.borderColor = 'rgba(232,201,122,0.5)'
        ring.style.mixBlendMode = 'normal'
        ring.style.background = 'transparent'
      }
    }

    // ── Click pulse ───────────────────────────────────────────────
    const onClick = () => {
      if (isClicking) return
      isClicking = true
      ring.style.transform += ' scale(0.75)'
      ring.style.transition = 'transform 100ms cubic-bezier(0.23, 1, 0.32, 1), width 200ms, height 200ms, border-color 200ms, background 200ms'
      setTimeout(() => {
        ring.style.transform = ring.style.transform.replace(' scale(0.75)', '')
        ring.style.transition = 'width 200ms cubic-bezier(0.23, 1, 0.32, 1), height 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms, background 200ms'
        isClicking = false
      }, 150)
    }

    // ── Visibility ────────────────────────────────────────────────
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onEnter = () => {
      dot.style.opacity = isPointer ? '0' : '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('click', onClick, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      {/* Inner dot — instant follow */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#e8c97a',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'opacity 150ms ease-out, transform 150ms ease-out',
        }}
      />
      {/* Outer ring — spring-lerp follow */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(232,201,122,0.5)',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 200ms cubic-bezier(0.23, 1, 0.32, 1), height 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms ease-out, background 200ms ease-out',
        }}
      />
    </>
  )
}
