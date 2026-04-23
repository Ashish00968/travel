import { motion } from 'framer-motion'

/**
 * Shared word-reveal animation component.
 * Used in PlacePage, ExpeditionGrid, About, Footer.
 */
export function AnimatedWord({ word, delay, isInView }: { word: string; delay: number; isInView: boolean }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{ y: '110%' }}
        animate={isInView ? { y: '0%' } : { y: '110%' }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1], delay }}
      >
        {word}
      </motion.span>
    </span>
  )
}
