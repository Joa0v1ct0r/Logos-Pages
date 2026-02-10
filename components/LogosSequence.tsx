
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

    // Fade in the site content (Hero) as the globe expands
    const contentOpacity = useTransform(smoothProgress, [0.2, 0.95], [0, 1]);
    const contentY = useTransform(smoothProgress, [0.2, 0.95], [50, 0]);

    // Fade out globe as Hero becomes central
    const globeOpacity = useTransform(smoothProgress, [0.65, 0.85], [1, 0]);

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-[#000a1a]"
            style={{ height: isMobile ? "auto" : "300vh" }}
        >
            {/* 3D PERSPECTIVE LAYER (Fixed) - DESKTOP ONLY */}
            {!isMobile && (
                <motion.div
                    style={{ opacity: globeOpacity }}
                    className="fixed inset-0 z-[5]"
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

            {/* CONTENT LAYER (Hero fades in calmly) */}
            <div className="relative z-20 h-full flex flex-col justify-end pointer-events-none">
                <motion.div
                    style={{
                        opacity: isMobile ? 1 : contentOpacity,
                        y: isMobile ? 0 : contentY
                    }}
                    className="h-screen w-full pointer-events-none"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};
