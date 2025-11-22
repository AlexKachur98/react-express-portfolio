/**
 * @file config.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Centralized configuration file. Loads environment variables from .env.
 */

import 'dotenv/config'; // Make sure to load dotenv here as well

const parseList = (value) => (value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

const config = {
    env,
    port,
    jwtSecret: process.env.JWT_SECRET || "DEFAULT_SECRET_CHANGE_ME",
    mongoUri: process.env.MONGO_URI ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' +
        (process.env.MONGO_PORT || '27017') +
        '/MyPortfolioDB',
    clientOrigins: parseList(process.env.CLIENT_ORIGINS || process.env.ALLOWED_ORIGINS)
        .concat(env === 'development' ? ['http://localhost:5173', `http://localhost:${port}`] : []),
    enableSecureCookies: process.env.COOKIE_SECURE === 'true' || env === 'production'
};

// Security check: Warn if default JWT_SECRET is used
if (config.jwtSecret === "DEFAULT_SECRET_CHANGE_ME") {
  console.warn('[Config] WARNING: JWT_SECRET is not set. Please set a strong secret in your .env file.');
}

// Production hardening: require explicit secrets and database URIs
if (config.env === 'production') {
  if (!process.env.MONGO_URI) {
    console.error('[Config] ERROR: MONGO_URI is required in production. Set it via environment variables before starting the server.');
    process.exit(1);
  }

  if (config.jwtSecret === "DEFAULT_SECRET_CHANGE_ME") {
    console.error('[Config] ERROR: JWT_SECRET must be set in production. Provide a strong secret via the JWT_SECRET environment variable.');
    process.exit(1);
  }

  if (!config.clientOrigins.length) {
    console.warn('[Config] WARNING: CLIENT_ORIGINS is empty. Set CLIENT_ORIGINS (comma separated) to restrict CORS in production.');
  }
}

export default config;
