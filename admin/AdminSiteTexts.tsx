
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Layout
} from 'lucide-react';

interface SiteText {
    id: string;
    section: string;
    key: string;
    title: string;
    content: string;
}

export const AdminSiteTexts: React.FC = () => {
    const [texts, setTexts] = useState<SiteText[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchTexts();
    }, []);

    const fetchTexts = async () => {
        const { data, error } = await supabase
            .from('site_texts')
            .select('*')
            .order('section', { ascending: true });

        if (data) setTexts(data);
        setLoading(false);
    };

    const handleUpdate = async (id: string, title: string, content: string) => {
        setSaving(id);
        const { error } = await supabase
            .from('site_texts')
            .update({ title, content, updated_at: new Date() })
            .eq('id', id);

        if (!error) {
            setMessage({ type: 'success', text: 'Conteúdo atualizado com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: 'Erro ao atualizar conteúdo.' });
        }
        setSaving(null);
    };

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#ffcc00]" size={40} />
        </div>
    );

    const sections = Array.from(new Set(texts.map(t => t.section)));

    return (
        <div className="space-y-12 pb-20">
            <div className="flex items-center justify-between sticky top-24 z-40 bg-[#050505]/80 backdrop-blur-md py-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Textos do Site</h1>
                    <p className="text-neutral-500">Gerencie títulos e parágrafos de todas as seções.</p>
                </div>

                {message && (
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                        } animate-in fade-in slide-in-from-top-4 duration-500`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </div>
                )}
            </div>

            <div className="space-y-16">
                {sections.map(section => (
                    <div key={section} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                                <Layout size={20} className="text-neutral-500" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                                Seção: {section}
                            </h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {texts.filter(t => t.section === section).map(text => (
                                <div key={text.id} className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:border-white/10 transition-all">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-4">Chave Identificadora</label>
                                                <div className="bg-white/5 px-6 py-3 rounded-xl inline-block text-[10px] font-mono text-neutral-500 uppercase tracking-widest border border-white/5">
                                                    {text.key}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Título / Label</label>
                                                <input
                                                    type="text"
                                                    defaultValue={text.title}
                                                    onChange={(e) => text.title = e.target.value}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#ffcc00] transition-all font-bold"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Conteúdo Principal</label>
                                                <textarea
                                                    rows={4}
                                                    defaultValue={text.content}
                                                    onChange={(e) => text.content = e.target.value}
                                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-5 px-6 focus:outline-none focus:border-[#ffcc00] transition-all resize-none font-medium text-neutral-300 leading-relaxed"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:w-px bg-white/5" />

                                        <div className="md:w-48 flex items-end">
                                            <button
                                                onClick={() => handleUpdate(text.id, text.title, text.content)}
                                                disabled={saving === text.id}
                                                className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {saving === text.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
