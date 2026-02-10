
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

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

    return (
        <main className="relative bg-light dark:bg-dark text-dark dark:text-white selection:bg-[#ffcc00]/30 min-h-screen">
            <div className="fixed inset-0 grainy z-[100] pointer-events-none" />
            <div className="fixed inset-0 divine-pattern z-[1] opacity-30 pointer-events-none" />
            <CustomCursor />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#ffcc00] z-[120] origin-left"
                style={{ scaleX: useTransform(scrollY, [0, 2000], [0, 1]) }}
            />

            <nav className="fixed top-0 left-0 w-full z-[110] p-6 md:p-8 flex justify-between items-center bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/5">
                <Link to="/" className="group flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Voltar ao Portfólio</span>
                </Link>
                <div className="text-white font-black tracking-tighter text-xl">LOGOS<span className="text-[#ffcc00]">.</span></div>
            </nav>

            {/* SECTION 1: CINEMATIC HERO */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 text-center"
            >
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="flex flex-col items-center gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-400"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ffcc00] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Case Study — {project.status}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.8] uppercase"
                        >
                            {project.title?.substring(0, project.title.length - 1)}<span className="text-[#ffcc00]">{project.title?.slice(-1)}.</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5 max-w-3xl mx-auto"
                    >
                        <div className="text-center md:text-left">
                            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2">Cliente</h4>
                            <p className="text-sm font-bold">{project.title}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2">Ano</h4>
                            <p className="text-sm font-bold">{new Date().getFullYear()}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2">Categoria</h4>
                            <p className="text-sm font-bold">{project.technologies?.[0] || 'Digital'}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-2">Rol</h4>
                            <p className="text-sm font-bold">Full Identity</p>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] rotate-90 origin-left translate-x-1">Scroll</span>
                    <div className="w-px h-24 bg-gradient-to-b from-white to-transparent" />
                </div>
            </motion.section>

            {/* SECTION 2: THE REVELATION (DEMO) */}
            <section className="relative px-4 md:px-12 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-7xl mx-auto"
                >
                    {project.demo_type === 'video' ? (
                        <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                            <video
                                src={project.demo_video_url}
                                autoPlay muted loop playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group h-[80vh]">
                            <motion.div
                                animate={{ y: ['0%', '-50%'] }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                            <div className="absolute bottom-10 right-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                <MousePointer2 size={14} className="text-[#ffcc00]" />
                                Visualização em Movimento
                            </div>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* SECTION 3: DEEP DIVE */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-12 mb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-3xl"
                            >
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#ffcc00] mb-8">A Narrativa</h2>
                                <h3 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase">A essência do <br />trabalho.</h3>
                                <p className="text-xl md:text-3xl text-neutral-500 dark:text-neutral-400 font-medium leading-[1.3]">
                                    {project.long_description || project.description}
                                </p>
                            </motion.div>
                        </div>

                        {/* Objectives & Results Sidebar-like grid */}
                        <div className="lg:col-span-5 space-y-20">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-10 rounded-[2.5rem] bg-white dark:bg-neutral-900/40 border border-black/5 dark:border-white/5"
                            >
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ffcc00] mb-6">O Desafio</h4>
                                <p className="text-lg font-medium leading-relaxed italic border-l-2 border-[#ffcc00]/30 pl-6">
                                    "{project.problem_solved || 'Resolver a discrepância entre a autoridade da marca e sua presença digital, criando uma interface que transmita confiança imediata.'}"
                                </p>
                            </motion.div>

                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Objetivo Estratégico</h4>
                                    <p className="text-lg font-bold leading-tight">{project.objectives || 'Dominância de nicho através de design exclusivo.'}</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Vantagem Competitiva</h4>
                                    <p className="text-lg font-bold leading-tight">{project.differentials || 'UX focado em conversão de alto valor.'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="grid gap-6">
                                {(Array.isArray(project.developed_items) && project.developed_items.length > 0 ? project.developed_items : [
                                    { title: 'Identidade Visual Digital', description: 'Criação de um sistema visual completo que une minimalismo e sofisticação.' },
                                    { title: 'Engenharia de Conversão', description: 'Desenvolvimento focado em leads qualificados e fluxos de usuário otimizados.' },
                                    { title: 'Animações High-End', description: 'Uso de Framer Motion e Three.js para micro-interações que encantam o usuário.' },
                                    { title: 'Performance Extrema', description: 'Velocidade de carregamento instantânea para garantir a melhor retenção.' }
                                ]).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all duration-700"
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="space-y-3">
                                                <h4 className="text-2xl font-black tracking-tight">{item.title}</h4>
                                                <p className="text-sm text-neutral-500 font-medium leading-relaxed">{item.description}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#ffcc00] group-hover:border-[#ffcc00] transition-all">
                                                <CheckCircle2 className="text-neutral-300 dark:text-neutral-700 group-hover:text-black transition-colors" size={20} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: GALLERY */}
            {project.demo_images && project.demo_images.length > 1 && (
                <section className="py-20 px-6 bg-neutral-50 dark:bg-neutral-900/20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {project.demo_images.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5"
                            >
                                <img src={img} alt={`Gallery ${i}`} className="w-full hover:scale-105 transition-transform duration-1000" />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 5: CTA */}
            <section className="py-48 px-6 relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-[#ffcc00]/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto space-y-12 relative z-10"
                >
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase flex flex-col items-center">
                        PRONTO PARA O <br />
                        <span className="text-[#ffcc00]">PRÓXIMO NÍVEL?</span>
                    </h2>

                    <p className="text-neutral-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Sua marca merece uma presença que reflita sua verdadeira autoridade. Vamos construir algo eterno juntos.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8">
                        <a
                            href={`https://wa.me/5511999999999?text=${encodeURIComponent(project.whatsapp_message || `Olá! Vi o projeto ${project.title || ''} no seu portfólio e gostaria de algo semelhante.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-6 px-14 py-7 bg-[#ffcc00] text-black rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-[#ffcc00]/30 hover:scale-110 active:scale-95 transition-all group"
                        >
                            Manifestar Projeto
                            <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>

                        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 hover:text-white transition-all hover:translate-x-2">
                            Explorar Portfólio
                        </Link>
                    </div>
                </motion.div>
            </section>

            <footer className="py-20 px-6 border-t border-black/5 dark:border-white/5 text-center flex flex-col items-center gap-8">
                <div className="text-2xl font-black tracking-tighter">LOGOS<span className="text-[#ffcc00]">.</span></div>
                <div className="text-[9px] font-black uppercase tracking-[1em] text-neutral-500/50">Digital Craftsmanship & Authority</div>
            </footer>
        </main>
    );

};
