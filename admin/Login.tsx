
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
            {/* Background patterns */}
            <div className="fixed inset-0 grainy opacity-20 pointer-events-none" />
            <div className="fixed inset-0 divinte-pattern opacity-10 pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ffcc00] text-black rounded-[2rem] mb-8 shadow-2xl shadow-[#ffcc00]/30">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-4">LOGOS ADMIN</h1>
                    <p className="text-neutral-500 font-medium">Acesso restrito ao painel de controle.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#ffcc00] transition-colors" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail Administrativo"
                            required
                            className="w-full bg-[#0c0c0c] border border-white/5 rounded-3xl py-6 pl-16 pr-8 focus:outline-none focus:border-[#ffcc00]/50 transition-all font-bold placeholder:text-neutral-700"
                        />
                    </div>

                    <div className="relative group">
                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#ffcc00] transition-colors" size={18} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha de Acesso"
                            required
                            className="w-full bg-[#0c0c0c] border border-white/5 rounded-3xl py-6 pl-16 pr-8 focus:outline-none focus:border-[#ffcc00]/50 transition-all font-bold placeholder:text-neutral-700"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center rounded-2xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Validando...' : (
                            <>
                                Entrar no Sistema
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-12 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                    Build for Eternity • Logos Pages Digital
                </p>
            </div>
        </div>
    );
};
