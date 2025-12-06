/**
 * @file AdminCrudPanel.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Generic CRUD panel component for admin interfaces.
 */

// React
import { useState, useCallback, useMemo } from 'react';

// Context & Hooks
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsyncEffect } from '../../hooks/useAsync.js';

// Components
import {
    ConfirmDialog,
    EmptyState,
    LoadingSpinner,
    FormField,
    Pagination
} from '../../components/ui/index.js';
import AdminListItem from './AdminListItem.jsx';

// Utils
import { getId } from '../../utils/getId.js';

// Pagination defaults
const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

/**
 * Generic admin CRUD panel that handles create, read, update, delete operations.
 * Eliminates ~80% code duplication across admin components.
 *
 * @param {Object} props
 * @param {string} props.entityName - Display name for the entity (e.g., "Education")
 * @param {string} props.entityNamePlural - Plural display name (e.g., "Qualifications")
 * @param {Object} props.api - API functions { list, create, update, delete, deleteAll }
 * @param {Object} props.emptyForm - Initial empty form state
 * @param {Array} props.formFields - Field configurations for the form
 * @param {Function} props.renderItem - Function to render each item in the list
 * @param {Function} [props.mapItemToForm] - Transform item data to form data
 * @param {Function} [props.buildPayload] - Transform form data to API payload
 * @param {Function} [props.normalizeResponse] - Normalize API response data
 * @param {string} [props.listLayout='list'] - Layout for items: 'list' or 'grid'
 * @param {React.ComponentType} [props.customFormFields] - Custom form fields component
 */
export default function AdminCrudPanel({
    entityName,
    entityNamePlural,
    api,
    emptyForm,
    formFields,
    renderItem,
    mapItemToForm,
    buildPayload,
    normalizeResponse,
    listLayout = 'list',
    customFormFields: CustomFormFields
}) {
    const { isAdmin } = useAuth();
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, id: null });
    const [statusMessage, setStatusMessage] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    // Use useAsyncEffect for data loading
    const {
        data: rawItems,
        loading: isLoading,
        error: loadError,
        setData: setRawItems
    } = useAsyncEffect(() => api.list(), [api]);

    // Normalize items if needed
    const items = rawItems ? (normalizeResponse ? rawItems.map(normalizeResponse) : rawItems) : [];

    // Paginated items
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    // Reset to page 1 when items per page changes or when total items would leave us on empty page
    const handleItemsPerPageChange = useCallback((newValue) => {
        setItemsPerPage(newValue);
        setCurrentPage(1);
    }, []);

    // Reset to page 1 if current page becomes invalid after deletion
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    /**
     * Handle form field changes.
     */
    const handleChange = useCallback(
        (field) => (event) => {
            const { type, checked, value, files } = event.target;

            if (type === 'checkbox') {
                setForm((prev) => ({ ...prev, [field]: checked }));
            } else if (type === 'file') {
                setForm((prev) => ({ ...prev, [field]: files?.[0] || null }));
            } else {
                setForm((prev) => ({ ...prev, [field]: value }));
            }

            if (submitError) setSubmitError('');
        },
        [submitError]
    );

    /**
     * Handle form submission (create or update).
     */
    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSubmitError('');
            setSubmitting(true);

            const payload = buildPayload ? buildPayload(form) : form;

            const res = editingId
                ? await api.update(editingId, payload)
                : await api.create(payload);

            if (res?.error) {
                setSubmitError(res.error);
                setSubmitting(false);
                return;
            }

            const normalizedRes = normalizeResponse ? normalizeResponse(res) : res;

            if (editingId) {
                setRawItems((prev) =>
                    prev.map((item) => {
                        return getId(item) === editingId ? normalizedRes : item;
                    })
                );
                setStatusMessage(`${entityName} updated successfully`);
            } else if (res?._id || res?.id) {
                setRawItems((prev) => [...prev, normalizedRes]);
                setStatusMessage(`${entityName} created successfully`);
            } else {
                const refreshed = await api.list();
                if (!refreshed?.error && Array.isArray(refreshed)) {
                    setRawItems(refreshed);
                }
            }

            setForm(emptyForm);
            setEditingId(null);
            setSubmitting(false);
        },
        [form, editingId, api, buildPayload, normalizeResponse, emptyForm, entityName, setRawItems]
    );

    /**
     * Populate form for editing an item.
     */
    const handleEdit = useCallback(
        (item) => {
            setEditingId(getId(item));
            setForm(mapItemToForm ? mapItemToForm(item) : item);
            setSubmitError('');
        },
        [mapItemToForm]
    );

    /**
     * Clear form and reset editing state.
     */
    const handleClear = useCallback(() => {
        setForm(emptyForm);
        setEditingId(null);
        setSubmitError('');
    }, [emptyForm]);

    /**
     * Open delete confirmation dialog.
     */
    const openDeleteConfirm = useCallback((id) => {
        setConfirmDialog({ isOpen: true, type: 'single', id });
    }, []);

    /**
     * Open delete all confirmation dialog.
     */
    const openDeleteAllConfirm = useCallback(() => {
        setConfirmDialog({ isOpen: true, type: 'all', id: null });
    }, []);

    /**
     * Handle confirmed deletion.
     */
    const handleConfirmDelete = useCallback(async () => {
        const { type, id } = confirmDialog;

        if (type === 'single' && id) {
            const res = await api.delete(id);
            if (!res?.error) {
                setRawItems((prev) => prev.filter((item) => getId(item) !== id));
                setStatusMessage(`${entityName} deleted successfully`);
            }
        } else if (type === 'all') {
            const res = await api.deleteAll();
            if (!res?.error) {
                setRawItems([]);
                setStatusMessage(`All ${entityNamePlural.toLowerCase()} deleted`);
            }
        }

        setConfirmDialog({ isOpen: false, type: null, id: null });
    }, [confirmDialog, api, entityName, entityNamePlural, setRawItems]);

    /**
     * Cancel deletion dialog.
     */
    const handleCancelDelete = useCallback(() => {
        setConfirmDialog({ isOpen: false, type: null, id: null });
    }, []);

    /**
     * Render a form field using FormField component.
     */
    const renderFormFieldComponent = useCallback(
        (field) => (
            <FormField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={handleChange(field.name)}
                required={field.required}
                placeholder={field.placeholder}
                rows={field.rows}
                useClasses={true}
            />
        ),
        [form, handleChange]
    );

    /**
     * Render form fields, handling row grouping.
     */
    const renderFormFields = useCallback(() => {
        const elements = [];
        let i = 0;

        while (i < formFields.length) {
            const field = formFields[i];

            if (field.rowWith) {
                const rowFields = [field];
                const rowWithFields = Array.isArray(field.rowWith)
                    ? field.rowWith
                    : [field.rowWith];

                for (const rowFieldName of rowWithFields) {
                    const rowField = formFields.find((f) => f.name === rowFieldName);
                    if (rowField) rowFields.push(rowField);
                }

                elements.push(
                    <div key={`row-${field.name}`} className="contact-form__row">
                        {rowFields.map(renderFormFieldComponent)}
                    </div>
                );

                i += rowFields.length;
            } else {
                const isInOtherRow = formFields.some(
                    (f) =>
                        f.rowWith &&
                        (f.rowWith === field.name ||
                            (Array.isArray(f.rowWith) && f.rowWith.includes(field.name)))
                );

                if (!isInOtherRow) {
                    elements.push(renderFormFieldComponent(field));
                }
                i++;
            }
        }

        return elements;
    }, [formFields, renderFormFieldComponent]);

    // Access check
    if (!isAdmin) {
        return <p className="section section--glass">Admin access required.</p>;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="section section--glass">
                <LoadingSpinner text={`Loading ${entityNamePlural.toLowerCase()}...`} />
            </div>
        );
    }

    const listStyle =
        listLayout === 'grid'
            ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
              }
            : {};

    const confirmMessage =
        confirmDialog.type === 'all'
            ? `Delete ALL ${entityNamePlural.toLowerCase()}? This cannot be undone.`
            : `Delete this ${entityName.toLowerCase()}? This cannot be undone.`;

    const error = submitError || loadError;

    return (
        <div className="section section--glass">
            {/* Accessibility: Status announcements */}
            <div role="status" aria-live="polite" className="visually-hidden">
                {statusMessage}
            </div>

            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Manage {entityNamePlural}</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                {CustomFormFields ? (
                    <CustomFormFields form={form} handleChange={handleChange} setForm={setForm} />
                ) : (
                    renderFormFields()
                )}

                {error && (
                    <p className="contact-form__error" role="alert">
                        {error}
                    </p>
                )}

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className="btn contact-form__submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Saving...'
                            : editingId
                              ? `Update ${entityName}`
                              : `Create ${entityName}`}
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={handleClear}>
                        Clear
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={openDeleteAllConfirm}>
                        Delete all
                    </button>
                </div>
            </form>

            <div className="contact-grid__card">
                <h3 style={{ marginTop: 0 }}>Existing {entityNamePlural}</h3>

                {items.length === 0 ? (
                    <EmptyState
                        title={`No ${entityNamePlural.toLowerCase()} yet`}
                        description={`Create your first ${entityName.toLowerCase()} using the form above.`}
                    />
                ) : (
                    <>
                        <div style={listStyle}>
                            {paginatedItems.map((item) => (
                                <AdminListItem
                                    key={getId(item)}
                                    item={item}
                                    layout={listLayout}
                                    renderItem={renderItem}
                                    onEdit={handleEdit}
                                    onDelete={openDeleteConfirm}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={items.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={
                    confirmDialog.type === 'all'
                        ? `Delete All ${entityNamePlural}`
                        : `Delete ${entityName}`
                }
                message={confirmMessage}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
