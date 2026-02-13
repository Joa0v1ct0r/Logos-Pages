import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from 'lucide-react';

import { Project } from '../types';

const PortfolioCard = ({
  project,
  idx,
  onMouseEnter: onMouseEnterProp
}: {
  project: Project;
  idx: number;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasVideo = !!project.video_url;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger on desktop/mouse devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsHovered(true);
      if (videoRef.current && hasVideo) {
        videoRef.current.play().catch(() => {
          // Silent catch for autoplay restrictions if any, though it's muted
        });
      }
      onMouseEnterProp?.(e);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="portfolio-card-gsap flex-shrink-0 w-[260px] md:w-[500px] h-full group relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl"
    >
      {/* Background Image */}
      <img
        src={project.cover_image_url}
        alt={project.title}
        className={`w-full h-full object-cover transition-all duration-1000 ${hasVideo && isHovered ? 'opacity-0' : 'scale-100 opacity-100'
          }`}
      />

      {/* Video Hover Layer (Desktop Only) */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={project.video_url}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        />
      )}

      {/* Minimalist Overlay - Conditional based on isHovered and hasVideo */}
      <div className={`absolute inset-0 transition-all duration-500 p-10 flex flex-col justify-end ${isHovered ? 'bg-transparent backdrop-blur-0' : 'bg-black/20'
        }`}>
        <div className={`transform transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-4'}`}>
          <span className="text-[#ffcc00] text-[10px] font-black uppercase tracking-widest block mb-4">
            {project.technologies?.[0] || 'High-End Web'}
          </span>
          <h3 className={`text-2xl md:text-4xl font-black tracking-tighter uppercase mb-6 leading-tight transition-colors duration-500 ${isHovered ? 'text-cyan-400' : 'text-white'
            }`}>
            {project.title}
          </h3>

          <div className={`flex items-center justify-between transition-opacity duration-500 delay-100 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            {!hasVideo && (
              <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-sm hidden md:block">
                {project.description}
              </p>
            )}

            <a
              href={project.project_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-4 bg-[#ffcc00] text-black px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ffcc00]/20 ${hasVideo ? 'ml-auto' : ''
                }`}
            >
              VER PROJETO
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Static Mobile Label */}
      <div className={`absolute bottom-6 left-10 md:hidden transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
      </div>
    </div>
  );
};

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
  // NEW: Motion value for centering offset (in pixels)
  const xOffset = useMotionValue(0);

  // Combine percentage-based marquee with pixel-based centering offset
  const xCombined = useTransform([xPos, xOffset], ([base, offset]) => `calc(${base}% + ${offset}px)`);

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

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    setIsPaused(true);

    // Calculate centering offset
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const cardCenter = rect.left + rect.width / 2;
    const viewportCenter = viewportWidth / 2;
    const delta = viewportCenter - cardCenter;

    // Animate to new centered position
    const currentOffset = xOffset.get();
    gsap.to(xOffset, {
      duration: 0.8,
      value: currentOffset + delta,
      ease: "power2.inOut",
      overwrite: true
    });
  };

  const handleContainerMouseLeave = () => {
    // Return to original position before resuming loop
    gsap.to(xOffset, {
      duration: 0.8,
      value: 0,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => setIsPaused(false)
    });
  };

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
              x: xCombined,
              width: "fit-content"
            }}
            onMouseLeave={handleContainerMouseLeave}
          >
            {displayProjects.map((project, idx) => (
              <PortfolioCard
                key={`${project.id}-${idx}`}
                project={project}
                idx={idx}
                onMouseEnter={handleCardMouseEnter}
              />
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
