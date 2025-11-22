/**
 * @file AdminOverview.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Simple welcome card for the admin dashboard home route.
 */
export default function AdminOverview() {
    return (
        <div className="contact-grid__card">
            <h3 style={{ marginTop: 0 }}>Welcome</h3>
            <p>Use the tabs above to manage education, projects, services, gallery items, and contact messages.</p>
        </div>
    );
}
