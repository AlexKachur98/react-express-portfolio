/**
 * @file Pagination.jsx
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Reusable pagination component for lists with page navigation.
 */

import { memo, useCallback, useMemo } from 'react';

/**
 * Generates an array of page numbers with ellipsis placeholders.
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {number} siblingCount - Number of siblings on each side of current page
 * @returns {Array<number|string>} Array of page numbers and '...' placeholders
 */
function getPageRange(currentPage, totalPages, siblingCount = 1) {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

    if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
        return [...leftRange, '...', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = Array.from(
            { length: 3 + 2 * siblingCount },
            (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
        );
        return [1, '...', ...rightRange];
    }

    const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
    );
    return [1, '...', ...middleRange, '...', totalPages];
}

/**
 * Pagination component with page numbers, previous/next buttons, and items per page selector.
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Number of items per page
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} [props.onItemsPerPageChange] - Callback when items per page changes
 * @param {Array<number>} [props.itemsPerPageOptions] - Available items per page options
 * @param {boolean} [props.showItemsPerPage=true] - Show items per page selector
 * @param {boolean} [props.showPageInfo=true] - Show "Page X of Y" info
 */
function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 20, 50],
    showItemsPerPage = true,
    showPageInfo = true
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageRange = useMemo(
        () => getPageRange(currentPage, totalPages),
        [currentPage, totalPages]
    );

    const handlePrevious = useCallback(() => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, onPageChange]);

    const handleItemsPerPageChange = useCallback(
        (e) => {
            if (onItemsPerPageChange) {
                onItemsPerPageChange(Number(e.target.value));
            }
        },
        [onItemsPerPageChange]
    );

    if (totalItems === 0) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <nav className="pagination" aria-label="Pagination navigation">
            <div className="pagination__info">
                {showPageInfo && (
                    <span className="pagination__page-info">
                        Showing {startItem}-{endItem} of {totalItems}
                    </span>
                )}

                {showItemsPerPage && onItemsPerPageChange && (
                    <label className="pagination__per-page">
                        <span>Per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="pagination__select"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination__controls">
                    <button
                        type="button"
                        className="btn btn--ghost pagination__btn"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        &laquo; Prev
                    </button>

                    <div className="pagination__pages">
                        {pageRange.map((page, index) =>
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    type="button"
                                    className={`btn pagination__page ${
                                        currentPage === page ? 'btn--ghost-active' : 'btn--ghost'
                                    }`}
                                    onClick={() => onPageChange(page)}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        type="button"
                        className="btn btn--ghost pagination__btn"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        Next &raquo;
                    </button>
                </div>
            )}
        </nav>
    );
}

export default memo(Pagination);
