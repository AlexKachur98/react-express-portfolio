import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const COOKIE_KEY = 'cat_gallery_favourites';

const RAW_IMAGES = [
    { id: 'img_0122', src: '/assets/IMG_0122.jpeg', alt: 'Cat lounging on a blanket' },
    { id: 'img_0146', src: '/assets/IMG_0146.jpeg', alt: 'Curious cat looking at the camera' },
    { id: 'img_0373', src: '/assets/IMG_0373.JPG', alt: 'Cat playing with a toy' },
    { id: 'img_0374', src: '/assets/IMG_0374.JPG', alt: 'Cat basking in the sun' },
    { id: 'img_0375', src: '/assets/IMG_0375.JPG', alt: 'Cat stretching on the floor' },
    { id: 'img_0376', src: '/assets/IMG_0376.JPG', alt: 'Cat peeking from behind furniture' },
    { id: 'img_1646', src: '/assets/IMG_1646.jpeg', alt: 'Cat curled up napping' },
    { id: 'img_4576', src: '/assets/IMG_4576.JPG', alt: 'Cat sitting in a window sill' },
    { id: 'img_6063', src: '/assets/IMG_6063.jpeg', alt: 'Cat walking through grass' },
    { id: 'img_6436', src: '/assets/IMG_6436.jpeg', alt: 'Playful cat with big eyes' },
    { id: 'img_6823', src: '/assets/IMG_6823.jpeg', alt: 'Cat wearing a tiny bow tie' },
    { id: 'img_7129', src: '/assets/IMG_7129.jpeg', alt: 'Cat exploring a cardboard box' },
    { id: 'img_7875', src: '/assets/IMG_7875.jpeg', alt: 'Cat snuggling on a pillow' },
    { id: 'img_8285', src: '/assets/IMG_8285.JPG', alt: 'Cat with paws tucked under' },
    { id: 'img_8359', src: '/assets/IMG_8359.jpeg', alt: 'Cat lying in the sunbeam' },
    { id: 'img_8362', src: '/assets/IMG_8362.JPG', alt: 'Cat perched on a cat tree' },
    { id: 'img_8628', src: '/assets/IMG_8628.jpeg', alt: 'Cat gazing out the window' },
    { id: 'img_8718', src: '/assets/IMG_8718.jpeg', alt: 'Cat mid-meow' },
    { id: 'img_8758', src: '/assets/IMG_8758.jpeg', alt: 'Cat hiding beneath a blanket' },
    { id: 'img_8862', src: '/assets/IMG_8862.jpeg', alt: 'Cat cuddled with a friend' },
    { id: 'img_8937', src: '/assets/IMG_8937.jpeg', alt: 'Cat ready to pounce' },
    { id: 'img_8989', src: '/assets/IMG_8989.jpeg', alt: 'Cat on a cozy chair' },
    { id: 'img_8992', src: '/assets/IMG_8992.jpeg', alt: 'Cat paws resting on a knee' },
    { id: 'img_8995', src: '/assets/IMG_8995.jpeg', alt: 'Cat eyes closed resting' },
    { id: 'img_8996', src: '/assets/IMG_8996.jpeg', alt: 'Cat pondering life' },
    { id: 'img_9058', src: '/assets/IMG_9058.jpeg', alt: 'Cat sitting in a basket' },
    { id: 'img_9202', src: '/assets/IMG_9202.jpeg', alt: 'Cat with fluffy tail' },
    { id: 'img_9240', src: '/assets/IMG_9240.jpeg', alt: 'Cat playing peekaboo' },
    { id: 'img_9317', src: '/assets/IMG_9317.jpeg', alt: 'Cat napping on a desk' },
    { id: 'img_9400', src: '/assets/IMG_9400.jpeg', alt: 'Cat rolling over playfully' },
    { id: 'img_9412', src: '/assets/IMG_9412.jpeg', alt: 'Cat with head tilted' },
    { id: 'img_9461', src: '/assets/IMG_9461.jpeg', alt: 'Cat leaning on a pillow' },
    { id: 'img_9545', src: '/assets/IMG_9545.jpeg', alt: 'Cat resting on a sofa' },
];

const MOURA_IDS = new Set(['img_0122', 'img_4576', 'img_6063', 'img_6436', 'img_6823', 'img_7129', 'img_7875', 'img_8285', 'img_8996', 'img_9240', 'img_9461']);
const TOGETHER_IDS = new Set(['img_0374', 'img_0375', 'img_8628', 'img_8992', 'img_9058', 'img_9400', 'img_9412']);

const CAT_IMAGES = RAW_IMAGES.map((image) => {
    let tags;
    if (TOGETHER_IDS.has(image.id)) {
        tags = ['together'];
    } else if (MOURA_IDS.has(image.id)) {
        tags = ['moura'];
    } else {
        tags = ['simba'];
    }
    return { ...image, tags };
});

const TAG_OPTIONS = [
    { value: 'all', label: 'All cats' },
    { value: 'simba', label: 'Simba' },
    { value: 'moura', label: 'Moura' },
    { value: 'together', label: 'Together' },
];

const filterByTag = (images, tag) => (tag === 'all' ? images : images.filter((image) => image.tags.includes(tag)));

const favouriteCookie = {
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
    const [favoriteIds, setFavoriteIds] = useState(() => favouriteCookie.read());
    const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
    const [activeTag, setActiveTag] = useState('all');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [modalSource, setModalSource] = useState({ source: 'all', tag: 'all' });
    const [modalIndex, setModalIndex] = useState(0);
    const carouselRef = useRef(null);

    const favouriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
    const favouriteSequence = useMemo(() => CAT_IMAGES.filter((image) => favouriteSet.has(image.id)), [favouriteSet]);
    const tagFiltered = useMemo(() => filterByTag(CAT_IMAGES, activeTag), [activeTag]);
    const favouriteTagSequence = useMemo(() => filterByTag(favouriteSequence, activeTag), [favouriteSequence, activeTag]);
    const visibleImages = showFavouritesOnly ? favouriteTagSequence : tagFiltered;
    const modalSequence = useMemo(() => {
        const base = modalSource.source === 'favourites' ? favouriteSequence : CAT_IMAGES;
        return filterByTag(base, modalSource.tag);
    }, [modalSource, favouriteSequence]);
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
        favouriteCookie.write(favoriteIds);
    }, [favoriteIds]);

    useEffect(() => {
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
        const source = showFavouritesOnly ? 'favourites' : 'all';
        const tag = activeTag;
        const sequence = showFavouritesOnly ? favouriteTagSequence : tagFiltered;
        const index = sequence.findIndex((image) => image.id === imageId);
        if (index === -1) {
            return;
        }
        setModalSource({ source, tag });
        setModalIndex(index);
        setIsFullscreen(true);
    };

    const handleCloseModal = () => {
        setIsFullscreen(false);
    };

    return (
        <div className="cat-gallery">
            <div className="cat-gallery__bg" aria-hidden="true"></div>
            <div className="cat-gallery__paws" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} className={`cat-gallery__paw cat-gallery__paw--${index}`}>🐾</span>
                ))}
            </div>

            <section className="cat-gallery__content">
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
                            visibleImages.map((image) => {
                                const isFavourite = favouriteSet.has(image.id);
                                return (
                                    <figure
                                        key={image.id}
                                        className={`cat-card ${isFavourite ? 'cat-card--favourite' : ''}`}
                                        onClick={() => openFullscreen(image.id)}
                                    >
                                        <img src={image.src} alt={image.alt} loading="lazy" />
                                        <button
                                            type="button"
                                            className="cat-card__favourite"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                toggleFavourite(image.id);
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
                        <button type="button" className="cat-gallery__modal-close" onClick={handleCloseModal} aria-label="Close full screen view">
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
                            <img src={modalImage.src} alt={modalImage.alt} />
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
                                onClick={() => toggleFavourite(modalImage.id)}
                                aria-pressed={favouriteSet.has(modalImage.id)}
                            >
                                {favouriteSet.has(modalImage.id) ? '♥ Favourite' : '♡ Add to favourites'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
