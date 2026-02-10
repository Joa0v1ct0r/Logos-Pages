
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 md:py-40 px-6 relative overflow-hidden bg-light dark:bg-dark">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 text-[30rem] font-serif text-black/[0.02] dark:text-white/[0.01] pointer-events-none select-none translate-x-1/3 leading-none">Ω</div>
      <div className="absolute bottom-0 left-0 text-[30rem] font-serif text-black/[0.02] dark:text-white/[0.01] pointer-events-none select-none -translate-x-1/3 leading-none">Α</div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Text Side - High Authority Branding */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-[#ffcc00]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffcc00] dark:text-[#ffcc00]">O Ponto de Inflexão</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-black dark:text-white leading-[0.9]">
                ENTRE EM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] to-[#eab308] dark:from-[#ffcc00] dark:to-[#ffe066]">CONTATO CONOSCO.</span>
              </h2>

              <p className="text-neutral-600 dark:text-neutral-400 text-xl font-light leading-relaxed mb-12 max-w-md">
                Não fazemos apenas sites. Projetamos autoridade digital e transformamos ideias em ativos eternos. O próximo capítulo da sua história começa aqui.
              </p>

              <div className="grid sm:grid-cols-2 gap-10">
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#ffcc00] group-hover:text-black transition-all duration-500">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">WhatsApp</span>
                  </div>
                  <div className="text-lg font-bold text-black dark:text-white">+55 (11) 99999-9999</div>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#ffcc00] group-hover:text-black transition-all duration-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">E-mail</span>
                  </div>
                  <div className="text-lg font-bold text-black dark:text-white">hello@logospages.co</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Side - Minimalist Glassmorphism */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-16 bg-white dark:bg-neutral-900/30 border border-black/[0.05] dark:border-white/[0.05] rounded-[3rem] backdrop-blur-3xl shadow-2xl dark:shadow-none"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          placeholder="Seu Nome"
                          className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 outline-none focus:border-[#ffcc00] dark:focus:border-[#ffcc00] transition-all placeholder:text-neutral-400 text-black dark:text-white font-medium"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-[#ffcc00] transition-all duration-500 group-focus-within:w-full"></div>
                      </div>

                      <div className="relative group">
                        <input
                          type="email"
                          required
                          placeholder="Seu E-mail"
                          className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 outline-none focus:border-[#ffcc00] dark:focus:border-[#ffcc00] transition-all placeholder:text-neutral-400 text-black dark:text-white font-medium"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-[#ffcc00] transition-all duration-500 group-focus-within:w-full"></div>
                      </div>
                    </div>

                    <div className="relative group">
                      <select className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 outline-none focus:border-[#ffcc00] dark:focus:border-[#ffcc00] transition-all text-neutral-500 dark:text-neutral-400 font-medium cursor-pointer appearance-none">
                        <option value="" disabled selected>O que deseja manifestar?</option>
                        <option value="lp">Landing Page de Performance</option>
                        <option value="site">Site Institucional Premium</option>
                        <option value="system">Sistema Customizado</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowRight className="w-4 h-4 rotate-90 opacity-30" />
                      </div>
                    </div>

                    <div className="relative group">
                      <textarea
                        rows={3}
                        placeholder="Conte-nos sobre sua visão..."
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 outline-none focus:border-[#ffcc00] dark:focus:border-[#ffcc00] transition-all placeholder:text-neutral-400 text-black dark:text-white font-medium resize-none"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-[#ffcc00] transition-all duration-500 group-focus-within:w-full"></div>
                    </div>

                    <button
                      type="submit"
                      className="group flex items-center justify-between w-full bg-black dark:bg-white text-white dark:text-black px-10 py-6 rounded-2xl overflow-hidden relative transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,204,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                    >
                      <span className="relative z-10 font-black text-[10px] uppercase tracking-[0.4em]">Manifestar Projeto</span>
                      <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-[#ffcc00] group-hover:text-black transition-all duration-500 group-hover:rotate-45">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-12 h-12 text-[#ffcc00] dark:text-[#ffcc00]" />
                    </div>
                    <h3 className="text-3xl font-bold text-black dark:text-white mb-4">A Palavra foi Lançada.</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xs mx-auto">
                      Sua mensagem foi entregue aos nossos mestres artesãos. Entraremos em contato em breve.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
