import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import QuoteBuilder from './components/QuoteBuilder/QuoteBuilder';
import ClientManager from './components/ClientManager/ClientManager';
import AdminPanel from './components/Admin/AdminPanel';
import UserProfile from './components/User/UserProfile';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useApp();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quote/new"
                element={
                    <ProtectedRoute>
                        <QuoteBuilder />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quote/:id"
                element={
                    <ProtectedRoute>
                        <QuoteBuilder />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/clients"
                element={
                    <ProtectedRoute>
                        <ClientManager />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

function App() {
    return (
        <AppProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AppProvider>
    );
}

export default App;
