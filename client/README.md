# Alex Kachur Portfolio • Frontend

This Vite + React application powers the UI for [alexkachur.dev](https://alexkachur.dev). It renders the single-page experience (hero, about, education, projects, services, contact) with glassmorphism styling, reveal animations, and responsive navigation—and, as of **v3.0.0**, ships authentication, an admin dashboard shell, a user guest book, and an API-driven cat gallery.

Landing sections live inside `Home.jsx`, while the Cat Gallery ships as a standalone `CatGallery.jsx` page with its own back-to-portfolio control. The floating navigation collapses into a mobile-style tray for any viewport below 900 px. A secret CTA in the hero opens inline auth, routing admins to `/admin` and guests to `/guestbook`.

## Key Features

- Admin dashboard UI (`/admin`) covering users, education, projects, services, gallery uploads, messages, and guest book moderation.
- Guest book experience for signed-in users with personal update/delete controls.
- Cat Gallery backed by API data with tags, favourites, filters, keyboardable modal, and intro animation.
- Self-hosted Vanta background assets (three.js + waves) to avoid external CDNs and keep CSP tight.

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

### API Base

`API_BASE_URL` defaults to `/api` and is proxied to `http://localhost:3000` in development via Vite (`vite.config.js`). Override with `VITE_API_URL` if you point the frontend at a remote backend.

## Key Tech

- React 19 + Vite
- Custom CSS (glassmorphism, animations, responsive grid)
- Vanta.js background, IntersectionObserver scroll reveals, paw-print intro animation
- React Router for in-page anchor navigation + Cat Gallery + auth/admin/guestbook routes
- Single `MainRouter` + `Layout` composition that keeps nav state consistent across breakpoints

For backend/API details, see the root [README](../README.md).
