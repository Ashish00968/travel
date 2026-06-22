import { useEffect, useRef } from 'react'

/**
 * Optimised dual-ring cursor
 * ─ Inner dot : 8 px, instant via rAF (no transition delay)
 * ─ Outer ring: 36 px, lerp spring toward cursor
 * ─ rAF loop   : self-cancels when ring reaches target (saves GPU)
 * ─ mouseover  : checks closest interactive ancestor once per event
 * ─ click pulse: CSS class toggle — no transform string mutation
 */
export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let rafId   = 0
    let running = false
    let ringX   = -80, ringY   = -80
    let targetX = -80, targetY = -80
    let isPointer  = false

    // ── Lerp ─────────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const EPS  = 0.3   // px — stop loop when ring is close enough

    const tick = () => {
      ringX = lerp(ringX, targetX, 0.14)
      ringY = lerp(ringY, targetY, 0.14)
      ring.style.transform = `translate3d(${ringX - 18}px,${ringY - 18}px,0)`

      if (Math.abs(ringX - targetX) > EPS || Math.abs(ringY - targetY) > EPS) {
        rafId = requestAnimationFrame(tick)
      } else {
        // Snap exactly and stop the loop — no more wasted frames
        ring.style.transform = `translate3d(${targetX - 18}px,${targetY - 18}px,0)`
        running = false
      }
    }

    const ensureRunning = () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(tick)
      }
    }

    // ── Mouse move ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      dot.style.transform = `translate3d(${e.clientX - 4}px,${e.clientY - 4}px,0)`
      ensureRunning()
    }

    // ── Detect interactive elements (checks closest, not target) ──────
    let lastPointerEl: Element | null = null

    const INTERACTIVE = 'a,button,input,textarea,select,[role="button"],.magnetic-btn'

    const onOver = (e: Event) => {
      const el = (e.target as Element).closest(INTERACTIVE)
      if (el === lastPointerEl) return   // same element — skip work
      lastPointerEl = el

      const next = el !== null
      if (next === isPointer) return
      isPointer = next

      if (next) {
        dot.style.opacity  = '0'
        ring.style.width   = '52px'
        ring.style.height  = '52px'
        ring.style.borderColor   = 'rgba(232,201,122,0.9)'
        ring.style.mixBlendMode  = 'difference'
        ring.style.background    = 'rgba(232,201,122,0.06)'
      } else {
        dot.style.opacity  = '1'
        ring.style.width   = '36px'
        ring.style.height  = '36px'
        ring.style.borderColor   = 'rgba(232,201,122,0.5)'
        ring.style.mixBlendMode  = 'normal'
        ring.style.background    = 'transparent'
      }
    }

    // ── Click pulse — CSS class, not transform string hacking ─────────
    const onClick = () => {
      ring.classList.add('cursor-click')
      setTimeout(() => ring.classList.remove('cursor-click'), 200)
    }

    // ── Visibility ────────────────────────────────────────────────────
    const onLeave  = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onEnter  = () => { dot.style.opacity = isPointer ? '0' : '1'; ring.style.opacity = '1' }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseover',  onOver,  { passive: true })
    window.addEventListener('click',      onClick, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('click',      onClick)
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
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#e8c97a',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'opacity 150ms ease-out',
        }}
      />
      {/* Outer ring — spring-lerp follow */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(232,201,122,0.5)',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: [
            'width 200ms cubic-bezier(0.23,1,0.32,1)',
            'height 200ms cubic-bezier(0.23,1,0.32,1)',
            'border-color 200ms ease-out',
            'background 200ms ease-out',
            'opacity 150ms ease-out',
          ].join(','),
        }}
      />
    </>
  )
}
