/**
 * @file VantaBackground.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose Self-hosted Vanta Waves background (no external CDNs).
 */
import { useEffect, useRef } from 'react';
import logger from '../../utils/logger.js';

const loadScript = (src) => {
    if (typeof document === 'undefined') return Promise.resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
        if (existing.dataset.loaded === 'true' || existing.readyState === 'complete') {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', reject);
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.dataset.loaded = 'false';
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export default function VantaBackground() {
    const backgroundRef = useRef(null);
    const instanceRef = useRef(null);
    const retriesRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const attachVanta = async () => {
            try {
                // Load self-hosted builds to satisfy CSP (served from /public/vendor).
                await loadScript('/vendor/three.min.js');
                await loadScript('/vendor/vanta.waves.min.js');

                let VANTA = window.VANTA;
                const THREE = window.THREE;
                const RawEffect = window._vantaEffect;

                // Fallback: some builds expose only `_vantaEffect`.
                if (!VANTA && RawEffect) {
                    VANTA = window.VANTA = { WAVES: (opts) => new RawEffect(opts) };
                } else if (VANTA && !VANTA.WAVES && RawEffect) {
                    VANTA.WAVES = (opts) => new RawEffect(opts);
                }

                if (!mounted) return;

                // Wait a tick if the ref is not attached yet (StrictMode double-render, etc.).
                if (!backgroundRef.current && retriesRef.current < 3) {
                    retriesRef.current += 1;
                    requestAnimationFrame(attachVanta);
                    return;
                }

                if (!backgroundRef.current || !VANTA?.WAVES || !THREE) {
                    logger.error('Vanta assets not available', {
                        hasVanta: !!VANTA,
                        hasWaves: !!VANTA?.WAVES,
                        hasThree: !!THREE,
                        rawEffect: !!RawEffect
                    });
                    return;
                }

                if (instanceRef.current?.destroy) {
                    instanceRef.current.destroy();
                }

                try {
                    instanceRef.current = VANTA.WAVES({
                        el: backgroundRef.current,
                        THREE,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.0,
                        minWidth: 200.0,
                        scale: 1.0,
                        scaleMobile: 1.0,
                        color: 0x020617,
                        shininess: 35.0,
                        waveHeight: 18.0,
                        waveSpeed: 0.35,
                        zoom: 0.85
                    });
                } catch (err) {
                    logger.error('Vanta init failed', err);
                }
            } catch (error) {
                logger.error('Failed to initialise Vanta background.', error);
            }
        };

        attachVanta();

        return () => {
            mounted = false;
            if (instanceRef.current?.destroy) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    return <div aria-hidden="true" className="vanta-background" ref={backgroundRef} />;
}
