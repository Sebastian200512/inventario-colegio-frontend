import React, { useState, useEffect } from 'react';
import { 
    Package, Plus, Search, AlertCircle, X, 
    CheckCircle2, Trash2, Edit3, PackageOpen, Loader2, Handshake 
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, createLoan } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProductForLoan, setSelectedProductForLoan] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, hasRole } = useAuth();

    const [formProduct, setFormProduct] = useState({
        name: '',
        category: '',
        stock: '',
    });

    const canCreate = hasRole('ADMIN');
    const canEdit   = hasRole('ADMIN', 'COORDINADOR');
    const canDelete = hasRole('ADMIN');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormProduct({ name: '', category: '', stock: '' });
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormProduct({
            name: product.name,
            category: product.category || product.description || '',
            stock: product.stock.toString(),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formProduct);
            } else {
                await createProduct(formProduct);
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            alert('Error al procesar la solicitud en el servidor.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar equipo definitivamente?')) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            alert('Error al eliminar el producto.');
        }
    };

    // Lógica para Docentes: Solicitar Préstamo
    const handleLoanRequest = (product) => {
        setSelectedProductForLoan(product);
        setIsLoanModalOpen(true);
    };

    const confirmLoanRequest = async (e) => {
        e.preventDefault();
        try {
            // El backend solo espera el productId; el userId lo obtiene del Token
            const loanData = {
                productId: selectedProductForLoan.id 
            };
            await createLoan(loanData);
            alert(`¡Solicitud enviada! Has pedido el equipo: ${selectedProductForLoan.name}`);
            setIsLoanModalOpen(false);
        } catch (err) {
            console.error("Error al pedir préstamo:", err.response?.data);
            alert('Error en la solicitud. Asegúrate de que el equipo esté disponible.');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Sección */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Package size={32} className="text-blue-600" /> Inventario Real
                    </h1>
                    <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest mt-1">Sincronizado con PostgreSQL</p>
                </div>
                
                {canCreate && (
                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-slate-900 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
                    >
                        <Plus size={20} /> <span className="uppercase text-sm tracking-widest leading-none pl-1">Nuevo Registro</span>
                    </button>
                )}
            </div>

            {/* Buscador e Indicador */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-slate-700 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="px-5 py-3 bg-blue-50 rounded-xl flex items-center gap-2">
                    <Package className="text-blue-500" size={18} />
                    <span className="text-blue-900 font-black text-sm">{filteredProducts.length} <span className="text-blue-300 uppercase italic">Activos</span></span>
                </div>
            </div>

            {error && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 font-bold">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Listado de Equipos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Consultando Base de Datos...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-300 border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <PackageOpen size={48} className="opacity-20" />
                        <p className="font-bold uppercase text-xs tracking-widest">No hay equipos registrados</p>
                    </div>
                ) : (
                    filteredProducts.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                    <Package size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                    ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {p.stock > 0 ? 'EN STOCK' : 'AGOTADO'}
                                </span>
                            </div>

                            <h3 className="font-black text-slate-800 text-lg uppercase leading-tight mb-1">{p.name}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-6 italic">{p.category || p.description || 'Sin Categoría'}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Existencias</span>
                                    <span className={`text-3xl font-black ${p.stock < 5 ? 'text-amber-500' : 'text-slate-800'}`}>{p.stock}</span>
                                </div>
                                
                                <div className="flex gap-2">
                                    {/* Botón para DOCENTE */}
                                    {hasRole('DOCENTE') && (
                                        <button 
                                            disabled={p.stock <= 0}
                                            onClick={() => handleLoanRequest(p)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all border
                                                ${p.stock > 0 
                                                    ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-slate-900 border-none shadow-lg' 
                                                    : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}`}
                                        >
                                            <Handshake size={16} /> {p.stock > 0 ? 'SOLICITAR' : 'SIN STOCK'}
                                        </button>
                                    )}

                                    {/* Botones para ADMIN/COORD */}
                                    {canEdit && (
                                        <button 
                                            onClick={() => handleEditClick(p)}
                                            title="Editar Equipo"
                                            className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <Edit3 size={20}/>
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button 
                                            onClick={() => handleDelete(p.id)}
                                            title="Eliminar Equipo"
                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Creación/Edición */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
                        <div className="px-10 py-8 bg-blue-600 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-2xl font-black uppercase tracking-tight relative z-10 flex items-center gap-3">
                                {editingProduct ? <Edit3 size={24} /> : <Plus size={24} />}
                                {editingProduct ? 'Editar Equipo' : 'Nuevo Equipo'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-blue-100 hover:text-white transition-colors relative z-10"><X size={28} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Nombre del Dispositivo</label>
                                <input 
                                    type="text" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                                    placeholder="Ej: Video Beam Epson X41"
                                    required 
                                    value={formProduct.name}
                                    onChange={(e) => setFormProduct({...formProduct, name: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Categoría</label>
                                <input 
                                    type="text" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-700 transition-all shadow-inner"
                                    placeholder="Multimedia, Cómputo..."
                                    required 
                                    value={formProduct.category}
                                    onChange={(e) => setFormProduct({...formProduct, category: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">Cantidad Actual</label>
                                <input 
                                    type="number" 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all shadow-inner"
                                    placeholder="0"
                                    required 
                                    value={formProduct.stock}
                                    onChange={(e) => setFormProduct({...formProduct, stock: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
                            >
                                <CheckCircle2 size={24} /> {editingProduct ? 'Guardar Cambios' : 'Registrar en DB'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Solicitud de Préstamo (DOCENTE) */}
            {isLoanModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
                                <Handshake size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">¿Solicitar Equipo?</h2>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8 italic">
                                Se notificará a coordinación tu solicitud para el equipo: <br/> 
                                <span className="text-emerald-600">"{selectedProductForLoan?.name}"</span>
                            </p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={confirmLoanRequest}
                                    className="w-full bg-emerald-600 hover:bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest"
                                >
                                    CONFIRMAR SOLICITUD
                                </button>
                                <button 
                                    onClick={() => setIsLoanModalOpen(false)}
                                    className="w-full bg-slate-100 text-slate-400 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
