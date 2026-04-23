import React from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  priority?: boolean
  style?: React.CSSProperties
}

export default function OptimizedImage({ src, alt, className, priority, style }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
    />
  )
}
