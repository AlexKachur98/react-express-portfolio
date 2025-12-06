/**
 * @file index.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Barrel export for admin module.
 */

// Main admin components
export { default as AdminApp } from './AdminApp.jsx';
export { default as AdminLayout } from './AdminLayout.jsx';
export { default as AdminLogin } from './AdminLogin.jsx';
export { default as AdminOverview } from './AdminOverview.jsx';

// Entity management pages
export { default as AdminEducation } from './AdminEducation.jsx';
export { default as AdminGallery } from './AdminGallery.jsx';
export { default as AdminGuestbook } from './AdminGuestbook.jsx';
export { default as AdminMessages } from './AdminMessages.jsx';
export { default as AdminProjects } from './AdminProjects.jsx';
export { default as AdminServices } from './AdminServices.jsx';
export { default as AdminUsers } from './AdminUsers.jsx';

// Re-export components and configs
export * from './components/index.js';
export * from './configs/index.jsx';
