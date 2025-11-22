/**
 * @file adminSeeder.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Ensure a default admin user exists for assignment requirements.
 */
import User from '../models/user.model.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@alex-portfolio.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

const ensureAdminUser = async () => {
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
        if (existing.role !== 'admin') {
            existing.role = 'admin';
            await existing.save();
            console.info(`[Admin Seeder] Elevated user to admin for ${ADMIN_EMAIL}`);
        } else {
            console.info(`[Admin Seeder] Admin user already present for ${ADMIN_EMAIL}`);
        }
        return;
    }

    const admin = new User({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
    });

    await admin.save();
    console.info(`[Admin Seeder] Created default admin user for ${ADMIN_EMAIL}`);
};

export { ensureAdminUser };
