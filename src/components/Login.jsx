import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [form, setForm]       = useState({ email: '', password: '' });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const navigate              = useNavigate();
    const { login }             = useAuth();

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await loginRequest(form);
            // data = { token, user: { id, name, email, role } }
            login(data.user, data.token);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al conectar con el servidor.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-900 mb-6">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">ESTUDIO<span className="text-blue-400">PRO</span></h1>
                    <p className="text-slate-400 font-semibold mt-2 uppercase text-xs tracking-widest">Sistema de Inventario Escolar</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                    <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Iniciar Sesión</h2>
                        <p className="text-slate-400 text-sm font-semibold mt-1">Ingresa con tu correo institucional</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="font-semibold text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Correo</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="usuario@colegio.edu.co"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-semibold text-slate-700 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-semibold text-slate-700 transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider mt-2"
                        >
                            {loading
                                ? <><Loader2 size={22} className="animate-spin" /> Verificando...</>
                                : 'Ingresar al Sistema'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs font-bold mt-8 uppercase tracking-widest">
                    Colegio San Antonio © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default Login;
