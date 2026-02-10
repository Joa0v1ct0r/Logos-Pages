
import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-32 px-4 md:px-6 relative bg-light dark:bg-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-3 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-black dark:bg-white rounded-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-40 w-full"
          >
            <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6 md:mb-10 leading-[0.9] text-black dark:text-white">
              A GÊNESE <br /><span className="text-black/30 dark:text-white/40">DA SUA MARCA.</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-sm mb-8 md:mb-12 font-light leading-relaxed">
              Tudo começa com a palavra certa. Combinamos engenharia divina e estética minimalista para criar o seu império digital.
            </p>
            <div className="flex items-center gap-4 md:gap-6 group">
              <div className="w-12 md:w-16 h-px bg-[#00f2ff] group-hover:w-24 transition-all duration-700" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-neutral-400 dark:text-neutral-500">
                Missão: Perfeição.
              </span>
            </div>
          </motion.div>

          <div className="grid gap-6 md:gap-8 w-full">
            {SERVICES.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 md:p-10 border border-black/5 dark:border-white/5 bg-white/50 dark:bg-neutral-900/20 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-700 hover:bg-white dark:hover:bg-white/[0.02] shadow-sm dark:shadow-none"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-black/5 dark:bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 text-black dark:text-white group-hover:scale-110 transition-all">
                  {service.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight uppercase text-black dark:text-white">{service.title}</h3>
                <p className="text-neutral-500 text-base md:text-lg leading-relaxed group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
