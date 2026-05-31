import { useEffect, useRef, useState } from 'react'

/**
 * useCountUp — rAF-driven numeric count-up animation.
 *
 * Only starts when the attached element scrolls into view (IntersectionObserver
 * threshold: 0.5 so at least half the element is visible before counting begins).
 *
 * @param from     Starting value (e.g. 0 or 2015)
 * @param to       Ending value
 * @param duration Animation duration in ms (default 1500)
 *
 * @returns { count, ref }
 *   count — current animated integer value to render
 *   ref   — attach to the element that triggers the animation on enter
 */
export function useCountUp(
  from: number,
  to: number,
  duration = 1500,
): { count: number; ref: React.RefObject<HTMLDivElement | null> } {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(from)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return
        hasRun.current = true

        // rAF-based easing: ease-out cubic
        const start = performance.now()
        const range = to - from

        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          // ease-out cubic: decelerate toward the end
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(from + range * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [from, to, duration])

  return { count, ref }
}
