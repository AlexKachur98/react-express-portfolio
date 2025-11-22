<div align="center">

# Alex Kachur • Portfolio

Modern MERN-based personal site showcasing my work, background, and contact touchpoints. The frontend is a glassmorphism-inspired single-page experience with animated sections, while the backend exposes authenticated CRUD APIs with admin tooling. **Release v3.0.0** adds sign-in/sign-up flows, an admin dashboard/CMS, a user guest book, API-backed cat gallery uploads, and hardened deployment defaults.

This repo now embraces a _sections-first_ approach: the React app renders every view inside `Home.jsx`, and the floating navigation drives smooth anchor scrolling from desktop down to tablet and mobile breakpoints.

</div>

---

## 🔗 Live Site

Hosted on Google Cloud at **[alexkachur.dev](https://alexkachur.dev)**.

---

## ✨ Highlights

- **Admin Dashboard (NEW)** – `/admin` lets me manage education, projects, services, gallery images, contact submissions, users, and guest book signatures with JWT + httpOnly cookies.
- **Guest Book + Accounts** – Visitors can sign up/sign in (including a secret hero CTA) to leave, edit, or remove notes; admins can moderate entries.
- **API-Driven Cat Gallery** – `/cats` now pulls from Mongo-backed uploads with tags, favourites, filters, keyboard-friendly full-screen viewing, and API caching safety.
- **Self-Hosted Visuals** – Three.js + Vanta Waves ship locally (no CDN) to satisfy stricter CSP/deployment needs while keeping the animated glass aesthetic.
- **Hardened Backend** – CORS allowlist, secure-cookie support behind proxies, rate-limited contact submissions, admin seeding utilities, and SPA-friendly static serving.

---

## 🏗️ Tech Stack

| Layer      | Tech                                                               |
|------------|--------------------------------------------------------------------|
| Frontend   | React 19, Vite, React Router 7                                     |
| Styling    | Custom CSS (glassmorphism, animations, responsive layout)          |
| Animation  | Vanta.js (waves), custom IntersectionObserver reveal, typewriter   |
| Backend    | Express 4, Mongoose 8, JWT auth (httpOnly cookies), Helmet, CORS, Compression, express-rate-limit |
| Tooling    | Babel, Nodemon, Concurrently                                       |

---

## 🔧 Getting Started

```bash
# Install all workspace dependencies
npm install

# Launch backend (nodemon + babel-node) and frontend (Vite) together
npm run dev

# Backend only (useful for API testing)
npm run server

# Frontend only
npm run client
```

- App runs at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).
- Create a `.env` alongside `package.json` with at least:

```bash
MONGO_URI=mongodb://localhost:27017/MyPortfolioDB
JWT_SECRET=replace-me-with-a-strong-secret
CLIENT_ORIGINS=http://localhost:5173,http://localhost:3000
COOKIE_SECURE=false             # set true in production/HTTPS
ADMIN_EMAIL=admin@alex-portfolio.local
ADMIN_PASSWORD=ChangeMe123!     # override for production
```

An admin user is auto-seeded on boot via `ADMIN_EMAIL`/`ADMIN_PASSWORD`. In production, set `CLIENT_ORIGINS` and `COOKIE_SECURE=true` so cookies stay scoped correctly.

### Building for Production

```bash
npm run build:client  # Generates Vite production bundle under client/dist
npm start             # Serves built frontend + API via Express
```

---

## 📁 Project Structure

```
├── client/                  # React frontend (Vite)
│   ├── public/              # Static assets (favicon, images)
│   └── src/
│       ├── admin/           # Admin dashboard shell + CRUD panels
│       ├── guestbook/       # Authenticated guest book layout + feed
│       ├── components/      # Layout shell, Vanta background, typewriter, secret login widget
│       ├── pages/           # Home.jsx (main sections), CatGallery.jsx (Simba & Moura gallery), auth pages
│       ├── index.css        # Global styles and responsive rules
│       └── main.jsx         # App bootstrap
├── server/                  # Express controllers, routes, models, middleware (incl. guestbook + gallery)
├── server/scripts/seedAdmin # Optional script to seed a custom admin user
├── server.js                # Backend entry point (connects DB, seeds default admin)
└── README.md
```

---

## 🆕 What’s New in v3.0.0

- Full admin dashboard with JWT + httpOnly cookies to manage users, education, projects, services, gallery uploads, contact submissions, and guest book entries.
- Public sign-up/sign-in flows (plus a “secret” hero CTA) that route admins to `/admin` and guests to the `/guestbook`.
- Guest book experience with per-user updates/deletes and admin moderation.
- Cat Gallery now backed by MongoDB/API uploads (tags, filters, favourites, keyboardable modal, safer caching).
- Self-hosted Vanta/Three assets and tightened server config (CORS allowlist, secure cookies, rate-limited contact endpoint, trust proxy).

---

## 🧪 Testing & Quality

While automated tests are not included yet, the project is structured to add Jest (frontend) and supertest/Mocha (backend). Recommended manual checks:

- Run `npm run dev` and confirm anchors, reveals, and the Vanta background load without console errors.
- Create a user via `/signup`, sign in, sign the guest book, and update/delete your note; verify admin moderation on `/admin/guestbook`.
- Use an admin account to CRUD education/projects/services/gallery items and see them reflected on `/` and `/cats`.
- Submit the contact form and ensure rate limiting responds gracefully if spammed.
- Inspect Lighthouse performance/responsiveness across mobile/desktop.

---

## 🚀 Deployment Notes

- Build the frontend (`npm run build:client` or `npm run gcp-build`) before deploying to services like Render, Railway, or VPS.
- Set environment variables (`NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGINS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `COOKIE_SECURE`) in your hosting platform.
- Express already serves `client/dist` with cache headers; ensure HTTPS so secure cookies work in production.

---

## 📬 Contact

If you’d like to collaborate, open an issue or reach me at **akachur@my.centennialcollege.ca**. Happy to discuss projects, freelance work, or mentorship opportunities!

---

_MIT Licensed. Crafted with curiosity, clean code, and a love for building rewarding user experiences._
