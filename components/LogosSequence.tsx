
import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { LogosGlobe } from './LogosGlobe';

interface LogosSequenceProps {
    children: React.ReactNode;
    isDark: boolean;
}

export const LogosSequence: React.FC<LogosSequenceProps> = ({ children, isDark }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // The "Sequence" container for the scroll scrub
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Snappier, responsive scrub progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001
    });

    // 1. Globe Intro: 0 to 0.2
    // 2. Crossfade: Globe [0.2 -> 0.4], Hero [0.3 -> 0.5]
    // 3. Hero Focus: 0.5 to 1.0 (Stay visible for the rest of the 350vh)
    const contentOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
    const contentY = useTransform(smoothProgress, [0.3, 0.5], [40, 0]);

    // Globe clears out early to allow the Hero to breathe
    const globeOpacity = useTransform(smoothProgress, [0.2, 0.45], [1, 0]);

    // Ensure buttons are clickable only when Hero is established
    const pointerEvents = useTransform(smoothProgress, p => p > 0.5 ? 'auto' : 'none');

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-[#000a1a] z-0"
            style={{ height: isMobile ? "auto" : "350vh" }}
        >
            {/* 3D PERSPECTIVE LAYER (Fixed) - DESKTOP ONLY */}
            {!isMobile && (
                <motion.div
                    style={{ opacity: globeOpacity }}
                    className="fixed inset-0 z-[5] pointer-events-none"
                >
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
                                progress={smoothProgress}
                                isDark={isDark}
                            />
                        </Suspense>
                    </Canvas>
                </motion.div>
            )}

            {/* CONTENT LAYER - Sticky so the Hero stays centered while fading in during the sequence */}
            <div className={`z-20 w-full flex flex-col items-center justify-center ${isMobile ? 'relative py-20' : 'sticky top-0 h-screen overflow-hidden'}`}>
                <motion.div
                    style={{
                        opacity: isMobile ? 1 : contentOpacity,
                        y: isMobile ? 0 : contentY,
                        pointerEvents: isMobile ? 'auto' : pointerEvents
                    }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );


};
