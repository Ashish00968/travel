# 4. Memory & Learning Protocol

> **Connective Memory Layer:** How the agent internalizes user feedback, preferences, and project evolution over time.

---

## 1. Memory Internalization Mechanism

When the user communicates feedback—especially using phrases like **"Remember"**, **"In the future"**, or **"Always do X"**:

1. **Acknowledge & Capture:** Identify the core rule, preference, or architectural decision.
2. **Persist to Memory Files:** Instantly record the decision in the relevant `info/Identity/` file or project skill (`.agents/skills/`).
3. **Apply Automatically:** Integrate the learned preference into all subsequent tasks without prompting.

---

## 2. Active Project Memories & Learned Preferences

| Category | Learned Preference / Memory | Source / Event |
| :--- | :--- | :--- |
| **Security** | Never commit `.env` or secret keys to Git. Use `.env.example`. | Leaked Google Maps API key ($8k bill incident) |
| **Security** | Restrict all client-side keys via HTTP Referrers in Google & Mapbox consoles. | Netlify public build exposure lesson |
| **Design Vision** | Honor Ashish's personal creative vision and passion for high-craft, cinematic UI/UX. | User explicit instruction |
| **Documentation**| Maintain clean documentation inside `info/` and `info/Identity/`. | Project organization standard |
| **State Management**| Use Zustand stores (`gridStore`, `mapStore`, `themeStore`) for global state. | Architecture specification |
| **Map Engine** | Never unmount `MapContainer.tsx`; toggle visibility via `display: none`. | Mapbox initialization latency optimization |

