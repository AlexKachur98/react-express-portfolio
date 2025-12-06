/**
 * @file LazyImage.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Lazy-loaded image component using IntersectionObserver for performance.
 */
import { useState, useRef, useEffect, memo } from 'react';

/**
 * Lazy-loaded image component that only loads images when they enter the viewport.
 * Uses IntersectionObserver for efficient lazy loading.
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} [props.placeholder] - Placeholder while loading (base64 or URL)
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 * @param {string} [props.rootMargin='100px'] - IntersectionObserver root margin
 * @param {Function} [props.onLoad] - Callback when image loads
 * @param {Function} [props.onError] - Callback on load error
 */
function LazyImage({
    src,
    alt,
    placeholder,
    className = '',
    style = {},
    rootMargin = '100px',
    onLoad,
    onError,
    ...props
}) {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const element = imgRef.current;
        if (!element) return;

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [rootMargin]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const containerStyle = {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        ...style
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
    };

    const placeholderStyle = {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(10px)',
        transform: 'scale(1.1)',
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 0.3s ease'
    };

    return (
        <div
            ref={imgRef}
            className={`lazy-image ${isLoaded ? 'lazy-image--loaded' : ''} ${className}`}
            style={containerStyle}
        >
            {/* Placeholder */}
            {placeholder && !hasError && (
                <img src={placeholder} alt="" aria-hidden="true" style={placeholderStyle} />
            )}

            {/* Main image - only load when in view */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    style={imageStyle}
                    onLoad={handleLoad}
                    onError={handleError}
                    {...props}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        color: 'rgba(148, 163, 184, 0.6)',
                        fontSize: '0.9rem'
                    }}
                >
                    Failed to load image
                </div>
            )}
        </div>
    );
}

// Memoize to prevent unnecessary re-renders
export default memo(LazyImage, (prevProps, nextProps) => {
    return (
        prevProps.src === nextProps.src &&
        prevProps.alt === nextProps.alt &&
        prevProps.className === nextProps.className
    );
});
