
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    Plus,
    Trash2,
    Edit3,
    CheckCircle2,
    Loader2,
    X,
    CreditCard,
    Star
} from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    price: string;
    features: string[];
    highlighted: boolean;
    cta_url: string;
    is_active: boolean;
}

export const AdminPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
        name: '',
        price: '',
        features: [],
        highlighted: false,
        cta_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const { data } = await supabase
            .from('plans')
            .select('*')
            .order('created_at', { ascending: true });

        if (data) setPlans(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const planData = { ...currentPlan };
        const id = planData.id;
        delete planData.id;

        if (id) {
            await supabase.from('plans').update(planData).eq('id', id);
        } else {
            await supabase.from('plans').insert([planData]);
        }

        setIsEditing(false);
        fetchPlans();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este plano permanentemente?')) {
            await supabase.from('plans').delete().eq('id', id);
            fetchPlans();
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Planos</h1>
                    <p className="text-neutral-500">Gerencie as ofertas e pacotes de serviços.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentPlan({ name: '', price: '', features: [], highlighted: false, cta_url: '', is_active: true });
                        setIsEditing(true);
                    }}
                    className="bg-[#ffcc00] text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={20} />
                    Novo Plano
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-[#0c0c0c] border rounded-[2.5rem] p-10 relative overflow-hidden transition-all hover:border-white/10 ${plan.highlighted ? 'border-[#ffcc00]/30' : 'border-white/5'}`}>
                        {plan.highlighted && (
                            <div className="absolute top-8 right-8 text-[#ffcc00]">
                                <Star size={24} fill="currentColor" />
                            </div>
                        )}

                        <div className="mb-10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Pacote</div>
                            <h3 className="text-3xl font-black tracking-tight mb-4">{plan.name}</h3>
                            <div className="text-4xl font-black text-[#ffcc00] tracking-tighter">{plan.price}</div>
                        </div>

                        <ul className="space-y-4 mb-10 border-t border-white/5 pt-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-neutral-400 font-medium">
                                    <CheckCircle2 size={16} className="text-[#ffcc00] shrink-0 mt-0.5" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                            <button
                                onClick={() => {
                                    setCurrentPlan(plan);
                                    setIsEditing(true);
                                }}
                                className="flex-1 bg-white/5 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Edit3 size={16} /> Editar
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="p-4 bg-white/5 hover:bg-red-500/10 rounded-xl text-neutral-500 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {!plan.is_active && (
                            <div className="absolute inset-0 bg-[#0c0c0c]/80 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-[#ffcc00] text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Inativo</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(false)} />
                    <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black tracking-tighter">
                                {currentPlan.id ? 'Editar Plano' : 'Novo Plano'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Nome do Plano</label>
                                <input
                                    type="text"
                                    required
                                    value={currentPlan.name}
                                    onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ffcc00] font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Link do Botão (WhatsApp/Checkout)</label>
                                <input
                                    type="text"
                                    value={currentPlan.cta_url}
                                    onChange={(e) => setCurrentPlan({ ...currentPlan, cta_url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:border-red-600 font-medium text-sm"
                                    placeholder="https://wa.me/..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Preço (Ex: R$ 199)</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentPlan.price}
                                        onChange={(e) => setCurrentPlan({ ...currentPlan, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ffcc00] font-bold"
                                    />
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPlan({ ...currentPlan, highlighted: !currentPlan.highlighted })}
                                        className={`flex-1 h-12 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${currentPlan.highlighted ? 'bg-[#ffcc00] text-black' : 'bg-white/5 text-neutral-500'}`}
                                    >
                                        Destaque
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPlan({ ...currentPlan, is_active: !currentPlan.is_active })}
                                        className={`flex-1 h-12 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${currentPlan.is_active ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-neutral-900 text-neutral-700'}`}
                                    >
                                        {currentPlan.is_active ? 'Ativo' : 'Oculto'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Recursos (vírgula)</label>
                                <textarea
                                    rows={3}
                                    value={currentPlan.features?.join(', ')}
                                    onChange={(e) => setCurrentPlan({ ...currentPlan, features: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 resize-none text-sm"
                                    placeholder="Design Responsivo, SEO, Google Maps"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-xl font-bold uppercase text-[9px] tracking-widest bg-white/5 border border-white/5">Cancelar</button>
                                <button type="submit" className="flex-1 bg-white text-black py-4 rounded-xl font-bold uppercase text-[9px] tracking-[0.2em] hover:scale-105 transition-all">Salvar Plano</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
