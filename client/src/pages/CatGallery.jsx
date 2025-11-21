/**
 * @file CatGallery.jsx
 * @author Alex Kachur
 * @since 2025-10-29
 * @purpose Curated gallery experience for cat photos with filtering, favourites, and modal viewing.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGallery } from '../utils/api.js';

const COOKIE_KEY = 'cat_gallery_favourites';

const TAG_OPTIONS = [
    { value: 'all', label: 'All cats' },
    { value: 'simba', label: 'Simba' },
    { value: 'moura', label: 'Moura' },
    { value: 'together', label: 'Together' },
];

// Shared tag filter keeps business rules centralised for list + modal sequences.
const filterByTag = (images, tag) => (tag === 'all' ? images : images.filter((image) => image.tags.includes(tag)));

const favouriteCookie = {
    // Gracefully handle missing or malformed cookie values.
    read() {
        if (typeof document === 'undefined') return [];
        const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_KEY}=`));
        if (!match) return [];
        try {
            const value = decodeURIComponent(match.split('=')[1]);
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    },
    write(ids) {
        if (typeof document === 'undefined') return;
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        const payload = encodeURIComponent(JSON.stringify(ids));
        document.cookie = `${COOKIE_KEY}=${payload}; expires=${expires.toUTCString()}; path=/`;
    }
};

export default function CatGallery() {
    // Feature toggles and derived state for filters, favourites, and modal rendering.
    const [favoriteIds, setFavoriteIds] = useState(() => favouriteCookie.read());
    const [images, setImages] = useState([]);
    const [images, setImages] = useState([]);
    const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
    const [activeTag, setActiveTag] = useState('all');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [modalSource, setModalSource] = useState({ source: 'all', tag: 'all' });
    const [modalIndex, setModalIndex] = useState(0);
    const [introComplete, setIntroComplete] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const carouselRef = useRef(null);
    const lastFocusedElementRef = useRef(null);
    const modalCloseButtonRef = useRef(null);

    const favouriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
    const favouriteSequence = useMemo(() => images.filter((image) => favouriteSet.has(image.id || image._id)), [favouriteSet, images]);
    const tagFiltered = useMemo(() => filterByTag(images, activeTag), [activeTag, images]);
    const favouriteTagSequence = useMemo(() => filterByTag(favouriteSequence, activeTag), [favouriteSequence, activeTag]);
    const visibleImages = showFavouritesOnly ? favouriteTagSequence : tagFiltered;
    // Modal leverages either favourites or the full list, filtered by the active tag.
    const modalSequence = useMemo(() => {
        const base = modalSource.source === 'favourites' ? favouriteSequence : images;
        return filterByTag(base, modalSource.tag);
    }, [modalSource, favouriteSequence, images]);
    const modalLength = modalSequence.length;
    const modalImage = modalSequence[modalIndex];

    const handleModalShift = useCallback((delta) => {
        setModalIndex((prev) => {
            const next = prev + delta;
            if (next < 0 || next >= modalLength) {
                return prev;
            }
            return next;
        });
    }, [modalLength]);

    useEffect(() => {
        // Persist favourites whenever the selection changes.
        favouriteCookie.write(favoriteIds);
    }, [favoriteIds]);

    useEffect(() => {
        // Lock body scroll when the modal is open to avoid background jitter.
        if (isFullscreen) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = previousOverflow;
            };
        }
    }, [isFullscreen]);

    useEffect(() => {
        if (!isFullscreen) {
            return;
        }
        if (modalLength === 0) {
            setIsFullscreen(false);
            return;
        }
        if (modalIndex >= modalLength) {
            setModalIndex(modalLength - 1);
        }
    }, [isFullscreen, modalIndex, modalLength]);

    useEffect(() => {
        if (!isFullscreen) {
            return undefined;
        }
        const handleKey = (event) => {
            if (event.key === 'Escape') {
                setIsFullscreen(false);
            } else if (event.key === 'ArrowLeft') {
                handleModalShift(-1);
            } else if (event.key === 'ArrowRight') {
                handleModalShift(1);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isFullscreen, handleModalShift]);

    useEffect(() => {
        if (isFullscreen && modalCloseButtonRef.current) {
            modalCloseButtonRef.current.focus();
        }
    }, [isFullscreen]);

    useEffect(() => {
        const timer = window.setTimeout(() => setIntroComplete(true), 2600);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        setIsFiltering(true);
        const timer = window.setTimeout(() => setIsFiltering(false), 350);
        return () => window.clearTimeout(timer);
    }, [showFavouritesOnly, activeTag]);

    const scrollBy = (direction) => {
        const node = carouselRef.current;
        if (!node) return;
        const scrollAmount = Math.min(node.offsetWidth, 360);
        node.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    const toggleFavourite = (imageId) => {
        setFavoriteIds((prev) => {
            if (prev.includes(imageId)) {
                return prev.filter((id) => id !== imageId);
            }
            return [...prev, imageId];
        });
    };

    const openFullscreen = (imageId) => {
        lastFocusedElementRef.current = document.activeElement;
        const source = showFavouritesOnly ? 'favourites' : 'all';
        const tag = activeTag;
        const sequence = showFavouritesOnly ? favouriteTagSequence : tagFiltered;
        const index = sequence.findIndex((image) => (image.id || image._id) === imageId);
        if (index === -1) {
            return;
        }
        setModalSource({ source, tag });
        setModalIndex(index);
        setIsFullscreen(true);
    };

    const handleCloseModal = () => {
        setIsFullscreen(false);
        if (lastFocusedElementRef.current && lastFocusedElementRef.current.focus) {
            lastFocusedElementRef.current.focus();
        }
    };

    return (
        <div className={`cat-gallery ${introComplete ? 'cat-gallery--ready' : ''} ${isFiltering ? 'cat-gallery--filtering' : ''}`}>
            <div className="cat-gallery__bg" aria-hidden="true"></div>
            <div className="cat-gallery__paws" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} className={`cat-gallery__paw cat-gallery__paw--${index}`}>🐾</span>
                ))}
            </div>
            {!introComplete && (
                <div className="cat-gallery__intro" role="presentation">
                    <div className="cat-gallery__intro-track">
                        <div className="cat-gallery__intro-lane cat-gallery__intro-lane--left">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span key={`left-${index}`} className={`cat-gallery__intro-paw cat-gallery__intro-paw--${index}`}>
                                    🐾
                                </span>
                            ))}
                        </div>
                        <div className="cat-gallery__intro-lane cat-gallery__intro-lane--right">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span key={`right-${index}`} className={`cat-gallery__intro-paw cat-gallery__intro-paw--${index}`}>
                                    🐾
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <section className={`cat-gallery__content ${introComplete ? 'cat-gallery__content--show' : ''}`}>
                <header className="cat-gallery__header">
                    <span className="cat-gallery__eyebrow">Cat Gallery</span>
                    <h1 className="cat-gallery__title">Meet the fluffy roommates</h1>
                    <p className="cat-gallery__subtitle">
                        Swipe through their favourite snapshots, mark the ones you adore, and relive every whiskered adventure.
                    </p>
                    <div className="cat-gallery__actions">
                        <button
                            type="button"
                            className={`cat-gallery__action ${showFavouritesOnly ? '' : 'cat-gallery__action--active'}`}
                            onClick={() => setShowFavouritesOnly(false)}
                        >
                            All photos
                        </button>
                        <button
                            type="button"
                            className={`cat-gallery__action ${showFavouritesOnly ? 'cat-gallery__action--active' : ''}`}
                            onClick={() => setShowFavouritesOnly(true)}
                            disabled={favouriteSequence.length === 0}
                            title={favouriteSequence.length === 0 ? 'Add favourites to unlock this view' : undefined}
                        >
                            Favourites ({favouriteSequence.length})
                        </button>
                    </div>
                    <div className="cat-gallery__filters" role="group" aria-label="Filter photos by cat">
                        {TAG_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`cat-gallery__filter ${activeTag === option.value ? 'cat-gallery__filter--active' : ''}`}
                                aria-pressed={activeTag === option.value}
                                onClick={() => setActiveTag(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="cat-gallery__carousel-wrap">
                    <button
                        type="button"
                        className="cat-gallery__scroll cat-gallery__scroll--left"
                        onClick={() => scrollBy(-1)}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div className="cat-gallery__carousel" ref={carouselRef}>
                        {visibleImages.length === 0 ? (
                            <div className="cat-gallery__empty">
                                <p>No favourites yet. Tap the little hearts to save your favourite poses!</p>
                            </div>
                        ) : (
                            visibleImages.map((image, index) => {
                                const imageId = image.id || image._id;
                                const isFavourite = favouriteSet.has(imageId);
                                return (
                                    <figure
                                        key={imageId}
                                        className={`cat-card ${isFavourite ? 'cat-card--favourite' : ''}`}
                                        onClick={() => openFullscreen(imageId)}
                                        style={{ '--card-delay': `${Math.min(index, 8) * 60}ms` }}
                                    >
                                        <img src={image.src || image.imageData} alt={image.alt} loading="lazy" />
                                        <button
                                            type="button"
                                            className="cat-card__favourite"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                toggleFavourite(imageId);
                                            }}
                                            aria-pressed={isFavourite}
                                            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                                        >
                                            {isFavourite ? '♥' : '♡'}
                                        </button>
                                    </figure>
                                );
                            })
                        )}
                    </div>

                    <button
                        type="button"
                        className="cat-gallery__scroll cat-gallery__scroll--right"
                        onClick={() => scrollBy(1)}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </section>

            {isFullscreen && modalImage && (
                <div className="cat-gallery__modal" role="dialog" aria-modal="true" aria-label="Cat photo full screen view">
                    <div className="cat-gallery__modal-backdrop" onClick={handleCloseModal}></div>
                    <div className="cat-gallery__modal-content">
                        <button
                            type="button"
                            className="cat-gallery__modal-close"
                            onClick={handleCloseModal}
                            aria-label="Close full screen view"
                            ref={modalCloseButtonRef}
                        >
                            ×
                        </button>
                        <div className="cat-gallery__modal-body">
                            <button
                                type="button"
                                className="cat-gallery__modal-nav"
                                onClick={() => handleModalShift(-1)}
                                disabled={modalIndex === 0}
                                aria-label="Previous photo"
                            >
                                ‹
                            </button>
                            <img src={modalImage.src || modalImage.imageData} alt={modalImage.alt} />
                            <button
                                type="button"
                                className="cat-gallery__modal-nav"
                                onClick={() => handleModalShift(1)}
                                disabled={modalIndex === modalLength - 1}
                                aria-label="Next photo"
                            >
                                ›
                            </button>
                        </div>
                        <div className="cat-gallery__modal-meta">
                            <button
                                type="button"
                                className="cat-gallery__modal-favourite"
                                onClick={() => toggleFavourite(modalImage.id || modalImage._id)}
                                aria-pressed={favouriteSet.has(modalImage.id || modalImage._id)}
                            >
                                {favouriteSet.has(modalImage.id || modalImage._id) ? '♥ Favourite' : '♡ Add to favourites'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
    useEffect(() => {
        const loadImages = async () => {
            const res = await getGallery();
            if (!res?.error && Array.isArray(res)) {
                const normalized = res.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                    src: item.imageData || item.src,
                    tags: Array.isArray(item.tags) ? item.tags : []
                }));
                setImages(normalized);
            }
        };
        loadImages();
    }, []);
