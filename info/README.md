# Project Information & Documentation

This folder contains project documentation and technical reports for the Himalayan Travel Atlas application.

## Documentation Index

- **`Technical_Report.html`**: Comprehensive specification of UI/UX, section specs, map configuration, animation timings, and component structures.
- **`agentInfo.md`**: Context and architecture reference for AI coding agents and pair-programming handoffs.

## Security Overview

- Environment variables and secret API keys are managed in `.env` (local only, ignored in `.gitignore`).
- Use `.env.example` as a template for required keys (`VITE_MAPS_API_KEY`, `VITE_MAPBOX_TOKEN`).
- Ensure all client-side API keys have **HTTP Referrer restrictions** configured in Google Cloud Console and Mapbox Dashboards.
