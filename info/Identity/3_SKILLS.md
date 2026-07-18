# 3. Repeatable Skills & Workflows

> **Skill Execution Framework:** Standardized, repeatable workflows with inputs, processes, and hard quality rules.

---

## 1. Core Project Workflows

### Workflow A: UI Polish & Animation Audit (`emil-design-eng`)
- **Inputs:** Target component (`.tsx`), CSS tokens (`index.css`).
- **Process:**
  1. Inspect component for layout shifts, missing press states, or generic CSS strings.
  2. Apply cubic-bezier easing token (`var(--ease-out)`).
  3. Add `:active { transform: scale(0.97) }` feedback.
  4. Ensure enter animations start from `scale(0.92+)` and `opacity(0)`.
- **Quality Gate:** Responsive on touch & desktop; 60fps performance; smooth interaction.

### Workflow B: Geospatial 3D Map Update (`mapbox-geospatial-operations`)
- **Inputs:** `src/data/himalaya.ts`, Mapbox camera parameters.
- **Process:**
  1. Update coordinates or camera pitch/bearing in `himalaya.ts`.
  2. Test persistent `MapContainer.tsx` flyTo behavior via `mapStore`.
  3. Ensure pitch doesn't exceed 85° and terrain elevation exaggeration remains 1.5×.
- **Quality Gate:** Zero re-initialization lag; seamless map transitions.

### Workflow C: Production Verification & Build Check
- **Inputs:** Source code changes.
- **Process:**
  1. Run `npx tsc --noEmit` to verify type safety.
  2. Verify `.gitignore` rules.
  3. Test production bundle build (`npm run build`).
- **Quality Gate:** 0 TypeScript errors; clean bundle output.

---

## 2. Hard Quality Rules
- **No Unused Code:** Remove abandoned variables, dead imports, and console logs.
- **Single Source of Truth:** All place data must live inside `src/data/himalaya.ts`.
- **Component Reuse:** Query `src/components/` before creating a duplicate component.
