/**
 * @file server.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Main server entry point. Loads config, connects to MongoDB, and starts Express.
 */

import 'dotenv/config'; // Ensure environment variables are loaded
import mongoose from 'mongoose';
import config from './config/config.js'; // Import application configuration
import app from './server/express.js';   // Import the configured Express app

// --- Database Connection ---
mongoose.Promise = global.Promise; // Use native ES6 Promises
console.log(`[Server] Attempting to connect to MongoDB at ${config.mongoUri}...`);

// Use Mongoose to connect to the database
mongoose.connect(config.mongoUri)
  .then(() => {
    // This block runs if the connection is successful
    console.log(`[Database] Successfully connected to MongoDB.`);

    // --- Start Express Server ---
    // We only start the server *after* the database connection is established
    app.listen(config.port, (err) => {
      if (err) {
        console.error("[Server Error] Failed to start server:", err);
      } else {
        // Log a success message
        console.info(`[Server] Started successfully on http://localhost:${config.port} in ${config.env} mode.`);
      }
    });
  })
  .catch(err => {
    // This block catches errors from the initial connection attempt
    console.error(`[Database Error] Could not connect to MongoDB. Exiting...`, err);
    process.exit(1); // Exit if DB connection fails
  });

// Listen for connection errors after the initial attempt
mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] A connection error occurred: ${err}`);
});
