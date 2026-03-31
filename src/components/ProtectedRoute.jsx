import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * - Sin usuario: redirige a /login
 * - Con usuario pero sin rol permitido: redirige a /dashboard
 * - allowedRoles vacío = cualquier usuario autenticado puede entrar
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
