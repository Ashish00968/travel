# Project Information & Documentation

This folder contains project documentation, technical reports, working guidelines, and skill execution frameworks for the Himalayan Travel Atlas application.

## Documentation Index

### 📁 [`Identity/`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity)
- **[`IDENTITY.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/IDENTITY.md)**: AI Agent identity, creator profile (Ashish), design engineering rules (Emil Kowalski philosophy), and core stack definitions.
- **[`SKILLS.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/SKILLS.md)**: 8-Step task lifecycle, autonomous decision-making principles, skill registry, and continuous workflow refinement process.
- **[`WORKING_AGREEMENT.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Identity/WORKING_AGREEMENT.md)**: Collaboration protocols, workflow diagram, communication standards, and quality review checklists.

### 📄 Core Docs
- **[`Technical_Report.html`](file:///Users/apple/Documents/Development/Websites/travelglb/info/Technical_Report.html)**: Comprehensive specification of UI/UX, section specs, map configuration, animation timings, and component structures.
- **[`agentInfo.md`](file:///Users/apple/Documents/Development/Websites/travelglb/info/agentInfo.md)**: Context and architecture reference for AI coding agents and pair-programming handoffs.

## Security Overview

- Environment variables and secret API keys are managed in `.env` (local only, ignored in `.gitignore`).
- Use `.env.example` as a template for required keys (`VITE_MAPS_API_KEY`, `VITE_MAPBOX_TOKEN`).
- Ensure all client-side API keys have **HTTP Referrer restrictions** configured in Google Cloud Console and Mapbox Dashboards.
