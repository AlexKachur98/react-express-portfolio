/**
 * @file adminSeeder.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Ensure a default admin user exists for assignment requirements.
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD environment variables to be set.
 */
import User from '../models/user.model.js';

const ensureAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Security: Require explicit environment variables - no hardcoded defaults
    if (!adminEmail || !adminPassword) {
        console.warn('[Admin Seeder] ADMIN_EMAIL and ADMIN_PASSWORD env vars not set. Skipping admin seeding.');
        console.warn('[Admin Seeder] To create an admin user, set these environment variables and restart.');
        return;
    }

    // Validate password meets minimum requirements
    if (adminPassword.length < 6) {
        console.error('[Admin Seeder] ADMIN_PASSWORD must be at least 6 characters. Skipping admin seeding.');
        return;
    }

    try {
        const existing = await User.findOne({ email: adminEmail });

        if (existing) {
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.info(`[Admin Seeder] Elevated user to admin for ${adminEmail}`);
            } else {
                console.info(`[Admin Seeder] Admin user already present for ${adminEmail}`);
            }
            return;
        }

        const admin = new User({
            name: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await admin.save();
        console.info(`[Admin Seeder] Created default admin user for ${adminEmail}`);
    } catch (err) {
        console.error('[Admin Seeder] Failed to ensure admin user:', err.message);
    }
};

export { ensureAdminUser };
