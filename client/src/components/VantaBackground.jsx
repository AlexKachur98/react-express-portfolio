/**
 * @file VantaBackground.jsx
 * @purpose Self-hosted Vanta Waves background (no external CDNs).
 */
import { useEffect, useRef } from 'react';

const loadScript = (src) => {
    if (typeof document === 'undefined') return Promise.resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return existing.dataset.loaded === 'true'
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', reject);
        });

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

    useEffect(() => {
        let mounted = true;

        const attachVanta = async () => {
            try {
                // Load self-hosted builds to satisfy CSP (served from /public).
                await loadScript('/three.min.js');
                await loadScript('/vanta.waves.min.js');

                const VANTA = window.VANTA;
                const THREE = window.THREE;

                if (!mounted || !backgroundRef.current || !VANTA?.WAVES || !THREE) {
                    console.error('Vanta assets not available', { hasVanta: !!VANTA, hasThree: !!THREE });
                    return;
                }

                if (instanceRef.current?.destroy) {
                    instanceRef.current.destroy();
                }

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
                    zoom: 0.85,
                });
            } catch (error) {
                console.error('Failed to initialise Vanta background.', error);
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
