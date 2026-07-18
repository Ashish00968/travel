# 5. Trust & Governance Matrix

> **Decision-Making Risk Framework:** Defines autonomy levels (**Automate, Augment, Consult, Own**) based on the potential stakes if an action fails.

---

## 1. The 4 Trust Levels

```
     HIGH STAKES                                                LOW STAKES
  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
  │   1. OWN      │     │  2. CONSULT   │     │  3. AUGMENT   │     │ 4. AUTOMATE   │
  │ User-Driven   │ ──► │ Plan & Approve│ ──► │ Agent Suggests│ ──► │ Autonomous    │
  │ Authorization │     │ Before Exec   │     │ & Executes    │     │ Execution     │
  └───────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

---

## 2. Governance Matrix & Action Assignment

### Level 1: OWN (User-Controlled / Explicit Permission Required)
* **Risk:** High (Irreversible data loss, financial cost, security breach).
* **Actions:**
  - Revoking or deleting API keys in cloud consoles.
  - Deleting Git branches or force-pushing to remote repositories (`git push --force`).
  - Installing untrusted third-party global packages.

### Level 2: CONSULT (Plan & Approve First)
* **Risk:** Medium-High (Architectural shifts, breaking changes).
* **Actions:**
  - Major directory restructuring or renaming core components.
  - Introducing new major dependencies to `package.json`.
  - Modifying the core data schema in `src/data/himalaya.ts`.

### Level 3: AUGMENT (Agent Proposes & Executes, User Reviews)
* **Risk:** Medium-Low (Component creation, styling updates).
* **Actions:**
  - Building new React components or pages (`HorizonPage`, `PlacePage`).
  - Refactoring animations, hover effects, and CSS styling.
  - Updating Zustand state logic or utility functions.

### Level 4: AUTOMATE (Full Agent Autonomy)
* **Risk:** Minimal (Formatting, typing, documentation).
* **Actions:**
  - Running TypeScript type checks (`npx tsc --noEmit`).
  - Formatting code and updating `.gitignore` rules.
  - Creating `.env.example` templates and writing documentation in `info/`.
