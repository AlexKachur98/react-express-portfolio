/**
 * @file FormField.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Reusable form field component with label, input, and error display.
 */

/**
 * Standardized form field with label, input/textarea, and error handling.
 * Supports text, email, password, textarea, checkbox, and number inputs.
 * Can use either CSS classes (useClasses=true) or inline styles (default).
 *
 * @param {Object} props
 * @param {string} props.name - Field name (used for id generation)
 * @param {string} props.label - Field label text
 * @param {string} [props.type='text'] - Input type
 * @param {string|number|boolean} props.value - Field value
 * @param {Function} props.onChange - Change handler (receives event)
 * @param {Function} [props.onBlur] - Blur handler (receives event)
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {number} [props.rows=3] - Rows for textarea
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.useClasses=false] - Use CSS classes instead of inline styles
 * @param {Object} [props.inputProps] - Additional props to pass to input
 */
export default function FormField({
    name,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    required = false,
    placeholder,
    rows = 3,
    disabled = false,
    className = '',
    useClasses = false,
    inputProps = {}
}) {
    const id = `field-${name}`;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    // CSS class-based rendering (compatible with contact-form styles)
    if (useClasses) {
        if (type === 'checkbox') {
            return (
                <label
                    className={className}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px'
                    }}
                >
                    <input
                        id={id}
                        type="checkbox"
                        name={name}
                        checked={Boolean(value)}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? errorId : undefined}
                        {...inputProps}
                    />
                    {label}
                    {hasError && (
                        <span id={errorId} className="contact-form__error" role="alert">
                            {error}
                        </span>
                    )}
                </label>
            );
        }

        const InputComponent = type === 'textarea' ? 'textarea' : 'input';
        const additionalProps = type === 'textarea' ? { rows } : { type };

        return (
            <label className={className}>
                {label}
                <InputComponent
                    id={id}
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    {...additionalProps}
                    {...inputProps}
                />
                {hasError && (
                    <span id={errorId} className="contact-form__error" role="alert">
                        {error}
                    </span>
                )}
            </label>
        );
    }

    // Inline style-based rendering (original behavior)
    const labelStyle = {
        display: 'block',
        marginBottom: '20px'
    };

    const labelTextStyle = {
        display: 'block',
        color: 'rgba(226, 232, 240, 0.95)',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '8px'
    };

    const requiredStyle = {
        color: 'rgba(239, 68, 68, 0.9)',
        marginLeft: '4px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: hasError
            ? '1px solid rgba(239, 68, 68, 0.6)'
            : '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '8px',
        color: 'rgba(226, 232, 240, 0.95)',
        fontSize: '14px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none'
    };

    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px'
    };

    const checkboxStyle = {
        width: '18px',
        height: '18px',
        accentColor: 'rgba(59, 130, 246, 0.9)'
    };

    const errorStyle = {
        display: 'block',
        color: 'rgba(239, 68, 68, 0.9)',
        fontSize: '12px',
        marginTop: '6px'
    };

    // Checkbox has different layout
    if (type === 'checkbox') {
        return (
            <label style={checkboxContainerStyle} className={className}>
                <input
                    id={id}
                    type="checkbox"
                    name={name}
                    checked={Boolean(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    style={checkboxStyle}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    {...inputProps}
                />
                <span style={{ color: 'rgba(226, 232, 240, 0.95)', fontSize: '14px' }}>
                    {label}
                    {required && <span style={requiredStyle}>*</span>}
                </span>
                {hasError && (
                    <span id={errorId} style={errorStyle} role="alert">
                        {error}
                    </span>
                )}
            </label>
        );
    }

    const InputComponent = type === 'textarea' ? 'textarea' : 'input';
    const additionalProps = type === 'textarea' ? { rows } : { type };

    return (
        <label style={labelStyle} className={className}>
            <span style={labelTextStyle}>
                {label}
                {required && <span style={requiredStyle}>*</span>}
            </span>
            <InputComponent
                id={id}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                style={inputStyle}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                {...additionalProps}
                {...inputProps}
            />
            {hasError && (
                <span id={errorId} style={errorStyle} role="alert">
                    {error}
                </span>
            )}
        </label>
    );
}
