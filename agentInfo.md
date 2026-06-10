# agentInfo.md — Peaks & Paths: Himalayan Atlas
**Handoff document for the next agent. Read this entirely before touching any file.**

---

## 1. Project Overview

**Name:** Peaks & Paths — My Himalayan Travel Journal  
**URL (dev):** `http://localhost:5173`  
**Repo root:** `/Users/apple/Documents/Websites/travelglb`  
**Type:** Vite + React 18 + TypeScript SPA  
**Deployed via:** Vercel (static build)  
**Dev server:** `npm run dev` (runs on port 5173)

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind v4 (via `@tailwindcss/vite`) + Vanilla CSS in `index.css` |
| Animation | Framer Motion v11 + CSS transitions |
| Map | Mapbox GL JS (`mapbox-gl`) |
| State | Zustand (`gridStore`, `mapStore`, `themeStore`) |
| Router | React Router v7 |
| Images | Cloudinary CDN (`q_auto,f_auto`) |
| Icons | Lucide React |
| Build | Vite with Rollup manual chunking for `mapbox-gl` |

---

## 3. Repository Structure

```
travelglb/
├── src/
│   ├── components/          ← All UI components
│   │   ├── Cursor.tsx       ← Dual-ring magnetic cursor
│   │   ├── Navbar.tsx       ← Mobile hamburger + desktop nav
│   │   ├── Hero.tsx         ← Landing section with scroll animations
│   │   ├── ExpeditionGrid.tsx ← 3-level grid (states → subregions → places)
│   │   ├── About.tsx        ← Journal + thematic nav cards
│   │   ├── MapSection.tsx   ← Lazy map loader + header
│   │   ├── MapPreviewTeaser.tsx ← Satellite preview with pulse pins
│   │   ├── MapContainer.tsx ← Mapbox GL JS instance (lazily loaded)
│   │   ├── RegionPanel.tsx  ← Sidebar for active map region
│   │   ├── Footer.tsx       ← SVG draw-on mountain silhouette
│   │   ├── AnimatedWord.tsx ← Word-level reveal animation
│   │   ├── OptimizedImage.tsx ← LQIP progressive image loader
│   │   └── MapErrorBoundary.tsx
│   ├── pages/
│   │   ├── HorizonPage.tsx  ← Expedition wishlist/checklist
│   │   └── PlacePage.tsx    ← Individual place detail + trek narrative
│   ├── data/
│   │   └── himalaya.ts      ← SINGLE SOURCE OF TRUTH — all places, regions, trek stops
│   ├── store/
│   │   ├── gridStore.ts     ← viewLevel, activeRegId, activeSubRegId
│   │   ├── mapStore.ts      ← Mapbox state (activeRegionId, activeSubRegionId, flyingTo)
│   │   └── themeStore.ts
│   ├── hooks/
│   │   ├── useReveal.ts     ← IntersectionObserver reveal hook
│   │   └── useMediaQuery.ts ← SSR-safe media query hook
│   ├── lib/
│   │   ├── cloudinary.ts    ← URL builders
│   │   └── mapUtils.ts      ← flyToCamera, drawTrekPath
│   ├── App.tsx              ← Routes + persistent homepage DOM trick
│   └── index.css            ← Design system: tokens, keyframes, component classes
├── Technical_Report.html    ← Architecture doc (now at v12.0)
├── agentInfo.md             ← THIS FILE
└── vite.config.ts           ← Rollup chunking config
```

---

## 4. Design System — Critical Rules

> **Read before touching any animation or CSS.**

### Easing (always use these — never `ease`, `easeOut`, `easeInOut` strings)
```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* Strong deceleration — default */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* Symmetric snap */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* Slide-in panels */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);/* Overshoot bounce */
```

### Typography
| Role | Font | Usage |
|---|---|---|
| Headings | Playfair Display (serif, italic) | `h1`, `h2`, big quotes |
| UI labels | Space Mono (monospace) | Tags, captions, coordinates |
| Body | DM Sans | Descriptions, paragraphs |

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Primary Gold | `#e8c97a` | Headings, CTAs, accents |
| Gold Alt | `#e5c158` | Map pins, pulsing dots |
| Teal | `#4ab8a0` | Completed states, trek path low altitude |
| Background | `#06080c` | Main page background |
| Card BG | `#0b0f16` | Card surface |
| Text main | `#edeae2` | Primary readable text |
| Text muted | `#7a7570` | Secondary text |
| Text dim | `#6a6460` | Tertiary, metadata |

### Emil Kowalski Rules (enforced in v12 — DO NOT revert)
1. **Never use `transition: all`** — always specify exact properties
2. **All pressable elements** need `:active { transform: scale(0.97) }` via the global `.interactive` class or direct CSS
3. **Nothing appears from nothing** — initial state must be `scale(0.92+)` or `opacity(0)` minimum, never `scale(0)`
4. **No infinite animation loops** on primary CTA buttons — ambient loops only on decorative elements
5. **CSS `:hover` first** — only use JS `onMouseEnter` when you need React state or complex spring animations
6. **Always gate hover effects** with `@media (hover: hover) and (pointer: fine)` in CSS

---

## 5. Data Architecture — himalaya.ts

The entire app's content lives in `/src/data/himalaya.ts`. Structure:

```
HIMALAYA_REGIONS[]
  └── HimalayaRegion { id, name, subregions, showSubRegionsFirst, badge, cardDesc, ... }
        └── HimalayaSubRegion { id, name, places, camera }
              └── HimalayaPlace { id, name, lat, lng, type, image, trekStops, trekPath, ... }
                    └── TrekStop (discriminated union: 'text' | 'photo' | 'video' | 'summit')
```

**4 Regions:** `jammu-kashmir`, `himachal-pradesh`, `ladakh`, `uttarakhand`

`showSubRegionsFirst: true` on J&K and Himachal Pradesh (both have multiple sub-regions).  
`PLACE_INDEX` — O(1) flat lookup map exported from the file. Always use this for place lookups.

---

## 6. Key Components — Quick Reference

### `ExpeditionGrid.tsx`
- Uses Zustand `gridStore` for 3-level navigation state: `states → subregions → places`
- `StateCard`: 3D tilt on mouse move + shimmer sweep
- `PlaceCard`: parallax inner image (0.5× inverse cursor) + gradient overlay
- CSS class `cinematic-card` + `shimmer-card` handle all hover effects

### `MapContainer.tsx` (lazy loaded)
- Mapbox GL JS instance — satellite style + DEM terrain exaggeration 1.5×
- Persistent: never unmounted — parent `App.tsx` hides via `display: none`
- `mapStore` (Zustand) holds: `activeRegionId`, `activeSubRegionId`, `flyingTo`
- Camera system: south-offset view, pitch 75°, bearing ~0° (due north)

### `Cursor.tsx`
- Dual ring: 8px dot (instant) + 36px ring (spring lerp factor 0.14)
- rAF loop writes directly to DOM — zero React re-renders on mouse move
- Magnetic: pulls ring toward center of any `[data-magnetic]` element

### `HorizonPage.tsx`
- localStorage key: `explore_wishlist` (JSON array of `WishlistPlace`)
- Expandable checklist items with AnimatePresence drawer
- Progress bar uses `clip-path` to fill proportionally

### `PlacePage.tsx`
- Back navigation: checks `location.state.from` — routes back to either `/` (map) or `/` (grid section)
- Trek narrative driven by `trekStops[]` on each place — scroll-linked

---

## 7. Navigation State — Back-Button Protocol

| Entry Point | `state.from` set to | PlacePage back-nav destination |
|---|---|---|
| Map marker | `'map'` | `'/'` (scroll to map section) |
| Grid card | `'grid'` | `'/'` (scroll to grid section) |
| RegionPanel | `'map'` | `'/'` (scroll to map section) |

Scroll position is saved to `sessionStorage` key `mapScrollY` before navigating away from home.

---

## 8. Animation Patterns — How We Animate

### For enter animations (IntersectionObserver-triggered):
```tsx
const { ref, isInView } = useReveal({ margin: '-60px' })
// Framer motion with isInView gate:
<motion.div animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} />
```

### For hover effects on cards:
```tsx
// CSS class (preferred) — no JS state:
<div className="cinematic-card shimmer-card" />
// CSS in index.css:
// @media (hover: hover) { .cinematic-card:hover { transform: translateY(-8px); } }
```

### For staggered children:
```tsx
<motion.div variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
  {items.map(item => <motion.div key={item.id} variants={cardVariants} />)}
</motion.div>
```

### Framer Motion easing (always use array form):
```tsx
transition: { ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
```

---

## 9. Cloudinary — Image URL Patterns

**Cloud name:** `dehriwm1o`  
**Base URL:** `https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/`

```typescript
// Root-level named assets (region thumbnails, trek stop photos):
buildRootCloudinaryUrl('manali', 'png')
// → https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/manali.png

// LQIP placeholder (50px blurred):
blurPlaceholderFromUrl(url)
// → replaces /upload/[transform]/ with /upload/w_50,e_blur:200,q_10,f_auto/
```

Region thumbnails used in ExpeditionGrid (hardcoded in component):
```
jkMain.png, HimachalMain.png, LadakhMain.png, UttrakhandMain.png
```

---

## 10. Mapbox Configuration

**Token:** Stored in `.env` as `VITE_MAPBOX_TOKEN` (not committed)  
**Style:** `mapbox://styles/mapbox/satellite-v9`  
**DEM Source:** `mapbox://mapbox.mapbox-terrain-dem-v1` (tileSize: 512)  
**Terrain exaggeration:** `1.5`  
**Initial view:** `{ lat: 31.0, lng: 77.0, zoom: 5.2, pitch: 65, bearing: 0 }`  
**Max pitch:** 85° (we use 75° as optimal Himalayan angle)

---

## 11. Known Issues / Gotchas

1. **Mapbox must never unmount** — if it does, it takes 2–3s to re-initialize. `App.tsx` uses `display: none` pattern.
2. **`useMediaQuery` must return `false` during SSR** — it does (checks `window !== undefined`).
3. **`as [number, number, number, number]` cast** required when passing cubic-bezier arrays to Framer in TypeScript.
4. **`gridStore` and `mapStore` are separate** — `gridStore` controls the grid UI, `mapStore` controls Mapbox markers.
5. **Region thumbnail images** are hardcoded in `ExpeditionGrid.tsx` `REGION_THUMBNAILS` object (not from data file).
6. **`prefers-reduced-motion`** is handled globally in `index.css` — don't add inline JS checks for it.

---

## 12. What Was Completed in This Session (v12 UI/UX)

All 10 files upgraded, 0 TypeScript errors, dev server running:

| File | What Changed |
|---|---|
| `index.css` | Easing tokens, `:active` scale, shimmer keyframe, map pin ring CSS, hover guards, scrollbar, reduced-motion strategy |
| `Cursor.tsx` | Dual-ring with rAF spring lerp, magnetic interaction, click pulse |
| `AnimatedWord.tsx` | `blur` prop + `charStagger` prop |
| `Navbar.tsx` | Mobile hamburger morph, drawer with stagger, logo rotate, body scroll lock |
| `Hero.tsx` | Scroll indicator, blur-fade words, ambient fog layer, secondary film CTA |
| `ExpeditionGrid.tsx` | CSS hover classes, 3D tilt on state cards, parallax on place cards, 60ms stagger, back button arrow |
| `About.tsx` | Clip-path wipe reveal on card hover, blur quote animation, CSS social pills |
| `MapSection.tsx` | Removed infinite loop, improved loading fallback, improved legend |
| `MapPreviewTeaser.tsx` | Fixed scale origins, CTA overlay scale, ring CSS classes, quieter zoom |
| `Footer.tsx` | SVG `pathLength` draw-on, logo hover rotate, CSS footer-link class |
| `HorizonPage.tsx` | Cinematic hero, progress bar, teal left-border for completed, rotating chevron, form glow |

---

## 13. What Might Still Need Work (Potential Next Tasks)

- [ ] `PlacePage.tsx` — trek narrative section may benefit from the blur-word + parallax treatment
- [ ] Individual place hero images — parallax scroll on the hero banner (similar to Hero.tsx)
- [ ] `RegionPanel.tsx` — sidebar could use the shimmer card treatment and smoother enter/exit
- [ ] Dark/light mode toggle (themeStore exists but UI switcher isn't implemented)
- [ ] Performance audit with Lighthouse — check CLS scores after animation changes
- [ ] Vercel deployment headers for `Cache-Control` on Cloudinary assets

---

## 14. Running the Project

```bash
cd /Users/apple/Documents/Websites/travelglb

# Dev server (already running)
npm run dev

# TypeScript check (must be 0 errors before committing)
npx tsc --noEmit

# Production build
npm run build
```

---

*Last updated: June 10, 2026 — v12.0 UI/UX Premium Engine session*  
*Agent: Antigravity (Google DeepMind)*
