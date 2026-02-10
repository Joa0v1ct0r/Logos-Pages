
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    Briefcase,
    CreditCard,
    Calendar,
    TrendingUp,
    Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        projectsCount: 0,
        plansCount: 0,
        lastUpdate: 'Carregando...'
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const { count: pCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { count: plCount } = await supabase.from('plans').select('*', { count: 'exact', head: true });

        setStats({
            projectsCount: pCount || 0,
            plansCount: plCount || 0,
            lastUpdate: new Date().toLocaleDateString('pt-BR')
        });
    };

    const cards = [
        {
            label: 'Projetos no Portfólio',
            value: stats.projectsCount,
            icon: <Briefcase className="text-[#ffcc00]" />,
            color: 'bg-[#ffcc00]/10'
        },
        {
            label: 'Planos Ativos',
            value: stats.plansCount,
            icon: <CreditCard className="text-blue-500" />,
            color: 'bg-blue-500/10'
        },
        {
            label: 'Última Modificação',
            value: stats.lastUpdate,
            icon: <Clock className="text-orange-500" />,
            color: 'bg-orange-500/10'
        },
        {
            label: 'Status do Sistema',
            value: 'Online',
            icon: <TrendingUp className="text-green-500" />,
            color: 'bg-green-500/10'
        },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Visão Geral</h1>
                <p className="text-neutral-500">Bem-vindo à central de controle da Logos Pages.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
                        <div className={`p-4 rounded-2xl w-fit mb-6 ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className="text-3xl font-black mb-1">{card.value}</div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{card.label}</div>

                        {/* Subtle background glow */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[60px] opacity-20 ${card.color}`} />
                    </div>
                ))}
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-[3rem] p-10">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                    <Calendar size={24} className="text-[#ffcc00]" />
                    Atividades Recentes
                </h2>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-default">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                <Clock size={18} className="text-neutral-500" />
                            </div>
                            <div>
                                <div className="font-bold">Alteração nos textos do Hero</div>
                                <div className="text-sm text-neutral-500">Realizada há {i * 2} horas por Admin</div>
                            </div>
                            <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-neutral-700">Ver detalhes</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
