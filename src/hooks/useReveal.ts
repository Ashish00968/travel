import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useReveal(options = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-80px',
    ...options 
  })
  return { ref, isInView }
}
