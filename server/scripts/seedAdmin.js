/**
 * @file seedAdmin.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Seeds a single admin user using environment variables.
 * Requires ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to be set.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import config from '../../config/config.js';
import User from '../models/user.model.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
        '[Seed] ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in the environment.'
    );
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('[Seed] Connected to MongoDB');

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`[Seed] Admin already exists for email ${ADMIN_EMAIL}. No action taken.`);
            return;
        }

        const admin = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin'
        });

        await admin.save();
        console.log(`[Seed] Created admin user for ${ADMIN_EMAIL}`);
    } catch (err) {
        console.error('[Seed] Failed to seed admin user:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        console.log('[Seed] Database connection closed.');
    }
};

run();
