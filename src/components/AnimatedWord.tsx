import { motion } from 'framer-motion'

/**
 * Shared word-reveal animation component.
 * Used in PlacePage, ExpeditionGrid, About, Footer.
 *
 * Props:
 *   word       — the word to animate
 *   delay      — stagger delay in seconds
 *   isInView   — trigger
 *   blur?      — also fade from blur(6px) → blur(0) on entry
 *   charStagger? — animate each character individually
 */
interface Props {
  word: string
  delay: number
  isInView: boolean
  blur?: boolean
  charStagger?: boolean
}

export function AnimatedWord({ word, delay, isInView, blur = false, charStagger = false }: Props) {
  if (charStagger) {
    const chars = word.split('')
    return (
      <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', filter: blur ? undefined : 'none' }}
            initial={{ y: '110%', filter: blur ? 'blur(6px)' : 'blur(0px)', opacity: blur ? 0 : 1 }}
            animate={
              isInView
                ? { y: '0%', filter: 'blur(0px)', opacity: 1 }
                : { y: '110%', filter: blur ? 'blur(6px)' : 'blur(0px)', opacity: blur ? 0 : 1 }
            }
            transition={{
              duration: 0.65,
              ease: [0.23, 1, 0.32, 1],
              delay: delay + i * 0.03,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{
          y: '110%',
          filter: blur ? 'blur(6px)' : 'blur(0px)',
          opacity: blur ? 0 : 1,
        }}
        animate={
          isInView
            ? { y: '0%', filter: 'blur(0px)', opacity: 1 }
            : { y: '110%', filter: blur ? 'blur(6px)' : 'blur(0px)', opacity: blur ? 0 : 1 }
        }
        transition={{
          duration: 0.7,
          ease: [0.23, 1, 0.32, 1],
          delay,
        }}
      >
        {word}
      </motion.span>
    </span>
  )
}
