
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { storageService } from '../lib/storage';
import {
    Settings as SettingsIcon,
    Upload,
    Mail,
    Globe,
    Instagram,
    Linkedin,
    Loader2,
    Save,
    Palette
} from 'lucide-react';

interface Settings {
    id: string;
    site_name: string;
    logo_url: string;
    primary_color: string;
    contact_email: string;
    social_links: {
        instagram?: string;
        linkedin?: string;
        behance?: string;
    };
}

export const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<Partial<Settings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('settings').select('*').single();
        if (data) setSettings(data);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('settings')
            .update({
                ...settings,
                updated_at: new Date()
            })
            .eq('id', settings.id);

        setSaving(false);
        if (!error) alert('Configurações salvas!');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await storageService.uploadFile('assets', file);
            setSettings({ ...settings, logo_url: url });
        } catch (err) {
            alert('Erro no upload');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#ffcc00]" /></div>;

    return (
        <div className="space-y-12 pb-20 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Configurações Gerais</h1>
                    <p className="text-neutral-500">Identidade visual e dados de contato do sistema.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Salvar Tudo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <section className="bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] space-y-8">
                        <h3 className="text-xl font-black flex items-center gap-4">
                            <Globe size={24} className="text-[#ffcc00]" /> Identidade Base
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Nome do Site</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Cor Primária</label>
                                <div className="flex gap-4">
                                    <input
                                        type="color"
                                        value={settings.primary_color}
                                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                        className="h-16 w-20 bg-white/5 border border-white/5 rounded-2xl p-2 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.primary_color}
                                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 focus:outline-none font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] space-y-8">
                        <h3 className="text-xl font-black flex items-center gap-4">
                            <Mail size={24} className="text-[#ffcc00]" /> Contato Administrativo
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Email Principal</label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none"
                            />
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section className="bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] space-y-8">
                        <h3 className="text-xl font-black flex items-center gap-4">
                            <Upload size={24} className="text-[#ffcc00]" /> Logo do Sistema
                        </h3>

                        <div className="aspect-square w-full bg-white/5 border border-white/5 border-dashed rounded-[3rem] flex items-center justify-center relative overflow-hidden group">
                            {uploading ? (
                                <Loader2 className="animate-spin" />
                            ) : settings.logo_url ? (
                                <>
                                    <img src={settings.logo_url} className="max-w-[60%] max-h-[60%] object-contain" />
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                        <Upload size={32} />
                                        <input type="file" className="hidden" onChange={handleLogoUpload} />
                                    </label>
                                </>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center gap-3">
                                    <Upload className="text-neutral-700" size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Upload Logo</span>
                                    <input type="file" className="hidden" onChange={handleLogoUpload} />
                                </label>
                            )}
                        </div>
                    </section>

                    <section className="bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] space-y-8">
                        <h3 className="text-xl font-black flex items-center gap-4">
                            <Instagram size={24} className="text-[#ffcc00]" /> Redes Sociais
                        </h3>
                        <div className="space-y-6">
                            <div className="relative">
                                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                <input
                                    placeholder="Instagram URL"
                                    value={settings.social_links?.instagram || ''}
                                    onChange={(e) => setSettings({ ...settings, social_links: { ...settings.social_links, instagram: e.target.value } })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-6 focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                <input
                                    placeholder="LinkedIn URL"
                                    value={settings.social_links?.linkedin || ''}
                                    onChange={(e) => setSettings({ ...settings, social_links: { ...settings.social_links, linkedin: e.target.value } })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-6 focus:outline-none"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
