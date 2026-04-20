import { useEffect, useState, useRef } from 'react'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  
  // DOM refs to avoid React state overhead for rapidly changing variables
  const cursorRef = useRef<HTMLDivElement>(null)
  
  // Physics state
  const mouse = useRef({ x: -100, y: -100 })
  const delayed = useRef({ x: -100, y: -100 })
  
  // Are we currently hovering something that modifies the cursor?
  const isHovering = useRef(false)
  const hoverTarget = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // 1. Accessibility Check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setEnabled(false)
      return
    }
    setEnabled(true)

    // 2. Mouse move parsing
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      
      // Calculate magnetic physics if we are hovering a target
      if (hoverTarget.current && isHovering.current) {
        const rect = hoverTarget.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY
        
        // Scale down the distance so it "sticks" playfully
        const magneticX = centerX + distanceX * 0.2
        const magneticY = centerY + distanceY * 0.2
        
        // Update the mouse ref to the sticky center rather than actual pointer
        mouse.current = { x: magneticX, y: magneticY }
        
        // Move the physical button as well!
        hoverTarget.current.style.transform = `translate(${distanceX * 0.15}px, ${distanceY * 0.15}px)`
      }
    }

    // 3. Hover Interactions (Global delegation)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const magneticBtn = target.closest('.magnetic-btn') as HTMLElement
      
      if (magneticBtn) {
        isHovering.current = true
        hoverTarget.current = magneticBtn
        if (cursorRef.current) {
          cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.5)'
          cursorRef.current.style.backgroundColor = 'rgba(232, 201, 122, 0.1)'
          cursorRef.current.style.borderColor = 'rgba(232, 201, 122, 0)'
        }
      }
    }
    
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (hoverTarget.current && target.closest('.magnetic-btn') === hoverTarget.current) {
        // Reset button position
        hoverTarget.current.style.transform = 'translate(0px, 0px)'
        
        isHovering.current = false
        hoverTarget.current = null
        if (cursorRef.current) {
          cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
          cursorRef.current.style.backgroundColor = 'transparent'
          cursorRef.current.style.borderColor = 'rgba(232, 201, 122, 0.4)'
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    // 4. Render loop for smooth cursor easing
    let animationFrameId: number
    const render = () => {
      // Lerp (Linear Interpolation)
      delayed.current.x += (mouse.current.x - delayed.current.x) * 0.15
      delayed.current.y += (mouse.current.y - delayed.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.left = `${delayed.current.x}px`
        cursorRef.current.style.top = `${delayed.current.y}px`
      }

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid rgba(232, 201, 122, 0.4)',
        pointerEvents: 'none',
        zIndex: 9999, // Above everything
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.2s ease-out, background-color 0.2s ease, border-color 0.2s ease',
        willChange: 'left, top, transform',
        backdropFilter: 'blur(2px)' // Very subtle glass effect on the custom cursor
      }}
    />
  )
}
