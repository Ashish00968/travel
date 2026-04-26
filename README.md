# 🏔️ Himalayan Travel Atlas

A cinematic, interactive 3D travel atlas documenting the Himalayas through high-performance geospatial storytelling. Built with **React**, **TypeScript**, **Mapbox GL JS**, and **Cloudinary**.

## 🚀 Key Features

- **Cinematic 3D Map**: Immersive terrain visualization using Mapbox GL JS with 2.0x exaggeration and atmospheric fog.
- **Hierarchical Storytelling**: Experience-driven navigation from Regions → Sub-regions → Places.
- **Scroll-Linked Trekking**: A custom-built cinematic timeline (`TrekStop`) that syncs narrative, altitude, and media with your scroll position.
- **Earth Studio Transitions**: Seamless integration with Google Earth Studio for cinematic fly-overs.

## 🛠️ Technical Architecture

### 1. Data Layer Refactoring
The application is powered by a central, strictly-typed source of truth (`src/data/himalaya.ts`):
- **Discriminated Unions**: `TrekStop` types (`photo`, `video`, `text`, `summit`) are strictly typed to ensure media requirements are met at compile-time.
- **O(1) Lookups**: A derived `PLACE_INDEX` flat map allows instantaneous location access across the entire hierarchy.

### 2. Media Strategy (Cloudinary)
- **Dynamic Delivery**: All images and videos are served via Cloudinary using a structured folder hierarchy.
- **LQIP (Low Quality Image Placeholders)**: Zero layout shift is achieved by generating tiny, blurred placeholders (`w_50, e_blur:200`) delivered as CSS backgrounds before the high-res assets load.
- **Automatic Optimization**: Real-time format (`f_auto`) and quality (`q_auto`) selection for maximum performance.

### 3. Performance Optimizations
- **Scroll-Band Lookup**: Scroll-linked animations use a pre-bucketed 10% band map to resolve active stops in O(1) time, avoiding expensive array iterations during scrolling.
- **Lazy Loading**: Native lazy loading and asynchronous decoding for all media assets.
- **Component Efficiency**: Memoized grid components and optimized state management via Zustand.

## 📦 Tech Stack

- **Framework**: React 18 (Vite)
- **Typing**: Strict TypeScript
- **Styling**: Vanilla CSS + TailwindCSS (minimal)
- **Animation**: Framer Motion
- **Map**: Mapbox GL JS
- **Media**: Cloudinary + YouTube
- **State**: Zustand

## 📖 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npx tsc --noEmit
```

## 📜 Documentation & Refactoring Notes
Recent refactors focused on removing hardcoded local assets, enforcing strict TypeScript, and implementing O(1) lookup strategies for complex hierarchical data structures.
