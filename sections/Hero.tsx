
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-12 overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="relative z-10 max-w-7xl w-full pointer-events-none">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-10 inline-flex items-center gap-3 md:gap-4"
          >
            <span className="w-6 md:w-10 h-px bg-white/40" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] md:tracking-[1em] text-white">
              Transforming Word into Code
            </span>
          </motion.div>

          <div className="relative group w-full">
            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[17vw] md:text-[11rem] font-extrabold tracking-tighter leading-[0.85] md:leading-[0.8] uppercase select-none text-white"
              >
                LOGOS
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-8 md:mb-12">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[17vw] md:text-[11rem] font-extrabold tracking-tighter leading-[0.85] md:leading-[0.8] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#ffcc00] select-none"
              >
                PAGES.
              </motion.h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-10 md:gap-16">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="max-w-xl text-base md:text-2xl text-neutral-400 font-light leading-relaxed px-4 md:px-0"
            >
              No princípio era a ideia. Nós a transformamos em experiências digitais eternas, unindo autoridade e design de alto impacto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full md:w-auto px-4 md:px-0"
            >
              <button
                className="group relative flex items-center justify-between md:justify-start gap-6 md:gap-8 bg-white text-black pl-8 md:pl-12 pr-4 md:pr-6 py-4 md:py-6 rounded-full w-full md:w-auto transition-all duration-700 shadow-xl pointer-events-auto"
              >
                <span className="relative z-10 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Criar Legado</span>

                <div className="relative z-10 bg-black w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-12 left-12 items-center gap-6 opacity-40">
        <span className="text-sm font-serif italic text-white">Α</span>
        <div className="w-16 h-px bg-white/30" />
        <span className="text-sm font-serif italic text-white">Ω</span>
      </div>

      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute bottom-8 md:bottom-12 right-1/2 translate-x-1/2 md:right-12 md:translate-x-0 text-white/40 uppercase text-[7px] md:text-[8px] tracking-[1em] font-black pointer-events-none"
      >
        Scroll
      </motion.div>
    </section>
  );
};
