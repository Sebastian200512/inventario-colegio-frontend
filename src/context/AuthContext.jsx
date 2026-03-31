import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Al iniciar la app: restaurar sesión desde localStorage
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('auth_token');
            const savedUser  = localStorage.getItem('auth_user');
            if (savedToken && savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            }
        } catch (e) {
            // datos corruptos → limpiar
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        } finally {
            setLoading(false);
        }
    }, []);

    /** Llama esto al iniciar sesión */
    const login = (userData, authToken) => {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
    };

    /** Cierra sesión y limpia todo */
    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
    };

    /** True si hay token y usuario cargado */
    const isAuthenticated = Boolean(token && user);

    /** True si el usuario tiene el rol indicado */
    const hasRole = (...roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    // No renderiza nada hasta que se resuelva la lectura del localStorage
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
};
