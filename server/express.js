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

// --- Import All API Routes ---
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import educationRoutes from './routes/education.routes.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../client/dist');

const app = express();

// --- Middleware Pipeline (as seen in course examples) ---
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true })); // Built-in URL-encoded parser
app.use(cookieParser());   // Parse Cookie header
app.use(compress());       // Compress response bodies
app.use(helmet());         // Set security HTTP headers
app.use(cors());           // Enable Cross-Origin Resource Sharing

// --- Mount API Routes ---
// All API routes are mounted under the '/api' prefix
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', contactRoutes);
app.use('/api', educationRoutes);

// --- Static File Serving (for Production) ---
// Serve static files (JS, CSS, images) from the React build folder
app.use(express.static(clientBuildPath));

// --- SPA Fallback Route (for Production) ---
// For any GET request that doesn't match an API route or static file,
// send the client's index.html file. This allows React Router to handle routing.
app.get('*', (req, res) => {
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