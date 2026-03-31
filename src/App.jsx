import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login     from './components/Login';
import Layout    from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Loans     from './components/Loans';
import Users     from './components/Users';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* ── Ruta pública ────────────────────────────────────── */}
                    <Route path="/login" element={<Login />} />

                    {/* ── Rutas protegidas (Layout como shell) ────────────── */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Redirección raíz → /dashboard */}
                        <Route index element={<Navigate to="/dashboard" replace />} />

                        {/* Todos los roles autenticados */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="loans"     element={<Loans />} />

                        {/* Solo ADMIN */}
                        <Route
                            path="users"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* ── Cualquier URL desconocida → login ───────────────── */}
                    <Route path="*" element={<Navigate to="/login" replace />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
