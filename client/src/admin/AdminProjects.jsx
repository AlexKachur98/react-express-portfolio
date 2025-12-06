/**
 * @file AdminProjects.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin interface to manage portfolio projects and metadata.
 */
import AdminCrudPanel from './components/AdminCrudPanel.jsx';
import { projectsConfig } from './configs/index.jsx';

export default function AdminProjects() {
    return <AdminCrudPanel {...projectsConfig} />;
}
