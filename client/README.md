# Alex Kachur Portfolio • Frontend

This Vite + React application powers the UI for [alexkachur.dev](https://alexkachur.dev). It renders the single-page experience (hero, about, education, projects, services, contact) with glassmorphism styling, reveal animations, and responsive navigation.

## Quick Start

```bash
# From the project root
npm install
npm run client      # Runs Vite dev server on http://localhost:5173

# Or work directly inside /client
cd client
npm install
npm run dev
```

## Build

```bash
npm run build   # Outputs production bundle to client/dist
```

The Express server at the repo root serves this build in production.

## Key Tech

- React 19 + Vite
- Custom CSS (glassmorphism, animations, responsive grid)
- Vanta.js background, IntersectionObserver scroll reveals
- React Router for in-page anchor navigation

For backend/API details, see the root [README](../README.md).
