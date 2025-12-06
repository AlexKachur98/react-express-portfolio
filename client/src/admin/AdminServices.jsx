/**
 * @file AdminServices.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin control panel for creating and maintaining service offerings.
 */
import AdminCrudPanel from './components/AdminCrudPanel.jsx';
import { servicesConfig } from './configs/index.jsx';

export default function AdminServices() {
    return <AdminCrudPanel {...servicesConfig} />;
}
