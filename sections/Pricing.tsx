
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
    <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 bg-white dark:bg-neutral-950/50 transition-colors duration-700">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
        <h2 className="text-3xl md:text-6xl font-extrabold tracking-tighter mb-3 md:mb-4 text-black dark:text-white">INVESTIMENTO.</h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-medium">Transparência e valor em cada pixel entregue.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${plan.highlighted
              ? 'border-[#00f2ff] bg-[#00f2ff]/5 dark:bg-[#00f2ff]/5 shadow-xl shadow-[#00f2ff]/5 order-first lg:order-none'
              : 'border-black/[0.05] dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/40'
              } flex flex-col transition-all duration-700`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 bg-[#00f2ff] rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-black whitespace-nowrap">
                Recomendado
              </div>
            )}

            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-black dark:text-white">{plan.name}</h3>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 md:mb-4 text-[#00f2ff] dark:text-white">{plan.price}</div>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed font-medium">
                {plan.name === 'Essencial' ? 'Ideal para Landing Pages de alta conversão e lançamentos.' :
                  plan.name === 'Premium' ? 'O padrão ouro para sites institucionais que transmitem autoridade.' :
                    'Sistemas web sob medida para automatizar e escalar seu negócio.'}
              </p>
            </div>

            <div className="flex-grow space-y-3 md:space-y-4 mb-8 md:mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlighted
                    ? 'bg-[#00f2ff]/10 text-[#00f2ff] dark:bg-[#00f2ff]/20 dark:text-[#00f2ff]'
                    : 'bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40'
                    }`}>
                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <a
              href={plan.cta_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center ${plan.highlighted
                ? 'bg-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/20'
                : 'bg-black dark:bg-white text-white dark:text-black'
                }`}
            >
              Escolher Plano
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
