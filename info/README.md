# Pahadi Trails — Technical Documentation & Handoff Playbook

> **Master Architecture & Agent Guide:** Unified specification mapping out project architecture, directory structures, design guidelines, security controls, and our 5-pillar operating framework (Identity, Skills, Memory, Trust).

---

## 1. Project & Agent Directory Index

- **📁 [`Identity/IDENTITY.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/IDENTITY.md):** Dedicated identity file defining Ashish's creative design vision, AI Co-Pilot persona (Antigravity), and core technology stack.
- **📄 [`context.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/context.md):** Model context resource containing design tokens, known guardrails, and the Mistakes & Learnings Ledger.
- **📄 [`Technical_Report.html`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Technical_Report.html):** Comprehensive v14.0 HTML specification detailing animation timings, Mapbox systems, performance metrics, and headers.

---

## 2. Project Overview & Tech Stack

- **Project Name:** Pahadi Trails — Himalayan Travel Atlas  
- **URL (dev):** `http://localhost:5173`  
- **Repo Root:** `/Users/apple/Documents/Development/Websites/travelglb`  
- **Type:** Vite + React 19 + TypeScript SPA  
- **Deployment:** Vercel (static build) / GitHub Pages  

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

## 3. Skills & Execution Lifecycle

### The 8-Step Task Lifecycle
1. **Understand Objective:** Deeply analyze intent, target experience, and boundaries.
2. **Analyze Codebase:** Query files and components—never guess when the code holds the answer.
3. **Select Skill / Workflow:** Pick the optimal approach for UI animation, 3D geospatial, or state refactors.
4. **Decompose Work:** Break complex tasks into small, verified component milestones.
5. **Follow Established Patterns:** Reuse components (`AnimatedWord`, `Cursor`, `OptimizedImage`) and CSS tokens.
6. **Produce Production Code:** Write clean, modular, typed React 19 / TypeScript code.
7. **Verify Correctness:** Run `npx tsc --noEmit` and check for visual regression & responsiveness.
8. **Reflect & Refine:** Capture newly learned workflows into the Mistakes & Learnings Ledger.

### Hard Quality Gates
- **Zero TypeScript Errors:** Verified via `npx tsc --noEmit`.
- **CSS Easing Tokens:** Use `--ease-out`, `--ease-drawer`, and `--ease-spring` (never generic string easings).
- **Press Feedback:** Every interactive element has `:active { transform: scale(0.97) }`.
- **Spatial Physics:** Enter animations start at `scale(0.92+)` and `opacity: 0`, never `scale(0)`.
- **Map Container Persistence:** `MapContainer.tsx` is never unmounted (`display: none` pattern in `App.tsx`).

---

## 4. Memory & Learning Protocol

### Feedback Internalization
When explicit feedback is shared (e.g. *"Remember this: ..."* or *"Always do X"*), the agent immediately persists the rule to the local memory layer and applies it automatically on all future tasks.

### Core Learned Memories
- **Security:** `.env` remains strictly local and ignored in `.gitignore`. `.env.example` serves as the public template.
- **Key Restrictions:** All client-side keys (Google Cloud, Mapbox) MUST have HTTP Referrer restrictions and budget quotas configured.
- **Single Data Source:** All regions, places, and trek stops live inside `src/data/himalaya.ts`.

---

## 5. Trust & Governance Matrix

```
     HIGH STAKES                                                LOW STAKES
  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
  │   1. OWN      │     │  2. CONSULT   │     │  3. AUGMENT   │     │ 4. AUTOMATE   │
  │ User-Driven   │ ──► │ Plan & Approve│ ──► │ Agent Suggests│ ──► │ Autonomous    │
  │ Authorization │     │ Before Exec   │     │ & Executes    │     │ Execution     │
  └───────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

- **1. OWN (User Authorization Required):** Deleting/revoking API keys in cloud consoles, force-pushing git branches, deleting production data.
- **2. CONSULT (Plan & Approve First):** Major directory restructuring, adding new npm packages, altering core data schemas in `himalaya.ts`.
- **3. AUGMENT (Agent Proposes & Executes):** Building new UI components, styling refactors, updating Zustand stores or animation hooks.
- **4. AUTOMATE (Full Autonomy):** Formatting, `npx tsc --noEmit` type checks, updating `.gitignore` & `.env.example`, documentation updates.

---

## 6. Repository Structure

```
travelglb/
├── info/
│   ├── Identity/
│   │   └── IDENTITY.md       ← Ashish's creative vision & agent persona
│   ├── context.md            ← Model context and Mistakes & Learnings Ledger
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

## 7. Security & Secret Isolation Rules

1. **Environment Isolation:** `.env` remains strictly local on your machine and is ignored by `.gitignore`.
2. **Public Blueprint:** `.env.example` provides parameter names (`VITE_MAPS_API_KEY`, `VITE_MAPBOX_TOKEN`) without real keys.
3. **Frontend Exposure Awareness:** `VITE_` prefixed variables are compiled into client JS bundles.
4. **Cloud Referrer Restrictions:** Google Cloud Console & Mapbox tokens must have **HTTP Referrer restrictions** (`https://*.netlify.app/*`, `http://localhost:*`) and billing quota caps enforced.

---

## 8. Design System & Craft Rules

### Easing Tokens
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

## 9. Data Architecture — `himalaya.ts`

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

## 10. Key Components & Architecture

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

## 11. Navigation State & Back-Button Protocol

| Entry Point | `state.from` set to | PlacePage Back-Nav Destination |
|---|---|---|
| Map marker | `'map'` | `'/'` (scrolls to map section) |
| Grid card | `'grid'` | `'/'` (scrolls to grid section) |
| RegionPanel | `'map'` | `'/'` (scrolls to map section) |

Scroll position is saved to `sessionStorage` key `mapScrollY` before navigating away from home.

---

## 12. Session Evolution Log

| Version | Focus Area | Highlights |
|---|---|---|
| **v12.0** | UI/UX Engine | Easing tokens, dual-ring cursor, scroll reveals, SVG mountain draw-on |
| **v12.1** | Build Optimization | Resource preloading, preconnect hints, cleanup of obsolete temp scripts |
| **v12.2** | Trek Expansions | Kedarnath 16km trail & Vasudhara Falls 6km route in Garhwal Himalayas |
| **v12.3** | Media Refinements | Zero-layout-shift aspect ratios on trek stops (`aspectRatio: stop.aspectRatio`) |
| **v13.0** | Code Optimization | Extracted inline `<style>` to `index.css`, memoized `matchMedia`, font preloads, security headers |
| **v14.0** | Security & Agent OS | `.env` isolation, `.env.example`, 5-pillar agent operating framework in `info/Identity/` |

---

## 13. Running & Building the Project

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
