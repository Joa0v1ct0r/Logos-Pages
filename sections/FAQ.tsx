
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data) {
        setFaqs(data);
      }
      setLoading(false);
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-neutral-500 animate-pulse font-bold tracking-widest uppercase text-xs">Carregando Dúvidas...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-16 text-center">DÚVIDAS FREQUENTES.</h2>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.id}
              className={`border border-white/5 rounded-3xl transition-all duration-500 overflow-hidden ${openId === item.id ? 'bg-white/5 border-white/10' : 'hover:bg-white/[0.02]'}`}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full px-8 py-8 flex items-center justify-between text-left"
              >
                <span className="text-lg md:text-xl font-bold pr-8">{item.question}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shrink-0 transition-transform duration-500 ${openId === item.id ? 'rotate-180 bg-white text-black' : ''}`}>
                  {openId === item.id ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 pt-0 text-neutral-400 text-lg leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

