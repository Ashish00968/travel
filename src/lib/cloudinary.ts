/* ═══════════════════════════════════════════════════════════════
 *  lib/cloudinary.ts
 *  Central Cloudinary URL factory — single source of truth for
 *  all image/video URLs so no raw strings live in data files.
 * ═══════════════════════════════════════════════════════════════ */

const CLOUD_NAME = 'dehriwm1o'
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`

/** Standard transforms applied to every delivered image. */
const IMG_TRANSFORMS = 'q_auto,f_auto'

/** Low-res blur placeholder: tiny 50 px wide + heavy blur — inlined as src
 *  on first paint so layout never shifts when the real image loads. */
const PLACEHOLDER_TRANSFORMS = 'w_50,e_blur:200,q_10,f_auto'

// ─── Image URLs ────────────────────────────────────────────────

/**
 * Build a Cloudinary image URL for the travelglb project.
 *
 * Folder convention:  travelglb/{regionId}/{subregionId}/{placeId}/{filename}
 *
 * @example
 *   buildCloudinaryUrl('himachal-pradesh', 'kullu', 'patalsu-peak', '14SummitSelfie')
 *   // → https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/travelglb/himachal-pradesh/kullu/patalsu-peak/14SummitSelfie.jpg
 */
export function buildCloudinaryUrl(
  regionId: string,
  subregionId: string,
  placeId: string,
  filename: string,
  ext: 'jpg' | 'png' | 'webp' = 'jpg',
): string {
  return `${BASE}/image/upload/${IMG_TRANSFORMS}/travelglb/${regionId}/${subregionId}/${placeId}/${filename}.${ext}`
}

/**
 * Same as buildCloudinaryUrl but returns the blurred low-res placeholder URL.
 * Use this as the initial `src` before the real image loads.
 */
export function buildCloudinaryPlaceholder(
  regionId: string,
  subregionId: string,
  placeId: string,
  filename: string,
  ext: 'jpg' | 'png' | 'webp' = 'jpg',
): string {
  return `${BASE}/image/upload/${PLACEHOLDER_TRANSFORMS}/travelglb/${regionId}/${subregionId}/${placeId}/${filename}.${ext}`
}

/**
 * Build a placeholder URL from any existing full Cloudinary image URL
 * by injecting the blur/resize transforms.  Handles both the old flat
 * structure (pre-refactor) and the new hierarchical structure.
 *
 * @example
 *   blurPlaceholderFromUrl('https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/14SummitSelfie.jpg')
 *   // → https://res.cloudinary.com/dehriwm1o/image/upload/w_50,e_blur:200,q_10,f_auto/14SummitSelfie.jpg
 */
export function blurPlaceholderFromUrl(url: string): string {
  // Replace the transform segment between /upload/ and the public-id path.
  // Works for any Cloudinary URL regardless of how many transform parts there are.
  return url.replace(/\/upload\/[^/]+\//, `/upload/${PLACEHOLDER_TRANSFORMS}/`)
}

// ─── Video URLs ────────────────────────────────────────────────

/**
 * Build a Cloudinary *video* URL.
 *
 * @example
 *   buildCloudinaryVideoUrl('himachal-pradesh', 'kullu', 'patalsu-peak', 'Patalsu_jl6jxg', 'mp4')
 */
export function buildCloudinaryVideoUrl(
  regionId: string,
  subregionId: string,
  placeId: string,
  publicId: string,
  ext: 'mp4' | 'webm' = 'mp4',
): string {
  return `${BASE}/video/upload/q_auto:eco,f_auto,w_1280/travelglb/${regionId}/${subregionId}/${placeId}/${publicId}.${ext}`
}

// ─── Legacy / root-level helpers (for assets not yet migrated) ─

/**
 * Build a URL for a root-level Cloudinary asset (no folder prefix).
 * Used for region thumbnails and other global assets.
 */
export function buildRootCloudinaryUrl(publicId: string, ext: 'png' | 'jpg' | 'webp' = 'jpg'): string {
  return `${BASE}/image/upload/${IMG_TRANSFORMS}/${publicId}.${ext}`
}
