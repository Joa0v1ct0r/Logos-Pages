
import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  cover_image_url: string;
  is_active: boolean;
}

const MotionLink = motion.create(Link);

export const Portfolio: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section id="portfolio" className="py-20 md:py-32 px-4 md:px-6 bg-light dark:bg-dark">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-neutral-500 animate-pulse font-bold tracking-widest uppercase text-xs">Carregando Portfólio...</div>
        </div>
      </section>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 px-4 md:px-6 bg-light dark:bg-dark relative z-20">
      <div className="max-w-7xl mx-auto mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-black dark:text-white">PORTFÓLIO.</h2>
          <p className="mt-2 md:mt-4 text-neutral-500 text-base md:text-lg">Projetos selecionados que definem nossa busca pela perfeição.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
        >
          {['Todos', 'Landing', 'Site', 'Sistema'].map((filter) => (
            <button key={filter} className="px-4 py-1.5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all whitespace-nowrap">
              {filter}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
      >
        {projects.map((project) => (
          <MotionLink
            key={project.id}
            to={`/projeto/${project.slug}`}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-[2.5rem] cursor-pointer bg-neutral-900 block"
          >
            {/* Image with subtle scroll effect on hover */}
            <motion.img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
            />

            {/* Premium Overlay */}
            <div className={`absolute inset-0 transition-colors duration-500 bg-gradient-to-t from-black via-black/20 to-transparent ${hoveredId === project.id ? 'bg-black/40 backdrop-blur-[2px]' : ''}`} />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="overflow-hidden">
                <span className="inline-block text-[#ffcc00] text-[10px] font-black uppercase tracking-widest mb-3">
                  {project.technologies?.[0] || 'Projeto Digital'}
                </span>
              </div>

              <h3 className="text-3xl font-black tracking-tighter mb-2 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
                {project.title}
              </h3>

              <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                <p className="text-neutral-400 text-sm font-medium leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 2).map(tech => (
                    <span key={tech} className="text-[10px] text-white/40 font-bold uppercase tracking-widest whitespace-nowrap">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="hidden md:flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver Detalhes
                  <ArrowUpRight size={14} className="text-[#ffcc00]" />
                </div>
              </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ffcc00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </MotionLink>
        ))}
      </motion.div>
    </section>
  );
};
