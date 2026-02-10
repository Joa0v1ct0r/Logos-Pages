import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll progress for a more premium feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Transforms for the sticky heading content
  const headOpacity = useTransform(smoothProgress, [0, 0.2, 0.5], [0, 1, 1]);
  const headY = useTransform(smoothProgress, [0, 0.2], [100, 0]);
  const headScale = useTransform(smoothProgress, [0, 0.2], [0.95, 1]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 md:py-48 px-4 md:px-6 relative bg-light dark:bg-dark overflow-hidden"
    >
      {/* Decorative Dots */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-3 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-black dark:bg-white rounded-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-32 items-start">

          {/* Main Title - Sticky and Animated */}
          <motion.div
            style={{
              opacity: headOpacity,
              y: headY,
              scale: headScale
            }}
            className="lg:sticky lg:top-40 w-full"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00f2ff]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]">DNA Logos</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 md:mb-12 leading-[0.9] text-black dark:text-white uppercase">
              A GÊNESE <br />
              <span className="text-black/30 dark:text-white/40">DA SUA</span><br />
              <span className="text-[#00f2ff]">MARCA.</span>
            </h2>

            <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl max-w-sm mb-12 md:mb-16 font-medium leading-relaxed">
              Tudo começa com a palavra certa. Combinamos engenharia divina e estética minimalista para criar o seu império digital.
            </p>

            <div className="flex items-center gap-6 group cursor-default">
              <div className="w-12 md:w-16 h-px bg-[#00f2ff] group-hover:w-24 transition-all duration-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 group-hover:text-[#00f2ff] transition-colors">
                Missão: Perfeição.
              </span>
            </div>
          </motion.div>

          {/* Services List - Staggered scroll animation */}
          <div className="grid gap-6 md:gap-8 w-full pt-12 lg:pt-0">
            {SERVICES.map((service, index) => {
              // Tighter stagger for a more continuous list feel
              const start = 0.1 + (index * 0.05);
              const end = start + 0.15;

              return (
                <ServiceCard
                  key={index}
                  service={service}
                  progress={smoothProgress}
                  range={[start, end]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Refined smaller card design
const ServiceCard = ({ service, progress, range }: { service: any, progress: any, range: [number, number] }) => {
  const cardOpacity = useTransform(progress, range, [0, 1]);
  const cardScale = useTransform(progress, range, [0.93, 1]);
  const cardX = useTransform(progress, range, [40, 0]);

  return (
    <motion.div
      style={{
        opacity: cardOpacity,
        scale: cardScale,
        x: cardX
      }}
      className="group p-8 md:p-10 border border-black/5 dark:border-white/5 bg-white/40 dark:bg-neutral-900/10 rounded-[2.5rem] backdrop-blur-sm transition-all duration-700 hover:bg-white dark:hover:bg-white/[0.03] hover:border-[#00f2ff]/20 shadow-sm dark:shadow-none"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-black dark:text-white group-hover:bg-[#00f2ff] group-hover:text-black transition-all duration-500">
        <div className="scale-110">
          {service.icon}
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-black mb-3 tracking-tight uppercase text-black dark:text-white">{service.title}</h3>
      <p className="text-neutral-500 text-sm md:text-lg leading-relaxed group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors font-medium">
        {service.description}
      </p>
    </motion.div>
  );
};
