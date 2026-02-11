import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from 'lucide-react';

import { Project } from '../types';

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Register GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useLayoutEffect(() => {
    if (loading || projects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".portfolio-card-gsap",
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]);

  // Motion value for manually controlled X position (in percentage)
  const xPos = useMotionValue(0);

  // Correctly transform the numeric value to a percentage string
  const xTransform = useTransform(xPos, v => `${v}%`);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Frame-by-frame animation logic for the marquee
  useAnimationFrame((_time, delta) => {
    if (loading || isPaused || projects.length === 0) return;
    const moveStep = (delta / 1000) * 5;
    let nextX = xPos.get() - moveStep;
    if (nextX <= -50) nextX = 0;
    xPos.set(nextX);
  });

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-light dark:bg-dark">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-neutral-500 animate-pulse font-black uppercase text-xs tracking-[0.3em]">Carregando Portfólio...</div>
        </div>
      </section>
    );
  }

  // Double list for perfect looping
  const displayProjects = projects.length > 0 ? [...projects, ...projects] : [];

  return (
    <div
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 md:py-48 bg-light dark:bg-dark overflow-hidden border-y border-black/5 dark:border-white/5"
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#ffcc00]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffcc00]">Nossos Cases</span>
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-black dark:text-white leading-[0.9]">PORTFÓLIO<span className="text-[#ffcc00]">.</span></h2>
            <p className="mt-6 text-neutral-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed">Experiências digitais que unem estética de luxo e performance de elite.</p>
          </motion.div>
        </div>

        <div className="relative w-full h-[300px] md:h-[420px]">
          {/* Gradients to fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-light dark:from-dark to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-light dark:from-dark to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex gap-8 md:gap-12 absolute left-0 h-full"
            style={{
              x: xTransform,
              width: "fit-content"
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {displayProjects.map((project, idx) => (
              <div
                key={`${project.id}-${idx}`}
                className="portfolio-card-gsap flex-shrink-0 w-[260px] md:w-[500px] h-full group relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl"
              >
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                />

                {/* Minimalist Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500 backdrop-blur-0 group-hover:backdrop-blur-sm p-10 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#ffcc00] text-[10px] font-black uppercase tracking-widest block mb-4">
                      {project.technologies?.[0] || 'High-End Web'}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase mb-6 leading-tight">
                      {project.title}
                    </h3>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-sm hidden md:block">
                        {project.description}
                      </p>

                      <a
                        href={project.project_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-[#ffcc00] text-black px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ffcc00]/20"
                      >
                        VER PROJETO
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Static Mobile Label */}
                <div className="absolute bottom-6 left-10 md:hidden group-hover:opacity-0 transition-opacity">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-20 flex justify-center opacity-10">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
