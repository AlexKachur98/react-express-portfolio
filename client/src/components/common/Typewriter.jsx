/**
 * @file Typewriter.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders a looping typewriter effect for hero text.
 */
import { useEffect, useState } from 'react';

export default function Typewriter({
    phrases,
    typingSpeed = 90,
    deletingSpeed = 45,
    pause = 1600,
    cursor = '█'
}) {
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!phrases?.length) {
            return undefined;
        }

        const currentPhrase = phrases[index % phrases.length];
        const nextDelay = deleting ? deletingSpeed : typingSpeed;

        let pauseTimer;
        const timer = setTimeout(() => {
            if (!deleting) {
                const nextText = currentPhrase.slice(0, text.length + 1);
                setText(nextText);

                if (nextText === currentPhrase) {
                    pauseTimer = setTimeout(() => setDeleting(true), pause);
                }
            } else {
                const nextText = currentPhrase.slice(0, Math.max(0, text.length - 1));
                setText(nextText);

                if (nextText.length === 0) {
                    setDeleting(false);
                    setIndex((prev) => prev + 1);
                }
            }
        }, nextDelay);

        return () => {
            clearTimeout(timer);
            if (pauseTimer) clearTimeout(pauseTimer);
        };
    }, [deleting, deletingSpeed, index, pause, phrases, text, typingSpeed]);

    useEffect(() => {
        setText('');
        setDeleting(false);
        setIndex(0);
    }, [phrases]);

    return (
        <span className="typewriter">
            <span className="typewriter__text">{text}</span>
            <span aria-hidden="true" className="typewriter__cursor">
                {cursor}
            </span>
        </span>
    );
}
