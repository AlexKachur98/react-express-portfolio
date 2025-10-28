/**
 * @file VantaBackground.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component attaches the animated Vanta.js background to the application shell.
 */
import { useEffect, useRef } from 'react';

const loadScript = (src) => {
    if (typeof document === 'undefined') {
        return Promise.resolve();
    }

    if (document.querySelector(`script[src="${src}"]`)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
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
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js');

                if (mounted && backgroundRef.current && window.VANTA?.WAVES && window.THREE) {
                    instanceRef.current = window.VANTA.WAVES({
                        el: backgroundRef.current,
                        THREE: window.THREE,
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
                }
            } catch (error) {
                console.error('Failed to initialise Vanta background.', error);
            }
        };

        attachVanta();

        return () => {
            mounted = false;
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    return <div aria-hidden="true" className="vanta-background" ref={backgroundRef} />;
}
