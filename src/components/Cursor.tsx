import { useEffect, useRef } from 'react'

/**
 * Custom cursor — uses direct DOM manipulation via refs instead of
 * React state to avoid 60fps re-renders on every mousemove event.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const rafId = useRef(0)
  const pos = useRef({ x: -40, y: -40 })
  const isPointer = useRef(false)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      // Use rAF to batch DOM writes
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          dot.style.transform = `translate3d(${pos.current.x - 8}px,${pos.current.y - 8}px,0) scale(${isPointer.current ? 1.5 : 1})`
          rafId.current = 0
        })
      }
    }

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      const pointer =
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        t.classList.contains('magnetic-btn')
      if (pointer !== isPointer.current) {
        isPointer.current = pointer
        dot.style.backgroundColor = pointer ? 'transparent' : 'rgba(232,201,122,0.4)'
        dot.style.borderColor = pointer ? 'rgba(232,201,122,0.8)' : 'transparent'
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: 'rgba(232,201,122,0.4)',
        border: '1px solid transparent',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference',
        willChange: 'transform',
        transition: 'background-color .15s, border-color .15s, transform .08s ease-out',
      }}
    />
  )
}
