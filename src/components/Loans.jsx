import React, { useState, useEffect } from 'react';
import { 
    Calendar, Clock, CheckCircle2, XCircle, 
    ArrowRightCircle, History, Package, Loader2, RefreshCw 
} from 'lucide-react';
import { getLoans, updateLoanStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, hasRole } = useAuth();
    
    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const response = await getLoans();
            setLoans(response.data);
        } catch (err) {
            console.error("Error al cargar préstamos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        const confirmMsg = status === 'Aprobado' ? '¿Aprobar préstamo y restar stock?' : 
                          status === 'Devuelto' ? '¿Marcar como devuelto y recuperar stock?' : 
                          '¿Rechazar solicitud?';
        
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateLoanStatus(id, { status });
            alert(`Acción completada: ${status}`);
            fetchLoans(); // Recargar para ver cambios
        } catch (err) {
            alert('Error al actualizar el estado del préstamo.');
        }
    };

    const isAdminOrCoord = hasRole('ADMIN', 'COORDINADOR');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                        <Clock className="text-indigo-600" size={32} /> Gestión de Préstamos
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Sistema de aprobación y retorno de activos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Listado Principal */}
                <div className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-slate-100">
                            <Loader2 className="animate-spin text-indigo-500" size={40} />
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest leading-none">Actualizando Historial...</p>
                        </div>
                    ) : loans.length === 0 ? (
                        <div className="py-20 flex flex-col items-center gap-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 italic">
                            <History className="text-slate-200" size={64} />
                            <p className="text-slate-400 font-bold uppercase text-xs">No hay solicitudes registradas</p>
                        </div>
                    ) : (
                        loans.map((loan) => (
                            <div key={loan.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-xl transition-all group overflow-hidden relative">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black
                                            ${loan.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-600' : 
                                              loan.status === 'Rechazado' ? 'bg-red-50 text-red-600' : 
                                              loan.status === 'Devuelto' ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-600'}`}>
                                            {(loan.professor || '?').charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg leading-tight uppercase truncate max-w-[200px]">
                                                {loan.equipment || 'Desconocido'}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                ID: #{loan.id} · Por: <span className="text-indigo-600">{loan.professor || 'S/N'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <span className="block text-[10px] font-black italic text-slate-400 uppercase">Solicitud</span>
                                            <span className="font-black text-slate-700 text-sm whitespace-nowrap">{loan.date}</span>
                                        </div>

                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${loan.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                              loan.status === 'Rechazado' ? 'bg-red-50 text-red-600 border-red-100' : 
                                              loan.status === 'Devuelto' ? 'bg-slate-50 text-slate-400 border-slate-100' : 
                                              'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {loan.status}
                                        </div>

                                        {/* ACCIONES (Solo Admin/Coord) */}
                                        {isAdminOrCoord && (
                                            <div className="flex gap-2 border-l border-slate-100 pl-4">
                                                {loan.status === 'Pendiente' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAction(loan.id, 'Aprobado')}
                                                            title="Aprobar (Resta Stock)"
                                                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <CheckCircle2 size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(loan.id, 'Rechazado')}
                                                            title="Rechazar"
                                                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </>
                                                )}
                                                {loan.status === 'Aprobado' && (
                                                    <button 
                                                        onClick={() => handleAction(loan.id, 'Devuelto')}
                                                        title="Devolver (Suma Stock)"
                                                        className="flex items-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-black text-xs uppercase"
                                                    >
                                                        <RefreshCw size={16} /> Devolver
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar Estadísticas */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
                        <ArrowRightCircle className="absolute top-0 right-0 p-4 opacity-10 rotate-12" size={160} />
                        <h2 className="font-black text-lg uppercase tracking-tight relative z-10 leading-none mb-1">Total Pendientes</h2>
                        <span className="text-6xl font-black relative z-10">{loans.filter(l => l.status === 'Pendiente').length}</span>
                        <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Espera de Acción</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <History size={24} className="text-indigo-500" /> Mi Actividad
                        </h2>
                        <div className="space-y-4">
                            {loans.slice(0, 3).map((l, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="font-black text-slate-700 text-[10px] uppercase truncate">{l.equipment}</h4>
                                    <p className={`text-[10px] font-bold mt-1 uppercase ${l.status === 'Aprobado' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {l.status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loans;
