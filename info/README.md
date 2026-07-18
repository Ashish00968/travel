# Project Information & Documentation

This folder contains project documentation, technical reports, and working guidelines for the Himalayan Travel Atlas application.

## Documentation Index

### 📁 [`Identity/`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity)
- **[`IDENTITY.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/IDENTITY.md)**: AI Agent identity, partner profile (Ashish), design engineering rules (Emil Kowalski philosophy), and core stack definitions.
- **[`WORKING_AGREEMENT.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/WORKING_AGREEMENT.md)**: Collaboration protocols, workflow diagram, communication standards, and quality review checklists.

### 📄 Core Docs
- **[`Technical_Report.html`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Technical_Report.html)**: Comprehensive specification of UI/UX, section specs, map configuration, animation timings, and component structures.
- **[`agentInfo.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/agentInfo.md)**: Context and architecture reference for AI coding agents and pair-programming handoffs.

## Security Overview

- Environment variables and secret API keys are managed in `.env` (local only, ignored in `.gitignore`).
- Use `.env.example` as a template for required keys (`VITE_MAPS_API_KEY`, `VITE_MAPBOX_TOKEN`).
- Ensure all client-side API keys have **HTTP Referrer restrictions** configured in Google Cloud Console and Mapbox Dashboards.
