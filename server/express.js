/**
 * @file express.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Configures and exports the main Express application instance.
 * Sets up all necessary middleware and static file serving.
 */

import express from 'express';
// Note: body-parser is in your dependencies, but modern Express (4.16+)
// includes express.json() and express.urlencoded() which are identical.
// We will use the modern built-in methods as seen in 'REST API-SUMMARY SLIDE.pdf'.
// import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Define __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the path to the *built* client folder for production
// It goes up two directories (from server/ to MyPortfolio/) then into client/dist
const clientBuildPath = path.join(__dirname, '../../client/dist');

// Initialize Express app
const app = express();

// --- Middleware Pipeline (as seen in course examples) ---
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// Parse Cookie header and populate req.cookies
app.use(cookieParser());
// Compress response bodies for better performance
app.use(compress());
// Secure Express app by setting various HTTP headers
app.use(helmet());
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// --- API Routes (To be added in Step 7) ---
// import userRoutes from './routes/user.routes.js';
// app.use('/api', userRoutes);
// ...

// --- Static File Serving (for Production) ---
// Serve the static files (JS, CSS, images) from the React build folder
app.use(express.static(clientBuildPath));

// --- SPA Fallback Route (for Production) ---
// For any GET request that doesn't match an API route or static file,
// send the client's index.html file. This allows React Router to handle routing.
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
        if (err) {
            // If the file isn't found (e.g., client not built), send 404
            if (err.status === 404) {
                 res.status(404).send('Client application not found. Run `npm run build:client`.');
            } else {
                 // For other errors, send a 500
                 res.status(500).send('An error occurred while serving the application.');
            }
        }
    });
});

// --- General Error Handling Middleware ---
// This middleware catches errors thrown from other parts of the application
app.use((err, req, res, next) => {
    // Handle specific 'UnauthorizedError' from express-jwt (for Step 3)
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ "error": "Unauthorized: " + err.message });
    } else if (err) {
        // Log the full error to the console for debugging
        console.error("[Server Error]", err.stack);
        // Send a generic error response
        return res.status(err.status || 400).json({ "error": err.message || "An error occurred." });
    }
    // If no error, proceed
    next();
});

export default app;
