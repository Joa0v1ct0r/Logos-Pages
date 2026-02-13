import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { LogosGlobe } from './LogosGlobe';

interface LogosSequenceProps {
    isDark: boolean;
    onComplete: () => void;
    initialProgress?: number;
    isIntroDone?: boolean;
}

export const LogosSequence: React.FC<LogosSequenceProps> = ({ isDark, onComplete, initialProgress = 0, isIntroDone = false }) => {
    const [isMobile, setIsMobile] = useState(false);
    const progress = useMotionValue(initialProgress);

    const [hasInteracted, setHasInteracted] = useState(false);

    // Sync progress when initialProgress changes (e.g. when going back)
    useEffect(() => {
        progress.set(initialProgress);
        setHasInteracted(false);
    }, [initialProgress, progress]);

    // Progressive control via mouse wheel and touch
    useEffect(() => {
        if (isIntroDone) return; // Don't attach listeners if intro is already finished

        let lastTouchY = 0;

        const handleWheel = (e: WheelEvent) => {
            const current = progress.get();
            if (e.deltaY > 0) setHasInteracted(true); // User is scrolling forward

            // Smoother delta calculation
            const delta = e.deltaY * 0.0006;
            const next = Math.min(Math.max(current + delta, 0), 1);
            progress.set(next);
        };

        const handleTouchStart = (e: TouchEvent) => {
            lastTouchY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = lastTouchY - currentY;
            lastTouchY = currentY;

            if (deltaY > 0) setHasInteracted(true);

            const current = progress.get();
            const delta = deltaY * 0.0015;
            const next = Math.min(Math.max(current + delta, 0), 1);
            progress.set(next);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [progress, isIntroDone]);

    // Snappier, responsive scrub progress
    const smoothProgress = useSpring(progress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001
    });

    // Better completion detection synced with the visual progress
    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            // Only complete if we are at the end AND the user has moved forward
            // Or if we started at 0 (initial entry)
            if (v >= 0.98 && (hasInteracted || initialProgress === 0)) {
                const timer = setTimeout(() => {
                    onComplete();
                }, 50);
                return () => clearTimeout(timer);
            }
        });
        return unsubscribe;
    }, [onComplete, smoothProgress, hasInteracted, initialProgress]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Sync with existing animation ranges in LogosGlobe
    const internalGlobeProgress = smoothProgress;

    return (
        <motion.div
            initial={{ opacity: initialProgress > 0 ? 0 : 1 }}
            animate={{
                opacity: isIntroDone ? 0 : 1,
                scale: isIntroDone ? 1.05 : 1,
                filter: isIntroDone ? "blur(10px)" : "blur(0px)",
                pointerEvents: isIntroDone ? "none" : "auto",
                zIndex: isIntroDone ? 0 : 2000
            }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#000a1a] overflow-hidden"
        >
            {/* 3D PERSPECTIVE LAYER */}
            <div className="absolute inset-0 z-[5]">
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance"
                    }}
                >
                    <Suspense fallback={null}>
                        <LogosGlobe
                            progress={internalGlobeProgress}
                            isDark={isDark}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Hint for the user */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent to-cyan-500" />
                    <span className="text-[8px] uppercase tracking-[1em] text-cyan-500 font-black">Scroll</span>
                </div>
            </motion.div>
        </motion.div>
    );
};
