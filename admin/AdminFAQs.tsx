
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    Plus,
    Trash2,
    Edit3,
    Loader2,
    X,
    HelpCircle,
    ChevronUp,
    ChevronDown
} from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order_index: number;
}

export const AdminFAQs: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ>>({
        question: '',
        answer: '',
        order_index: 0
    });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        const { data } = await supabase
            .from('faqs')
            .select('*')
            .order('order_index', { ascending: true });

        if (data) setFaqs(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const faqData = { ...currentFAQ };
        const id = faqData.id;
        delete faqData.id;

        if (id) {
            await supabase.from('faqs').update(faqData).eq('id', id);
        } else {
            const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order_index)) : 0;
            await supabase.from('faqs').insert([{ ...faqData, order_index: maxOrder + 1 }]);
        }

        setIsEditing(false);
        fetchFaqs();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta pergunta permanentemente?')) {
            await supabase.from('faqs').delete().eq('id', id);
            fetchFaqs();
        }
    };

    const handleMove = async (id: string, direction: 'up' | 'down') => {
        const index = faqs.findIndex(f => f.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === faqs.length - 1) return;

        const newFaqs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        const temp = newFaqs[index];
        newFaqs[index] = newFaqs[targetIndex];
        newFaqs[targetIndex] = temp;

        setFaqs(newFaqs);

        for (let i = 0; i < newFaqs.length; i++) {
            await supabase.from('faqs').update({ order_index: i }).eq('id', newFaqs[i].id);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2">FAQs</h1>
                    <p className="text-neutral-500">Gerencie as perguntas frequentes do site.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentFAQ({ question: '', answer: '', order_index: 0 });
                        setIsEditing(true);
                    }}
                    className="bg-[#ffcc00] text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={20} />
                    Nova Pergunta
                </button>
            </div>

            {loading && !isEditing ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#ffcc00]" size={40} />
                </div>
            ) : (
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-8 group hover:border-white/10 transition-all">
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleMove(faq.id, 'up')} disabled={index === 0} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20"><ChevronUp size={20} /></button>
                                <button onClick={() => handleMove(faq.id, 'down')} disabled={index === faqs.length - 1} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20"><ChevronDown size={20} /></button>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                                <p className="text-neutral-500 text-sm line-clamp-2">{faq.answer}</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentFAQ(faq);
                                        setIsEditing(true);
                                    }}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-neutral-400 hover:text-white transition-all"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-neutral-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(false)} />
                    <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-8 relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter">
                                {currentFAQ.id ? 'Editar FAQ' : 'Nova FAQ'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Pergunta</label>
                                <input
                                    type="text"
                                    required
                                    value={currentFAQ.question}
                                    onChange={(e) => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#ffcc00] font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Resposta</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={currentFAQ.answer}
                                    onChange={(e) => setCurrentFAQ({ ...currentFAQ, answer: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-3xl py-5 px-6 focus:outline-none focus:border-[#ffcc00] resize-none font-medium text-neutral-300"
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest bg-white/5">Cancelar</button>
                                <button type="submit" className="flex-1 bg-white text-black py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all">Salvar FAQ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
