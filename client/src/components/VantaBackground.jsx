/**
 * @file VantaBackground.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component attaches the animated Vanta.js background to the application shell.
 */
import { useEffect, useRef } from 'react';

export default function VantaBackground() {
    const backgroundRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const attachVanta = async () => {
            try {
                // Bundle-friendly dynamic imports to avoid CSP-blocked CDNs.
                const [{ default: WAVES }, THREE] = await Promise.all([
                    import('vanta/dist/vanta.waves.min'),
                    import('three')
                ]);

                if (!mounted || !backgroundRef.current) return;

                instanceRef.current = WAVES({
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
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    return <div aria-hidden="true" className="vanta-background" ref={backgroundRef} />;
}
