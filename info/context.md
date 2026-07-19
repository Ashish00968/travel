# Model Context & Learning Ledger

> **Primary Model Context Resource:** Stored context, architectural mappings, design tokens, and a Mistakes & Learnings Ledger. This file must be read by any AI agent at the start of a session and updated continuously as the codebase evolves.

---

## 1. Project Reference Map

- **Project Name:** Pahadi Trails
- **Concept:** A solo traveller's cinematic 3D travel atlas of the Indian Himalayas (Jammu & Kashmir, Himachal Pradesh, Ladakh, Uttarakhand).
- **Core Vision:** Ashish's personal creative vision—fueled by a passion for high-craft, cinematic UI/UX, fluid micro-interactions, dark-mode elegance, and zero-layout-shift performance.

### Tech Stack Blueprint
- **Framework:** React 19 + Vite 8 + TypeScript (strict mode)
- **Styling:** Tailwind v4 + custom Vanilla CSS design tokens in `src/index.css`
- **Animation:** Framer Motion v12 + tailored cubic-bezier easing tokens
- **Map & 3D:** Mapbox GL JS (satellite-v9 style + 1.5× DEM terrain exaggeration)
- **State:** Zustand (`gridStore`, `mapStore`, `themeStore`)
- **Media CDN:** Cloudinary (`dehriwm1o` cloud, progressive parameters `q_auto, f_auto`)

---

## 2. Directory & Architecture Spec

```
travelglb/
├── info/
│   ├── Identity/
│   │   ├── IDENTITY.md       ← Ashish's creative vision & agent persona
│   │   └── README.md         ← Skills, Memory protocol, and Trust matrix
│   ├── Context.md            ← THIS FILE (Model context & learning ledger)
│   ├── Technical_Report.html ← Complete HTML tech spec
│   └── README.md             ← Master documentation & handoff index
├── src/
│   ├── components/           ← Core UI Components
│   │   ├── Cursor.tsx        ← Dual-ring magnetic spring cursor (rAF loop)
│   │   ├── Navbar.tsx        ← Hamburger drawer, scrolled bg toggle
│   │   ├── Hero.tsx          ← Entrance words, ambient fog layer, grain overlay
│   │   ├── ExpeditionGrid.tsx← 3D tilt state cards, parallax place cards
│   │   ├── MapContainer.tsx  ← Persistent Mapbox instance (display: none)
│   │   ├── AnimatedWord.tsx  ← Word-level reveal animation
│   │   └── OptimizedImage.tsx← Cloudinary LQIP progressive loader
│   ├── pages/
│   │   ├── HorizonPage.tsx   ← Expedition wishlist (localStorage)
│   │   └── PlacePage.tsx     ← Detail view & scroll-linked trek stops
│   └── data/
│       └── himalaya.ts       ← Single source of truth for all place data
```

---

## 3. Design System Tokens (`index.css`)

### Color Variables
- `var(--primary-gold)`: `#e8c97a` (Headings, primary accents, active states)
- `var(--bg-deep)`: `#06080c` (Global canvas background)
- `var(--card-bg)`: `#0b0f16` (Expedition/place card surfaces)
- `var(--teal)`: `#4ab8a0` (Completed stops, trek path low-altitude highlights)

### Easing Variables
- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (Strong deceleration — default)
- `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (Slide-out panels/menus)
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Overshoot rebound)

---

## 4. Known Gotchas & Guardrails

1. **Map Container Lifecycle:** Mapbox GL takes 2–3s to boot. It must **never unmount**. `App.tsx` keeps it mounted in the DOM and toggles visibility via `display: none` when the user navigates away from the map view.
2. **Animation Easing:** Never use default CSS easing strings (e.g. `'ease'`, `'ease-out'`). Always use defined bezier tokens.
3. **No `transition: all`:** Explicitly declare animated properties (e.g. `transition: transform 200ms var(--ease-out)`) to prevent unnecessary paint/reflow overhead.
4. **Zustand Store Separation:** `gridStore` controls the multi-level grid UI navigation state; `mapStore` manages camera flights, active markers, and Mapbox flyTo transitions.

---

## 5. Mistakes & Learnings Ledger (Self-Correction Log)

*This log is updated whenever an implementation error is discovered, ensuring subsequent sessions do not repeat past mistakes.*

| Identified Mistake | Root Cause | Implemented Learning / Correction |
| :--- | :--- | :--- |
| **API Key Exposure ($8,000 Bill)** | Committed `.env` to Git history in initial commits; lacked referrer constraints. | Never commit `.env`. Exclude via `.gitignore`. Set HTTP Referrer constraints and billing limits in Cloud consoles. |
| **Duplicate Style Injections** | JSX inline `<style>` blocks in `Hero.tsx` and `About.tsx` injected style nodes on every mount. | Extract all CSS keyframes, media queries, and utility classes into `index.css`. |
| **Virtual DOM Animation Bloat** | Wrapping Navbar anchors in `motion.a` caused Framer to re-diff elements on every scroll. | Replaced entrance animations with CSS keyframes using staggered delays. |
| **Trek stop layout shifts (CLS)** | Dynamic stop media loading without pre-computed heights caused page shifting. | Added `aspectRatio` metadata to `himalaya.ts` and set responsive dynamic aspect ratios on containers. |
| **FOUT on display headers** | `Bricolage Grotesque` was imported in CSS but missing from the font preloads in `index.html`. | Preload header font stylesheet link in `index.html` head to prevent style flash. |
| **Mapbox Redundant Reloads** | Unmounting the Mapbox component during page navigation created high load latency. | Persistent mounting using `display: none` parent container visibility toggle. |
| **Vite 8 Build Failure** | `esbuild` was missing from `devDependencies` when requested by transpilers under Vite 8. | Explicitly install `esbuild` as a `devDependency` in `package.json`. |

