import React, { useState, useEffect } from 'react';
import { 
    Users as UserIcon, Plus, Search, Trash2, Edit2, 
    ShieldAlert, X, UserPlus, Fingerprint, CheckCircle2, Loader2 
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { hasRole } = useAuth();

    const [formUser, setFormUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'DOCENTE'
    });

    const isAdmin = hasRole('ADMIN');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormUser({ name: '', email: '', password: '', role: 'DOCENTE' });
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormUser({
            name: user.name,
            email: user.email,
            password: '', // No cargamos contraseña por seguridad
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formUser);
            } else {
                await createUser(formUser);
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (err) {
            alert('Error al procesar la solicitud del usuario.');
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (window.confirm('¿Eliminar usuario del sistema permanentemente?')) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (err) {
                alert('Error al intentar eliminar el usuario.');
            }
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Fingerprint size={32} className="text-indigo-600" /> Control de Personal
                    </h1>
                    <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest mt-1">Gestión de Acceso a la Plataforma</p>
                </div>
                
                {isAdmin && (
                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-slate-900 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                        <UserPlus size={20} /> <span className="uppercase text-sm tracking-widest leading-none">Agregar Nuevo Colaborador</span>
                    </button>
                )}
            </div>

            {/* Buscador */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 placeholder:italic"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="px-5 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                        <UserIcon className="text-indigo-500" size={20} />
                        <span className="text-indigo-900 font-black text-sm">{filteredUsers.length} <span className="text-indigo-300 uppercase italic">Activos</span></span>
                    </div>
                </div>
            </div>

            {/* Grid de Usuarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Cargando Directorio...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30">
                        <ShieldAlert size={48} className="text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No se encontraron colaboradores</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 relative group overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 transition-opacity group-hover:opacity-10 
                                ${user.role === 'ADMIN' ? 'bg-red-500' : user.role === 'COORDINADOR' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white
                                    ${user.role === 'ADMIN' ? 'bg-red-500 shadow-red-100' : user.role === 'COORDINADOR' ? 'bg-indigo-500 shadow-indigo-100' : 'bg-emerald-500 shadow-emerald-100'} shadow-lg`}>
                                    <span className="text-2xl font-black">{user.name.charAt(0)}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-slate-800 font-black text-lg truncate uppercase tracking-tighter leading-none">{user.name}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block
                                        ${user.role === 'ADMIN' ? 'text-red-600 bg-red-50' : user.role === 'COORDINADOR' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8">
                                <p className="text-slate-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 truncate">
                                    <X size={12} className="rotate-45 text-indigo-400" /> {user.email}
                                </p>
                                <p className="text-slate-400 font-bold text-xs flex items-center gap-2 italic">
                                    Personal institucional verificado
                                </p>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-2 justify-end border-t border-slate-100 pt-6">
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                    >
                                        <Edit2 size={20}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Creación / Edición */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
                        <div className="px-10 py-8 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-2xl font-black uppercase tracking-tight relative z-10 flex items-center gap-3">
                                {editingUser ? <Edit2 size={24} /> : <Plus size={24} />}
                                {editingUser ? 'Actualizar Colaborador' : 'Vincular Colaborador'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-indigo-200 hover:text-white transition-colors relative z-10"><X size={28} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                                    placeholder="Ej: Ing. David Salazar"
                                    required 
                                    value={formUser.name}
                                    onChange={(e) => setFormUser({...formUser, name: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Correo Institucional</label>
                                <input 
                                    type="email" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                                    placeholder="correo@colegio.edu.co"
                                    required 
                                    value={formUser.email}
                                    onChange={(e) => setFormUser({...formUser, email: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Rol en Sistema</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 appearance-none shadow-inner"
                                        value={formUser.role}
                                        onChange={(e) => setFormUser({...formUser, role: e.target.value})}
                                    >
                                        <option value="DOCENTE">DOCENTE</option>
                                        <option value="COORDINADOR">COORDINADOR</option>
                                        <option value="ADMIN">ADMINISTRADOR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                                        placeholder={editingUser ? "Dejar en blanco" : "Min. 8 carac."}
                                        required={!editingUser}
                                        value={formUser.password}
                                        onChange={(e) => setFormUser({...formUser, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
                            >
                                <CheckCircle2 size={24} /> {editingUser ? 'CONFIRMAR CAMBIOS' : 'ACTIVAR CUENTA'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
