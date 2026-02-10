
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Play,
    MousePointer2,
    Shield,
    Lock,
    Globe
} from 'lucide-react';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';

export const ProjectDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!error && data) {
                setProject(data);
            }
            setLoading(false);
        };

        fetchProject();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
                <div className="text-neutral-500 animate-pulse font-black uppercase text-xs tracking-[0.3em]">Carregando Case...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center gap-6">
                <div className="text-neutral-500 font-bold uppercase text-xs">Projeto não encontrado.</div>
                <Link to="/" className="text-[#ffcc00] font-black uppercase text-xs tracking-widest border-b border-[#ffcc00] pb-1">Voltar ao Início</Link>
            </div>
        );
    }

    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <main className="relative bg-light dark:bg-dark text-dark dark:text-white selection:bg-[#ffcc00]/30 min-h-screen">
            <div className="fixed inset-0 grainy z-[100] pointer-events-none" />
            <div className="fixed inset-0 divine-pattern z-[1] opacity-30 pointer-events-none" />
            <CustomCursor />

            <nav className="fixed top-0 left-0 w-full z-[110] p-6 md:p-8 flex justify-between items-center mix-blend-difference">
                <Link to="/" className="group flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Voltar</span>
                </Link>
                <div className="text-white font-black tracking-tighter text-xl">LOGOS.</div>
            </nav>

            {/* SECTION 1: HERO */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-32 text-center"
            >
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00]"
                        >
                            {project.status === 'Public' ? <Globe size={12} /> : project.status === 'Private' ? <Lock size={12} /> : <Shield size={12} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{project.status} Case</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]"
                        >
                            {project.title.toUpperCase()}.
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-3xl font-medium text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-tight"
                    >
                        {project.subtitle || project.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 pt-8"
                    >
                        {project.technologies?.map((tech) => (
                            <span key={tech} className="px-6 py-2 bg-neutral-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                {tech}
                            </span>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-px h-12 bg-current" />
                </div>
            </motion.section>

            {/* SECTION 2: VISUAL DEMO */}
            <section className="relative px-4 md:px-12 py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {project.demo_type === 'video' ? (
                        <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                            <video
                                src={project.demo_video_url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl max-h-[80vh]">
                            <motion.div
                                animate={{ y: ['0%', '-50%'] }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="w-full"
                            >
                                {project.demo_images && project.demo_images.length > 0 ? (
                                    project.demo_images.map((img, i) => (
                                        <img key={i} src={img} alt={`Demo ${i}`} className="w-full" />
                                    ))
                                ) : (
                                    <img src={project.cover_image_url} alt="Main Demo" className="w-full" />
                                )}
                            </motion.div>
                            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[3rem]" />
                            <div className="absolute bottom-10 right-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                <MousePointer2 size={14} className="text-[#ffcc00]" />
                                Visualização em Scroll
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 3 & 4: ABOUT & WHAT WAS DEVELOPED */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffcc00]">O Desafio</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Sobre o Projeto</h3>
                            <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                                {project.long_description || project.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Objetivo</h4>
                                <p className="text-sm font-medium leading-relaxed">{project.objectives || 'Criar uma presença digital única e funcional.'}</p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Diferenciais</h4>
                                <p className="text-sm font-medium leading-relaxed">{project.differentials || 'UX focado em conversão e animações de alto nível.'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffcc00]">A Entrega</h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">O que foi desenvolvido</h3>

                        <div className="space-y-4">
                            {(project.developed_items && project.developed_items.length > 0 ? project.developed_items : [
                                { title: 'Design UI/UX', description: 'Interface moderna e intuitiva focada em resultados.' },
                                { title: 'Desenvolvimento Frontend', description: 'Código limpo, performático e totalmente responsivo.' },
                                { title: 'SEO & Performance', description: 'Otimização máxima para mecanismos de busca.' }
                            ]).map((item, i) => (
                                <div key={i} className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-[#ffcc00]/30 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold">{item.title}</h4>
                                            <p className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors">{item.description}</p>
                                        </div>
                                        <CheckCircle2 className="text-[#ffcc00] opacity-20 group-hover:opacity-100 transition-all shrink-0" size={24} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: CTA FINAL */}
            <section className="py-40 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-[#ffcc00]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                        QUER ALGO NESSE <br /> <span className="text-[#ffcc00]">NÍVEL?</span>
                    </h2>

                    <a
                        href={`https://wa.me/5511999999999?text=${encodeURIComponent(project.whatsapp_message || `Olá! Vi o projeto ${project.title} no seu portfólio e gostaria de algo semelhante.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-[#ffcc00] text-black rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#ffcc00]/20 hover:scale-110 active:scale-95 transition-all group"
                    >
                        Solicitar Orçamento
                        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>

                    <div className="pt-20">
                        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 hover:text-white transition-colors">
                            Ver mais projetos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-6 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600">
                Logos Pages Digital Craftsmanship.
            </footer>
        </main>
    );
};
