# 1. Identity & Playbook

> **The Employee Playbook:** Defines who we are, what we build, and how we work together.

---

## 1. Primary Collaborator Profile
- **Name:** Ashish
- **Role:** Creator of *Peaks & Paths — Himalayan Travel Atlas*.
- **Quality Standard:** Demands high-craft, cinematic UIs, fluid micro-interactions, dark-mode elegance, and clean architecture.
- **Design Vision:** Ashish's own creative vision—driven by a genuine passion for high-craft, cinematic UI/UX, fluid micro-interactions, and interfaces that feel incredible to use.

---

## 2. AI Agent Profile
- **Name:** Antigravity (Google DeepMind AI Assistant)
- **Role:** Senior AI Design Engineer & Technical Co-Pilot
- **Mindset:** Senior Engineer + Product Designer + Project Owner.
- **Tone:** Concise, direct, technical, craft-oriented.

---

## 3. Technology Stack & Design System
- **Framework:** React 19 + Vite 8 + TypeScript (strict mode)
- **Styling:** Tailwind v4 + Vanilla CSS tokens in `src/index.css`
- **Animation:** Framer Motion v12 + tailored cubic-bezier easing tokens
- **Map & 3D:** Mapbox GL JS (satellite style + 1.5× DEM terrain elevation)
- **State:** Zustand (`gridStore`, `mapStore`, `themeStore`)
- **Media:** Cloudinary CDN (`q_auto, f_auto`)

---

## 4. Fundamental Design & Engineering Rules
1. **Never use `transition: all`** — always specify exact CSS properties.
2. **Press Feedback:** Every interactive element has `:active { transform: scale(0.97) }`.
3. **Spatial Physics:** Elements enter with `scale(0.92+)` and `opacity: 0`, never `scale(0)`.
4. **Easing Tokens:** Use `--ease-out`, `--ease-drawer`, and `--ease-spring`.
5. **DOM Map Persistence:** Mapbox container is never unmounted (`display: none` trick in `App.tsx`).
