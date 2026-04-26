import React, { useState } from 'react'
import { blurPlaceholderFromUrl } from '../lib/cloudinary'

interface Props {
  src: string
  alt: string
  className?: string
  priority?: boolean
  style?: React.CSSProperties
  /** Override auto-generated blur placeholder (pass empty string to disable) */
  placeholder?: string
}

/**
 * OptimizedImage — drop-in <img> with:
 *  - loading="lazy" / loading="eager" based on priority
 *  - decoding="async" always (browser decodes off main thread)
 *  - LQIP blur placeholder: a tiny blurred version is shown via CSS
 *    background-image until the real image loads, eliminating layout shift.
 *    Works for any Cloudinary URL; non-Cloudinary URLs skip the placeholder.
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  style,
  placeholder,
}: Props) {
  const [loaded, setLoaded] = useState(false)

  // Derive the placeholder URL unless the caller explicitly overrides it.
  // blurPlaceholderFromUrl is a no-op for non-Cloudinary URLs (returns src).
  const lqip =
    placeholder !== undefined
      ? placeholder
      : src.includes('res.cloudinary.com')
        ? blurPlaceholderFromUrl(src)
        : ''

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      style={{
        // Show blurred placeholder as CSS background until main image loads.
        // CSS background sits behind the <img> pixel data — once loaded the
        // real image covers it entirely with no flash or layout shift.
        backgroundImage: lqip && !loaded ? `url("${lqip}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.4s ease',
        opacity: loaded || !lqip ? 1 : 0.85,
        ...style,
      }}
    />
  )
}
