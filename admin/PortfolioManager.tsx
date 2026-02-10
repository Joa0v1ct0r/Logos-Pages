
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    ImageIcon,
    Loader2,
    Upload,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { storageService } from '../lib/storage';
import { Project } from '../types';



export const PortfolioManager: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        long_description: '',
        technologies: [],
        is_active: true,
        cover_image_url: '',
        project_url: '',
        status: 'Public',
        demo_type: 'scroll',
        demo_video_url: '',
        demo_images: [],
        developed_items: [],
        whatsapp_message: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('order_index', { ascending: true });

        if (data) setProjects(data);
        setLoading(false);
    };

    const handleMove = async (id: string, direction: 'up' | 'down') => {
        const index = projects.findIndex(p => p.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === projects.length - 1) return;

        const newProjects = [...projects];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap positions
        const temp = newProjects[index];
        newProjects[index] = newProjects[targetIndex];
        newProjects[targetIndex] = temp;

        // Update in state immediately for UX
        setProjects(newProjects);

        // Update in DB
        const updates = newProjects.map((p, i) => ({
            id: p.id,
            order_index: i
        }));

        for (const update of updates) {
            await supabase.from('projects').update({ order_index: update.order_index }).eq('id', update.id);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storageService.uploadFile('portfolio', file);
            setCurrentProject(prev => ({ ...prev, cover_image_url: url }));
        } catch (err) {
            console.error(err);
            alert('Erro no upload');
        } finally {
            setUploading(false);
        }
    };

    const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const urls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const url = await storageService.uploadFile('portfolio', files[i]);
                urls.push(url);
            }
            setCurrentProject(prev => ({
                ...prev,
                demo_images: [...(prev.demo_images || []), ...urls]
            }));
        } catch (err) {
            console.error(err);
            alert('Erro no upload das imagens');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const projectData = { ...currentProject };
        const id = projectData.id;
        delete projectData.id;

        if (id) {
            await supabase.from('projects').update(projectData).eq('id', id);
        } else {
            // Get max order index
            const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order_index)) : 0;
            await supabase.from('projects').insert([{ ...projectData, order_index: maxOrder + 1 }]);
        }

        setIsEditing(false);
        fetchProjects();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este projeto permanentemente?')) {
            await supabase.from('projects').delete().eq('id', id);
            fetchProjects();
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Portfólio</h1>
                    <p className="text-neutral-500">Gerencie os projetos exibidos na vitrine.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentProject({
                            title: '',
                            slug: '',
                            subtitle: '',
                            description: '',
                            long_description: '',
                            technologies: [],
                            is_active: true,
                            cover_image_url: '',
                            project_url: '',
                            status: 'Public',
                            demo_type: 'scroll',
                            developed_items: []
                        });
                        setIsEditing(true);
                    }}
                    className="bg-[#ffcc00] text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={20} />
                    Novo Projeto
                </button>
            </div>

            {loading && !isEditing ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#ffcc00]" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={project.id} className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all">
                            <div className="aspect-video bg-neutral-900 relative">
                                {project.cover_image_url ? (
                                    <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-neutral-800">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-6 right-6">
                                    {project.is_active ?
                                        <span className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 backdrop-blur-md">Ativo</span> :
                                        <span className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 backdrop-blur-md">Inativo</span>
                                    }
                                </div>

                                {/* Reorder Controls Overlay */}
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleMove(project.id, 'up')}
                                        disabled={index === 0}
                                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-20 disabled:hover:bg-black/60 disabled:hover:text-white"
                                    >
                                        <ChevronUp size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleMove(project.id, 'down')}
                                        disabled={index === projects.length - 1}
                                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-20 disabled:hover:bg-black/60 disabled:hover:text-white"
                                    >
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                <p className="text-neutral-500 text-sm line-clamp-2 mb-6">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.technologies?.map(t => (
                                        <span key={t} className="text-[9px] font-bold text-neutral-400 bg-white/5 px-3 py-1 rounded-lg uppercase tracking-wider">{t}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCurrentProject(project);
                                                setIsEditing(true);
                                            }}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-neutral-400 hover:text-white transition-all"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-neutral-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    {project.project_url && (
                                        <a href={project.project_url} target="_blank" rel="noreferrer" className="p-3 text-neutral-500 hover:text-white transition-all">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(false)} />
                    <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-5xl rounded-[2.5rem] p-8 relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter">
                                {currentProject.id ? 'Editar Projeto' : 'Novo Projeto'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="p-3 hover:bg-white/5 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* BASIC INFO */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#ffcc00] border-b border-[#ffcc00]/20 pb-2">Informações Básicas</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Título do Projeto</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentProject.title}
                                                onChange={(e) => {
                                                    const title = e.target.value;
                                                    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                                    setCurrentProject({ ...currentProject, title, slug });
                                                }}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#ffcc00] transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Slug (URL)</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentProject.slug}
                                                onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-mono text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Subtítulo / Contexto</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Landing Page focada em conversão"
                                            value={currentProject.subtitle}
                                            onChange={(e) => setCurrentProject({ ...currentProject, subtitle: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Descrição Curta (Card)</label>
                                        <textarea
                                            rows={2}
                                            value={currentProject.description}
                                            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#ffcc00] transition-all resize-none font-medium text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Status do Case</label>
                                            <select
                                                value={currentProject.status}
                                                onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value as any })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                            >
                                                <option value="Public" className="bg-[#0c0c0c]">Público</option>
                                                <option value="Private" className="bg-[#0c0c0c]">Privado</option>
                                                <option value="Confidential" className="bg-[#0c0c0c]">Confidencial</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Visibilidade Site</label>
                                            <select
                                                value={currentProject.is_active ? 'true' : 'false'}
                                                onChange={(e) => setCurrentProject({ ...currentProject, is_active: e.target.value === 'true' })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                            >
                                                <option value="true" className="bg-[#0c0c0c]">Ativo</option>
                                                <option value="false" className="bg-[#0c0c0c]">Oculto</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Tecnologias (vírgula)</label>
                                        <input
                                            type="text"
                                            placeholder="React, ThreeJS, Supabase"
                                            value={currentProject.technologies?.join(', ')}
                                            onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                {/* VISUAL DEMO */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#ffcc00] border-b border-[#ffcc00]/20 pb-2">Demonstração Visual</h3>

                                    <div className="space-y-4">
                                        <div className="aspect-video bg-white/5 border border-white/5 border-dashed rounded-[2rem] relative flex items-center justify-center overflow-hidden group">
                                            {uploading ? (
                                                <Loader2 className="animate-spin text-[#ffcc00]" />
                                            ) : currentProject.cover_image_url ? (
                                                <>
                                                    <img src={currentProject.cover_image_url} className="w-full h-full object-cover" />
                                                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <Upload size={24} />
                                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                                    </label>
                                                </>
                                            ) : (
                                                <label className="cursor-pointer flex flex-col items-center gap-2">
                                                    <Upload className="text-neutral-500" />
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Capa do Projeto</span>
                                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                                </label>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Tipo de Demo</label>
                                                <select
                                                    value={currentProject.demo_type}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, demo_type: e.target.value as any })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                                >
                                                    <option value="scroll" className="bg-[#0c0c0c]">Scroll de Imagem</option>
                                                    <option value="video" className="bg-[#0c0c0c]">Vídeo (Autoplay)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">URL do Site Principal</label>
                                                <input
                                                    type="url"
                                                    value={currentProject.project_url}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, project_url: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        {currentProject.demo_type === 'video' ? (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">URL do Vídeo (.mp4)</label>
                                                <input
                                                    type="text"
                                                    value={currentProject.demo_video_url}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, demo_video_url: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all font-mono text-xs"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between ml-4">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Imagens do Case (Scroll)</label>
                                                    <label className="text-[10px] font-bold text-[#ffcc00] uppercase cursor-pointer hover:text-white transition-colors">
                                                        + Enviar Imagens
                                                        <input type="file" multiple className="hidden" onChange={handleMultipleImagesUpload} accept="image/*" />
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto p-2 bg-white/5 rounded-2xl border border-white/5">
                                                    {currentProject.demo_images?.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                                            <img src={img} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const images = [...(currentProject.demo_images || [])];
                                                                    images.splice(idx, 1);
                                                                    setCurrentProject({ ...currentProject, demo_images: images });
                                                                }}
                                                                className="absolute inset-0 bg-[#ffcc00]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={14} className="text-black" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* HIDING CASE STUDY DETAILS AS PER USER REQUEST TO SIMPLIFY */}
                            {/* <div className="space-y-6 pt-6 border-t border-white/5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#ffcc00] border-b border-[#ffcc00]/20 pb-2">Conteúdo Detalhado (Opcional)</h3>
                                ...
                            </div> */}

                            <div className="flex gap-4 pt-10 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-white/5 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest border border-white/5 hover:bg-[#ffcc00]/10 hover:text-[#ffcc00] transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading && !uploading}
                                    className="flex-1 bg-white text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {currentProject.id ? 'Salvar Projeto' : 'Publicar Agora'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
