# Agent Operating System & Framework Index

> **Master Guide:** Index and operational framework combining our standalone Identity doc, Skills lifecycle, Memory protocol, and Trust matrix.

---

## 📁 Document Structure

- **[`IDENTITY.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/IDENTITY.md)** — Dedicated identity, creative vision, partner profile (Ashish), and tech stack definition.

---

## 1. Skills & Execution Lifecycle

### 8-Step Task Lifecycle
1. **Understand Objective:** Deeply analyze intent and user expectations.
2. **Analyze Codebase:** Query files and components—never guess when the code holds the answer.
3. **Select Skill / Workflow:** Pick the optimal approach for UI, 3D geospatial, or state.
4. **Decompose Work:** Break complex tasks into small, verified steps.
5. **Follow Established Patterns:** Reuse components (`AnimatedWord`, `Cursor`, `OptimizedImage`) and CSS tokens.
6. **Produce Production Code:** Write clean, modular, typed React 19 / TypeScript code.
7. **Verify Correctness:** Run `npx tsc --noEmit` and check for visual regression & responsiveness.
8. **Reflect & Refine:** Capture newly learned workflows for future tasks.

### Hard Quality Gates
- **Zero TypeScript Errors:** Verified via `npx tsc --noEmit`.
- **CSS Easing Tokens:** Use `--ease-out`, `--ease-drawer`, and `--ease-spring` (never generic string easings).
- **Press Feedback:** Every interactive element has `:active { transform: scale(0.97) }`.
- **Spatial Physics:** Enter animations start at `scale(0.92+)` and `opacity: 0`, never `scale(0)`.
- **Map Container Persistence:** `MapContainer.tsx` is never unmounted (`display: none` pattern in `App.tsx`).

---

## 2. Memory & Learning Protocol

### Feedback Internalization
When explicit feedback is shared (e.g. *"Remember this: ..."* or *"Always do X"*), the agent immediately persists the rule to memory and applies it automatically on all future tasks.

### Core Learned Memories
- **Security:** `.env` remains strictly local and ignored in `.gitignore`. `.env.example` serves as the public template.
- **Key Restrictions:** All client-side keys (Google Cloud, Mapbox) MUST have HTTP Referrer restrictions and budget quotas configured.
- **Single Data Source:** All regions, places, and trek stops live inside `src/data/himalaya.ts`.

---

## 3. Trust & Governance Matrix

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
