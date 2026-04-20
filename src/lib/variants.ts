import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.85, ease: [0.25, 0.8, 0.25, 1] }
  }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
}

export const slideRight = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }
  }
}

export const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, x: 0,
    transition: { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, scale: 1,
    transition: { duration: 1, ease: [0.25, 0.8, 0.25, 1] }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }
  }
}
