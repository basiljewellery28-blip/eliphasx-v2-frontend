import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import QuoteBuilder from './components/QuoteBuilder/QuoteBuilder';
import ClientManager from './components/ClientManager/ClientManager';
import ClientProfile from './components/ClientManager/ClientProfile';
import AdminPanel from './components/Admin/AdminPanel';
import SysAdminDashboard from './components/Admin/SysAdminDashboard';
import UserProfile from './components/User/UserProfile';
import BillingPage from './components/Billing/BillingPage';
import OrganizationSettings from './components/Billing/OrganizationSettings';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import AcceptInvite from './components/Auth/AcceptInvite';
import OrganizationDashboard from './components/Organization/OrganizationDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useApp();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
};

// Wrapper for QuoteBuilder to force remount on URL change
const QuoteBuilderWrapper = () => {
    const location = useLocation();
    return <QuoteBuilder key={location.pathname + location.search} />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />
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
                        <QuoteBuilderWrapper />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quote/:id"
                element={
                    <ProtectedRoute>
                        <QuoteBuilderWrapper />
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
                path="/clients/:id"
                element={
                    <ProtectedRoute>
                        <ClientProfile />
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
                path="/org-dashboard"
                element={
                    <ProtectedRoute>
                        <OrganizationDashboard />
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
            <Route
                path="/billing"
                element={
                    <ProtectedRoute>
                        <BillingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organization"
                element={
                    <ProtectedRoute>
                        <OrganizationSettings />
                    </ProtectedRoute>
                }
            />
            <Route path="/legal/terms" element={<TermsOfService />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route
                path="/sysadmin"
                element={
                    <ProtectedRoute>
                        <SysAdminDashboard />
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
