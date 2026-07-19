# Pahadi Trails — Technical Documentation & Agent Handoff

> **Master Architecture & Agent Guide:** Primary context, technology stack, design system, component reference, security architecture, and operational handoff for *Pahadi Trails — Himalayan Travel Atlas*.

---

## 1. Project Overview

- **Name:** Pahadi Trails — Himalayan Travel Atlas  

- **URL (dev):** `http://localhost:5173`  
- **Repo Root:** `/Users/apple/Documents/Development/Websites/travelglb`  
- **Type:** Vite + React 19 + TypeScript SPA  
- **Dev Server:** `npm run dev` (Port 5173)  
- **Deployment:** Vercel (static build) / GitHub Pages  

---

## 2. Agent Operating System & Identity

The project's operating playbook, design vision, skill workflows, memory protocol, and trust matrix are organized inside the [`info/Identity/`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity) directory:

- **[`Identity/IDENTITY.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/IDENTITY.md):** Dedicated identity file defining Ashish's creative design vision, AI Co-Pilot persona (Antigravity), and core technology stack.
- **[`Identity/README.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/README.md):** Operational playbook indexing the 8-Step Skill Lifecycle, Memory Learning Protocol, and Trust Risk Matrix (**Automate, Augment, Consult, Own**).

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind v4 (via `@tailwindcss/vite`) + Vanilla CSS tokens in `src/index.css` |
| Animation | Framer Motion v12 + tailored cubic-bezier easing tokens |
| Map & 3D | Mapbox GL JS (`mapbox-gl`) + 1.5× DEM terrain elevation |
| State | Zustand (`gridStore`, `mapStore`, `themeStore`) |
| Router | React Router v7 |
| Images | Cloudinary CDN (`q_auto, f_auto`) |
| Build | Vite with esbuild minifier, Rollup manual chunking for `mapbox-gl` + `@turf` |

---

## 4. Repository Structure

```
travelglb/
├── info/
│   ├── Identity/
│   │   ├── IDENTITY.md       ← Ashish's creative vision & agent persona
│   │   └── README.md         ← Skills, Memory protocol, and Trust matrix
│   ├── Technical_Report.html ← Complete v14.0 HTML specification
│   └── README.md             ← THIS FILE (Master documentation & handoff)
├── src/
│   ├── components/           ← All UI components
│   │   ├── Cursor.tsx        ← Dual-ring magnetic cursor
│   │   ├── Navbar.tsx        ← Mobile hamburger + desktop nav
│   │   ├── Hero.tsx          ← Landing section with scroll animations
│   │   ├── ExpeditionGrid.tsx← 3-level grid (states → subregions → places)
│   │   ├── About.tsx         ← Journal + thematic nav cards
│   │   ├── MapSection.tsx    ← Lazy map loader + header
│   │   ├── MapPreviewTeaser.tsx ← Satellite preview with pulse pins
│   │   ├── MapContainer.tsx  ← Persistent Mapbox GL JS instance
│   │   ├── RegionPanel.tsx   ← Sidebar for active map region
│   │   ├── Footer.tsx        ← SVG draw-on mountain silhouette
│   │   ├── AnimatedWord.tsx  ← Word-level reveal animation
│   │   ├── OptimizedImage.tsx← LQIP progressive image loader
│   │   └── MapErrorBoundary.tsx
│   ├── pages/
│   │   ├── HorizonPage.tsx   ← Expedition wishlist/checklist
│   │   └── PlacePage.tsx     ← Individual place detail + trek narrative
│   ├── data/
│   │   └── himalaya.ts       ← SINGLE SOURCE OF TRUTH (all regions & places)
│   ├── store/
│   │   ├── gridStore.ts      ← Navigation level & active region IDs
│   │   ├── mapStore.ts       ← Mapbox state & camera flying state
│   │   └── themeStore.ts
│   ├── hooks/
│   │   ├── useReveal.ts      ← IntersectionObserver reveal hook
│   │   └── useMediaQuery.ts  ← SSR-safe media query hook
│   ├── lib/
│   │   ├── cloudinary.ts     ← Cloudinary URL builders
│   │   └── mapUtils.ts       ← Camera flyovers & trek path drawing
│   ├── App.tsx               ← Router & persistent homepage DOM container
│   └── index.css             ← Tokens, keyframes, component CSS classes
├── .env.example              ← Safe environment template (keyless)
├── .gitignore                ← Excludes secrets (.env), build outputs, and reports
└── vite.config.ts            ← Rollup chunking config
```

---

## 5. Security & Secret Isolation Rules

1. **Environment Isolation:** `.env` remains strictly local on your machine and is ignored by `.gitignore`.
2. **Public Blueprint:** `.env.example` provides parameter names (`VITE_MAPS_API_KEY`, `VITE_MAPBOX_TOKEN`) without real keys.
3. **Frontend Exposure Awareness:** `VITE_` prefixed variables are compiled into client JS bundles.
4. **Cloud Referrer Restrictions:** Google Cloud Console & Mapbox tokens must have **HTTP Referrer restrictions** (`https://*.netlify.app/*`, `http://localhost:*`) and billing quota caps enforced.

---

## 6. Design System & Craft Rules

### Easing Tokens (use in CSS and Framer Motion)
```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);   /* Default strong deceleration */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* Symmetric snap */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* Slide-in panels */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);/* Overshoot bounce */
```

### Typography & Palette
- **Headings:** Playfair Display (serif, italic) / Bricolage Grotesque
- **UI Labels:** Space Mono (monospace)
- **Body:** DM Sans
- **Colors:** Primary Gold (`#e8c97a`), Gold Alt (`#e5c158`), Teal (`#4ab8a0`), Background Deep (`#06080c`), Card Surface (`#0b0f16`).

---

## 7. Data Architecture — `himalaya.ts`

The entire app's content lives in `src/data/himalaya.ts`:
```
HIMALAYA_REGIONS[]
  └── HimalayaRegion { id, name, subregions, showSubRegionsFirst, badge, cardDesc }
        └── HimalayaSubRegion { id, name, places, camera }
              └── HimalayaPlace { id, name, lat, lng, type, image, trekStops, trekPath }
                    └── TrekStop ('text' | 'photo' | 'video' | 'summit')
```
**4 Regions:** `jammu-kashmir`, `himachal-pradesh`, `ladakh`, `uttarakhand`.  
Use `PLACE_INDEX` exported from `himalaya.ts` for $O(1)$ flat lookups.

---

## 8. Key Components & Architecture

### `ExpeditionGrid.tsx`
- 3-level navigation state: `states → subregions → places`.
- `StateCard`: 3D cursor tilt + shimmer sweep.
- `PlaceCard`: Parallax image (0.5× inverse cursor) + gradient overlay.

### `MapContainer.tsx` (Lazy Loaded & Persistent)
- Mapbox GL JS instance with 1.5× DEM elevation.
- Never unmounted: parent `App.tsx` hides container via `display: none` to prevent 2–3s reload latency.

### `Cursor.tsx`
- Dual ring: 8px dot + 36px ring (spring lerp 0.14).
- rAF loop writes directly to DOM without React re-renders.
- Pulls toward any `[data-magnetic]` element.

---

## 9. Navigation State & Back-Button Protocol

| Entry Point | `state.from` set to | PlacePage Back-Nav Destination |
|---|---|---|
| Map marker | `'map'` | `'/'` (scrolls to map section) |
| Grid card | `'grid'` | `'/'` (scrolls to grid section) |
| RegionPanel | `'map'` | `'/'` (scrolls to map section) |

Scroll position is saved to `sessionStorage` key `mapScrollY` before navigating away from home.

---

## 10. Session Evolution Log

| Version | Focus Area | Highlights |
|---|---|---|
| **v12.0** | UI/UX Engine | Easing tokens, dual-ring cursor, scroll reveals, SVG mountain draw-on |
| **v12.1** | Build Optimization | Resource preloading, preconnect hints, cleanup of obsolete temp scripts |
| **v12.2** | Trek Expansions | Kedarnath 16km trail & Vasudhara Falls 6km route in Garhwal Himalayas |
| **v12.3** | Media Refinements | Zero-layout-shift aspect ratios on trek stops (`aspectRatio: stop.aspectRatio`) |
| **v13.0** | Code Optimization | Extracted inline `<style>` to `index.css`, memoized `matchMedia`, font preloads, security headers |
| **v14.0** | Security & Agent OS | `.env` isolation, `.env.example`, 5-pillar agent operating framework in `info/Identity/` |

---

## 11. Running & Building the Project

```bash
cd /Users/apple/Documents/Development/Websites/travelglb

# Start development server
npm run dev

# Run TypeScript type check (must be 0 errors before committing)
npx tsc --noEmit

# Build production bundle
npm run build
```

---

*Last updated: July 19, 2026 — v14.0 Security & Agent Operating System Edition*  
*Agent: Antigravity (Google DeepMind)*
