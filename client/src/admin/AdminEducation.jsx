/**
 * @file AdminEducation.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin form for creating, updating, and deleting education/qualification entries.
 */
import AdminCrudPanel from './components/AdminCrudPanel.jsx';
import { educationConfig } from './configs/index.jsx';

export default function AdminEducation() {
    return <AdminCrudPanel {...educationConfig} />;
}
