
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { LogosLogo } from './LogosLogo';

interface NavbarProps {
  toggleTheme: () => void;
  isDark: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDark }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Serviços', href: '#services' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Preços', href: '#pricing' },
    { label: 'Contato', href: '#contact' },
  ];

  return (
    <>
      {/* TOP HORIZONTAL NAVBAR - LEFT ALIGNED */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 md:py-8 flex items-center justify-between bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-black/[0.05] dark:border-white/[0.05]"
      >
        <div className="flex items-center gap-12 md:gap-20">
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-2 md:gap-4 group cursor-pointer">
            <LogosLogo className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-white transition-transform duration-1000 group-hover:rotate-[360deg]" />
            <div className="text-xl md:text-2xl font-black tracking-tighter text-black dark:text-white">
              LOGOS.
            </div>
          </div>

          {/* DESKTOP NAVIGATION LINKS - LEFT ALIGNED */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-[#ffcc00] dark:hover:text-white transition-all relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#ffcc00] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-orange-500" />}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <button className="hidden md:block px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-black/10 dark:shadow-none">
            Iniciar Legado
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-[90] bg-white dark:bg-black pt-32 px-10"
          >
            <div className="flex flex-col gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-extrabold tracking-tighter text-black dark:text-white"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
