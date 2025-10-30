<div align="center">

# Alex Kachur • Portfolio

Modern MERN-based personal site showcasing my work, background, and contact touchpoints. The frontend is a glassmorphism-inspired single-page experience with animated sections, while the backend exposes REST endpoints for secure contact form submissions. **Release v2.0.0** introduces a fully fledged Cat Gallery experience, refreshed animations, and navigation refinements.

This repo now embraces a _sections-first_ approach: the React app renders every view inside `Home.jsx`, and the floating navigation drives smooth anchor scrolling from desktop down to tablet and mobile breakpoints.

</div>

---

## 🔗 Live Site

Hosted on Google Cloud at **[alexkachur.dev](https://alexkachur.dev)**.

---

## ✨ Highlights

- **Cat Gallery Route (NEW)** – `/cats` showcases Simba & Moura with favourites, filtering, a full-screen viewer, and playful paw-print intro animation.
- **Immersive UI/UX** – Floating navigation, Vanta waves background, typed hero intro, and smooth reveal animations build an engaging first impression.
- **Content-Rich Single Page** – Hero, About, Education, Projects, Services, and Contact sections arranged for focused storytelling.
- **Interactive Projects** – GitHub/demo buttons let visitors explore featured work, including my C# Hangman and Prestige Exotics site.
- **Contact Pipeline** – Backend API handles form submissions with validation, JWT protection, and MongoDB persistence.
- **Responsive and Accessible** – Tailored breakpoints and button semantics keep the experience usable across devices and assistive tech.

---

## 🏗️ Tech Stack

| Layer      | Tech                                                               |
|------------|--------------------------------------------------------------------|
| Frontend   | React 19, Vite, React Router 7                                     |
| Styling    | Custom CSS (glassmorphism, animations, responsive layout)          |
| Animation  | Vanta.js (waves), custom IntersectionObserver reveal, typewriter   |
| Backend    | Express 4, Mongoose 8, JWT auth, Helmet, Compression               |
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

- App runs at `http://localhost:5173` (frontend) and `http://localhost:5000` (API).
- Environment variables can be added via a `.env` file (MongoDB URI, JWT secret, etc.).

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
│       ├── components/      # Layout shell, Vanta background, typewriter helper
│       ├── pages/           # Home.jsx (main sections), CatGallery.jsx (Simba & Moura gallery)
│       ├── index.css        # Global styles and responsive rules
│       └── main.jsx         # App bootstrap
├── server/                  # Express controllers, routes, models, middleware
├── server.js                # Backend entry point
└── README.md
```

---

## 🆕 What’s New in v2.0.0

- Dedicated Cat Gallery route with filterable favourites, responsive carousel, modal, and cookie-backed persistence.
- Refined navigation: quick back-to-portfolio control in the gallery and centred floating nav for the main landing page.
- Enhanced animations and layout polish across the gallery (intro paw prints, smoother filtering, carousel updates).
- Documentation, versions, and release metadata refreshed for the 2.0.0 milestone.

Upgrade by pulling the latest code, running `npm install`, and rebuilding via `npm run build:client`.

---

## 🧪 Testing & Quality

While automated tests are not included yet, the project is structured to add Jest (frontend) and supertest/Mocha (backend). Recommended manual checks:

- Run `npm run dev` and validate all sections reveal smoothly while navigation anchors align under the floating nav (tablet breakpoint kicks in at 900px).
- Submit the contact form to confirm API response handling (requires backend `.env` configuration).
- Inspect Lighthouse performance for responsive layouts.
- Visit `/cats` to verify the intro animation, favourites, filtering, and full-screen modal interactions.

---

## 🚀 Deployment Notes

- Build the frontend (`npm run build:client`) before deploying to services like Render, Railway, or VPS.
- Set environment variables (`NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, etc.) in your hosting platform.
- Ensure static assets from `client/dist` are served by Express (already configured in `server.js`).

---

## 📬 Contact

If you’d like to collaborate, open an issue or reach me at **akachur@my.centennialcollege.ca**. Happy to discuss projects, freelance work, or mentorship opportunities!

---

_MIT Licensed. Crafted with curiosity, clean code, and a love for building rewarding user experiences._
