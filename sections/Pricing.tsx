
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Plan {
  id: string;
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted: boolean;
  cta_url: string;
  is_active: boolean;
}

export const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setPlans(data);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 bg-white dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-neutral-500 animate-pulse font-bold tracking-widest uppercase text-xs">Carregando Planos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 bg-white dark:bg-dark relative overflow-hidden transition-colors duration-1000">
      {/* Constellation Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-0.5 h-0.5 bg-[#00f2ff] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "auto", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="inline-flex items-center gap-3 mb-6 overflow-hidden whitespace-nowrap"
          >
            <span className="w-8 h-px bg-[#00f2ff]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f2ff]">Arquitetura de Valor</span>
            <span className="w-8 h-px bg-[#00f2ff]"></span>
          </motion.div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-black dark:text-white leading-none relative">
            {"INVESTIMENTO.".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                className="inline-block"
              >
                {char === "." ? <span className="text-[#00f2ff]">{char}</span> : char}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-neutral-500 dark:text-neutral-500 text-sm md:text-lg font-medium max-w-xl mx-auto"
          >
            Conectando pontos de luz para formar a imagem do seu sucesso.
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 relative z-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 1,
              delay: 0.5 + (index * 0.2),
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
            className={`relative p-8 md:p-10 rounded-[2.5rem] border group backdrop-blur-[2px] w-full md:max-w-[380px] ${plan.highlighted
              ? 'border-[#00f2ff]/50 bg-white dark:bg-[#00f2ff]/5 shadow-[0_0_50px_rgba(0,242,255,0.05)] z-20'
              : 'border-black/[0.05] dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/40'
              } flex flex-col overflow-hidden transition-colors duration-500`}
          >
            {/* Cardinal Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00f2ff]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {plan.highlighted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00f2ff] rounded-full text-[8px] font-black uppercase tracking-widest text-black shadow-lg shadow-[#00f2ff]/20"
              >
                ESTRELA GUIA
              </motion.div>
            )}

            <div className="mb-6 relative">
              <h3 className="text-xl font-black mb-1 text-black dark:text-white uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-[#00f2ff]">{plan.price}</span>
                <span className="text-neutral-400 text-[8px] font-bold uppercase tracking-widest ml-1">BRL</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium line-clamp-2">
                {plan.name === 'Essencial' ? 'Para marcas que buscam uma entrada fulminante e estética pura.' :
                  plan.name === 'Premium' ? 'Nossa obra-prima em termos de experiência imersiva e conversão.' :
                    'Engenharia de precisão para ecossistemas digitais de alta complexidade.'}
              </p>
            </div>

            <div className="flex-grow space-y-3 mb-8">
              {plan.features.slice(0, 6).map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + (index * 0.1) + (i * 0.05) }}
                  className="flex items-start gap-3 text-[12px] text-neutral-600 dark:text-neutral-300 font-medium"
                >
                  <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#00f2ff]' : 'text-neutral-400'}`} strokeWidth={3} />
                  <span className="truncate">{feature}</span>
                </motion.div>
              ))}
            </div>

            <a
              href={plan.cta_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-[0.97] flex items-center justify-center gap-2 group/btn ${plan.highlighted
                ? 'bg-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/10'
                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                }`}
            >
              Iniciar Plano
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-neutral-400 dark:text-neutral-600 text-[10px] font-bold uppercase tracking-[0.5em]">Tudo incluído. Sem taxas ocultas.</p>
      </div>
    </section >
  );
};
