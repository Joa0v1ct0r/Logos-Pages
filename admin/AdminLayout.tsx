
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    CreditCard,
    Settings,
    LogOut,
    Globe,
    Menu,
    X,
    HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
        { label: 'Textos do Site', href: '/admin/texts', icon: <FileText size={20} /> },
        { label: 'Portfólio', href: '/admin/portfolio', icon: <Briefcase size={20} /> },
        { label: 'Planos', href: '/admin/plans', icon: <CreditCard size={20} /> },
        { label: 'Dúvidas', href: '/admin/faqs', icon: <HelpCircle size={20} /> },
        { label: 'Configurações', href: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-['Plus_Jakarta_Sans']">
            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-0 z-[100] bg-[#0c0c0c] border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-12">
                        <div className={`font-black tracking-tighter text-2xl transition-opacity ${!isSidebarOpen && 'md:opacity-0'}`}>
                            LOGOS<span className="text-[#ffcc00]">.</span>ADMIN
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.href}
                                end
                                className={({ isActive }) => `
                  flex items-center gap-4 p-4 rounded-2xl transition-all group
                  ${isActive ? 'bg-[#ffcc00] text-black shadow-lg shadow-[#ffcc00]/20' : 'text-neutral-500 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className={`font-bold text-sm tracking-tight transition-opacity duration-300 ${!isSidebarOpen && 'md:opacity-0 w-0'}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/5">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-4 p-4 w-full text-neutral-500 hover:text-white transition-all mb-2"
                        >
                            <Globe size={20} />
                            <span className={`font-bold text-sm tracking-tight ${!isSidebarOpen && 'md:opacity-0 w-0'}`}>Ver Site</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 p-4 w-full text-red-500/50 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                            <span className={`font-bold text-sm tracking-tight ${!isSidebarOpen && 'md:opacity-0 w-0'}`}>Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-white/5 bg-[#0c0c0c]/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-[90]">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Administrador</div>
                            <div className="text-sm font-bold">Logos Agency</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#ffcc00] flex items-center justify-center font-bold text-lg text-black">
                            L
                        </div>
                    </div>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
