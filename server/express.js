/**
 * @file express.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Configures and exports the main Express application instance.
 * Sets up all necessary middleware, mounts API routes, and serves the
 * static React frontend for production.
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

// --- Import All API Routes ---
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import educationRoutes from './routes/education.routes.js';
import serviceRoutes from './routes/service.routes.js';
import galleryRoutes from './routes/gallery.routes.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../client/dist');

const app = express();

// Behind a proxy (Heroku/Vercel/etc.) secure cookies require trust proxy.
app.set('trust proxy', 1);

// --- Middleware Pipeline (as seen in course examples) ---
app.use(express.json({ limit: '10mb' })); // Built-in JSON parser
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Built-in URL-encoded parser
app.use(cookieParser());   // Parse Cookie header
app.use(compress());       // Compress response bodies
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));         // Set security HTTP headers

const allowAll = config.env === 'development' && !config.clientOrigins.length;
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowAll) return callback(null, true);
        if (config.clientOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};
app.use(cors(corsOptions));           // Enable Cross-Origin Resource Sharing (tighten allowed origins + cookie flags in production)
app.options('*', cors(corsOptions));

// --- Mount API Routes ---
// All API routes are mounted under the '/api' prefix
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', contactRoutes);
app.use('/api', educationRoutes);
app.use('/api', serviceRoutes);
app.use('/api', galleryRoutes);

// Lightweight health endpoint for uptime checks
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// --- API 404 Handler ---
// Return JSON 404 for any unmatched /api route
app.use('/api', (req, res) => {
    return res.status(404).json({ error: 'API route not found' });
});

// --- Static File Serving (for Production) ---
// Serve static files (JS, CSS, images) from the React build folder with long-lived caching for assets.
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
app.use(express.static(clientBuildPath, {
    maxAge: ONE_YEAR_MS,
    immutable: true,
    setHeaders: (res, resourcePath) => {
        // Prevent aggressive caching of the entry HTML while keeping assets cached for a year.
        if (resourcePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.removeHeader('Expires');
    }
}));

// --- SPA Fallback Route (for Production) ---
// For any non-API GET request that doesn't match a static file,
// send the client's index.html file. This allows React Router to handle routing.
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
        if (err) {
            if (err.status === 404) {
                res.status(404).send('Client application not found. Run `npm run build:client` to build the frontend.');
            } else {
                res.status(500).send('An error occurred while serving the application.');
            }
        }
    });
});

// --- General Error Handling Middleware ---
// This catches errors, including 'UnauthorizedError' from express-jwt
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    if (err.name === 'UnauthorizedError') {
        // This error is thrown by express-jwt when a token is invalid
        return res.status(401).json({ "error": "Unauthorized: " + err.message });
    } else if (err) {
        // Handle other general errors
        console.error("[Server Error]", err.stack); // Log the full error
        return res.status(err.status || 400).json({ "error": err.message || "An error occurred." });
    }
    // If no error, proceed
    next();
});

export default app;
