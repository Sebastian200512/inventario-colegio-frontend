import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, Handshake,
    Users as UsersIcon, LogOut, Menu, X,
    UserCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mapa de colores por rol
const ROLE_STYLES = {
    ADMIN:        { badge: 'bg-red-100 text-red-700',     dot: 'bg-red-500',     avatar: 'bg-red-500' },
    COORDINADOR:  { badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', avatar: 'bg-indigo-500' },
    DOCENTE:      { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', avatar: 'bg-emerald-500' },
};

const Layout = () => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const roleStyle = ROLE_STYLES[user?.role] || ROLE_STYLES.DOCENTE;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // Menú — visible según rol
    const navItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/dashboard',
            show: true,
        },
        {
            icon: Package,
            label: user?.role === 'DOCENTE' ? 'Catálogo' : 'Inventario',
            path: '/inventory',
            show: true,
        },
        {
            icon: Handshake,
            label: user?.role === 'DOCENTE' ? 'Mis Préstamos' : 'Préstamos',
            path: '/loans',
            show: true,
        },
        {
            icon: UsersIcon,
            label: 'Usuarios',
            path: '/users',
            show: hasRole('ADMIN'),          // Solo ADMIN ve Usuarios
        },
    ].filter(item => item.show);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
            <aside className={`
                ${collapsed ? 'w-[72px]' : 'w-64'}
                flex flex-col bg-white border-r border-slate-200 shadow-sm
                transition-all duration-300 ease-in-out shrink-0
            `}>
                {/* Header sidebar */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
                    {!collapsed && (
                        <span className="font-black text-lg text-blue-600 tracking-tight">
                            ESTUDIO<span className="text-slate-400">PRO</span>
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors ml-auto"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Perfil de usuario */}
                <div className={`px-4 py-4 border-b border-slate-100 ${collapsed ? 'flex justify-center' : ''}`}>
                    <div className={`flex items-center gap-3 ${collapsed ? '' : 'bg-slate-50 p-3 rounded-2xl'}`}>
                        <div className={`w-10 h-10 ${roleStyle.avatar} rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0`}>
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden">
                                <p className="font-black text-slate-800 text-sm truncate leading-tight">{user?.name}</p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${roleStyle.badge}`}>
                                    {user?.role}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                                ${collapsed ? 'justify-center' : ''}
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Cerrar sesión */}
                <div className="px-3 py-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Cerrar sesión' : undefined}
                        className={`flex items-center gap-3 w-full px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!collapsed && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Colegio San Antonio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${roleStyle.dot}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {user?.role} · Sesión Activa
                        </span>
                    </div>
                </header>

                {/* Contenido de la ruta */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
