
import React, { useEffect, useState, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

// Landing Page Components
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { Portfolio } from './sections/Portfolio';
import { Pricing } from './sections/Pricing';
import { FAQ } from './sections/FAQ';
import { Contact } from './sections/Contact';
import { LogosSequence } from './components/LogosSequence';
import { IntroAnimation } from './components/IntroAnimation';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { Login } from './admin/Login';
import { PortfolioManager } from './admin/PortfolioManager';
import { AdminSiteTexts } from './admin/AdminSiteTexts';
import { AdminPlans } from './admin/AdminPlans';
import { AdminSettings } from './admin/AdminSettings';
import { AdminFAQs } from './admin/AdminFAQs';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">Validando Acesso...</div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

// --- LANDING PAGE WRAPPER ---
const LandingPage = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [600, 1000], [0, 1]);
  const smoothNavbarOpacity = useSpring(navbarOpacity, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = (this as any).getAttribute('href')?.substring(1);
        const element = document.getElementById(targetId || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }, []);

  return (
    <main className="relative bg-light dark:bg-dark text-dark dark:text-white selection:bg-[#ffcc00]/30 min-h-screen">
      <div className="fixed inset-0 grainy z-[100] pointer-events-none" />
      <div className="fixed inset-0 divine-pattern z-[1] opacity-50 pointer-events-none" />

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20 dark:opacity-20">
        <div className="absolute top-[10%] left-[-5%] w-[40%] aspect-square border border-black/[0.03] dark:border-white/[0.03] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] aspect-square border border-black/[0.03] dark:border-white/[0.03] rounded-full" />
      </div>

      <div className="relative z-10">
        <motion.div style={{ opacity: smoothNavbarOpacity }} className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
          <div className="pointer-events-auto">
            <Navbar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
          </div>
        </motion.div>

        <CustomCursor />

        <LogosSequence isDark={isDark}>
          <Hero />
        </LogosSequence>

        <div className="relative z-20 bg-light dark:bg-dark">
          <Portfolio />
          <Services />
          <Pricing />
          <FAQ />
          <Contact />

          <footer className="py-20 px-6 border-t border-black/5 dark:border-white/5 text-center bg-white/40 dark:bg-black/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                <div className="flex flex-col items-center md:items-start">
                  <div className="text-3xl font-black tracking-tighter mb-2">LOGOS PAGES.</div>
                  <div className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Built for Eternity.</div>
                </div>

                <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                  <a href="#" className="hover:text-[#ffcc00] dark:hover:text-white transition-all hover:-translate-y-1">Instagram</a>
                  <a href="#" className="hover:text-[#ffcc00] dark:hover:text-white transition-all hover:-translate-y-1">LinkedIn</a>
                  <a href="#" className="hover:text-[#ffcc00] dark:hover:text-white transition-all hover:-translate-y-1">Behance</a>
                </div>
              </div>

              <div className="text-neutral-600 dark:text-neutral-700 text-[10px] font-medium uppercase tracking-widest">
                © {new Date().getFullYear()} Logos Pages Digital. A luz brilha nas trevas.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/portfolio" element={
        <ProtectedRoute>
          <AdminLayout>
            <PortfolioManager />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Placeholder routes for future scaling */}
      <Route path="/admin/plans" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPlans />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/texts" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminSiteTexts />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/faqs" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminFAQs />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
