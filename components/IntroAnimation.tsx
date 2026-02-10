
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { TechGlobe } from './TechGlobe';
import { DigitalConstellation } from './DigitalConstellation';

export const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1000), // Show "LOGOS"
            setTimeout(() => setStep(2), 2500), // Show "PAGES"
            setTimeout(() => setStep(3), 4000), // Final transition
            setTimeout(() => onComplete(), 5500),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[1000] bg-[#000814] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
        >
            {/* 3D Background */}
            <div className="absolute inset-0 opacity-50">
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <TechGlobe />
                    <DigitalConstellation />
                </Canvas>
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 text-center">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="logos"
                            initial={{ opacity: 0, scale: 0.8, letterSpacing: "2em" }}
                            animate={{ opacity: 1, scale: 1, letterSpacing: "1em" }}
                            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-white font-black text-4xl md:text-7xl tracking-[1em]"
                        >
                            LOGOS
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div
                            key="pages"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-cyan-400/40 font-black text-4xl md:text-7xl tracking-[0.5em]"
                        >
                            PAGES.
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div
                            key="tagline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="text-[10px] text-cyan-400 font-black uppercase tracking-[1em]"
                        >
                            Digital Craftsmanship
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-1 bg-cyan-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
            />
        </motion.div>
    );
};
