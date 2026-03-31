import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    getProducts, 
    getLoans, 
    getUsers 
} from '../services/api';
import { 
    Package, Handshake, Users, AlertTriangle, 
    TrendingUp, Clock, ArrowRight, ShieldCheck,
    BookOpen, Send, BarChart3, Loader2
} from 'lucide-react';

// ── Tarjeta de estadística reutilizable ──────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, colorClass, shadowClass }) => (
    <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ${shadowClass} transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`${colorClass} p-3 rounded-2xl text-white`}>
                <Icon size={24} />
            </div>
        </div>
        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{label}</h3>
        <p className="text-4xl font-black text-slate-800 mt-1">{value}</p>
    </div>
);

// ── VISTA ADMIN ──────────────────────────────────────────────────────────────
const AdminDashboard = ({ user, stats, loading, error }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-3 tracking-tighter">Panel Maestro</span>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">¡Hola, {user.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-semibold text-lg mt-1">Control central del inventario escolar</p>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-bold">
                <AlertTriangle size={20} /> {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Equipos Totales" value={loading ? '...' : stats.totalProducts} icon={Package} colorClass="bg-blue-500" shadowClass="shadow-blue-50" />
            <StatCard label="Préstamos Activos" value={loading ? '...' : stats.activeLoans} icon={Handshake} colorClass="bg-indigo-500" shadowClass="shadow-indigo-50" />
            <StatCard label="Stock Crítico" value={loading ? '...' : stats.lowStock} icon={AlertTriangle} colorClass="bg-amber-500" shadowClass="shadow-amber-50" />
            <StatCard label="Usuarios" value={loading ? '...' : stats.totalUsers} icon={Users} colorClass="bg-emerald-500" shadowClass="shadow-emerald-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="text-blue-500" size={22} /> Monitor de Actividad
                    </h2>
                </div>
                {loading ? (
                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-slate-200" size={40} /></div>
                ) : stats.totalProducts === 0 ? (
                    <div className="py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No hay actividad registrada</div>
                ) : (
                    <div className="space-y-3 opacity-50 italic text-sm">
                        * Sincronizado con base de datos real.
                    </div>
                )}
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white">
                <h3 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-400" /> Operaciones Rápidas
                </h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold border border-white/10 flex justify-between items-center group transition-all">
                        Generar Reporte Excel <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold border border-white/10 flex justify-between items-center group transition-all">
                        Auditoría de Stock <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ── VISTA COORDINADOR ────────────────────────────────────────────────────────
const CoordinadorDashboard = ({ user, stats, loading }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-3">Gestión Operativa</span>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">¡Hola, {user.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-semibold text-lg mt-1">Control de stock y entregas del personal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Disponibles" value={loading ? '...' : stats.available} icon={Package} colorClass="bg-indigo-500" shadowClass="shadow-indigo-50" />
            <StatCard label="Entregas Hoy" value={loading ? '... ' : stats.activeLoans} icon={Handshake} colorClass="bg-blue-500" shadowClass="shadow-blue-50" />
            <StatCard label="Alertas" value={loading ? '...' : stats.lowStock} icon={AlertTriangle} colorClass="bg-amber-500" shadowClass="shadow-amber-50" />
        </div>
    </div>
);

// ── VISTA DOCENTE ────────────────────────────────────────────────────────────
const DocenteDashboard = ({ user, stats, loading }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-3">Tu Catálogo</span>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">¡Hola, {user.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-semibold text-lg mt-1">Consulta y solicita equipos para tus clases</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard label="Equipos en Sistema" value={loading ? '...' : stats.totalProducts} icon={BookOpen} colorClass="bg-emerald-500" shadowClass="shadow-emerald-50" />
            <StatCard label="Mis Solicitudes" value={loading ? '...' : stats.myLoans} icon={Send} colorClass="bg-blue-500" shadowClass="shadow-blue-50" />
        </div>
    </div>
);

// ── COMPONENTE PRINCIPAL CON FETCHING REAL ───────────────────────────────────
const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        available: 0,
        activeLoans: 0,
        lowStock: 0,
        totalUsers: 0,
        myLoans: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [productsRes, loansRes, usersRes] = await Promise.all([
                    getProducts(),
                    getLoans(),
                    getUsers()
                ]);

                const products = productsRes.data;
                const loans = loansRes.data;
                const users = usersRes.data;

                setStats({
                    totalProducts: products.length,
                    available: products.filter(p => p.stock > 0).length,
                    activeLoans: loans.length,
                    lowStock: products.filter(p => p.stock < 5).length,
                    totalUsers: users.length,
                    myLoans: loans.filter(l => l.professor === user.name).length
                });
                setError(null);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Error al conectar con el servidor. Verifica que el backend esté corriendo.");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (!user) return null;

    switch (user.role) {
        case 'ADMIN':
            return <AdminDashboard user={user} stats={stats} loading={loading} error={error} />;
        case 'COORDINADOR':
            return <CoordinadorDashboard user={user} stats={stats} loading={loading} error={error} />;
        case 'DOCENTE':
            return <DocenteDashboard user={user} stats={stats} loading={loading} error={error} />;
        default:
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <AlertTriangle size={48} className="text-amber-400" />
                    <p className="font-black text-slate-600 uppercase tracking-wider">Rol: {user.role}</p>
                </div>
            );
    }
};

export default Dashboard;
