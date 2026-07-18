# 2. Tools & Security Scope Management

> **Security & Permission Boundaries:** Defines how tools, credentials, and environment scopes are managed safely without security breaches or billing surprises.

---

## 1. Tool Scopes & Permissions

| Tool Category | Permitted Actions | Guardrails / Scope Restrictions |
| :--- | :--- | :--- |
| **File Reading (`view_file`, `list_dir`)** | Full read access to workspace files | Never display raw `.env` secret keys in summaries. |
| **File Editing (`replace_file_content`)** | Edit existing source code, docs | Always maintain code syntax and formatting. |
| **File Creation (`write_to_file`)** | Create new components, docs | Maintain project directory structure. |
| **Command Execution (`run_command`)** | Build checks (`npx tsc`), git commands | **NO destructive commands** (`rm -rf`, `git reset --hard`) without confirmation. |

---

## 2. Secrets & Credential Isolation

```
           ┌─────────────────────────────────────────┐
           │        LOCAL MACHINE ONLY (.env)        │
           │  VITE_MAPS_API_KEY=AIzaSy...             │
           │  VITE_MAPBOX_TOKEN=pk.ey...             │
           └────────────────────┬────────────────────┘
                                │ (Blocked by .gitignore)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 ┌───────────────┐                             ┌───────────────┐
 │   GIT / REPO  │ ◄─── [.env.example] ─────── │ PUBLIC BUILD  │
 │  (No Secrets) │                             │   (Netlify)   │
 └───────────────┘                             └───────────────┘
```

1. **Strict Git Exclusion:** `.env` and `.env.*` are ignored in `.gitignore`.
2. **Template Blueprint:** `.env.example` provides parameter names without values.
3. **Frontend Exposure Warning:** Any `VITE_` variable is exposed to browser DevTools on public builds.
4. **Cloud Referrer Restrictions:** All production keys in Google Cloud Console and Mapbox must be restricted to allowed HTTP Referrers (`https://*.netlify.app/*`, `http://localhost:*`).
5. **Quota Caps:** Set daily billing limits in Google Cloud Console to cap exposure.
